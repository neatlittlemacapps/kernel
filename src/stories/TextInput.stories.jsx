import { TextInput } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    onChange: {  control: 'text'  },
    placeholder: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Outlined text field.",
      },
    },
  },
};

export const Default = {
  args: {
    value: undefined,
    onChange: undefined,
    placeholder: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<TextInput placeholder="Search records" />` },
    },
  },
};
