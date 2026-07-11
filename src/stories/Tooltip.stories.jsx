import { Tooltip } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    label: {  control: 'text' , description: "Short tooltip text shown on hover / focus of the trigger." },
    children: {  control: 'text' , description: "The trigger element the tooltip is attached to." },
  },
  parameters: {
    docs: {
      description: {
        component: "Tooltip wrapper (Base UI).",
      },
    },
  },
};

export const Default = {
  args: {
    label: "label",
    children: "...",
  },
  parameters: {
    docs: {
      source: { code: `<Tooltip label="Copy"><IconButton aria-label="Copy">{Icon.dots({ size: 16 })}</IconButton></Tooltip>` },
    },
  },
};
