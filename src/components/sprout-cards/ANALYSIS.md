# Sprout cards — analysis

A system for rendering FHIR patient properties (vital signs, labs, demographics, conditions, allergies, medications) as cards that grow through the Sprout fidelities. The base Card is one component; per-object cards compose it with object-appropriate slots and tone. The list view (Act 2) consumes the same base.

> Internal-only doc. Audience-facing strings never mention "Sprout" / "Kernel" / "Juglans" — those names live in code and design, not in product UI (see `src/lib/i18n.js`).

## 1 · Reading the reference image (Hartslag-kaart)

Walking left-to-right through the three variants in the reference, every distinct visual region becomes a candidate base-card slot:

| Region in image | At which stage | Maps to base slot |
|---|---|---|
| Tone-coloured rule at top edge | Sprout, Shoot | CSS `::before`, driven by `data-stage` + property tone (not a slot) |
| Tinted square icon pill (light bg, tone-coloured glyph) | All | `leading` |
| Small-caps property label ("HARTSLAG") | All | `title` |
| Adornment glyph top-right (e.g. heart-ECG) | Sprout | `trailing` |
| Edit chip top-right ("✎ Bewerken") | Shoot | `trailing` |
| Big numeric value + small unit ("74 bpm") | All | `value` |
| Stepper around value (− / +) | Shoot only | composed *inside* `value` slot — base card doesn't know about steppers |
| Status pill ("● Normaal") | All (subtle at Seed = dot only) | `meta` |
| Trend delta ("^ +2") | Sprout | `meta` (right-aligned chip set) |
| Sparkline area | Sprout | `media` |
| Footer info row ("7-daags · rust 64" / "Gemeten 09:14") | Sprout | `footer` |
| Primary action button ("Waarde opslaan") | Shoot | `actions` |

**Eight base slots:** `leading`, `title`, `trailing`, `value`, `meta`, `media`, `footer`, `actions`. (No `body` slot — turned out unnecessary; rich content sits in `media` / `footer`.)

**Two orthogonal colour axes** the image exposes:
- **Property tone** (heart = red, oxygen = blue, temperature = amber, …) → identity colour; drives the top rule + icon pill tint + accent.
- **Interpretation status** (normal / borderline / high / low / critical) → the `meta` pill's dot + text; *not* the card tone. A heart-rate card is red-toned even when its reading is normal.

These two must not be conflated. The base Card exposes them as separate props (`tone` and `status`).

## 2 · FHIR property inventory (in scope)

The user opted for the wider scope: vital signs + labs + demographics + conditions + allergies + medications. These span four FHIR resource families, each with its own shape.

### 2.1 Observation — Vital Signs profile (`category = vital-signs`)

| LOINC | Name | UCUM unit | Multi-comp? | Suggested tone |
|---|---|---|---|---|
| 8867-4 | Heart rate | /min | no | `heart` (red) |
| 9279-1 | Respiratory rate | /min | no | `breath` (cyan) |
| 2708-6 | Oxygen saturation (arterial) | % | no | `oxygen` (blue) |
| 8310-5 | Body temperature | Cel / [degF] | no | `temperature` (amber) |
| 85354-9 | Blood pressure (panel) | mm[Hg] | **yes** (systolic 8480-6 + diastolic 8462-4 as `component[]`) | `pressure` (violet) |
| 8302-2 | Body height | cm / [in_i] | no | `body` (slate-warm) |
| 29463-7 | Body weight | g / kg / [lb_av] | no | `body` (slate-warm) |
| 39156-5 | Body mass index | kg/m² | no | `body` (slate-warm) |
| 9843-4 | Head occipital-frontal circumference | cm / [in_i] | no | `body` (slate-warm) |

Panel parent: 85353-1 (groups the above via `hasMember`).

### 2.2 Observation — Laboratory (`category = laboratory`)

Same Observation shape; differs in tone, expected ranges, and frequency of trending.

| LOINC | Name | UCUM unit | Suggested tone |
|---|---|---|---|
| 2339-0 | Glucose, blood | mg/dL or mmol/L | `lab` (teal) |
| 4548-4 | HbA1c | % | `lab` (teal) |
| 33914-3 | eGFR | mL/min/{1.73_m2} | `lab` (teal) |
| 718-7 | Haemoglobin | g/dL | `lab` (teal) |
| 2093-3 | Cholesterol, total | mg/dL or mmol/L | `lab` (teal) |

(Tone shared — labs are usually surfaced as a group; the variety lives in interpretation pills + reference ranges, not in card tone.)

### 2.3 Patient — Demographics

Different resource. Card represents the *patient* itself, not a measurement.

Key elements: `name` (HumanName), `birthDate`, `gender`, `identifier[]` (RIZIV / INSZ / BSN), `telecom[]`, `address[]`, `communication[]`, `generalPractitioner`.

Tone: `identity` (deep slate, neutral).

### 2.4 Condition — Active problems

Key elements: `code`, `clinicalStatus` (active / recurrence / relapse / inactive / remission / resolved), `verificationStatus`, `severity`, `onsetDateTime`, `note`.

