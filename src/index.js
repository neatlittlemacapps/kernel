// Kernel — the generic, client-shippable design-system surface.
//
// DTCG design tokens (../tokens) + Base UI component wrappers, styled through the
// `.cc-*` contract in styles.css. This is the "." package entry. The healthcare-
// specific clinical cards live behind the "./clinical" subpath so external/client
// builds can drop them (two-tier consumption — see package.json `exports`).
//
// Extraction boundary (from companion-forge/greenhouse): primitives NEVER import
// from the companion app layer; the dependency only points downward.

// Base UI wrappers (the original barrel surface)
export { Btn, IconButton, AIBadge, PAv, Tip, Toggle, TextInput, FFSection, Accordion, AIMarker } from './components/ui.jsx';
export { ActionRow } from './components/ActionRow.jsx';

// Sprout-card system (generic) — the seed→sprout→shoot orchestrator + card primitives
export { SproutCard, SproutToneProvider } from './components/sprout-cards/SproutCard.jsx';
export { Card, StatusPill, TrendChip, ValueDisplay, Stepper, IconPill, EditChip, MeterTooltip } from './components/sprout-cards/Card.jsx';
export { PropertyList } from './components/sprout-cards/PropertyList.jsx';
export { txtNL, propertyMap, propertyIcons, iconFor, Sparkline, ReferenceRangeBar } from './components/sprout-cards/lib.jsx';
