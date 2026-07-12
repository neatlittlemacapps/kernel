import { Separator } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Structure/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "A visual divider between sections or items (Base UI separator).",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<Separator />` },
    },
  },
};
