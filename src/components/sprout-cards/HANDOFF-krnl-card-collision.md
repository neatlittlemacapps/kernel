# ⚠️ Handoff: `.krnl-card` class collision breaks the companion UI

**From:** the Evidence Based Search / companion-layout thread (found while verifying an unrelated
embedded-scroll fix on 2026-06-18).
**Severity:** high — visibly breaks the live companion, not just the sprout-cards demo.
**Status:** NOT fixed here (left for the sprout-cards thread — it's your domain).

## What's wrong

The sprout-cards styles were appended to **`src/styles.css`** and **redefine `.krnl-card`**,
a class the companion has used for ages (Feature-flags rows, home action cards, clinical
cards, etc.).

- Original companion rule: `src/styles.css:445` → `.krnl-card { border; padding; background; margin-bottom; }` (no flex).
- Sprout rule: `src/styles.css:645` → `.krnl-card { display:flex; flex-direction:column; gap; box-shadow; container-type:inline-size; … }`.

Equal specificity, and the sprout rule comes **later**, so it wins. Consequences across
the whole companion:

1. **Every `.krnl-card.krnl-row-between` row** (label-left / switch-right toggles) now
   computes `flex-direction: column; align-items: center` — because `.krnl-row-between`
   (`styles.css:446`) only sets `justify-content`/`align-items` and relied on the *default*
   `flex-direction: row`. The sprout `.krnl-card` overrides that to `column`, so the label
   and the Toggle **stack and center**. Most visible on **Feature flags → Prompt composer**
   (Agent indicator / Multi-action / Suggestion chips toggles), but it hits the dark-mode
   toggle, patient-context toggle, agent rows, etc. too.
2. **Every plain `.krnl-card`** now also inherits sprout's `box-shadow`, `gap`,
   `container-type`, and a different `padding` — so cards across the companion look off.

Confirmed live: the composer toggle row computes `display:flex; flex-direction:column; align-items:center`.

## The fix — namespace the sprout-cards vocabulary

Rename the sprout-cards classes so they stop clobbering the companion's. Suggested prefix
`.krnl-pcard` (patient-property card), but pick whatever you like as long as it's unique:

- In **`src/styles.css`** (the sprout block, ~line 645 to the end of that section):
  `.krnl-card` → `.krnl-pcard`, `.krnl-card[data-stage=…]` → `.krnl-pcard[data-stage=…]`,
  `.krnl-card-head` / `.krnl-card-title` / `.krnl-card-value` / `.krnl-card-media` /
  `.krnl-card-footer` / `.krnl-tone--*` / any `@container` rules scoped to `.krnl-card`, etc.
- In the **11 sprout-cards `.jsx` files** (`Card.jsx`, `lib.jsx`, `VitalSignCard.jsx`,
  `LabResultCard.jsx`, `DemographicCard.jsx`, `ConditionCard.jsx`, `AllergyCard.jsx`,
  `MedicationCard.jsx`, `PropertyList.jsx`): update every `className="krnl-card…"` /
  `krnl-card-*` reference to the new prefix.

Don't touch the companion's own `.krnl-card` (`styles.css:445`) or any `krnl-card` /
`krnl-row-between` usage in `src/companion/**` — those are the existing companion and must
keep the default row layout.

## Verify after the rename

1. `node build/esbuild.mjs` (or `npm run all`).
2. Forge harness (`node build/serve.mjs` → `/test/index.html`): open the companion →
   **More ▸ Feature flags ▸ Prompt composer**. The three toggles must be **label-left /
   switch-right rows** again (computed `flex-direction: row`), and the other FF cards
   should look normal.
3. Re-check the sprout-cards demo (`demo/sprout-cards.html`) still renders correctly under
   the new class names.

## Context you may not have

- A commit is **on hold** ("wait") on the whole tree — both your sprout-cards work and an
  embedded-scroll fix (`.krnl-panel--embedded` → `inset:0`) are uncommitted. When you commit,
  coordinate scope so the two changesets stay legible.
- This note can be deleted once the rename lands.
