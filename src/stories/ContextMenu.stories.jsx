import { ContextMenu } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  argTypes: {
    trigger: {  control: 'text' , description: "The region whose context-menu gesture (right-click / long-press) opens the menu, e.g. a card or list row." },
    children: {  control: 'text' , description: "The menu body: ContextMenuItem rows, divided by ContextMenuSeparator." },
    className: {  control: 'text' , description: "Extra class(es) appended to the popup surface." },
    open: {  control: 'text'  },
    onOpenChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Right-click / long-press contextual menu on a region (Base UI context-menu).",
      },
    },
  },
};

export const Default = {
  args: {
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<ContextMenu trigger={<div className="card">Right-click me</div>}>
  <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>
</ContextMenu>` },
    },
  },
};
