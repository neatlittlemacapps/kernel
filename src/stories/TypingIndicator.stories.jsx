import { TypingIndicator } from '@corilus/kernel/chat';

export default {
  title: 'Kernel/Atom/Communication/TypingIndicator',
  component: TypingIndicator,
  tags: ['autodocs'],
  argTypes: {
    label: {  control: 'text' , description: "Optional status text beside the dots (e.g. \"Searching guidelines…\")." },
  },
  parameters: {
    docs: {
      description: {
        component: "Three blinking dots + an optional status label - the assistant-is-working affordance in a conversation.",
      },
    },
  },
};

export const Default = {
  args: {
    label: "...",
  },
  parameters: {
    docs: {
      source: { code: `<TypingIndicator label="Searching guidelines…" />` },
    },
  },
};
