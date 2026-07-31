// SidePanel - the injectable assistant shell. Presents in five modes (floating /
// sidebar / fullscreen / bottomsheet / embedded) and lays out Header / Body / Footer
// regions in a flex column. Kernel owns the CHROME: the mode geometry (the existing
// .krnl-panel--* rules), the region layout, the body fade-scrim, and the sidebar
// resize handle + drag. The consumer fills the slots and owns mode STATE; for the
// bottom sheet it measures its own content and feeds the height back via
// sheetHeight / sheetFull (that content-measurement is consumer-specific).
//
// Compound parts: SidePanel.Header / SidePanel.Body / SidePanel.Footer. Body is the
// scrollable region (forwardRef + onScroll + an `overlay` slot for absolutely-
// positioned extras like a jump-to-latest button); Footer is display:contents so its
// children flex as direct panel rows (no extra box).
//
// DRAWER (optional). Pass `drawer` and the panel content is wrapped in a slider that
// translates right to reveal a navigation layer underneath — SidePanel.DrawerBody /
// SidePanel.DrawerFooter give it a scrolling list with a sticky bottom row. The wrap
// is rendered ONLY when `drawer` OR `cover` is supplied, so a plain consumer gets
// exactly the DOM it had before. Two structural notes:
//   - .krnl-panel-stage owns the CLIPPING, not the panel: .krnl-panel--sidebar must
//     stay overflow:visible so the -16px resize handle isn't cut off, and the handle
//     is a SIBLING of the stage, outside its clip. Deliberate: the handle stays
//     operable while the cover is open, so dragging the sidebar wider can flip a
//     settings surface from drill-down to rail live, with nothing unmounting.
//   - while open the slider carries a transform, which makes it a containing block for
//     any position:fixed descendant. Nothing in the panel is fixed today; keep it that
//     way (portal instead). Closed state is transform:none, so the containing block
//     only exists while the drawer is out.
//
// COVER (optional). Pass `cover` for a layer that fills the PANEL rectangle — never
// the viewport — above both the content and the drawer. Use it instead of a Dialog
// when the consumer must not cover the host application the panel is injected into (a
// viewport-centred Dialog blanks the whole host behind a narrow docked panel).
// SidePanel.CoverHeader / SidePanel.CoverBody compose the region. It is a labelled
// `region`, not role="dialog": the host page behind the panel stays fully reachable
// and there is no focus trap, so aria-modal would misdescribe it.
const React = window.React;

