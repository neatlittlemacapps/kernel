import { TypingIndicator } from '@corilus/kernel/chat';

export default {
  title: 'Chat/TypingIndicator',
  component: TypingIndicator,
  tags: ['autodocs'],
  argTypes: {
    label: { control: false, description: "Optional status text beside the dots (e.g. \"Searching guidelines…\").", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Three blinking dots + an optional status label - the assistant-is-working affordance in a conversation.\n\n**Import**\n\n```ts\nimport { TypingIndicator } from '@corilus/kernel/chat'\n```\n\n**Do**\n- Show while awaiting an assistant turn; replace it with the ChatBubble/answer once content arrives.\n\n**Anatomy**\n- **dots** — The animated blinking dots.\n- **label** _(optional)_ — Status text." } },
  },
};

export const Playground = {
  args: {
    label: "Label",
  },
  parameters: { docs: { source: { code: `<TypingIndicator label="Searching guidelines…" />` } } },
};
