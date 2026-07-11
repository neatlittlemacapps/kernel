// ChatBubble - one conversation turn. Generic chat primitive (Kernel ./chat):
// `role` sets the alignment + bubble treatment (assistant left with a tailed
// bubble + leading mark; user right, accent fill). `avatar` is the optional
// leading mark - defaults to <AIBadge> for the assistant, nothing for the user;
// pass to override (a person avatar, another agent's mark, or null). Content is
// the message body (plain text or rich nodes). Token-styled via .krnl-msg*.
import { AIBadge } from '../ui.jsx';

const React = window.React;

export const ChatBubble = React.forwardRef(function ChatBubble(
  { role = 'assistant', avatar, className = '', children, ...rest }, ref) {
  // default mark: the AI badge for an assistant turn, none for the user. `avatar`
  // (incl. explicit null) overrides.
  const mark = avatar !== undefined ? avatar : (role === 'assistant' ? <AIBadge size={24} /> : null);
  return (
    <div ref={ref} className={`krnl-msg krnl-msg--${role} ${className}`.trim()} {...rest}>
      {mark ? <span className="krnl-msg-badge">{mark}</span> : null}
      <div className="krnl-msg-body">{children}</div>
    </div>
  );
});

export const meta = {
  ChatBubble: {
    layer: 'molecule', scope: 'global', status: 'stable', category: 'Communication',
    usecases: ['chat', 'conversation', 'message', 'chat-turn'],
    keywords: ['chat', 'bubble', 'message', 'turn', 'conversation', 'assistant', 'user'],
    summary: 'One conversation turn: a tailed bubble - assistant left (leading mark + soft surface), user right (accent fill).',
    props: [
      { name: 'role', class: 'dsPresentation', values: ['assistant', 'user'], default: 'assistant', description: 'Who is speaking: assistant (left, soft bubble, leading mark) or user (right, accent fill).' },
      { name: 'avatar', class: 'content', type: 'ReactNode', description: 'Leading mark; defaults to <AIBadge> for the assistant and nothing for the user. Pass a node to override, or null to drop it.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The message body - plain text or rich content (e.g. a rendered answer).' },
    ],
    bestPractices: [
      { do: true, text: 'Use for a single conversational turn; put rich answer content (sources, actions) as children or a richer composite beside it.' },
      { do: false, text: 'Stack many bubbles by hand - wrap them in a Transcript for the scroll + latest-turn behaviour.' },
    ],
    anatomy: [
      { name: 'avatar', required: false, description: 'Leading identity mark (assistant).' },
      { name: 'body', required: true, description: 'The message content.' },
    ],
    related: ['Transcript', 'TypingIndicator', 'AIBadge'],
    composes: ['AIBadge'],
    usage: '<ChatBubble role="assistant">How can I help?</ChatBubble>\n<ChatBubble role="user">Summarise this record</ChatBubble>',
  },
};
