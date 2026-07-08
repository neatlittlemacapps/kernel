// Layout primitives - Box / Stack / Inline / Grid. Kernel had component atoms
// (controls, overlays, forms) but no LAYOUT atoms, so consumers hand-rolled every
// layout with bespoke flex divs. These are the token-driven foundation: spacing is
// ALWAYS a space-scale step (gap={3} -> var(--space-3)), never a hardcoded px, so
// layout stays on the tokenset. Base UI ships no layout primitive (layout is a
// design-system concern), so these are hand-rolled leaf atoms - a class for the
// static display + box-sizing, inline style only for the token-driven dynamic values.
const React = window.React;

// space step -> token var. number => var(--space-N); string passes through (an
// explicit CSS length or another var), null/undefined => omitted.
const sp = (v) => (v == null ? undefined : typeof v === 'number' ? `var(--space-${v})` : v);
// flex/grid alignment shorthands -> CSS keywords.
const AL = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' };
const JU = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly' };

// Shared style builder: the padding / surface / radius / border / flex-child props
// every primitive accepts, all resolved to tokens.
function boxStyle({ p, px, py, pt, pr, pb, pl, bg, radius, border, grow, shrink, basis }, extra, style) {
  return {
    paddingTop: sp(pt != null ? pt : py != null ? py : p),
    paddingBottom: sp(pb != null ? pb : py != null ? py : p),
    paddingLeft: sp(pl != null ? pl : px != null ? px : p),
    paddingRight: sp(pr != null ? pr : px != null ? px : p),
    background: bg ? `var(--${bg})` : undefined,
    borderRadius: radius != null ? `var(--krnl-radius-${radius})` : undefined,
    border: border ? 'var(--dimension-rule-thin) solid var(--border-subtle)' : undefined,
    flexGrow: grow, flexShrink: shrink, flexBasis: basis,
    ...extra,
    ...style,
  };
}

// Box - the primitive container. Padding + surface + radius + border + flex-child
// sizing, no display of its own (it's a plain block). Everything else composes it.
export const Box = React.forwardRef(function Box({ as = 'div', className = '', style, children, ...rest }, ref) {
  const box = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'bg', 'radius', 'border', 'grow', 'shrink', 'basis'];
  const props = {}, dom = {};
  for (const k in rest) (box.includes(k) ? props : dom)[k] = rest[k];
  return React.createElement(as, { ref, className: `krnl-box ${className}`.trim(), style: boxStyle(props, null, style), ...dom }, children);
});

// Stack - vertical flow. gap + align (cross) + justify (main), + all Box props.
export const Stack = React.forwardRef(function Stack({ as = 'div', gap, align, justify, wrap, className = '', style, children, ...rest }, ref) {
  const box = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'bg', 'radius', 'border', 'grow', 'shrink', 'basis'];
  const props = {}, dom = {};
  for (const k in rest) (box.includes(k) ? props : dom)[k] = rest[k];
  const extra = { gap: sp(gap), alignItems: AL[align] || align, justifyContent: JU[justify] || justify, flexWrap: wrap ? 'wrap' : undefined };
  return React.createElement(as, { ref, className: `krnl-stack ${className}`.trim(), style: boxStyle(props, extra, style), ...dom }, children);
});

// Inline - horizontal flow (defaults to vertically-centered items). gap + align +
// justify + wrap, + Box props.
export const Inline = React.forwardRef(function Inline({ as = 'div', gap, align, justify, wrap, className = '', style, children, ...rest }, ref) {
  const box = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'bg', 'radius', 'border', 'grow', 'shrink', 'basis'];
  const props = {}, dom = {};
  for (const k in rest) (box.includes(k) ? props : dom)[k] = rest[k];
  const extra = { gap: sp(gap), alignItems: AL[align] || align, justifyContent: JU[justify] || justify, flexWrap: wrap ? 'wrap' : undefined };
  return React.createElement(as, { ref, className: `krnl-inline ${className}`.trim(), style: boxStyle(props, extra, style), ...dom }, children);
});

// Grid - CSS grid. `columns` is a count (=> repeat(n, 1fr)) or an explicit template
// string; gap + align, + Box props.
export const Grid = React.forwardRef(function Grid({ as = 'div', columns, gap, align, justify, className = '', style, children, ...rest }, ref) {
  const box = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'bg', 'radius', 'border', 'grow', 'shrink', 'basis'];
  const props = {}, dom = {};
  for (const k in rest) (box.includes(k) ? props : dom)[k] = rest[k];
  const extra = {
    gridTemplateColumns: columns == null ? undefined : typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns,
    gap: sp(gap), alignItems: AL[align] || align, justifyItems: JU[justify] || justify,
  };
  return React.createElement(as, { ref, className: `krnl-grid ${className}`.trim(), style: boxStyle(props, extra, style), ...dom }, children);
});

