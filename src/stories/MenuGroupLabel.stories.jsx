import { Menu, MenuItem, MenuGroup, MenuGroupLabel, IconButton, Icon } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuGroupLabel',
  component: MenuGroupLabel,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'The heading for a MenuGroup. Must be used within <Menu.Group>.' } },
  },
};

export const Default = {
  render: () => (
    <Menu trigger={<IconButton aria-label="Actions">{Icon.dots({ size: 18 })}</IconButton>}>
      <MenuGroup>
        <MenuGroupLabel>File actions</MenuGroupLabel>
        <MenuItem onClick={() => {}}>Rename</MenuItem>
      </MenuGroup>
    </Menu>
  ),
};
