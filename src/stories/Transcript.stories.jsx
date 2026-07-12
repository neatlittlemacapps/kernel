import { Transcript } from '@corilus/kernel/chat';

export default {
  title: 'Chat/Transcript',
  component: Transcript,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "The turns - ChatBubbles, rendered answers, a TypingIndicator, etc.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    scrollKey: { control: false, description: "Change this when a new turn is added (e.g. the last user index or turn count) to trigger the scroll-to-latest.", table: { category: 'Other', type: { summary: "any" } } },
    anchorSelector: { control: 'text', description: "CSS selector for the element to scroll to the top; defaults to the last user ChatBubble.", table: { category: 'Other', defaultValue: { summary: ".krnl-msg--user" }, type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Scrolling conversation container: holds the turns and scrolls the newest anchor (default: the last user bubble) to the top when a turn arrives.\n\n**Import**\n\n```ts\nimport { Transcript } from '@corilus/kernel/chat'\n```\n\n**Do**\n- Drive scrollKey off the thing that marks a new turn (last user index / message count).\n\n**Don't**\n- Reimplement scroll-to-latest per surface - that is what this owns.\n\n**Anatomy**\n- **turns** — The conversation content (children)." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
    anchorSelector: ".krnl-msg--user",
  },
  parameters: { docs: { source: { code: `<Transcript scrollKey={lastUserIdx}>
  {thread.map(turn => <ChatBubble …/>)}
</Transcript>` } } },
};
