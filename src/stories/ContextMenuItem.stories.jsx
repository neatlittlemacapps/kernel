import { ContextMenuItem } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/ContextMenuItem',
  component: ContextMenuItem,
  tags: ['autodocs'],
  argTypes: {
    icon: {  control: 'text' , description: "Optional leading icon; decorative (aria-hidden)." },
    children: {  control: 'text' , description: "The command label (the action)." },
    onClick: {  control: false , description: "Fires on activation; the menu then closes." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "A single command row inside a ContextMenu.",
      },
    },
  },
};

export const Default = {
  args: {
    icon: "...",
    children: "...",
    disabled: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>` },
    },
  },
};
