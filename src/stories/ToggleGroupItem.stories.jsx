import { ToggleGroupItem } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/ToggleGroupItem',
  component: ToggleGroupItem,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    children: {  control: 'text' , description: "The option label." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "One option inside a ToggleGroup.",
      },
    },
  },
};

export const Default = {
  args: {
    value: undefined,
    children: "...",
    disabled: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ToggleGroupItem value="grid">Grid</ToggleGroupItem>` },
    },
  },
};
