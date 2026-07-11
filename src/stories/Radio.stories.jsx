import { Radio } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    label: {  control: 'text' , description: "The clickable text beside the dot." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "One option inside a RadioGroup.",
      },
    },
  },
};

export const Default = {
  args: {
    value: undefined,
    label: "...",
    disabled: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<Radio value="email" label="Email" />` },
    },
  },
};
