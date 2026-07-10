// Card - the neutral base card (Fluent-aligned). Owns the wrapper: surface +
// border (appearance), and the states - rest / hover / pressed / focus / selected /
// dragging / disabled - so specialised cards (patient cards, answer cards, setting
// cards) just compose it and fill the slots. Interactive when `interactive` is set
// (renders a real <button>); selectable via `selected`; a `floatingAction` slot
// pins a control top-right. Slots: Card.Preview / Card.Header / Card.Body / Card.Footer.
//
// Token-styled via .krnl-card* (the base class = the `filled` look). Not a Base UI
// primitive (Base UI ships no card); a hand-rolled leaf on tokens.
const React = window.React;

// tone: a named status (info/success/warning/error) maps to its token; any other
// string is passed through as a colour (or a var). Sets --card-tone + [data-tone]
// (the tinted treatment). PatientCard sets --card-tone itself and omits `tone`.
const STATUS_TONES = ['info', 'success', 'warning', 'error'];
const toneVar = (tone) => tone == null ? undefined
  : STATUS_TONES.includes(tone) ? `var(--status-${tone}-solid)` : tone;

export const Card = React.forwardRef(function Card(
  { appearance = 'filled', orientation = 'vertical', size = 'md', tone,
    selected, interactive, disabled, dragging, floatingAction, as,
    onClick, className = '', style, children, ...rest }, ref) {
  // Interactive (a real <button>) is opt-in via `interactive` only - NOT implied by
  // onClick. A specialised card that must stay a non-button element (e.g. PatientCard,
  // which contains a heading + nested controls) composes Card with `as` + its own
  // onClick/role, and never trips button-in-button.
  const clickable = !!interactive;
  const cls = [
    'krnl-card',
    appearance !== 'filled' && `krnl-card--${appearance}`,
    orientation === 'horizontal' && 'krnl-card--horizontal',
    size !== 'md' && `krnl-card--${size}`,
    clickable && 'krnl-card--interactive',
    className,
  ].filter(Boolean).join(' ');
  const tc = toneVar(tone);
  const Tag = clickable ? 'button' : (as || 'div');
  return (
    <Tag ref={ref} type={clickable ? 'button' : undefined}
      className={cls} onClick={onClick} disabled={clickable ? disabled : undefined}
      style={tc ? { '--card-tone': tc, ...style } : style}
      data-selected={selected || undefined} data-dragging={dragging || undefined}
      data-tone={tone != null ? '' : undefined}
      data-disabled={(!clickable && disabled) || undefined}
      aria-pressed={clickable && selected !== undefined ? !!selected : undefined}
      {...rest}>
      {floatingAction ? <div className="krnl-card-floataction">{floatingAction}</div> : null}
      {children}
    </Tag>
  );
});

// media region (edge-to-edge image / figure)
Card.Preview = function CardPreview({ className = '', children, ...rest }) {
  return <div className={`krnl-card-preview ${className}`.trim()} {...rest}>{children}</div>;
};

// header row - leading (icon/avatar), title + description, trailing action
Card.Header = function CardHeader({ leading, title, description, action, className = '', children, ...rest }) {
  return (
    <div className={`krnl-card-header ${className}`.trim()} {...rest}>
      {leading ? <div className="krnl-card-header-lead">{leading}</div> : null}
      {(title != null || description != null) ? (
        <div className="krnl-card-header-text">
          {title != null ? <div className="krnl-card-header-title">{title}</div> : null}
          {description != null ? <div className="krnl-card-header-desc">{description}</div> : null}
        </div>
      ) : null}
      {children}
      {action ? <div className="krnl-card-header-action">{action}</div> : null}
    </div>
  );
};

Card.Body = function CardBody({ className = '', children, ...rest }) {
  return <div className={`krnl-card-body ${className}`.trim()} {...rest}>{children}</div>;
};

Card.Footer = function CardFooter({ className = '', children, ...rest }) {
  return <div className={`krnl-card-footer ${className}`.trim()} {...rest}>{children}</div>;
};

export const meta = {
  Card: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['card', 'surface', 'selectable card', 'content container'],
    keywords: ['card', 'surface', 'panel', 'tile', 'container', 'selectable', 'interactive'],
    summary: 'Neutral base card: wrapper + appearance + rest/hover/pressed/focus/selected/dragging states; fill Preview / Header / Body / Footer.',
    props: [
      { name: 'appearance', class: 'dsPresentation', values: ['filled', 'outline', 'subtle', 'elevated'], default: 'filled', description: 'Surface treatment: filled (panel + border), outline (border only), subtle (no border/fill), elevated (raised ring + shadow, hover-lift - the base PatientCard is built on).' },
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Colour identity: a named status (info/success/warning/error) or any colour/var. Sets --card-tone (+ tinted surface via [data-tone]); neutral when omitted.' },
      { name: 'orientation', class: 'dsPresentation', values: ['vertical', 'horizontal'], default: 'vertical', description: 'Lays the slots in a column (default) or a row.' },
      { name: 'size', class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Padding density step.' },
      { name: 'interactive', class: 'dsPresentation', type: 'bool', description: 'Renders a focusable <button> with hover / pressed / focus states. Opt-in only (not implied by onClick), so a specialised non-button card can compose Card via `as` + its own onClick.' },
      { name: 'as', class: 'dsPresentation', type: 'string', description: 'Element tag for the non-interactive form (default div; e.g. "article"). Ignored when interactive (always a <button>).' },
      { name: 'selected', class: 'dsPresentation', type: 'bool', description: 'Marks the chosen state (accent border via [data-selected]); sets aria-pressed on the interactive form.' },
      { name: 'dragging', class: 'dsPresentation', type: 'bool', description: 'Lifted drag state (elevation via [data-dragging]).' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'HTMLButtonElement.disabled' },
      { name: 'floatingAction', class: 'content', type: 'ReactNode', description: 'A control pinned top-right (e.g. a menu button or checkbox).' },
      { name: 'onClick', class: 'event', type: '(event) => void', description: 'Click handler attached to the card element. Pair with `interactive` for the focusable <button> affordance.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'Card.Preview / Card.Header / Card.Body / Card.Footer (+ any content).' },
    ],
    bestPractices: [
      { do: true, text: 'Compose the base Card + fill slots for a specialised card; do not hand-roll a card wrapper.' },
      { do: true, text: 'Use interactive/onClick for a clickable card; selected for a chosen state in a set.' },
      { do: false, text: 'Nest an interactive Card inside another interactive Card (button-in-button).' },
    ],
    anatomy: [
      { name: 'Preview', required: false, description: 'Edge-to-edge media (Card.Preview).' },
      { name: 'Header', required: false, description: 'Leading + title/description + trailing action (Card.Header).' },
      { name: 'Body', required: false, description: 'Main content (Card.Body).' },
      { name: 'Footer', required: false, description: 'Actions row (Card.Footer).' },
    ],
    related: ['Box', 'PatientCard', 'Stack'],
    composes: [],
    usage: '<Card>\n  <Card.Header title="Prescribe a medication" action={<IconButton .../>} />\n  <Card.Body>…</Card.Body>\n  <Card.Footer><Button>Accept</Button></Card.Footer>\n</Card>',
  },
};
