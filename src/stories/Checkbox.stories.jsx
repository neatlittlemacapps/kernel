import { Checkbox } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {  control: 'text' , description: "Text beside the box; the whole row toggles. Omit for a bare box (label it elsewhere)." },
    checked: {  control: 'text'  },
    defaultChecked: {  control: 'text'  },
    onCheckedChange: {  control: 'text'  },
    indeterminate: {  control: 'text'  },
    disabled: {  control: 'text'  },
    required: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Single boolean checkbox with an optional label (Base UI checkbox).",
      },
    },
  },
};

export const Default = {
  args: {
    label: "label",
  },
  parameters: {
    docs: {
      source: { code: `<Checkbox label="Email me updates" defaultChecked />` },
    },
  },
};
