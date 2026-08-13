// Card - the neutral base card (Fluent-aligned). Owns the wrapper: surface +
// border (appearance), and the states - rest / hover / pressed / focus / selected /
// dragging / disabled - so specialised cards (patient cards, answer cards, setting
// cards) just compose it and fill the slots. Interactive when `interactive` is set
// (renders a real <button>); selectable via `selected`; a `floatingAction` slot
// pins a control top-right. Slots: Card.Preview / Card.Header / Card.Body / Card.Footer.
//
// Token-styled via .krnl-card* (the base class = the `filled` look). Not a Base UI
// primitive for the surface (Base UI ships no card); a hand-rolled leaf on tokens.
// When `detail` is supplied the card becomes collapsible and composes Base UI's
// `collapsible` primitive for the expand/collapse region (state + ARIA + height var).
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// tone: a named status (info/success/warning/error) maps to its token; a named
// data tone (data-1..data-6, the categorical data-viz hues - teal/indigo/violet/
// magenta/mint/lime) maps to its own --data-tone-{n}-* triad, for a Card/Banner
// identity that reads as "one of several categories," not a status; any other
// string is passed through as a colour (or a var). Sets --card-tone + [data-tone]
// (the tinted treatment). PatientCard sets --card-tone itself and omits `tone`.
const STATUS_TONES = ['info', 'success', 'warning', 'error'];
const DATA_TONES = ['data-1', 'data-2', 'data-3', 'data-4', 'data-5', 'data-6'];
// A named tone resolves to its token family slug (`status-error`, `data-tone-3`);
// arbitrary colour strings return null and are passed through as a raw --card-tone.
const toneSlug = (tone) =>
  STATUS_TONES.includes(tone) ? `status-${tone}`
  : DATA_TONES.includes(tone) ? tone.replace('data-', 'data-tone-')
  : null;
// `neutral` has no status token family (STANDARD.md: neutral -> --surface-panel +
// --text-muted, not --status-neutral-*), so it must behave exactly like `tone` being
// omitted - no --card-tone, no [data-tone]. Without this, `neutral` fell into the
// "arbitrary colour" branch below and set `--card-tone: neutral`, which is invalid CSS:
// every declaration referencing it (the tone border, the strip+elevation box-shadow)
// became invalid-at-computed-value-time and dropped, producing a near-black
// `currentColor` border and NO drop shadow at all.
const toneVar = (tone) => (tone == null || tone === 'neutral') ? undefined
  : toneSlug(tone) ? `var(--${toneSlug(tone)}-solid)` : tone;
// A named tone binds the whole vivid family to the card vars so accents read at full
// ramp saturation (B-46): tint (.100 body) / tint-strong (.200 icon-tile) / accent
// (.500 vivid strip+glyph) / solid (.700 AA text). This replaces the washed-out 12%
// color-mix that made status cards look unsaturated. Arbitrary colours keep the mix.
const tintVars = (tone) => {
  const slug = toneSlug(tone);
  return slug ? {
    '--card-tone-tint': `var(--${slug}-tint)`,
    '--card-tone-tint-strong': `var(--${slug}-tint-strong)`,
    '--card-tone-text': `var(--${slug}-solid)`,
    '--card-accent': `var(--${slug}-accent)`,
  } : null;
};

