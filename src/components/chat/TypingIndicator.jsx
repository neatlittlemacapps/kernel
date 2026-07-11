// TypingIndicator - the "assistant is working" affordance: three blinking dots and
// an optional status label. Generic chat primitive (Kernel ./chat); a role="status"
// live region so assistive tech announces the label. Token-styled via .krnl-searching*.
const React = window.React;

export const TypingIndicator = React.forwardRef(function TypingIndicator(
  { label, className = '', ...rest }, ref) {
  return (
    <div ref={ref} className={`krnl-searching ${className}`.trim()} role="status" {...rest}>
      <span className="krnl-searching-dots" aria-hidden="true"><i /><i /><i /></span>{label}
    </div>
  );
});

export const meta = {
  TypingIndicator: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Communication',
    usecases: ['chat', 'loading', 'typing', 'thinking'],
    keywords: ['typing', 'thinking', 'loading', 'dots', 'chat', 'status', 'searching'],
    summary: 'Three blinking dots + an optional status label - the assistant-is-working affordance in a conversation.',
    props: [
      { name: 'label', class: 'content', type: 'ReactNode', description: 'Optional status text beside the dots (e.g. "Searching guidelines…").' },
    ],
    bestPractices: [
      { do: true, text: 'Show while awaiting an assistant turn; replace it with the ChatBubble/answer once content arrives.' },
    ],
    anatomy: [
      { name: 'dots', required: true, description: 'The animated blinking dots.' },
      { name: 'label', required: false, description: 'Status text.' },
    ],
    related: ['ChatBubble', 'Transcript'],
    composes: [],
    usage: '<TypingIndicator label="Searching guidelines…" />',
  },
};
