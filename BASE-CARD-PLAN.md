# Base Card mechanic — implementation spec

**Status:** Plan, ready to hand to Sonnet for implementation in Kernel.
**Author:** design pass (Opus), against `main` @ `91ad15f`.
**Skills in play:** `kernel-components` (this doc), `kernel-tokens` (only if a token turns out missing — none is expected).

---

## 0. TL;DR

`Card` **is** the base card. The deliverable is not a new component — it is a **shared visual-chrome
contract** (a normalized set of CSS custom properties) plus **one JS resolver** that both `Card` and
`Banner` set, and that a single `.krnl-card` CSS layer reads. On top of that, `Card`'s internal slot
layout is rebuilt on **CSS Grid (named areas) + container queries**, and `Card` adopts **Banner's
independent-boolean chrome vocabulary** (`surface` / `bordered` / `elevated` / `accent` / `toneScope`
/ `dense`). `Banner` and `Collapsible` become consumers of the same chrome contract, so changing the
base changes all three. One directed change to Banner: its drop shadow becomes the card's floating
shadow. Ship a Storybook "Base Card" doc.

Three components, one mechanic:

```
            ┌───────────────────────────────────────────────┐
            │  Chrome contract  (--card-* custom properties) │  ← set by resolveCardChrome() in JS
            │  surface · border · accent strip · elevation · │  ← read ONLY by .krnl-card CSS
            │  tone triad · radius · density                 │     (nothing competes on specificity)
            └───────────────────────────────────────────────┘
                 ▲                    ▲                    ▲
                 │                    │                    │
         ┌───────┴──────┐    ┌────────┴───────┐   ┌────────┴────────┐
         │  Card        │    │  Banner        │   │  Collapsible    │
         │  (the base;  │    │  (constrains:  │   │  (inherits the  │
         │   full slot  │    │   1 row, tone, │   │   chrome +      │
         │   grid)      │    │   dismiss,     │   │   header-row    │
         │              │    │   live region) │   │   shape only)   │
         └──────────────┘    └────────────────┘   └─────────────────┘
```

---

## 1. Why this shape (and the alternative rejected)

**Recommendation: keep `Card` as the canonical base card; do NOT introduce a `BaseCard`/`Surface`
component.**

- Card's own docstring already claims the role: *"the neutral base card … so specialised cards just
  compose it and fill the slots."*
- STANDARD.md §1: **"One canonical component per role."** A second card-shaped component collides
  with Card's self-description for zero functional gain.
- The slot system is **already shared** — `Banner` composes `Card.Header` / `Card.Body` today. The
  only thing genuinely *not* shared is chrome. That is the whole deliverable.

**Rejected alternative — a distinct `Surface`/`BaseCard` primitive that Card and Banner both compose.**
It reads well against the literal phrasing "base to build out both the banner and the true card," but
it fragments "one component per role," doubles the public surface, and forces every existing
`<Card>`/`.krnl-card` consumer (PatientCard, clinical cards, Layout, greenhouse) through a rename or a
second wrapper. The shared-contract approach delivers the same "change the base → both adapt" outcome
with no new public component and a tiny blast radius.

The **"Base Card" Storybook page** documents Card-as-base + the chrome contract + the slot grid. That
satisfies "I want a storybook documentation of this base card" without a new component.

---

## 2. The load-bearing mechanism (read before touching CSS)

Banner works today because its CSS reads **only** resolved custom properties (`--banner-*`), which are
set once in JS by `resolveBannerChrome`. Nothing competes on specificity. Card, by contrast, paints
chrome through `[data-tone]` / `[data-accent]` **attribute rules**, which was the source of the B-47
collisions.

**In-repo proof this must change** (`src/styles.css:1054–1059`): a KNOWN BUG is documented where
`.krnl-card[data-accent]` (specificity 0,2,0) beats `.krnl-card--elevated` (0,1,0), so a card with
**both** `accent` and `appearance="elevated"` silently loses its elevation — *"not a cascade a reorder
can fix; would need the same resolved-custom-props treatment Banner got."*

