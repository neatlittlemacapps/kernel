import { Select, SelectItem } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/SelectItem',
  component: SelectItem,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'One option inside a Select. Must be used within <Select>.' } },
  },
};

export const Default = {
  render: () => (
    <Select defaultValue="7 days" placeholder="Duration">
      <SelectItem value="3 days">3 days</SelectItem>
      <SelectItem value="7 days">7 days</SelectItem>
      <SelectItem value="30 days">30 days</SelectItem>
    </Select>
  ),
};
