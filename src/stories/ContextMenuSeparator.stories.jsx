import { ContextMenuSeparator } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/ContextMenuSeparator',
  component: ContextMenuSeparator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "A hairline divider between ContextMenu item clusters.",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<ContextMenuSeparator />` },
    },
  },
};
