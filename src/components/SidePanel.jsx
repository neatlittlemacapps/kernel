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
// is rendered ONLY when `drawer` is supplied, so drawer-less consumers get exactly the
// DOM they had before. Two structural notes:
//   - .krnl-panel-stage owns the CLIPPING, not the panel: .krnl-panel--sidebar must
//     stay overflow:visible so the -16px resize handle isn't cut off, and the handle
//     is a SIBLING of the stage, outside its clip.
//   - while open the slider carries a transform, which makes it a containing block for
//     any position:fixed descendant. Nothing in the panel is fixed today; keep it that
//     way (portal instead). Closed state is transform:none, so the containing block
//     only exists while the drawer is out.
const React = window.React;

export const SidePanel = React.forwardRef(function SidePanel(
  { mode = 'sidebar', width, onWidth, minWidth = 360, maxWidth, sheetHeight, sheetFull,
    drawer, drawerOpen = false, onDrawerOpenChange, drawerWidth, drawerPeek,
    drawerLabel = 'Menu', drawerId,
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

  const open = !!drawer && !!drawerOpen;
  /* Escape bubbles up from whatever inside the drawer has focus, so a listener on the
     stage is enough — no window listener, no cross-instance leakage. */
  const onStageKeyDown = (e) => {
    if (e.key === 'Escape' && open) { e.stopPropagation(); onDrawerOpenChange && onDrawerOpenChange(false); }
  };
  /* `inert` must be CONDITIONALLY SPREAD, never passed a falsy value. This component runs
     under React 19 (Kernel/Storybook) and React 18.2 (the greenhouse UMD bundle), and the
     two disagree about every other form:
       inert=""      → React 19 treats it as FALSE, silently dropping the protection.
       inert={false} → React 18 emits inert="false"; HTML boolean attributes are
                       presence-based, so the content would be permanently inert.
     Spreading `{ inert: true }` or nothing works on both: React 19 sets the real boolean,
     React 18 emits inert="true", and the absent case emits no attribute at all.
     Closed drawer: inert + visibility:hidden (the widely-supported belt). Open: the
     slid-away content goes inert — NOT aria-hidden, since it's still visible (peeking)
     and aria-hidden on visible content is a WCAG failure. */
  const inertIf = (on) => (on ? { inert: true } : null);
  const body = !drawer ? children : (
    <div className="krnl-panel-stage" onKeyDown={onStageKeyDown}
      style={{
        '--krnl-drawer-req': drawerWidth != null ? drawerWidth + 'px' : undefined,
        '--krnl-drawer-peek': drawerPeek != null ? drawerPeek + 'px' : undefined,
      }}>
      <aside className="krnl-drawer" id={drawerId} aria-label={drawerLabel} {...inertIf(!open)}>{drawer}</aside>
      <div className="krnl-panel-slider" {...inertIf(open)}>{children}</div>
      {open && (
        <button type="button" className="krnl-panel-scrim" aria-label={`Close ${drawerLabel}`}
          onClick={() => onDrawerOpenChange && onDrawerOpenChange(false)} />
      )}
    </div>
  );

  return (
    <div ref={ref}
      className={`krnl-panel krnl-panel--${mode}${mode === 'bottomsheet' && sheetFull ? ' is-sheetfull' : ''} ${className}`.trim()}
      data-drawer-open={open || undefined}
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

export const meta = {
  SidePanel: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['assistant shell', 'side panel', 'overlay panel', 'navigation drawer'],
    keywords: ['sidepanel', 'panel', 'shell', 'drawer', 'sidebar', 'sheet', 'overlay', 'assistant', 'navigation', 'slide-away'],
    summary: 'Injectable assistant shell: five modes (floating/sidebar/fullscreen/bottomsheet/embedded) laying out Header / Body / Footer, with an optional slide-away navigation drawer underneath.',
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
    ],
    related: ['Dialog', 'Popover', 'Box'],
    composes: [],
    usage: '<SidePanel mode="sidebar" width={w} onWidth={setW}\n  drawer={<><SidePanel.DrawerBody>…history…</SidePanel.DrawerBody><SidePanel.DrawerFooter><Account/></SidePanel.DrawerFooter></>}\n  drawerOpen={navOpen} onDrawerOpenChange={setNavOpen} drawerId="nav">\n  <SidePanel.Header>…</SidePanel.Header>\n  <SidePanel.Body ref={bodyRef} onScroll={onScroll} overlay={<JumpToLatest/>}>…</SidePanel.Body>\n  <SidePanel.Footer><Composer/></SidePanel.Footer>\n</SidePanel>',
  },
};
