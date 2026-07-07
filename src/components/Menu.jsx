// Menu - dropdown action menu. Base UI `menu` primitive styled through the
// .krnl-* token contract. Base UI owns behaviour (open/close, keyboard nav,
// focus management, ARIA roles, portal positioning); Kernel owns only the
// token-driven look via the .krnl-menu-* / .krnl-positioner classes in styles.css.
//
// The container bakes in the Root/Trigger/Portal/Positioner/Popup boilerplate
// (the fiddly, repeated part) and takes the trigger as a slot; the items are
// composable children (MenuItem / MenuSeparator / MenuGroup + MenuGroupLabel).
import { Menu as BaseMenu } from '@base-ui-components/react/menu';

const React = window.React;

// Menu - anchored, dismissible dropdown. `trigger` is any element (a Btn /
// IconButton, already forwardRef) used as the Base UI render target, so the
// positioner anchors to it. open/defaultOpen/onOpenChange pass through to the
// Root; align/side/sideOffset pass through to the Positioner.
export function Menu({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  align = 'start',
  side = 'bottom',
  sideOffset = 6,
  className = '',
  ...rest
}) {
  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} {...rest}>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner className="krnl-positioner" align={align} side={side} sideOffset={sideOffset}>
          <BaseMenu.Popup className={`krnl-menu-popup ${className}`.trim()}>{children}</BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

// One selectable command row. Base UI closes the menu + fires onClick on
// activation; disabled is a pass-through. `icon` is an optional leading slot.
export const MenuItem = React.forwardRef(function MenuItem({ icon, className = '', children, ...rest }, ref) {
  return (
    <BaseMenu.Item ref={ref} className={`krnl-menu-item ${className}`.trim()} {...rest}>
      {icon ? <span className="krnl-menu-item-ic" aria-hidden="true">{icon}</span> : null}
      {children}
    </BaseMenu.Item>
  );
});

// Hairline divider between item groups.
export function MenuSeparator({ className = '', ...rest }) {
  return <BaseMenu.Separator className={`krnl-menu-sep ${className}`.trim()} {...rest} />;
}

// A labelled cluster of items (wrap items + a MenuGroupLabel). Dividers between
// groups are drawn explicitly with MenuSeparator - the group itself is a
// semantic wrapper only, so groups never self-separate (no stray/doubled rules).
export function MenuGroup({ className = '', children, ...rest }) {
  return <BaseMenu.Group className={`krnl-menu-grp ${className}`.trim()} {...rest}>{children}</BaseMenu.Group>;
}

// The heading for a MenuGroup (overline-styled section label).
export function MenuGroupLabel({ className = '', children, ...rest }) {
  return <BaseMenu.GroupLabel className={`krnl-menu-section ${className}`.trim()} {...rest}>{children}</BaseMenu.GroupLabel>;
}

