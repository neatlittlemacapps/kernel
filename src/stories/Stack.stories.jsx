import { Stack } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: {  control: 'number' , description: "Space between children; resolves to var(--space-N)." },
    align: {  control: 'select', options: ["start","center","end","stretch","baseline"] , description: "Cross-axis alignment (align-items)." },
    justify: {  control: 'select', options: ["start","center","end","between","around","evenly"] , description: "Main-axis distribution (justify-content)." },
    p: {  control: 'number' , description: "Padding step (var(--space-N)); px/py/pt.. also accepted." },
    bg: {  control: 'text' , description: "Surface token name -> var(--<bg>)." },
    children: {  control: 'text' , description: "The stacked content." },
  },
  parameters: {
    docs: {
      description: {
        component: "Vertical flow with a token gap (flex column).",
      },
    },
  },
};

export const Default = {
  args: {
    gap: 0,
    align: "start",
    justify: "start",
    p: 0,
    bg: "bg",
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<Stack gap={3}>
  <Field />
  <Field />
</Stack>` },
    },
  },
};
