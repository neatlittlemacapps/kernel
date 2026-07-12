import { Transcript } from '@corilus/kernel/chat';

export default {
  title: 'Kernel/Atom/Communication/Transcript',
  component: Transcript,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The turns - ChatBubbles, rendered answers, a TypingIndicator, etc." },
    scrollKey: {  control: 'text' , description: "Change this when a new turn is added (e.g. the last user index or turn count) to trigger the scroll-to-latest." },
    anchorSelector: {  control: 'text' , description: "CSS selector for the element to scroll to the top; defaults to the last user ChatBubble." },
  },
  parameters: {
    docs: {
      description: {
        component: "Scrolling conversation container: holds the turns and scrolls the newest anchor (default: the last user bubble) to the top when a turn arrives.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "Content",
    anchorSelector: "anchorSelector",
  },
  parameters: {
    docs: {
      source: { code: `<Transcript scrollKey={lastUserIdx}>
  {thread.map(turn => <ChatBubble …/>)}
</Transcript>` },
    },
  },
};
