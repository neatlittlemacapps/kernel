import { Stepper } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    unit: { control: 'text', description: "Small trailing unit shown after the editable value (e.g. \"bpm\").", table: { category: 'Content', type: { summary: "string" } } },
    onChange: { control: false, description: "Called with the new numeric value on each change; wraps the Base UI onValueChange and skips null (mid-edit) values.", table: { category: 'Events', type: { summary: "fn" } } },
    ariaLabel: { control: 'text', description: "Accessible name for the number field, since there is no visible label.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Shoot-stage editable value (minus / value / plus). No save; the consumer provides the CTA in the actions slot.\n\n**Import**\n\n```ts\nimport { Stepper } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Decrement** — The minus button.\n- **Input** — The editable numeric field.\n- **Increment** — The plus button." } },
  },
};

export const Playground = {
  args: {
    value: 72,
    min: 30,
    max: 220,
    step: 1,
  },
  parameters: { docs: { source: { code: `<Stepper value={72} unit="bpm" min={30} max={220} onChange={setBpm} ariaLabel="Hartslag" />` } } },
};
