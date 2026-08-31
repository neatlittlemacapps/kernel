// Meter - reports a static level or quantity (a quota, balance, or score), never a
// task advancing toward completion (that's Progress). Base UI ships no meter
// primitive, so this is hand-rolled - but it deliberately REUSES Progress's track/
// indicator visual (the literal .krnl-progress-track/-ind classes, see styles.css)
// rather than forking a second stylesheet, and carries `role="meter"` + a real-units
// `aria-valuetext` instead of Progress's `role="progressbar"`. That distinction is the
// whole reason this component exists: a `progressbar` implies motion toward a finish
// line, which is the wrong story for a credit balance or any other static quantity.
import { toneFill } from '../lib/tone.js';

const React = window.React;

export function Meter({ value, max = 100, tone, size = 'md', unbounded, label, valueText, className = '', style, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = toneFill(tone);
  return (
    <div className={`krnl-meter ${className}`.trim()}
      data-size={size !== 'md' ? size : undefined} data-unbounded={unbounded || undefined}
      role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-valuetext={valueText}
      style={fill ? { '--bar-fill': fill, ...style } : style}
      {...rest}>
      {label ? <div className="krnl-progress-label">{label}</div> : null}
      <div className="krnl-progress-track">
        <div className="krnl-progress-ind" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export const meta = {
  Meter: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Feedback & Status',
    usecases: ['credit/usage balance', 'quota remaining', 'static score or level'],
    keywords: ['meter', 'gauge', 'level', 'quota', 'usage', 'balance', 'score', 'credits'],
    summary: 'A static level or quantity (role="meter") - a quota, balance, or score. Shares Progress\'s track/fill visual; use Progress instead for a task advancing to completion.',
    props: [
      { name: 'value', class: 'content', type: 'number', required: true, description: 'The current level.' },
      { name: 'max', class: 'content', type: 'number', default: 100, description: 'The upper bound of the scale.' },
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Fill colour: a named status tone (info/success/warning/error), a data tone (data-1..data-6), "primary", or any colour/var. Omit for the default --action-accent fill.' },
      { name: 'size', class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Track thickness: sm 4px, md 6px (default), lg 10px.' },
      { name: 'unbounded', class: 'dsPresentation', type: 'bool', description: 'Fades the fill\'s trailing edge instead of a hard cap, for a quantity with no real ceiling.' },
      { name: 'label', class: 'content', type: 'ReactNode', description: 'Optional caption above the track. Not the accessible name - see valueText.' },
      { name: 'valueText', class: 'a11y', type: 'string', description: 'The aria-valuetext announced by assistive tech, in real units (e.g. "1.5 of 50 credits remaining, resets 1 September") - not just a bare percentage. Required unless aria-label fully describes the value.' },
      { name: 'aria-label', class: 'a11y', type: 'string', description: 'Accessible name when there is no visible label and valueText alone should not carry it.' },
    ],
    bestPractices: [
      { do: true, text: 'Use for a static quantity - credits remaining, storage used, a risk score - never a task advancing toward completion (that\'s Progress).' },
      { do: true, text: 'Always supply valueText in real units so assistive tech announces the actual meaning, not a bare percentage.' },
      { do: false, text: 'Animate the fill on every value change (a live decrementing "taxi-meter" tally) - a meter reports a snapshot level, not a countdown. Update it silently between renders.' },
    ],
    anatomy: [
      { name: 'Label', required: false, description: 'Optional caption above the track.' },
      { name: 'Track', required: true, description: 'The rail.' },
      { name: 'Indicator', required: true, description: 'The fill, sized to value/max.' },
    ],
    related: ['Progress', 'DonutGauge'],
    composes: [],
    usage: '<Meter value={1.5} max={50} tone="error" label="Credits" valueText="1.5 of 50 credits remaining, resets 1 September" />',
    examples: [
      { name: 'Healthy', code: '<Meter value={38} max={100} tone="info" valueText="38 of 100 used" />', description: 'A quiet, low-emphasis level.' },
      { name: 'Unbounded tier', code: '<Meter value={12} max={100} tone="primary" unbounded valueText="12 credits used - no cap" />', description: 'Fill fades out rather than implying a ceiling that does not exist.' },
    ],
  },
};
