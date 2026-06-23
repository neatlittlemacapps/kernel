# Kernel

Corilus' shippable **design system** — W3C DTCG design tokens (`tokens/`) + Base UI
component wrappers (`src/`), styled exclusively through the framework-neutral `.cc-*`
contract in `src/styles.css`.

Extracted from `companion-forge`/`greenhouse` (migration Phase 4). The dependency only
points downward: components never import the companion app layer.

## Consumption (two tiers)

| Entry | Import | Contents |
|---|---|---|
| **`.`** (generic) | `import { Btn, SproutCard, Card, … } from '@corilus/kernel'` | Base UI wrappers (`Btn`, `IconButton`, `AIBadge`, `PAv`, `Tip`, `Toggle`, `TextInput`, `FFSection`, `Accordion`, `AIMarker`, `ActionRow`) + the sprout-card system (`SproutCard`, `Card`, `PropertyList`, primitives, helpers) |
| **`./clinical`** | `import { MedicationCard, … } from '@corilus/kernel/clinical'` | Corilus healthcare-specific per-object cards (Allergy, Condition, Demographic, LabResult, Medication, VitalSign) |
| `./styles.css` | the `.cc-*` visual contract | — |
| `./tokens/*` | the DTCG token tree | primitives → brand → semantic + responsive → components |

**Two-tier rule:** the **internal (Corilus)** build includes `./clinical`; the
**external/client** build imports only `.` and drops the clinical slice (exercised in
Phase 7). React / ReactDOM / Base UI are peer dependencies (the host provides them).

> Source is JSX consumed by a bundler (e.g. greenhouse's esbuild). A standalone Kernel
> build + Storybook is a later milestone (Phase 7).

## Two-tier drop — verified

The external/client tier is the `.` entry; the internal (Corilus) tier adds `./clinical`.
Because the clinical cards are reachable **only** through `./clinical`, a consumer that
imports just `.` never pulls them — the bundler tree-shakes them out, no build flag needed.

Exercised 2026-06-23 (esbuild metafile, via greenhouse's toolchain):

| Entry a consumer imports | clinical card files bundled |
|---|---|
| `@corilus/kernel` (external/client) | **none** ✓ |
| `@corilus/kernel/clinical` (internal/Corilus) | all 6 (Allergy, Condition, Demographic, LabResult, Medication, VitalSign) |

So the **client-facing build drops the clinical slice automatically** while the internal
build opts in via `./clinical` — locked decision 2, confirmed.
