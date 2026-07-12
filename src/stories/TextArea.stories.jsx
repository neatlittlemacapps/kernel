import { TextArea } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    rows: { control: 'number', description: "Initial visible height in text rows; the field still grows via native resize unless disabled in CSS.", table: { category: 'Appearance', defaultValue: { summary: "4" }, type: { summary: "number" } } },
    variant: { control: 'select', options: ["seamless"], description: "Visual treatment. Default is the outlined field; `seamless` is borderless / transparent / flush - for a field embedded in a shell that owns the frame (PromptField / composer).", table: { category: 'Appearance' } },
  },
  parameters: {
    docs: { description: { component: "Multiline text field (native textarea on Kernel tokens).\n\n**Import**\n\n```ts\nimport { TextArea } from '@corilus/kernel'\n```\n\n**Do**\n- Size rows to the expected input; a comment box is ~3-4 rows, a long note more.\n\n**Don't**\n- Use a TextArea for a single-line value (a name, a code) - that is a TextInput.\n\n**Anatomy**\n- **Field** — The multiline input surface." } },
  },
};

export const Playground = {
  args: {
    rows: "4",
    variant: "seamless",
  },
  parameters: { docs: { source: { code: `<TextArea placeholder="Add a note" rows={4} />` } } },
};
