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

import { NumberField } from '@base-ui-components/react/number-field';
import { Button } from '@base-ui-components/react/button';
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

// ── companion atoms used inside the card slots ──────────────────────────────
// These keep the per-object cards tiny: they assemble pre-styled bits instead
// of re-inventing layout. All are token-driven; none own any data.

// StatusPill — for the meta slot. Dot + label. Tone follows the status, not the
// card. (Don't pass it the card tone — that would conflate identity + interpretation.)
export function StatusPill({ status = 'normal', label, children }) {
  return (
    <span className={`krnl-pcard-status-pill is-status-${status}`}>
      <span className="krnl-pcard-status-dot" aria-hidden="true" />
      <span className="krnl-pcard-status-label">{label || children}</span>
    </span>
  );
}

// TrendChip — small Δ indicator with a direction arrow.
// direction: 'up' | 'down' | 'flat'
export function TrendChip({ direction = 'flat', value, label }) {
  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '·';
  return (
    <span className={`krnl-pcard-trend-chip is-trend-${direction}`} aria-label={label}>
      <span className="krnl-pcard-trend-arrow" aria-hidden="true">{arrow}</span>
      <span className="krnl-pcard-trend-value">{value}</span>
    </span>
  );
}

// ValueDisplay — the canonical "74 bpm" composition used in vitals + labs.
// Pass into the `value` slot. Consumers wanting a stepper variant pass a
// custom node instead — the slot is unopinionated.
export function ValueDisplay({ value, unit, prefix }) {
  return (
    <span className="krnl-pcard-value-display">
      {prefix && <span className="krnl-pcard-value-prefix">{prefix}</span>}
      <span className="krnl-pcard-value-num">{value}</span>
      {unit && <span className="krnl-pcard-value-unit">{unit}</span>}
    </span>
  );
}

