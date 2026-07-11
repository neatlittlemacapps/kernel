import { Popover } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    trigger: {  control: 'text' , description: "The element that opens the popover (a Btn / IconButton). Base UI render target - must be forwardRef or the popup anchors" },
    title: {  control: 'text' , description: "Optional heading; wired as the accessible name (aria-labelledby) by Base UI." },
    children: {  control: 'text' , description: "The popover body - any content (text, fields, PopoverDescription, a PopoverClose)." },
    className: {  control: 'text' , description: "Extra class(es) appended to the popup surface (e.g. a wider variant)." },
    align: {  control: 'text'  },
    side: {  control: 'text'  },
    sideOffset: {  control: 'text'  },
    open: {  control: 'text'  },
    defaultOpen: {  control: 'text'  },
    onOpenChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Anchored, dismissible surface for rich content (Base UI popover).",
      },
    },
  },
};

export const Default = {
  args: {
    trigger: "...",
    title: "...",
    children: "...",
    className: undefined,
    align: undefined,
    side: undefined,
    sideOffset: undefined,
    open: undefined,
    defaultOpen: undefined,
    onOpenChange: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<Popover title="Filters" trigger={<Btn variant="secondary">Filter</Btn>}>
  <PopoverDescription>Narrow the list.</PopoverDescription>
</Popover>` },
    },
  },
};
