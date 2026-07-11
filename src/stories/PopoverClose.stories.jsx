import { PopoverClose } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/PopoverClose',
  component: PopoverClose,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The control that closes the popover on click (a Btn / IconButton)." },
  },
  parameters: {
    docs: {
      description: {
        component: "A close control inside a Popover; wrap a Btn / IconButton.",
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
      source: { code: `<PopoverClose><IconButton aria-label="Close">{Icon.close({ size: 16 })}</IconButton></PopoverClose>` },
    },
  },
};
