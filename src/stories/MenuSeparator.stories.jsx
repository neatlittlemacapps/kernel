import { Menu, MenuItem, MenuSeparator, IconButton, Icon } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuSeparator',
  component: MenuSeparator,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A hairline divider between Menu item clusters. Must be used within <Menu>.' } },
  },
};

export const Default = {
  render: () => (
    <Menu trigger={<IconButton aria-label="Actions">{Icon.dots({ size: 18 })}</IconButton>}>
      <MenuItem onClick={() => {}}>Rename</MenuItem>
      <MenuSeparator />
      <MenuItem onClick={() => {}}>Delete</MenuItem>
    </Menu>
  ),
};
