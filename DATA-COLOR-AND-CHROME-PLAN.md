# Data-color scale + card/banner chrome refinements — implementation spec

**Status:** Plan, ready to hand to Sonnet.
**Author:** design pass (Opus), against `main` after the Base Card mechanic landed (see
[BASE-CARD-PLAN.md](BASE-CARD-PLAN.md) — Card/Banner now share `resolveCardChrome` in
[src/lib/cardChrome.js](src/lib/cardChrome.js)).
**Skills:** `kernel-tokens` (§3 is real DTCG token work — CHANGELOG/TOKENS.md/$themes.json are
mandatory), `kernel-components` (§1/§4/§5).

---

## 0. TL;DR — five asks, one plan

1. **`surface="plain"` must be pure white**, not the cool brand panel-tint. Fix + add `panel` as an
   explicit surface value so nothing is lost.
2. **Confirm it maps to Banner too** — it does, for free (both route through `resolveCardChrome`).
3. **A saturated "data fill" color scale** — a `fill` / `fill-strong` / `fill-soft` triad per role,
   covering categorical 1–6 + status ×4 + brand primary/secondary, tuned for **fills/strokes on
   non-text surfaces only** (charts, progress bars, meters), with light/dark parity.
4. **Align accent strip and border to the same saturated color** (~500), retroactively on Card + Banner.
5. **An elevation↔state ladder**: distinct resting elevation for `elevated` false vs true, plus
   hover (up), active/press (down), dragged (highest).

**Dependency order for Sonnet:** §1, §2, §5 are independent — land first. **§3 (tokens) must land
before §4**, because §4 and the `toneFill` repoint depend on the new rungs + the brand step-800
addition. §3 is the big one.

---

## 1. `surface="plain"` → pure white (+ new `panel` value)

**Problem (confirmed):** Card's `plain` resolves to `--surface-panel` = `#f5f8fa` (a deliberate cool
brand surface-tint), so a "plain" card is faintly tinted, not white. Banner's `plain` already resolves
to `--surface-bright` = `#fff`. They are not aligned today.

**Fix** — in [cardChrome.js](src/lib/cardChrome.js) `resolveCardChrome`, Card passes
`neutralFill: 'panel'`; change Card's call site in [Card.jsx](src/components/Card.jsx) to
`neutralFill: 'bright'`. Then **add `panel` as a fifth `surface` value** for the rare case a consumer
genuinely wants the tinted section look:

- `surface` enum becomes: `plain` (→ `--surface-bright`, white — the new default meaning) · `panel`
  (→ `--surface-panel`, the brand section tint) · `tinted` · `raised` · `none`.
- Update the resolver's surface branch, the Card prop `values` + `description`, and the Card story
  `argTypes`.

**Two things to state, not discover later:**
- **Blast radius:** every bare `.krnl-card` div and every default `<Card>` shifts panel-tint → white.
  **PatientCard is unaffected** (it goes through `appearance="elevated"` → `legacyElevated` →
  `--surface-raised`, not `plain`). **Verify greenhouse's card-heavy panels visually** — this is a
  broad, intentional change.
- **Dark-mode identity:** `--surface-bright` in dark = `brand.fill.800`, the *same* value as
  `--surface-raised` — so in dark, `plain` and `raised` look identical. This is pre-existing (Banner
  already has it) and defensible per the token's own `$description` ("bright is a light-mode concept, so
  it tracks raised here"). **Do not invent a new dark token** — just note it.

---

## 2. Is it mapped to Banner? — yes, by construction

Banner's `resolveBannerChrome` is a thin wrapper over `resolveCardChrome` (Banner passes
`neutralFill: 'bright'` already). So:
- **§1** — Banner was already white; Card now matches it. Nothing to do on Banner.
- **§4** (accent = border) lands on Banner automatically because it flows through the shared resolver.

This is the Base Card mechanic paying off: chrome rules change in one place. Call it out in the PR so
the shared-resolver design is visible.

---

## 3. Data-fill color scale (the token-tier work)

### 3.1 Decision: extend `semantic.data.*`, do NOT add a fourth namespace

Kernel already has three data-color families; adding a fourth (the user's illustrative
`color.data.accent` / `color.data.categorical`) would repeat the proliferation flagged earlier. Instead:

- **`semantic.data.series-N`** is a **flat single value** today (charts consume it). This is the family
  to grow into the triad — it is already the chart-facing one and has no rung structure to conflict.
- **`semantic.data-tone.N`** (tint/tint-strong/accent/solid/on) is the **Card/Banner surface** family —
  a different question. **Leave it untouched.**
- **`semantic.status.*`** — leave its existing shape; the new status *fill* rungs live under `data.*`
  (see below), so text/border semantics (`solid`/`border`) stay where they are.