// Stepper — Shoot-stage editable value. Composes Base UI NumberField for
// keyboard arrows, wheel scrub, IME-safe typing, and min/max/step a11y.
// Min/max/step honoured. No save here — consumer provides the save CTA.
export function Stepper({ value, unit, min, max, step = 1, onChange, ariaLabel }) {
  return (
    <NumberField.Root
      value={Number(value)}
      onValueChange={(n) => { if (n != null) onChange?.(n); }}
      min={min}
      max={max}
      step={step}
      aria-label={ariaLabel}
      className="krnl-pcard-stepper"
    >
      <NumberField.Group className="krnl-pcard-stepper-group">
        <NumberField.Decrement className="krnl-pcard-stepper-btn" aria-label="Verlagen">−</NumberField.Decrement>
        <span className="krnl-pcard-stepper-value">
          <NumberField.Input className="krnl-pcard-stepper-input" />
          {unit && <span className="krnl-pcard-value-unit">{unit}</span>}
        </span>
        <NumberField.Increment className="krnl-pcard-stepper-btn" aria-label="Verhogen">+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

// IconPill — the rounded-square tone-tinted glyph holder for the leading slot.
// Light tint of the card tone behind a tone-coloured glyph.
export function IconPill({ children, label }) {
  return (
    <span className="krnl-pcard-icon-pill" role="img" aria-label={label}>
      {children}
    </span>
  );
}

// EditChip — trailing slot decoration on a Shoot card ("✎ Bewerken").
// Composes Base UI Button for the a11y/focus baseline.
export function EditChip({ label = 'Bewerken', onClick }) {
  return (
    <Button className="krnl-pcard-edit-chip" onClick={onClick}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
      <span>{label}</span>
    </Button>
  );
}

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
  StatusPill: {
    layer: 'atom', scope: 'global', usecases: ['card-meta'], status: 'experimental',
    category: 'Feedback & Status',
    keywords: ['status', 'pill', 'badge', 'dot', 'interpretation', 'clinical', 'normal', 'critical'],
    summary: 'Interpretation pill (dot + label). Tone follows the status, not the card identity tone.',
    props: {
      status: { class: 'dsPresentation', values: ['normal', 'borderline', 'high', 'low', 'critical'], default: 'normal', description: 'Clinical interpretation; drives the dot + label colour. Keep this orthogonal to the card tone, which encodes identity, not interpretation.' },
      label: { class: 'content', type: 'node', description: 'The pill text. Falls back to children when omitted.' },
      children: { class: 'content', type: 'node', description: 'Alternative to label; rendered as the pill text when label is not passed.' },
    },
    anatomy: [
      { name: 'Dot', required: true, description: 'Small status-coloured indicator dot.' },
      { name: 'Label', required: true, description: 'The interpretation text.' },
    ],
    bestPractices: [
      { do: true, text: 'Drive the pill from the measurement interpretation (normal / critical / ...), independent of the card identity tone.' },
      { do: false, text: 'Pass the card identity tone into status; that conflates identity and interpretation.' },
    ],
    composes: [],
    usage: '<StatusPill status="high" label="Verhoogd" />',
  },
  TrendChip: {
    layer: 'atom', scope: 'global', usecases: ['card-meta'], status: 'experimental',
    category: 'Data display',
    keywords: ['trend', 'chip', 'delta', 'change', 'arrow', 'direction', 'up', 'down'],
    summary: 'Compact delta indicator with a direction arrow (up / down / flat).',
    props: {
      direction: { class: 'dsPresentation', values: ['up', 'down', 'flat'], default: 'flat', description: 'Movement direction; selects the arrow glyph and the chip colour treatment.' },
      value: { class: 'content', type: 'node', description: 'The delta magnitude shown beside the arrow (e.g. "+3" or "2 mmHg").' },
      label: { class: 'a11y', type: 'string', description: 'Accessible name for the chip; describes the trend for screen readers since the arrow is decorative.' },
    },
    anatomy: [
      { name: 'Arrow', required: true, description: 'Decorative direction glyph set from direction.' },
      { name: 'Value', required: true, description: 'The delta magnitude text.' },
    ],
    composes: [],
    usage: '<TrendChip direction="up" value="+3" label="Gestegen met 3" />',
  },
  ValueDisplay: {
    layer: 'atom', scope: 'global', usecases: ['card-value'], status: 'experimental',
    category: 'Data display',
    keywords: ['value', 'measurement', 'number', 'unit', 'reading', 'vital', 'display'],
    summary: 'Big numeric value + small unit; the canonical value-slot content for vitals and labs.',
    props: {
      value: { class: 'content', type: 'string|number', description: 'The primary reading, rendered large (e.g. 74).' },
      unit: { class: 'content', type: 'string', description: 'Small trailing unit shown after the value (e.g. "bpm").' },
      prefix: { class: 'content', type: 'string', description: 'Optional small marker before the value (e.g. a comparator like "<").' },
    },
    anatomy: [
      { name: 'Prefix', required: false, description: 'Optional leading marker.' },
      { name: 'Value', required: true, description: 'The large numeric reading.' },
      { name: 'Unit', required: false, description: 'The small trailing unit.' },
    ],
    composes: [],
    usage: '<ValueDisplay value="74" unit="bpm" />',
  },
  Stepper: {
    layer: 'atom', scope: 'global', usecases: ['card-value-shoot'], status: 'experimental',
    category: 'Data Input',
    keywords: ['stepper', 'number', 'increment', 'decrement', 'edit', 'input', 'numberfield', 'shoot'],
    summary: 'Shoot-stage editable value (minus / value / plus). No save; the consumer provides the CTA in the actions slot.',
    props: {
      value: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.value' },
      min: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.min' },
      max: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.max' },
      step: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.step' },
      unit: { class: 'content', type: 'string', description: 'Small trailing unit shown after the editable value (e.g. "bpm").' },
      onChange: { class: 'event', type: 'fn', description: 'Called with the new numeric value on each change; wraps the Base UI onValueChange and skips null (mid-edit) values.' },
      ariaLabel: { class: 'a11y', type: 'string', description: 'Accessible name for the number field, since there is no visible label.' },
    },
    anatomy: [
      { name: 'Decrement', required: true, description: 'The minus button.' },
      { name: 'Input', required: true, description: 'The editable numeric field.' },
      { name: 'Increment', required: true, description: 'The plus button.' },
    ],
    composes: [],
    usage: '<Stepper value={72} unit="bpm" min={30} max={220} onChange={setBpm} ariaLabel="Hartslag" />',
  },
  IconPill: {
    layer: 'atom', scope: 'global', usecases: ['card-leading'], status: 'experimental',
    category: 'Data display',
    keywords: ['icon', 'pill', 'glyph', 'leading', 'adornment', 'tone', 'avatar'],
    summary: 'Rounded-square tone-tinted glyph holder for the card leading slot.',
    props: {
      children: { class: 'content', type: 'node', description: 'The glyph to render (an icon element); tinted by the card tone.' },
      label: { class: 'a11y', type: 'string', description: 'Accessible name for the pill, which carries an image role.' },
    },
    composes: [],
    usage: '<IconPill label="Hartslag">{Icon.heart({ size: 16 })}</IconPill>',
  },
  EditChip: {
    layer: 'atom', scope: 'global', usecases: ['card-trailing'], status: 'experimental',
    category: 'Action',
    keywords: ['edit', 'chip', 'pencil', 'trailing', 'button', 'shoot', 'bewerken'],
    summary: 'Pencil + label trailing chip used on Shoot-stage cards. Composes Base UI Button for the a11y and focus baseline.',
    props: {
      label: { class: 'content', type: 'string', default: 'Bewerken', description: 'The chip text shown beside the pencil glyph.' },
      onClick: { class: 'event', type: 'fn', description: 'Invoked when the chip is activated (enters edit mode).' },
    },
    anatomy: [
      { name: 'Icon', required: true, description: 'The pencil glyph.' },
      { name: 'Label', required: true, description: 'The chip text.' },
    ],
    composes: [],
    usage: '<EditChip label="Bewerken" onClick={startEdit} />',
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
