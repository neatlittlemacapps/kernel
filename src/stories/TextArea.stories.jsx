import { TextArea } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    rows: {  control: 'number' , description: "Initial visible height in text rows; the field still grows via native resize unless disabled in CSS." },
    variant: {  control: 'select', options: ["seamless"] , description: "Visual treatment. Default is the outlined field; `seamless` is borderless / transparent / flush - for a field embedded i" },
    value: {  control: 'text'  },
    defaultValue: {  control: 'text'  },
    onChange: {  control: 'text'  },
    placeholder: {  control: 'text'  },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Multiline text field (native textarea on Kernel tokens).",
      },
    },
  },
};

export const Default = {
  args: {
    rows: 0,
    variant: "seamless",
  },
  parameters: {
    docs: {
      source: { code: `<TextArea placeholder="Add a note" rows={4} />` },
    },
  },
};
