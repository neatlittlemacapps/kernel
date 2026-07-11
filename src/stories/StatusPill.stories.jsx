import { StatusPill } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Feedback & Status/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  argTypes: {
    status: {  control: 'select', options: ["normal","borderline","high","low","critical"] , description: "Clinical interpretation; drives the dot + label colour. Keep this orthogonal to the card tone, which encodes identity, n" },
    label: {  control: 'text' , description: "The pill text. Falls back to children when omitted." },
    children: {  control: 'text' , description: "Alternative to label; rendered as the pill text when label is not passed." },
  },
  parameters: {
    docs: {
      description: {
        component: "Interpretation pill (dot + label). Tone follows the status, not the card identity tone.",
      },
    },
  },
};

export const Default = {
  args: {
    status: "normal",
    label: "...",
    children: "...",
  },
  parameters: {
    docs: {
      source: { code: `<StatusPill status="high" label="Verhoogd" />` },
    },
  },
};
