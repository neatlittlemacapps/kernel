import { SproutCard } from '@corilus/kernel';

export default {
  title: 'Kernel/Composite/Data display/SproutCard',
  component: SproutCard,
  tags: ['autodocs'],
  argTypes: {
    initialStage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Starting fidelity in uncontrolled mode. Ignored once stage is passed (controlled mode)." },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Controlled fidelity. When set, the host owns state and no internal view transition runs; pair with onStageChange." },
    onStageChange: {  control: false , description: "Fired with the next stage before it applies. Required in controlled mode; also useful as a change listener while uncontr" },
    render: {  control: false , description: "Render prop (stage, transitions) that returns the per-object card. transitions carries toSeed / toSprout / toShoot / tog" },
    onRooted: {  control: false , description: "Invoked when the render prop calls transitions.rooted, signalling the native-application handoff (the Rooted stage lives" },
    className: {  control: 'text' , description: "Extra class names appended after the canonical shell + stage classes." },
  },
  parameters: {
    docs: {
      description: {
        component: "Stateful wrapper that owns the Seed / Sprout / Shoot stage state and applies the cross-stage view-transition animation. Render-prop based; per-object cards stay presentational.",
      },
    },
  },
};

export const Default = {
  args: {
    initialStage: "seed",
    stage: "seed",
    className: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<SproutCard initialStage="seed" render={(stage, t) => <VitalSignCard data={hr} stage={stage} onEdit={t.toShoot} />} />` },
    },
  },
};
