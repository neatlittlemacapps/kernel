# Card family — structure plan (Accordion, HighlightCard, disclosure convention)

**Status:** Plan (Opus). **Execute with Sonnet.** Grounded in the repo's own conventions.
**Companion:** [CARECONNECT-CARD-MAPPING.md](CARECONNECT-CARD-MAPPING.md) (the source mapping).

Goal: recreate CareConnect's `HighlightCard` (`@cc/react-components`, Common-JS) on the proto-kernel
base **cleanly** — reusable pieces as their own components/stories, composed organisms on top, and
**one consistent disclosure convention** across the card family.

---

## 0. The organizing principle (how DSs normally do this)

Layer by **reusability**, and decide "own story vs not" by one test: **does the piece have an
independent identity someone would import and place on its own?**

The kernel already models three patterns — follow them, don't invent:

| Pattern | Kernel example | Rule |
|---|---|---|
| Standalone reusable component | `Collapsible` → `Core/Structure` | Own file + own story, in its category. **Never nested "under Card".** |
| Compound *parts* of a component | `Menu`/`MenuItem`, `Tabs`/`Tab`/`TabList`/`TabPanel` | Each part its own story, nested under a FAMILY folder (via `tools/lib/taxonomy.mjs`). |
| Pure layout *slots* (no independent identity) | `Card.Preview`/`Header`/`Body`/`Footer` | Documented as parent **anatomy** (Anatomy/Composer stories). No separate story. |

Consequence: reusable pieces (`Accordion`, `IconPill`, `FieldList`, `Badge`) stay standalone in
their own categories. Only pure slots live under `Card`. Composed organisms (`HighlightCard`,
`PatientCard`) sit in a higher layer and **compose primitives without adding new ones**.

---

## 1. Change A — disclosure convention (THE tweak, a base-Card change)

**Decision:** the collapse disclosure chevron moves to the **right edge of the header row**,
vertically centered — the "affordance rail". This is a **consistency fix**, evidenced in-repo:

- `Card` `detail` today: `.krnl-card-chev` is `position:absolute; left:50%; bottom:space-1` →
  **bottom-centre** (`styles.css:1160-1161`), with extra `padding-bottom` on the trigger to make
  room (`styles.css:1156`). This is the "chevron in the footer" look.
- `Collapsible` today: `.krnl-collapsible-trigger { display:flex; justify-content:space-between }`
  → chevron **already right-aligned** (`styles.css:820`). Card is the outlier.
- Reference (Cavell `ToolCallCard`, qa.docs.cavell.app): the **whole header row is the toggle**
  (`role="button" aria-expanded`), laid out `[leading icon tile] [title flex-1 truncate]
  [trailing cluster: status + chevron, right-aligned]`. Matches `Collapsible`, not `Card`.

> **Convention (lock it):** the right edge of a card/collapsible/accordion header row holds the
> trailing affordance — the `action` (static) or the disclosure chevron (collapsible). Card,
> Collapsible, and the new Accordion all obey it and rotate the chevron identically.

### Execution (Card, minimal blast radius)

- `Card.jsx` collapsible branch — DOM already is `<Trigger>{children}<span.krnl-card-chev/></Trigger>`.
  Keep it; the chevron stays the last child.
- `styles.css`:
  - `.krnl-card-trigger`: `display:block` → **`display:flex; align-items:center; gap:var(--space-2)`**;
    drop the extra `padding-bottom: calc(... + space-3)` (no longer reserving a bottom strip).
  - The summary (`children`, typically a `Card.Header`) fills: ensure it takes `flex:1 1 auto;
    min-width:0` so the chevron is pushed to the right (add `.krnl-card-trigger > :first-child { flex:1 1 auto; min-width:0 }` or `margin-left:auto` on the chev).
  - `.krnl-card-chev`: drop `position:absolute; left:50%; bottom; translateX(-50%)` → a plain
    `flex:none` inline-flex item. Keep the rotation-on-open + fast motion duration.
  - Rotation: adopt one convention family-wide — **closed = chevron down, open = chevron up**
    (clearest "opens downward"). Apply the same rule to `Collapsible` and `Accordion` so all three
    animate identically. (Collapsible today is right→down; unify to down→up — a 1-line CSS change.)
- Verify: focus ring still contained (inset offset), press/hover elevation ladder unaffected,
  reduced-motion block at `styles.css:809` still covers `.krnl-card-chev`.
