import { TrendChip } from '@corilus/kernel';

export default {
  title: 'Core/Data Display/TrendChip',
  component: TrendChip,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ["up","down","flat"], description: "Movement direction; selects the arrow glyph and the chip colour treatment.", table: { category: 'Appearance', defaultValue: { summary: "flat" } } },
    value: { control: false, description: "The delta magnitude shown beside the arrow (e.g. \"+3\" or \"2 mmHg\").", table: { category: 'Content', type: { summary: "node" } } },
    label: { control: 'text', description: "Accessible name for the chip; describes the trend for screen readers since the arrow is decorative.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Compact delta indicator with a direction arrow (up / down / flat).\n\n**Import**\n\n```ts\nimport { TrendChip } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Arrow** — Decorative direction glyph set from direction.\n- **Value** — The delta magnitude text." } },
  },
};

export const Playground = {
  args: {
    direction: "flat",
    value: "+3",
    label: "Gestegen met 3",
  },
  parameters: { docs: { source: { code: `<TrendChip direction="up" value="+3" label="Gestegen met 3" />` } } },
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {["up","down","flat"].map((v) => (
        <TrendChip key={v} direction={v}>{v}</TrendChip>
      ))}
    </div>
  ),
};
