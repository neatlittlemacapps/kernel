// Slider - choose a number (or range) along a track by dragging. Base UI `slider`
// primitive on the .krnl-* token contract. Base UI owns pointer + keyboard + touch
// dragging, min/max/step clamping, ARIA; Kernel styles the track / fill / thumb.
import { Slider as BaseSlider } from '@base-ui-components/react/slider';

const React = window.React;

// Slider - value/defaultValue/onValueChange/min/max/step/disabled pass through.
// A range slider is just defaultValue={[lo, hi]} - the thumb count is derived from
// the value shape (one thumb per value), so the two can never fall out of sync.
export function Slider({ className = '', ...rest }) {
  const vals = rest.value ?? rest.defaultValue;
  const count = Array.isArray(vals) ? Math.max(1, vals.length) : 1;
  // aria-label on Root only names the group <div>; the role="slider" inputs live on
  // each Thumb, so forward it there (aria-labelledby DOES propagate via Root context,
  // so leave it on Root). For a range, distinguish the two thumbs.
  const { ['aria-label']: ariaLabel, ...rootRest } = rest;
  const thumbLabel = (i) => (ariaLabel ? (count > 1 ? `${ariaLabel} ${i === 0 ? 'minimum' : 'maximum'}` : ariaLabel) : undefined);
  return (
    <BaseSlider.Root className={`krnl-slider ${className}`.trim()} {...rootRest}>
      <BaseSlider.Control className="krnl-slider-control">
        <BaseSlider.Track className="krnl-slider-track">
          <BaseSlider.Indicator className="krnl-slider-ind" />
          {Array.from({ length: count }, (_, i) => <BaseSlider.Thumb key={i} className="krnl-slider-thumb" aria-label={thumbLabel(i)} />)}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

export const meta = {
  Slider: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['numeric input by drag', 'range selection'],
    keywords: ['slider', 'range', 'track', 'thumb', 'numeric', 'scrub', 'volume'],
    summary: 'Choose a number or range by dragging along a track (Base UI slider).',
    props: [
      { name: 'aria-label', class: 'a11y', type: 'string',
        description: 'Accessible name; forwarded to each range-input thumb (a range slider suffixes " minimum" / " maximum"). Required - a slider has no intrinsic label. Alternatively pass aria-labelledby (it propagates to the thumbs via the Root).' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.value' },
      { name: 'defaultValue', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.defaultValue' },
      { name: 'onValueChange', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.onValueChange' },
      { name: 'min', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.min' },
      { name: 'max', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.max' },
      { name: 'step', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.step' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Slider.Root.disabled' },
    ],
    bestPractices: [
      { do: true, text: 'Always give the slider an accessible name (aria-label or aria-labelledby) - it has none by default.' },
      { do: true, text: 'Use when the approximate position matters more than the exact number; pair with a visible value readout when precision matters.' },
      { do: false, text: 'Use a Slider for a value that needs an exact typed entry (a dose, a price) - use a number field instead.' },
    ],
    anatomy: [
      { name: 'Track', required: true, description: 'The rail the thumb travels along.' },
      { name: 'Indicator', required: true, description: 'The filled portion from the start to the thumb.' },
      { name: 'Thumb', required: true, description: 'The draggable handle (one per value).' },
    ],
    related: ['Progress'],
    composes: [],
    usage: '<Slider aria-label="Dose" defaultValue={40} />',
    examples: [
      { name: 'Range', code: '<Slider aria-label="Price range" defaultValue={[20, 60]} />', description: 'A [lo, hi] value renders two thumbs automatically.' },
    ],
  },
};
