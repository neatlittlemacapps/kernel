# HighlightCard + Card (@cc/react-components) → proto-kernel Base Card

**Focus:** component *structure* — which slot-components exist, which are needed, and how to
lay out Storybook. Not tokens/colour/pixel parity.

## Which repo is which (this tripped us up — pin it down)

| Storybook / repo | Package | Stack | Has HighlightCard? |
|---|---|---|---|
| `dev.azure.com/corilusnv/CareConnect/_git/Common-JS` (branch `master2`) — **published at `design.careconnect.be`** | **`@cc/react-components`** v1.1.35 | React + **react-bootstrap** + primereact, SCSS, pnpm/lerna/turbo monorepo, Storybook 10 | **Yes** — this is the one |
| `dev.azure.com/corilusnv/CareConnect/_git/CareConnect-UI` | (older lib) | React 16 + **styled-components**, styleguidist | No — different, older library |

Everything below is the **Common-JS `@cc/react-components`** source
(`react-components/src/{HighlightCard,Card,DescriptionList,CollapseMotion}.tsx`,
`stories/HightlightCard.stories.tsx`), mapped onto proto-kernel
`src/components/Card.jsx` + `CONTENT-ATOMS.md`.

---

## 1. Headline — HighlightCard is not "a card", it's a card-shaped *list of collapsible sections*

The single most important structural fact:

- proto-kernel `Card` models **one** card with **one** optional collapsible region (`detail`).
- `HighlightCard` models **a header row + N repeatable `HighlightSection`s**, where *each section*
  is independently **collapsible**, independently **toned** (`variant`), and independently
  **emphasised** (`highlight` / `borderBottom`).

So HighlightCard does **not** map to one Base Card. It maps to **an outer Card whose body is a
`Stack` of section-cards** (or a new repeatable `Card.Section` sub-component). That decomposition
is the whole job — everything else is slot wiring.

Second structural fact — **composition mechanism differs**:

- `HighlightCard` takes a **flat children list** and uses **`react-nanny`**
  (`getChildByTypeDeep` / `getChildrenByTypeDeep`) to pluck children *by component type* (Icon,
  Title, Button(s), Section(s), Footer) and reassemble them into a fixed internal layout. The
  consumer writes children in any order; the component sorts them.
- proto-kernel `Card` uses **explicit named slots** — `Card.Header leading=/title=/badge=/action=`
  props + nested `Card.Body` / `Card.Footer` elements. No type-sniffing.

A kernel re-creation should **drop `react-nanny`** and use explicit slots / an array of section
descriptors — it's the STANDARD.md-aligned direction and avoids deep-traversal + type-coupling.

---

## 2. HighlightCard anatomy — the 7 slot-components

All live in one file (`HighlightCard.tsx`), attached to the root as a compound component.

| Slot component | Props | Role | proto-kernel target |
|---|---|---|---|
| `HighlightCard` (root) | `variant` (9: primary/secondary/success/danger/warning/orange/accent/info/light), `onClick`, `border` | Header row + section stack + footer; reorders flat children via react-nanny | `Card` shell — `variant`→`tone`, `border`→`bordered`, `onClick`+`interactive` |
| `HighlightCard.Icon` | `type` (IconType), `text`, `gradient` | Leading **tag** — icon + label ("Consult") | `Card.Header` `leading` = `IconPill` (+ text) — or a `Badge` |
| `HighlightCard.Title` | `title`, children (inline badges) | Heading + trailing badges | `Card.Header` `title` (+ `badge`) |
| `HighlightCard.Button` | `ButtonProps` (icon, onClick), **repeatable** | Header actions, `borderless-dark`, pinned right | `Card.Header` `action` — **needs to accept a group** (see §4) |
| `HighlightCard.Section` | `icon`,`title`,`description`,`highlight`,`collapsible`,`initialCollapsed`,`isCollapsed`,`showMoreLabel`,`showLessLabel`,`variant`,`borderBottom`,`allowOverflowWhenOpen` | **The core repeatable unit** — a titled, optionally collapsible, optionally toned block | **New structure** (see §3) |
| `HighlightCard.SectionActions` | children | Actions in a section's header (right) | section-level `action` slot |
| `HighlightCard.Content` | children | Body inside a section | `Card.Body` (per section) |
| `HighlightCard.Footer` | children | Card footer | `Card.Footer` |

