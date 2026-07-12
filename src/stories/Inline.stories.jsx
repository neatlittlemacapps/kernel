import { Inline } from '@corilus/kernel';

export default {
  title: 'Core/Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'number', description: "Space between children; resolves to var(--space-N).", table: { category: 'Appearance', type: { summary: "number" } } },
    align: { control: 'select', options: ["start","center","end","stretch","baseline"], description: "Cross-axis alignment (align-items); defaults to center.", table: { category: 'Appearance' } },
    justify: { control: 'select', options: ["start","center","end","between","around","evenly"], description: "Main-axis distribution (justify-content).", table: { category: 'Appearance' } },
    wrap: { control: 'boolean', description: "Allow items to wrap to the next line.", table: { category: 'Appearance', type: { summary: "bool" } } },
    p: { control: 'number', description: "Padding step (var(--space-N)); px/py/pt.. also accepted.", table: { category: 'Appearance', type: { summary: "number" } } },
    children: { control: 'text', description: "The inline content.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Horizontal flow with a token gap; items vertically centered by default (flex row).\n\n**Import**\n\n```ts\nimport { Inline } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    gap: 0,
    align: "start",
    justify: "start",
    wrap: false,
    p: 0,
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Inline gap={2} justify="between">
  <Title />
  <Actions />
</Inline>` } } },
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {["start","center","end","stretch","baseline"].map((v) => (
        <Inline key={v} align={v}>{v}</Inline>
      ))}
    </div>
  ),
};
