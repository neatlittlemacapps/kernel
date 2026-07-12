import { Select } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Select/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: "Text shown on the trigger when nothing is chosen. Assumes string item values (value === label); for object values supply a custom Value.", table: { category: 'Content', defaultValue: { summary: "Select…" }, type: { summary: "string" } } },
    children: { control: 'text', description: "The options as SelectItems.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    className: { control: 'text', description: "Extra class(es) appended to the popup surface.", table: { category: 'Content', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Dropdown picker for one value from a list (Base UI select).\n\n**Import**\n\n```ts\nimport { Select } from '@corilus/kernel'\n```\n\n**Do**\n- Use for one choice from a longer list (~6+); for a handful of always-visible options use a RadioGroup.\n\n**Don't**\n- Use a Select to fire actions - a list of commands is a Menu, not a value picker.\n\n**Anatomy**\n- **Trigger** — The closed control showing the current Value + a chevron.\n- **Popup** — The portalled listbox of items.\n- **Item** — One option (SelectItem); a check marks the selected one." } },
  },
};

export const Playground = {
  args: {
    placeholder: "Select…",
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Select defaultValue="7 days" placeholder="Duration">
  <SelectItem value="3 days">3 days</SelectItem>
  <SelectItem value="7 days">7 days</SelectItem>
</Select>` } } },
};
