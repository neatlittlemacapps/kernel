import { Tip } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/Tip',
  component: Tip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "Deprecated alias of Tooltip (B-39). Use Tooltip; Tip is removed on the next major.",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<Tooltip label="Copy"><IconButton aria-label="Copy">{Icon.dots({ size: 16 })}</IconButton></Tooltip>` },
    },
  },
};
