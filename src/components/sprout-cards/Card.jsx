// Card — the base for the Sprout patient-property card system.
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

const React = window.React;

const ALL_TONES = [
  'neutral', 'heart', 'breath', 'oxygen', 'temperature', 'pressure',
  'body', 'lab', 'identity', 'condition', 'allergy', 'medication',
];

const ALL_STATUSES = ['normal', 'borderline', 'high', 'low', 'critical'];

export function Card({
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
  // customColor → inline CSS variables (wins over .cc-tone--* by specificity)
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
    'cc-pcard',
    `cc-pcard--${stage}`,
    `cc-tone--${tone}`,
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
    <article
      className={cls}
      data-stage={stage}
      data-tone={tone}
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
        <header className="cc-pcard-head">
          {leading && <span className="cc-pcard-leading" aria-hidden="true">{leading}</span>}
          {title && <h3 className="cc-pcard-title">{title}</h3>}
          {trailing && <span className="cc-pcard-trailing">{trailing}</span>}
        </header>
      )}

      {value != null && <div className="cc-pcard-value">{value}</div>}

      {meta != null && <div className="cc-pcard-meta">{meta}</div>}

      {media != null && <div className="cc-pcard-media">{media}</div>}

      {aside != null && <div className="cc-pcard-aside" role="note">{aside}</div>}

      {footer != null && <footer className="cc-pcard-footer">{footer}</footer>}

      {actions != null && <div className="cc-pcard-actions">{actions}</div>}

      {loading && (
        <div className="cc-pcard-skeleton" aria-hidden="true">
          <span /><span /><span />
        </div>
      )}

      {error && (
        <div className="cc-pcard-error" role="alert">
          <span className="cc-pcard-error-msg">{error.message || String(error)}</span>
        </div>
      )}

      {empty && !loading && !error && (
        <div className="cc-pcard-empty" aria-hidden="true">—</div>
      )}
    </article>
  );
}

// ── companion atoms used inside the card slots ──────────────────────────────
// These keep the per-object cards tiny: they assemble pre-styled bits instead
// of re-inventing layout. All are token-driven; none own any data.

// StatusPill — for the meta slot. Dot + label. Tone follows the status, not the
// card. (Don't pass it the card tone — that would conflate identity + interpretation.)
export function StatusPill({ status = 'normal', label, children }) {
  return (
    <span className={`cc-pcard-status-pill is-status-${status}`}>
      <span className="cc-pcard-status-dot" aria-hidden="true" />
      <span className="cc-pcard-status-label">{label || children}</span>
    </span>
  );
}

// TrendChip — small Δ indicator with a direction arrow.
// direction: 'up' | 'down' | 'flat'
export function TrendChip({ direction = 'flat', value, label }) {
  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '·';
  return (
    <span className={`cc-pcard-trend-chip is-trend-${direction}`} aria-label={label}>
      <span className="cc-pcard-trend-arrow" aria-hidden="true">{arrow}</span>
      <span className="cc-pcard-trend-value">{value}</span>
    </span>
  );
}

