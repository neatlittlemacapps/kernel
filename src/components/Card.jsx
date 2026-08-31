// Card - the neutral base card (Fluent-aligned), and the shared chrome mechanic the
// whole card family (Card / Banner / a framed Collapsible trigger) is built on. Owns
// the wrapper: surface + border + accent-strip + elevation (independent booleans, the
// same vocabulary Banner already used - STANDARD.md: mutually exclusive states are
// one enum, independent ones are separate props), and the states - rest / hover /
// pressed / focus / selected / dragging / disabled - so specialised cards (patient
// cards, answer cards, setting cards) just compose it and fill the slots. Interactive
// when `interactive` is set (renders a real <button>); selectable via `selected`; a
// `floatingAction` slot pins a control top-right. Slots: Card.Preview / Card.Header /
// Card.Body / Card.Footer.
//
// Chrome is resolved in JS (resolveCardChrome, ../lib/cardChrome.js) into --card-*
// custom properties, written once as inline style - CSS only ever READS them. This
// fixes a real bug (B-54): the old CSS-only chrome had `.krnl-card--elevated` (a
// class rule) and `.krnl-card[data-accent]` (an attribute rule) both trying to set
// --card-elevation at different specificities, so a Card with BOTH `accent` and
// `appearance="elevated"` silently lost its elevation - not a cascade a reorder could
// fix. Now there is exactly one place that decides the final value.
//
// When `detail` is supplied the card becomes collapsible and composes Base UI's
// `collapsible` primitive for the expand/collapse region (state + ARIA + height var).
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
import { Icon } from '../lib/icons.jsx';
import { resolveCardChrome } from '../lib/cardChrome.js';

const React = window.React;

