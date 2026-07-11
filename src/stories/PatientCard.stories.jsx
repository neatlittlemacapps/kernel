import { PatientCard, ValueDisplay } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Clinical/PatientCard',
  component: PatientCard,
  tags: ['autodocs'],
  argTypes: {
    stage: { control: 'select', options: ['seed', 'sprout', 'shoot'] },
    tone: { control: 'select', options: ['neutral', 'heart', 'breath', 'oxygen', 'temperature', 'pressure', 'body', 'lab', 'identity', 'condition', 'allergy', 'medication'] },
    status: { control: 'select', options: ['normal', 'borderline', 'high', 'low', 'critical'] },
    loading: { control: 'boolean' },
    error: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Clinical metric card with three fidelity stages (seed/sprout/shoot) and a tone axis for domain color.',
      },
    },
  },
};

export const Default = {
  args: { stage: 'sprout', tone: 'heart', title: 'Heart rate' },
  render: (args) => (
    <PatientCard {...args} value={<ValueDisplay value="72" unit="bpm" />} />
  ),
};

export const Seed = {
  args: { stage: 'seed', tone: 'heart', title: 'Heart rate' },
  render: (args) => (
    <PatientCard {...args} value={<ValueDisplay value="72" unit="bpm" />} />
  ),
};

export const Shoot = {
  args: { stage: 'shoot', tone: 'heart', title: 'Heart rate' },
  render: (args) => (
    <PatientCard {...args} value={<ValueDisplay value="72" unit="bpm" />} />
  ),
};

export const AllTones = {
  name: 'All tones (sprout)',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
      {['heart', 'breath', 'oxygen', 'temperature', 'pressure', 'body', 'lab', 'identity', 'condition', 'allergy', 'medication'].map(t => (
        <PatientCard key={t} stage="sprout" tone={t} title={t} value={<ValueDisplay value="72" unit="bpm" />} />
      ))}
    </div>
  ),
};

export const States = {
  name: 'States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <PatientCard stage="sprout" tone="heart" title="Normal" status="normal" value={<ValueDisplay value="72" unit="bpm" />} />
      <PatientCard stage="sprout" tone="heart" title="Borderline" status="borderline" value={<ValueDisplay value="95" unit="bpm" />} />
      <PatientCard stage="sprout" tone="heart" title="Critical" status="critical" value={<ValueDisplay value="145" unit="bpm" />} />
      <PatientCard stage="sprout" tone="heart" title="Loading" loading value={<ValueDisplay value="--" unit="bpm" />} />
    </div>
  ),
};
