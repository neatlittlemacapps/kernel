# Color, border, and motion — Sprout cards iteration

Three things to fix or design before this system can ship beyond the current sketch. Each section ends with a recommended path; nothing is implemented yet.

---

## 1 · The "funky border" — diagnosis

The temperature card screenshot shows a thin coloured rule across the top that looks **inset** from the card's outer edge, with the grey `--border-subtle` still visible at the rounded corners. Two compounding causes:

1. **Class collision.** `src/styles.css:439` defines a different `.cc-card` for the Settings panel (border, padding, density-radius). Our Sprout rule at line 639 wins on cascade order, but density-radius from the older rule used to apply briefly during page paint. Not the visible bug — but worth namespacing later.
2. **Stripe sits inside the border.** Current CSS:
   ```css
   .cc-card[data-stage="sprout"]::before {
     position: absolute;
     inset: 0 0 auto 0;          /* references the parent's padding-box */
     height: 3px;
     border-radius: var(--cc-radius-panel) var(--cc-radius-panel) 0 0;
   }
   ```
   The parent `.cc-card` has `border: 1px solid var(--border-subtle)` plus the same border-radius. The pseudo-element is positioned at the top of the padding-box → it sits **1 px inside** the outer border. The grey border is visible above and around it; the stripe's corner radius is the *outer* card radius applied to an element that lives at the *inner* radius. The two arcs don't line up → visible seam.

### Fix options

| # | Approach | Pros | Cons |
|---|---|---|---|
| A | Extend the stripe to cover the top border: `inset: -1px -1px auto -1px;` Keeps existing visual language. | Minimal change. Stripe affordance preserved. | Still a separate paint layer; on very dense theme borders the stripe edge can shimmer. |
| B | Use a colour-tinted card border instead of a stripe: `border: 1px solid color-mix(in oklch, var(--card-tone) 40%, var(--border-subtle))`. The whole card "wears" the tone. | Clean, modern look. No corner artefacts. | Lower affordance than the reference image — loses the candy-stripe signal. |
| C | Hybrid: tinted border (B) **and** a thicker top edge via `border-top-width: 3px; border-top-color: var(--card-tone);`. | Strong signal at the top, gentle tint elsewhere. | Asymmetric borders with rounded corners blend awkwardly at the very corners (the tone gradient-fades into the side border colour). Mitigated by using the same tone family for all four sides. |
| D | Drop the stripe; use `box-shadow: inset 0 3px 0 0 var(--card-tone)` for the top accent. | Shadow respects border-radius perfectly — no inset bug. | Inset shadow sits *inside* the content area; the 1 px grey border still tops the card. Looks like a hairline above the colour bar. |

**Recommendation: A.** It's the smallest change, keeps the visual language of the reference image, and the corner alignment works correctly once `inset` covers the border. Iterate to C only if a future brand wants a stronger identity signal.

---

## 2 · Colour-passing API — research

The card today maps a fixed list of `tone` names to existing token vars (`--data-series-*`, `--status-*-solid`). That's fine for the demo, but won't scale to:

