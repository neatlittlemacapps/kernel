// Collapsible - one region that expands / collapses under a trigger. Base UI
// `collapsible` primitive on the .krnl-* token contract. Base UI owns the
// open/closed state, the height animation vars, keyboard, and ARIA (aria-expanded
// / aria-controls). For a multi-section stack use the Accordion instead.
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Collapsible - `trigger` is the always-visible header; `children` is the region
// revealed when open. open/defaultOpen/onOpenChange pass through.
export function Collapsible({ trigger, children, className = '', ...rest }) {
  return (
    <BaseCollapsible.Root className={`krnl-collapsible ${className}`.trim()} {...rest}>
      <BaseCollapsible.Trigger className="krnl-collapsible-trigger">
        <span>{trigger}</span>
        <span className="krnl-collapsible-chev" aria-hidden="true">{Icon.chevron({ size: 16 })}</span>
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel className="krnl-collapsible-panel">
        <div className="krnl-collapsible-panel-inner">{children}</div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}

export const meta = {
  Collapsible: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Structure',
    usecases: ['expand/collapse a region', 'show more'],
    keywords: ['collapsible', 'expand', 'collapse', 'disclosure', 'show-more', 'toggle'],
    summary: 'A single region that expands and collapses (Base UI collapsible).',
    props: [
      { name: 'trigger', class: 'content', type: 'ReactNode',
        description: 'The always-visible header that toggles the region (a chevron is added automatically).' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The content revealed when open.' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.Root.open' },
      { name: 'defaultOpen', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.Root.defaultOpen' },
      { name: 'onOpenChange', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.Root.onOpenChange' },
    ],
    bestPractices: [
      { do: true, text: 'Use to hide secondary detail behind a clear header; keep the header label descriptive of what expands.' },
      { do: false, text: 'Use several stacked Collapsibles where only one should be open at a time - use an Accordion for that.' },
    ],
    anatomy: [
      { name: 'Trigger', required: true, description: 'The header toggle (with chevron).' },
      { name: 'Panel', required: true, description: 'The revealed region.' },
    ],
    related: ['Tabs'],
    composes: [],
    usage: '<Collapsible trigger="Advanced options">\n  <p>…</p>\n</Collapsible>',
  },
};
