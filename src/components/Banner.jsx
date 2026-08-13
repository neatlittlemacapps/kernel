// Banner - a persistent status message the user must notice or act on (info /
// success / warning / error), composed FROM Card for the Header/Body slots + the
// Collapsible `detail` region, but NOT from Card's own tone/accent cascade: Banner
// resolves its own chrome (surface, border, strip, icon) in JS into a fixed set of
// --banner-* custom properties, and passes Card neither `tone` nor `accent`. Card's
// [data-tone]/[data-accent] rules are tuned for Card's OWN defaults (solid .700
// border, elevation that a strip always wins over on specificity) and collided with
// Banner's needs in ways that couldn't be fixed by adding more CSS - see
// resolveBannerChrome below and the decision table in STANDARD.md.
//
// Seven independent chrome switches, each its own prop (STANDARD.md: mutually
// exclusive states are one enum; independent ones are separate booleans):
//   accent    - the left strip, on/off
//   bordered  - the hairline border, on/off
//   elevated  - drop shadow, on/off
//   surface   - body fill: plain (white) or tinted (light semantic wash)
//   tone      - the semantic meaning (always paints the icon; see toneScope for the box)
//   toneScope - "box" lets `tone` also paint background/border/strip; "content" keeps
//               the box neutral while the icon/tile stay tone-coloured
//   dense     - a compact density scope (data-density="compact" on this element),
//               cascading into the header, the action/dismiss controls and `detail`
//
// Not for auto-expiring notices - that's a Toast (Kernel doesn't have one yet).
// Not for a block notice with its own header + body + footer actions row - that's
// the separate `Callout` atom this repo's COMPONENT-EXTRACTION-PLAN.md reserves;
// Banner stays a single Card.Header row (+ an optional collapsible detail region).
import { Card } from './Card.jsx';
import { Collapsible } from './Collapsible.jsx';
import { IconButton } from './ui.jsx';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

const STATUS_TONES = ['info', 'success', 'warning', 'error'];

// Default icon per tone - a status shape (circled), not the generic help/check/flag
// glyphs (those read as generic UI, not a status badge). `neutral` has no status
// icon by default (STANDARD.md: neutral has no status token either).
const TONE_ICON = {
  info: Icon.statusInfo,
  success: Icon.statusSuccess,
  warning: Icon.statusWarning,
  error: Icon.statusError,
};

// live defaults by tone (STANDARD.md §4): error is the one tone that must interrupt
// (assertive); neutral is informational chrome, not a status change (off); info /
// success / warning announce politely without stealing focus.
const TONE_LIVE = { error: 'assertive', neutral: 'off' };

// Resolves the tone-dependent part of the chrome matrix - background, border colour,
// strip colour, and the icon-tile colours - into custom properties. This is the ONE
// place the decision table lives, in code:
//
//   toneScope="box" + a real status tone -> the tone paints the box:
//     surface  = plain -> --surface-bright        | tinted -> --status-{tone}-tint
//     border   = --status-{tone}-border (soft hairline, NOT the vivid .700 solid)
//     strip    = --status-{tone}-accent (the vivid .500)
//   toneScope="content" (or tone="neutral", which has no box to paint anyway):
//     surface  = plain -> --surface-bright        | tinted -> --surface-sunken (a
//                neutral tint, not "no tint" - every combination is a real value)
//     border / strip = --border-subtle (the soft neutral hairline)
//
// The icon layer is intentionally NOT gated by toneScope: "keep the box neutral"
// means the box, not the message's own icon - so a toneScope="content" banner still
// shows a coloured icon in a tinted tile.
function resolveBannerChrome({ tone, toneScope, surface }) {
  const isStatus = STATUS_TONES.includes(tone);
  const slug = isStatus ? `status-${tone}` : null;
  const paintsBox = toneScope === 'box' && isStatus;

  const vars = {
    '--banner-surface': paintsBox
      ? (surface === 'tinted' ? `var(--${slug}-tint)` : 'var(--surface-bright)')
      : (surface === 'tinted' ? 'var(--surface-sunken)' : 'var(--surface-bright)'),
    '--banner-border-color': paintsBox ? `var(--${slug}-border)` : 'var(--border-subtle)',
    '--banner-strip-color': paintsBox ? `var(--${slug}-accent)` : 'var(--border-subtle)',
  };
  if (isStatus) {
    vars['--banner-icon-tint'] = `var(--${slug}-tint-strong)`;
    vars['--banner-icon-text'] = `var(--${slug}-solid)`;
    // Back-compat: styles.css's `.krnl-creditnotice-tx:hover` reads --card-tone-text
    // with an --action-accent fallback. Keep supplying it so that consumer doesn't
    // need its own change just because Banner stopped riding Card's tone vars.
    vars['--card-tone-text'] = `var(--${slug}-solid)`;
  }
  return vars;
}

