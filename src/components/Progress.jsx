// Progress - determinate progress of a task toward completion. Base UI `progress`
// primitive on the .krnl-* token contract. Base UI owns the ARIA (role=progressbar
// + value/min/max) and sizes the indicator; Kernel styles the track + fill.
// (For a gauge/score of a fixed quantity use a Meter, not Progress - different
// semantics: progress moves toward done, a meter reports a level. Meter reuses this
// component's track/indicator CSS - see .krnl-progress-track/-ind in styles.css.)
import { Progress as BaseProgress } from '@base-ui-components/react/progress';
import { toneFill } from '../lib/tone.js';

const React = window.React;

// Progress - `value` (0..max) drives the fill; `max` defaults to 100. `label` is an
// optional caption above the track AND the accessible name. Omit `value` (null) for
// an indeterminate bar. If you omit `label`, you MUST pass an `aria-label` (via rest)
// or the progressbar has no accessible name - Base UI only names it from a mounted Label.
//
// `size` (track thickness) and `tone` (fill colour) are independent presentation axes;
// `tone` omitted keeps today's default --action-solid fill unchanged. `unbounded` fades
// the fill's trailing edge instead of a hard cap, for a quantity with no real ceiling.
export function Progress({ value, max, label, size = 'md', tone, unbounded, className = '', style, ...rest }) {
  const fill = toneFill(tone);
  return (
    <BaseProgress.Root className={`krnl-progress ${className}`.trim()}
      data-size={size !== 'md' ? size : undefined} data-unbounded={unbounded || undefined}
      style={fill ? { '--bar-fill': fill, ...style } : style}
      value={value} max={max} {...rest}>
      {label ? <BaseProgress.Label className="krnl-progress-label">{label}</BaseProgress.Label> : null}
      <BaseProgress.Track className="krnl-progress-track">
        <BaseProgress.Indicator className="krnl-progress-ind" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export const meta = {
  Progress: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Feedback & Status',
    usecases: ['task progress', 'upload/download', 'multi-step completion'],
    keywords: ['progress', 'progressbar', 'loading', 'completion', 'percent', 'bar'],
    summary: 'Determinate progress of a task toward completion (Base UI progress).',
    props: [
      { name: 'label', class: 'content', type: 'ReactNode',
        description: 'Caption above the track; also the accessible name. If omitted you must supply aria-label instead.' },
      { name: 'aria-label', class: 'a11y', type: 'string',
        description: 'Accessible name when there is no visible label. Exactly one of label / aria-label is required - Base UI names the progressbar only from a mounted label, so a bare bar is otherwise unnamed (WCAG 4.1.2).' },
      { name: 'size', class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Track thickness: sm 4px, md 6px (default), lg 10px.' },
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Fill colour: a named status tone (info/success/warning/error), a data tone (data-1..data-6), "primary" (the brand action colour), or any colour/var. Omit to keep the default --action-solid fill.' },
      { name: 'unbounded', class: 'dsPresentation', type: 'bool', description: 'Fades the fill\'s trailing edge instead of a hard right cap, for a quantity that has no real ceiling (e.g. an Unlimited tier\'s own usage bar).' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Progress.Root.value', example: 64 },
      { name: 'max', class: 'passThroughControl', passthrough: 'BaseUI.Progress.Root.max', example: 100 },
    ],
    bestPractices: [
      { do: true, text: 'Give every Progress a name: a visible label, or aria-label when the bar stands alone. Without one the progressbar is unnamed.' },
      { do: true, text: 'Use for a task with a knowable percentage (upload, import); pair with a value so progress is legible.' },
      { do: false, text: 'Use Progress to report a static level or score (battery, risk) - that is a Meter. Progress implies movement toward done.' },
    ],
    anatomy: [
      { name: 'Label', required: false, description: 'Caption + accessible name.' },
      { name: 'Track', required: true, description: 'The rail.' },
      { name: 'Indicator', required: true, description: 'The fill, sized to value/max by Base UI.' },
    ],
    related: ['Slider', 'Meter', 'DonutGauge'],
    composes: [],
    usage: '<Progress label="Uploading" value={64} />',
    examples: [
      { name: 'Toned, large', code: '<Progress aria-label="Import" value={40} size="lg" tone="success" />', description: 'A fatter bar in a semantic tone.' },
      { name: 'Unbounded', code: '<Progress aria-label="Storage" value={82} tone="primary" unbounded />', description: 'Fill fades at the trailing edge instead of terminating - use for a quantity with no real ceiling.' },
    ],
  },
};
