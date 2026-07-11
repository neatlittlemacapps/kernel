// Transcript - the scrolling conversation container. Holds the turns (ChatBubbles,
// answers, indicators - whatever the app renders as children) and owns the scroll
// behaviour: when `scrollKey` changes (a new turn arrives) it scrolls the newest
// anchor (by default the last user bubble) to the top, so the new question lands at
// the top and the answer streams in below it. Content-agnostic; the app owns what the
// turns are. Generic chat primitive (Kernel ./chat).
const React = window.React;

export const Transcript = React.forwardRef(function Transcript({
  children, scrollKey, anchorSelector = '.krnl-msg--user', className = '', ...rest }, ref) {
  const localRef = React.useRef(null);
  const setRefs = (el) => {
    localRef.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  };
  const prevKey = React.useRef(scrollKey);
  React.useEffect(() => {
    if (scrollKey !== prevKey.current && localRef.current) {
      const els = localRef.current.querySelectorAll(anchorSelector);
      const el = els[els.length - 1];
      // instant (not smooth): streaming re-renders shift layout and cancel an in-flight
      // smooth scroll; a second pass next frame catches the height change so the anchor
      // lands at the top.
      if (el) { el.scrollIntoView({ block: 'start' }); requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })); }
    }
    prevKey.current = scrollKey;
  }, [scrollKey]);
  return <div ref={setRefs} className={`krnl-convo ${className}`.trim()} {...rest}>{children}</div>;
});

export const meta = {
  Transcript: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Communication',
    usecases: ['chat', 'conversation', 'transcript', 'scroll'],
    keywords: ['transcript', 'conversation', 'chat', 'thread', 'scroll', 'messages'],
    summary: 'Scrolling conversation container: holds the turns and scrolls the newest anchor (default: the last user bubble) to the top when a turn arrives.',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The turns - ChatBubbles, rendered answers, a TypingIndicator, etc.' },
      { name: 'scrollKey', class: 'dsApi', type: 'any', description: 'Change this when a new turn is added (e.g. the last user index or turn count) to trigger the scroll-to-latest.' },
      { name: 'anchorSelector', class: 'dsApi', type: 'string', default: '.krnl-msg--user', description: 'CSS selector for the element to scroll to the top; defaults to the last user ChatBubble.' },
    ],
    bestPractices: [
      { do: true, text: 'Drive scrollKey off the thing that marks a new turn (last user index / message count).' },
      { do: false, text: 'Reimplement scroll-to-latest per surface - that is what this owns.' },
    ],
    anatomy: [
      { name: 'turns', required: true, description: 'The conversation content (children).' },
    ],
    related: ['ChatBubble', 'PromptField', 'TypingIndicator'],
    composes: [],
    usage: '<Transcript scrollKey={lastUserIdx}>\n  {thread.map(turn => <ChatBubble …/>)}\n</Transcript>',
  },
};