// ── component catalog metadata (tree-shaken from the bundle; read by tools/gen-catalog.mjs) ──
export const meta = {
  Menu: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['action menu', 'overflow menu', 'dropdown'],
    keywords: ['menu', 'dropdown', 'overflow', 'kebab', 'actions', 'context', 'popup', 'flyout'],
    summary: 'Anchored, dismissible dropdown menu of commands (Base UI menu).',
    props: [
      { name: 'trigger', class: 'content', type: 'ReactElement',
        description: 'The element that opens the menu (a Btn / IconButton). Used as the Base UI render target, so it must be a forwardRef component or the popup anchors at (0,0).' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The menu body: MenuItem rows, optionally grouped with MenuGroup / MenuGroupLabel and divided by MenuSeparator.' },
      { name: 'className', class: 'content', type: 'string',
        description: 'Extra class(es) appended to the popup surface, for one-off width or spacing tweaks (e.g. a wide variant).' },
      { name: 'align', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Positioner.align' },
      { name: 'side', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Positioner.side' },
      { name: 'sideOffset', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Positioner.sideOffset' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Root.open' },
      { name: 'defaultOpen', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Root.defaultOpen' },
      { name: 'onOpenChange', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Root.onOpenChange' },
    ],
    bestPractices: [
      { do: true, text: 'Use for a set of actions on the same object; give the trigger an accessible name (aria-label) when it is icon-only.' },
      { do: true, text: 'Group related commands with MenuGroup + MenuGroupLabel; divide groups (and set off a destructive action) with a MenuSeparator - groups do not draw their own divider.' },
      { do: false, text: 'Use a Menu to pick one value from a set - that is a Select. A Menu fires actions, it does not hold a value.' },
      { do: false, text: 'Put more than a screen of items in a Menu; for long lists reach for a Select or a Combobox.' },
    ],
    anatomy: [
      { name: 'Trigger', required: true, description: 'The forwardRef element that opens the menu (Btn / IconButton).' },
      { name: 'Popup', required: true, description: 'The portalled, positioned surface holding the items.' },
      { name: 'Item', required: true, description: 'A single command row (MenuItem); fires onClick and closes the menu.' },
      { name: 'Group + GroupLabel', required: false, description: 'A labelled cluster of related items.' },
      { name: 'Separator', required: false, description: 'A hairline divider between clusters.' },
    ],
    related: ['Popover', 'Select', 'ContextMenu'],
    composes: [],
    usage: '<Menu trigger={<IconButton aria-label="Actions">{Icon.dots({ size: 18 })}</IconButton>}>\n  <MenuItem onClick={onRename}>Rename</MenuItem>\n  <MenuSeparator />\n  <MenuItem onClick={onDelete}>Delete</MenuItem>\n</Menu>',
    examples: [
      { name: 'Overflow actions', code: '<Menu trigger={<IconButton aria-label="More">{Icon.dots({ size: 18 })}</IconButton>}>\n  <MenuItem onClick={onEdit}>Edit</MenuItem>\n  <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>\n  <MenuSeparator />\n  <MenuItem onClick={onDelete}>Delete</MenuItem>\n</Menu>' },
      { name: 'Grouped', code: '<Menu trigger={<Btn variant="secondary">Insert</Btn>}>\n  <MenuGroup>\n    <MenuGroupLabel>Blocks</MenuGroupLabel>\n    <MenuItem onClick={addText}>Text</MenuItem>\n    <MenuItem onClick={addImage}>Image</MenuItem>\n  </MenuGroup>\n  <MenuSeparator />\n  <MenuGroup>\n    <MenuGroupLabel>Media</MenuGroupLabel>\n    <MenuItem onClick={addQuote}>Quote</MenuItem>\n  </MenuGroup>\n</Menu>', description: 'Related commands under section labels; a MenuSeparator divides the groups.' },
    ],
  },
  MenuItem: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['action menu'],
    keywords: ['menu-item', 'command', 'action', 'row'],
    summary: 'A single command row inside a Menu.',
    props: [
      { name: 'icon', class: 'content', type: 'ReactNode',
        description: 'Optional leading icon reinforcing the command; decorative (aria-hidden), the label is the accessible name.' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The command label. Write the action ("Delete prescription"), not "OK".' },
      { name: 'onClick', class: 'event', type: '(event) => void',
        description: 'Fires when the item is activated (click or keyboard); the menu closes automatically afterwards.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Menu.Item.disabled' },
    ],
    related: ['Menu'],
    composes: [],
    usage: '<MenuItem onClick={onDelete}>Delete</MenuItem>',
  },
  MenuSeparator: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['action menu'],
    keywords: ['separator', 'divider', 'menu', 'rule'],
    summary: 'A hairline divider between Menu item clusters.',
    props: [],
    related: ['Menu', 'Separator'],
    composes: [],
    usage: '<MenuSeparator />',
  },
  MenuGroup: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['action menu'],
    keywords: ['menu-group', 'group', 'cluster', 'section'],
    summary: 'A labelled cluster of related Menu items.',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'A MenuGroupLabel followed by the MenuItems in the cluster.' },
    ],
    related: ['Menu', 'MenuGroupLabel'],
    composes: [],
    usage: '<MenuGroup><MenuGroupLabel>Blocks</MenuGroupLabel><MenuItem>Text</MenuItem></MenuGroup>',
  },
  MenuGroupLabel: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['action menu'],
    keywords: ['menu-group-label', 'label', 'heading', 'section'],
    summary: 'The heading for a MenuGroup.',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The section heading text; associated with its group for screen readers by Base UI.' },
    ],
    related: ['Menu', 'MenuGroup'],
    composes: [],
    usage: '<MenuGroupLabel>Blocks</MenuGroupLabel>',
  },
};
