import { IconButton } from '@corilus/kernel';

export default {
  title: 'Core/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean', description: "Renders the pressed / active visual state (e.g. a toggled toolbar button).", table: { category: 'Appearance', type: { summary: "bool" } } },
    variant: { control: 'select', options: ["solid"], description: "Visual treatment. Default is the transparent ghost icon button; `solid` is a filled accent circle for a primary in-place submit (e.g. the composer send).", table: { category: 'Appearance' } },
    children: { control: 'text', description: "The icon element, e.g. Icon.close({ size: 18 }).", table: { category: 'Content', type: { summary: "ReactNode" } } },
    'aria-label': { control: 'text', description: "Accessible name; required since there is no visible label.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Square icon button; Base UI render-target (forwardRef).\n\n**Import**\n\n```ts\nimport { IconButton } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    active: false,
    variant: "solid",
    children: "Content",
  },
  parameters: { docs: { source: { code: `<IconButton aria-label="Close">{Icon.close({ size: 18 })}</IconButton>` } } },
};
