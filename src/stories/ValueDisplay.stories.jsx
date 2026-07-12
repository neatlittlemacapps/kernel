import { ValueDisplay } from '@corilus/kernel';

export default {
  title: 'Core/Data Display/ValueDisplay',
  component: ValueDisplay,
  tags: ['autodocs'],
  argTypes: {
    value: { control: false, description: "The primary reading, rendered large (e.g. 74).", table: { category: 'Content', type: { summary: "string|number" } } },
    unit: { control: 'text', description: "Small trailing unit shown after the value (e.g. \"bpm\").", table: { category: 'Content', type: { summary: "string" } } },
    prefix: { control: 'text', description: "Optional small marker before the value (e.g. a comparator like \"<\").", table: { category: 'Content', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Big numeric value + small unit; the canonical value-slot content for vitals and labs.\n\n**Import**\n\n```ts\nimport { ValueDisplay } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Prefix** _(optional)_ — Optional leading marker.\n- **Value** — The large numeric reading.\n- **Unit** _(optional)_ — The small trailing unit." } },
  },
};

export const Playground = {
  args: {
    value: 74,
    unit: "bpm",
  },
  parameters: { docs: { source: { code: `<ValueDisplay value="74" unit="bpm" />` } } },
};
