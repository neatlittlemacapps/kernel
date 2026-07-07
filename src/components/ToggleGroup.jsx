// ToggleGroup - a set of mutually-related toggle buttons (a segmented control, a
// view switcher, a multi-select button bar). Base UI `toggle-group` + `toggle`
// primitives on the .krnl-* token contract. Base UI owns the roving-tabindex
// keyboard nav, single/multiple selection, and the pressed state ([data-pressed]).
// (Distinct from Toggle, which is the on/off Switch - different Base UI primitive.)
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui-components/react/toggle';

const React = window.React;

// ToggleGroup - wraps the options. value/defaultValue/onValueChange pass through;
// toggleMultiple switches from single-select (segmented) to multi-select.
export function ToggleGroup({ className = '', children, ...rest }) {
  return <BaseToggleGroup className={`krnl-segmented ${className}`.trim()} {...rest}>{children}</BaseToggleGroup>;
}

// One option in a ToggleGroup. `value` is its identity; the pressed state is styled
// off Base UI's [data-pressed] attribute, never a hand-rolled state class.
export const ToggleGroupItem = React.forwardRef(function ToggleGroupItem({ value, className = '', children, ...rest }, ref) {
  return <BaseToggle ref={ref} value={value} className={`krnl-seg ${className}`.trim()} {...rest}>{children}</BaseToggle>;
});

export const meta = {
  ToggleGroup: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['segmented control', 'view switcher', 'multi-select button bar'],
    keywords: ['toggle-group', 'segmented', 'segment', 'switcher', 'button-group', 'view-toggle'],
    summary: 'A set of related toggle buttons - a segmented control (Base UI toggle-group).',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The ToggleGroupItem options.' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.ToggleGroup.value' },
      { name: 'defaultValue', class: 'passThroughControl', passthrough: 'BaseUI.ToggleGroup.defaultValue' },
      { name: 'onValueChange', class: 'passThroughControl', passthrough: 'BaseUI.ToggleGroup.onValueChange' },
      { name: 'toggleMultiple', class: 'passThroughControl', passthrough: 'BaseUI.ToggleGroup.toggleMultiple' },
    ],
    bestPractices: [
      { do: true, text: 'Use for 2-4 mutually exclusive views/modes shown at once (a segmented control); keep labels short.' },
      { do: false, text: 'Use a ToggleGroup for one on/off setting - that is a Toggle (switch); or for many options - that is a Select.' },
    ],
    anatomy: [
      { name: 'Group', required: true, description: 'The segmented container.' },
      { name: 'Item', required: true, description: 'One toggle option (ToggleGroupItem); pressed state via [data-pressed].' },
    ],
    related: ['Tabs', 'Toggle'],
    composes: [],
    usage: '<ToggleGroup defaultValue={["list"]}>\n  <ToggleGroupItem value="list">List</ToggleGroupItem>\n  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>\n</ToggleGroup>',
  },
  ToggleGroupItem: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['segmented control'],
    keywords: ['toggle', 'segment', 'option', 'button'],
    summary: 'One option inside a ToggleGroup.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Toggle.value' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The option label.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Toggle.disabled' },
    ],
    related: ['ToggleGroup'],
    composes: [],
    usage: '<ToggleGroupItem value="grid">Grid</ToggleGroupItem>',
  },
};
