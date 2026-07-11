import { MenuSeparator } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuSeparator',
  component: MenuSeparator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "A hairline divider between Menu item clusters.",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<MenuSeparator />` },
    },
  },
};