- Multi-row summaries (title+value+description): chevron centres on the block — acceptable and
  matches Cavell's centred trailing cluster. If title-row alignment is later wanted, that's the
  "header-integrated" variant (route the chevron into the header's trailing `action` position) —
  **out of scope here**, note as a follow-up.

**Acceptance:** a `<Card detail=…>` shows the chevron top-**right** of the header row (not bottom),
visually matching `Collapsible` and Cavell's ToolCallCard; bare non-collapsible cards unchanged.

---

## 1b. Three patterns, kept distinct (this is the confusing bit — pin it down)

CareConnect ships all three **separately**, which is the proof they are different roles:

| Pattern | # collapsible regions | Coordination | Per-region chrome | The component |
|---|---|---|---|---|
| **Collapsible card** | 1 (the whole card) | — | the card's own | **`Card` + `detail`** ← **Cavell `ToolCallCard` is this** |
| **Bare collapsible** | 1 (no card frame) | — | framed/plain | **`Collapsible`** (exists) |
| **Accordion** | N plain items | shared active key (1-at-a-time, or `alwaysOpen`) | none (uniform) | generic **`Accordion`** ← **`@cc` `Accordion` is this** (react-bootstrap Accordion) |
| **Card with collapsible sections** | N sections, each toggles **independently** | none | **rich per-section** (tone/highlight/borderBottom/header) | **outer `Card` + a `Stack` of collapsible section-`Card`s** ← **`@cc` `HighlightCard` is this** |

Two corrections to my earlier plan:

1. **Cavell `ToolCallCard` is a *collapsible card*, not an accordion.** One header row, one disclosure,
   one panel. It maps straight to `Card` + `detail` — so **Change A alone covers it.** No accordion
   involved.
2. **`HighlightCard`'s sections are *not* an accordion either.** `@cc` proves this by keeping its
   `Accordion` (plain, coordinated, react-bootstrap) **separate** from `HighlightSection` (independent
   toggle, card-like chrome per section). Accordion items are plain text headers; HighlightCard
   sections carry tone + highlight + a rich icon/title/description header — that's **card chrome**, not
   accordion-item chrome. So each section is a *collapsible card*, and **`HighlightCard` needs no new
   primitive** — it's `Card` all the way down.

→ The generic **`Accordion`** (the kernel's own referenced-but-missing gap, Base UI primitive already
installed) is a **real, separate component worth building** — but it is **decoupled** from this work
and needed by **neither** reference. Build it only if/when you want plain coordinated accordions.
Removed from the critical path; **OPEN FORK 1 (Accordion API) is therefore moot for now.**

---

## 2. Change B — `HighlightCard` as pure composition (no new primitive)

`HighlightCard` = an outer `Card` whose body is a `Stack` of collapsible section-`Card`s:

- **Shell:** `Card` — `tone`←`variant`, `bordered`←`border`. Header row = `Card.Header`
  (`leading`=`IconPill`/tag, `title`, `badge`, `action`=the header buttons). The shell is **not**
  `interactive`/`detail` itself (so no button-in-button with the sections' triggers).
- **Sections:** `Card.Body` → `<Stack>` of section-`Card`s. Each section = a `Card` with
  `tone`=section variant, `surface="tinted"` when `highlight`, and `detail` when collapsible (its
  header — icon/title/description — is the summary; content is the panel). A non-collapsible section
  is just a `Card` with no `detail`. Disclosure sits right per **Change A**.
- **Content atoms inside:** `FieldList`←`DescriptionList`, `StatusPill`/`Chip`←`Badge`, `IconPill`.
- **Drops** `react-nanny` (explicit slots, not type-sniffed flat children) and
  `framer-motion`/`CollapseMotion` (Base UI Collapsible via `detail` owns the animation + ARIA).

**RESOLVED (2026-09-08) — HighlightCard IS a shipped Kernel component.** Premise: multiple surfaces
will use it → it clears STANDARD.md §5's promotion gate ("graduates into Kernel when a 2nd consumer
needs it"), so it belongs **in the Kernel repo with its own catalog entry + story**. Terms:

- **Tier: `global`, core `.`** — its structure (tag + title + actions + collapsible toned sections)
  is domain-neutral, so it sits with the other composed molecules (`Banner`/`Callout`), not behind a
  scoped subpath. **Do NOT put it in `./clinical`** — that slice is being retired.
- **Composed organism, not a primitive:** honest `composes: ['Card','Stack','Collapsible','IconPill',
  'FieldList', …]` (the gate flags a composed thing declaring `composes: []` as drift). It is visibly
  built ON `Card`, not a parallel card.
- **Category:** `Core/Data Display` (alongside `PatientCard`/`SproutCard`/`Table`) — a composed,
  data-bearing card. Add to `CORE_CATEGORY` in `taxonomy.mjs`.
- Still benefits from **Change A** (disclosure-right) instead of reimplementing collapse.

---

## 3. Build order for Sonnet (once Fork 2 is settled)

1. **Change A** (disclosure right) — Card CSS + minor trigger flex; unify Collapsible rotation.
   Smallest, highest-consistency win; it alone recreates the `ToolCallCard` header behaviour.
   Land + visually verify first.
2. **Change B** — `HighlightCard` composition + its story (rebuild `@cc`'s `Default` +
   `SectionVariants` examples as `Card` + a `Stack` of collapsible section-`Card`s). No new primitive.
3. **(Deferred / optional)** generic `Accordion` primitive — only if plain coordinated accordions are
   wanted; decoupled from the above, its own PR.
4. Gates: `npm run catalog` · `npm run gate` · `npm run test` · `run-story-tests` — all green.
   `title:` is derived by `taxonomy.mjs` (never hand-write); `Card` is stable (full meta bar).

**Do NOT flatten anything or change resolved token values** — this is structure + one CSS relocation,
not a restyle.
