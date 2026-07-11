import { Menu } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    trigger: {  control: 'text' , description: "The element that opens the menu (a Btn / IconButton). Used as the Base UI render target, so it must be a forwardRef comp" },
    children: {  control: 'text' , description: "The menu body: MenuItem rows, optionally grouped with MenuGroup / MenuGroupLabel and divided by MenuSeparator." },
    className: {  control: 'text' , description: "Extra class(es) appended to the popup surface, for one-off width or spacing tweaks (e.g. a wide variant)." },
    align: {  control: 'text'  },
    side: {  control: 'text'  },
    sideOffset: {  control: 'text'  },
    open: {  control: 'text'  },
    defaultOpen: {  control: 'text'  },
    onOpenChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Anchored, dismissible dropdown menu of commands (Base UI menu).",
      },
    },
  },
};

export const Default = {
  args: {
    trigger: "...",
    children: "...",
    className: undefined,
    align: undefined,
    side: undefined,
    sideOffset: undefined,
    open: undefined,
    defaultOpen: undefined,
    onOpenChange: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<Menu trigger={<IconButton aria-label="Actions">{Icon.dots({ size: 18 })}</IconButton>}>
  <MenuItem onClick={onRename}>Rename</MenuItem>
  <MenuSeparator />
  <MenuItem onClick={onDelete}>Delete</MenuItem>
</Menu>` },
    },
  },
};
