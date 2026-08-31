// Content atoms — the small, region-agnostic pieces you drop INTO a Card's slots
// (Card.Header leading/title/action, Card.Body, Card.Footer). None own data or layout;
// they assemble pre-styled bits so a card composition stays tiny. Token-driven via the
// .krnl-* / .krnl-pcard-* class contract in styles.css.
//
// Extracted here (2026-08, "content-atom extraction") from the clinical sprout-cards so
// they read as a generic BASE set rather than clinical parts - the sprout-cards now
// re-export these for back-compat, and the whole family stays on the generic "." surface.
// See CONTENT-ATOMS.md for the vocabulary + current Juglans usage.
import { NumberField } from '@base-ui-components/react/number-field';
import { Button } from '@base-ui-components/react/button';

const React = window.React;

// StatusPill — dot + label. A tone-coloured interpretation badge for a meta/status slot.
// (In clinical use the tone follows the measurement status, not the card identity tone.)
export function StatusPill({ status = 'normal', label, children }) {
  return (
    <span className={`krnl-pcard-status-pill is-status-${status}`}>
      <span className="krnl-pcard-status-dot" aria-hidden="true" />
      <span className="krnl-pcard-status-label">{label || children}</span>
    </span>
  );
}

// TrendChip — small Δ indicator with a direction arrow. direction: 'up' | 'down' | 'flat'.
export function TrendChip({ direction = 'flat', value, label }) {
  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '·';
  return (
    <span className={`krnl-pcard-trend-chip is-trend-${direction}`} aria-label={label}>
      <span className="krnl-pcard-trend-arrow" aria-hidden="true">{arrow}</span>
      <span className="krnl-pcard-trend-value">{value}</span>
    </span>
  );
}

// ValueDisplay — the canonical "74 bpm" big-value + small-unit composition for a value slot.
// `size`: 'md' (default, the hero value on a card) | 'sm' (compact, for a collapsed header's
// value line) | 'lg'. The slot styling scales the number; the unit stays small.
export function ValueDisplay({ value, unit, prefix, size = 'md' }) {
  return (
    <span className="krnl-pcard-value-display" data-size={size === 'md' ? undefined : size}>
      {prefix && <span className="krnl-pcard-value-prefix">{prefix}</span>}
      <span className="krnl-pcard-value-num">{value}</span>
      {unit && <span className="krnl-pcard-value-unit">{unit}</span>}
    </span>
  );
}

// Stepper — an editable numeric value (minus / value / plus). Composes Base UI NumberField
// for keyboard arrows, wheel scrub, IME-safe typing, and min/max/step a11y. No save here.
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

// IconPill — a rounded-square tone-tinted glyph holder for a leading slot.
export function IconPill({ children, label }) {
  return (
    <span className="krnl-pcard-icon-pill" role="img" aria-label={label}>
      {children}
    </span>
  );
}

// EditChip — a pencil + label trailing chip. Composes Base UI Button for the a11y/focus baseline.
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

// Sparkline — inline SVG line chart with a soft gradient fill; draws in currentColor so it
// inherits the surrounding tone. Feed it a plain number[]. (Promoted from ./clinical.)
export function Sparkline({ data = [], width = 240, height = 56, ariaLabel }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return [x, y];
  });
  const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const gradId = 'krnl-sparkline-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg className="krnl-sparkline" width="100%" height={height} viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// FieldList — a definition list of label / value rows for a card body. (Promoted from ./clinical.)