- Per-tenant custom property tones (a payer's branded vital).
- Ad-hoc Observation codes outside the catalog.
- Sub-scoping a section to a custom tone without editing tokens.

### How other systems do it

| System | Mechanism |
|---|---|
| **Material 3** | Semantic role names; you generate a full tonal palette from one key colour (`tonalSpot`). No raw colour at component-call site. |
| **IBM Carbon** | Named type tokens (`tag.red`, `tag.blue`). Components take `type`. Raw colour escape only via custom theme. |
| **Radix Themes** | Named scales (`accent` + steps 1–12). `<Theme accentColor="red">` nests; components read `--accent-9` etc. Custom colour: define a new accent in the theme config. |
| **Mantine** | `color="red" \| "my-brand"`. Themes register named colours. Raw colours discouraged but possible via `c={"#ff0044"}`. |
| **Tailwind** | Pure utilities; no semantic component-level tone — colour lives at consumer site. |

**Pattern that fits us best:** Radix's nested-theme idea + Mantine's "single optional escape hatch". Keep the semantic catalogue, allow one custom colour, derive the tints — don't expose every tone-tint ratio to consumers.

### Proposed API (3 levels of escalation)

```jsx
// Level 1 — token-bound (current). The 90% case.
<Card tone="heart" />

// Level 2 — single-colour escape hatch. Consumer provides the solid;
// tint + tint-strong derived via color-mix in OKLCH.
<Card tone="custom" customColor="oklch(0.62 0.18 25)" />
<Card tone="custom" customColor="#ff3344" />  // hex also accepted

// Level 3 — fully specified tone object. For when the derived tints look wrong
// (e.g. high-chroma source colour producing washed-out mixes).
<Card tone="custom" customColor={{
  solid:       'oklch(0.62 0.18 25)',
  tint:        'oklch(0.95 0.04 25)',
  tintStrong:  'oklch(0.88 0.07 25)',
  on:          'oklch(0.18 0.02 25)',
}} />

// Level 4 — provider-scoped. Sets the tone for a subtree without per-card props.
<SproutToneProvider tone="heart"><PropertyList ... /></SproutToneProvider>
<SproutToneProvider customColor="oklch(...)"><Section ... /></SproutToneProvider>
```

### Implementation sketch

- `Card` already reads `--card-tone` for everything tone-derived. Levels 2/3/4 collapse to "inject the right `--card-tone[...]` CSS vars on the element."
- Level 2: `style={{ '--card-tone': customColor }}` — `--card-tone-tint` etc. are computed from `--card-tone` via `color-mix()` already in the stylesheet.
- Level 3: spread the three values into inline style.
- Level 4: `<SproutToneProvider>` is a thin wrapper that sets `style={{ '--card-tone': ... }}` on a `<div>` and uses React Context only for `tone="inherit"` resolution at the Card level. No prop drilling.
- The **token-bound names stay primary**. Custom colours are an escape hatch, not the default.

### Open question for design tokens

If we add a `brand.property.{name}` ramp (per `TOKEN-GAPS.md` #1), Level 1 stops referencing chart colours and starts referencing identity colours. That's the right long-term shape. Don't ship Levels 2–4 *before* doing #1 — otherwise consumers will reach for custom colours as a workaround for missing tokens.

---

## 3 · Animation — Seed → Sprout → Shoot

The Sprout pattern's claim: **same answer, more resolution**. The motion has to feel like *the same card growing*, not three cards swapped. Today the demo just renders three side-by-side at fixed stages. We need a transition.

### Interaction triggers

| Transition | User input | Notes |
|---|---|---|
| Seed → Sprout | Tap / click the Seed pill | Whole row is the hit target. `aria-expanded` flips. |
| Sprout → Shoot | Tap the trailing **EditChip** (top-right) | Existing affordance — no new UI. Long-press on mobile as a power-user alt. |
| Shoot → Sprout | Tap **Save** (commits + retracts) OR tap a cancel/back chevron | Save retracts by default; cancel keeps the value untouched. |
| Sprout → Seed | Tap a small chevron-up in the header OR tap outside (when in a list) | "Collapse" affordance lives in the header trailing slot at Sprout stage. |

Keyboard equivalents:
- `Enter` / `Space` on focused Seed = expand.
- `Esc` = retract one level.
- `Tab` cycles to interactive children once expanded.

### Transition mechanics — three layers

A clean transition has **three independent layers** that compose:

1. **Container shape:** Card height grows / shrinks; padding tier shifts (Seed ≈ 36 px tall, Sprout ≈ 220 px).
2. **Content reveal/hide:** New slots (`media`, `footer`, `actions`) appear; existing slots reflow.
3. **Tone reveal:** Top rule slides in from 0 → 100 % width; icon pill grows from 28 → 36 px.

### Implementation choices

| # | Approach | Browser support (mid-2026) | Verdict |
|---|---|---|---|
| α | **View Transitions API** — set `view-transition-name: card-{id}`. Browser captures pre/post state and crossfades. | Chrome 111+, Safari 18.2+, Firefox 130+. Works behind `@supports`. | **Strong choice** for the Seed↔Sprout container morph. Browser interpolates layout; we add CSS for the explicit slot fades. |
| β | **CSS `interpolate-size: allow-keywords`** + height-auto transitions + opacity on appearing slots. | Chrome 129+, Safari 18.2+. Falls back gracefully (no animation, just snap). | Good fallback. Simple, declarative. |
| γ | **CSS Grid `grid-template-rows: 0fr ↔ 1fr` trick** for revealing slots. | Universal. | Reliable for *content reveal*, not for *container morph* (doesn't help with row→column flip). |
| δ | **FLIP (measure-then-animate)** via Web Animations API. | Universal. | Most code; reserve as a last-resort fallback. |

**Recommendation: α with γ as a fallback,** wrapped in `@supports (view-transition-name: x)`. The user's browser does the heavy lifting; we provide the choreography (durations, easings, named transition groups). `prefers-reduced-motion: reduce` skips α entirely.

### Choreography

```
SEED → SPROUT  (≈ 260 ms total)
  0 ms   ─ user click; capture view-transition
  0–80   ─ container expands (height auto, padding tier shifts) — eased
  60–180 ─ header reflows (icon pill grows, title sizes up)
  120–240─ media + footer fade in (opacity 0 → 1, translateY 6 → 0)
  140–260─ top tone-rule scales in from centre (transform-origin: 50% 0)

SPROUT → SHOOT  (≈ 200 ms)
  0 ms   ─ user taps EditChip
  0–120  ─ value slot crossfade: ValueDisplay → Stepper (opacity)
  60–200 ─ actions row slides up from bottom (translateY 12 → 0)
  60–120 ─ trailing chip swaps adornment → edit pill (crossfade)

Retract (Sprout → Seed): reverse choreography, 200 ms total.
```

All durations from `--motion-duration-*` tokens (proposed if not present: tracked in TOKEN-GAPS § new). Easings: spring-ish for the container morph (`cubic-bezier(0.16, 1, 0.3, 1)`), `ease-out` for content fades.

### Component shape

The base `Card` stays presentational (slot in, JSX out). Add a thin wrapper that owns stage state:

```jsx
<SproutCard
  data={hrData}
  defaultStage="seed"
  render={(stage) => <VitalSignCard data={hrData} stage={stage} />}
  onStageChange={(stage) => track('sprout-card', stage)}
/>
```

`SproutCard` provides:
- Stage state machine (`seed → sprout → shoot → sprout → seed`)
- View-transition-name application (one name per card identity)
- ARIA wiring (`aria-expanded`, `aria-controls`, focus management on expand)
- Keyboard handlers (Enter / Space / Esc)
- `prefers-reduced-motion` opt-out

This keeps the slot architecture clean: per-object cards (`VitalSignCard`, `LabResultCard`, …) don't change. Consumers can use `<SproutCard>` for the orchestrated experience, or render a fixed-stage `<VitalSignCard>` directly when the stage doesn't change (e.g. in a static dashboard print view).

### What to ship first

If we pick one thing for the next iteration, it's **§1 fix A (border) + §3 SproutCard wrapper (Seed↔Sprout only)**. Shoot can stay an explicit fixed-stage render in this iteration; the EditChip → Shoot transition is a follow-up.

§2 (colour-passing levels 2–4) can wait until the property-tone ramp lands (TOKEN-GAPS #1), to avoid creating an escape hatch that becomes the default.