export const Card = React.forwardRef(function Card(
  { appearance = 'filled', orientation = 'vertical', size = 'md', tone, accent,
    selected, interactive, disabled, dragging, floatingAction, as,
    detail, expanded, defaultExpanded, onExpandedChange,
    onClick, className = '', style, children, ...rest }, ref) {
  // `detail` opts the card into collapse: the summary (children) becomes a toggle and
  // `detail` is revealed in an animated panel below. It composes Base UI collapsible.
  const collapsible = detail != null;
  // Interactive (a real <button>) is opt-in via `interactive` only - NOT implied by
  // onClick. A specialised card that must stay a non-button element (e.g. PatientCard,
  // which contains a heading + nested controls) composes Card with `as` + its own
  // onClick/role, and never trips button-in-button. A collapsible card is NEVER the
  // interactive <button> form - the trigger owns the affordance (a button root would
  // nest the trigger button), so `interactive` is ignored when `detail` is present.
  const clickable = !!interactive && !collapsible;
  const cls = [
    'krnl-card',
    appearance !== 'filled' && `krnl-card--${appearance}`,
    orientation === 'horizontal' && 'krnl-card--horizontal',
    size !== 'md' && `krnl-card--${size}`,
    clickable && 'krnl-card--interactive',
    collapsible && 'krnl-card--collapsible',
    className,
  ].filter(Boolean).join(' ');
  const tc = toneVar(tone);
  const tv = tintVars(tone);
  const styleObj = tc ? { '--card-tone': tc, ...tv, ...style } : style;
  // Shared state/identity attrs (accent needs a tone to render its --card-tone colour).
  const dataAttrs = {
    'data-selected': selected || undefined,
    'data-dragging': dragging || undefined,
    'data-tone': tc != null ? '' : undefined,
    'data-accent': accent || undefined,
  };

  // Collapsible form: root is Base UI Collapsible.Root (a <div>, never a button); the
  // summary IS the trigger (a button, so keep interactive controls OUT of the summary -
  // put actions in `detail`); the panel is a SIBLING of the trigger, so detail's own
  // buttons never nest inside the trigger. `onClick` is not wired here (the card's click
  // IS the toggle; use `onExpandedChange` for side-effects).
  if (collapsible) {
    return (
      <BaseCollapsible.Root ref={ref} className={cls} style={styleObj}
        open={expanded} defaultOpen={defaultExpanded} onOpenChange={onExpandedChange}
        data-disabled={disabled || undefined} {...dataAttrs} {...rest}>
        {floatingAction ? <div className="krnl-card-floataction">{floatingAction}</div> : null}
        <BaseCollapsible.Trigger className="krnl-card-trigger" disabled={disabled || undefined}>
          {children}
          <span className="krnl-card-chev" aria-hidden="true">{Icon.chevron({ size: 16 })}</span>
        </BaseCollapsible.Trigger>
        <BaseCollapsible.Panel className="krnl-card-panel">
          <div className="krnl-card-panel-inner">{detail}</div>
        </BaseCollapsible.Panel>
      </BaseCollapsible.Root>
    );
  }

  const Tag = clickable ? 'button' : (as || 'div');
  return (
    <Tag ref={ref} type={clickable ? 'button' : undefined}
      className={cls} onClick={onClick} disabled={clickable ? disabled : undefined}
      style={styleObj}
      {...dataAttrs}
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
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Colour identity: a named status (info/success/warning/error), a named data tone (data-1..data-6 - the categorical data-viz hues: teal/indigo/violet/magenta/mint/lime, for "one of several categories" identity without implying status), or any colour/var. Sets --card-tone (+ tinted surface via [data-tone]); neutral when omitted, and tone="neutral" is equivalent to omitting it (there is no --status-neutral-* token family, so it never sets --card-tone/[data-tone] either). Data tones alias their own designed --data-tone-{n}-tint directly rather than the generic mix, so they read at full ramp saturation.' },
      { name: 'orientation', class: 'dsPresentation', values: ['vertical', 'horizontal'], default: 'vertical', description: 'Lays the slots in a column (default) or a row.' },
      { name: 'size', class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Padding density step.' },
      { name: 'interactive', class: 'dsPresentation', type: 'bool', description: 'Renders a focusable <button> with hover / pressed / focus states. Opt-in only (not implied by onClick), so a specialised non-button card can compose Card via `as` + its own onClick.' },
      { name: 'as', class: 'dsPresentation', type: 'string', description: 'Element tag for the non-interactive form (default div; e.g. "article"). Ignored when interactive (always a <button>) or collapsible (always a Collapsible root div).' },
      { name: 'accent', class: 'dsPresentation', values: ['strip', 'strip-border'], description: 'Opt-in tone-coloured accent (needs a `tone`): strip = a bar on one edge (top on a Card; Banner flips it to the left); strip-border also keeps the tone border. Inset box-shadow, so it is auto-clipped to the corner radius. Mutually exclusive with Card.Preview (the inset paints under a full-bleed image).' },
      { name: 'selected', class: 'dsPresentation', type: 'bool', description: 'Marks the chosen state (accent border via [data-selected]); sets aria-pressed on the interactive form.' },
      { name: 'dragging', class: 'dsPresentation', type: 'bool', description: 'Lifted drag state (elevation via [data-dragging]).' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'HTMLButtonElement.disabled' },
      { name: 'detail', class: 'content', type: 'ReactNode', description: 'Opts the card into collapse: the summary (children) becomes a click/keyboard toggle and this content is revealed in an animated panel below. Composes Base UI collapsible (owns aria-expanded/controls + the height var). Keep interactive controls OUT of the summary when using detail (the summary is the trigger button) - put actions here in detail. Ignores `interactive`/`onClick` (the toggle is the interaction; use onExpandedChange for side-effects).' },
      { name: 'expanded', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.Root.open' },
      { name: 'defaultExpanded', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.Root.defaultOpen' },
      { name: 'onExpandedChange', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.Root.onOpenChange' },
      { name: 'floatingAction', class: 'content', type: 'ReactNode', description: 'A control pinned top-right (e.g. a menu button or checkbox).' },
      { name: 'onClick', class: 'event', type: '(event) => void', description: 'Click handler attached to the card element. Pair with `interactive` for the focusable <button> affordance. Ignored when `detail` is set (the toggle owns the click - use onExpandedChange).' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'Card.Preview / Card.Header / Card.Body / Card.Footer (+ any content). When `detail` is set, children are the always-visible summary and must stay display-only (no nested buttons/links).' },
    ],
    bestPractices: [
      { do: true, text: 'Compose the base Card + fill slots for a specialised card; do not hand-roll a card wrapper.' },
      { do: true, text: 'Use interactive/onClick for a clickable card; selected for a chosen state in a set.' },
      { do: true, text: 'For a collapsible card, put the compact teaser (icon / title / status / value) in children and the expandable content in `detail`; keep the summary display-only (actions live in detail). Coordinate one-open-at-a-time with the controlled expanded/onExpandedChange triad.' },
      { do: true, text: 'Use accent="strip" (needs a tone) for the vibrant top-edge bar; the accent + icon-tile carry the colour so the body can stay light and text stays AA.' },
      { do: false, text: 'Nest an interactive Card inside another interactive Card, or put a button/link inside a collapsible card\'s summary (button-in-button).' },
    ],
    anatomy: [
      { name: 'Preview', required: false, description: 'Edge-to-edge media (Card.Preview).' },
      { name: 'Header', required: false, description: 'Leading + title/description + trailing action (Card.Header).' },
      { name: 'Body', required: false, description: 'Main content (Card.Body).' },
      { name: 'Footer', required: false, description: 'Actions row (Card.Footer).' },
      { name: 'Detail', required: false, description: 'Collapsible panel revealed below the summary when `detail` is set.' },
    ],
    related: ['Box', 'PatientCard', 'Stack', 'Collapsible'],
    composes: [],
    usage: '<Card accent="strip" tone="info" detail={<Chart/>}>\n  <Card.Header leading={icon} title="Blood pressure" description="152/94 mmHg" />\n</Card>',
  },
};
