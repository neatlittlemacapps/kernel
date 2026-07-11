import { PopoverDescription } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/PopoverDescription',
  component: PopoverDescription,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The descriptive text." },
  },
  parameters: {
    docs: {
      description: {
        component: "A descriptive paragraph inside a Popover (wires aria-describedby).",
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
      source: { code: `<PopoverDescription>Narrow the list to unresolved items.</PopoverDescription>` },
    },
  },
};
