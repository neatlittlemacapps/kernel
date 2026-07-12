import { AIBadge } from '@corilus/kernel';

export default {
  title: 'Core/AI & Identity/AIBadge',
  component: AIBadge,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number', description: "Pixel size of the mark.", table: { category: 'Appearance', type: { summary: "number" } } },
    glow: { control: 'boolean', description: "Adds the token-driven glow treatment for emphasis.", table: { category: 'Appearance', type: { summary: "bool" } } },
  },
  parameters: {
    docs: { description: { component: "Companion brain mark (inline SVG, token gradient); optional glow.\n\n**Import**\n\n```ts\nimport { AIBadge } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    size: 0,
    glow: false,
  },
  parameters: { docs: { source: { code: `<AIBadge size={20} glow />` } } },
};
