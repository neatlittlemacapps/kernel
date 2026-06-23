// Kernel — the generic, client-shippable design-system surface.
//
// DTCG design tokens (../tokens) + Base UI component wrappers, styled through the
// `.cc-*` contract in styles.css. This is the "." package entry. The healthcare-
// specific clinical cards live behind the "./clinical" subpath so external/client
// builds can drop them (two-tier consumption — see package.json `exports`).
//
// Extraction boundary (from companion-forge/greenhouse): primitives NEVER import
// from the companion app layer; the dependency only points downward.
//
// `export *` re-exports the full public surface of each module (Btn, BrandContext,
// SproutCard, Card primitives, PropertyList, lib helpers, …). Each module also has
// a co-located `export const meta`; those collide and are intentionally dropped
// from the package surface (consumers never import a component's `meta` here).

export * from './components/ui.jsx';
export * from './components/ActionRow.jsx';
export * from './components/sprout-cards/SproutCard.jsx';
export * from './components/sprout-cards/Card.jsx';
export * from './components/sprout-cards/PropertyList.jsx';
export * from './components/sprout-cards/lib.jsx';