export function FieldList({ items = [] }) {
  return (
    <dl className="krnl-field-list">
      {items.map(({ label, value }, i) => (
        <div key={i} className="krnl-field-row">
          <dt className="krnl-field-label">{label}</dt>
          <dd className="krnl-field-value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Catalog metadata. Relocated verbatim from sprout-cards (category → 'Content' so the set
// reads as one base group). Kept status:'experimental' - the vocabulary is still settling
// (a Chart family + CalendarHeatmap are the next planned additions).
export const meta = {
  StatusPill: {
    layer: 'atom', scope: 'global', usecases: ['card-meta', 'status-label'], status: 'experimental',
    category: 'Content',
    keywords: ['status', 'pill', 'badge', 'dot', 'interpretation', 'label'],
    summary: 'Interpretation pill (dot + label). Drop into a meta/status slot; the tone encodes a state, kept orthogonal to the card identity tone.',
    props: {
      status: { class: 'dsPresentation', values: ['normal', 'borderline', 'high', 'low', 'critical'], default: 'normal', description: 'The state; drives the dot + label colour. Keep orthogonal to the card identity tone.' },
      label: { class: 'content', type: 'node', example: 'Normal', description: 'The pill text. Falls back to children when omitted.' },
      children: { class: 'content', type: 'node', description: 'Alternative to label; rendered as the pill text when label is not passed.' },
    },
    anatomy: [
      { name: 'Dot', required: true, description: 'Small state-coloured indicator dot.' },
      { name: 'Label', required: true, description: 'The interpretation text.' },
    ],
    composes: [],
    usage: '<StatusPill status="high" label="Elevated" />',
  },
  TrendChip: {
    layer: 'atom', scope: 'global', usecases: ['card-meta'], status: 'experimental',
    category: 'Content',
    keywords: ['trend', 'chip', 'delta', 'change', 'arrow', 'direction', 'up', 'down'],
    summary: 'Compact delta indicator with a direction arrow (up / down / flat).',
    props: {
      direction: { class: 'dsPresentation', values: ['up', 'down', 'flat'], default: 'flat', description: 'Movement direction; selects the arrow glyph and the chip colour treatment.' },
      value: { class: 'content', type: 'node', example: '+3', description: 'The delta magnitude shown beside the arrow (e.g. "+3" or "2 mmHg").' },
      label: { class: 'a11y', type: 'string', example: 'Up by 3', description: 'Accessible name for the chip; the arrow is decorative.' },
    },
    anatomy: [
      { name: 'Arrow', required: true, description: 'Decorative direction glyph set from direction.' },
      { name: 'Value', required: true, description: 'The delta magnitude text.' },
    ],
    composes: [],
    usage: '<TrendChip direction="up" value="+3" label="Up by 3" />',
  },
  ValueDisplay: {
    layer: 'atom', scope: 'global', usecases: ['card-value'], status: 'experimental',
    category: 'Content',
    keywords: ['value', 'measurement', 'number', 'unit', 'reading', 'metric', 'display'],
    summary: 'Big numeric value + small unit; the canonical value-slot content for metric cards.',
    props: {
      value: { class: 'content', type: 'string|number', example: 74, description: 'The primary reading, rendered large (e.g. 74).' },
      unit: { class: 'content', type: 'string', example: 'bpm', description: 'Small trailing unit shown after the value (e.g. "bpm").' },
      prefix: { class: 'content', type: 'string', description: 'Optional small marker before the value (e.g. a comparator like "<").' },
      size: { class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Value scale: md is the hero value on a card; sm is compact for a collapsed header value line; lg is the largest.' },
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
    layer: 'atom', scope: 'global', usecases: ['card-value-edit'], status: 'experimental',
    category: 'Content',
    keywords: ['stepper', 'number', 'increment', 'decrement', 'edit', 'input', 'numberfield'],
    summary: 'An editable numeric value (minus / value / plus). No save; the consumer provides the CTA.',
    props: {
      value: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.value', example: 72 },
      min: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.min', example: 30 },
      max: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.max', example: 220 },
      step: { class: 'passThroughControl', passthrough: 'BaseUI.NumberField.step', example: 1 },
      unit: { class: 'content', type: 'string', description: 'Small trailing unit shown after the editable value (e.g. "bpm").' },
      onChange: { class: 'event', type: 'fn', description: 'Called with the new numeric value on each change; wraps Base UI onValueChange and skips null (mid-edit) values.' },
      ariaLabel: { class: 'a11y', type: 'string', description: 'Accessible name for the number field, since there is no visible label.' },
    },
    anatomy: [
      { name: 'Decrement', required: true, description: 'The minus button.' },
      { name: 'Input', required: true, description: 'The editable numeric field.' },
      { name: 'Increment', required: true, description: 'The plus button.' },
    ],
    composes: [],
    usage: '<Stepper value={72} unit="bpm" min={30} max={220} onChange={setBpm} ariaLabel="Heart rate" />',
  },
  IconPill: {
    layer: 'atom', scope: 'global', usecases: ['card-leading'], status: 'experimental',
    category: 'Content',
    keywords: ['icon', 'pill', 'glyph', 'leading', 'adornment', 'tone', 'tile'],
    summary: 'Rounded-square tone-tinted glyph holder for a card leading slot.',
    props: {
      children: { class: 'content', type: 'node', description: 'The glyph to render (an icon element); tinted by the surrounding tone.' },
      label: { class: 'a11y', type: 'string', description: 'Accessible name for the pill, which carries an image role.' },
    },
    composes: [],
    usage: '<IconPill label="Heart rate">{Icon.heart({ size: 16 })}</IconPill>',
  },
  EditChip: {
    layer: 'atom', scope: 'global', usecases: ['card-trailing'], status: 'experimental',
    category: 'Content',
    keywords: ['edit', 'chip', 'pencil', 'trailing', 'button'],
    summary: 'A pencil + label trailing chip for a card action slot. Composes Base UI Button for the a11y/focus baseline.',
    props: {
      label: { class: 'content', type: 'string', default: 'Bewerken', description: 'The chip text shown beside the pencil glyph.' },
      onClick: { class: 'event', type: 'fn', description: 'Invoked when the chip is activated (enters edit mode).' },
    },
    anatomy: [
      { name: 'Icon', required: true, description: 'The pencil glyph.' },
      { name: 'Label', required: true, description: 'The chip text.' },
    ],
    composes: [],
    usage: '<EditChip label="Edit" onClick={startEdit} />',
  },
  Sparkline: {
    layer: 'atom', scope: 'global', usecases: ['card-media', 'trend'], status: 'experimental',
    category: 'Content',
    keywords: ['sparkline', 'chart', 'trend', 'line', 'inline', 'mini-chart'],
    summary: 'Inline SVG line chart with a soft gradient fill; draws in currentColor so it inherits the surrounding tone.',
    props: {
      data: { class: 'content', type: 'number[]', description: 'The series to plot; a plain array of numbers.' },
      width: { class: 'dsPresentation', type: 'number', default: 240, description: 'viewBox width (the svg scales to its container; this sets the aspect + point spacing).' },
      height: { class: 'dsPresentation', type: 'number', default: 56, description: 'Rendered height in px.' },
      ariaLabel: { class: 'a11y', type: 'string', description: 'Accessible name describing the trend, since the chart is an image.' },
    },
    composes: [],
    usage: '<Sparkline data={[72, 74, 71, 78, 75]} ariaLabel="Heart rate, last 5 readings" />',
  },
  FieldList: {
    layer: 'atom', scope: 'global', usecases: ['card-body'], status: 'experimental',
    category: 'Content',
    keywords: ['field', 'list', 'definition', 'key-value', 'label', 'value', 'detail'],
    summary: 'A definition list of label / value rows for a card body.',
    props: {
      items: { class: 'content', type: '{ label, value }[]', description: 'The rows to render, each a { label, value } pair.' },
    },
    composes: [],
    usage: '<FieldList items={[{ label: "Born", value: "1978-04-12" }, { label: "Sex", value: "F" }]} />',
  },
};
