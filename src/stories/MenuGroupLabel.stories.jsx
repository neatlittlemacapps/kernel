import { MenuGroupLabel } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuGroupLabel',
  component: MenuGroupLabel,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The section heading text; associated with its group for screen readers by Base UI." },
  },
  parameters: {
    docs: {
      description: {
        component: "The heading for a MenuGroup.",
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
      source: { code: `<MenuGroupLabel>Blocks</MenuGroupLabel>` },
    },
  },
};
