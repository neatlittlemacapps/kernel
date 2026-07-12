import { TextInput } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: "Outlined text field.\n\n**Import**\n\n```ts\nimport { TextInput } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  parameters: { docs: { source: { code: `<TextInput placeholder="Search records" />` } } },
};