export function Banner({
  tone = 'neutral', toneScope = 'box', surface = 'plain',
  accent = true, bordered = true, elevated = false, dense = false, fullWidth,
  icon, title, description, children, action, detail,
  onDismiss, live, className = '', style,
  // Deprecated - translated onto the props above so existing callers keep working.
  // Remove once callers migrate (see STANDARD.md's Banner entry + references/migration.md).
  variant, appearance,
  ...rest
}) {
  if (variant !== undefined) surface = variant === 'strong' ? 'tinted' : 'plain';
  if (appearance === 'elevated') elevated = true;
  // Old `appearance="subtle"` was "no border, no fill"; the new API has no transparent
  // surface (only plain/tinted), so this maps to the closest equivalent: no border.
  if (appearance === 'subtle') bordered = false;
  // Old `accent` was the enum 'strip' | 'strip-border' (truthy = show it) or
  // null/false (hide it); the new `accent` is a plain boolean.
  accent = accent === null ? false : (typeof accent === 'string' ? true : !!accent);

  const resolvedIcon = icon !== undefined ? icon : (TONE_ICON[tone]?.({ size: 18 }) ?? null);
  const resolvedLive = live || TONE_LIVE[tone] || 'polite';
  const chromeVars = resolveBannerChrome({ tone, toneScope, surface });
  const cls = [
    'krnl-banner-card',
    fullWidth && 'krnl-banner-card--flush',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Card
      appearance="filled" className={cls} style={{ ...chromeVars, ...style }}
      data-strip={accent ? '' : undefined}
      data-bordered={bordered ? '' : undefined}
      data-elevated={elevated ? '' : undefined}
      data-density={dense ? 'compact' : undefined}
      role={resolvedLive === 'off' ? undefined : (resolvedLive === 'assertive' ? 'alert' : 'status')}
      aria-live={resolvedLive === 'off' ? undefined : resolvedLive}
      {...rest}>
      <Card.Header
        leading={resolvedIcon ? <span className="krnl-banner-icon" aria-hidden="true">{resolvedIcon}</span> : null}
        title={title}
        description={description !== undefined ? description : children}
        action={action || onDismiss ? (
          <>
            {action}
            {onDismiss ? <IconButton aria-label="Dismiss" onClick={onDismiss}>{Icon.close({ size: 16 })}</IconButton> : null}
          </>
        ) : null}
      />
      {detail ? (
        <Card.Body>
          <Collapsible trigger="Review details" variant="plain">{detail}</Collapsible>
        </Card.Body>
      ) : null}
    </Card>
  );
}

