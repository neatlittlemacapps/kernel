# Kernel Component & Property Standard

> The single source of truth for how Kernel components are named, how their properties are named and
> structured, and how they bind to tokens and scope. Ships with the package (exported as
> `@corilus/kernel/standard.json` for tooling; this file is the human narrative). Every Kernel skill
> reads it before authoring or auditing a component.
>
> **Version 0.1.0.** Companion machine dictionary: `standard.json`. Rationale + the system that enforces
> this lives in grove `research/kernel-component-governance/PROPOSAL.md`.

## 1. Naming components

- **Name by function, not appearance, implementation, or brand.** `Banner`, not `YellowBox`.
- **PascalCase** identities; files share the stem (`Banner.jsx`, `Banner.css`).
- **Family stems** for related components: `Card` / `CardHero`, `Input` / `InputDate`, `Avatar` /
  `AvatarGroup`. A new family member extends the stem; it does not invent a new word.
- **Subcomponents are prefixed by the parent** (`Banner.Action` / `BannerAction`). Flexible regions are
  **slots / children**, not a prop per region.
- **Breaking API change → version the name** (`Button` + `ButtonV2`, deprecate the old). Do not mutate a
  shipped prop contract in place.
- Kernel's current abbreviations (`Btn`, `Tip`, `PAv`) are an accepted **house-style choice** — they are
  abbreviations, not coded IDs. A future migration to plain names (with deprecated aliases) is deferred
  until after the `krnl-rename` work; this Standard documents the plain-name guidance but does not force
  the rename yet.

## 2. The three-way property ownership rule (the heart of the Standard)

Kernel composes **Base UI** (headless). That decides who owns each property, and therefore how it is
named. Every property a component exposes falls into exactly one class:

| Class | Owned by | Convention | Examples |
|---|---|---|---|
| **Interaction state** | the Base UI primitive | **Not a prop.** Styled via `[data-*]` in CSS. Never re-author as `isOpen` / `.is-on`. | `data-state` (open/closed), `data-checked`, `data-disabled`, `data-pressed`, `data-invalid`, `data-orientation` |
| **Pass-through control** | Base UI, surfaced by the wrapper | **Mirror the primitive verbatim.** | `checked` / `onCheckedChange`, `open` / `onOpenChange`, `value` / `defaultValue` / `onValueChange`, `disabled`, `required`, `readOnly` |
| **DS presentation** | Kernel itself | **`variant` + `tone` + `size`.** This is the only axis Kernel invents. | `variant`, `tone`, `size` |
| **Content** | Kernel | Slots / `children` / text props. | `children`, `icon`, `action`, `label`, `title` |

Consequence: the generic `is*` boolean list (`isOpen`, `isChecked`, `isExpanded`, `isPressed`) is a
**Figma-library** convention. In Kernel *code* those are primitive state, read off `data-*`. Re-declaring
them as props is the "hand-roll behaviour Base UI ships" violation.

**Booleans in code mirror Base UI / HTML** — `disabled`, `checked`, `required`, `readOnly` — not
`isDisabled`. The `is*` prefix is a design-tool convention only; the cheat-sheet maps between them
(Figma `isDisabled` ↔ code `disabled` ↔ `[data-disabled]`).

## 3. Property dictionary

### DS-presentation axis (the only Kernel-authored props)

| Prop | Values | Token binding |
|---|---|---|
| `variant` | component-specific style/emphasis set, e.g. `subtle \| strong` (Banner), `primary \| secondary` (Btn) | per component |
| `tone` | `neutral \| info \| success \| warning \| error` | `--status-{tone}-tint` (bg), `--status-{tone}-solid` (icon/rule), `--status-{tone}-on` (text). **`neutral` has no status token** → `--surface-panel` + `--text-muted`. |
| `size` | `sm \| md \| lg` | `--density-*` / size-step tokens |

The error tone value is **`error`** — it matches the token stem `--status-error-*` 1:1, with no
prop-value→token lookup table.

Rules:
- **Mutually-exclusive options are one enum, never N booleans** (Polaris Button v12).
- **`variant` = visual style, `tone` = semantic color.** Orthogonal, so neither explodes: 5 tones × N
  variants from one component, zero extra classes.
- **`density` is NOT a prop** — it is an orthogonal token modifier (`--density-*`) applied at an
  ancestor. A `compact` prop would duplicate the token layer.