Tone: `condition` (rose-warm, distinct from the danger pill).

### 2.5 AllergyIntolerance

Key elements: `code` (substance), `criticality` (low / high / unable-to-assess), `reaction[].manifestation[]`, `clinicalStatus`, `verificationStatus`, `recordedDate`.

Tone: `allergy` (amber-rust). Critical allergies escalate the status pill to `critical`, never the card tone (criticality is the interpretation, not the identity).

### 2.6 MedicationStatement (or MedicationRequest, depending on stage)

Key elements: `medicationCodeableConcept` / `medicationReference`, `dosage[]` (text + timing + route), `status` (active / completed / entered-in-error / intended / stopped / on-hold), `effectivePeriod`, `reasonCode`.

Tone: `medication` (indigo).

## 3 · OOUX pass

### Objects (nouns the practitioner thinks in)

```
VitalSign       — a single measurement, point-in-time, time-series-able
LabResult       — a single result, with reference range central to meaning
Demographic    — the patient identity card; "who am I looking at"
Condition       — a problem; persistent state with lifecycle
Allergy         — a risk flag; gates other actions (prescribing especially)
Medication      — a regimen; lifecycle (active/stopped) + adherence over time
```

### Relationships

```
Patient                                 (root)
├─ has VitalSign[]                      (time-series; latest is the headline)
├─ has LabResult[]                      (time-series; grouped into panels)
├─ has Demographic                      (1:1; cardinality 1)
├─ has Condition[]                      (problem list)
├─ has Allergy[]                        (allergy list — gates Medication CTAs)
└─ has Medication[]                     (active scheme + history)

VitalSign → references Patient.subject
VitalSign → references Practitioner.performer
LabResult → has ReferenceRange[]        (often age/sex-banded)
Condition → may reference Encounter
Allergy → blocks/warns on Medication (cross-object reaction check)
Medication → references Condition (reasonReference)
```

The cross-object reaction (Allergy gates Medication) is the strongest reason to keep these cards in one system: a Medication card at Shoot must read the Allergy list to render a warning before the practitioner adds a dose.

### CTAs (verbs)

Per Sprout's safety gradient: low-risk reads at Seed/Sprout; writes only at Shoot or beyond.

| Object | Seed | Sprout | Shoot | Rooted (host) |
|---|---|---|---|---|
| VitalSign | (read only) | View trend, Compare | Record new value | Edit history, sign-off |
| LabResult | (read only) | View trend, View range | (rare — labs usually rooted) | Request, Acknowledge |
| Demographic | (read only) | View detail | Update contact / address | Edit identifiers, GP link |
| Condition | (read only) | View detail | Update status (active → resolved) | Add / remove, link encounter |
| Allergy | (read only) | View reactions | Update severity | Record new, mark verified |
| Medication | (read only) | View schedule | Mark taken / paused | Prescribe, stop, dose-change (signed) |

**No prescribing from a Seed.** Prescribing always Rooted. Dose-confirm "taken" can be Shoot (no irreversible consequence).

### Attributes (what each object exposes per fidelity)

| Object | Seed (1-line glance) | Sprout (rich card) | Shoot (interactive) |
|---|---|---|---|
| VitalSign | value, unit, status dot | + sparkline, trend Δ, last-measured time, reference label | + stepper, save |
| LabResult | value, unit, ↑/↓ flag | + reference range mini-bar, last-measured | + (rare) acknowledge |
| Demographic | name, age, sex | + identifiers, primary phone, GP, address line | + edit-in-place fields |
| Condition | code text, clinical status | + onset, severity, recent note | + status transition select |
| Allergy | substance, criticality icon | + reactions list, last verified | + criticality re-select |
| Medication | name, dose-line, status dot | + schedule strip (days), reason, prescriber | + mark-taken / mark-paused |

### Sprout map (per object)

