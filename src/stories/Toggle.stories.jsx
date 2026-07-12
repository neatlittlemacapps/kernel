import { Toggle } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Toggle/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: "On/off switch (Base UI).\n\n**Import**\n\n```ts\nimport { Toggle } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  parameters: { docs: { source: { code: `<Toggle checked={on} onCheckedChange={setOn} />` } } },
};
