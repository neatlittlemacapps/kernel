// PatientCard — the base for the Sprout patient-property card system.
// (Renamed from `Card` in B-42; the neutral base card now owns the `Card` name and
// PatientCard will be refactored to compose it.)
//
// One component, three fidelities (Seed / Sprout / Shoot), token-only styling.
// Slot-driven so per-object cards (vitals, labs, conditions, allergies, …) compose
// the same primitive without forks. Container-queries inside the card own the
// intrinsic width morph; the host still owns coarse breakpoint via data-breakpoint
// on the root. See ANALYSIS.md §1 for slot rationale and §6 for the container-query
// deviation from the codebase convention.
//
// Stages:
//   seed   — compact one-line glance (pill row); meta + media + footer collapsed.
//   sprout — full read-only card; adornment, sparkline, footer.
//   shoot  — interactive card; value slot accepts a stepper, actions row visible.
// Rooted (the 4th Sprout stage) is the host-application handoff — out of the card.
//
// Two orthogonal colour axes:
//   tone   — identity (heart, oxygen, temperature, …). Drives top rule + icon pill.
//   status — interpretation (normal, borderline, high, low, critical). Drives the
//            meta pill's dot + text. NEVER conflate.

import { Tooltip } from '@base-ui-components/react/tooltip';
import { Card } from '../Card.jsx';

const React = window.React;

const ALL_TONES = [
  'neutral', 'heart', 'breath', 'oxygen', 'temperature', 'pressure',
  'body', 'lab', 'identity', 'condition', 'allergy', 'medication',
];

const ALL_STATUSES = ['normal', 'borderline', 'high', 'low', 'critical'];

export function PatientCard({
  stage = 'sprout',
  tone = 'neutral',
  status,
  // colour escape hatch — overrides the named tone via inline CSS vars (highest specificity).
  // Accepts a CSS colour string ("oklch(.62 .18 25)" / "#ff0044" / "var(--brand-x)") or an
  // object { solid, tint, tintStrong, on } for full control over the derived band.
  customColor,
  // state flags — passed as an object so consumers can spread a state machine
  loading = false,
  error = null,
  empty = false,
  selected = false,
  disabled = false,
  stale = false,
  dragging = false,
  // slots
  leading, title, trailing,
  value, meta, media,
  aside,            // optional italic margin annotation (e.g. "GP geconsulteerd · 11d")
  footer, actions,
  // a11y + interaction
  ariaLabel,
  role = 'group',
  onClick,
  // escape hatch — extra class names appended after the canonical set
  className = '',
  // allow consumers to pass extra inline style; merged underneath the customColor mapping
  style,
  ...rest
}) {
  // customColor → inline CSS variables (wins over .krnl-tone--* by specificity)
  let colorStyle;
  if (customColor) {
    colorStyle = {};
    if (typeof customColor === 'string') {
      colorStyle['--card-tone'] = customColor;
    } else if (typeof customColor === 'object') {
      if (customColor.solid)      colorStyle['--card-tone'] = customColor.solid;
      if (customColor.tint)       colorStyle['--card-tone-tint'] = customColor.tint;
      if (customColor.tintStrong) colorStyle['--card-tone-tint-strong'] = customColor.tintStrong;
      if (customColor.on)         colorStyle['--card-tone-on'] = customColor.on;
    }
  }
  const mergedStyle = colorStyle ? { ...style, ...colorStyle } : style;
  const cls = [
    'krnl-pcard',
    `krnl-pcard--${stage}`,
    `krnl-tone--${tone}`,
    status && `is-status-${status}`,
    loading && 'is-loading',
    error && 'is-error',
    empty && 'is-empty',
    selected && 'is-selected',
    disabled && 'is-disabled',
    stale && 'is-stale',
    dragging && 'is-dragging',
    className,
  ].filter(Boolean).join(' ');

  const interactive = !!onClick && !disabled && !loading;

  return (
    // Composes the neutral base Card: appearance="elevated" supplies the raised ring +
    // shadow + tone-mix vars (single source in .krnl-card); .krnl-pcard adds only the
    // patient-card specialisation (container-query morph, stage, pulse, layout). Rendered
    // as an "article" element (not the base's interactive button) so it can hold a heading + nested controls
    // and drive its own role/onClick. No `tone`/`data-tone` passed - PatientCard carries
    // identity via .krnl-tone--* (--card-tone) and deliberately skips the tinted fill.
    <Card
      as="article"
      appearance="elevated"
      className={cls}
      data-stage={stage}
      data-status={status || undefined}
      role={interactive ? 'button' : role}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      aria-grabbed={dragging || undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); }
      } : undefined}
      style={mergedStyle}
      {...rest}
    >
      {(leading || title || trailing) && (
        <header className="krnl-pcard-head">
          {leading && <span className="krnl-pcard-leading" aria-hidden="true">{leading}</span>}
          {title && <h3 className="krnl-pcard-title">{title}</h3>}
          {trailing && <span className="krnl-pcard-trailing">{trailing}</span>}
        </header>
      )}

      {value != null && <div className="krnl-pcard-value">{value}</div>}

      {meta != null && <div className="krnl-pcard-meta">{meta}</div>}

      {media != null && <div className="krnl-pcard-media">{media}</div>}

      {aside != null && <div className="krnl-pcard-aside" role="note">{aside}</div>}

      {footer != null && <footer className="krnl-pcard-footer">{footer}</footer>}

      {actions != null && <div className="krnl-pcard-actions">{actions}</div>}

      {loading && (
        <div className="krnl-pcard-skeleton" aria-hidden="true">
          <span /><span /><span />
        </div>
      )}

      {error && (
        <div className="krnl-pcard-error" role="alert">
          <span className="krnl-pcard-error-msg">{error.message || String(error)}</span>
        </div>
      )}

      {empty && !loading && !error && (
        <div className="krnl-pcard-empty" aria-hidden="true">—</div>
      )}
    </Card>
  );
}

