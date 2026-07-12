import { AIMarker } from '@corilus/kernel';

export default {
  title: 'Core/AI & Identity/AIMarker',
  component: AIMarker,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: "The disclosure text, e.g. \"AI-generated - verify before acting\".", table: { category: 'Content', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "AI-generated / verify provenance marker.\n\n**Import**\n\n```ts\nimport { AIMarker } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  parameters: { docs: { source: { code: `<AIMarker text="AI-generated - verify before acting" />` } } },
};
