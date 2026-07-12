import { Slider } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    'aria-label': { control: 'text', description: "Accessible name; forwarded to each range-input thumb (a range slider suffixes \" minimum\" / \" maximum\"). Required - a slider has no intrinsic label. Alternatively pass aria-labelledby (it propagates to the thumbs via the Root).", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Choose a number or range by dragging along a track (Base UI slider).\n\n**Import**\n\n```ts\nimport { Slider } from '@corilus/kernel'\n```\n\n**Do**\n- Always give the slider an accessible name (aria-label or aria-labelledby) - it has none by default.\n- Use when the approximate position matters more than the exact number; pair with a visible value readout when precision matters.\n\n**Don't**\n- Use a Slider for a value that needs an exact typed entry (a dose, a price) - use a number field instead.\n\n**Anatomy**\n- **Track** — The rail the thumb travels along.\n- **Indicator** — The filled portion from the start to the thumb.\n- **Thumb** — The draggable handle (one per value)." } },
  },
};

export const Playground = {
  args: {
    defaultValue: 40,
  },
  parameters: { docs: { source: { code: `<Slider aria-label="Dose" defaultValue={40} />` } } },
};
