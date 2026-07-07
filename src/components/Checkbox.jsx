// Checkbox - single boolean control with an optional label. Base UI `checkbox`
// primitive on the .krnl-* token contract. Base UI owns the checked/indeterminate
// state, keyboard, focus, and ARIA; Kernel styles the box + indicator via tokens.
import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Checkbox - `label` is the clickable text beside the box (wrap in a label so the
// whole row toggles). checked/defaultChecked/onCheckedChange/disabled pass through.
export const Checkbox = React.forwardRef(function Checkbox({ label, className = '', id, ...rest }, ref) {
  const box = (
    <BaseCheckbox.Root ref={ref} id={id} className="krnl-checkbox" {...rest}>
      <BaseCheckbox.Indicator className="krnl-checkbox-ind">{Icon.check({ size: 13, w: 2.6 })}</BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
  if (!label) return box;
  return <label className={`krnl-choice ${className}`.trim()}>{box}<span className="krnl-choice-label">{label}</span></label>;
});

export const meta = {
  Checkbox: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['boolean control', 'multi-select option', 'consent'],
    keywords: ['checkbox', 'check', 'boolean', 'toggle', 'tickbox', 'consent', 'option'],
    summary: 'Single boolean checkbox with an optional label (Base UI checkbox).',
    props: [
      { name: 'label', class: 'content', type: 'ReactNode',
        description: 'Text beside the box; the whole row toggles. Omit for a bare box (label it elsewhere).' },
      { name: 'checked', class: 'passThroughControl', passthrough: 'BaseUI.Checkbox.Root.checked' },
      { name: 'defaultChecked', class: 'passThroughControl', passthrough: 'BaseUI.Checkbox.Root.defaultChecked' },
      { name: 'onCheckedChange', class: 'passThroughControl', passthrough: 'BaseUI.Checkbox.Root.onCheckedChange' },
      { name: 'indeterminate', class: 'passThroughControl', passthrough: 'BaseUI.Checkbox.Root.indeterminate' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Checkbox.Root.disabled' },
      { name: 'required', class: 'passThroughControl', passthrough: 'BaseUI.Checkbox.Root.required' },
    ],
    bestPractices: [
      { do: true, text: 'Use for independent on/off options; use a RadioGroup when exactly one of several must be chosen.' },
      { do: true, text: 'Write the label as a positive statement ("Email me updates"), so checked = the stated thing is true.' },
      { do: false, text: 'Use a Checkbox to switch a setting on immediately - that is a Toggle (switch).' },
    ],
    anatomy: [
      { name: 'Box', required: true, description: 'The square control carrying the checked/indeterminate state.' },
      { name: 'Indicator', required: true, description: 'The checkmark shown when checked.' },
      { name: 'Label', required: false, description: 'The clickable text.' },
    ],
    related: ['Toggle', 'RadioGroup'],
    composes: [],
    usage: '<Checkbox label="Email me updates" defaultChecked />',
  },
};
