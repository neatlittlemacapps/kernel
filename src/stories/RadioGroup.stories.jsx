import { RadioGroup } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Radio/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "The Radio options.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Pick exactly one option from a small set (Base UI radio-group).\n\n**Import**\n\n```ts\nimport { RadioGroup } from '@corilus/kernel'\n```\n\n**Do**\n- Use for 2-5 mutually exclusive options that are all worth showing at once; above ~6, use a Select.\n\n**Don't**\n- Use a RadioGroup for independent on/off options - those are Checkboxes.\n\n**Anatomy**\n- **Group** — The container enforcing single selection.\n- **Radio** — One option (dot + label)." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
  },
  parameters: { docs: { source: { code: `<RadioGroup defaultValue="fax">
  <Radio value="email" label="Email" />
  <Radio value="fax" label="Fax" />
</RadioGroup>` } } },
};
