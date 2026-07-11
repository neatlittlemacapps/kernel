import { AlertDialog } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  argTypes: {
    trigger: {  control: 'text' , description: "Element that opens the alert (a Btn). Omit when controlling open/onOpenChange yourself." },
    title: {  control: 'text' , description: "The decision, phrased as a question (\"Delete prescription?\"); the accessible name." },
    description: {  control: 'text' , description: "The consequence, stated plainly (\"This cannot be undone.\"); wired as aria-describedby." },
    children: {  control: 'text' , description: "Optional extra body content beyond the description." },
    actions: {  control: 'text' , description: "The cancel + confirm controls; wrap cancel in AlertDialogClose and make it the safe default." },
    className: {  control: 'text' , description: "Extra class(es) appended to the surface." },
    open: {  control: 'text'  },
    defaultOpen: {  control: 'text'  },
    onOpenChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Modal that forces a consequential confirmation (Base UI alert-dialog).",
      },
    },
  },
};

export const Default = {
  args: {
    trigger: "...",
    title: "...",
    description: "...",
    children: "...",
    actions: "...",
    className: undefined,
    open: undefined,
    defaultOpen: undefined,
    onOpenChange: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<AlertDialog title="Delete prescription?" description="This cannot be undone."
  trigger={<Btn variant="secondary">Delete</Btn>}
  actions={<><AlertDialogClose><Btn variant="secondary">Cancel</Btn></AlertDialogClose><Btn tone="error">Delete</Btn></>} />` },
    },
  },
};
