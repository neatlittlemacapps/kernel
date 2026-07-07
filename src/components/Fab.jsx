// Fab - a floating action button: a single, persistent, high-emphasis action
// anchored over the UI (the Juglans launcher is the canonical use). A distinct
// leaf atom rather than an IconButton variant - its shape, elevation, border and
// optional attention pulse differ enough that reusing .krnl-iconbtn would fight it.
// Renders its own control (like Btn/IconButton), styled through .krnl-* tokens.
const React = window.React;

// Fab - `children` is the icon/mark; `pulse` adds the token-driven attention ring.
// Give it an aria-label (icon-only). forwardRef so it can anchor an overlay trigger.
export const Fab = React.forwardRef(function Fab({ pulse, className = '', children, ...rest }, ref) {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production' && !rest['aria-label'] && !rest['aria-labelledby'])
    console.warn('Fab: icon-only button needs an aria-label (or aria-labelledby) for an accessible name.');
  // type="button" is required: a bare <button> defaults to type=submit, and the Fab
  // floats fixed above host forms, so a click would submit them.
  return (
    <button ref={ref} type="button" className={`krnl-fab ${className}`.trim()} {...rest}>
      {pulse ? <span className="krnl-fab-pulse" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});

export const meta = {
  Fab: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Action',
    usecases: ['floating action', 'persistent launcher'],
    keywords: ['fab', 'floating', 'launcher', 'action-button', 'floating-action'],
    summary: 'Floating action button for one persistent, high-emphasis action.',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The icon or mark shown in the button (e.g. an AIBadge or an Icon).' },
      { name: 'pulse', class: 'dsPresentation', type: 'bool', description: 'Adds the token-driven attention pulse ring (e.g. to promote a new capability).' },
      { name: 'aria-label', class: 'a11y', type: 'string', description: 'Accessible name; required since the Fab is icon-only.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'HTMLButtonElement.disabled' },
    ],
    bestPractices: [
      { do: true, text: 'Use exactly one Fab per surface for the single most important standing action; always give it an aria-label.' },
      { do: false, text: 'Stack multiple Fabs or use one for a routine action - it is the loudest control on the screen.' },
    ],
    anatomy: [
      { name: 'Button', required: true, description: 'The circular floating control.' },
      { name: 'Pulse', required: false, description: 'An optional attention ring behind the mark.' },
    ],
    related: ['IconButton'],
    composes: [],
    usage: '<Fab aria-label="Open assistant"><AIBadge size={24} /></Fab>',
  },
};