- **`radius`, elevation, spacing are NOT props** — they resolve to tokens at the component's class. Add a
  prop only when a genuine variant axis exists (and then it maps to tokens, never literals).

### Booleans, events, controlled state

- **Pass-through booleans mirror Base UI / HTML:** `disabled`, `required`, `readOnly`.
- **DS-only booleans** (rare — Base UI doesn't model them) are plain adjectives: `glow`, `loading`.
  Prefer expressing as `tone` / `variant` if it is really a style axis.
- **Events:** `on<Event>` (`onDismiss`, `onValueChange`). Mirror the primitive's handler names for
  pass-throughs (`onCheckedChange`, `onOpenChange`).
- **Controlled / uncontrolled triad:** `value` / `defaultValue` / `onValueChange`. `default*` = the
  uncontrolled initial value.

### Content / slots

- `children` for the primary content; `icon` / `action` for leading / trailing slots — **trailing**, not
  **right** (RTL-safe).
- Composition uses Base UI's **`render` prop** + `forwardRef` (required for any component used as a Base
  UI `render` target, or the positioner anchors at 0,0).

## 4. Worked example — `Banner`

Single-line icon + message + optional trailing action; collapses the six Juglans status strips.

| Prop | Class | Values | Token / behaviour |
|---|---|---|---|
| `tone` | DS presentation | `neutral \| info \| success \| warning \| error` | `--status-{tone}-tint/solid/on`; `neutral` → `--surface-panel` + `--text-muted` |
| `variant` | DS presentation | `subtle \| strong` | `subtle` = `-tint` bg; `strong` = `-solid` bg + `--text-on-accent` |
| `icon` | Content (slot) | ReactNode | leading visual; color inherits `--status-{tone}-solid` via `currentColor` |
| `children` | Content (text) | string / node | the message (block notices are `Callout`, not `Banner`) |
| `action` | Content (slot) | ReactNode (a `Btn` / `IconButton`) | **trailing**, RTL-safe |
| `onDismiss` | Event | `fn` | optional; renders an `IconButton` close; focus ring `--focus-ring` |
| `live` | a11y | `off \| polite \| assertive` | maps `role` / `aria-live`; `error` defaults `assertive`, `neutral` defaults `off` |

**Not props, by design:** `density` (token modifier), `radius` (defaults to `--radius-panel`), and any
open/closed/dismissed **state** (presentational atom; dismissal is the parent's concern via `onDismiss`).

Maps the six strips with zero value change: `krnl-ctxbar` → `tone="neutral"`; `krnl-banner--info` →
`tone="info" variant="subtle"`; `krnl-pii` (alert) → `tone="error" variant="strong" live="assertive"`.

## 5. Scope tiering + promotion gate (multi-agent)

Juglans hosts many agents; `scope` models this (`global` / `{agents:[…]}` / `{surfaces:[…]}`). Tier every
component:

| Tier | `scope` | Lives in | Examples |
|---|---|---|---|
| Generic atoms/molecules | `global` | Kernel `.` | `Banner`, `Callout`, `Chip`, `Btn`, `Field`, `Dialog` |
| Shared domain | `{surfaces:[…]}` | Kernel `./clinical` | clinical cards external builds can drop |
| Agent-specific organisms | `{agents:['ebs']}` | the agent's own code (Juglans) | `ContextBar`, `PiiInterstitial`, `FollowupCard` |

**Promotion rule:** a component graduates into Kernel only when a **2nd agent** needs it. `scope` is the
dial — `agents:['ebs']` stays local; `agents:['ebs','triage']` is a promotion candidate; `global` is in
Kernel.

**Tokens absorb per-agent variation so components don't fork.** A new agent's different accent or extra
semantic color is a **brand/theme token set** (Kernel already does multi-brand) or an **agent-scoped
semantic token** delegated to the `kernel-tokens` skill, applied at the agent root. The *same* `Banner`
renders agent B's palette through the cascade; you widen `tone`'s value union without touching Banner's
code. A component per agent is the drift this Standard exists to prevent, multiplied.

**Scope rules (enforced by the catalog gate):** a `global` component may not import an `agents:[…]` one
(no upward dependency); two agent-scoped components resolving to the same tokens + anatomy are flagged as
a promotion candidate (cross-agent drift); `scope` must be present and honest.

## 6. The `composes` contract

`composes:` lists every design-system component a component uses. A component that renders `krnl-*`
markup but declares `composes: []` is **provably drifting** — the single most machine-detectable signal.
The catalog gate treats a false `composes` as an error.
