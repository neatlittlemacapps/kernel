import { Dialog, DialogClose, Button, TextInput } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/DialogClose',
  component: DialogClose,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A close control inside a Dialog. Must be used within <Dialog>.' } },
  },
};

export const Default = {
  render: () => (
    <Dialog
      title="Rename file"
      trigger={<Button>Rename</Button>}
      actions={
        <>
          <DialogClose><Button variant="secondary">Cancel</Button></DialogClose>
          <Button>Save</Button>
        </>
      }
    >
      <TextInput defaultValue="report.pdf" />
    </Dialog>
  ),
};
