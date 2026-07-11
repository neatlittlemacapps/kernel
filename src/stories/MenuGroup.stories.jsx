import { MenuGroup } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuGroup',
  component: MenuGroup,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "A MenuGroupLabel followed by the MenuItems in the cluster." },
  },
  parameters: {
    docs: {
      description: {
        component: "A labelled cluster of related Menu items.",
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
      source: { code: `<MenuGroup><MenuGroupLabel>Blocks</MenuGroupLabel><MenuItem>Text</MenuItem></MenuGroup>` },
    },
  },
};
