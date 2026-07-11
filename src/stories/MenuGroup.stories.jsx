import { Menu, MenuItem, MenuGroup, MenuGroupLabel, MenuSeparator, IconButton, Icon } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuGroup',
  component: MenuGroup,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A labelled cluster of related Menu items. Must be used within <Menu>.' } },
  },
};

export const Default = {
  render: () => (
    <Menu trigger={<IconButton aria-label="Actions">{Icon.dots({ size: 18 })}</IconButton>}>
      <MenuGroup>
        <MenuGroupLabel>Edit</MenuGroupLabel>
        <MenuItem onClick={() => {}}>Rename</MenuItem>
        <MenuItem onClick={() => {}}>Duplicate</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuItem onClick={() => {}}>Delete</MenuItem>
    </Menu>
  ),
};
