import { Inline } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
  argTypes: {
    gap: {  control: 'number' , description: "Space between children; resolves to var(--space-N)." },
    align: {  control: 'select', options: ["start","center","end","stretch","baseline"] , description: "Cross-axis alignment (align-items); defaults to center." },
    justify: {  control: 'select', options: ["start","center","end","between","around","evenly"] , description: "Main-axis distribution (justify-content)." },
    wrap: {  control: 'boolean' , description: "Allow items to wrap to the next line." },
    p: {  control: 'number' , description: "Padding step (var(--space-N)); px/py/pt.. also accepted." },
    children: {  control: 'text' , description: "The inline content." },
  },
  parameters: {
    docs: {
      description: {
        component: "Horizontal flow with a token gap; items vertically centered by default (flex row).",
      },
    },
  },
};

export const Default = {
  args: {
    gap: 0,
    align: "start",
    justify: "start",
    wrap: false,
    p: 0,
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<Inline gap={2} justify="between">
  <Title />
  <Actions />
</Inline>` },
    },
  },
};
