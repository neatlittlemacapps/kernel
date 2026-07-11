import { SelectItem } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/SelectItem',
  component: SelectItem,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    children: {  control: 'text' , description: "The visible option label." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "One option inside a Select.",
      },
    },
  },
};

export const Default = {
  args: {
    value: undefined,
    children: "...",
    disabled: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<SelectItem value="7 days">7 days</SelectItem>` },
    },
  },
};
