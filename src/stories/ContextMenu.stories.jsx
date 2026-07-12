import { ContextMenu } from '@corilus/kernel';

export default {
  title: 'Core/Overlays/ContextMenu/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: false, description: "The region whose context-menu gesture (right-click / long-press) opens the menu, e.g. a card or list row.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    children: { control: 'text', description: "The menu body: ContextMenuItem rows, divided by ContextMenuSeparator.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    className: { control: 'text', description: "Extra class(es) appended to the popup surface.", table: { category: 'Content', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Right-click / long-press contextual menu on a region (Base UI context-menu).\n\n**Import**\n\n```ts\nimport { ContextMenu } from '@corilus/kernel'\n```\n\n**Do**\n- Mirror the primary actions available elsewhere; a context menu is a shortcut, not the only path to an action.\n\n**Don't**\n- Hide critical actions behind a context menu only - discoverability on touch is poor.\n\n**Anatomy**\n- **Trigger region** — The area that responds to the context-menu gesture.\n- **Popup** — The portalled surface holding the items (shared .krnl-menu-* look).\n- **Item** — A command row (ContextMenuItem)." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
  },
  parameters: { docs: { source: { code: `<ContextMenu trigger={<div className="card">Right-click me</div>}>
  <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>
</ContextMenu>` } } },
};
