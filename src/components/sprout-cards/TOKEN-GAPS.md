# Token gaps — Sprout cards

Tokens needed by the Sprout-cards system, **framed at the semantic / brand tier so other components can consume them too** (no `component.card.*` lock-in). The Sprout-cards work *surfaced* these gaps; it's not the only consumer.

This log is the brief for the `/design-tokens` skill. Names, values, and rationale; the skill's `build_ramp.py` / `validate_tokens.py` / `generate_docs.py` own the final OKLCH + DTCG.

> **Tier discipline:** primitives → brand → semantic → (responsive parallel) → component. We want most of these at *semantic*. Add a component-tier token only when nothing higher fits.

---

## A · Property tone ramp (highest impact, broadest reuse)

**Tier:** brand → semantic indirection.

**Need:** a *property identity* colour per clinical property (heart, breath, oxygen, temperature, pressure, body, lab, identity, condition, allergy, medication). Today Sprout-cards aliases `--card-tone` to chart `--data-series-*` and `--status-*` solid colours. That's semantically borrowed — data-series is owned by charts; status is owned by interpretation. A *heart-rate card* is always red-toned, regardless of which series happens to be slot 1 in any chart.

This is **not card-specific**. Any UI surface that represents a clinical property (lists, badges, sidebar entries, tab indicators, even agent avatars when a chat thread is about heart-rate) wants the same identity colour.

**Proposed paths:**

```
brand.property.{name}.{tint, solid, on}
  - heart        hue 25°  (red, distinct from status.error)
  - breath       hue 215° (cyan)
  - oxygen       hue 245° (blue)
  - temperature  hue 60°  (amber, distinct from status.warning)
  - pressure     hue 295° (violet)
  - body         hue 30°, low chroma (warm slate — shared by height/weight/BMI/head-circ)
  - lab          hue 175° (teal)
  - identity     near-neutral (deep slate, ≈ text.default)
  - condition    hue 10°  (rose)
  - allergy      hue 35°  (rust)
  - medication   hue 265° (indigo)

semantic.color.property.{name} → resolves to the brand path; this is the consumption path.
```

Plus a **directionality hint** per property — answers "is `up` good or bad?":

```
brand.property.{name}.trend.up.tone   = 'success' | 'warning' | 'info'
brand.property.{name}.trend.down.tone = 'success' | 'warning' | 'info'

(SpO₂.trend.up = success; weight.trend.up = warning; height.trend.up = info; …)
```

This unblocks anything that renders a delta or arrow in property context (cards, sparkline tooltips, dashboards).

`build_ramp.py` per property: anchor at the hue above, chroma ≈ 0.14 (lower for `body`/`identity`/`condition`), steps 100/400/700/950 minimum.

**Used by today:** all six per-object cards.
**Will be used by:** the Sprout `TriggerChip` (when a thread is tied to a property), property filters in a list view, sidebar nav items per clinical property family.

---

## B · Tone-mix ratios

**Tier:** semantic.

**Need:** light-tinted backgrounds derived from a tone (icon pill, edit-chip backing, hover surface) need a consistent mix ratio. Today the cards inline `color-mix(in oklch, var(--card-tone) 12%, var(--surface-raised))` and `… 22% …`. The percentages are design constants pretending to be implementation details.

**Proposed paths:**

```
semantic.color.tone-mix.tint.ratio         = 12%
semantic.color.tone-mix.tint-strong.ratio  = 22%
semantic.color.tone-mix.tint-on-sunken.ratio = 18%  (optional — for tints over the sunken surface)
```

Consumer pattern (anywhere, not just cards):

```css
background: color-mix(
  in oklch,
  var(--tone) var(--semantic-color-tone-mix-tint-ratio),
  var(--surface-raised)
);
```

**Used by today:** card icon-pill bg, edit-chip bg, range-bar normal band, refbar marker shadow.
**Will be used by:** any tag/chip with a tone tint, hover backgrounds on tone-coloured rows, status pill backgrounds (which currently use a fixed `status.*-tint`).

---

## C · Touch-target dimensions

**Tier:** semantic / responsive.

**Need:** stepper buttons (Shoot stage), but also drag handles, swipe affordances, mobile primary actions — any tappable affordance that isn't a full-bleed button. Today literal 48 px / 40 px in CSS.

**Proposed paths:**

```
semantic.dimension.touch-target.regular = 48px  (WCAG 2.5.5 AAA; finger-friendly)
semantic.dimension.touch-target.compact = 40px  (dense lists / desktop)
semantic.dimension.touch-target.small   = 32px  (icon-only secondary actions; rare)
```

Density tier may want to remap (`compact` density uses `compact` touch-target by default; `spacious` uses `regular` everywhere).

**Used by today:** stepper buttons (48/40), edit-chip (44 — falls between, would round to compact).
**Will be used by:** any future drag handle, segmented control, toolbar button, mobile bottom-sheet actions.

---

## D · Rule / divider thicknesses

**Tier:** semantic / primitive.

