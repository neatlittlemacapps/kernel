// PromptField - the chat composer field shell. A framed card (border + focus ring)
// wrapping an auto-growing seamless textarea and a toolbar row: [leading] · [trailing]
// · submit. It owns the field chrome, the auto-grow, and Enter-to-send (Shift+Enter =
// newline); the consuming app supplies the toolbar controls via the `leading` /
// `trailing` slots and keeps its own wiring (slash menu, attachments, recording mode
// live AROUND this shell, not inside it). Generic chat primitive (Kernel ./chat) -
// the successor to greenhouse's bespoke composer field + <TextArea bare>.
import { TextArea } from '../TextArea.jsx';
import { IconButton, Tooltip } from '../ui.jsx';
import { Icon } from '../../lib/icons.jsx';

const React = window.React;

export const PromptField = React.forwardRef(function PromptField({
  value, onChange, onSubmit, onKeyDown, onBlur, placeholder,
  leading, trailing, header, canSubmit, submitLabel = 'Send',
  fieldClassName = '', maxHeight = 132, disabled, className = '', ...rest
}, ref) {
  const innerRef = React.useRef(null);
  const setRefs = (el) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  };
  // auto-grow between one line and the scroll cap; recompute when the value changes
  // externally (e.g. reset after submit) as well as on input.
  const grow = (el) => { if (!el) return; el.style.height = 'auto'; el.style.height = Math.min(Math.max(el.scrollHeight || 0, 22), maxHeight) + 'px'; };
  React.useLayoutEffect(() => { grow(innerRef.current); }, [value]);

  const handleChange = (e) => { onChange && onChange(e); grow(e.target); };
  // consumer keydown runs first; if it calls preventDefault (e.g. a slash menu handling
  // Enter) the field skips its own Enter-to-send.
  const handleKeyDown = (e) => {
    onKeyDown && onKeyDown(e);
    if (!e.defaultPrevented && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit && onSubmit(e); }
  };
  const submittable = canSubmit !== undefined ? canSubmit : !!(value && value.trim());

  return (
    <div className={`krnl-composer-field ${fieldClassName} ${className}`.trim()} {...rest}>
      {header}
      <TextArea variant="seamless" ref={setRefs} rows={1} value={value} disabled={disabled}
        placeholder={placeholder} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={onBlur}
        style={{ maxHeight }} />
      <div className="krnl-composer-actions">
        <div className="krnl-composer-aux">{leading}</div>
        <div className="krnl-composer-tools">
          {trailing}
          <Tooltip label={submitLabel}>
            <IconButton variant="solid" aria-label={submitLabel} disabled={!submittable} onClick={onSubmit}>
              {Icon.arrowUp({ size: 17 })}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
});

export const meta = {
  PromptField: {
    layer: 'composite', scope: 'global', status: 'stable', category: 'Communication',
    usecases: ['chat', 'composer', 'prompt', 'message input'],
    keywords: ['prompt', 'composer', 'chat', 'input', 'textarea', 'send', 'message'],
    summary: 'Chat composer field shell: a framed card + auto-growing seamless textarea + a toolbar (leading | trailing + submit). Owns Enter-to-send and auto-grow; the app fills the slots.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.value' },
      { name: 'onChange', class: 'event', type: '(event) => void', description: 'Fires on input (the field also auto-grows).' },
      { name: 'onSubmit', class: 'event', type: '(event?) => void', description: 'Fires on Enter (no Shift) or the submit button.' },
      { name: 'onKeyDown', class: 'event', type: '(event) => void', description: 'Runs before the built-in Enter-to-send; call preventDefault to suppress it (e.g. a slash menu owning Enter).' },
      { name: 'placeholder', class: 'passThroughControl', passthrough: 'HTMLTextAreaElement.placeholder' },
      { name: 'leading', class: 'content', type: 'ReactNode', description: 'Toolbar controls on the left (e.g. an attach button).' },
      { name: 'trailing', class: 'content', type: 'ReactNode', description: 'Toolbar controls on the right, before the submit button (e.g. a voice button, an agent selector).' },
      { name: 'header', class: 'content', type: 'ReactNode', description: 'Content above the textarea, inside the card (e.g. an attachment strip or a context bar).' },
      { name: 'canSubmit', class: 'dsPresentation', type: 'bool', description: 'Enables the submit button; defaults to "value is non-empty". Pass to also gate on attachments etc.' },
      { name: 'submitLabel', class: 'a11y', type: 'string', default: 'Send', description: 'Accessible name + tooltip for the submit button.' },
      { name: 'fieldClassName', class: 'dsApi', type: 'string', description: 'Extra class on the field card (e.g. a command-mode highlight while a slash menu is open).' },
      { name: 'maxHeight', class: 'dsPresentation', type: 'number', default: '132', description: 'Auto-grow cap in px; scrolls past it.' },
    ],
    bestPractices: [
      { do: true, text: 'Put app controls in leading/trailing; keep the slash menu / suggestion chips / recording UI OUTSIDE the field (around PromptField).' },
      { do: true, text: 'Control value/onChange; compute canSubmit if submitting depends on more than the text (e.g. attachments).' },
      { do: false, text: 'Rebuild the field card + seamless textarea by hand - that is what this shell is.' },
    ],
    anatomy: [
      { name: 'header', required: false, description: 'Content above the input (attachments / context).' },
      { name: 'field', required: true, description: 'The seamless auto-grow textarea.' },
      { name: 'toolbar', required: true, description: 'leading | trailing + submit.' },
    ],
    related: ['ChatBubble', 'Transcript', 'TextArea', 'IconButton'],
    composes: ['TextArea', 'IconButton', 'Tooltip'],
    usage: '<PromptField value={v} onChange={e=>setV(e.target.value)} onSubmit={send}\n  placeholder="Ask anything…"\n  leading={<IconButton aria-label="Attach">…</IconButton>}\n  trailing={<Chip>Switch agent</Chip>} />',
  },
};
