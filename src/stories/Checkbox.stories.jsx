import { Checkbox } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: false, description: "Text beside the box; the whole row toggles. Omit for a bare box (label it elsewhere).", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Single boolean checkbox with an optional label (Base UI checkbox).\n\n**Import**\n\n```ts\nimport { Checkbox } from '@corilus/kernel'\n```\n\n**Do**\n- Use for independent on/off options; use a RadioGroup when exactly one of several must be chosen.\n- Write the label as a positive statement (\"Email me updates\"), so checked = the stated thing is true.\n\n**Don't**\n- Use a Checkbox to switch a setting on immediately - that is a Toggle (switch).\n\n**Anatomy**\n- **Box** — The square control carrying the checked/indeterminate state.\n- **Indicator** — The checkmark shown when checked.\n- **Label** _(optional)_ — The clickable text." } },
  },
};

export const Playground = {
  args: {
    label: "Label",
  },
  parameters: { docs: { source: { code: `<Checkbox label="Email me updates" defaultChecked />` } } },
};