**So: move Card's chrome resolution into JS too.** After this refactor, all of
`--card-surface` / `--card-border-color` / `--card-strip*` / `--card-elevation` / the tone triad are
set **inline by the resolver**, and the `.krnl-card` CSS only *reads* them. Interaction **state**
(`:hover` / `:focus-visible` / `[data-selected]` / `[data-dragging]` / `[data-disabled]`) stays in CSS
— those legitimately override the *final* property (e.g. `border-color`, `--card-elevation`) and do
not collide with the base chrome custom-props.

→ **Acceptance criterion (binary):** a `<Card accent elevated tone="info">` renders **both** the accent
strip and the drop shadow. This is the headline reason the refactor exists.

---

## 3. The chrome contract (custom properties)

All set by `resolveCardChrome()` (§4), read by `.krnl-card` (§7). Keep the public tone-triad names —
`Card.stories.jsx` and PatientCard's `.krnl-tone--*` consume them.

| Property | Default (resolver output when unset) | Meaning |
|---|---|---|
| `--card-surface` | `var(--surface-panel)` | Background fill. |
| `--card-border-color` | `var(--border-subtle)` | Hairline border colour. Width stays the literal `var(--dimension-rule-hair)` in the `border` shorthand — **no `--card-border-width` var** (nothing varies it; Banner has none either). |
| `--card-strip-color` | `var(--border-subtle)` | Accent-strip colour. |
| `--card-strip-w` | `3px` (Card top) / `4px` (Banner left) | Strip thickness. |
| `--card-strip-edge` | top: `inset 0 var(--card-strip-w) 0 0 var(--card-strip-color)` | Strip geometry per edge; Banner overrides to left `inset var(--card-strip-w) 0 0 0 …`. |
| `--card-strip` | `0 0 #0000` (off) → `var(--card-strip-edge)` (on) | The gate the box-shadow reads. |
| `--card-elevation` | `0 0 #0000` (off) → an `--elevation-*` token (on) | The drop shadow. |
| `--card-tone-tint` | tone `.100` / neutral fallback | Tinted body fill (also read by slot content). |
| `--card-tone-tint-strong` | tone `.200` | Icon-tile fill. |
| `--card-tone-text` | tone `.700` (AA) | Tone text / glyph colour. |
| `--card-accent` | tone `.500` (vivid) | Strip / accent colour source. |

Composition (unchanged from today, this is already correct):

```css
.krnl-card { box-shadow: var(--card-strip), var(--card-elevation); }
```

> The strip is an **inset** shadow → the browser auto-clips it to `border-radius`. Do not reintroduce
> overflow/inner-radius hacks.

