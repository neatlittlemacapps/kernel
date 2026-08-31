// DonutGauge - a circular level gauge (role="meter"): a compact ring reporting a
// static quantity, same semantics as Meter but shaped for an ambient/small-footprint
// carrier (e.g. beside a composer, in a toolbar). Base UI ships no gauge primitive,
// so this is hand-rolled inline SVG on tokens - same model as Sparkline
// (sprout-cards/lib.jsx): dimensions via props, colour via a resolved custom
// property, a stable per-instance id for the gradient (see AIBadge in ui.jsx for the
// same stable-id-via-useRef pattern).
//
// Two colour modes: a static `tone`, or a `thresholds` ramp so the ring escalates
// colour as the value approaches the limit (e.g. info -> warning -> error) WITHOUT
// hard-coding the break points in the component - thresholds are data, passed in.
import { toneFill } from '../lib/tone.js';

const React = window.React;

// A ready-made escalation ramp for a usage/credit gauge: informational up to 75%,
// warning through 90%, error at/after. Pass your own array for a different policy -
// thresholds are configurable, never hard-coded here.
export const USAGE_THRESHOLDS = [
  { at: 75, tone: 'warning' },
  { at: 90, tone: 'error' },
];

function resolveTone(pct, tone, thresholds) {
  if (!thresholds || !thresholds.length) return tone;
  let resolved = tone;
  for (const t of [...thresholds].sort((a, b) => a.at - b.at)) {
    if (pct >= t.at) resolved = t.tone;
  }
  return resolved;
}

export function DonutGauge({
  value, max = 100, size = 44, thickness, tone, thresholds, unbounded,
  valueText, className = '', style, ...rest
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  // Unbounded (no real ceiling) never shows a closed ring, however high value climbs.
  const full = !unbounded && value >= max;
  const sw = thickness || Math.max(2, Math.round(size / 6));
  const r = (size - sw) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  // Unbounded caps the drawn arc short of closing (80%) so the ring visually reads
  // as "still has room," and the trailing end fades via gradient instead of an edge.
  const drawFraction = unbounded ? Math.min(pct / 100, 0.8) : pct / 100;
  const dashoffset = circumference * (1 - drawFraction);
  const resolvedTone = resolveTone(pct, tone, thresholds);
  // Default (untoned) ring is --action-accent (the vivid .500 rung) - matches
  // Progress/Meter's own default fill, not --action-solid (.700, muddy as a fill).
  const fillColor = toneFill(resolvedTone) || 'var(--action-accent)';
  const crossR = r * 0.4;

  const idRef = React.useRef(null);
  if (!idRef.current) idRef.current = 'krnl-gauge-fade-' + Math.round(window.performance ? performance.now() * 1000 : Math.random() * 1e6);

  return (
    <div className={`krnl-gauge ${className}`.trim()} data-full={full || undefined}
      role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-valuetext={valueText}
      style={{ width: size, height: size, ...style }}
      {...rest}>
      {/* Decorative - the wrapping div carries the real meter semantics. */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {unbounded ? (
          <defs>
            <linearGradient id={idRef.current} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={fillColor} stopOpacity="1" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        ) : null}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={unbounded ? `url(#${idRef.current})` : fillColor}
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${cx} ${cy})`} />
        {full ? (
          // WCAG 1.4.1: "full" must be distinguishable from "nearly full" without
          // colour alone - a struck-through cross over the closed ring.
          <path
            d={`M${cx - crossR} ${cy - crossR} L${cx + crossR} ${cy + crossR} M${cx + crossR} ${cy - crossR} L${cx - crossR} ${cy + crossR}`}
            stroke="var(--surface-bright)" strokeWidth={Math.max(1.2, sw * 0.22)} strokeLinecap="round" />
        ) : null}
      </svg>
    </div>
  );
}

export const meta = {
  DonutGauge: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Feedback & Status',
    usecases: ['credit/usage balance ring', 'ambient status carrier', 'compact score or level indicator'],
    keywords: ['gauge', 'ring', 'donut', 'meter', 'usage', 'credits', 'level', 'circular', 'progress'],
    summary: 'A circular level gauge (role="meter") - a compact ring reporting a static quantity, with an optional colour-escalation ramp as it nears a limit. Fills once on mount and holds; never animates on change.',
    props: [
      { name: 'value', class: 'content', type: 'number', required: true, description: 'The current level.' },
      { name: 'max', class: 'content', type: 'number', default: 100, description: 'The upper bound of the scale.' },
      { name: 'size', class: 'dsPresentation', type: 'number', default: 44, description: 'Diameter in pixels.' },
      { name: 'thickness', class: 'dsPresentation', type: 'number', description: 'Stroke width in pixels. Defaults to roughly size / 6.' },
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Static fill colour when thresholds are omitted: a named status tone, a data tone (data-1..data-6), "primary", or any colour/var.' },
      { name: 'thresholds', class: 'content', type: 'Array<{at: number, tone: string}>', example: 'USAGE_THRESHOLDS', description: 'An escalation ramp: the fill uses the highest threshold whose `at` (percent used) has been reached, else `tone`. Configurable, not hard-coded - see the exported USAGE_THRESHOLDS default ramp (info -> warning at 75% -> error at 90%).' },
      { name: 'unbounded', class: 'dsPresentation', type: 'bool', description: 'For a quantity with no real ceiling (e.g. an Unlimited tier): the ring never closes, its arc is capped short and the trailing end fades via gradient instead of a hard edge.' },
      { name: 'valueText', class: 'a11y', type: 'string', description: 'The aria-valuetext announced by assistive tech, in real units - the ring carries no visible text of its own.' },
      { name: 'aria-label', class: 'a11y', type: 'string', description: 'Accessible name when valueText alone should not carry it.' },
    ],
    bestPractices: [
      { do: true, text: 'Use the exported USAGE_THRESHOLDS (info -> warning at 75% -> error at 90%) as the default escalation ramp for a usage/credit gauge, or pass your own - keep the break points configurable, never hard-coded into a consuming component.' },
      { do: true, text: 'Always supply valueText in real units - the gauge is unlabelled by design; everything readable lives in the accessible name.' },
      { do: false, text: 'Animate the fill on value change, or add a spin/pulse/sweep - it is a gauge that happens to be round, not a loader. Fill once on mount and hold.' },
    ],
    anatomy: [
      { name: 'Track', required: true, description: 'The background ring.' },
      { name: 'Fill', required: true, description: 'The value arc, sized to value/max.' },
      { name: 'Full marker', required: false, description: 'A struck-through cross overlaid when value reaches max (colour-independent "full" signal).' },
    ],
    related: ['Meter', 'Progress', 'Sparkline'],
    composes: [],
    usage: '<DonutGauge value={31} max={50} thresholds={USAGE_THRESHOLDS} valueText="31 of 50 credits remaining" />',
    examples: [
      { name: 'Static tone', code: '<DonutGauge value={38} max={100} tone="info" valueText="38 of 100 used" />', description: 'A single colour throughout, no escalation.' },
      { name: 'Full', code: '<DonutGauge value={50} max={50} thresholds={USAGE_THRESHOLDS} valueText="No credits left" />', description: 'Closed ring + struck-through cross - "full" reads without relying on colour.' },
      { name: 'Unbounded', code: '<DonutGauge value={12} max={100} tone="primary" unbounded valueText="12 credits used - no cap" />', description: 'Arc fades out rather than implying a ceiling that does not exist.' },
    ],
  },
};