### 3.2 The triad — name rungs by role-relative-to-background, not by lightness

**Reject the user's `default/muted/subtle` labels.** Their prose (default = 500) contradicts their JSON
(default = 700), and `subtle` would mean 200 in light but 800 in dark — a label that names a *lightness*
for a role that *flips*. A label that's false in one theme is the seed of the next cascade bug. Name by
**contrast-against-current-background** so light and dark can pick opposite ramp ends honestly (matches
Kernel's existing hyphenated `tint-strong`):

| rung | light | dark | purpose |
|---|---|---|---|
| `fill` | 500 | 500 | series/bar baseline — the default weight |
| `fill-strong` | 700 | 300 | lines, outlines, **hover** — the high-contrast-vs-bg rung |
| `fill-soft` | 200 | 800 | area backing, tracks — the low-contrast-vs-bg rung |

`fill` = 500 in both modes is the one value to **run through the ramp builder's WCAG audit** rather than
assume (it's the anchor both directions pivot on).

### 3.3 Roles to cover (12)

Under `semantic.data.*`, each with the 3-rung triad above:

- **categorical** `1`–`6` (Kernel has six data hues; keep all six — the user's example showed five).
- **status** `info` / `success` / `warning` / `error` (alias the `brand.status.*` ramps).
- **brand** `primary` / `secondary` (alias the `brand.data-tone`… no — see note).

> **Brand primary/secondary note:** `brand.primary` is a single value (`{color.teal.600}`), not a ramp.
> For a `fill`/`fill-strong`/`fill-soft` triad you need ramp steps. Alias the **primitive palette ramp
> the brand primary/secondary is built from** is wrong (hard-codes teal per brand). Instead: the brand
> tier already exposes ramp families for the tones it themes. Add a small `brand.primary.{200,300,500,
> 700,800}` (and `secondary.*`) ramp to each brand file aliasing that brand's own palette hue — the same
> pattern `brand.data-tone.N` already uses. This keeps multi-brand re-skin intact. If that's too broad
> for this pass, **ship categorical + status now and defer brand primary/secondary** to a follow-up
> (they're the two the user is least likely to chart first).

### 3.4 Brand ramps need step 800

`brand.data-tone.*` and `brand.status.*` ramps currently carry `100/200/300/400/500/700/900` — **step
800 is missing**, and `fill-soft` (dark) needs it. The underlying **primitive palettes have the full
50–950**, so this is pure mechanical aliasing: add `"800": { "$value": "{color.<hue>.800}" }` to each
`data-tone.N` and `status.<role>` ramp in **all three brand files** (`corilus`, `semble`, `myneva`).
**Do not substitute 900 for 800** — the homogeneous-step principle is exactly why 800 exists in the
primitives.

### 3.5 The a11y contract — structural, not a comment

These rungs are for **fills and strokes on non-text surfaces only** — the whole point is saturation
without contrast risk. Put this in the **`$description` of the `data` group itself**, and state
explicitly that **`fill-strong` is NOT a text color** (text stays `solid`/700 via `status.*` /
`data-tone.*`). Without that line someone will use `fill` for a label and reintroduce a contrast bug.

### 3.6 Consumer: repoint `toneFill()`

[src/lib/tone.js](src/lib/tone.js) `toneFill()` returns `.accent` (500) today; its own header already
says it's meant to be the canonical "one vivid fill colour" resolver. Repoint it to the new `data.*.fill`
rung (and expose `fill-strong` for hover where a consumer wants it). This is how **Progress / Meter /
DonutGauge** get the new scale. Confirm the "dull" complaint is resolved (progress bars were on
`--action-solid`; a toned bar was on `.accent`/500 — verify the new `fill` reads more saturated as
intended, adjusting the rung if the audit allows).

**Component-family cascade (name in the PR):** repointing `toneFill` touches **Progress, Meter,
DonutGauge**, and any future chart consumer at once. Screenshot each before/after.

### 3.7 Mandatory token-pipeline steps (kernel-tokens skill)

1. Edit `tokens/semantic/light.tokens.json` + `tokens/semantic/dark.tokens.json` (the triad; dark
   already overrides `data`/`status`/`data-tone`, so add the flipped rungs there).
2. Edit the three `tokens/brand/*.tokens.json` (step 800; brand primary/secondary ramps if in scope).
3. `python3 <skill>/scripts/validate_tokens.py tokens/` — **whole directory**, not single files (or you
   get a wall of spurious cross-file alias warnings). Fix all errors.
4. Rebuild CSS: `python3 tokens/to_css.py` (or the repo's token build) → regenerates `tokens/tokens.css`.
5. `CHANGELOG.md` entry (path, before→after, affected families, rationale) via `update_changelog.py`.
6. Regenerate `TOKENS.md` (`generate_docs.py tokens/`) and `$themes.json` (`generate_themes_json.py …
   --token-set-root tokens/`).
7. Rebuild greenhouse's token bundle if this session ships downstream (per skill's "Shipping a change").

---

## 4. Accent strip = border, at the saturated 500 (depends on §3)

**Today** (in `resolveCardChrome`, box-scoped tone): strip = `--card-accent` (500); border =
`--{slug}-border` (300, deliberately soft) for a status tone, or the solid (700) otherwise. So strip and
border differ.

**Change** — when `paintsBox` (a box-scoped resolvable tone), set `--card-border-color` to the **same
value as `--card-strip-color`** (the 500 accent). One line in [cardChrome.js](src/lib/cardChrome.js).
Applies to Card **and** Banner via the shared resolver.

- **Consequence to flag honestly:** every toned Banner currently has a soft 300 border and will become
  noticeably more prominent (500). This is the requested look, but it's a visible shift across every
  toned Banner in the app → **acceptance is a screenshot check, not just a computed-value check.**
- Keep the deprecated `accent="strip-border"` softened-border alias working as-is (it's a separate,
  explicitly-soft look; document that it now differs from the default bordered+accent, which is 500).
- Leave `toneScope="content"` unchanged (neutral box → `--border-subtle`).

---

## 5. Elevation ↔ state ladder

Elevation tokens already form a 4-level scale (light + dark parity), so **no new elevation tokens** are
needed:

`raised` (tight contact) < `floating` (soft ambient) < `overlay` < `modal`.

### 5.1 The ladder

| state | elevation | new? |
|---|---|---|
| resting, `elevated={false}` | `none` (flat) | unchanged |
| resting, `elevated={true}` | `floating` | unchanged (resolver sets this) |
| hover | `overlay` (one step up) | **new** |
| active / pressed | `raised` (one step down from floating) | **new** |
| dragging | `modal` (highest) | exists (`[data-dragging]`) |

### 5.2 Two rules that keep the B-54 fix intact

- **The resolver sets the *resting* value only** (`--card-elevation` = none or floating). **Hover/active
  are CSS state rules** that override the final `--card-elevation`. A *single* state rule overriding is
  fine; do **not** move hover/active into the resolver, and do not add a second competing base rule —
  that's exactly what B-54 was.
- **Hover/active elevation applies only to cards that respond to input** — `.krnl-card--interactive`,
  `.krnl-card--collapsible`, and draggable cards. A **static card must not lift on hover.** Scope the
  new `:hover` / `:active` rules to those selectors.

### 5.3 Open question, pre-decided

*Pressed* on a non-elevated (flat) card: `raised` is a lift, not a press. **Leave flat cards flat on
press** (simplest) — "pressed lowers" only reads on already-elevated cards. Do **not** invent an inset
shadow token.

Existing `.krnl-card--collapsible:hover → overlay` and `:has([data-panel-open]) → overlay` already fit
this ladder; reconcile them so there's one coherent set of state rules, not two.

---

## 6. Acceptance criteria

- [ ] `<Card surface="plain">` renders pure white (`#fff`) in light; `surface="panel"` renders the brand
      tint; both documented in the Card story.
- [ ] A toned Banner and a toned Card show the **same 500 color** on strip and border (screenshot).
- [ ] `semantic.data.*` exposes `fill` / `fill-strong` / `fill-soft` for categorical 1–6 + status ×4
      (+ brand primary/secondary if in scope), with correct light (500/700/200) and dark (500/300/800)
      steps; `validate_tokens.py tokens/` is clean; the `data` group `$description` states the
      non-text-surface-only contract.
- [ ] `brand.{data-tone,status}.*` ramps include step 800 in all three brand files.
- [ ] Progress / Meter / DonutGauge render more saturated via the repointed `toneFill` (before/after
      screenshots); no contrast regression on any text.
- [ ] Elevation ladder: an interactive/elevated card lifts on hover (`overlay`), presses down on active
      (`raised`), and a dragged card is highest (`modal`); a static flat card does none of these.
- [ ] `npm run gate`, `npm run test`, `run-story-tests` green; CHANGELOG.md + TOKENS.md + $themes.json
      regenerated for §3.

---

## 7. Scope fences

- **Do NOT build the chart components** this scale enables — the tokens + `toneFill` repoint are the
  deliverable, not a Chart atom.
- **Do NOT touch PatientCard's container-query bug** — already filed as `task_2d6d2001`.
- Brand primary/secondary data rungs (§3.3) may be **deferred** to a follow-up if the brand-ramp
  addition proves broad; ship categorical + status first.
- Backlog: Atlassian MCP is unauthenticated this session — list these as AD issues (labels `kernel` +
  `tokens` for §3, `components` for §1/§4/§5) in the final summary; **do not create a BACKLOG.md**.
