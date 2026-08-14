// @hand-authored - docs-only Foundations page (no catalog.json entry, so gen-stories.mjs
// / retitle-stories.mjs never touch this file). Title is hand-written on purpose here:
// the "never hand-write a title" rule in CLAUDE.md is about catalog-derived component
// stories, which this isn't.
import { TokenGraphView } from './TokenGraphView.jsx';

export default {
  title: 'Foundations/Token Graph',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every token set in `tokens/theme.resolver.json` as a node, with edges for structural alias references (e.g. `{brand.primary-deep}`) and additive modifier cascades (dark loads after light, semble/myneva load after corilus). Node color/opacity reflects whether the set is active for the current Brand/Theme/Density/Breakpoint toolbar selection above. Click a node to see the individual token aliases behind its edges.',
      },
    },
  },
};

export const Graph = {
  render: (_args, context) => {
    const { brand, theme, density, breakpoint } = context.globals;
    return <TokenGraphView brand={brand} theme={theme} density={density} breakpoint={breakpoint} />;
  },
};
