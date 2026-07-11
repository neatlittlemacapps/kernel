import { MenuItem } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  argTypes: {
    icon: {  control: 'text' , description: "Optional leading icon reinforcing the command; decorative (aria-hidden), the label is the accessible name." },
    children: {  control: 'text' , description: "The command label. Write the action (\"Delete prescription\"), not \"OK\"." },
    onClick: {  control: false , description: "Fires when the item is activated (click or keyboard); the menu closes automatically afterwards." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "A single command row inside a Menu.",
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
      source: { code: `<MenuItem onClick={onDelete}>Delete</MenuItem>` },
    },
  },
};
