// TextArea - multiline text field. The multiline sibling of TextInput; a native
// <textarea> styled through the .krnl-* token contract (Base UI ships no textarea
// primitive - a plain textarea already has the right semantics + a11y). An atom
// leaf primitive, so it may render the raw control directly (like TextInput).
const React = window.React;

// `variant="seamless"` is a borderless, transparent, flush field meant to sit inside a
// shell that owns the frame (e.g. the PromptField / composer card).
export const TextArea = React.forwardRef(function TextArea({ className = '', rows = 4, variant, ...rest }, ref) {
  const varCls = variant ? ' krnl-textarea--' + variant : '';
  return <textarea ref={ref} rows={rows} className={`krnl-textarea${varCls} ${className}`.trim()} {...rest} />;
});

export const meta = {
  TextArea: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['multiline text', 'notes', 'comment'],
    keywords: ['textarea', 'multiline', 'text', 'notes', 'comment', 'message', 'field'],
    summary: 'Multiline text field (native textarea on Kernel tokens).',
    props: [
      { name: 'rows', class: 'dsPresentation', type: 'number', default: '4',
        description: 'Initial visible height in text rows; the field still grows via native resize unless disabled in CSS.' },
      { name: 'variant', class: 'dsPresentation', values: ['seamless'], description: 'Visual treatment. Default is the outlined field; `seamless` is borderless / transparent / flush - for a field embedded in a shell that owns the frame (PromptField / composer).' },
      { name: 'value', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.value' },
      { name: 'defaultValue', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.defaultValue' },
      { name: 'onChange', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.onChange' },
      { name: 'placeholder', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.placeholder' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.disabled' },
    ],
    bestPractices: [
      { do: true, text: 'Size rows to the expected input; a comment box is ~3-4 rows, a long note more.' },
      { do: false, text: 'Use a TextArea for a single-line value (a name, a code) - that is a TextInput.' },
    ],
    anatomy: [
      { name: 'Field', required: true, description: 'The multiline input surface.' },
    ],
    related: ['TextInput'],
    composes: [],
    usage: '<TextArea placeholder="Add a note" rows={4} />',
  },
};
