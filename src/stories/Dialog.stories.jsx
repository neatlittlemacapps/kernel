import { Dialog } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    trigger: {  control: 'text' , description: "Optional element that opens the dialog (a Btn). Omit when controlling open/onOpenChange yourself." },
    title: {  control: 'text' , description: "The dialog heading; wired as the accessible name (aria-labelledby)." },
    description: {  control: 'text' , description: "Supporting line under the title; wired as aria-describedby." },
    children: {  control: 'text' , description: "The dialog body content." },
    actions: {  control: 'text' , description: "Footer controls, typically a DialogClose-wrapped cancel and a confirm Btn; right-aligned." },
    className: {  control: 'text' , description: "Extra class(es) appended to the dialog surface (e.g. a wider variant)." },
    open: {  control: 'text'  },
    defaultOpen: {  control: 'text'  },
    onOpenChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Modal surface for a focused task or confirmation (Base UI dialog).",
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
      source: { code: `<Dialog title="Rename file" trigger={<Btn>Rename</Btn>}
  actions={<><DialogClose><Btn variant="secondary">Cancel</Btn></DialogClose><Btn>Save</Btn></>}>
  <TextInput defaultValue="report.pdf" />
</Dialog>` },
    },
  },
};
