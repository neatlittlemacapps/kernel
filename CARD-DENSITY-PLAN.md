# Card density unification — implementation spec

**Status:** Plan (authored by Opus), ready to hand to Sonnet.
**Target:** `kernel` @ `main` (823a15d).
**Skill:** `kernel-components` (no token changes — this reuses the existing density token scale).

---

## 0. Goal

Card has **three overlapping density controls**. Collapse them into **one** `density` prop that
uses the canonical token density scale, keeping the old two as **deprecated, non-breaking aliases**.

| Today | Problem |
|---|---|
| `size` = `sm \| md \| lg` → `.krnl-card--sm/lg` padding-only classes | A *parallel* spacing system — the exact anti-pattern `dense`'s own docs warn against. Only changes padding. |
| `dense` = bool → `data-density="compact"` | The *canonical* density scope (reshapes padding/radius/gap via `--density-*`). |
| token scale `compact \| comfortable \| spacious` (`[data-density=…]`) | The real system both of the above are half-reimplementing. |

**After:** one `density: 'compact' | 'comfortable' | 'spacious'` prop → sets `data-density` on the card
root (the sanctioned mechanism). `size` and `dense` remain as deprecated aliases so nothing breaks.

---

## 1. Why this is safe (value mapping is near-lossless)

`data-density` values already exist and map cleanly onto the old `size` steps — verified against
`tokens/tokens.css`:

| old `size` | → `density` | old padding | new `--density-card-pad` | match |
|---|---|---|---|---|
| `sm` | `compact` | `space-3` (12px) | `space-3` (12px) | **exact** (+ tighter radius/gap) |
| `md` (default) | `comfortable` | `space-4` (16px) | `space-4` (16px) | **exact** |
| `lg` | `spacious` | `space-6` (24px) | `space-5` (20px) | close (−4px; **no consumers use `lg`**) |

**Downstream:** greenhouse uses only `size="sm"` (3 files: `Prescribe.jsx`, `Juglans.jsx`,
`clinical/answer.jsx`). Via the alias `sm→compact`, those keep the **same 12px padding** and merely gain
compact radius/gap — a minor, arguably-nicer shift, not a regression. `dense` has **no** consumers in
kernel/greenhouse/grove. So this is non-breaking and needs no greenhouse change (though greenhouse may
later migrate `size="sm"` → `density="compact"` for clarity).

---

## 2. The new prop

- **`density`** — `'compact' | 'comfortable' | 'spacious'`. **No default / omit = inherit ambient
  density.** When set, it pins the card's density by writing `data-density` on the root; when omitted,
  no attribute is written, so the card inherits any ancestor density scope (preserving today's
  `dense={false}` behaviour). Do **not** default it to `'comfortable'` — that would pin every card and
  break ambient inheritance.

### Resolution + precedence (top of the Card function)

```js
const SIZE_TO_DENSITY = { sm: 'compact', md: 'comfortable', lg: 'spacious' };
// explicit `density` wins; then deprecated `size`; then deprecated `dense`; else undefined (inherit).
const resolvedDensity = density
  ?? (size != null ? SIZE_TO_DENSITY[size] : undefined)
  ?? (dense ? 'compact' : undefined);
```

- **Change `size`'s default to `undefined`** (it is `'md'` today). If it stays `'md'`, every card would
  resolve to `comfortable` and lose ambient inheritance. `size` only maps when a consumer explicitly
  passes it.
- Write `data-density={resolvedDensity || undefined}` in `dataAttrs` (replacing the current
  `data-density: dense ? 'compact' : undefined`).

---

## 3. Files to change

### `src/components/Card.jsx`
1. Signature: add `density`; keep `size` (default → **remove the `= 'md'`**, make it `undefined`) and
   `dense` as deprecated.
2. Delete the `size !== 'md' && \`krnl-card--${size}\`` entry from the `cls` array (no more
   `krnl-card--sm/lg`).
3. Add the `resolvedDensity` resolution (§2) and set `data-density={resolvedDensity || undefined}` in
   `dataAttrs` (remove the old `dense`-based `data-density`).
4. **Meta:**
   - Add `density`: `{ name: 'density', class: 'dsPresentation', values: ['compact','comfortable','spacious'], description: 'Density scope: sets data-density on the card root, reshaping padding/radius/gap via the --density-* tokens. Omit to inherit the ambient density of an enclosing [data-density] scope.' }`
   - `size` → `deprecated: true`, description: `'Deprecated - use `density`. sm→compact, md→comfortable, lg→spacious (maps onto the canonical density scale instead of a parallel padding-only system).'`
   - `dense` → `deprecated: true`, description: `'Deprecated - use density="compact".'`
   - Update the `usage` snippet if it references `size`/`dense`.

### `src/styles.css`
5. **Remove** `.krnl-card--sm { padding: var(--space-3); }` and `.krnl-card--lg { padding: var(--space-6); }`
   (lines ~1056–1057). The density now flows entirely through `data-density` reshaping `--density-card-pad`
   (which the base `.krnl-card { padding: var(--density-card-pad) }` already reads). Grep first to
   confirm no other rule depends on `--sm/--lg`.

### `src/stories/Card.stories.jsx`
6. Replace the `size` argType/control with `density` (`select`, options `['compact','comfortable','spacious']`,
   no default). Remove `size` from `Playground` args; add `density` (leave unset or `'comfortable'` for the
   demo). Update any story that passed `size`.
7. Keep a small **deprecated-alias** cell (in Chrome Matrix or a note) showing `size="sm"` / `dense` still
   render (→ compact), so the back-compat path is visible.

---

## 4. Acceptance criteria

- [ ] `<Card density="compact">` renders tighter padding **and** radius/gap than default; `spacious` looser;
      omitting `density` inherits an ancestor `[data-density]` scope (ambient), matching old `dense={false}`.
- [ ] `<Card size="sm">` still renders (deprecated → `data-density="compact"`), with **12px padding
      unchanged** from before (space-3). `<Card dense>` still renders (→ compact).
- [ ] Explicit `density` overrides `size`/`dense` when both are passed.
- [ ] No `.krnl-card--sm`/`--lg` classes emitted or referenced anywhere.
- [ ] greenhouse still builds against the local symlinked kernel (the 3 `size="sm"` cards look the same
      padding-wise). Do **not** edit greenhouse in this change — just don't break it.
- [ ] `npm run catalog` fresh; `npm run gate` 0 errors (density prop has a description; deprecated props
      carry `deprecated: true`); `npm run test` green; `node bin/kernel.mjs doctor --json` ok.
- [ ] Storybook visual check: Playground density control switches padding/radius/gap live.

---

## 5. Scope fence / notes

- **Banner** has its own `dense` bool (→ `data-density="compact"`), which is already canonical. For
  family consistency it *could* also gain a `density` prop — **out of scope here**; note as a follow-up so
  Card and Banner stay aligned. Do not change Banner in this pass.
- **No token changes** — the `compact/comfortable/spacious` scale and `--density-*` tokens already exist.
  Do not touch `tokens/`.
- **Do not** delete the deprecated `size`/`dense` props — they stay (aliased) until a later cleanup, same
  deprecate-not-break policy used for the clinical slice.
- Backlog (file in AD, labels `kernel`+`components`, no BACKLOG.md): "Card: unify size/dense → density
  (deprecate aliases)"; and a follow-up "Banner: add `density` prop to match Card".
