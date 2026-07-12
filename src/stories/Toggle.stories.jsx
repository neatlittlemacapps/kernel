import { Toggle } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {  control: 'text'  },
    onCheckedChange: {  control: 'text'  },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "On/off switch (Base UI).",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<Toggle checked={on} onCheckedChange={setOn} />` },
    },
  },
};
