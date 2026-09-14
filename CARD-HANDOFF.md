# Handoff Spec: Card (base component)

Parent work item: [AB#343467](https://dev.azure.com/corilusnv/Juglans/_workitems/edit/343467)

For reference, the current implementation lives in [src/components/Card.jsx](src/components/Card.jsx),
[src/lib/cardChrome.js](src/lib/cardChrome.js) and [src/styles.css](src/styles.css) —
worth a look for context, but the "how" below is a starting point, not a mandate.
Pick whatever mechanism (grid/flex, custom properties/utility classes, however shadows
get composed) fits the target codebase's existing patterns and token set.

Each section below (**Task 1-8**) is scoped to stand alone as a separate Azure DevOps
task under AB#343467. Copy a task's heading + body directly into a new work item.

---

## Overview

`Card` is the neutral base card — the shared visual/behavioral contract the whole card
family builds on: the generic `Card` itself, a `Banner` variant, and a collapsible
("accordion-style") trigger card. More specialised cards should compose this contract
rather than each hand-rolling their own wrapper.

Whatever resolves the visual treatment (surface, border, accent, elevation) should do
so predictably — one state shouldn't unpredictably lose to another due to
CSS/specificity ordering. Interaction states (hover, selected, dragging, focus) layer
on top of the resting look; design each state as an independent, composable rule
rather than a chain of overrides.

Four content slots: `Card.Preview` / `Card.Header` / `Card.Body` / `Card.Footer`.

---

## Task 1 — Layout & anatomy

**Slots:**

| Slot | Purpose |
|------|---------|
| `Card.Preview` | Edge-to-edge media at the top (or side, in the horizontal form) — bleeds past the card's own padding, and its outer corners should still follow the card's corner radius. |
| `Card.Header` | A leading icon/avatar, a text block (title + optional badge, an optional prominent "value", an optional description), and an optional trailing action — laid out so the text block doesn't collide with the leading icon. |
| `Card.Body` | Freeform content, full width. |
| `Card.Footer` | A row of actions. |

**Requirement:** any slot may be omitted, and an omitted slot must not leave visible
empty space (no dangling gap, no orphaned spacing) — this needs to hold regardless of
*which* slots are present or absent, not just the common cases.

**Orientation:**
- Default (vertical): slots stack top to bottom.
- Horizontal: the preview sits beside the content instead of above it, in a
  constrained-but-flexible width (roughly a third of the card, bounded on both ends so
  it neither disappears nor dominates). When there's no preview to show, this variant
  should behave like the default stacked layout rather than reserving an empty media
  column.

**Spacing:** gaps between populated slots should come from the density scale (below),
not a fixed value — and again, must not appear between/around an empty slot.

**Density:** three levels — compact / comfortable (default) / spacious — each scaling
padding, inter-slot spacing, and corner radius together as one step, sourced from
whatever density/spacing tokens the target system already exposes. When a card doesn't
specify a density, it should inherit whatever ambient density its container has set,
rather than hard-defaulting to "comfortable" — that inheritance is what lets a card
nested in a compact list pick up compact spacing for free.

---

## Task 2 — Token categories needed

No specific token names prescribed here — map each to whatever this codebase's
existing token set already provides:

- **Surface fill** — a plain/bright fill, a tinted/muted fill, and fully transparent, for the card body.
- **Border** — a default (neutral) border color, distinct from...
- **Tone / accent ramps** — a way to render the card in a named status color (info, success, warning, error) and in a small set of neutral qualitative "data" colors, each needing at minimum a vivid/accent step, a light tint step, and an AA-safe text step.
- **A "primary"/brand accent** — used both as an explicit tone option and as the fallback accent when a stateful indicator (e.g. selection) has no tone to follow.
- **Elevation / shadow** — at least four distinct tiers: a resting "floating" shadow, a hover tier, a pressed tier (visually settled *below* rest, not above it), and a top-most tier reserved for drag state (which should outrank every other state's shadow).
- **Focus indicator** — a token/color distinct from the tone/selection ring, since both need to be visible at once when a card is simultaneously focused and selected.
- **Motion** — two duration steps (a faster one for small state changes like an icon rotation, a base one for layout/shadow transitions) and matching easing curves (a "standard" and a "decelerate" feel).
- **Disabled state** — an opacity or treatment token for the disabled look.
- **Density/spacing scale** — see Task 1.

---

## Task 3 — Tone & accent resolution

`tone` should accept: a named status (info/success/warning/error), a small fixed set
of named "data" tones for qualitative/categorical use, a `"primary"` brand tone, an
arbitrary raw color, or nothing (neutral).

**Tone scope — two ways a tone can apply, both worth supporting:**
- Applied to the whole box — background tint (when the surface is set to "tinted"),
  border, and the accent strip (below) all pick up the tone, with border and strip
  ideally reading as the *same* weight of color so the edge feels like one line, not two.
  A raw/arbitrary color can drive this too, even without a full ramp behind it — it
  just won't have the same fine-grained rungs, so decide what a sane fallback resolution
  looks like when there's no ramp to draw a text-safe or tint variant from.
- Applied only to content — the box itself stays neutral, but the resolved tone
  (accent, tint, text-safe step) should still be *available* for slot content to use —
  e.g. so a leading icon tile inside the header can pick up the tone even when the card
  shell doesn't.

**Surface fill:** a "plain" option (opaque, matches the app's base card look), a
"tinted" option (a wash noticeably lighter/more muted than the tone's own accent step —
it should read as a hint of color, not a saturated block), and "none" (transparent).

**Accent strip:** an optional colored edge (top edge by default; a left edge for the
Banner variant) — implement however keeps it cleanly clipped to the card's corner
radius. It should fall back to a neutral, still-visible treatment rather than vanishing
when no tone resolves. Treat it as incompatible with `Card.Preview` on the same edge —
a full-bleed image would otherwise cover or clash with it, so pick one or the other in
that situation (or place the strip on a different edge).

**Border:** when the box is tone-painted, prefer matching the border color to the
accent/strip color rather than the plain neutral border, so the whole edge reads as one
intentional color rather than two competing ones.

---

## Task 4 — States & interactions

| State | When | Intended effect |
|---|---|---|
| Rest | default | per the tone/surface resolution above |
| Hover — flat card | interactive, no elevation/accent/collapse | a border-color change is enough; no lift |
| Hover — "floating" card | interactive *and* elevated/accented/collapsible | a slight lift (subtle upward shift) plus a deeper shadow tier |
| Press/active | pointer down | shadow settles to a tier *below* rest (reads as "pressing down"), lift removed |
| Focus | keyboard focus, interactive form only | a visible outline on its own channel, independent of the selection indicator below — both need to be visible together when both apply |
| **Selected** | `selected` prop | a visibly distinct border/ring treatment that **follows the card's own resolved tone**, falling back to the primary/brand accent only when no tone is set. *(This direction was corrected on 2026-09-07 — it previously always rendered the primary/brand color regardless of the card's tone; see `git log --grep "primary tone to Card"`.)* Also communicate this state to assistive tech (e.g. a pressed/selected ARIA state) on the interactive form. |
| Dragging | `dragging` prop | the topmost shadow tier, and it should win over every other state's shadow (hover, press, even selected) while active |
| Disabled | `disabled` prop | reduced opacity, non-interactive cursor, and on the interactive form, hover/active/focus must be genuinely suppressed, not just visually — use the platform's real disabled semantics rather than a purely visual treatment |

**Selectable list-row variant:** worth supporting an interactive card that reads as a
dense row (a citation, a suggestion, a radio-style row) rather than a boxed, flowed
card — no bottom margin, and on a borderless look, hover can be a background tint
instead of a border change. Pairs naturally with a compact density and the header
slot's leading-icon/title/action layout.

---

## Task 5 — Props / variants reference

This is the API surface — implement to this contract; the visuals it drives are
described above.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `surface` | `'plain' \| 'tinted' \| 'none'` | `'plain'` | body fill — Task 3 |
| `bordered` | bool | `true` | hairline border on/off |
| `elevated` | bool | `false` | ambient floating shadow, no ring — same "floating" family as `accent`/`detail` |
| `accent` | bool | `false` | accent strip — Task 3 |
| `tone` | string | — | Task 3 |
| `toneScope` | `'box' \| 'content'` | `'box'` | Task 3 |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | inherited | Task 1 |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Task 1 |
| `interactive` | bool | — | renders as a real interactive/focusable element; opt-in only, never implied just because an `onClick` was passed |
| `as` | string | `'div'` | tag/element for the non-interactive form |
| `selected` | bool | — | Task 4 |
| `dragging` | bool | — | Task 4 |
| `disabled` | bool | — | Task 4 |
| `detail` | node | — | opts into the collapsible form — Task 6 |
| `expanded` / `defaultExpanded` / `onExpandedChange` | — | — | controlled/uncontrolled expand state for the collapsible form |
| `floatingAction` | node | — | pinned overlay action (e.g. a menu button or checkbox), independent of the slot flow |
| `onClick` | fn | — | ignored once `detail` is set — the expand/collapse toggle owns the click there |
| `appearance`, `size`, `dense` | — | — | deprecated aliases → prefer `surface`/`bordered`/`elevated`, `density` respectively |

**Do:** compose the base card and fill slots rather than rebuilding chrome from
scratch; reach for `selected` to mark a chosen item in a set; pair `accent` with a
`tone` so color shows in the strip (and optionally an icon) while the body stays light
and text stays legible.

**Don't:** nest an interactive card inside another interactive card, or put another
interactive control inside a collapsible card's clickable summary — both create
invalid nested-control markup. Give collapsible actions their own slot instead (inside
`detail`, not the summary).

---

## Task 6 — Collapsible form (`detail`)

Setting `detail` opts a card into expand/collapse behavior, with the card's normal
children acting as the always-visible summary/trigger.

- The summary should stay display-only — no nested interactive controls in it (see
  Task 5's "don't"). Put any actions inside the collapsible `detail` content instead,
  as a sibling of the trigger, never nested inside it.
- `interactive`/`onClick` don't apply in this form — the expand toggle *is* the
  interaction. Use `onExpandedChange` for any side effects, and the controlled
  `expanded`/`onExpandedChange` pair to coordinate "only one open at a time" across a
  set of cards.
- Whatever indicates open/closed state (e.g. a chevron) should visibly flip when
  toggled, using the faster of the two motion durations from Task 2.
- The panel's reveal/hide should animate smoothly (e.g. height or a fade+height
  combination) using the base duration/decelerate easing — avoid an abrupt cut.
- The floating-card hover/press lift from Task 4 applies here too while collapsed.
- The trigger's focus indicator needs to stay visually contained within the card's
  rounded corners rather than clipping against a sibling element — an inset offset is
  one way to achieve that, but the requirement is "stays inside," not the specific
  offset value.

---

## Task 7 — Responsive behaviour & a known limitation

- The horizontal orientation (Task 1) currently has **no automatic fallback to
  vertical** at narrow widths — worth fixing, but with a caveat: a card reacting to its
  *own* width via a container query does not reliably work when the query container
  and the styled element are the same node (confirmed empirically in at least one
  major browser engine) — the query container generally needs to be a separate
  ancestor of the element being styled. A fix likely means introducing a wrapper
  element for the sizing query, with the visual styling applied to its child. The
  existing `PatientCard` component has the same latent issue on an equivalent rule, so
  a fix here should probably carry over there too — worth flagging as a linked/related
  task rather than solving twice independently.
- Sizing queries scoped to the card's *own* width remain fine for styling things
  *inside* it (e.g. scaling header text at larger card widths) — it's only a rule that
  targets the container element itself that hits this limitation.
- No fixed viewport breakpoints are baked into the card; density and orientation are
  the two axes a consuming layout sets explicitly per breakpoint if needed.

---

## Task 8 — Accessibility & edge cases

**Accessibility:**
- The non-interactive form carries no implicit role or keyboard behavior. A
  specialised card that needs its own semantics (e.g. one containing a heading and its
  own nested controls) should build custom interactivity on top of the plain form
  rather than opting into `interactive` — turning the whole card into one giant button
  around other interactive content creates nested-control markup.
- The interactive form should be a real, natively focusable/activatable control (not a
  styled `<div>` with a click handler), and should only expose a pressed/selected
  state to assistive tech when `selected` is actually meaningful for that card — a
  plain clickable card with no selection concept shouldn't announce one.
- The collapsible form should expose standard expanded/controls relationships to
  assistive tech automatically (whatever primitive/library implements it — don't
  hand-roll this if a tested one is available).
- A disabled interactive card should use real disabled semantics (Task 4); a disabled
  non-interactive card only needs a visual/state marker, since it was never focusable
  to begin with.
- Keep focus and selection on separate visual channels (Task 4) — don't collapse them
  into a single indicator, since a user can be in both states at once and needs to see
  both.

**Edge cases to design/test against:**
- Every combination of present/absent slots (Task 1), including all-empty and
  preview-only.
- `accent` combined with `Card.Preview` on the same edge (Task 3) — decide and
  document the resolution rather than leaving it to accident; consider a lint/story
  check that flags the combination.
- Long or wrapping header text — no truncation is assumed by default; a consumer
  needing truncation for a fixed-height grid should add it themselves rather than the
  card silently clipping content.
- `toneScope="content"` combined with `accent` — confirm the strip's fallback
  treatment reads as intentional, not like a bug.
- `selected` with no tone set — confirm the fallback (primary/brand accent) still
  looks correct.
- Dragging simultaneously with selected and/or hover — dragging's shadow should win
  per Task 4, while the selection ring (a separate visual layer from elevation) should
  still be visible underneath it.
