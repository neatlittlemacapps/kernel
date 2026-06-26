# Kernel extraction plan — pulling reusable base components out of Juglans

> Plan only. No code yet. Goal: as many reusable base components as possible live
> in Kernel; Juglans keeps only domain *molecules / organisms* that **compose**
> Kernel atoms. Sequencing chosen: **Kernel first, refactor Juglans later.**

## The principle we are correcting

Greenhouse (Juglans) currently hand-rolls UI with raw `<button>` / `<div>` plus
`krnl-*` classes whose CSS already lives in Kernel's `styles.css`. So the *styling*
is shared, but the *markup and Base UI wiring are duplicated* per file. The clinical
files even declare `composes: []` while re-implementing buttons, inputs, chips and
banners. That is the parallel-implementation drift the reuse discipline exists to stop.

36 raw `<button>` elements across the app bypass `Btn` / `IconButton`.

## Zero-visual-drift technique (the important bit)

The six status strips are **not** pixel-identical today (different padding, radius,
border style, background, layout). So a naive "merge into one Banner" *would* change
the look. The rule for every extraction below:

> The new Kernel atom keeps each existing variant as a **prop**, mapped to the exact
> token values already in `styles.css`. We move where the JSX lives; we do **not**
> change a single resolved value. Drift only happens if variants are flattened — the
> plan never flattens.

Validation gate per component: render the old and new side by side in the `:4599`
test harness and diff screenshots before deleting the old class.

## Tier 1 — clear wins (start here)

### 1. `Banner` (atom) + `Callout` (atom)
Consolidates six parallel strips into two primitives.

| Today (class · file) | Becomes | Props that preserve the exact look |
|---|---|---|
| `krnl-ctxbar` · flow.jsx | `Banner` | `tone="neutral"` `radius="panel"` `icon` |
| `krnl-disc` / `--preview` · flow.jsx | `Banner` | `tone="info"` / `selected` |
| `krnl-banner--info/--success` · Prescribe.jsx | `Banner` | `tone="info"|"success"` |
| `krnl-ans-callout` + `krnl-callout--{tone}` · chunks.jsx | `Callout` | `tone` |
| `krnl-coach` · flow.jsx | `Callout` | `variant="dashed"` (header + list slot) |
| `krnl-pii` · flow.jsx | `Callout` | `tone="info"` `strong` (header + body + actions slot) |

`Banner` = single-line icon + text + optional tag/slice tag. `Callout` = block notice
with header + body + optional footer/actions slot. Both `tone` scale maps onto the
existing `--status-*-tint` / `--status-*-solid` tokens. No new tokens needed.

### 2. `Chip` (atom)
| Today | Becomes | Props |
|---|---|---|
| `krnl-chip` (suggestion chips, related-question chips) · Composer, flow | `Chip` | `icon`, `onClick` |
| `krnl-fu-opt` (+ `.is-on`) · flow.jsx | `Chip` | `selected`, `disabled` |

These two are already near-identical pills; `selected` covers the only delta. Lowest
risk in the whole plan.

### 3. Overlay wrappers: `Menu`, `Popover`, `Select` (+ promote `Tip` → full `Tooltip`)
The Base UI `*.Root / *.Positioner / *.Popup` boilerplate plus the shared
`krnl-positioner` / `krnl-menu-popup` / `krnl-menu-item` styling is re-wired in
triggers.jsx, Composer.jsx and Prescribe.jsx. Wrap each once in Kernel so consumers
get one styled, accessible component. This is the Golden Rule applied: behaviour and
positioning come from Base UI, wrapped at the design-system layer, consumed not
re-imported. `Tip` stays; add a richer `Tooltip` if a non-label tooltip is needed.

## Tier 2 — solid (separate pass)

- **`Dialog`** — `MediaViewer` (chunks.jsx) hand-rolls `role="dialog" aria-modal`.
  Compose Base UI Dialog for focus trap + scroll lock + escape; `MediaViewer` becomes
  a thin domain wrapper.
- **`Field`** — `krnl-field` + `krnl-field-label` + control (Prescribe.jsx). Label +
  control + optional hint/error. Base UI ships `Field`.
- **`Spinner`** — `krnl-spin` (Composer attach) and `krnl-searching` dots → one
  loading atom.

## Tier 3 — borderline (only if wanted)

- `Table` (`krnl-table`, chunks.jsx) — generic enough to be a Kernel atom.
- `Kbd` (`krnl-kbd`, Composer slash-menu footer) — tiny.
- Promote `MessageBubble` (scope already `global`) → a generic Kernel `Bubble`.
- Fold `krnl-composer-submit` button into an `IconButton` variant (`accent`/`solid`).

## Stays a snowflake in Juglans (correct as-is)

The six triggers (shared discovery state machine), the clinical organisms
(`ContextBar`, `ContextDisclosure`, `PiiInterstitial`, `FollowupCard`,
`RelatedQuestions`, `PromptCoachBanner`, `AnswerView`, `AnswerBody`, `ChunkRenderer`,
`ConversationView`, `AgentIntro`, `SourceList`/`SourceItem`), `Composer`, the agent
screens, and `MedicationSchemePanel`.

These carry domain meaning and stay in Juglans. The change is that they **compose** the
new Kernel atoms instead of raw elements, so their `composes: []` becomes real. Triggers
keep their state machine but their inner `<button>` should sit on a Kernel button base.

## Sequencing (Kernel first, refactor later)

1. **Kernel PR A — Tier 1 atoms.** Add `Banner`, `Callout`, `Chip` to
   `src/components/`, each with co-located `meta` and `composes`. Reuse existing
   `styles.css` rules; only add variant rules where a prop needs one. Run the
   component-catalog gate, rebuild, verify in the harness. Commit + push Kernel.
2. **Kernel PR B — overlay wrappers** (`Menu`, `Popover`, `Select`, `Tooltip`).
3. **Greenhouse PR — consume.** Swap call sites to the new imports, delete the dead
   `krnl-*` markup, update each file's `composes`. `npm run all`, screenshot-diff in
   the harness, then propagate (`pull-juglans` → grove plugin bump → reinstall → tend).
4. Tier 2, then Tier 3, each as its own Kernel-then-consume pair.

Token work (any new variant colour/radius) is **not** done here — it delegates to the
`kernel-tokens` skill. This plan adds no tokens; every mapping above reuses existing ones.

## What this buys

Six strip implementations → 2 atoms. Two pill implementations → 1 atom. Four sets of
Base UI overlay boilerplate → wrapped once. Roughly 30+ raw `<button>`s rejoin the
`Btn` / `IconButton` family. One restyle later touches Kernel, not every Juglans file.
