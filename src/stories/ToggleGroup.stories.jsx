import { ToggleGroup } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The ToggleGroupItem options." },
    value: {  control: 'text'  },
    defaultValue: {  control: 'text'  },
    onValueChange: {  control: 'text'  },
    toggleMultiple: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "A set of related toggle buttons - a segmented control (Base UI toggle-group).",
      },
    },
  },
};

export const Default = {
  args: {
    children: "...",
    value: undefined,
    defaultValue: undefined,
    onValueChange: undefined,
    toggleMultiple: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ToggleGroup defaultValue={["list"]}>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
</ToggleGroup>` },
    },
  },
};
