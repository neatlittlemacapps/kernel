// Chip - a small, token-styled label token: a suggestion, a filter, a citation,
// a removable tag. Base UI ships NO chip primitive (chips are design-system-level),
// so this is a hand-rolled atom on the .krnl-* token contract - a leaf primitive,
// like Btn/IconButton, so it may render the raw control directly. It is the single
// generic chip the bespoke greenhouse flavours (suggestion / citation / source /
// context) consolidate onto; richer ones (a source card) are molecules built FROM it.
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Chip - actionable when `onClick` is given (renders a button), otherwise a static
// label (span). `onRemove` adds a trailing remove control (use for a removable tag;
// do not combine with onClick - a chip is one or the other). `selected` marks the
// chosen state (a filter/choice chip). `icon` is an optional leading glyph.
export const Chip = React.forwardRef(function Chip({ icon, onRemove, onClick, selected, className = '', children, ...rest }, ref) {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production' && onClick && onRemove)
    console.warn('Chip: pass onClick OR onRemove, not both - an actionable chip cannot also nest a remove button.');
  // aria-pressed only applies to a TOGGLE chip (a `selected` prop is present, even
  // when false); an action chip (no `selected`) is a plain button, not a toggle.
  const pressed = selected === undefined ? undefined : !!selected;
  const cls = `krnl-chip${selected ? ' krnl-chip--selected' : ''} ${className}`.trim();
  const body = (
    <>
      {icon ? <span className="krnl-chip-ic" aria-hidden="true">{icon}</span> : null}
      {children}
    </>
  );
  if (onRemove) {
    return (
      <span ref={ref} className={cls} {...rest}>
        {body}
        <button type="button" className="krnl-chip-x" aria-label="Remove" onClick={onRemove}>{Icon.close({ size: 12, w: 2.4 })}</button>
      </span>
    );
  }
  if (onClick) {
    return <button ref={ref} type="button" className={cls} aria-pressed={pressed} onClick={onClick} {...rest}>{body}</button>;
  }
  return <span ref={ref} className={cls} {...rest}>{body}</span>;
});

export const meta = {
  Chip: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Display',
    usecases: ['suggestion', 'filter', 'tag', 'citation'],
    keywords: ['chip', 'tag', 'pill', 'token', 'suggestion', 'filter', 'citation', 'badge'],
    summary: 'Small token-styled label - suggestion, filter, removable tag, or citation.',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The chip label (keep it short).' },
      { name: 'icon', class: 'content', type: 'ReactNode', description: 'Optional leading glyph; decorative (aria-hidden).' },
      { name: 'selected', class: 'dsPresentation', type: 'bool', description: 'Marks the chosen state for a filter / choice chip (sets aria-pressed on the actionable form).' },
      { name: 'onClick', class: 'event', type: '(event) => void', description: 'Makes the chip actionable (renders a button). Use for suggestion / filter / citation chips.' },
      { name: 'onRemove', class: 'event', type: '(event) => void', description: 'Adds a trailing remove control (renders a static label + a remove button). Use for a removable tag; do not combine with onClick.' },
    ],
    bestPractices: [
      { do: true, text: 'Keep the label to a word or two; a chip is a token, not a sentence.' },
      { do: true, text: 'Pick one mode: actionable (onClick) or removable (onRemove) - not both (avoids a button inside a button).' },
      { do: false, text: 'Use a Chip as a primary action - that is a Button. Chips are lightweight, secondary, and plural.' },
    ],
    anatomy: [
      { name: 'Label', required: true, description: 'The text (children).' },
      { name: 'Icon', required: false, description: 'A leading glyph.' },
      { name: 'Remove', required: false, description: 'A trailing remove button when onRemove is set.' },
    ],
    related: ['Button', 'StatusPill'],
    composes: [],
    usage: '<Chip icon={Icon.spark({ size: 13 })} onClick={onPick}>Summarize</Chip>',
    examples: [
      { name: 'Removable tag', code: '<Chip onRemove={onClear}>Amoxicillin</Chip>', description: 'Static label with a remove control.' },
      { name: 'Filter (selected)', code: '<Chip selected onClick={onToggle}>Unresolved</Chip>', description: 'Actionable filter chip in the chosen state.' },
    ],
  },
};
