import { Chip, Icon } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    muted: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Compact interactive tag: suggestion, citation, filter, or toggle. Icon-optional.',
      },
    },
  },
};

export const Default = {
  args: { children: 'Summarize' },
};

export const WithIcon = {
  args: {
    icon: Icon.spark({ size: 13 }),
    children: 'Summarize',
  },
};

export const Selected = {
  args: { children: 'Active filter', selected: true },
};

export const Muted = {
  args: { children: 'Muted', muted: true },
};

export const Removable = {
  args: {
    children: 'Penicillin',
    onRemove: () => {},
  },
};

export const Gallery = {
  name: 'Gallery',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Chip>Plain</Chip>
      <Chip icon={Icon.spark({ size: 13 })}>With icon</Chip>
      <Chip selected>Selected</Chip>
      <Chip muted>Muted</Chip>
      <Chip onRemove={() => {}}>Removable</Chip>
      <Chip icon={Icon.spark({ size: 13 })} selected onRemove={() => {}}>All combined</Chip>
    </div>
  ),
};
