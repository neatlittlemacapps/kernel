import { Trigger } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/AI/Trigger',
  component: Trigger,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['nav', 'fab', 'mobile', 'action', 'inline', 'explain'] },
    discovery: { control: 'select', options: ['idle', 'staged', 'promotion'] },
    stagedCount: { control: 'number' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'The AI entry point: six placements x three discovery states compose the Juglans discovery ladder.',
      },
    },
  },
};

export const Default = {
  args: { placement: 'nav', label: 'Juglans', discovery: 'idle', onClick: () => {} },
};

export const Staged = {
  args: { placement: 'nav', label: 'Juglans', discovery: 'staged', stagedCount: 2, onClick: () => {} },
};

export const Promotion = {
  args: { placement: 'nav', label: 'Juglans', discovery: 'promotion', onClick: () => {}, onPromotionDismiss: () => {} },
};

export const AllPlacements = {
  name: 'All placements (idle)',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {['nav', 'fab', 'mobile', 'action', 'inline', 'explain'].map(p => (
        <Trigger key={p} placement={p} label="Juglans" discovery="idle" onClick={() => {}} />
      ))}
    </div>
  ),
};

export const DiscoveryLadder = {
  name: 'Discovery ladder (nav)',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Trigger placement="nav" label="Juglans" discovery="idle" onClick={() => {}} />
      <Trigger placement="nav" label="Juglans" discovery="staged" stagedCount={3} onClick={() => {}} />
      <Trigger placement="nav" label="Juglans" discovery="promotion" onClick={() => {}} onPromotionDismiss={() => {}} />
    </div>
  ),
};
