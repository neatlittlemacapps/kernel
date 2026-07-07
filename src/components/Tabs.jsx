// Tabs - switch between peer views in the same space. Base UI `tabs` primitive on
// the .krnl-* token contract. Base UI owns roving-tabindex keyboard nav, the
// selected-panel wiring, ARIA (tablist/tab/tabpanel), and the moving indicator.
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs';

const React = window.React;

// Tabs - the Root. value/defaultValue/onValueChange pass through. Compose a
// TabList of Tabs, then a TabPanel per value.
export function Tabs({ className = '', children, ...rest }) {
  return <BaseTabs.Root className={`krnl-tabs ${className}`.trim()} {...rest}>{children}</BaseTabs.Root>;
}

// The row of tabs; renders the sliding active-indicator underneath.
export function TabList({ className = '', children, ...rest }) {
  return (
    <BaseTabs.List className={`krnl-tablist ${className}`.trim()} {...rest}>
      {children}
      <BaseTabs.Indicator className="krnl-tab-indicator" />
    </BaseTabs.List>
  );
}

// One tab. `value` ties it to its TabPanel.
export const Tab = React.forwardRef(function Tab({ value, className = '', children, ...rest }, ref) {
  return <BaseTabs.Tab ref={ref} value={value} className={`krnl-tab ${className}`.trim()} {...rest}>{children}</BaseTabs.Tab>;
});

// The content for one tab; shown when its `value` is selected.
export function TabPanel({ value, className = '', children, ...rest }) {
  return <BaseTabs.Panel value={value} className={`krnl-tabpanel ${className}`.trim()} {...rest}>{children}</BaseTabs.Panel>;
}

export const meta = {
  Tabs: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Navigation',
    usecases: ['switch peer views', 'sectioned content'],
    keywords: ['tabs', 'tablist', 'segmented', 'sections', 'navigation', 'switcher'],
    summary: 'Switch between peer views in one space (Base UI tabs).',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'A TabList of Tabs followed by a TabPanel per value.' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Tabs.Root.value' },
      { name: 'defaultValue', class: 'passThroughControl', passthrough: 'BaseUI.Tabs.Root.defaultValue' },
      { name: 'onValueChange', class: 'passThroughControl', passthrough: 'BaseUI.Tabs.Root.onValueChange' },
    ],
    bestPractices: [
      { do: true, text: 'Use for a handful of peer views the user switches between; keep tab labels to one or two words.' },
      { do: false, text: 'Use Tabs for a linear multi-step flow - that is a stepper/wizard. Tabs imply the sections are independent and equal.' },
    ],
    anatomy: [
      { name: 'List', required: true, description: 'The row of tabs + the sliding indicator.' },
      { name: 'Tab', required: true, description: 'One selectable label.' },
      { name: 'Panel', required: true, description: 'The content shown for the selected tab.' },
    ],
    related: ['Collapsible'],
    composes: [],
    usage: '<Tabs defaultValue="overview">\n  <TabList>\n    <Tab value="overview">Overview</Tab>\n    <Tab value="history">History</Tab>\n  </TabList>\n  <TabPanel value="overview">…</TabPanel>\n  <TabPanel value="history">…</TabPanel>\n</Tabs>',
  },
  TabList: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Navigation',
    usecases: ['switch peer views'], keywords: ['tablist', 'tabs', 'row'],
    summary: 'The row of Tabs with the active indicator.',
    props: [{ name: 'children', class: 'content', type: 'ReactNode', description: 'The Tab elements.' }],
    related: ['Tabs'], composes: [], usage: '<TabList><Tab value="a">A</Tab></TabList>',
  },
  Tab: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Navigation',
    usecases: ['switch peer views'], keywords: ['tab', 'label'],
    summary: 'One selectable tab.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Tabs.Tab.value' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The tab label (one or two words).' },
    ],
    related: ['Tabs', 'TabPanel'], composes: [], usage: '<Tab value="overview">Overview</Tab>',
  },
  TabPanel: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Navigation',
    usecases: ['switch peer views'], keywords: ['tabpanel', 'panel', 'content'],
    summary: 'The content for one tab.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Tabs.Panel.value' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The panel content.' },
    ],
    related: ['Tabs', 'Tab'], composes: [], usage: '<TabPanel value="overview">…</TabPanel>',
  },
};