Deps: `Icon`, `Button`, `CollapseMotion` (framer-motion), `react-nanny`, `classnames`,
`DescriptionList`.

---

## 3. The one real gap — a repeatable collapsible `Section`

proto-kernel today: **one** `detail` region per card, driven by Base UI Collapsible + the
controlled `expanded` / `defaultExpanded` / `onExpandedChange` triad. HighlightCard needs **many**
sections per card, each collapsible. `HighlightSection` also carries features the single `detail`
doesn't express:

| HighlightSection feature | proto-kernel status | Port note |
|---|---|---|
| repeatable (N per card) | ✗ (single `detail`) | **The gap.** N nested `Card`s in a `Stack`, or a new `Card.Section`. |
| `collapsible` + chevron | ✓ (`detail` uses Base UI Collapsible) | Reuse the mechanism per section. |
| `showMoreLabel` / `showLessLabel` | ✗ | Small addition to the trigger. |
| `initialCollapsed` / controlled `isCollapsed` | ✓ (`defaultExpanded` / `expanded`+`onExpandedChange`) | Direct map (invert the boolean sense). |
| per-section `variant` (own tone) | ✓ (`Card` `tone`) | Each section-card sets its own `tone`. |
| `highlight` (tinted background) | ✓ (`surface="tinted"`) | Map `highlight`→tinted surface. |
| `borderBottom` (tone-coloured) | ~ (`accent` is a top strip) | Closest is `accent`; a bottom rule is a small CSS add if exact parity needed. |
| section header (icon+title+description) | ✓ (`Card.Header` leading/title/description) | Direct map. |
| `SectionActions` (header-right) | ✓ (`Card.Header` `action`) | Direct map. |
| `allowOverflowWhenOpen` | n/a | Base UI Collapsible handles overflow; likely unneeded. |
| animation (`CollapseMotion`/framer-motion) | ✓ (Base UI Collapsible height var + CSS) | **Drop framer-motion** — Base Card already animates via the collapsible primitive. |

**Recommended shape on the kernel** (mirrors how `sprout-cards/PatientCard` composes the base):

```
HighlightCard  =  <Card tone={variant} bordered={border}>   // outer shell
                    <Card.Header leading={<IconPill/>} title badge action={buttons} />
                    <Card.Body>
                      <Stack>
                        {sections.map(s =>
                          <Card                                  // each section = a card
                            tone={s.variant}
                            surface={s.highlight ? 'tinted' : undefined}
                            detail={s.collapsible ? <Card.Body>{s.content}</Card.Body> : undefined}
                            expanded={...} onExpandedChange={...} // controlled: one-open coordination
                          >
                            <Card.Header leading={s.icon} title={s.title}
                                         description={s.description} action={s.actions} />
                            {!s.collapsible && <Card.Body>{s.content}</Card.Body>}
                          </Card>)}
                      </Stack>
                    </Card.Body>
                  </Card>
```

So no new *chrome* is needed — the gap is purely **"N collapsible sections in one card"**, which is
composition + (optionally) a thin `Card.Section` convenience wrapper so consumers don't hand-wire
the map. The controlled `expanded`/`onExpandedChange` triad already there gives "only one open at a
time" for free.

---

## 4. Slot-components needed — the short list

