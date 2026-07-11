import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/ContextMenuSeparator',
  component: ContextMenuSeparator,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A hairline divider between ContextMenu item clusters. Must be used within <ContextMenu>.' } },
  },
};

export const Default = {
  render: () => (
    <ContextMenu trigger={<div style={{ padding: '1rem', border: '1px dashed', borderRadius: '4px', cursor: 'context-menu' }}>Right-click me</div>}>
      <ContextMenuItem onClick={() => {}}>Rename</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => {}}>Delete</ContextMenuItem>
    </ContextMenu>
  ),
};
