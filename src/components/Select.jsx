// Select - pick one value from a list via a dropdown. Base UI `select` primitive
// on the .krnl-* token contract (reuses the .krnl-select-* trigger + the shared
// .krnl-menu-popup / .krnl-menu-item surface). Base UI owns the listbox behaviour,
// typeahead, keyboard, focus, ARIA, and portal positioning.
import { Select as BaseSelect } from '@base-ui-components/react/select';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Select - `placeholder` shows when nothing is chosen; `children` are SelectItems.
// value/defaultValue/onValueChange/disabled pass through. The built-in placeholder
// assumes string item values (value === label); for object values pass your own
// Base UI Select.Value via children of a custom trigger.
export function Select({ placeholder = 'Select…', children, className = '', ...rest }) {
  return (
    <BaseSelect.Root {...rest}>
      <BaseSelect.Trigger className="krnl-select-trigger">
        <BaseSelect.Value>{(v) => (v == null || v === '' ? placeholder : v)}</BaseSelect.Value>
        <BaseSelect.Icon className="krnl-select-icon">{Icon.chevron({ size: 14, style: { transform: 'rotate(90deg)' } })}</BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="krnl-positioner" sideOffset={6}>
          <BaseSelect.Popup className={`krnl-menu-popup ${className}`.trim()}>{children}</BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

// One option. `value` is its identity; children are the visible label.
export const SelectItem = React.forwardRef(function SelectItem({ value, className = '', children, ...rest }, ref) {
  return (
    <BaseSelect.Item ref={ref} value={value} className={`krnl-menu-item krnl-select-item ${className}`.trim()} {...rest}>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="krnl-select-check">{Icon.check({ size: 16 })}</BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
});

export const meta = {
  Select: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['single-select from a long list', 'dropdown picker'],
    keywords: ['select', 'dropdown', 'picker', 'combobox', 'listbox', 'options', 'choose'],
    summary: 'Dropdown picker for one value from a list (Base UI select).',
    props: [
      { name: 'placeholder', class: 'content', type: 'string', default: 'Select…',
        description: 'Text shown on the trigger when nothing is chosen. Assumes string item values (value === label); for object values supply a custom Value.' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The options as SelectItems.' },
      { name: 'className', class: 'content', type: 'string',
        description: 'Extra class(es) appended to the popup surface.' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Select.Root.value' },
      { name: 'defaultValue', class: 'passThroughControl', passthrough: 'BaseUI.Select.Root.defaultValue' },
      { name: 'onValueChange', class: 'passThroughControl', passthrough: 'BaseUI.Select.Root.onValueChange' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Select.Root.disabled' },
    ],
    bestPractices: [
      { do: true, text: 'Use for one choice from a longer list (~6+); for a handful of always-visible options use a RadioGroup.' },
      { do: false, text: 'Use a Select to fire actions - a list of commands is a Menu, not a value picker.' },
    ],
    anatomy: [
      { name: 'Trigger', required: true, description: 'The closed control showing the current Value + a chevron.' },
      { name: 'Popup', required: true, description: 'The portalled listbox of items.' },
      { name: 'Item', required: true, description: 'One option (SelectItem); a check marks the selected one.' },
    ],
    related: ['RadioGroup', 'Menu'],
    composes: [],
    usage: '<Select defaultValue="7 days" placeholder="Duration">\n  <SelectItem value="3 days">3 days</SelectItem>\n  <SelectItem value="7 days">7 days</SelectItem>\n</Select>',
  },
  SelectItem: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['single-select from a long list'],
    keywords: ['select-item', 'option', 'listbox-item'],
    summary: 'One option inside a Select.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Select.Item.value' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The visible option label.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Select.Item.disabled' },
    ],
    related: ['Select'],
    composes: [],
    usage: '<SelectItem value="7 days">7 days</SelectItem>',
  },
};
