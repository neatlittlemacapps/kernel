import { Button } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'text'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Text button with variant (emphasis) + tone (semantic color). Reserve `primary` for the single most important action in a view.',
      },
    },
  },
};

export const Default = {
  args: { variant: 'primary', tone: 'neutral', size: 'md', children: 'Save changes' },
};

export const AllVariants = {
  name: 'Variants',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {['primary', 'secondary', 'tertiary', 'text'].map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};

export const AllTones = {
  name: 'Tones',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {['neutral', 'info', 'success', 'warning', 'error'].map(t => (
        <Button key={t} variant="primary" tone={t}>{t}</Button>
      ))}
    </div>
  ),
};

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
    </div>
  ),
};

export const Disabled = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
};

export const Destructive = {
  args: { variant: 'primary', tone: 'error', children: 'Delete record' },
};
