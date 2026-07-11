import { Btn } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/Btn',
  component: Btn,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "Deprecated alias of Button (B-39). Use Button; Btn is removed on the next major.",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<Button variant="primary">Save changes</Button>` },
    },
  },
};