Against proto-kernel's 8 content atoms (`IconPill · StatusPill · TrendChip · ValueDisplay ·
Stepper · Sparkline · FieldList · EditChip`):

| HighlightCard needs | Covered? | Action |
|---|---|---|
| `DescriptionList` (label/value rows, Bootstrap grid) | ✓ `FieldList` | Use `FieldList`. (`DescriptionList`'s `labelSize` column-ratio → a FieldList prop if needed.) |
| Header tag (icon + "Consult" text) | ~ `IconPill` | `IconPill` + label, or `Badge`. Mostly covered. |
| Header actions (**multiple** buttons) | partial | Base Card `action` is a **single node** — pass a fragment/`ButtonToolbar`. Minor; consider letting `action` accept an array. |
| Repeatable collapsible **Section** | ✗ | **The one genuinely new slot** (§3) — `Card.Section` convenience wrapper. |
| `CollapseMotion` (framer-motion) | ✓ (Base UI Collapsible) | Not a new atom — drop the dep. |
| `HighlightCard.Footer` | ✓ `Card.Footer` | Direct. |

**Net new work: one thing** — a repeatable collapsible section (`Card.Section`), which is a
*composition* of the existing Base Card, not new chrome.

---

## 5. The regular `Card` (@cc/react-components) — fully buildable on the Base Card today

`Card.tsx` is a thin wrapper over `react-bootstrap/Card` with sugar slots:

| @cc Card slot | What it is | proto-kernel target |
|---|---|---|
| `Card.Body` | `BsCard.Body` | `Card.Body` |
| `Card.Header` | `BsCard.Header` | `Card.Header` (or `Card.Preview` if it's media) |
| `Card.Title` | `<h3 class="card-title">` | `Card.Header` `title` |
| `Card.Actions` | `ButtonToolbar.ms-auto` (right-aligned) | `Card.Header` `action` or `Card.Footer` |
| `Card.Back` | borderless chevron-left button | small back-nav **content** (no slot needed) |
| `Card.Footer` | `BsCard.Footer` | `Card.Footer` |

**Verdict:** every slot maps onto the current Base Card with no gaps. `Card.Back` is the only
non-obvious one and it's just a button you drop into `action`. So "can we build the regular Card on
the current Base Card?" — **yes, today, no new structure.**

---

## 6. Storybook structure

The `@cc` HighlightCard story already enumerates the demonstration surface:
`Default · Variants (all 9) · VariantsFeatures (present/absent parts) · Bandges [sic] (badges in
title) · SectionVariants (per-section tone) · SectionBorderBottom · VisualShowcase · CardBorder`.

That maps cleanly onto proto-kernel's existing `Card.stories.jsx` shape — **reuse it, don't invent
a new one**:

| @cc story | proto-kernel story to reuse |
|---|---|
| Default | `Playground` |
| Variants (9 tones) | `Gallery` (tone matrix) |
| SectionVariants / SectionBorderBottom / CardBorder | `ChromeMatrix` (labelled decision cells) |
| VariantsFeatures (parts present/absent) | `Anatomy` + an "omitted slots" cell |
| the collapsible sections | `CollapsibleVitals` (the controlled-expand pattern) |
| — | `Composer` (pick an atom per region) — the "which atom goes where" sandbox |

Then add **one composed "HighlightCard parity" story** that rebuilds the `Default` +
`SectionVariants` examples on the Base Card + a `Card.Section` wrapper — that's the artifact that
proves the recreation with a render, not an assertion.

Two repo constraints (BASE-CARD-PLAN §10 + CLAUDE.md): Storybook `title:` is **derived** by
`tools/lib/taxonomy.mjs` — never hand-write it; and `Card` is `status:'stable'`, so `npm run gate`
requires `summary` + `usage` + a `description` on every Kernel-invented prop.

---

## 7. Summary — what recreating these needs

1. **Regular `@cc` Card → Base Card:** buildable **today**, no new structure. All six slots map.
2. **HighlightCard → Base Card:** one real structural addition — a **repeatable collapsible
   `Card.Section`** (an outer Card whose body is a `Stack` of collapsible, per-section-toned
   child Cards). No new *chrome*; it's composition of the existing base.
3. **Drop two deps in the port:** `react-nanny` (use explicit slots, not type-sniffed flat
   children) and `framer-motion`/`CollapseMotion` (use the Base Card's Base UI Collapsible).
4. **Content atoms:** `DescriptionList`→`FieldList` (covered); header tag→`IconPill`/`Badge`
   (covered); the only ergonomic add is letting header `action` hold multiple buttons.
5. **Storybook:** reuse the existing 6-story shape; add one composed "HighlightCard parity" story.

**Later (real Kernel):** decide whether `Card.Section` is a first-class sub-component of `Card` or a
`content/` composition, and whether per-section `variant` + `borderBottom` warrant their own tokens
or ride the existing tone/accent contract.
