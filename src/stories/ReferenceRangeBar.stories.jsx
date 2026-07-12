import { ReferenceRangeBar } from '@corilus/kernel/clinical';

export default {
  title: 'Clinical/Primitives/ReferenceRangeBar',
  component: ReferenceRangeBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number', description: "The measured value; positions the marker and decides its in-range or out-of-range styling.", type: { name: 'other', value: 'number', required: true }, table: { category: 'Content', type: { summary: "number" } } },
    low: { control: 'number', description: "Lower bound of the normal band, shown as the left scale tick.", type: { name: 'other', value: 'number', required: true }, table: { category: 'Content', type: { summary: "number" } } },
    high: { control: 'number', description: "Upper bound of the normal band, shown as the right scale tick.", type: { name: 'other', value: 'number', required: true }, table: { category: 'Content', type: { summary: "number" } } },
    absMin: { control: 'number', description: "Left end of the drawn axis. Defaults to 70% of the smaller of value and low when omitted, so the marker never sits on the edge.", table: { category: 'Content', type: { summary: "number" } } },
    absMax: { control: 'number', description: "Right end of the drawn axis. Defaults to 130% of the larger of value and high when omitted.", table: { category: 'Content', type: { summary: "number" } } },
    ariaLabel: { control: 'text', description: "Accessible name for the img-role strip, e.g. the value against its reference range in words.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Horizontal reference-range strip: a normal band plus a marker for the measured value, colour-coded in or out of range.\n\n**Import**\n\n```ts\nimport { ReferenceRangeBar } from '@corilus/kernel/clinical'\n```\n\n**Anatomy**\n- **Track** — The full-width axis the marker travels along.\n- **Normal band** — The shaded span between low and high.\n- **Marker** — The value indicator; styled in-range or out-of-range.\n- **Scale** — The low and high numeric ticks under the track." } },
  },
};

export const Playground = {
  args: {
    value: 5.9,
    low: 4,
    high: 5.6,
    absMin: 0,
    absMax: 0,
  },
  parameters: { docs: { source: { code: `<ReferenceRangeBar value={5.9} low={4} high={5.6} ariaLabel="HbA1c 5.9%, reference 4 to 5.6" />` } } },
};
