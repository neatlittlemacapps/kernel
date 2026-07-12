import { IconPill } from '@corilus/kernel';

export default {
  title: 'Core/Data Display/IconPill',
  component: IconPill,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "The glyph to render (an icon element); tinted by the card tone.", table: { category: 'Content', type: { summary: "node" } } },
    label: { control: 'text', description: "Accessible name for the pill, which carries an image role.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Rounded-square tone-tinted glyph holder for the card leading slot.\n\n**Import**\n\n```ts\nimport { IconPill } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    children: "Content",
    label: "Label",
  },
  parameters: { docs: { source: { code: `<IconPill label="Hartslag">{Icon.heart({ size: 16 })}</IconPill>` } } },
};
