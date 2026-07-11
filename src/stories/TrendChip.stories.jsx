import { TrendChip } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/TrendChip',
  component: TrendChip,
  tags: ['autodocs'],
  argTypes: {
    direction: {  control: 'select', options: ["up","down","flat"] , description: "Movement direction; selects the arrow glyph and the chip colour treatment." },
    value: {  control: 'text' , description: "The delta magnitude shown beside the arrow (e.g. \"+3\" or \"2 mmHg\")." },
    label: {  control: 'text' , description: "Accessible name for the chip; describes the trend for screen readers since the arrow is decorative." },
  },
  parameters: {
    docs: {
      description: {
        component: "Compact delta indicator with a direction arrow (up / down / flat).",
      },
    },
  },
};

export const Default = {
  args: {
    direction: "up",
    value: "...",
    label: "label",
  },
  parameters: {
    docs: {
      source: { code: `<TrendChip direction="up" value="+3" label="Gestegen met 3" />` },
    },
  },
};
