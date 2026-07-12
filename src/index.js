// Kernel — the generic, client-shippable design-system surface.
//
// DTCG design tokens (../tokens) + Base UI component wrappers, styled through the
// `.krnl-*` contract in styles.css. This is the "." package entry. The healthcare-
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
export * from './components/Layout.jsx';
export * from './components/Card.jsx';
export * from './components/SidePanel.jsx';
export * from './components/Menu.jsx';
export * from './components/ContextMenu.jsx';
export * from './components/Popover.jsx';
export * from './components/Dialog.jsx';
export * from './components/AlertDialog.jsx';
export * from './components/Select.jsx';
export * from './components/Checkbox.jsx';
export * from './components/RadioGroup.jsx';
export * from './components/Slider.jsx';
export * from './components/TextArea.jsx';
export * from './components/Tabs.jsx';
export * from './components/Collapsible.jsx';
export * from './components/Separator.jsx';
export * from './components/Progress.jsx';
export * from './components/Chip.jsx';
export * from './components/ToggleGroup.jsx';
export * from './components/Fab.jsx';
export * from './components/Trigger.jsx';
export * from './components/ActionRow.jsx';
export * from './components/sprout-cards/SproutCard.jsx';
export * from './components/sprout-cards/PatientCard.jsx';
export * from './components/sprout-cards/PropertyList.jsx';
// NB: the clinical card-media primitives + FHIR helpers from sprout-cards/lib.jsx
// (Sparkline, ReferenceRangeBar, ScheduleStrip, FieldList, ReactionList, PrimaryCTA,
// propertyMap, propertyIcons, txtNL, iconFor) are healthcare-specific and ship behind
// the "./clinical" subpath (see src/clinical.js), NOT on the generic "." surface — so
// an external/client build can drop the whole clinical slice. Import them from
// '@corilus/kernel/clinical'. (B-49: relocated out of "." 2026-07-12.)
export * from './lib/icons.jsx';   // Icon
export * from './lib/logo.js';     // KRNL_LOGO_SRC, brandLogoSvg, krnlLogoSvg
