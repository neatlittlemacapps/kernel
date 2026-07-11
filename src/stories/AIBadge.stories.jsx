import { AIBadge } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Identity/AIBadge',
  component: AIBadge,
  tags: ['autodocs'],
  argTypes: {
    size: {  control: 'number' , description: "Pixel size of the mark." },
    glow: {  control: 'boolean' , description: "Adds the token-driven glow treatment for emphasis." },
  },
  parameters: {
    docs: {
      description: {
        component: "Companion brain mark (inline SVG, token gradient); optional glow.",
      },
    },
  },
};

export const Default = {
  args: {
    size: 0,
    glow: false,
  },
  parameters: {
    docs: {
      source: { code: `<AIBadge size={20} glow />` },
    },
  },
};
