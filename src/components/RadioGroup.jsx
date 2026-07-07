// RadioGroup + Radio - pick exactly one from a set. Base UI `radio-group` + `radio`
// primitives on the .krnl-* token contract. Base UI owns roving-tabindex keyboard
// nav, the single-selection invariant, focus, and ARIA; Kernel styles the dot.
import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group';
import { Radio as BaseRadio } from '@base-ui-components/react/radio';

const React = window.React;

// RadioGroup - wraps the Radio options. value/defaultValue/onValueChange/disabled
// pass through; children are Radio rows.
export function RadioGroup({ className = '', children, ...rest }) {
  return <BaseRadioGroup className={`krnl-radiogroup ${className}`.trim()} {...rest}>{children}</BaseRadioGroup>;
}

// One option. `value` is required (its identity); `label` is the clickable text.
export const Radio = React.forwardRef(function Radio({ label, value, className = '', ...rest }, ref) {
  const dot = (
    <BaseRadio.Root ref={ref} value={value} className="krnl-radioctl" {...rest}>
      <BaseRadio.Indicator className="krnl-radioctl-ind" />
    </BaseRadio.Root>
  );
  if (!label) return dot;
  return <label className={`krnl-choice ${className}`.trim()}>{dot}<span className="krnl-choice-label">{label}</span></label>;
});

export const meta = {
  RadioGroup: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['single-select from a set', 'exclusive option'],
    keywords: ['radio', 'radio-group', 'single-select', 'exclusive', 'choice', 'option'],
    summary: 'Pick exactly one option from a small set (Base UI radio-group).',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The Radio options.' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.RadioGroup.value' },
      { name: 'defaultValue', class: 'passThroughControl', passthrough: 'BaseUI.RadioGroup.defaultValue' },
      { name: 'onValueChange', class: 'passThroughControl', passthrough: 'BaseUI.RadioGroup.onValueChange' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.RadioGroup.disabled' },
    ],
    bestPractices: [
      { do: true, text: 'Use for 2-5 mutually exclusive options that are all worth showing at once; above ~6, use a Select.' },
      { do: false, text: 'Use a RadioGroup for independent on/off options - those are Checkboxes.' },
    ],
    anatomy: [
      { name: 'Group', required: true, description: 'The container enforcing single selection.' },
      { name: 'Radio', required: true, description: 'One option (dot + label).' },
    ],
    related: ['Checkbox', 'Select'],
    composes: [],
    usage: '<RadioGroup defaultValue="fax">\n  <Radio value="email" label="Email" />\n  <Radio value="fax" label="Fax" />\n</RadioGroup>',
  },
  Radio: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['single-select from a set'],
    keywords: ['radio', 'option', 'choice', 'dot'],
    summary: 'One option inside a RadioGroup.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Radio.Root.value' },
      { name: 'label', class: 'content', type: 'ReactNode', description: 'The clickable text beside the dot.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Radio.Root.disabled' },
    ],
    related: ['RadioGroup'],
    composes: [],
    usage: '<Radio value="email" label="Email" />',
  },
};
