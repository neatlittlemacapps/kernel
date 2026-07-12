import { Fab } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The icon or mark shown in the button (e.g. an AIBadge or an Icon)." },
    pulse: {  control: 'boolean' , description: "Adds the token-driven attention pulse ring (e.g. to promote a new capability)." },
    'aria-label': {  control: 'text' , description: "Accessible name; required since the Fab is icon-only." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Floating action button for one persistent, high-emphasis action.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "Content",
    pulse: false,
    'aria-label': "aria-label",
  },
  parameters: {
    docs: {
      source: { code: `<Fab aria-label="Open assistant"><AIBadge size={24} /></Fab>` },
    },
  },
};
