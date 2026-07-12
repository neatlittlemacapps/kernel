// Kernel — clinical tier (the "./clinical" subpath).
//
// Corilus healthcare-specific per-object cards. These are companion/healthcare-
// specific, NOT generic primitives — kept behind a separate entry point so the
// EXTERNAL/client Kernel build can drop this slice while the INTERNAL (Corilus)
// build includes it. Each card composes the generic Card/lib primitives from the
// "." surface (downward dependency only).
export { AllergyCard } from './components/sprout-cards/AllergyCard.jsx';
export { ConditionCard } from './components/sprout-cards/ConditionCard.jsx';
export { DemographicCard } from './components/sprout-cards/DemographicCard.jsx';
export { LabResultCard } from './components/sprout-cards/LabResultCard.jsx';
export { MedicationCard } from './components/sprout-cards/MedicationCard.jsx';
export { VitalSignCard } from './components/sprout-cards/VitalSignCard.jsx';

// Clinical card-media primitives + the FHIR-property registry / Dutch label table.
// Relocated here from the generic "." surface (B-49, 2026-07-12): these are
// healthcare-specific building blocks for the cards above, not generic atoms, so they
// ship with the clinical slice and drop out of an external build that omits it.
export {
  Sparkline,
  ReferenceRangeBar,
  ScheduleStrip,
  FieldList,
  ReactionList,
  PrimaryCTA,
  propertyMap,
  propertyIcons,
  txtNL,
  iconFor,
} from './components/sprout-cards/lib.jsx';
