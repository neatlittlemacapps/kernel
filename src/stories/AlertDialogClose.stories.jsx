import { AlertDialog, AlertDialogClose, Button } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/AlertDialogClose',
  component: AlertDialogClose,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'The cancel/dismiss control inside an AlertDialog. Must be used within <AlertDialog>.' } },
  },
};

export const Default = {
  render: () => (
    <AlertDialog
      title="Delete prescription?"
      description="This cannot be undone."
      trigger={<Button variant="secondary" tone="error">Delete</Button>}
      actions={
        <>
          <AlertDialogClose><Button variant="secondary">Cancel</Button></AlertDialogClose>
          <Button tone="error">Delete</Button>
        </>
      }
    />
  ),
};
