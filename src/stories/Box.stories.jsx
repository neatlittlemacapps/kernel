import { Box } from '@corilus/kernel';

export default {
  title: 'Core/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    p: { control: 'number', description: "Padding step, resolves to var(--space-N). px/py set an axis; pt/pr/pb/pl set one side.", table: { category: 'Appearance', type: { summary: "number" } } },
    px: { control: 'number', description: "Horizontal padding step (left + right).", table: { category: 'Appearance', type: { summary: "number" } } },
    py: { control: 'number', description: "Vertical padding step (top + bottom).", table: { category: 'Appearance', type: { summary: "number" } } },
    bg: { control: 'text', description: "Surface token name; resolves to var(--<bg>), e.g. bg=\"surface-raised\".", table: { category: 'Appearance', type: { summary: "string" } } },
    radius: { control: 'text', description: "Radius token step; resolves to var(--krnl-radius-<radius>), e.g. radius=\"sm\".", table: { category: 'Appearance', type: { summary: "string" } } },
    border: { control: 'boolean', description: "Adds a hairline token border (--border-subtle).", table: { category: 'Appearance', type: { summary: "bool" } } },
    as: { control: 'text', description: "The HTML element to render.", table: { category: 'Appearance', defaultValue: { summary: "div" }, type: { summary: "string" } } },
    children: { control: 'text', description: "The laid-out content.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Primitive layout container: token-driven padding / surface / radius / border.\n\n**Import**\n\n```ts\nimport { Box } from '@corilus/kernel'\n```\n\n**Do**\n- Use Box for a padded / surfaced region; reach for Stack / Inline / Grid when it also arranges children.\n\n**Don't**\n- Hardcode padding in px - pass a space step (p={3}) so spacing stays on the tokenset." } },
  },
};

export const Playground = {
  args: {
    p: 0,
    px: 0,
    py: 0,
    border: false,
    as: "div",
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Box p={4} bg="surface-raised" radius="md" border>...</Box>` } } },
};