The Sprout pattern is "same answer at four fidelities." For each object the *same record* grows through the stages — never a different record at each stage. Rooted is **out of card** (host application takes over with the conversation's state pre-loaded).

```
VitalSign        Seed ─→ Sprout ─→ Shoot ─→ ⟦host: full vital editor + signoff⟧
LabResult        Seed ─→ Sprout ─→ ⟦host: full result with provenance + ack⟧   (Shoot rare)
Demographic      Seed ─→ Sprout ─→ Shoot ─→ ⟦host: patient master record edit⟧
Condition        Seed ─→ Sprout ─→ Shoot ─→ ⟦host: problem list edit + encounter link⟧
Allergy          Seed ─→ Sprout ─→ Shoot ─→ ⟦host: allergy registry + sign-off⟧
Medication       Seed ─→ Sprout ─→ Shoot ─→ ⟦host: prescription system; signed Rx⟧
```

## 4 · Base Card requirements (synthesised)

From the union of objects above, the base Card must provide:

1. **8 slots** as derived in §1.
2. **Two orthogonal colour axes**: `tone` (identity) and `status` (interpretation).
3. **Fidelity attribute** `data-stage="seed|sprout|shoot"` driving the top rule + spacing.
4. **States**: `is-loading`, `is-error`, `is-empty`, `is-stale` (data outdated), `is-selected`, `is-disabled`, `is-dragging` (visual only — drag mechanism deferred per Act-1 scope).
5. **Intrinsic width morphing** via container queries (`container-type: inline-size`) — see §6 on the codebase-convention deviation.
6. **Density + breakpoint awareness** inherited from the root `data-density` / `data-breakpoint` attributes (the codebase already wires these globally).
7. **Token-only styling** — no hardcoded values. Where the existing token set is insufficient, log to `TOKEN-GAPS.md` with a proposed token (the `/design-tokens` skill is the only legitimate path to actually adding them).
8. **A11y**: announces `tone` only as decoration, announces `status` as text (interpretation belongs in the accessible name), `aria-busy` on `is-loading`, `aria-disabled` on `is-disabled`.

## 5 · A2UI — what we use, what we don't

The user's instruction is to use A2UI as **inspiration only**: build Base UI React components and verify the design *could* be agent-driven, without making A2UI's wire format constrain the component code.

Two correctnesses worth recording so the next reader doesn't get tripped up:

- **A2UI's `ActionResponse` is RPC, not UI.** It carries the `value` returned to a client-initiated `action`. It does **not** describe components, layouts, or slots. UI in A2UI is created via `createSurface` and mutated via `updateComponents`, with composition done via adjacency-list child references — there is **no formal "slots" mechanism** in the protocol.
- **Sprout has four stages, but only three live in the card.** Seed / Sprout / Shoot transition *within* the card. Rooted is by definition the moment the practitioner steps into the native application — out of the card surface entirely. The base Card therefore exposes `data-stage="seed|sprout|shoot"` and a `rooted` event/CTA the consumer wires to host navigation.

## 6 · Container-query deviation (declared)

The Companion codebase's responsive convention is **deterministic, attribute-driven**: the host owns the breakpoint, flips `data-breakpoint` on the root, and CSS responds to that. There are no media queries and no container queries elsewhere in the bundle.

The user's instruction — *"I want to make sure the card morphs nicely according to the available width"* — is intrinsic-by-container, not parent-decided. The honest implementation is **`container-type: inline-size` on the card** with `@container` rules for compact / regular / wide ranges. This deviates from the codebase convention but with two mitigations:

- Container queries are **still deterministic** — the *parent* owns the card's available width, so behaviour is predictable; only the card's internal layout responds. This is unlike viewport-driven media queries.
- All container-query breakpoints live in one place in `styles.css`, named consistently, with the breakpoint values pulled from token CSS variables (so the responsive token tier remains the source of truth).

If this deviation becomes a problem at review, the alternative is the discrete `size` prop chosen by the parent — but it doesn't satisfy "morphs nicely" the way the user worded it.

## 7 · Suggested A2UI components (deliverable)

The numbered list of components that follow the Sprout mechanic. Each is a Base UI / React component in this repo; the right-most column shows the A2UI surface shape a hypothetical agent would push.

| # | Component | Object class | Stages | A2UI shape (illustrative) |
|---|---|---|---|---|
| 1 | `VitalSignCard` | Observation (vitals) | Seed → Sprout → Shoot | `createSurface` with one `Card` root + `Sparkline` child; `updateComponents` swaps `value` child for `Stepper` at Shoot |
| 2 | `LabResultCard` | Observation (lab) | Seed → Sprout | `createSurface` with `Card` + `ReferenceRangeBar`; rarely escalates beyond Sprout |
| 3 | `DemographicCard` | Patient | Seed → Sprout → Shoot | `createSurface` with `Card` + `FieldList`; Shoot swaps fields for `EditableField`s |
| 4 | `ConditionCard` | Condition | Seed → Sprout → Shoot | `createSurface`; `updateComponents` adds `StatusSelect` at Shoot |
| 5 | `AllergyCard` | AllergyIntolerance | Seed → Sprout → Shoot | `createSurface` with `ReactionList` child; Shoot adds `CriticalitySelect` |
| 6 | `MedicationCard` | MedicationStatement | Seed → Sprout → Shoot | `createSurface` with `ScheduleStrip`; Shoot adds `TakenToggle` |
| 7 | `PropertyList` *(Act 2)* | any | n/a | `createSurface` with `Column`/`List` root + N `Card` children; `updateDataModel` re-binds the dataset, cards re-render in place |

All seven compose the same `Card` base. Adding a new property type is a one-file change.

## 8 · Open questions

- **Rooted handoff bus event** — does the existing bus already have a "navigate to record" message, or do we need a new event? Out of Act-1 scope; record for follow-up.
- **Reference-range terminology** is a closed question per FHIR but a hard UX problem (age + sex banding, paediatric vs adult). Sprout-stage `LabResultCard` will need a tiny inline range-bar — design effort proportional to clinical risk.
- **Allergy↔Medication gating UX**: at Medication Shoot, the card must read Allergy list and render a contraindication warning. The cross-object dependency is real and belongs in the system design, not just the component. Tracked for Act 2.
