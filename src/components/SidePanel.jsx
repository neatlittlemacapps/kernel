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
const React = window.React;

export const SidePanel = React.forwardRef(function SidePanel(
  { mode = 'sidebar', width, onWidth, minWidth = 360, maxWidth, sheetHeight, sheetFull,
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
  return (
    <div ref={ref}
      className={`krnl-panel krnl-panel--${mode}${mode === 'bottomsheet' && sheetFull ? ' is-sheetfull' : ''} ${className}`.trim()}
      style={{ ...geo, ...style }} {...rest}>
      {mode === 'sidebar' && <div className="krnl-resize" onMouseDown={startResize} title="Drag to resize"><span /></div>}
      {children}
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

export const meta = {
  SidePanel: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['assistant shell', 'side panel', 'overlay panel'],
    keywords: ['sidepanel', 'panel', 'shell', 'drawer', 'sidebar', 'sheet', 'overlay', 'assistant'],
    summary: 'Injectable assistant shell: five modes (floating/sidebar/fullscreen/bottomsheet/embedded) laying out Header / Body / Footer.',
    props: [
      { name: 'mode', class: 'dsPresentation', values: ['floating', 'sidebar', 'fullscreen', 'bottomsheet', 'embedded'], default: 'sidebar', description: 'How the panel is presented / anchored.' },
      { name: 'width', class: 'dsPresentation', type: 'number', description: 'Sidebar-mode width in px (controlled); the resize handle updates it via onWidth.' },
      { name: 'onWidth', class: 'event', type: '(px) => void', description: 'Fires while the sidebar resize handle is dragged, with the new width.' },
      { name: 'minWidth', class: 'dsPresentation', type: 'number', default: '360', description: 'Lower clamp for the sidebar resize.' },
      { name: 'maxWidth', class: 'dsPresentation', type: 'number', description: 'Upper clamp for the sidebar resize (default min(900, 70vw)).' },
      { name: 'sheetHeight', class: 'dsPresentation', type: 'number', description: 'Bottom-sheet height in px; the consumer measures its content and feeds it in.' },
      { name: 'sheetFull', class: 'dsPresentation', type: 'bool', description: 'Bottom-sheet has reached the fullscreen takeover threshold.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'SidePanel.Header / SidePanel.Body / SidePanel.Footer.' },
    ],
    anatomy: [
      { name: 'Header', required: false, description: 'The top bar region (SidePanel.Header).' },
      { name: 'Body', required: true, description: 'The scrollable content region with a fade-scrim (SidePanel.Body); forwards a ref + onScroll + an overlay slot.' },
      { name: 'Footer', required: false, description: 'Non-scrolling bottom rows (SidePanel.Footer), e.g. a context chip + composer.' },
      { name: 'Resize', required: false, description: 'The drag handle, auto-rendered in sidebar mode.' },
    ],
    related: ['Dialog', 'Popover', 'Box'],
    composes: [],
    usage: '<SidePanel mode="sidebar" width={w} onWidth={setW}>\n  <SidePanel.Header>…</SidePanel.Header>\n  <SidePanel.Body ref={bodyRef} onScroll={onScroll} overlay={<JumpToLatest/>}>…</SidePanel.Body>\n  <SidePanel.Footer><Composer/></SidePanel.Footer>\n</SidePanel>',
  },
};
