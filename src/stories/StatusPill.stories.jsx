import { StatusPill } from '@corilus/kernel';

export default {
  title: 'Core/Feedback & Status/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ["normal","borderline","high","low","critical"], description: "Clinical interpretation; drives the dot + label colour. Keep this orthogonal to the card tone, which encodes identity, not interpretation.", table: { category: 'Appearance', defaultValue: { summary: "normal" } } },
    label: { control: false, description: "The pill text. Falls back to children when omitted.", table: { category: 'Content', type: { summary: "node" } } },
    children: { control: 'text', description: "Alternative to label; rendered as the pill text when label is not passed.", table: { category: 'Content', type: { summary: "node" } } },
  },
  parameters: {
    docs: { description: { component: "Interpretation pill (dot + label). Tone follows the status, not the card identity tone.\n\n**Import**\n\n```ts\nimport { StatusPill } from '@corilus/kernel'\n```\n\n**Do**\n- Drive the pill from the measurement interpretation (normal / critical / ...), independent of the card identity tone.\n\n**Don't**\n- Pass the card identity tone into status; that conflates identity and interpretation.\n\n**Anatomy**\n- **Dot** — Small status-coloured indicator dot.\n- **Label** — The interpretation text." } },
  },
};

export const Playground = {
  args: {
    status: "normal",
    label: "Normaal",
    children: "Content",
  },
  parameters: { docs: { source: { code: `<StatusPill status="high" label="Verhoogd" />` } } },
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {["normal","borderline","high","low","critical"].map((v) => (
        <StatusPill key={v} status={v}>{v}</StatusPill>
      ))}
    </div>
  ),
};
