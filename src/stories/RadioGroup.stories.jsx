import { RadioGroup } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The Radio options." },
    value: {  control: 'text'  },
    defaultValue: {  control: 'text'  },
    onValueChange: {  control: 'text'  },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Pick exactly one option from a small set (Base UI radio-group).",
      },
    },
  },
};

export const Default = {
  args: {
    children: "...",
    value: undefined,
    defaultValue: undefined,
    onValueChange: undefined,
    disabled: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<RadioGroup defaultValue="fax">
  <Radio value="email" label="Email" />
  <Radio value="fax" label="Fax" />
</RadioGroup>` },
    },
  },
};
