import { AlertDialogClose } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/AlertDialogClose',
  component: AlertDialogClose,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The control that dismisses the alert (a Btn); make it the safe default." },
  },
  parameters: {
    docs: {
      description: {
        component: "The cancel / dismiss control inside an AlertDialog; wrap a Btn.",
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
      source: { code: `<AlertDialogClose><Btn variant="secondary">Cancel</Btn></AlertDialogClose>` },
    },
  },
};