**Need:** stripes / accent rules (the Sprout card's top rule), but also borders on inverted scopes, marker thicknesses on charts, dividers in lists, focus outlines (currently 2px literal). Today literal 3 px in the stripe; literal 2 px in focus rings; 1 px in borders.

**Proposed paths:**

```
semantic.dimension.rule.hair    = 1px   (default borders)
semantic.dimension.rule.thin    = 2px   (focus outlines)
semantic.dimension.rule.regular = 3px   (accent stripes, sparkline strokes)
semantic.dimension.rule.thick   = 4px   (heavy accents — rare)
```

**Used by today:** Sprout card stage rule (regular), refbar marker outline (thin), card borders (hair).
**Will be used by:** focus rings, dividers in `cc-action-list`, future segmented control underlines, chart sparkline strokes.

---

## E · Motion — durations + easings

**Tier:** semantic.

**Need:** the SproutCard wrapper (next iteration) animates Seed↔Sprout↔Shoot. The companion has no motion tokens today — every existing animation uses literal durations (`0.25s`, `1.6s`, `.14s`) and easings (`ease`, `ease-out`). Sprout-cards needs choreographed timing; the rest of the companion would benefit from consistency.

**Proposed paths:**

```
semantic.motion.duration.instant = 100ms   (micro-interactions, pill toggles)
semantic.motion.duration.fast    = 180ms   (small state changes, hover lift)
semantic.motion.duration.base    = 260ms   (default; Seed→Sprout expansion)
semantic.motion.duration.slow    = 400ms   (drawer / panel reveals)
semantic.motion.duration.crawl   = 600ms   (rare; full-screen transitions)

semantic.motion.easing.standard    = cubic-bezier(0.2, 0, 0, 1)        (UI default)
semantic.motion.easing.emphasized  = cubic-bezier(0.16, 1, 0.3, 1)     (spring-ish for container morphs)
semantic.motion.easing.decelerate  = cubic-bezier(0, 0, 0.2, 1)        (entering UI)
semantic.motion.easing.accelerate  = cubic-bezier(0.3, 0, 1, 1)        (exiting UI)
```

A `prefers-reduced-motion` companion token isn't needed (consumers handle it via media query), but durations should be zero-able by class.

**Used by today:** none (companion uses literals).
**Will be used by:** SproutCard transitions, fade animations in cc-screen, cc-blink and cc-stream-caret (could be re-keyed), tooltip enter/exit, slash-menu open.

---

## F · Pill geometry (chips, tags, status badges)

**Tier:** component, but generic enough that *many components* are the consumer — not the Sprout card alone.

**Need:** pill-shaped containers exist in at least four places today (status pills, follow-up question chips, trend chips, suggestion chips) and want consistent geometry.

**Proposed paths:**

```
component.pill.padding-block         = 3px
component.pill.padding-inline        = 10px
component.pill.padding-block.dense   = 2px
component.pill.padding-inline.dense  = 8px
component.pill.dot-size              = 6px
component.pill.gap                   = 6px
```

This is the **most "componenty"** thing on this list — keep it at the component tier and don't promote unless we discover a tier-3 home that fits. The point is to share it across status pill, trend chip, suggestion chip, etc.

**Used by today:** status pill, trend chip, edit chip, refbar marker (dot only).
**Will be used by:** any future tag, count badge, recent-search chip.

---

## G · Reclassified / withdrawn from the previous draft

The earlier draft of this file had several items framed as `component.card.*`. After re-reading the user's pushback ("ensure we're not creating very specific component stuff"), they reclassify:

| Previous item | Reclassified as | Or |
|---|---|---|
| `component.card.stage-rule.height` | covered by **D** (`semantic.dimension.rule.regular`) | — |
| `component.card.tone-tint.ratio` | covered by **B** (`semantic.color.tone-mix.tint.ratio`) | — |
| `component.status-pill.*` | folded into **F** (`component.pill.*`) | — |
| `component.stepper.button.size` | covered by **C** (`semantic.dimension.touch-target.regular`) | — |
| `typography.heading.lg.font-size` | ✓ already exists; cleanup of stylesheet fallbacks (not a token gap) |
| `component.card.stale.{background, text}` | withdrawn — direct `surface.page` / `text.faint` refs are correct |
| `component.edit-chip.{background, text}` | withdrawn — re-uses `status.info.*`; will revisit if a `semantic.color.action.subtle.*` token emerges from a separate need |
| `component.card.dragging.*` | withdrawn — premature; revisit when drag mechanism ships |

---

## Order of work for the skill

1. **A** — Property tone ramp + trend directions. Highest impact, broadest reuse, blocks Sprout-cards' identity correctness.
2. **B** + **D** — Tone-mix ratios and rule thicknesses. Small, semantic, immediately useful.
3. **E** — Motion tokens. Blocking the SproutCard wrapper / Seed↔Sprout↔Shoot animation work.
4. **C** — Touch-target dimensions. Tidy-up; not blocking.
5. **F** — Pill geometry. Cross-component consistency; not blocking.

After 1–3 land, the SproutCard wrapper and the `customColor` / `SproutToneProvider` work can proceed against real tokens (Section A) rather than escape-hatching around missing ones.