// ValueDisplay — the canonical "74 bpm" composition used in vitals + labs.
// Pass into the `value` slot. Consumers wanting a stepper variant pass a
// custom node instead — the slot is unopinionated.
export function ValueDisplay({ value, unit, prefix }) {
  return (
    <span className="cc-pcard-value-display">
      {prefix && <span className="cc-pcard-value-prefix">{prefix}</span>}
      <span className="cc-pcard-value-num">{value}</span>
      {unit && <span className="cc-pcard-value-unit">{unit}</span>}
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
      className="cc-pcard-stepper"
    >
      <NumberField.Group className="cc-pcard-stepper-group">
        <NumberField.Decrement className="cc-pcard-stepper-btn" aria-label="Verlagen">−</NumberField.Decrement>
        <span className="cc-pcard-stepper-value">
          <NumberField.Input className="cc-pcard-stepper-input" />
          {unit && <span className="cc-pcard-value-unit">{unit}</span>}
        </span>
        <NumberField.Increment className="cc-pcard-stepper-btn" aria-label="Verhogen">+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

// IconPill — the rounded-square tone-tinted glyph holder for the leading slot.
// Light tint of the card tone behind a tone-coloured glyph.
export function IconPill({ children, label }) {
  return (
    <span className="cc-pcard-icon-pill" role="img" aria-label={label}>
      {children}
    </span>
  );
}

// EditChip — trailing slot decoration on a Shoot card ("✎ Bewerken").
// Composes Base UI Button for the a11y/focus baseline.
export function EditChip({ label = 'Bewerken', onClick }) {
  return (
    <Button className="cc-pcard-edit-chip" onClick={onClick}>
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
          <Tooltip.Popup className="cc-pcard-tooltip">{tip}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// catalog metadata for build/gen-components.mjs
export const meta = {
  Card: {
    layer: 'composite',
    scope: 'global',
    usecases: ['vital-sign', 'lab-result', 'demographic', 'condition', 'allergy', 'medication', 'sprout-pattern'],
    status: 'experimental',
    summary: 'Slot-driven base card for the Sprout pattern. Three fidelities (seed/sprout/shoot), two colour axes (tone/status), container-query intrinsic width morph.',
    props: {
      stage: "'seed'|'sprout'|'shoot'",
      tone: "'neutral'|'heart'|'breath'|'oxygen'|'temperature'|'pressure'|'body'|'lab'|'identity'|'condition'|'allergy'|'medication'",
      customColor: '?string|{solid,tint,tintStrong,on}',
      status: "?'normal'|'borderline'|'high'|'low'|'critical'",
      loading: '?bool', error: '?object', empty: '?bool',
      selected: '?bool', disabled: '?bool', stale: '?bool', dragging: '?bool',
      leading: '?node', title: '?node', trailing: '?node',
      value: '?node', meta: '?node', media: '?node',
      aside: '?node',
      footer: '?node', actions: '?node',
      ariaLabel: '?string', role: '?string', onClick: '?fn', className: '?string',
    },
    composes: [],
  },
  StatusPill: {
    layer: 'atom', scope: 'global', usecases: ['card-meta'], status: 'experimental',
    summary: 'Interpretation pill (dot + label). Tone follows the status, not the card identity tone.',
    props: { status: "'normal'|'borderline'|'high'|'low'|'critical'", label: '?string' },
    composes: [],
  },
  TrendChip: {
    layer: 'atom', scope: 'global', usecases: ['card-meta'], status: 'experimental',
    summary: 'Compact delta indicator (▲ / ▼ / ·).',
    props: { direction: "'up'|'down'|'flat'", value: 'string', label: '?string' },
    composes: [],
  },
  ValueDisplay: {
    layer: 'atom', scope: 'global', usecases: ['card-value'], status: 'experimental',
    summary: 'Big numeric value + small unit; canonical value slot content.',
    props: { value: 'string|number', unit: '?string', prefix: '?string' },
    composes: [],
  },
  Stepper: {
    layer: 'atom', scope: 'global', usecases: ['card-value-shoot'], status: 'experimental',
    summary: 'Shoot-stage editable value (− / value / +). No save; consumer provides the CTA in the actions slot.',
    props: { value: 'number', unit: '?string', min: '?number', max: '?number', step: '?number', onChange: '?fn', ariaLabel: '?string' },
    composes: [],
  },
  IconPill: {
    layer: 'atom', scope: 'global', usecases: ['card-leading'], status: 'experimental',
    summary: 'Rounded-square tone-tinted glyph holder for the leading slot.',
    props: { label: 'string' },
    composes: [],
  },
  EditChip: {
    layer: 'atom', scope: 'global', usecases: ['card-trailing'], status: 'experimental',
    summary: 'Pencil + label trailing chip used on Shoot stage cards. Composes Base UI Button for a11y/focus.',
    props: { label: '?string', onClick: '?fn' },
    composes: [],
  },
  MeterTooltip: {
    layer: 'atom', scope: 'global', usecases: ['card-meta', 'hover-detail'], status: 'experimental',
    summary: 'Tooltip wrapper for exposing measurement metadata on hover (timestamp, source). Composes Base UI Tooltip.',
    props: { tip: '?node', side: "?'top'|'right'|'bottom'|'left'" },
    composes: [],
  },
};
