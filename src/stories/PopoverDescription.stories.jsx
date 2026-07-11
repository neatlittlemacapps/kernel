import { Popover, PopoverDescription, Button } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/PopoverDescription',
  component: PopoverDescription,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A descriptive paragraph inside a Popover (wires aria-describedby). Must be used within <Popover>.' } },
  },
};

export const Default = {
  render: () => (
    <Popover title="Filters" trigger={<Button variant="secondary">Filter</Button>}>
      <PopoverDescription>Narrow the list by date range or status.</PopoverDescription>
    </Popover>
  ),
};
