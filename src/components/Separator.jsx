// Separator - a visual divider between sections or items. Base UI `separator`
// primitive on the .krnl-* token contract (adds role=separator + the orientation
// data-attr, which a bare <hr> does not give you consistently across browsers).
import { Separator as BaseSeparator } from '@base-ui-components/react/separator';

const React = window.React;

// Separator - horizontal by default; pass orientation="vertical" inside a flex row.
export function Separator({ className = '', ...rest }) {
  return <BaseSeparator className={`krnl-separator ${className}`.trim()} {...rest} />;
}

export const meta = {
  Separator: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Structure',
    usecases: ['divide sections', 'divide items'],
    keywords: ['separator', 'divider', 'rule', 'hr', 'line'],
    summary: 'A visual divider between sections or items (Base UI separator).',
    props: [
      { name: 'orientation', class: 'passThroughControl', passthrough: 'BaseUI.Separator.orientation' },
    ],
    bestPractices: [
      { do: true, text: 'Use to group; often whitespace alone is enough - reach for a rule only when the grouping needs a hard edge.' },
      { do: false, text: 'Stack multiple separators for spacing - adjust margins/tokens instead.' },
    ],
    anatomy: [
      { name: 'Rule', required: true, description: 'The hairline; horizontal or vertical per orientation.' },
    ],
    related: ['MenuSeparator'],
    composes: [],
    usage: '<Separator />',
    examples: [
      { name: 'Vertical', code: '<Separator orientation="vertical" />', description: 'Inside a flex row (e.g. between toolbar groups).' },
    ],
  },
};