export const meta = {
  Banner: {
    layer: 'molecule', scope: 'global', status: 'experimental', category: 'Feedback & Status',
    usecases: ['persistent status message', 'inline notice', 'form-level error', 'system notice'],
    keywords: ['banner', 'notice', 'alert', 'status', 'message', 'info', 'success', 'warning', 'error'],
    summary: 'Persistent status message (info/success/warning/error) composing Card + Collapsible - not for auto-expiring notices (a Toast) or a block notice with its own header/body/footer (a Callout).',
    props: [
      { name: 'tone', class: 'dsPresentation', values: ['neutral', 'info', 'success', 'warning', 'error'], default: 'neutral', description: 'Semantic meaning. Always selects the default icon + icon-tile colour and the default `live` politeness. Also paints the box (background/border/strip) when `toneScope="box"` - see `toneScope`.' },
      { name: 'toneScope', class: 'dsPresentation', values: ['box', 'content'], default: 'box', description: '"box" (default) lets `tone` paint the background/border/strip. "content" keeps the box neutral (a plain or neutral-tinted surface with the soft --border-subtle border) while the icon and its tile stay tone-coloured - use when the message needs to read as calm chrome with a coloured status glyph, not a coloured alert box.' },
      { name: 'surface', class: 'dsPresentation', values: ['plain', 'tinted'], default: 'plain', description: 'Body fill: plain is white (--surface-bright); tinted is a light wash - the semantic tone tint when toneScope="box", or a neutral tint (--surface-sunken) when toneScope="content" or tone="neutral". Replaces the old `variant` prop, with the corrected meaning: neither value is ever a solid/inverted fill.' },
      { name: 'accent', class: 'dsPresentation', type: 'bool', default: true, description: 'The 4px left accent strip. Coloured by `tone` (when toneScope="box") or the soft neutral border colour otherwise.' },
      { name: 'bordered', class: 'dsPresentation', type: 'bool', default: true, description: 'The hairline border, in the same colour the strip uses.' },
      { name: 'elevated', class: 'dsPresentation', type: 'bool', default: false, description: 'A drop shadow (--elevation-raised) for a banner that should float above the page.' },
      { name: 'dense', class: 'dsPresentation', type: 'bool', default: false, description: 'A compact density scope: sets data-density="compact" on this Banner, shrinking its padding/radius/gap and cascading into the header, the action/dismiss controls, and `detail` - not a parallel spacing system, just a local scope over the existing --density-* tokens (STANDARD.md: density is a token modifier, not its own prop system).' },
      { name: 'title', class: 'content', type: 'ReactNode', description: 'The banner headline. Required - rendered in Card.Header’s title slot.' },
      { name: 'description', class: 'content', type: 'ReactNode', description: 'Supporting text below the title, rendered in Card.Header’s description slot. Falls back to `children` when omitted, so a single-line banner can just pass text as children.' },
      { name: 'icon', class: 'content', type: 'ReactNode', description: 'Overrides the tone-derived default icon (info/success/warning/error each have one). Pass null to render no icon.' },
      { name: 'action', class: 'content', type: 'ReactNode', description: 'A Button rendered in Card.Header’s trailing action slot, alongside the dismiss control when both are present. Use variant="secondary" (the banner itself carries the emphasis) with tone matching the Banner’s own tone, so the action reads as part of the same status, not a competing primary CTA.' },
      { name: 'detail', class: 'content', type: 'ReactNode', description: 'Optional extra detail, revealed behind a "Review details" Collapsible below the header - Astryx’s collapsible-banner variant. Omit for a single-row banner.' },
      { name: 'fullWidth', class: 'dsPresentation', type: 'bool', description: 'Flush, no-radius, edge-to-edge treatment for a page-level notice. A Banner-only style override (not a new Card appearance) - Card has no flush concept and other Card consumers should not gain one by association.' },
      { name: 'onDismiss', class: 'event', type: '(event) => void', description: 'Renders an IconButton "Dismiss" close control in the action slot when supplied (opt-in, like Chip’s onRemove - no separate boolean gates it). Make info/success banners dismissible; leave error banners persistent until the underlying problem is resolved.' },
      { name: 'live', class: 'a11y', values: ['off', 'polite', 'assertive'], description: 'Maps to role/aria-live. Defaults from tone when omitted: error -> assertive, neutral -> off, info/success/warning -> polite.' },
      { name: 'variant', class: 'dsPresentation', values: ['subtle', 'strong'], deprecated: true, description: 'Deprecated - use `surface`. `subtle` -> surface="plain", `strong` -> surface="tinted".' },
      { name: 'appearance', class: 'dsPresentation', values: ['filled', 'outline', 'subtle', 'elevated'], deprecated: true, description: 'Deprecated - use `bordered`/`elevated`. `elevated` -> elevated={true}, `subtle` -> bordered={false}, `filled`/`outline` are a no-op.' },
    ],
    bestPractices: [
      { do: true, text: 'Pick tone by message severity: info for updates, success for confirmations, warning for caution, error for problems.' },
      { do: true, text: 'Make info/success banners dismissible; keep error banners persistent (no onDismiss) until the user resolves the underlying problem.' },
      { do: true, text: 'Use toneScope="content" when the surrounding UI shouldn’t gain a coloured box just because one status message needs a coloured icon - e.g. a neutral settings-panel notice with an info glyph.' },
      { do: false, text: 'Use Banner for an auto-expiring notification - build a Toast for that (not part of this component).' },
      { do: false, text: 'Use Banner for a block notice with its own header + body + footer actions row - compose Callout for that; Banner stays one Card.Header row plus an optional collapsible detail.' },
    ],
    anatomy: [
      { name: 'Icon', required: false, description: 'Leading tone icon (Card.Header’s leading slot).' },
      { name: 'Title', required: true, description: 'Headline (Card.Header’s title slot).' },
      { name: 'Description', required: false, description: 'Supporting text (Card.Header’s description slot).' },
      { name: 'Action', required: false, description: 'Trailing button + dismiss control (Card.Header’s action slot).' },
      { name: 'Detail', required: false, description: 'Collapsible region below the header.' },
    ],
    related: ['Card', 'Collapsible', 'IconButton'],
    composes: ['Card', 'Collapsible', 'IconButton'],
    usage: '<Banner tone="warning" title="Renewal needed" description="Your certificate expires in 3 days." action={<Button size="sm" variant="secondary" tone="warning">Renew</Button>} onDismiss={dismiss} />',
    examples: [
      { name: 'Single line', code: '<Banner tone="info" title="New version available" />', description: 'Title only, no description - a compact status row.' },
      { name: 'With detail', code: '<Banner tone="error" title="3 items failed to sync" detail={<ul>...</ul>} />', description: 'Persistent error banner with a collapsible detail list; no onDismiss, so it stays until resolved.' },
      { name: 'Tinted + elevated', code: '<Banner tone="success" surface="tinted" elevated title="Changes saved" onDismiss={dismiss} />', description: 'A light success tint, raised above the page, for a confirmation that should stand out without shouting.' },
      { name: 'Neutral box, toned icon', code: '<Banner tone="info" toneScope="content" title="Auto-save is on" />', description: 'The box stays neutral chrome; only the icon and its tile carry the info tone.' },
      { name: 'Dense', code: '<Banner tone="warning" dense title="Session expires in 2 minutes" />', description: 'A compact density scope for a tight space (e.g. a toolbar or a side panel footer).' },
    ],
  },
};