export const Card = React.forwardRef(function Card(
  { surface = 'plain', bordered = true, elevated = false, accent = false,
    toneScope = 'box', dense = false,
    orientation = 'vertical', size = 'md', tone,
    selected, interactive, disabled, dragging, floatingAction, as,
    detail, expanded, defaultExpanded, onExpandedChange,
    onClick, className = '', style, children,
    // Deprecated - translated onto the props above so existing callers keep working.
    // Remove once callers migrate (see STANDARD.md's Card entry + references/migration.md).
    appearance, ...rest }, ref) {
  // appearance -> {surface, bordered} alias table (kept pixel-identical):
  //   filled (old default)  -> surface="plain"  bordered=true   (unchanged base look)
  //   outline                -> surface="none"   bordered=true
  //   subtle                 -> surface="none"   bordered=false
  //   elevated                -> a raised RING + shadow instead of a flat border, with
  //                              a hover-lift - the exact look PatientCard is built on.
  //                              NOT the same as the new plain `elevated` boolean
  //                              (which is a floating ambient shadow, ringless) - kept
  //                              as its own resolver path (legacyElevated) so PatientCard
  //                              never shifts.
  let legacyElevated = false;
  if (appearance === 'outline') { surface = 'none'; bordered = true; }
  else if (appearance === 'subtle') { surface = 'none'; bordered = false; }
  else if (appearance === 'elevated') { legacyElevated = true; }
  // Old `accent` was the enum 'strip' | 'strip-border' (truthy = show it) or
  // null/false (hide it); the new `accent` is a plain boolean. strip-border also
  // softened the border toward the tone (color-mix, ~= "accentColor at 38% alpha")
  // rather than the new `bordered` boolean's plain hairline - applied below, after
  // the chrome resolves, since it is Card's own deprecated-enum concern, not part
  // of the shared chrome contract.
  const legacyStripBorder = accent === 'strip-border';
  if (typeof accent === 'string') { bordered = true; accent = true; }
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
    legacyElevated && 'krnl-card--elevated',
    orientation === 'horizontal' && 'krnl-card--horizontal',
    size !== 'md' && `krnl-card--${size}`,
    clickable && 'krnl-card--interactive',
    collapsible && 'krnl-card--collapsible',
    className,
  ].filter(Boolean).join(' ');
  const chromeVars = resolveCardChrome({
    surface, tone, toneScope, accent, bordered, elevated, collapsible, legacyElevated,
    edge: 'top', neutralFill: 'bright',
  });
  if (legacyStripBorder && chromeVars['--card-tone'] != null) {
    chromeVars['--card-border-color'] =
      `color-mix(in oklch, ${chromeVars['--card-strip-color']} 45%, var(--surface-bright))`;
  }
  const styleObj = { ...chromeVars, ...style };
  // Shared state/identity attrs.
  const dataAttrs = {
    'data-selected': selected || undefined,
    'data-dragging': dragging || undefined,
    'data-tone': chromeVars['--card-tone'] != null ? '' : undefined,
    'data-accent': accent || undefined,
    // Hover/active elevation ladder hook (styles.css): identifies a card floating AT
    // REST via the plain `elevated` boolean, so hover/press only lift a card that
    // already has elevation to lift FROM. Deliberately excludes legacyElevated -
    // `.krnl-card--elevated` is ALREADY its own hook with its own (ring-aware)
    // hover/active rules; folding it in here would tie those rules' specificity
    // with the generic ones below and let source order (not intent) decide winner.
    'data-elevated': elevated || undefined,
    'data-density': dense ? 'compact' : undefined,
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
    summary: 'Neutral base card: wrapper + surface/border/accent/elevation chrome + rest/hover/pressed/focus/selected/dragging states; fill Preview / Header / Body / Footer.',
    props: [
      { name: 'surface', class: 'dsPresentation', values: ['plain', 'tinted', 'none'], default: 'plain', description: 'Body fill: plain is pure white/bright (--surface-bright, matches Banner); tinted is a light tone wash (the tone, mixed toward white for a faint hint, when a tone paints the box - a neutral sunken tint otherwise); none is transparent.' },
      { name: 'bordered', class: 'dsPresentation', type: 'bool', default: true, description: 'The hairline border.' },
      { name: 'elevated', class: 'dsPresentation', type: 'bool', default: false, description: 'A floating ambient drop shadow (--elevation-floating) - the same family as `accent` and a collapsible card. For the older raised-ring look, see the deprecated `appearance="elevated"`.' },
      { name: 'accent', class: 'dsPresentation', type: 'bool', default: false, description: 'A tone-coloured accent strip on the top edge. Inset box-shadow, so it is auto-clipped to the corner radius. Falls back to a neutral hairline (never silently invisible) when toneScope="content" or no `tone` resolves. Mutually exclusive with Card.Preview (the inset paints under a full-bleed image). Deprecated string values \'strip\' / \'strip-border\' still work (both -> accent={true}; \'strip-border\' also keeps a border softened toward the tone) for back-compat.' },
      { name: 'toneScope', class: 'dsPresentation', values: ['box', 'content'], default: 'box', description: '"box" lets `tone` also paint background/border/strip - border and strip resolve to the SAME saturated accent rung (~.500), so the edge reads as one weight rather than a soft border plus a vivid strip. "content" keeps the box neutral while the tone stays available to slot content (e.g. an icon tile) via --card-tone-*.' },
      { name: 'dense', class: 'dsPresentation', type: 'bool', default: false, description: 'A compact density scope: sets data-density="compact" on this Card, shrinking padding/radius/gap - a local scope over the existing --density-* tokens, not a parallel spacing system.' },
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Colour identity: a named status (info/success/warning/error), a named data tone (data-1..data-6 - the categorical data-viz hues: teal/indigo/violet/magenta/mint/lime, for "one of several categories" identity without implying status), or any colour/var. With the default toneScope="box", a resolved tone colours the border and (when `accent` is set) the strip immediately - a tinted BODY fill additionally needs surface="tinted" (surface and tone are independent axes, like Banner). Also exposes the tone triad to slot content (e.g. an icon tile) via --card-tone-*. Neutral when omitted, and tone="neutral" is equivalent to omitting it (there is no --status-neutral-* token family, so it never paints the box either). Data tones alias their own designed --data-tone-{n}-tint directly rather than the generic mix, so they read at full ramp saturation.' },
      { name: 'orientation', class: 'dsPresentation', values: ['vertical', 'horizontal'], default: 'vertical', description: 'Lays the slots in a column (default) or a row; the row form collapses back to a column inside a narrow container (@container, not the viewport).' },
      { name: 'size', class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Padding density step.' },
      { name: 'interactive', class: 'dsPresentation', type: 'bool', description: 'Renders a focusable <button> with hover / pressed / focus states. Opt-in only (not implied by onClick), so a specialised non-button card can compose Card via `as` + its own onClick.' },
      { name: 'as', class: 'dsPresentation', type: 'string', description: 'Element tag for the non-interactive form (default div; e.g. "article"). Ignored when interactive (always a <button>) or collapsible (always a Collapsible root div).' },
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
      { name: 'appearance', class: 'dsPresentation', values: ['filled', 'outline', 'subtle', 'elevated'], deprecated: true, description: 'Deprecated - use `surface`/`bordered`/`elevated`. filled -> surface="plain" bordered=true (the unchanged default look); outline -> surface="none" bordered=true; subtle -> surface="none" bordered=false; elevated -> the raised-ring look PatientCard is built on (kept pixel-identical - distinct from the new plain `elevated` boolean, which is a ringless floating shadow).' },
    ],
    bestPractices: [
      { do: true, text: 'Compose the base Card + fill slots for a specialised card; do not hand-roll a card wrapper.' },
      { do: true, text: 'Use interactive/onClick for a clickable card; selected for a chosen state in a set.' },
      { do: true, text: 'For a collapsible card, put the compact teaser (icon / title / status / value) in children and the expandable content in `detail`; keep the summary display-only (actions live in detail). Coordinate one-open-at-a-time with the controlled expanded/onExpandedChange triad.' },
      { do: true, text: 'Use accent (needs a tone) for the vibrant top-edge bar; the accent + icon-tile carry the colour so the body can stay light and text stays AA.' },
      { do: false, text: 'Nest an interactive Card inside another interactive Card, or put a button/link inside a collapsible card\'s summary (button-in-button).' },
    ],
    anatomy: [
      { name: 'Preview', required: false, description: 'Edge-to-edge media (Card.Preview).' },
      { name: 'Header', required: false, description: 'Leading + title/description + trailing action (Card.Header).' },
      { name: 'Body', required: false, description: 'Main content (Card.Body).' },
      { name: 'Footer', required: false, description: 'Actions row (Card.Footer).' },
      { name: 'Detail', required: false, description: 'Collapsible panel revealed below the summary when `detail` is set.' },
    ],
    related: ['Box', 'PatientCard', 'Stack', 'Collapsible', 'Banner'],
    composes: [],
    usage: '<Card accent tone="info" detail={<Chart/>}>\n  <Card.Header leading={icon} title="Blood pressure" description="152/94 mmHg" />\n</Card>',
  },
};
