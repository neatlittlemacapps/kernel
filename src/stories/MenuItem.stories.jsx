import { Menu, MenuItem, MenuSeparator, IconButton, Icon } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A single command row inside a Menu. Must be rendered within <Menu>.' } },
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
