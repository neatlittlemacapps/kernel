import { IconPill } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/IconPill',
  component: IconPill,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The glyph to render (an icon element); tinted by the card tone." },
    label: {  control: 'text' , description: "Accessible name for the pill, which carries an image role." },
  },
  parameters: {
    docs: {
      description: {
        component: "Rounded-square tone-tinted glyph holder for the card leading slot.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "...",
    label: "label",
  },
  parameters: {
    docs: {
      source: { code: `<IconPill label="Hartslag">{Icon.heart({ size: 16 })}</IconPill>` },
    },
  },
};
