import { Grid } from '@corilus/kernel';

export default {
  title: 'Core/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: false, description: "Column count (=> repeat(n, minmax(0,1fr))) or an explicit grid-template-columns string.", table: { category: 'Appearance', type: { summary: "number | string" } } },
    gap: { control: 'number', description: "Gap between cells; resolves to var(--space-N).", table: { category: 'Appearance', type: { summary: "number" } } },
    p: { control: 'number', description: "Padding step (var(--space-N)); px/py/pt.. also accepted.", table: { category: 'Appearance', type: { summary: "number" } } },
    children: { control: 'text', description: "The grid cells.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "CSS grid with a column count (or template) and a token gap.\n\n**Import**\n\n```ts\nimport { Grid } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    gap: 0,
    p: 0,
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Grid columns={2} gap={3}>
  <Card /> <Card />
</Grid>` } } },
};
