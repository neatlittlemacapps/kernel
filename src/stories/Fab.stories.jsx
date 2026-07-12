import { Fab } from '@corilus/kernel';

export default {
  title: 'Core/Actions/Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "The icon or mark shown in the button (e.g. an AIBadge or an Icon).", table: { category: 'Content', type: { summary: "ReactNode" } } },
    pulse: { control: 'boolean', description: "Adds the token-driven attention pulse ring (e.g. to promote a new capability).", table: { category: 'Appearance', type: { summary: "bool" } } },
    'aria-label': { control: 'text', description: "Accessible name; required since the Fab is icon-only.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Floating action button for one persistent, high-emphasis action.\n\n**Import**\n\n```ts\nimport { Fab } from '@corilus/kernel'\n```\n\n**Do**\n- Use exactly one Fab per surface for the single most important standing action; always give it an aria-label.\n\n**Don't**\n- Stack multiple Fabs or use one for a routine action - it is the loudest control on the screen.\n\n**Anatomy**\n- **Button** — The circular floating control.\n- **Pulse** _(optional)_ — An optional attention ring behind the mark." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
    pulse: false,
  },
  parameters: { docs: { source: { code: `<Fab aria-label="Open assistant"><AIBadge size={24} /></Fab>` } } },
};
