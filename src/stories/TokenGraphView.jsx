// @hand-authored - Foundations/Token Graph docs page. Not a catalog component: builds
// the token-set dependency graph from tools/lib/token-graph.mjs (the same logic
// tools/token-graph.test.mjs exercises against real files via Node fs) and renders it
// with React Flow. Vite eagerly inlines every tokens/**/*.tokens.json JSON module at
// build time, so there is no generation step to keep in sync.
import * as React from 'react';
import { ReactFlow, Background, Controls, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { buildTokenGraph, activeSetsFor } from '../../tools/lib/token-graph.mjs';
import resolver from '../../tokens/theme.resolver.json';

const modules = import.meta.glob('/tokens/**/*.tokens.json', { eager: true, import: 'default' });
const files = new Map();
for (const [path, json] of Object.entries(modules)) {
  files.set(path.replace(/^\/tokens\//, ''), json);
}

const { nodes: graphNodes, edges: graphEdges, tierOrder } = buildTokenGraph(files, resolver);

const TIER_COLOR = {
  primitives: '#64748b',
  brand: '#c026d3',
  theme: '#0891b2',
  breakpoint: '#65a30d',
  density: '#ea580c',
  typography: '#4f46e5',
  foundations: '#0d9488',
  components: '#dc2626',
};

// Storybook's breakpoint toolbar globals (sm/md/lg/xl, see .storybook/preview.jsx)
// predate the resolver's breakpoint modifier (desktop/tablet/mobile) -- this is the
// one place both vocabularies get reconciled.
const BREAKPOINT_MAP = { sm: 'mobile', md: 'tablet', lg: 'desktop', xl: 'desktop' };

const COLUMN_WIDTH = 260;
const ROW_HEIGHT = 72;

const NODE_POSITION = (() => {
  const byTier = {};
  for (const n of graphNodes) (byTier[n.tier] ||= []).push(n);
  for (const list of Object.values(byTier)) list.sort((a, b) => a.id.localeCompare(b.id));

  const positions = new Map();
  tierOrder.forEach((tier, col) => {
    (byTier[tier] || []).forEach((n, row) => {
      positions.set(n.id, { x: col * COLUMN_WIDTH, y: row * ROW_HEIGHT });
    });
  });
  return positions;
})();

function edgeLabel(edge) {
  if (edge.kinds.includes('alias')) {
    return `${edge.pairs.length} token${edge.pairs.length === 1 ? '' : 's'}`;
  }
  return 'cascade';
}

export function TokenGraphView({ brand = 'corilus', theme = 'light', breakpoint = 'lg', density = 'comfortable' }) {
  const [selected, setSelected] = React.useState(null);

  const selection = React.useMemo(
    () => ({ brand, theme, density, breakpoint: BREAKPOINT_MAP[breakpoint] || 'desktop' }),
    [brand, theme, density, breakpoint],
  );
  const active = React.useMemo(() => activeSetsFor(resolver, selection), [selection]);

  const nodes = React.useMemo(
    () => graphNodes.map((n) => {
      const isActive = active.has(n.id);
      const color = TIER_COLOR[n.tier] || '#94a3b8';
      return {
        id: n.id,
        position: NODE_POSITION.get(n.id) || { x: 0, y: 0 },
        // Columns run left (primitives) -> right (components) by resolutionOrder, but a
        // set's edges point at what it DEPENDS ON, which is almost always an earlier
        // (more-left) column -- so the arrow flow is right-to-left. Handles must sit on
        // the left/right faces to match; left as the React Flow default (top/bottom)
        // turned every cross-column edge into a big vertical loop.
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        data: { label: `${n.id}\n(${n.tokenCount} tokens)` },
        selected: selected === n.id,
        style: {
          border: `2px solid ${color}`,
          background: isActive ? `${color}22` : '#00000008',
          color: isActive ? 'inherit' : '#94a3b8',
          opacity: isActive ? 1 : 0.45,
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 11,
          width: COLUMN_WIDTH - 40,
          whiteSpace: 'pre-line',
        },
      };
    }),
    [active, selected],
  );

  const edges = React.useMemo(
    () => graphEdges.map((e) => {
      const isActive = active.has(e.from) && active.has(e.to);
      const isCascadeOnly = !e.kinds.includes('alias');
      // Once a node is picked, fade every edge that doesn't touch it so the side
      // panel's detail has an obvious home on the canvas instead of competing with
      // the full ~40-edge tangle.
      const touchesSelection = !selected || e.from === selected || e.to === selected;
      const dim = !isActive || !touchesSelection;
      return {
        id: `${e.from}->${e.to}`,
        source: e.from,
        target: e.to,
        type: 'smoothstep',
        label: edgeLabel(e),
        labelShowBg: true,
        labelBgStyle: { fillOpacity: dim ? 0 : 0.9 },
        markerEnd: dim ? undefined : { type: MarkerType.ArrowClosed, color: '#334155', width: 14, height: 14 },
        zIndex: dim ? 0 : 1,
        style: {
          stroke: dim ? '#e2e8f0' : '#334155',
          strokeDasharray: isCascadeOnly ? '4 3' : undefined,
          strokeWidth: dim ? 1 : 1.75,
        },
        labelStyle: { fontSize: 10, fill: dim ? '#cbd5e1' : '#334155' },
      };
    }),
    [active, selected],
  );

  const selectedNode = selected && graphNodes.find((n) => n.id === selected);
  const selectedEdges = selected
    ? graphEdges.filter((e) => e.from === selected || e.to === selected)
    : [];

  return (
    <div style={{ display: 'flex', gap: 12, height: '80vh' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => setSelected(node.id)}
          onPaneClick={() => setSelected(null)}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div style={{ width: 320, flexShrink: 0, overflowY: 'auto', fontSize: 12, fontFamily: 'monospace' }}>
        <p style={{ marginTop: 0 }}>
          Active for <b>{brand}</b> / <b>{theme}</b> / <b>{breakpoint}</b> / <b>{density}</b>:
        </p>
        {!selectedNode && <p style={{ color: '#64748b' }}>Click a node to inspect its token aliases.</p>}
        {selectedNode && (
          <>
            <h4 style={{ marginBottom: 4 }}>{selectedNode.id}</h4>
            <p style={{ color: '#64748b', margin: '0 0 8px' }}>
              {selectedNode.file} - {selectedNode.tokenCount} tokens - tier: {selectedNode.tier}
              {active.has(selectedNode.id) ? ' (active)' : ' (inactive)'}
            </p>
            {selectedEdges.map((e) => (
              <div key={`${e.from}->${e.to}`} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 'bold' }}>
                  {e.from} {'->'} {e.to} <span style={{ fontWeight: 'normal' }}>({e.kinds.join(', ')})</span>
                </div>
                {e.pairs.length === 0 && <div style={{ color: '#94a3b8' }}>(cascade only, no direct alias)</div>}
                {e.pairs.map((p) => (
                  <div key={p} style={{ color: '#334155' }}>{p}</div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
