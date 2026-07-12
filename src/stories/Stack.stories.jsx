import { Stack } from '@corilus/kernel';

export default {
  title: 'Core/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'number', description: "Space between children; resolves to var(--space-N).", table: { category: 'Appearance', type: { summary: "number" } } },
    align: { control: 'select', options: ["start","center","end","stretch","baseline"], description: "Cross-axis alignment (align-items).", table: { category: 'Appearance' } },
    justify: { control: 'select', options: ["start","center","end","between","around","evenly"], description: "Main-axis distribution (justify-content).", table: { category: 'Appearance' } },
    p: { control: 'number', description: "Padding step (var(--space-N)); px/py/pt.. also accepted.", table: { category: 'Appearance', type: { summary: "number" } } },
    bg: { control: 'text', description: "Surface token name -> var(--<bg>).", table: { category: 'Appearance', type: { summary: "string" } } },
    children: { control: 'text', description: "The stacked content.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Vertical flow with a token gap (flex column).\n\n**Import**\n\n```ts\nimport { Stack } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    gap: 0,
    align: "start",
    justify: "start",
    p: 0,
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Stack gap={3}>
  <Field />
  <Field />
</Stack>` } } },
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {["start","center","end","stretch","baseline"].map((v) => (
        <Stack key={v} align={v}>{v}</Stack>
      ))}
    </div>
  ),
};