// ── companion content atoms ─────────────────────────────────────────────────
// StatusPill / TrendChip / ValueDisplay / Stepper / IconPill / EditChip were
// EXTRACTED to the generic ../content/content.jsx (2026-08) so they read as a base
// content-atom set, not clinical parts. Re-exported here so the existing per-object
// card imports (`import { StatusPill, … } from './PatientCard.jsx'`) keep working
// unchanged - new code should import them from '@corilus/kernel' instead.
export { StatusPill, TrendChip, ValueDisplay, Stepper, IconPill, EditChip } from '../content/content.jsx';

// MeterTooltip — Tooltip wrapper used to expose measurement metadata
// (timestamp, source) when hovering a value or status pill. Optional —
// consumers pass children + tip content.
export function MeterTooltip({ tip, children, side = 'top' }) {
  if (!tip) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={(props) => <span {...props}>{children}</span>} />
      <Tooltip.Portal>
        <Tooltip.Positioner side={side} sideOffset={6}>
          <Tooltip.Popup className="krnl-pcard-tooltip">{tip}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// catalog metadata for build/gen-components.mjs
export const meta = {
  PatientCard: {
    layer: 'composite',
    scope: 'global',
    usecases: ['vital-sign', 'lab-result', 'demographic', 'condition', 'allergy', 'medication', 'sprout-pattern'],
    status: 'experimental',
    category: 'Data display',
    keywords: ['card', 'tile', 'panel', 'sprout', 'fidelity', 'seed', 'sprout', 'shoot'],
    summary: 'Slot-driven base card for the Sprout pattern. Three fidelities (seed/sprout/shoot), two colour axes (tone/status), container-query intrinsic width morph.',
    props: {
      stage: { class: 'dsPresentation', values: ['seed', 'sprout', 'shoot'], description: 'Fidelity: seed (glance), sprout (detail), shoot (edit). Drives the intrinsic width morph.' },
      tone: { class: 'dsPresentation', values: ['neutral', 'heart', 'breath', 'oxygen', 'temperature', 'pressure', 'body', 'lab', 'identity', 'condition', 'allergy', 'medication'], description: 'Identity colour axis; drives the --card-tone-* bindings. Independent of status.' },
      customColor: '?string|{solid,tint,tintStrong,on}',
      status: { class: 'dsPresentation', values: ['normal', 'borderline', 'high', 'low', 'critical'], required: false, description: 'Clinical interpretation; colours the StatusPill, orthogonal to the identity tone.' },
      loading: '?bool', error: '?object', empty: '?bool',
      selected: '?bool', disabled: '?bool', stale: '?bool', dragging: '?bool',
      leading: { class: 'content', type: 'node', description: 'Leading slot (an IconPill or avatar).' },
      title: { class: 'content', type: 'node', description: 'Card heading slot.' },
      trailing: '?node',
      value: { class: 'content', type: 'node', description: 'Primary value slot (typically a ValueDisplay).' },
      meta: '?node', media: '?node',
      aside: '?node',
      footer: '?node', actions: { class: 'content', type: 'node', description: 'Trailing action slot (Btn / EditChip); RTL-safe.' },
      ariaLabel: '?string', role: '?string',
      onClick: { class: 'event', type: 'fn', description: 'Invoked when the card is activated.' },
      className: '?string',
    },
    anatomy: [
      { name: 'Leading', required: false, description: 'Icon / avatar at the start.' },
      { name: 'Title', required: false, description: 'The card heading.' },
      { name: 'Value', required: false, description: 'The primary value (e.g. a measurement).' },
      { name: 'Media', required: false, description: 'A sparkline / range bar / chart.' },
      { name: 'Actions', required: false, description: 'Trailing action buttons.' },
    ],
    composes: [],
    usage: '<PatientCard stage="sprout" tone="heart" title="Heart rate" value={<ValueDisplay value="72" unit="bpm" />} />',
  },
  MeterTooltip: {
    layer: 'atom', scope: 'global', usecases: ['card-meta', 'hover-detail'], status: 'experimental',
    category: 'Overlay',
    keywords: ['tooltip', 'meter', 'hover', 'metadata', 'timestamp', 'source', 'provenance'],
    summary: 'Tooltip wrapper that exposes measurement metadata on hover (timestamp, source). Composes Base UI Tooltip.',
    props: {
      tip: { class: 'content', type: 'node', description: 'The metadata content shown in the popup; when absent the children render bare with no tooltip.' },
      children: { class: 'content', type: 'node', description: 'The trigger element the tooltip is attached to (a value or status pill).' },
      side: { class: 'passThroughControl', passthrough: 'BaseUI.Tooltip.Positioner.side' },
    },
    composes: [],
    usage: '<MeterTooltip tip="Gemeten 11:42 · Philips monitor"><ValueDisplay value="74" unit="bpm" /></MeterTooltip>',
  },
};
