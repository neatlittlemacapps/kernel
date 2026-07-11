import { DialogClose } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/DialogClose',
  component: DialogClose,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The control that closes the dialog on click (a Btn / IconButton)." },
  },
  parameters: {
    docs: {
      description: {
        component: "A close control inside a Dialog; wrap a Btn / IconButton.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "...",
  },
  parameters: {
    docs: {
      source: { code: `<DialogClose><Btn variant="secondary">Cancel</Btn></DialogClose>` },
    },
  },
};
