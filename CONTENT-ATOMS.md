# Content atoms — the base set you drop into Card regions

**What this is.** The small, region-agnostic pieces that fill a `Card`'s slots
(`Card.Header` leading / title / action · `Card.Body` · `Card.Footer`). They own no data
and no layout — they assemble pre-styled bits so a card composition stays tiny. This is the
content half of the card system; the chrome half is `Card` + `resolveCardChrome`
(see [BASE-CARD-PLAN.md](BASE-CARD-PLAN.md)).

**Where they live.** `src/components/content/content.jsx` — extracted 2026-08 from the
clinical `sprout-cards` so they read as a generic base set rather than clinical parts. All
export from the generic `@corilus/kernel` surface and sit under **Core / Content** in
Storybook (see the Card **Composer** story to drop them into regions interactively).

## The set (8), by region

| Atom | Typical region | What it is |
|---|---|---|
| `IconPill` | Header · leading | Rounded-square tone-tinted glyph tile |
| `StatusPill` | Header · status / Body | Dot + label state badge (tone = state, not identity) |
| `TrendChip` | Header · status / Body | Δ indicator with a direction arrow (up/down/flat) |
| `ValueDisplay` | Body · value | Big numeric value + small unit ("152/94 mmHg") |
| `Stepper` | Body · value (editable) | Minus / value / plus (Base UI NumberField) |
| `Sparkline` | Body / Header media | Inline SVG line chart, `currentColor` |
| `FieldList` | Body | Definition list of label / value rows |
| `EditChip` | Header · action / Footer | Pencil + label chip (Base UI Button) |

Compose them straight into slots, e.g.:

```jsx
<Card accent tone="info">
  <Card.Header
    leading={<IconPill label="BP">{Icon.heart({ size: 18 })}</IconPill>}
    title={<>Blood pressure <StatusPill status="high" label="Elevated" /></>}
    action={<EditChip label="Edit" />}
  />
  <Card.Body><ValueDisplay value="152/94" unit="mmHg" /></Card.Body>
</Card>
```

## Current usage in Juglans (greenhouse)

Grepped 2026-08. These atoms are live in the injectable assistant — migrate with care.

| File | Imports (from `@corilus/kernel`) |
|---|---|
| `greenhouse/src/juglans/Juglans.jsx` | `PatientCard, StatusPill, TrendChip, ValueDisplay, Stepper, IconPill, EditChip, MeterTooltip` |
| `greenhouse/src/index.jsx` | `Meter, ValueDisplay, Table, DonutGauge, Tooltip` |

| File | Imports (from `@corilus/kernel/clinical`) |
|---|---|
| `greenhouse/src/juglans/Juglans.jsx` | `Sparkline, ReferenceRangeBar, ScheduleStrip, FieldList, ReactionList, PrimaryCTA, propertyMap, propertyIcons, txtNL` |

grove also imports `PatientCard`, `SproutCard`, `ValueDisplay`, `Stepper`, `Sparkline`,
`TrendChip`, `StatusPill`, `MeterTooltip`, `VitalSignCard`, `ScheduleStrip`.

**The extraction is non-breaking:** every import above still resolves.
- The 6 generic atoms (`StatusPill`/`TrendChip`/`ValueDisplay`/`Stepper`/`IconPill`/`EditChip`)
  moved to `content/`; `sprout-cards/PatientCard.jsx` re-exports them, and `index.js` exports
  them from `content/`, so `from '@corilus/kernel'` is unchanged.
- `Sparkline` + `FieldList` were **promoted** from `./clinical` to the generic surface. They
  now export from `@corilus/kernel`, and `./clinical` **still re-exports them** for back-compat,
  so Juglans's existing `from '@corilus/kernel/clinical'` keeps working.

**Migration (when convenient, not required yet):** in greenhouse/grove, move `Sparkline` +
`FieldList` imports from `@corilus/kernel/clinical` → `@corilus/kernel`. Once no consumer
imports them from `/clinical`, drop the back-compat re-export in `src/components/sprout-cards/lib.jsx`.

## Deprecation state of the clinical slice

Per the 2026-08 decision, the clinical **cards** (`PatientCard`, `SproutCard`, `PropertyList`,
`VitalSignCard`, `AllergyCard`, `ConditionCard`, `DemographicCard`, `LabResultCard`,
`MedicationCard`) and the clinical-only atoms (`ReferenceRangeBar`, `ReactionList`,
`ScheduleStrip`, `PrimaryCTA`, `MeterTooltip` + FHIR helpers) are **deprecated, not deleted** —
kept working until greenhouse/grove migrate off them, then removed with the `./clinical` slice
in a follow-up. Nothing new should build on them.

## Next builds (lined up, 2026-08)

The uploaded "collapsible cards" example + the card-system review point to two gaps the base
set doesn't yet cover — both consume the saturated **data-fill** tokens already shipped
(`semantic.data.categorical.*` / `.status.*`, see [DATA-COLOR-AND-CHROME-PLAN.md](DATA-COLOR-AND-CHROME-PLAN.md)):

1. **Chart family** (line / bar / composed) — the biggest gap; the real data-viz beyond
   `Sparkline`. Highest priority.
2. **CalendarHeatmap / DayGrid** — a month grid of status-coloured day cells, generalising the
   week-only `ScheduleStrip` (the example's MiniCalendar).

Neither is built yet. When built, they join this set under Core / Content.
