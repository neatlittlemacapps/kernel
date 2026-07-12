import { Grid } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: {  control: 'text' , description: "Column count (=> repeat(n, minmax(0,1fr))) or an explicit grid-template-columns string." },
    gap: {  control: 'number' , description: "Gap between cells; resolves to var(--space-N)." },
    p: {  control: 'number' , description: "Padding step (var(--space-N)); px/py/pt.. also accepted." },
    children: {  control: 'text' , description: "The grid cells." },
  },
  parameters: {
    docs: {
      description: {
        component: "CSS grid with a column count (or template) and a token gap.",
      },
    },
  },
};

export const Default = {
  args: {
    gap: 0,
    p: 0,
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<Grid columns={2} gap={3}>
  <Card /> <Card />
</Grid>` },
    },
  },
};
