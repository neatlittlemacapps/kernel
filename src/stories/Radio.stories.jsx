import { RadioGroup, Radio } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'One option inside a RadioGroup. Must be used within <RadioGroup>.' } },
  },
};

export const Default = {
  render: () => (
    <RadioGroup defaultValue="fax">
      <Radio value="email" label="Email" />
      <Radio value="fax" label="Fax" />
      <Radio value="post" label="Post" />
    </RadioGroup>
  ),
};
