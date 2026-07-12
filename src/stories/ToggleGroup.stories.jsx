import { ToggleGroup } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/Toggle/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "The ToggleGroupItem options.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "A set of related toggle buttons - a segmented control (Base UI toggle-group).\n\n**Import**\n\n```ts\nimport { ToggleGroup } from '@corilus/kernel'\n```\n\n**Do**\n- Use for 2-4 mutually exclusive views/modes shown at once (a segmented control); keep labels short.\n\n**Don't**\n- Use a ToggleGroup for one on/off setting - that is a Toggle (switch); or for many options - that is a Select.\n\n**Anatomy**\n- **Group** — The segmented container.\n- **Item** — One toggle option (ToggleGroupItem); pressed state via [data-pressed]." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
  },
  parameters: { docs: { source: { code: `<ToggleGroup defaultValue={["list"]}>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
</ToggleGroup>` } } },
};