// NB: meta is a PURE self-contained literal (the catalog parser evaluates it in
// isolation), so the shared prop lists are inlined per component - no external vars.
export const meta = {
  Box: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['container', 'spacing', 'surface'],
    keywords: ['box', 'container', 'padding', 'surface', 'layout', 'div'],
    summary: 'Primitive layout container: token-driven padding / surface / radius / border.',
    props: [
      { name: 'p', class: 'dsPresentation', type: 'number', description: 'Padding step, resolves to var(--space-N). px/py set an axis; pt/pr/pb/pl set one side.' },
      { name: 'px', class: 'dsPresentation', type: 'number', description: 'Horizontal padding step (left + right).' },
      { name: 'py', class: 'dsPresentation', type: 'number', description: 'Vertical padding step (top + bottom).' },
      { name: 'bg', class: 'dsPresentation', type: 'string', description: 'Surface token name; resolves to var(--<bg>), e.g. bg="surface-raised".' },
      { name: 'radius', class: 'dsPresentation', type: 'string', description: 'Radius token step; resolves to var(--krnl-radius-<radius>), e.g. radius="sm".' },
      { name: 'border', class: 'dsPresentation', type: 'bool', description: 'Adds a hairline token border (--border-subtle).' },
      { name: 'as', class: 'dsPresentation', type: 'string', default: 'div', description: 'The HTML element to render.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The laid-out content.' },
    ],
    bestPractices: [
      { do: true, text: 'Use Box for a padded / surfaced region; reach for Stack / Inline / Grid when it also arranges children.' },
      { do: false, text: 'Hardcode padding in px - pass a space step (p={3}) so spacing stays on the tokenset.' },
    ],
    related: ['Stack', 'Inline', 'Grid'],
    composes: [],
    usage: '<Box p={4} bg="surface-raised" radius="md" border>...</Box>',
  },
  Stack: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['vertical layout', 'form', 'list'],
    keywords: ['stack', 'vstack', 'column', 'vertical', 'flex', 'gap', 'layout'],
    summary: 'Vertical flow with a token gap (flex column).',
    props: [
      { name: 'gap', class: 'dsPresentation', type: 'number', description: 'Space between children; resolves to var(--space-N).' },
      { name: 'align', class: 'dsPresentation', values: ['start', 'center', 'end', 'stretch', 'baseline'], description: 'Cross-axis alignment (align-items).' },
      { name: 'justify', class: 'dsPresentation', values: ['start', 'center', 'end', 'between', 'around', 'evenly'], description: 'Main-axis distribution (justify-content).' },
      { name: 'p', class: 'dsPresentation', type: 'number', description: 'Padding step (var(--space-N)); px/py/pt.. also accepted.' },
      { name: 'bg', class: 'dsPresentation', type: 'string', description: 'Surface token name -> var(--<bg>).' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The stacked content.' },
    ],
    related: ['Inline', 'Box', 'Grid'],
    composes: [],
    usage: '<Stack gap={3}>\n  <Field />\n  <Field />\n</Stack>',
  },
  Inline: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['horizontal layout', 'toolbar', 'button row'],
    keywords: ['inline', 'hstack', 'row', 'horizontal', 'flex', 'gap', 'wrap', 'layout'],
    summary: 'Horizontal flow with a token gap; items vertically centered by default (flex row).',
    props: [
      { name: 'gap', class: 'dsPresentation', type: 'number', description: 'Space between children; resolves to var(--space-N).' },
      { name: 'align', class: 'dsPresentation', values: ['start', 'center', 'end', 'stretch', 'baseline'], description: 'Cross-axis alignment (align-items); defaults to center.' },
      { name: 'justify', class: 'dsPresentation', values: ['start', 'center', 'end', 'between', 'around', 'evenly'], description: 'Main-axis distribution (justify-content).' },
      { name: 'wrap', class: 'dsPresentation', type: 'bool', description: 'Allow items to wrap to the next line.' },
      { name: 'p', class: 'dsPresentation', type: 'number', description: 'Padding step (var(--space-N)); px/py/pt.. also accepted.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The inline content.' },
    ],
    related: ['Stack', 'Box', 'Grid'],
    composes: [],
    usage: '<Inline gap={2} justify="between">\n  <Title />\n  <Actions />\n</Inline>',
  },
  Grid: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Layout',
    usecases: ['grid layout', 'card grid'],
    keywords: ['grid', 'columns', 'gap', 'layout', 'css-grid'],
    summary: 'CSS grid with a column count (or template) and a token gap.',
    props: [
      { name: 'columns', class: 'dsPresentation', type: 'number | string', description: 'Column count (=> repeat(n, minmax(0,1fr))) or an explicit grid-template-columns string.' },
      { name: 'gap', class: 'dsPresentation', type: 'number', description: 'Gap between cells; resolves to var(--space-N).' },
      { name: 'p', class: 'dsPresentation', type: 'number', description: 'Padding step (var(--space-N)); px/py/pt.. also accepted.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The grid cells.' },
    ],
    related: ['Box', 'Stack'],
    composes: [],
    usage: '<Grid columns={2} gap={3}>\n  <Card /> <Card />\n</Grid>',
  },
};
