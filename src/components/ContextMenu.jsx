// ContextMenu - right-click / long-press menu. Base UI `context-menu` primitive
// styled through the shared .krnl-menu-* contract (same popup/item look as Menu;
// the difference is the trigger is a region opened by the context-menu gesture,
// not a button). Base UI owns the gesture, keyboard nav, focus, ARIA, positioning.
import { ContextMenu as BaseContextMenu } from '@base-ui-components/react/context-menu';

const React = window.React;

// ContextMenu - wrap the region whose right-click opens the menu. `trigger` is
// the region content (a card, row, canvas); `children` are the items.
export function ContextMenu({ trigger, children, className = '', ...rest }) {
  return (
    <BaseContextMenu.Root {...rest}>
      <BaseContextMenu.Trigger className="krnl-ctxarea">{trigger}</BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner className="krnl-positioner">
          <BaseContextMenu.Popup className={`krnl-menu-popup ${className}`.trim()}>{children}</BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
}

export const ContextMenuItem = React.forwardRef(function ContextMenuItem({ icon, className = '', children, ...rest }, ref) {
  return (
    <BaseContextMenu.Item ref={ref} className={`krnl-menu-item ${className}`.trim()} {...rest}>
      {icon ? <span className="krnl-menu-item-ic" aria-hidden="true">{icon}</span> : null}
      {children}
    </BaseContextMenu.Item>
  );
});

export function ContextMenuSeparator({ className = '', ...rest }) {
  return <BaseContextMenu.Separator className={`krnl-menu-sep ${className}`.trim()} {...rest} />;
}

export const meta = {
  ContextMenu: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['context menu', 'right-click menu'],
    keywords: ['context-menu', 'right-click', 'long-press', 'menu', 'contextual', 'popup'],
    summary: 'Right-click / long-press contextual menu on a region (Base UI context-menu).',
    props: [
      { name: 'trigger', class: 'content', type: 'ReactNode',
        description: 'The region whose context-menu gesture (right-click / long-press) opens the menu, e.g. a card or list row.' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The menu body: ContextMenuItem rows, divided by ContextMenuSeparator.' },
      { name: 'className', class: 'content', type: 'string',
        description: 'Extra class(es) appended to the popup surface.' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.ContextMenu.Root.open' },
      { name: 'onOpenChange', class: 'passThroughControl', passthrough: 'BaseUI.ContextMenu.Root.onOpenChange' },
    ],
    bestPractices: [
      { do: true, text: 'Mirror the primary actions available elsewhere; a context menu is a shortcut, not the only path to an action.' },
      { do: false, text: 'Hide critical actions behind a context menu only - discoverability on touch is poor.' },
    ],
    anatomy: [
      { name: 'Trigger region', required: true, description: 'The area that responds to the context-menu gesture.' },
      { name: 'Popup', required: true, description: 'The portalled surface holding the items (shared .krnl-menu-* look).' },
      { name: 'Item', required: true, description: 'A command row (ContextMenuItem).' },
    ],
    related: ['Menu'],
    composes: [],
    usage: '<ContextMenu trigger={<div className="card">Right-click me</div>}>\n  <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>\n  <ContextMenuSeparator />\n  <ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>\n</ContextMenu>',
  },
  ContextMenuItem: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['context menu'],
    keywords: ['context-menu-item', 'command', 'action', 'row'],
    summary: 'A single command row inside a ContextMenu.',
    props: [
      { name: 'icon', class: 'content', type: 'ReactNode', description: 'Optional leading icon; decorative (aria-hidden).' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The command label (the action).' },
      { name: 'onClick', class: 'event', type: '(event) => void', description: 'Fires on activation; the menu then closes.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.ContextMenu.Item.disabled' },
    ],
    related: ['ContextMenu', 'MenuItem'],
    composes: [],
    usage: '<ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>',
  },
  ContextMenuSeparator: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['context menu'],
    keywords: ['separator', 'divider', 'context-menu'],
    summary: 'A hairline divider between ContextMenu item clusters.',
    props: [],
    related: ['ContextMenu', 'MenuSeparator'],
    composes: [],
    usage: '<ContextMenuSeparator />',
  },
};