export const SidePanel = React.forwardRef(function SidePanel(
  { mode = 'sidebar', width, onWidth, minWidth = 360, maxWidth, sheetHeight, sheetFull,
    drawer, drawerOpen = false, onDrawerOpenChange, drawerWidth, drawerPeek,
    drawerLabel = 'Menu', drawerId,
    cover, coverOpen = false, onCoverOpenChange, coverLabel = 'Panel cover', coverId,
    className = '', style, children, ...rest }, ref) {
  const startResize = (e) => {
    e.preventDefault(); e.stopPropagation();
    const max = maxWidth != null ? maxWidth : Math.min(900, Math.round(window.innerWidth * 0.7));
    const onMove = (ev) => onWidth && onWidth(Math.max(minWidth, Math.min(max, window.innerWidth - ev.clientX)));
    const onUp = () => {
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };
  const geo = mode === 'sidebar' && width != null ? { width }
    : mode === 'bottomsheet' && sheetHeight != null ? { height: sheetHeight + 'px' }
    : null;

  const open    = !!drawer && !!drawerOpen;
  const covered = !!cover  && !!coverOpen;
  const staged  = !!drawer || !!cover;   // the stage now renders for EITHER
  /* Escape bubbles up from whatever inside has focus, so a listener on the stage is
     enough — no window listener, no cross-instance leakage. Cover takes priority: it
     is the topmost layer, and a consumer's own onKeyDown inside it (e.g. "Escape goes
     back a level") is a DESCENDANT, so its stopPropagation still pre-empts this one. */
  const onStageKeyDown = (e) => {
    if (e.key !== 'Escape') return;
    if (covered) { e.stopPropagation(); onCoverOpenChange && onCoverOpenChange(false); return; }
    if (open)    { e.stopPropagation(); onDrawerOpenChange && onDrawerOpenChange(false); }
  };
  /* `inert` is set IMPERATIVELY on the DOM node, never as a JSX prop. This component
     runs under React 19 (Kernel/Storybook) and React 18.2 (the greenhouse UMD bundle),
     and every JSX form breaks on one of them — verified in both, not assumed:
       inert=""      → React 19 treats it as FALSE. Protection silently absent.
       inert={true}  → React 18 does not know `inert` as a boolean attribute, so it
                       DROPS it entirely. Silently, because production strips the warning.
       inert={false} → React 18 emits inert="false"; HTML boolean attributes are
                       presence-based, so the content would be permanently inert.
       inert="true"  → works on both, but React 19 warns about a string on a boolean attr.
     Setting the property sidesteps React's attribute handling on both versions.
     Before the effect runs, the closed drawer is still covered by visibility:hidden,
     which already takes it out of the a11y tree and the tab order.

     Open state: the slid-away content goes inert — NOT aria-hidden, since it is still
     visible (peeking) and aria-hidden on visible content is a WCAG failure. When the
     cover is up too, it fully occludes the slider (unlike the drawer's peek), so
     aria-hidden's WCAG problem no longer applies there — but the conclusion is
     unchanged: aria-hidden does not remove focusables from the tab order (and a
     focusable inside aria-hidden is itself an ARIA violation), and display:none would
     destroy layout — in bottomsheet mode the panel HEIGHT is measured from the
     slider's children, so it would collapse the sheet to nothing behind the cover and
     remount the transcript. inert is the only correct answer in both cases.
     This must stay ONE effect covering drawer + cover: a second effect would race —
     whichever ran last wins, and the drawer effect's `slider.inert = open` (false)
     would silently un-inert the slider UNDER the cover. */
  const drawerElRef = React.useRef(null);
  const sliderElRef = React.useRef(null);
  const coverElRef = React.useRef(null);
  React.useEffect(() => {
    if (drawerElRef.current) drawerElRef.current.inert = covered || !open;
    if (sliderElRef.current) sliderElRef.current.inert = covered ||  open;
  }, [open, covered, drawer, cover]);

  /* Focus the cover REGION itself (tabIndex=-1), not its first focusable: this puts
     the screen-reader cursor at the top so coverLabel is announced and reading starts
     at the title, without skipping a leading back button. A consumer that wants a
     specific control focused declares its own effect on the same `coverOpen` state —
     parent effects run AFTER child effects, so the consumer's effect always wins. */
  React.useEffect(() => {
    if (covered && coverElRef.current) coverElRef.current.focus({ preventScroll: true });
  }, [covered]);

  const body = !staged ? children : (
    <div className="krnl-panel-stage" onKeyDown={onStageKeyDown}
      style={{
        '--krnl-drawer-req': drawerWidth != null ? drawerWidth + 'px' : undefined,
        '--krnl-drawer-peek': drawerPeek != null ? drawerPeek + 'px' : undefined,
      }}>
      {drawer && (
        <aside ref={drawerElRef} className="krnl-drawer" id={drawerId} aria-label={drawerLabel}>{drawer}</aside>
      )}
      <div ref={sliderElRef} className="krnl-panel-slider">{children}</div>
      {open && !covered && (
        <button type="button" className="krnl-panel-scrim" aria-label={`Close ${drawerLabel}`}
          onClick={() => onDrawerOpenChange && onDrawerOpenChange(false)} />
      )}
      {covered && (
        <section ref={coverElRef} tabIndex={-1} className="krnl-panel-cover"
          id={coverId} aria-label={coverLabel}>{cover}</section>
      )}
    </div>
  );

  return (
    <div ref={ref}
      className={`krnl-panel krnl-panel--${mode}${mode === 'bottomsheet' && sheetFull ? ' is-sheetfull' : ''} ${className}`.trim()}
      data-drawer-open={open || undefined} data-cover-open={covered || undefined}
      style={{ ...geo, ...style }} {...rest}>
      {mode === 'sidebar' && <div className="krnl-resize" onMouseDown={startResize} title="Drag to resize"><span /></div>}
      {body}
    </div>
  );
});

SidePanel.Header = function SidePanelHeader({ className = '', children, ...rest }) {
  return <div className={`krnl-header ${className}`.trim()} {...rest}>{children}</div>;
};

SidePanel.Body = React.forwardRef(function SidePanelBody({ onScroll, overlay, className = '', children, ...rest }, ref) {
  return (
    <div className="krnl-body-wrap">
      <div ref={ref} className={`krnl-body ${className}`.trim()} onScroll={onScroll} {...rest}>{children}</div>
      <div className="krnl-body-scrim" aria-hidden="true" />
      {overlay}
    </div>
  );
});

SidePanel.Footer = function SidePanelFooter({ children }) {
  // display:contents: the footer rows (context, composer) participate in the panel's
  // flex column directly, so no extra box changes the geometry.
  return <div className="krnl-panel-foot" style={{ display: 'contents' }}>{children}</div>;
};

// Drawer regions — the same Body/Footer split as the panel itself, so a long history
// list scrolls while the account row stays pinned to the bottom of the drawer.
SidePanel.DrawerBody = React.forwardRef(function SidePanelDrawerBody({ className = '', children, ...rest }, ref) {
  return <div ref={ref} className={`krnl-drawer-body ${className}`.trim()} {...rest}>{children}</div>;
});

SidePanel.DrawerFooter = function SidePanelDrawerFooter({ className = '', children, ...rest }) {
  return <div className={`krnl-drawer-foot ${className}`.trim()} {...rest}>{children}</div>;
};

// Cover regions. CoverBody clips (overflow:hidden) by default, NOT auto: the cover
// typically hosts a sub-layout that owns its own scrolling (e.g. a two-pane drill
// track wider than the box), and overflow:auto there would raise a spurious
// horizontal scrollbar. `scroll` opts into a plain scrolling column instead.
SidePanel.CoverHeader = function SidePanelCoverHeader({ className = '', children, ...rest }) {
  return <div className={`krnl-cover-head ${className}`.trim()} {...rest}>{children}</div>;
};

SidePanel.CoverBody = React.forwardRef(function SidePanelCoverBody({ scroll, className = '', children, ...rest }, ref) {
  return (
    <div ref={ref} className={`krnl-cover-body${scroll ? ' krnl-cover-body--scroll' : ''} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
});

export const meta = {
  SidePanel: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['assistant shell', 'side panel', 'overlay panel', 'navigation drawer', 'in-panel settings surface'],
    keywords: ['sidepanel', 'panel', 'shell', 'drawer', 'sidebar', 'sheet', 'overlay', 'assistant', 'navigation', 'slide-away', 'cover', 'settings', 'takeover'],
    summary: 'Injectable assistant shell: five modes (floating/sidebar/fullscreen/bottomsheet/embedded) laying out Header / Body / Footer, with an optional slide-away navigation drawer underneath and an optional in-panel cover above everything.',
    props: [
      { name: 'mode', class: 'dsPresentation', values: ['floating', 'sidebar', 'fullscreen', 'bottomsheet', 'embedded'], default: 'sidebar', description: 'How the panel is presented / anchored.' },
      { name: 'width', class: 'dsPresentation', type: 'number', description: 'Sidebar-mode width in px (controlled); the resize handle updates it via onWidth.' },
      { name: 'onWidth', class: 'event', type: '(px) => void', description: 'Fires while the sidebar resize handle is dragged, with the new width.' },
      { name: 'minWidth', class: 'dsPresentation', type: 'number', default: '360', description: 'Lower clamp for the sidebar resize.' },
      { name: 'maxWidth', class: 'dsPresentation', type: 'number', description: 'Upper clamp for the sidebar resize (default min(900, 70vw)).' },
      { name: 'sheetHeight', class: 'dsPresentation', type: 'number', description: 'Bottom-sheet height in px; the consumer measures its content and feeds it in.' },
      { name: 'sheetFull', class: 'dsPresentation', type: 'bool', description: 'Bottom-sheet has reached the fullscreen takeover threshold.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'SidePanel.Header / SidePanel.Body / SidePanel.Footer.' },
      { name: 'drawer', class: 'content', type: 'ReactNode', description: 'Navigation content revealed underneath when the panel content slides right. Supplying it enables the drawer layer; omit it and the panel renders exactly as before. Use SidePanel.DrawerBody / SidePanel.DrawerFooter inside it for a scrolling list with a sticky bottom row.' },
      { name: 'drawerOpen', class: 'dsPresentation', type: 'bool', default: 'false', description: 'Whether the drawer is revealed (controlled). The panel content translates right by the drawer width.' },
      { name: 'onDrawerOpenChange', class: 'event', type: '(open: boolean) => void', description: 'Fires when the drawer requests a close — the scrim over the peeking content is clicked, or Escape is pressed inside the drawer.' },
      { name: 'drawerWidth', class: 'dsPresentation', type: 'number', default: '320', description: 'Requested drawer width in px. Clamped to (panel width − drawerPeek), so a narrow sidebar or phone gets a near-full-width drawer with the content peeking instead.' },
      { name: 'drawerPeek', class: 'dsPresentation', type: 'number', default: '56', description: 'Minimum strip of panel content left visible when the drawer is open; the clamp floor for drawerWidth.' },
      { name: 'drawerLabel', class: 'a11y', type: 'string', default: 'Menu', description: 'Accessible name for the drawer region and its close scrim.' },
      { name: 'drawerId', class: 'a11y', type: 'string', description: 'id on the drawer region, so an external toggle can point at it with aria-controls.' },
      { name: 'cover', class: 'content', type: 'ReactNode', description: 'A layer that fills the PANEL rectangle (never the viewport), above both the content and the drawer. Supplying it enables the cover layer; omit it and the panel renders exactly as before. Use for a settings / management surface an injected assistant must not cover the host application with. Compose SidePanel.CoverHeader + SidePanel.CoverBody inside it.' },
      { name: 'coverOpen', class: 'dsPresentation', type: 'bool', default: 'false', description: 'Whether the cover is up (controlled). While open the panel content and the drawer are set inert — non-interactive, out of the tab order and out of the a11y tree — and the drawer scrim is not rendered.' },
      { name: 'onCoverOpenChange', class: 'event', type: '(open: boolean) => void', description: 'Fires when the cover requests a close — Escape pressed inside it. The cover takes Escape before the drawer; a consumer that needs Escape to mean "go back a level" stops propagation on its own descendant handler.' },
      { name: 'coverLabel', class: 'a11y', type: 'string', default: 'Panel cover', description: 'Accessible name for the cover region. The cover is a labelled region, NOT role="dialog": it covers the panel but the host page behind stays reachable and there is no focus trap, so aria-modal would misdescribe it. Render the CoverHeader title as a heading with the same text.' },
      { name: 'coverId', class: 'a11y', type: 'string', description: 'id on the cover region, so an external trigger can point at it with aria-controls.' },
    ],
    anatomy: [
      { name: 'Header', required: false, description: 'The top bar region (SidePanel.Header).' },
      { name: 'Body', required: true, description: 'The scrollable content region with a fade-scrim (SidePanel.Body); forwards a ref + onScroll + an overlay slot.' },
      { name: 'Footer', required: false, description: 'Non-scrolling bottom rows (SidePanel.Footer), e.g. a context chip + composer.' },
      { name: 'Resize', required: false, description: 'The drag handle, auto-rendered in sidebar mode.' },
      { name: 'Drawer', required: false, description: 'The slide-away navigation layer under the panel content (the `drawer` prop).' },
      { name: 'DrawerBody', required: false, description: 'Scrolling region inside the drawer (SidePanel.DrawerBody).' },
      { name: 'DrawerFooter', required: false, description: 'Sticky bottom row of the drawer, e.g. an account / settings trigger (SidePanel.DrawerFooter).' },
      { name: 'Scrim', required: false, description: 'Click-to-close overlay on the peeking content while the drawer is open.' },
      { name: 'Cover', required: false, description: 'A layer filling the panel rectangle above the content and the drawer (the `cover` prop); the panel-scoped alternative to a viewport-filling Dialog.' },
      { name: 'CoverHeader', required: false, description: 'Non-scrolling top row of the cover — back control, title, trailing actions (SidePanel.CoverHeader).' },
      { name: 'CoverBody', required: false, description: 'The cover content region (SidePanel.CoverBody); clips by default (overflow:hidden) since the cover typically hosts a sub-layout that owns its own scrolling — pass `scroll` to make it a plain scrolling column instead.' },
    ],
    related: ['Dialog', 'Popover', 'Box'],
    composes: [],
    usage: '<SidePanel mode="sidebar" width={w} onWidth={setW}\n  drawer={<><SidePanel.DrawerBody>…history…</SidePanel.DrawerBody><SidePanel.DrawerFooter><Account/></SidePanel.DrawerFooter></>}\n  drawerOpen={navOpen} onDrawerOpenChange={setNavOpen} drawerId="nav"\n  cover={coverOpen ? <><SidePanel.CoverHeader><h2>Settings</h2></SidePanel.CoverHeader><SidePanel.CoverBody>…</SidePanel.CoverBody></> : null}\n  coverOpen={coverOpen} onCoverOpenChange={setCoverOpen} coverId="settings">\n  <SidePanel.Header>…</SidePanel.Header>\n  <SidePanel.Body ref={bodyRef} onScroll={onScroll} overlay={<JumpToLatest/>}>…</SidePanel.Body>\n  <SidePanel.Footer><Composer/></SidePanel.Footer>\n</SidePanel>',
  },
};