**Token budget — this is not token proliferation.** These `--card-*` names are **component-scoped
runtime custom properties** (the resolver's output channel), **not** DTCG design tokens —
`tokens/tokens.css` gains **zero** entries. Of the ~12 above, **8 already exist** in `styles.css` today;
the 3 genuinely-new *chrome* props (`--card-surface`, `--card-border-color`, `--card-strip-color`)
merely replace Card's buggy `[data-tone]`/`[data-accent]` attribute setters and are **exact mirrors of
Banner's existing** `--banner-surface` / `--banner-border-color` / `--banner-strip-color`. Because the
refactor **unifies Banner onto `--card-*` and retires the `--banner-*` namespace**, the total
custom-prop count **goes down** (two parallel namespaces → one): today `--card-*` (~12) + `--banner-*`
(7) ≈ 19; after ≈ 12. Do not invent card-specific vars for single-consumer values (border width,
inner radius, line-clamp) — inline them or use an existing utility/semantic token.

> **Token-layer validation — `kernel-tokens` skill v6.1.0 (read-only audit; zero token changes).**
> The DTCG semantic layer fully backs this refactor. **Both checks PASS**, and the token authors
> anticipated exactly this family:
>
> - **Elevation.** `semantic/light|dark.tokens.json → elevation.*` defines `raised` = *"a tight contact
>   shadow for grounded cards"* and `floating` = *"a soft, wide ambient lift for cards that visibly float
>   above the page (**collapsible / accent cards**)"*. The shared `elevated` boolean therefore correctly
>   maps to **`--elevation-floating`** — it is the token authored for this exact family. Legacy
>   `appearance="elevated"` (PatientCard, "grounded" look) correctly keeps **`--elevation-raised`**. The
>   two intents map onto two distinct tokens — coherent, no change. Light↔dark parity present (dark uses
>   heavier ink: black-30/24 vs black-10/06). Elevation is theme-axis only — absent from the responsive
>   tier by design, so density parity is N/A.
> - **Surface.** `semantic/…surface.*` provides `page/panel/raised/bright/sunken/none`, all with full
>   light↔dark parity, theme-axis only (no density override — correct). Enum mapping is fully backed:
>   `plain`→`--surface-panel` (Card) / `--surface-bright` (Banner); `raised`→`--surface-raised`;
>   `none`→`--surface-none`; `tinted` is a **derived** wash (`color-mix(in oklch, var(--tone),
>   var(--surface-raised))` via `--colour-tone-mix-tint-ratio`), not a surface token — so no token is
>   needed for it. **This validates the resolver's `neutralFill` split** (§4): `bright` is authored as
>   *"PURE WHITE … for accent/floating cards that read crisp against the page"* (i.e. a Banner) and
>   flips to raised-dark in dark automatically; `panel` is *"a section/card"* (an embedded Card). The
>   split is grounded in the token semantics, not arbitrary.
> - **Note (optional).** `surface="bright"` and `"sunken"` exist at the token layer but aren't in Card's
>   public `surface` enum. Leave them out unless a future accent card needs crisp white — reachable
>   already via Banner's `neutralFill`.
>
> No `CHANGELOG.md` / `TOKENS.md` update is due — those are for token *edits*; this audit changed nothing.

---

## 4. The single resolver

New module: **`src/lib/cardChrome.js`**, exporting `resolveCardChrome`. `Card` calls it directly;
`Banner`'s existing `resolveBannerChrome` becomes a thin wrapper over it (edge = left, `plain`→bright).

```
resolveCardChrome({
  surface,      // 'plain' | 'tinted' | 'raised' | 'none'   (see §5)
  tone,         // Card's WIDE union (§5) — status | data-1..6 | any colour/var | undefined
  toneScope,    // 'box' | 'content'
  accent,       // bool
  bordered,     // bool
  elevated,     // bool
  edge,         // 'top' (Card default) | 'left' (Banner)
  neutralFill,  // which token 'plain' resolves to: 'panel' (Card) | 'bright' (Banner)
}) -> { style: {…custom props…}, data: {…data-* for state hooks…} }
```

Rules the resolver encodes (this is the ONE place the chrome decision table lives, mirroring today's
`resolveBannerChrome`):

- **Tone family resolution** reuses the existing logic in `Card.jsx` (`toneSlug` / `toneVar` /
  `tintVars`) — status tones → `--status-{tone}-*`, data tones → `--data-tone-{n}-*`, arbitrary
  colour → `color-mix` fallback, `neutral`/absent → no tone. **Do not narrow this union to Banner's
  five** — PatientCard and clinical cards depend on `data-*` and arbitrary tones.
- **`toneScope`**: `box` lets tone paint `--card-surface` (when `surface==='tinted'`), `--card-border-color`,
  `--card-strip-color`. `content` keeps the box neutral (`--border-subtle`) while the tone triad stays
  exposed for slot content (icon tiles) regardless. For a card with **no icon slot**, `content` simply
  means "neutral box, tone available to children" — which is exactly how `Card.stories.jsx` already
  reads `--card-tone-*`.
- **`accent`** gates `--card-strip` on/off (needs a resolvable tone to colour it; falls back to
  `--border-subtle`).
- **`bordered`** gates `--card-border-color` (off → `transparent`).
- **`elevated`** gates `--card-elevation` → **`var(--elevation-floating)`** (see §6).
- **All three booleans are independent** — resolve `--card-elevation` from `elevated` alone, once, so
  the accent/elevated bug (§2) cannot recur.

Interaction **state** is NOT the resolver's job — `selected` / `dragging` / `disabled` stay as
`data-*` attributes on the element, handled by CSS.

---

## 5. Card's new prop table

Card adopts Banner's chrome vocabulary. New/changed props:

| Prop | Class | Values | Default | Notes |
|---|---|---|---|---|
| `surface` | dsPresentation | `plain` \| `tinted` \| `raised` \| `none` | `plain` | Fill. **Superset of Banner's `plain\|tinted`.** `plain`→`--surface-panel` (Card) ; `tinted`→tone/neutral wash ; `raised`→`--surface-raised` ; `none`→transparent. |
| `bordered` | dsPresentation | bool | `true` | Hairline border. |
| `elevated` | dsPresentation | bool | `false` | Floating drop shadow (`--elevation-floating`). |
| `accent` | dsPresentation | bool | `false` | Tone-coloured edge strip (top on Card). **Replaces the `strip`/`strip-border` enum** (see aliases). |
| `toneScope` | dsPresentation | `box` \| `content` | `box` | As Banner. |
| `dense` | dsPresentation | bool | `false` | Local `data-density="compact"` scope (as Banner). |
| `tone` | dsPresentation | status \| `data-1..6` \| colour/var | — | **Unchanged wide union.** |

| `loading` | dsPresentation | bool | `false` | **New (see §7c).** Renders a skeleton that mirrors the card's own slot layout (best-practice #4). Sets `aria-busy`; suppresses `interactive`/`detail` affordances while true. |

Retained unchanged: `orientation` (`vertical`/`horizontal`), `size` (`sm`/`md`/`lg`), `interactive`,
`selected`, `dragging`, `disabled`, `as`, `detail` + collapse triad (`expanded` / `defaultExpanded` /
`onExpandedChange`), `floatingAction`, `onClick`, `children`, slots `Card.Preview/Header/Body/Footer`.

### 5a. Deprecated-alias table (`appearance` → new props)

`appearance` was an enum bundling {fill, border, elevation-treatment}. Keep it working (deprecated,
like Banner's own `variant`/`appearance` aliases) — `PatientCard` and `Card.stories.jsx` still pass it.
Map **at the top of the Card function**, before resolving chrome:

| `appearance` (old) | maps to (new props) | Notes |
|---|---|---|
| `filled` (was default) | `surface="plain" bordered={true}` | The old base look. |
| `outline` | `surface="none" bordered={true}` | Border only. |
| `subtle` | `surface="none" bordered={false}` | No border/fill. |
| `elevated` | `surface="raised" bordered={false}` + **ring+raised** treatment | **Special:** reproduce the exact current look — border:none, `--surface-raised`, hairline ring + `--elevation-raised`, hover-lift. PatientCard depends on this precise appearance. Keep a `krnl-card--elevated` class (or resolver branch) that emits `--card-elevation: 0 0 0 var(--dimension-rule-hair) var(--border-subtle), var(--elevation-raised)`. Do **not** collapse this into the new `elevated` boolean (which is floating-only, ringless). |
| `accent="strip"` | `accent={true}` | Old enum truthy → boolean. |
| `accent="strip-border"` | `accent={true} bordered={true}` (tone-softened border) | Preserve the `color-mix(...45%…)` softened border currently at `styles.css:1040`. |

Emit these aliases with a one-line `@deprecated` note in the meta prop descriptions (gate requires
descriptions on stable components — §9).

> **Default-change caution.** Card's old default was `appearance="filled"` (bordered + panel). The new
> defaults (`surface="plain"`, `bordered=true`, `accent=false`, `elevated=false`) must render the
> **same** filled look, so bare `<Card>` and bare `.krnl-card` divs are visually unchanged. Verify.

---

## 6. The Banner change (directed)

One change only, plus the mechanism unification:

1. **Drop shadow → the card's floating shadow.** Banner's `elevated` currently emits
   `var(--elevation-raised)` (tight contact). Change to **`var(--elevation-floating)`** (soft ambient —
   the same shadow Card's accent/collapsible cards use, and the shadow the new Card `elevated` boolean
   uses). This is what "replace the dropshadow with the one from the card" means, and it makes Card and
   Banner read as one family. **Token-endorsed** (§3 validation): `elevation.floating`'s own
   `$description` names *"collapsible / accent cards"* as its purpose — this is that family.
   - **Visual test that discriminates a real change from a no-op:** after the edit, an `elevated`
     Banner's shadow must look *softer / more diffuse* than before. If it looks identical you edited the
     wrong token.
   - Banner gets floating **without** the ring (the ring belongs to Card's legacy `appearance="elevated"`).
2. **Unify onto the shared contract.** Rewrite `resolveBannerChrome` as a wrapper over
   `resolveCardChrome({ …, edge:'left', neutralFill:'bright' })`. Banner keeps its own class
   `.krnl-banner-card` **only** for the left-edge strip geometry, the icon-tile, the `--flush`
   full-width treatment, and the header-action gap — everything colour/surface/border/elevation now
   flows through `--card-*`. Retire the `--banner-*` names (or alias them to `--card-*` for one release).

Banner's public API is otherwise **unchanged** (`tone`/`toneScope`/`surface`/`accent`/`bordered`/
`elevated`/`dense`/`fullWidth`/`title`/`description`/`icon`/`action`/`detail`/`onDismiss`/`live` + the
deprecated `variant`/`appearance`). Its **live-region a11y stays structural** — `role`/`aria-live`
derived from tone, never a style prop. Do not touch that.

---

## 7. Internal slot layout — CSS Grid + container queries

Research (web.dev container-query-card, ishadeed, MUI/Ant/Basis, Smashing) converges on:

- **Grid for the card skeleton; Flexbox for the header row.** Grid places the independent regions
  (2-D, DOM-order-independent, swappable per orientation); the header's leading-icon│text│action row is
  1-D and stays Flexbox (as `.krnl-card-header` already is).
- **Orientation = swap the grid template, not the DOM.**

### 7a. Grid skeleton

Make `.krnl-card` a grid in the standard (non-collapsible) form. Named areas; **absent slots omit
themselves** from the area string (no empty tracks / stray gaps):

```css
.krnl-card {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "preview" "header" "body" "footer";
  /* row sizing auto; gap from --density-gap where slots need separation */
  container-type: inline-size;   /* enables §7b — query children by the card's own width */
}
.krnl-card-preview { grid-area: preview; }
.krnl-card-header  { grid-area: header; }
.krnl-card-body    { grid-area: body; }
.krnl-card-footer  { grid-area: footer; }

.krnl-card--horizontal {
  grid-template-columns: minmax(96px, min(30%, 320px)) 1fr;
  grid-template-areas:
    "preview header"
    "preview body"
    "preview footer";
}
```

Notes for the implementer:
- The **collapsible form** (Base UI `Collapsible.Root` → trigger + panel) and the **interactive
  `<button>` form** keep their current structure; the grid template applies to the standard slot flow.
  Confirm `floatingAction` (position:absolute) is unaffected (it is).
- `Card.Preview`'s negative-margin full-bleed (`styles.css:1155`) and the **inset accent-strip** must
  still render correctly once `container-type: inline-size` is on the root — **verify visually**;
  `container-type` establishes containment and can perturb bleed/overflow. If it does, scope
  `container-type` to a form that doesn't use edge-bleed, or move the bleed onto the grid cell.
- **Concentric radius** (best-practice reader note): a contained thumbnail/media inside a padded card
  should relate its radius to the card's — an edge-bleed `Card.Preview` clips to the card corners
  (`--density-radius`, already handled); a media block *inset* by the card padding gets
  `border-radius: calc(var(--density-radius) - var(--density-card-pad))` **inlined at that one site**.
  No `--card-radius-inner` var — it has a single consumer, so a variable earns nothing.
- **Robust to content length** (best-practices #5 & #7): keep the title/description rows a fixed part
  of the area string so a two-line heading in one card never pushes a sibling's subtitle out of
  alignment. Truncation is a *consumer* concern, not a base-card token: a card set that wants fixed
  height applies `-webkit-line-clamp` via its own class or a **shared `.krnl-line-clamp-N` utility**
  (grep for an existing one first) — **no `--card-title-lines` / `--card-desc-lines` vars**. The base
  just must not *prevent* clamping (don't set `overflow: visible !important` etc.). Never bake a fixed
  height into the base.
- **Internal vs external grid** (best-practice #6): this section is the card's *internal* skeleton.
  Arranging *many* cards across breakpoints (the article's 12/8/4-column point) is the job of Kernel's
  existing `Grid` / `Stack` layout components — do **not** add multi-card layout to Card. Note this in
  the Storybook doc so the two grids aren't conflated.

### 7c. Loading / skeleton state (best-practice #4)

A skeleton that mirrors the real layout reduces perceived uncertainty. `loading` renders placeholder
shapes **in the same grid areas** the real slots occupy (a block in `preview`, a short bar + two lines
in `header`, lines in `body`), so the skeleton and the loaded card share one geometry.

- Implement as a `.krnl-card[data-loading]` treatment: the resolver/JS sets `data-loading` and
  `aria-busy="true"`, and either (a) Card renders internal skeleton blocks when `loading && !children`,
  or (b) a `Card.Skeleton` helper the consumer drops in. Prefer (a) for the common case; expose the
  shapes via a shared `.krnl-skeleton` token-driven shimmer (reuse any existing skeleton util — grep
  for one before authoring; if none exists this is a small new token-driven primitive, flag it).
- `loading` suppresses `interactive`/`detail`/`onClick` (no toggling a skeleton).
- **Scope note:** if the skeleton primitive turns out to be more than a thin CSS shimmer, treat the
  skeleton itself as a *phase-2* follow-up (backlog item 5) and land the base-card + Banner unification
  first. The `loading` prop + `aria-busy` + `data-loading` hook should land now regardless, so the API
  is stable even if the visual shimmer is refined later.

### 7b. Container queries (not media queries)

A card must respond to **its own container width**, not the viewport (a card in a sidebar vs a
3-column grid sees different space at the same viewport width). `container-type: inline-size` on
`.krnl-card` lets us query children by the card's width — **querying descendants is legal; only styling
the container from its own query is not, so no wrapper div is needed.**

- **Horizontal → vertical collapse:** below a threshold (recommend `@container (max-width: 28rem)`), a
  `--horizontal` card drops to the single-column vertical template (media stacks above text). This is
  the requested "horizontal media card collapsing to vertical on narrow containers."
- Optional fluid touch: allow the header text to use `clamp()` with a `cqw` term if desired, but keep
  it token-driven; do not hardcode font sizes.
- Browser support is fine (Chrome 105+/FF 110+/Safari 16+, 2026).

---

## 8. Collapsible — family inheritance (visual only)

`Collapsible` inherits the **chrome + header-row shape**, NOT the body/footer slot grid (its body is a
single conditionally-rendered region).

- Its **framed** variant (`variant="framed"`, the default) should draw its trigger box from the shared
  contract — border `--card-border-color`/`--card-border-width`, radius `--density-radius`, surface
  `--card-surface` — so a framed Collapsible visually matches a bordered Card. Today it hardcodes
  `--surface-page` / `--border-subtle` / `--density-radius` (`styles.css:814`); repoint these at the
  `--card-*` contract (with the same values as defaults, so nothing shifts unless a consumer sets the
  contract).
- Its trigger keeps its own leading-label + chevron layout (that IS the header-row shape).
- `variant="plain"` is unchanged (no box).
- **Do not** give Collapsible tone/accent/elevation props — it inherits *look*, and only opts into the
  contract's neutral defaults. A card that *contains* a Collapsible sets the contract; the Collapsible
  reads it.

This is what makes the three a family: they read the same `--card-*` contract.

---

## 9. Meta / catalog / Standard conformance

- `Card` is `status: 'stable'` → the gate (`npm run gate`) requires `summary` + a `usage` snippet + a
  `description` on **every** Kernel-invented prop, including every new prop **and** every deprecated
  alias. Use Banner's meta as the template (it already documents independent booleans + deprecated
  aliases well).
- Keep `composes:` honest. Card composes Base UI Collapsible (for `detail`); Banner composes
  `Card`+`Collapsible`+`IconButton`; Collapsible composes Base UI Collapsible.
- Prop `class` values: `dsPresentation` for chrome, `content` for slots, `event` for handlers,
  `passThroughControl` for the Base UI collapse triad, `a11y` for `live` (Banner).
- Regenerate the catalog: `npm run catalog`, commit `catalog.json`, then `kernel doctor`.

---

## 10. Storybook

- **Taxonomy first.** `title:` is derived — never hand-write it (CLAUDE.md). `Card` already sits at
  `Core/Layout/Card` via `tools/lib/taxonomy.mjs` (`Card: 'Layout'`). No new component = no taxonomy
  change needed for Card/Banner/Collapsible. If a dedicated **"Base Card"** doc page is wanted as a
  separate sidebar entry, add it as an MDX/story under Card's own folder (a named story or a docs page),
  **not** a new taxonomy leaf, so `retitle-stories.mjs` doesn't clobber it.
- **Before authoring**, query the Storybook MCP: run `npm run storybook`, then `get-documentation Card`
  / `Banner` / `Collapsible` for the real (post-refactor) props. Do not hallucinate.
- **Card story** (`src/stories/Card.stories.jsx`, `@hand-authored`): update `argTypes` to the new prop
  set; keep `Playground` (every chrome switch as a control) + `Gallery` (the tone × chrome matrix) +
  the `CollapsibleVitals` example. Add a **chrome matrix** section rendered as labelled cells (mirror
  `Banner.stories.jsx`'s Gallery, which renders the STANDARD decision table as cells) so a reviewer can
  eyeball that the resolver tells the truth.
- **"Base Card" doc**: a docs/MDX page (or a rich autodocs block on Card) that explains: the chrome
  contract, the slot grid, the container-query reflow, and that Banner/Collapsible are the same
  mechanic. Show the `appearance`→boolean alias table.
- Update `Banner.stories.jsx` only if the shadow change needs a note; API is unchanged.
- Run `run-story-tests` (or `npm run test`) green.

---

## 11. Build / verify sequence (in order)

1. `npm run storybook` → `get-documentation` for the three components (pre-work read).
2. Implement §4 (resolver), §5 (Card props+aliases), §2/§7 (CSS: JS-set chrome, grid, container query),
   §6 (Banner), §8 (Collapsible), §9 (metas), §10 (stories).
3. `npm run catalog` → commit `catalog.json`.
4. `npm run gate` (catalog + doc bar; must be green).
5. `npm run test` (node --test, 36 tests).
6. `run-story-tests` (vitest + a11y).
7. **Visual verify in Storybook** (screenshot): the acceptance criteria below.

---

## 12. Acceptance criteria (binary where possible)

- [ ] `<Card accent elevated tone="info">` shows **both** the strip **and** the shadow (the §2 bug is
      fixed). This was previously impossible.
- [ ] Bare `<Card>` and bare `.krnl-card` divs look **identical** to pre-refactor (default filled look
      preserved via new defaults).
- [ ] `PatientCard` (via `appearance="elevated"`) looks **identical** to pre-refactor (ring + raised +
      hover-lift preserved through the alias).
- [ ] An `elevated` Banner's shadow is visibly **softer/more diffuse** than before (floating, not
      raised) — and matches an `elevated` Card's shadow.
- [ ] A `horizontal` Card collapses to vertical (media stacks) when its **container** (not the viewport)
      is narrowed below the threshold.
- [ ] A framed `Collapsible` placed inside a bordered Card reads as the same family (shared border /
      radius / surface).
- [ ] Card's `tone` still accepts `data-1..6` and arbitrary colour/`var()` (union not narrowed).
- [ ] `Card.Preview` full-bleed and the inset strip still render correctly with `container-type` on the
      root.
- [ ] A row of Cards with **different heading/description lengths** keeps their title/subtitle rows
      aligned (named-area rows fixed), and a card set can opt into truncation via a shared line-clamp
      utility (not card-specific tokens) without changing the base (best-practices #5 & #7).
- [ ] `<Card loading>` renders a skeleton in the real slot geometry and sets `aria-busy` (best-practice
      #4). (Visual shimmer refinement may be phase-2; the API + `aria-busy` must land now.)
- [ ] Inset media inside a padded card has a concentric inner radius (no mismatched nested corners).
- [ ] `npm run gate`, `npm run test`, `run-story-tests` all green.
- [ ] Deprecated `appearance` / `accent="strip"|"strip-border"` still work with a `@deprecated` note.

---

## 13. Scope fence

- **In scope:** the shared chrome contract + resolver, Card's boolean vocabulary + grid/container-query
  slots, Banner shadow change + mechanism unification, Collapsible chrome inheritance, metas, Storybook.
- **Out of scope (do NOT build):** `Callout` (reserved in COMPONENT-EXTRACTION-PLAN.md), any additional
  card *types*, a Toast, a standalone `BaseCard`/`Surface` public component.
- **Backlog:** Atlassian MCP is unauthenticated in this session — do **not** create `BACKLOG.md`. File
  these as AD (Agentic Design) issues, label `kernel` + `components`:
  1. "Base Card mechanic: shared chrome contract + JS resolver across Card/Banner/Collapsible" (this doc).
  2. "Card: adopt Banner independent-boolean chrome vocab + deprecate `appearance`."
  3. "Card: CSS-Grid slot skeleton + container-query horizontal→vertical reflow."
  4. "Banner: floating drop shadow; unify onto `--card-*` contract."
  5. "Card: `loading` skeleton state (token-driven shimmer in slot geometry)" — phase-2 if the skeleton
     primitive is non-trivial; the `loading` prop + `aria-busy` hook land in item 2.

---

## 14. The 8 UI-card best practices (uxdesign.cc, Ana & Vlad) — compliance

The source was originally 403-gated; it has since been read in full (PDF). All eight points are now
reflected:

| # | Best practice | How this plan addresses it |
|---|---|---|
| 1 | **Contrast card vs background** — Outlined (border) *or* Elevated (shadow) | This IS the base emphasis axis: `bordered` + `elevated` booleans in the chrome contract (§3–5). |
| 2 | **Balanced font sizes; limit the count** (headline 20px+, subhead 2–10px smaller, body ≥16px, button ≥ body; use a type scale) | Kernel's `--typography-*` tokens already encode a scale; `Card.Header` uses `label-lg` (title) / `caption-md` (desc). No literals. Nothing to change; noted in the doc. |
| 3 | **Spacing system, 4px base** | Kernel `--space-*` / `--density-card-pad` / `--density-gap` are the 4px-derived system. Slots consume tokens only. |
| 4 | **Loading state that mirrors the layout (skeleton)** | **NEW** — `loading` prop + `data-loading` + `aria-busy` rendering skeleton shapes in the real grid areas (§7c). Visual shimmer may be phase-2 (backlog #5). |
| 5 | **Fixed height within a set; truncate overflow** | Truncation via a shared line-clamp utility (not card-specific tokens); the base just doesn't prevent clamping (§7b). Fixed height stays a per-set layout choice. |
| 6 | **Use grids for card *layouts* (12/8/4 cols)** | Clarified as the *external* multi-card grid → Kernel's `Grid`/`Stack`, NOT Card. Card owns only its *internal* skeleton (§7b note). |
| 7 | **Design for different content lengths** (alignment must not break) | Named grid-areas keep title/subtitle rows fixed so sibling cards stay aligned (§7a, §7b); acceptance criterion + a varied-content Storybook example. |
| 8 | **Card interactions** — Default / Hover / Active / Focused (≥3:1) / Selected / Dragged | Card already ships all of these (`:hover`/`:active`/`:focus-visible` ≥3:1 focus ring / `[data-selected]` / `[data-dragging]` / `[data-disabled]`); the refactor preserves them (state stays CSS-driven, §2). |

Reader-comment addendum (Chris Ota): **concentric radius** of parent card vs contained thumbnail →
an inlined `calc()` at the inset-media site, no dedicated var (§7b).

## 15. Sources consulted (research)

uxdesign.cc "8 best practices for UI card design" (Ana & Vlad — read in full via PDF, §14);
web.dev container-query-card pattern; ishadeed.com container-query guide; MUI Card/CardHeader; Ant
Design Card (density model); Basis Message Card + Interactive Card (the clearest banner-vs-card sibling
evidence); NN/g Cards; Smashing Magazine grid-areas; DockYard component-level CSS; MD3 Cards (elevation
scale, via secondary sources — m3.material.io is JS-rendered/unfetchable).
