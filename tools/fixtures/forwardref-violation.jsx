// FIXTURE (grove BACKLOG B-35) - a seeded violation for the catalog gate's
// `forwardref-render-target` check. NOT a real component and NOT under src/, so gen-catalog and
// `npm run gate` never see it; the gate test points catalog-gate.mjs at tools/fixtures/ on purpose.
//
// `BadChip` is defined here but NOT wrapped in forwardRef, yet it is used as a Base UI element
// render target (`render={<BadChip/>}`) - exactly the case the check must flag as an error.

export const meta = {
  BadChip: { layer: 'atom', scope: 'global', usecases: ['fixture'], status: 'experimental', summary: 'Seeded forwardRef violation.', props: {}, composes: [] },
};

export function BadChip({ label }) {
  return <span className="bad-chip">{label}</span>;
}

export function Host() {
  // render target is a component ELEMENT that is not forwardRef -> the injected ref is lost.
  return <Menu.Trigger render={<BadChip label="x" />} />;
}
