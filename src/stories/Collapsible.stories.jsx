import { Collapsible } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Structure/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    trigger: {  control: 'text' , description: "The always-visible header that toggles the region (a chevron is added automatically)." },
    children: {  control: 'text' , description: "The content revealed when open." },
    open: {  control: 'text'  },
    defaultOpen: {  control: 'text'  },
    onOpenChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "A single region that expands and collapses (Base UI collapsible).",
      },
    },
  },
};

export const Default = {
  args: {
    trigger: "...",
    children: "...",
    open: undefined,
    defaultOpen: undefined,
    onOpenChange: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<Collapsible trigger="Advanced options">
  <p>…</p>
</Collapsible>` },
    },
  },
};
