# Design tokens — Corilus Companion

_Last regenerated: 2026-06-18._
_Spec: W3C Design Tokens 2025.10._  
_Discovered: 772 tokens across 23 file(s); 1 resolver(s)._

This document is the canonical reference for the token system. It is regenerated automatically — do not hand-edit; instead update the source `.tokens.json` files and re-run `scripts/generate_docs.py`.

> **Looking for which token to use where?** See [USAGE.md](./USAGE.md) — it maps each component family (forms, buttons, surfaces, feedback, data, navigation, typography) to the recommended tokens from this system, with ready-to-paste CSS variable snippets.

## How to use this document

Looking for a token to apply to your component? Skip to the **Families** section below. Each family lists the components that belong to it and the tokens they share. Don't pick a token from a different family unless it's an explicit cross-family shared token (e.g. focus-ring color). When in doubt, alias through the semantic tier rather than reaching deeper into the base.

## Tier overview

Tokens flow downward through three tiers:

```
base (primitives)       ← raw values
  ↓
alias / semantic        ← intent, theme-aware
  ↓
component               ← scoped to components/families
```

A component MUST NOT reference a base token directly — always go through semantic. A base token MUST NOT reference another base token.

## Modes and brands

- **`brand` modifier** — contexts: `corilus, myneva, semble` (default: `corilus`). Brand identity — the single chokepoint for colour, radius and font. Resolves BEFORE theme so the semantic layer (and theme's dark deltas) re-resolve against the chosen brand. Each non-default brand is additive over Corilus (Corilus loaded first as the base, then the brand deltas) — the same pattern as dark-over-light. To add a brand, drop in brand/{name}.tokens.json and add a context here that loads corilus first, then the new file.
- **`theme` modifier** — contexts: `dark, light` (default: `light`). Visual mode. Dark is additive over light.
- **`breakpoint` modifier** — contexts: `desktop, mobile, tablet` (default: `desktop`)
- **`density` modifier** — contexts: `comfortable, compact, spacious` (default: `comfortable`)

- **Resolution order:** 8 step(s) — sets first, modifiers, then component-tier overrides last (typical).

## Families

Components in the same family share measurements and states. When changing a token, identify its family first — the cascade will touch every member.

### Buttons

_See [USAGE.md#buttons](./USAGE.md#buttons) for usage recommendations and CSS snippets._

_18 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `button.disabled.background` | color | `{state.disabled.surface}` |  |
| `button.disabled.text` | color | `{state.disabled.text}` |  |
| `button.error.background` | color | `{status.error.solid}` |  |
| `button.error.text` | color | `{status.error.on}` |  |
| `button.focus-ring` | color | `{focus.ring}` |  |
| `button.info.background` | color | `{status.info.solid}` |  |
| `button.info.text` | color | `{status.info.on}` |  |
| `button.primary.background` | color | `{action.solid}` |  |
| `button.primary.text` | color | `{action.on}` |  |
| `button.secondary.background` | color | `{surface.none}` |  |
| `button.secondary.border` | color | `{action.accent}` |  |
| `button.secondary.text` | color | `{action.quiet}` |  |
| `button.success.background` | color | `{status.success.solid}` |  |
| `button.success.text` | color | `{status.success.on}` |  |
| `button.tertiary.background` | color | `{surface.none}` |  |
| `button.tertiary.text` | color | `{action.quiet}` |  |
| `button.warning.background` | color | `{status.warning.solid}` |  |
| `button.warning.text` | color | `{status.warning.on}` |  |

### Surfaces

_See [USAGE.md#surfaces](./USAGE.md#surfaces) for usage recommendations and CSS snippets._

_22 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `brand.neutral.panel` | color | `{brand.fill.50}` |  |
| `card.accent-rule.height` | dimension | `4px` | Was 3px; bumped for confidence. |
| `card.accent-rule.tab-width` | dimension | `66px` | Stripe extends roughly 2/3 of the card width at default min — actual length set via min(tab-width-pct, container-width). |
| `card.accent-rule.tab-width-pct` | number | `0.66` | Stripe extent as fraction of card width. Consumer CSS does width: calc(100% * var(...)). |
| `card.padding` | dimension | `20px` | Generous padding (was 16) — Clinical Almanac aesthetic favours breathing room. |
| `elevation.modal` | shadow | `array[2]` |  |
| `elevation.modal` | shadow | `array[2]` |  |
| `inverted.surface` | color | `{brand.neutral.paper}` |  |
| `inverted.surface` | color | `{brand.fill.950}` |  |
| `state.disabled.surface` | color | `{brand.fill.700}` |  |
| `state.disabled.surface` | color | `{brand.neutral.muted-light}` |  |
| `state.selected.surface` | color | `{brand.tint.strong}` |  |
| `state.selected.surface` | color | `{brand.tint.soft}` | Background of a selected row, tab, menu item (brand-tinted). |
| `surface.none` | color | `{color.transparent}` |  |
| `surface.page` | color | `{brand.fill.950}` |  |
| `surface.page` | color | `{brand.neutral.paper}` |  |
| `surface.panel` | color | `{brand.fill.900}` |  |
| `surface.panel` | color | `{brand.neutral.panel}` |  |
| `surface.raised` | color | `{brand.fill.800}` |  |
| `surface.raised` | color | `{brand.neutral.panel-raised}` |  |
| `surface.sunken` | color | `{brand.fill.700}` |  |
| `surface.sunken` | color | `{brand.neutral.panel-sunken}` |  |

### Data display

_See [USAGE.md#data](./USAGE.md#data) for usage recommendations and CSS snippets._

_20 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `brand.data.1` | color | `{color.teal.500}` |  |
| `brand.data.2` | color | `{color.indigo.500}` |  |
| `brand.data.3` | color | `{color.violet.500}` |  |
| `brand.data.4` | color | `{color.magenta.500}` |  |
| `brand.data.5` | color | `{color.amber.500}` |  |
| `brand.data.6` | color | `{color.lime.500}` |  |
| `chart.grid` | color | `{brand.ink.800}` |  |
| `chart.grid` | color | `{brand.ink.400}` |  |
| `data.series-1` | color | `{brand.data-bright.1}` |  |
| `data.series-1` | color | `{brand.data.1}` |  |
| `data.series-2` | color | `{brand.data-bright.2}` |  |
| `data.series-2` | color | `{brand.data.2}` |  |
| `data.series-3` | color | `{brand.data-bright.3}` |  |
| `data.series-3` | color | `{brand.data.3}` |  |
| `data.series-4` | color | `{brand.data-bright.4}` |  |
| `data.series-4` | color | `{brand.data.4}` |  |
| `data.series-5` | color | `{brand.data-bright.5}` |  |
| `data.series-5` | color | `{brand.data.5}` |  |
| `data.series-6` | color | `{brand.data-bright.6}` |  |
| `data.series-6` | color | `{brand.data.6}` |  |

### Typography

_See [USAGE.md#typography](./USAGE.md#typography) for usage recommendations and CSS snippets._

_56 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `type.leading.none` | number | `1.0` |  |
| `type.leading.normal` | number | `1.5` |  |
| `type.leading.relaxed` | number | `1.65` |  |
| `type.leading.snug` | number | `1.3` |  |
| `type.leading.tight` | number | `1.15` |  |
| `type.size.2xl` | dimension | `28px` |  |
| `type.size.2xl` | dimension | `23px` |  |
| `type.size.2xl` | dimension | `26px` |  |
| `type.size.2xs` | dimension | `9px` |  |
| `type.size.2xs` | dimension | `9px` |  |
| `type.size.2xs` | dimension | `9px` |  |
| `type.size.3xl` | dimension | `33px` |  |
| `type.size.3xl` | dimension | `27px` |  |
| `type.size.3xl` | dimension | `30px` |  |
| `type.size.4xl` | dimension | `40px` |  |
| `type.size.4xl` | dimension | `32px` |  |
| `type.size.4xl` | dimension | `36px` |  |
| `type.size.base` | dimension | `16px` |  |
| `type.size.base` | dimension | `16px` |  |
| `type.size.base` | dimension | `16px` |  |
| `type.size.lg` | dimension | `19px` |  |
| `type.size.lg` | dimension | `18px` |  |
| `type.size.lg` | dimension | `18px` |  |
| `type.size.sm` | dimension | `13px` |  |
| `type.size.sm` | dimension | `13px` |  |
| `type.size.sm` | dimension | `13px` |  |
| `type.size.xl` | dimension | `23px` |  |
| `type.size.xl` | dimension | `20px` |  |
| `type.size.xl` | dimension | `21px` |  |
| `type.size.xs` | dimension | `11px` |  |
| `type.size.xs` | dimension | `11px` |  |
| `type.size.xs` | dimension | `11px` |  |
| `type.tracking.normal` | dimension | `0px` |  |
| `type.tracking.tight` | dimension | `-0.5px` |  |
| `type.tracking.wide` | dimension | `0.5px` |  |
| `type.tracking.wider` | dimension | `0.8px` |  |
| `type.weight.bold` | fontWeight | `bold` |  |
| `type.weight.medium` | fontWeight | `medium` |  |
| `type.weight.regular` | fontWeight | `regular` |  |
| `type.weight.semibold` | fontWeight | `semi-bold` |  |
| `typography.body.lg` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.lg}","fontWeight":"{type.weight.regular}","lineHeight":"{type.leading.normal}"}` |  |
| `typography.body.md` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.base}","fontWeight":"{type.weight.regular}","lineHeight":"{type.leading.normal}"}` |  |
| `typography.body.sm` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.sm}","fontWeight":"{type.weight.regular}","lineHeight":"{type.leading.normal}"}` |  |
| `typography.caption.md` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.xs}","fontWeight":"{type.weight.regular}","lineHeight":"{type.leading.snug}"}` |  |
| `typography.caption.sm` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.2xs}","fontWeight":"{type.weight.medium}","lineHeight":"{type.leading.snug}"}` |  |
| `typography.display` | typography | `{"fontFamily":"{font.heading}","fontSize":"{type.size.4xl}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.none}"}` |  |
| `typography.heading.lg` | typography | `{"fontFamily":"{font.heading}","fontSize":"{type.size.2xl}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.tight}"}` |  |
| `typography.heading.md` | typography | `{"fontFamily":"{font.heading}","fontSize":"{type.size.xl}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.tight}"}` |  |
| `typography.heading.sm` | typography | `{"fontFamily":"{font.heading}","fontSize":"{type.size.lg}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.snug}"}` |  |
| `typography.label.lg` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.base}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.snug}"}` |  |
| `typography.label.md` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.sm}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.snug}"}` |  |
| `typography.label.sm` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.xs}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.tight}"}` |  |
| `typography.micro` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.2xs}","fontWeight":"{type.weight.bold}","lineHeight":"{type.leading.none}"}` |  |
| `typography.overline` | typography | `{"fontFamily":"{font.body}","fontSize":"{type.size.xs}","fontWeight":"{type.weight.bold}","lineHeight":"{type.leading.tight}"}` |  |
| `typography.title.md` | typography | `{"fontFamily":"{font.heading}","fontSize":"{type.size.base}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.snug}"}` |  |
| `typography.title.sm` | typography | `{"fontFamily":"{font.heading}","fontSize":"{type.size.sm}","fontWeight":"{type.weight.semibold}","lineHeight":"{type.leading.snug}"}` |  |

### Base / color

_193 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `color.alpha.black-06` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.black-10` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.black-12` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.black-18` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.black-24` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.black-30` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.black-55` | color | `srgb(0.0784, 0.0784, 0.0784)` (`#141414`) |  |
| `color.alpha.white-08` | color | `srgb(1, 1, 1)` (`#ffffff`) |  |
| `color.alpha.white-16` | color | `srgb(1, 1, 1)` (`#ffffff`) |  |
| `color.amber.100` | color | `oklch(0.936, 0.0523, 75.0)` (`#ffe6c4`) |  |
| `color.amber.200` | color | `oklch(0.881, 0.1005, 75.0)` (`#ffcf8c`) |  |
| `color.amber.300` | color | `oklch(0.827, 0.1512, 75.0)` (`#ffb743`) |  |
| `color.amber.400` | color | `oklch(0.742, 0.1565, 75.0)` (`#e49b00`) |  |
| `color.amber.50` | color | `oklch(0.978, 0.0175, 75.0)` (`#fff6eb`) |  |
| `color.amber.500` | color | `oklch(0.648, 0.1367, 75.0)` (`#be8000`) |  |
| `color.amber.600` | color | `oklch(0.573, 0.1209, 75.0)` (`#a16c00`) |  |
| `color.amber.700` | color | `oklch(0.469, 0.0989, 75.0)` (`#7a5100`) |  |
| `color.amber.800` | color | `oklch(0.394, 0.0831, 75.0)` (`#603e00`) |  |
| `color.amber.900` | color | `oklch(0.32, 0.0675, 75.0)` (`#472d00`) |  |
| `color.amber.950` | color | `oklch(0.238, 0.0502, 75.0)` (`#2c1b00`) |  |
| `color.coral.100` | color | `oklch(0.936, 0.0324, 15.0)` (`#ffe2e3`) |  |
| `color.coral.200` | color | `oklch(0.881, 0.0635, 15.0)` (`#ffc7ca`) |  |
| `color.coral.300` | color | `oklch(0.827, 0.0973, 15.0)` (`#ffacb2`) |  |
| `color.coral.400` | color | `oklch(0.742, 0.1588, 15.0)` (`#ff7d8b`) |  |
| `color.coral.50` | color | `oklch(0.978, 0.0108, 15.0)` (`#fff5f5`) |  |
| `color.coral.500` | color | `oklch(0.648, 0.2418, 15.0)` (`#ff275d`) |  |
| `color.coral.600` | color | `oklch(0.573, 0.2291, 15.0)` (`#de004a`) |  |
| `color.coral.700` | color | `oklch(0.469, 0.1875, 15.0)` (`#aa0037`) |  |
| `color.coral.800` | color | `oklch(0.394, 0.1575, 15.0)` (`#860029`) |  |
| `color.coral.900` | color | `oklch(0.32, 0.1279, 15.0)` (`#64001d`) |  |
| `color.coral.950` | color | `oklch(0.238, 0.0952, 15.0)` (`#41000f`) |  |
| `color.graphite.0` | color | `oklch(1.0, 0.0, none)` (`#ffffff`) |  |
| `color.graphite.100` | color | `oklch(0.936, 0.0, none)` (`#eaeaea`) |  |
| `color.graphite.1000` | color | `oklch(0.0, 0.0, none)` (`#000000`) |  |
| `color.graphite.200` | color | `oklch(0.881, 0.0, none)` (`#d8d8d8`) |  |
| `color.graphite.300` | color | `oklch(0.827, 0.0, none)` (`#c6c6c6`) |  |
| `color.graphite.400` | color | `oklch(0.742, 0.0, none)` (`#ababab`) |  |
| `color.graphite.50` | color | `oklch(0.978, 0.0, none)` (`#f8f8f8`) |  |
| `color.graphite.500` | color | `oklch(0.648, 0.0, none)` (`#8e8e8e`) |  |
| `color.graphite.600` | color | `oklch(0.573, 0.0, none)` (`#787878`) |  |
| `color.graphite.700` | color | `oklch(0.469, 0.0, none)` (`#5a5a5a`) |  |
| `color.graphite.800` | color | `oklch(0.394, 0.0, none)` (`#464646`) |  |
| `color.graphite.900` | color | `oklch(0.32, 0.0, none)` (`#333333`) |  |
| `color.graphite.950` | color | `oklch(0.238, 0.0, none)` (`#1f1f1f`) |  |
| `color.green.100` | color | `oklch(0.936, 0.1117, 148.0)` (`#b6ffc0`) |  |
| `color.green.200` | color | `oklch(0.881, 0.2305, 148.0)` (`#46ff78`) |  |
| `color.green.300` | color | `oklch(0.827, 0.2394, 148.0)` (`#00ee61`) |  |
| `color.green.400` | color | `oklch(0.742, 0.2148, 148.0)` (`#00ce53`) |  |
| `color.green.50` | color | `oklch(0.978, 0.0358, 148.0)` (`#e8ffeb`) |  |
| `color.green.500` | color | `oklch(0.648, 0.1876, 148.0)` (`#00ac44`) |  |
| `color.green.600` | color | `oklch(0.573, 0.1658, 148.0)` (`#009138`) |  |
| `color.green.700` | color | `oklch(0.469, 0.1357, 148.0)` (`#006e29`) |  |
| `color.green.800` | color | `oklch(0.394, 0.114, 148.0)` (`#00561e`) |  |
| `color.green.900` | color | `oklch(0.32, 0.0926, 148.0)` (`#003f14`) |  |
| `color.green.950` | color | `oklch(0.238, 0.0689, 148.0)` (`#002709`) |  |
| `color.indigo.100` | color | `oklch(0.936, 0.0303, 267.0)` (`#e1eaff`) |  |
| `color.indigo.200` | color | `oklch(0.881, 0.0577, 267.0)` (`#c7d8ff`) |  |
| `color.indigo.300` | color | `oklch(0.827, 0.0857, 267.0)` (`#adc5ff`) |  |
| `color.indigo.400` | color | `oklch(0.742, 0.1321, 267.0)` (`#86a8ff`) |  |
| `color.indigo.50` | color | `oklch(0.978, 0.0103, 267.0)` (`#f5f8ff`) |  |
| `color.indigo.500` | color | `oklch(0.648, 0.187, 267.0)` (`#5b85ff`) |  |
| `color.indigo.600` | color | `oklch(0.573, 0.2334, 267.0)` (`#3c65ff`) |  |
| `color.indigo.700` | color | `oklch(0.469, 0.3014, 267.0)` (`#201aff`) |  |
| `color.indigo.800` | color | `oklch(0.394, 0.2654, 267.0)` (`#1800d1`) |  |
| `color.indigo.900` | color | `oklch(0.32, 0.2155, 267.0)` (`#0f009e`) |  |
| `color.indigo.950` | color | `oklch(0.238, 0.1603, 267.0)` (`#060069`) |  |
| `color.lime.100` | color | `oklch(0.936, 0.1586, 130.0)` (`#c6ff89`) |  |
| `color.lime.200` | color | `oklch(0.881, 0.2371, 130.0)` (`#a2f400`) |  |
| `color.lime.300` | color | `oklch(0.827, 0.2226, 130.0)` (`#95e100`) |  |
| `color.lime.400` | color | `oklch(0.742, 0.1997, 130.0)` (`#80c200`) |  |
| `color.lime.50` | color | `oklch(0.978, 0.0483, 130.0)` (`#edffdd`) |  |
| `color.lime.500` | color | `oklch(0.648, 0.1744, 130.0)` (`#6aa200`) |  |
| `color.lime.600` | color | `oklch(0.573, 0.1542, 130.0)` (`#598900`) |  |
| `color.lime.700` | color | `oklch(0.469, 0.1262, 130.0)` (`#426700`) |  |
| `color.lime.800` | color | `oklch(0.394, 0.106, 130.0)` (`#325000`) |  |
| `color.lime.900` | color | `oklch(0.32, 0.0861, 130.0)` (`#243b00`) |  |
| `color.lime.950` | color | `oklch(0.238, 0.0641, 130.0)` (`#142400`) |  |
| `color.magenta.100` | color | `oklch(0.936, 0.039, 348.0)` (`#ffe0ee`) |  |
| `color.magenta.200` | color | `oklch(0.881, 0.0764, 348.0)` (`#ffc4e1`) |  |
| `color.magenta.300` | color | `oklch(0.827, 0.1174, 348.0)` (`#ffa7d4`) |  |
| `color.magenta.400` | color | `oklch(0.742, 0.1925, 348.0)` (`#ff71c1`) |  |
| `color.magenta.50` | color | `oklch(0.978, 0.0129, 348.0)` (`#fff4f9`) |  |
| `color.magenta.500` | color | `oklch(0.648, 0.2723, 348.0)` (`#f800ab`) |  |
| `color.magenta.600` | color | `oklch(0.573, 0.2408, 348.0)` (`#d30091`) |  |
| `color.magenta.700` | color | `oklch(0.469, 0.1971, 348.0)` (`#a1006d`) |  |
| `color.magenta.800` | color | `oklch(0.394, 0.1656, 348.0)` (`#7f0055`) |  |
| `color.magenta.900` | color | `oklch(0.32, 0.1345, 348.0)` (`#5e003f`) |  |
| `color.magenta.950` | color | `oklch(0.238, 0.1, 348.0)` (`#3d0027`) |  |
| `color.mint.100` | color | `oklch(0.936, 0.0941, 173.0)` (`#a6ffe4`) |  |
| `color.mint.200` | color | `oklch(0.881, 0.1692, 173.0)` (`#00fbcd`) |  |
| `color.mint.300` | color | `oklch(0.827, 0.1588, 173.0)` (`#00e7bc`) |  |
| `color.mint.400` | color | `oklch(0.742, 0.1425, 173.0)` (`#00c8a3`) |  |
| `color.mint.50` | color | `oklch(0.978, 0.0305, 173.0)` (`#e4fff6`) |  |
| `color.mint.500` | color | `oklch(0.648, 0.1244, 173.0)` (`#00a787`) |  |
| `color.mint.600` | color | `oklch(0.573, 0.11, 173.0)` (`#008d72`) |  |
| `color.mint.700` | color | `oklch(0.469, 0.0901, 173.0)` (`#006b56`) |  |
| `color.mint.800` | color | `oklch(0.394, 0.0757, 173.0)` (`#005342`) |  |
| `color.mint.900` | color | `oklch(0.32, 0.0614, 173.0)` (`#003d30`) |  |
| `color.mint.950` | color | `oklch(0.238, 0.0457, 173.0)` (`#00261d`) |  |
| `color.red.100` | color | `oklch(0.936, 0.0322, 25.0)` (`#ffe2df`) |  |
| `color.red.200` | color | `oklch(0.881, 0.0629, 25.0)` (`#ffc9c3`) |  |
| `color.red.300` | color | `oklch(0.827, 0.0963, 25.0)` (`#ffaea7`) |  |
| `color.red.400` | color | `oklch(0.742, 0.1567, 25.0)` (`#ff7f78`) |  |
| `color.red.50` | color | `oklch(0.978, 0.0107, 25.0)` (`#fff5f4`) |  |
| `color.red.500` | color | `oklch(0.648, 0.2378, 25.0)` (`#ff303b`) |  |
| `color.red.600` | color | `oklch(0.573, 0.2323, 25.0)` (`#e10025`) |  |
| `color.red.700` | color | `oklch(0.469, 0.1901, 25.0)` (`#ac001a`) |  |
| `color.red.800` | color | `oklch(0.394, 0.1597, 25.0)` (`#880012`) |  |
| `color.red.900` | color | `oklch(0.32, 0.1297, 25.0)` (`#65000b`) |  |
| `color.red.950` | color | `oklch(0.238, 0.0965, 25.0)` (`#420004`) |  |
| `color.rust.100` | color | `oklch(0.936, 0.0329, 35.0)` (`#ffe3db`) |  |
| `color.rust.200` | color | `oklch(0.881, 0.0642, 35.0)` (`#ffcabc`) |  |
| `color.rust.300` | color | `oklch(0.827, 0.0981, 35.0)` (`#ffb09b`) |  |
| `color.rust.400` | color | `oklch(0.742, 0.1592, 35.0)` (`#ff8263`) |  |
| `color.rust.50` | color | `oklch(0.978, 0.0109, 35.0)` (`#fff5f3`) |  |
| `color.rust.500` | color | `oklch(0.648, 0.2273, 35.0)` (`#fa4100`) |  |
| `color.rust.600` | color | `oklch(0.573, 0.201, 35.0)` (`#d43600`) |  |
| `color.rust.700` | color | `oklch(0.469, 0.1645, 35.0)` (`#a22700`) |  |
| `color.rust.800` | color | `oklch(0.394, 0.1382, 35.0)` (`#801d00`) |  |
| `color.rust.900` | color | `oklch(0.32, 0.1123, 35.0)` (`#5f1300`) |  |
| `color.rust.950` | color | `oklch(0.238, 0.0835, 35.0)` (`#3d0900`) |  |
| `color.sage.100` | color | `oklch(0.936, 0.0025, 169.0)` (`#e8eae9`) |  |
| `color.sage.200` | color | `oklch(0.881, 0.0035, 169.0)` (`#d6d8d7`) |  |
| `color.sage.25` | color | `oklch(0.988, 0.002, 169.0)` (`#fafbfb`) |  |
| `color.sage.300` | color | `oklch(0.827, 0.0045, 169.0)` (`#c4c7c6`) |  |
| `color.sage.400` | color | `oklch(0.742, 0.005, 169.0)` (`#a8acab`) |  |
| `color.sage.50` | color | `oklch(0.978, 0.002, 169.0)` (`#f6f8f7`) |  |
| `color.sage.500` | color | `oklch(0.648, 0.0055, 169.0)` (`#8b908e`) |  |
| `color.sage.600` | color | `oklch(0.573, 0.006, 169.0)` (`#757978`) |  |
| `color.sage.700` | color | `oklch(0.469, 0.006, 169.0)` (`#575c5a`) |  |
| `color.sage.800` | color | `oklch(0.394, 0.0055, 169.0)` (`#434745`) |  |
| `color.sage.900` | color | `oklch(0.32, 0.005, 169.0)` (`#303432`) |  |
| `color.sage.950` | color | `oklch(0.238, 0.0045, 169.0)` (`#1d1f1e`) |  |
| `color.sky.100` | color | `oklch(0.936, 0.04, 227.0)` (`#cff0ff`) |  |
| `color.sky.200` | color | `oklch(0.881, 0.076, 227.0)` (`#a2e3ff`) |  |
| `color.sky.300` | color | `oklch(0.827, 0.1126, 227.0)` (`#6ed5ff`) |  |
| `color.sky.400` | color | `oklch(0.742, 0.1433, 227.0)` (`#00bcf1`) |  |
| `color.sky.50` | color | `oklch(0.978, 0.0136, 227.0)` (`#effaff`) |  |
| `color.sky.500` | color | `oklch(0.648, 0.1251, 227.0)` (`#009dc9`) |  |
| `color.sky.600` | color | `oklch(0.573, 0.1106, 227.0)` (`#0084ab`) |  |
| `color.sky.700` | color | `oklch(0.469, 0.0905, 227.0)` (`#006482`) |  |
| `color.sky.800` | color | `oklch(0.394, 0.0761, 227.0)` (`#004e66`) |  |
| `color.sky.900` | color | `oklch(0.32, 0.0618, 227.0)` (`#00394b`) |  |
| `color.sky.950` | color | `oklch(0.238, 0.046, 227.0)` (`#002330`) |  |
| `color.slate.100` | color | `oklch(0.936, 0.005, 219.0)` (`#e6ebec`) |  |
| `color.slate.200` | color | `oklch(0.881, 0.007, 219.0)` (`#d3d9db`) |  |
| `color.slate.25` | color | `oklch(0.988, 0.004, 219.0)` (`#f8fcfd`) |  |
| `color.slate.300` | color | `oklch(0.827, 0.009, 219.0)` (`#c0c8ca`) |  |
| `color.slate.400` | color | `oklch(0.742, 0.01, 219.0)` (`#a5adb0`) |  |
| `color.slate.50` | color | `oklch(0.978, 0.004, 219.0)` (`#f5f8fa`) |  |
| `color.slate.500` | color | `oklch(0.648, 0.011, 219.0)` (`#889093`) |  |
| `color.slate.600` | color | `oklch(0.573, 0.012, 219.0)` (`#717a7d`) |  |
| `color.slate.700` | color | `oklch(0.469, 0.012, 219.0)` (`#535c5f`) |  |
| `color.slate.800` | color | `oklch(0.394, 0.011, 219.0)` (`#40484a`) |  |
| `color.slate.900` | color | `oklch(0.32, 0.01, 219.0)` (`#2d3436`) |  |
| `color.slate.950` | color | `oklch(0.238, 0.009, 219.0)` (`#1a2022`) |  |
| `color.taupe.100` | color | `oklch(0.936, 0.0025, 39.0)` (`#ebe9e8`) |  |
| `color.taupe.200` | color | `oklch(0.881, 0.0035, 39.0)` (`#dad7d6`) |  |
| `color.taupe.25` | color | `oklch(0.988, 0.002, 39.0)` (`#fcfbfa`) |  |
| `color.taupe.300` | color | `oklch(0.827, 0.0045, 39.0)` (`#c9c5c4`) |  |
| `color.taupe.400` | color | `oklch(0.742, 0.005, 39.0)` (`#aeaaa9`) |  |
| `color.taupe.50` | color | `oklch(0.978, 0.002, 39.0)` (`#f9f7f7`) |  |
| `color.taupe.500` | color | `oklch(0.648, 0.0055, 39.0)` (`#928d8c`) |  |
| `color.taupe.600` | color | `oklch(0.573, 0.006, 39.0)` (`#7c7776`) |  |
| `color.taupe.700` | color | `oklch(0.469, 0.006, 39.0)` (`#5e5958`) |  |
| `color.taupe.800` | color | `oklch(0.394, 0.0055, 39.0)` (`#494544`) |  |
| `color.taupe.900` | color | `oklch(0.32, 0.005, 39.0)` (`#353231`) |  |
| `color.taupe.950` | color | `oklch(0.238, 0.0045, 39.0)` (`#211e1d`) |  |
| `color.teal.100` | color | `oklch(0.936, 0.0321, 219.0)` (`#d3f0f9`) |  |
| `color.teal.200` | color | `oklch(0.881, 0.0609, 219.0)` (`#abe2f3`) |  |
| `color.teal.300` | color | `oklch(0.827, 0.0908, 219.0)` (`#7ed5ee`) |  |
| `color.teal.400` | color | `oklch(0.742, 0.1342, 219.0)` (`#00bee4`) |  |
| `color.teal.50` | color | `oklch(0.978, 0.0108, 219.0)` (`#f0fafd`) |  |
| `color.teal.500` | color | `oklch(0.648, 0.1172, 219.0)` (`#009fbf`) |  |
| `color.teal.600` | color | `oklch(0.573, 0.1036, 219.0)` (`#0086a2`) |  |
| `color.teal.700` | color | `oklch(0.469, 0.0848, 219.0)` (`#00657b`) |  |
| `color.teal.800` | color | `oklch(0.394, 0.0713, 219.0)` (`#004f60`) |  |
| `color.teal.900` | color | `oklch(0.32, 0.0579, 219.0)` (`#003947`) |  |
| `color.teal.950` | color | `oklch(0.238, 0.043, 219.0)` (`#00232d`) |  |
| `color.tone-mix.tint` | number | `0.12` | Default tone tint — icon pill backings, edit-chip backings, soft hover surfaces. |
| `color.tone-mix.tint-strong` | number | `0.22` | Stronger tint — hover/active states over a tinted surface, selected rows. |
| `color.transparent` | color | `srgb(0, 0, 0)` (`#000000`) |  |
| `color.violet.100` | color | `oklch(0.936, 0.0417, 311.0)` (`#f3e3ff`) |  |
| `color.violet.200` | color | `oklch(0.881, 0.0794, 311.0)` (`#e9caff`) |  |
| `color.violet.300` | color | `oklch(0.827, 0.1181, 311.0)` (`#dfb0ff`) |  |
| `color.violet.400` | color | `oklch(0.742, 0.1829, 311.0)` (`#d086ff`) |  |
| `color.violet.50` | color | `oklch(0.978, 0.0141, 311.0)` (`#fbf5ff`) |  |
| `color.violet.500` | color | `oklch(0.648, 0.2599, 311.0)` (`#c04aff`) |  |
| `color.violet.600` | color | `oklch(0.573, 0.2883, 311.0)` (`#ad00f0`) |  |
| `color.violet.700` | color | `oklch(0.469, 0.2359, 311.0)` (`#8400b8`) |  |
| `color.violet.800` | color | `oklch(0.394, 0.1982, 311.0)` (`#670091`) |  |
| `color.violet.900` | color | `oklch(0.32, 0.161, 311.0)` (`#4c006d`) |  |
| `color.violet.950` | color | `oklch(0.238, 0.1197, 311.0)` (`#300047`) |  |

### Base / spacing

_11 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `density.gap` | dimension | `{space.3}` |  |
| `density.gap` | dimension | `{space.2}` |  |
| `density.gap` | dimension | `{space.4}` |  |
| `pill.gap` | dimension | `6px` | Inner gap (dot ↔ label, icon ↔ label). |
| `space.1` | dimension | `4px` |  |
| `space.2` | dimension | `8px` |  |
| `space.3` | dimension | `12px` |  |
| `space.4` | dimension | `16px` |  |
| `space.5` | dimension | `20px` |  |
| `space.6` | dimension | `24px` |  |
| `space.7` | dimension | `28px` |  |

### Base / radius

_20 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `brand.radius.base` | dimension | `{radius.md}` |  |
| `brand.radius.base` | dimension | `{radius.md}` |  |
| `brand.radius.base` | dimension | `{radius.none}` |  |
| `brand.radius.compact` | dimension | `{radius.sm}` |  |
| `brand.radius.compact` | dimension | `{radius.sm}` |  |
| `brand.radius.compact` | dimension | `{radius.none}` |  |
| `brand.radius.spacious` | dimension | `{radius.lg}` |  |
| `brand.radius.spacious` | dimension | `{radius.lg}` |  |
| `brand.radius.spacious` | dimension | `{radius.xs}` |  |
| `density.radius` | dimension | `{brand.radius.base}` |  |
| `density.radius` | dimension | `{brand.radius.compact}` |  |
| `density.radius` | dimension | `{brand.radius.spacious}` |  |
| `icon-pill.radius` | dimension | `10px` | Slightly softer than the chip pill — reads as a 'stamp', not a square. |
| `radius.lg` | dimension | `16px` |  |
| `radius.md` | dimension | `12px` |  |
| `radius.none` | dimension | `0px` | Square corners — for harsh/angular brands (e.g. Semble's brand radius). |
| `radius.pill` | dimension | `999px` |  |
| `radius.sm` | dimension | `8px` |  |
| `radius.xl` | dimension | `24px` |  |
| `radius.xs` | dimension | `4px` |  |

### Base / font

_9 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `density.font` | dimension | `14px` |  |
| `density.font` | dimension | `13px` |  |
| `density.font` | dimension | `15px` |  |
| `font.body` | fontFamily | `Corporate S Pro, ui-sans-serif, system-ui, sans-serif` |  |
| `font.body` | fontFamily | `Lato, Segoe UI, ui-sans-serif, system-ui, sans-serif` |  |
| `font.body` | fontFamily | `DM Sans, Segoe UI, ui-sans-serif, system-ui, sans-serif` |  |
| `font.heading` | fontFamily | `Corporate S Pro, ui-sans-serif, system-ui, sans-serif` |  |
| `font.heading` | fontFamily | `Lato, Segoe UI, ui-sans-serif, system-ui, sans-serif` |  |
| `font.heading` | fontFamily | `DM Sans, Segoe UI, ui-sans-serif, system-ui, sans-serif` |  |

### Base / motion

_20 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `motion.duration.100` | duration | `100ms` |  |
| `motion.duration.180` | duration | `180ms` |  |
| `motion.duration.260` | duration | `260ms` |  |
| `motion.duration.400` | duration | `400ms` |  |
| `motion.duration.600` | duration | `600ms` |  |
| `motion.duration.base` | duration | `{motion.duration.260}` | Default UI transitions — Seed→Sprout expand, default fades. |
| `motion.duration.crawl` | duration | `{motion.duration.600}` | Full-screen / route-level transitions. Rare. |
| `motion.duration.fast` | duration | `{motion.duration.180}` | Small state changes, button presses, focus rings. |
| `motion.duration.instant` | duration | `{motion.duration.100}` | Micro-interactions, pill toggles, hover-state changes. |
| `motion.duration.slow` | duration | `{motion.duration.400}` | Drawer / panel / dialog reveals. |
| `motion.easing.accelerate` | cubicBezier | `[0.3, 0, 1, 1]` | Speeds on exit — for leaving UI (modal out, drawer slide-out). |
| `motion.easing.accelerate` | cubicBezier | `{motion.easing.accelerate}` | Exiting UI. |
| `motion.easing.decelerate` | cubicBezier | `[0, 0, 0.2, 1]` | Slows on exit — for entering UI (modal in, drawer slide-in). |
| `motion.easing.decelerate` | cubicBezier | `{motion.easing.decelerate}` | Entering UI. |
| `motion.easing.emphasized` | cubicBezier | `[0.16, 1, 0.3, 1]` | Spring-ish — for container morphs, layout changes. |
| `motion.easing.emphasized` | cubicBezier | `{motion.easing.emphasized}` | Container morphs (e.g. sprout card growth). |
| `motion.easing.linear` | cubicBezier | `[0, 0, 1, 1]` | Constant velocity — only for progress indicators / loops. |
| `motion.easing.linear` | cubicBezier | `{motion.easing.linear}` | Constant velocity (progress indicators). |
| `motion.easing.standard` | cubicBezier | `[0.2, 0, 0, 1]` | Default UI easing. |
| `motion.easing.standard` | cubicBezier | `{motion.easing.standard}` | Default UI. |

### Other

_403 token(s)._

| Path | Type | Value | Description |
|------|------|-------|-------------|
| `action.accent` | color | `{brand.primary-bright}` | Emphasis/icon/accent-text colour. Brand-bright step so accents and icons meet AA on dark surfaces. |
| `action.accent` | color | `{brand.primary}` |  |
| `action.on` | color | `{brand.neutral.on-light}` |  |
| `action.quiet` | color | `{brand.fill.50}` | Outline/tertiary button text must be light on dark surfaces. |
| `action.quiet` | color | `{brand.neutral.ink}` |  |
| `action.solid` | color | `{brand.primary-deep}` |  |
| `ambient.alive` | color | `{brand.secondary}` |  |
| `border.subtle` | color | `{brand.fill.600}` | Hairline structure, lifted for clearer delineation on dark. Hairlines/dividers are decorative (WCAG-exempt). |
| `border.subtle` | color | `{brand.fill.200}` |  |
| `brand.accent.400` | color | `{color.lime.400}` |  |
| `brand.accent.400` | color | `{color.amber.400}` |  |
| `brand.accent.400` | color | `oklch(0.815, 0.154, 71.9)` (`#ffb03d`) |  |
| `brand.accent.700` | color | `{color.lime.700}` |  |
| `brand.accent.700` | color | `{color.amber.700}` |  |
| `brand.accent.700` | color | `oklch(0.55, 0.13, 72.0)` (`#9f6200`) |  |
| `brand.accent.950` | color | `{color.lime.950}` |  |
| `brand.accent.950` | color | `{color.amber.950}` |  |
| `brand.accent.950` | color | `oklch(0.32, 0.09, 72.0)` (`#4e2900`) |  |
| `brand.data-bright.1` | color | `{color.teal.400}` |  |
| `brand.data-bright.2` | color | `{color.indigo.400}` |  |
| `brand.data-bright.3` | color | `{color.violet.400}` |  |
| `brand.data-bright.4` | color | `{color.magenta.400}` |  |
| `brand.data-bright.5` | color | `{color.amber.400}` |  |
| `brand.data-bright.6` | color | `{color.lime.400}` |  |
| `brand.fill.100` | color | `{color.slate.100}` |  |
| `brand.fill.100` | color | `{color.taupe.100}` |  |
| `brand.fill.100` | color | `{color.sage.100}` |  |
| `brand.fill.200` | color | `{color.slate.200}` |  |
| `brand.fill.200` | color | `{color.taupe.200}` |  |
| `brand.fill.200` | color | `{color.sage.200}` |  |
| `brand.fill.25` | color | `{color.slate.25}` |  |
| `brand.fill.25` | color | `{color.taupe.25}` |  |
| `brand.fill.25` | color | `{color.sage.25}` |  |
| `brand.fill.300` | color | `{color.slate.300}` |  |
| `brand.fill.300` | color | `{color.taupe.300}` |  |
| `brand.fill.300` | color | `{color.sage.300}` |  |
| `brand.fill.50` | color | `{color.slate.50}` |  |
| `brand.fill.50` | color | `{color.taupe.50}` |  |
| `brand.fill.50` | color | `{color.sage.50}` |  |
| `brand.fill.600` | color | `{color.slate.600}` |  |
| `brand.fill.600` | color | `{color.taupe.600}` |  |
| `brand.fill.600` | color | `{color.sage.600}` |  |
| `brand.fill.700` | color | `{color.slate.700}` |  |
| `brand.fill.700` | color | `{color.taupe.700}` |  |
| `brand.fill.700` | color | `{color.sage.700}` |  |
| `brand.fill.800` | color | `{color.slate.800}` |  |
| `brand.fill.800` | color | `{color.taupe.800}` |  |
| `brand.fill.800` | color | `{color.sage.800}` |  |
| `brand.fill.900` | color | `{color.slate.900}` |  |
| `brand.fill.900` | color | `{color.taupe.900}` |  |
| `brand.fill.900` | color | `{color.sage.900}` |  |
| `brand.fill.950` | color | `{color.slate.950}` |  |
| `brand.fill.950` | color | `{color.taupe.950}` |  |
| `brand.fill.950` | color | `{color.sage.950}` |  |
| `brand.ink.0` | color | `{color.graphite.0}` |  |
| `brand.ink.100` | color | `{color.graphite.100}` |  |
| `brand.ink.300` | color | `{color.graphite.300}` |  |
| `brand.ink.400` | color | `{color.graphite.400}` |  |
| `brand.ink.500` | color | `{color.graphite.500}` |  |
| `brand.ink.600` | color | `{color.graphite.600}` |  |
| `brand.ink.700` | color | `{color.graphite.700}` |  |
| `brand.ink.800` | color | `{color.graphite.800}` |  |
| `brand.ink.950` | color | `{color.graphite.950}` |  |
| `brand.logo.angle` | number | `-52.3` | Brand gradient angle in degrees (CSS convention). |
| `brand.logo.angle` | number | `-52.3` | Brand gradient angle in degrees. |
| `brand.logo.angle` | number | `-52.3` | Brand gradient angle in degrees. |
| `brand.logo.from` | color | `oklch(0.7516, 0.1426, 225.17)` (`#00c0f2`) | Gradient start — Corilus light blue (#00c0f2). |
| `brand.logo.from` | color | `oklch(0.6728, 0.1766, 38.8)` (`#ed6739`) | myNeva brand orange (#ED6739). |
| `brand.logo.from` | color | `oklch(0.774, 0.141, 169.0)` (`#38d2a6`) | Shamrock. |
| `brand.logo.to` | color | `oklch(0.6645, 0.1872, 148.48)` (`#0db14b`) | Gradient end — Corilus green (#0db14b). |
| `brand.logo.to` | color | `oklch(0.573, 0.13, 39.0)` (`#b7593a`) | Deeper orange. |
| `brand.logo.to` | color | `oklch(0.573, 0.11, 169.0)` (`#008f6e`) | Deeper shamrock. |
| `brand.neutral.ink` | color | `{brand.ink.950}` |  |
| `brand.neutral.muted` | color | `{brand.ink.700}` |  |
| `brand.neutral.muted-light` | color | `{brand.fill.300}` |  |
| `brand.neutral.on-light` | color | `{brand.ink.0}` | Text/icon colour on a brand-primary fill. |
| `brand.neutral.on-light` | color | `{brand.ink.950}` | Near-black text/icon on the brand-orange fill (~5.6:1). |
| `brand.neutral.on-light` | color | `{brand.ink.950}` | Near-black text/icon on the Shamrock fill (~9.3:1). |
| `brand.neutral.panel-raised` | color | `{brand.fill.25}` |  |
| `brand.neutral.panel-sunken` | color | `{brand.fill.100}` |  |
| `brand.neutral.paper` | color | `{brand.ink.0}` | App canvas / page background (near-white). |
| `brand.primary` | color | `{color.teal.600}` | Corilus teal. The action colour (default surfaces). |
| `brand.primary` | color | `oklch(0.6728, 0.1766, 38.8)` (`#ed6739`) | myNeva orange #ED6739 — exact brand colour (off-ramp, like the logo). Action accent + active states. |
| `brand.primary` | color | `oklch(0.774, 0.141, 169.0)` (`#38d2a6`) | Semble Shamrock #38D2A6 — exact brand colour (off-ramp). Action accent + active states. |
| `brand.primary-bright` | color | `{color.teal.400}` | Lighter teal for accents/icons on dark surfaces (AA on slate). |
| `brand.primary-bright` | color | `oklch(0.6728, 0.1766, 38.8)` (`#ed6739`) | Brand orange accent/icon on dark surfaces. |
| `brand.primary-bright` | color | `oklch(0.774, 0.141, 169.0)` (`#38d2a6`) | Shamrock accent/icon on dark surfaces. |
| `brand.primary-deep` | color | `{color.teal.700}` | Deeper teal for solid fills that carry white text. |
| `brand.primary-deep` | color | `oklch(0.6728, 0.1766, 38.8)` (`#ed6739`) | Solid action fill = the exact brand orange; carries DARK text (neutral.on-light) at AA. |
| `brand.primary-deep` | color | `oklch(0.774, 0.141, 169.0)` (`#38d2a6`) | Solid action fill = the exact Shamrock; carries DARK text at AA. |
| `brand.property.allergy.100` | color | `{color.rust.100}` |  |
| `brand.property.allergy.200` | color | `{color.rust.200}` |  |
| `brand.property.allergy.300` | color | `{color.rust.300}` |  |
| `brand.property.allergy.400` | color | `{color.rust.400}` |  |
| `brand.property.allergy.500` | color | `{color.rust.500}` |  |
| `brand.property.allergy.700` | color | `{color.rust.700}` |  |
| `brand.property.allergy.900` | color | `{color.rust.900}` |  |
| `brand.property.body.100` | color | `{color.taupe.100}` |  |
| `brand.property.body.200` | color | `{color.taupe.200}` |  |
| `brand.property.body.300` | color | `{color.taupe.300}` |  |
| `brand.property.body.400` | color | `{color.taupe.400}` |  |
| `brand.property.body.500` | color | `{color.taupe.500}` |  |
| `brand.property.body.700` | color | `{color.taupe.700}` |  |
| `brand.property.body.900` | color | `{color.taupe.900}` |  |
| `brand.property.breath.100` | color | `{color.teal.100}` |  |
| `brand.property.breath.200` | color | `{color.teal.200}` |  |
| `brand.property.breath.300` | color | `{color.teal.300}` |  |
| `brand.property.breath.400` | color | `{color.teal.400}` |  |
| `brand.property.breath.500` | color | `{color.teal.500}` |  |
| `brand.property.breath.700` | color | `{color.teal.700}` |  |
| `brand.property.breath.900` | color | `{color.teal.900}` |  |
| `brand.property.condition.100` | color | `{color.coral.100}` |  |
| `brand.property.condition.200` | color | `{color.coral.200}` |  |
| `brand.property.condition.300` | color | `{color.coral.300}` |  |
| `brand.property.condition.400` | color | `{color.coral.400}` |  |
| `brand.property.condition.500` | color | `{color.coral.500}` |  |
| `brand.property.condition.700` | color | `{color.coral.700}` |  |
| `brand.property.condition.900` | color | `{color.coral.900}` |  |
| `brand.property.heart.100` | color | `{color.red.100}` |  |
| `brand.property.heart.200` | color | `{color.red.200}` |  |
| `brand.property.heart.300` | color | `{color.red.300}` |  |
| `brand.property.heart.400` | color | `{color.red.400}` |  |
| `brand.property.heart.500` | color | `{color.red.500}` |  |
| `brand.property.heart.700` | color | `{color.red.700}` |  |
| `brand.property.heart.900` | color | `{color.red.900}` |  |
| `brand.property.identity.100` | color | `{color.graphite.100}` |  |
| `brand.property.identity.200` | color | `{color.graphite.200}` |  |
| `brand.property.identity.300` | color | `{color.graphite.300}` |  |
| `brand.property.identity.400` | color | `{color.graphite.400}` |  |
| `brand.property.identity.500` | color | `{color.graphite.500}` |  |
| `brand.property.identity.700` | color | `{color.graphite.700}` |  |
| `brand.property.identity.900` | color | `{color.graphite.900}` |  |
| `brand.property.lab.100` | color | `{color.mint.100}` |  |
| `brand.property.lab.200` | color | `{color.mint.200}` |  |
| `brand.property.lab.300` | color | `{color.mint.300}` |  |
| `brand.property.lab.400` | color | `{color.mint.400}` |  |
| `brand.property.lab.500` | color | `{color.mint.500}` |  |
| `brand.property.lab.700` | color | `{color.mint.700}` |  |
| `brand.property.lab.900` | color | `{color.mint.900}` |  |
| `brand.property.medication.100` | color | `{color.indigo.100}` |  |
| `brand.property.medication.200` | color | `{color.indigo.200}` |  |
| `brand.property.medication.300` | color | `{color.indigo.300}` |  |
| `brand.property.medication.400` | color | `{color.indigo.400}` |  |
| `brand.property.medication.500` | color | `{color.indigo.500}` |  |
| `brand.property.medication.700` | color | `{color.indigo.700}` |  |
| `brand.property.medication.900` | color | `{color.indigo.900}` |  |
| `brand.property.oxygen.100` | color | `{color.sky.100}` |  |
| `brand.property.oxygen.200` | color | `{color.sky.200}` |  |
| `brand.property.oxygen.300` | color | `{color.sky.300}` |  |
| `brand.property.oxygen.400` | color | `{color.sky.400}` |  |
| `brand.property.oxygen.500` | color | `{color.sky.500}` |  |
| `brand.property.oxygen.700` | color | `{color.sky.700}` |  |
| `brand.property.oxygen.900` | color | `{color.sky.900}` |  |
| `brand.property.pressure.100` | color | `{color.violet.100}` |  |
| `brand.property.pressure.200` | color | `{color.violet.200}` |  |
| `brand.property.pressure.300` | color | `{color.violet.300}` |  |
| `brand.property.pressure.400` | color | `{color.violet.400}` |  |
| `brand.property.pressure.500` | color | `{color.violet.500}` |  |
| `brand.property.pressure.700` | color | `{color.violet.700}` |  |
| `brand.property.pressure.900` | color | `{color.violet.900}` |  |
| `brand.property.temperature.100` | color | `{color.amber.100}` |  |
| `brand.property.temperature.200` | color | `{color.amber.200}` |  |
| `brand.property.temperature.300` | color | `{color.amber.300}` |  |
| `brand.property.temperature.400` | color | `{color.amber.400}` |  |
| `brand.property.temperature.500` | color | `{color.amber.500}` |  |
| `brand.property.temperature.700` | color | `{color.amber.700}` |  |
| `brand.property.temperature.900` | color | `{color.amber.900}` |  |
| `brand.secondary` | color | `{color.mint.400}` | Corilus mint. Inverted surfaces + the console ambient indicator only. |
| `brand.secondary` | color | `{color.graphite.0}` | White — myNeva inverts to white on dark / ambient surfaces. |
| `brand.secondary` | color | `{color.graphite.0}` | White — Semble inverts to white on dark / ambient surfaces (matches the white glyph in its logo). |
| `brand.signal.error` | color | `{color.red.500}` |  |
| `brand.signal.info` | color | `{color.sky.500}` |  |
| `brand.signal.success` | color | `{color.green.500}` |  |
| `brand.signal.warning` | color | `{color.amber.500}` |  |
| `brand.status.error.100` | color | `{color.red.100}` |  |
| `brand.status.error.300` | color | `{color.red.300}` |  |
| `brand.status.error.700` | color | `{color.red.700}` |  |
| `brand.status.error.900` | color | `{color.red.900}` |  |
| `brand.status.info.100` | color | `{color.sky.100}` |  |
| `brand.status.info.300` | color | `{color.sky.300}` |  |
| `brand.status.info.700` | color | `{color.sky.700}` |  |
| `brand.status.info.900` | color | `{color.sky.900}` |  |
| `brand.status.success.100` | color | `{color.green.100}` |  |
| `brand.status.success.300` | color | `{color.green.300}` |  |
| `brand.status.success.700` | color | `{color.green.700}` |  |
| `brand.status.success.900` | color | `{color.green.900}` |  |
| `brand.status.warning.100` | color | `{color.amber.100}` |  |
| `brand.status.warning.300` | color | `{color.amber.300}` |  |
| `brand.status.warning.700` | color | `{color.amber.700}` |  |
| `brand.status.warning.900` | color | `{color.amber.900}` |  |
| `brand.tint.soft` | color | `oklch(0.5792, 0.1048, 219.1)` (`#0088a4`) |  |
| `brand.tint.soft` | color | `oklch(0.5792, 0.1048, 39.0)` (`#ae634a`) |  |
| `brand.tint.soft` | color | `oklch(0.5792, 0.1048, 169.0)` (`#248e6f`) |  |
| `brand.tint.strong` | color | `oklch(0.5792, 0.1048, 219.1)` (`#0088a4`) |  |
| `brand.tint.strong` | color | `oklch(0.5792, 0.1048, 39.0)` (`#ae634a`) |  |
| `brand.tint.strong` | color | `oklch(0.5792, 0.1048, 169.0)` (`#248e6f`) |  |
| `canvas.texture-opacity` | number | `0.03` | 3% grain — felt at viewing distance, invisible on screenshot zoom. |
| `chart.axis` | color | `{brand.ink.600}` |  |
| `chart.axis` | color | `{brand.ink.500}` |  |
| `chart.label` | color | `{brand.ink.300}` |  |
| `chart.label` | color | `{brand.ink.700}` |  |
| `density.card-pad` | dimension | `{space.4}` |  |
| `density.card-pad` | dimension | `{space.3}` |  |
| `density.card-pad` | dimension | `{space.5}` |  |
| `density.control-px` | dimension | `{space.4}` |  |
| `density.control-px` | dimension | `{space.3}` |  |
| `density.control-px` | dimension | `{space.5}` |  |
| `density.control-py` | dimension | `10px` |  |
| `density.control-py` | dimension | `7px` |  |
| `density.control-py` | dimension | `13px` |  |
| `density.gap-lg` | dimension | `{space.4}` |  |
| `density.gap-lg` | dimension | `{space.3}` |  |
| `density.gap-lg` | dimension | `{space.6}` |  |
| `density.row-py` | dimension | `10px` |  |
| `density.row-py` | dimension | `6px` |  |
| `density.row-py` | dimension | `15px` |  |
| `dimension.rule.hair` | dimension | `1px` |  |
| `dimension.rule.regular` | dimension | `3px` |  |
| `dimension.rule.thick` | dimension | `4px` |  |
| `dimension.rule.thin` | dimension | `2px` |  |
| `dimension.touch-target.compact` | dimension | `40px` |  |
| `dimension.touch-target.regular` | dimension | `48px` |  |
| `dimension.touch-target.small` | dimension | `32px` |  |
| `elevation.overlay` | shadow | `array[2]` |  |
| `elevation.overlay` | shadow | `array[2]` |  |
| `elevation.raised` | shadow | `array[2]` |  |
| `elevation.raised` | shadow | `array[2]` |  |
| `focus.ring` | color | `{brand.fill.50}` | Focus ring must be visible on dark surfaces. |
| `focus.ring` | color | `{brand.neutral.ink}` |  |
| `icon-pill.glyph-stroke` | dimension | `1.75px` | Slightly heavier than 1px so glyphs read on phones. |
| `icon-pill.size` | dimension | `36px` |  |
| `icon-pill.size-compact` | dimension | `28px` | Used at Seed stage and at narrow container-query widths. |
| `inverted.accent` | color | `{brand.accent.700}` |  |
| `inverted.accent` | color | `{brand.accent.400}` |  |
| `inverted.accent-on` | color | `{brand.ink.0}` |  |
| `inverted.accent-on` | color | `{brand.accent.950}` |  |
| `inverted.border` | color | `{brand.neutral.panel-sunken}` |  |
| `inverted.border` | color | `{brand.fill.700}` |  |
| `inverted.muted` | color | `{brand.ink.700}` |  |
| `inverted.muted` | color | `{brand.ink.500}` |  |
| `inverted.raised` | color | `{brand.neutral.panel-raised}` |  |
| `inverted.raised` | color | `{brand.fill.800}` |  |
| `inverted.text` | color | `{brand.ink.950}` |  |
| `inverted.text` | color | `{brand.ink.100}` |  |
| `overlay.scrim` | color | `{color.alpha.black-55}` |  |
| `overlay.scrim` | color | `{color.alpha.black-55}` | Dimming backdrop behind modals, dialogs, drawers (hueless structural). |
| `pill.dot-size` | dimension | `6px` | Status dot inside a pill (success/warning/error/info indicator). |
| `pill.padding-block` | dimension | `3px` |  |
| `pill.padding-block-dense` | dimension | `2px` | Tighter variant for dense rows or in-card adornments. |
| `pill.padding-inline` | dimension | `10px` |  |
| `pill.padding-inline-dense` | dimension | `8px` |  |
| `property.allergy.accent` | color | `{brand.property.allergy.400}` |  |
| `property.allergy.accent` | color | `{brand.property.allergy.500}` |  |
| `property.allergy.on` | color | `{brand.ink.950}` |  |
| `property.allergy.on` | color | `{brand.neutral.on-light}` |  |
| `property.allergy.solid` | color | `{brand.property.allergy.300}` |  |
| `property.allergy.solid` | color | `{brand.property.allergy.700}` |  |
| `property.allergy.tint` | color | `{brand.property.allergy.900}` |  |
| `property.allergy.tint` | color | `{brand.property.allergy.100}` |  |
| `property.allergy.tint-strong` | color | `{brand.property.allergy.700}` |  |
| `property.allergy.tint-strong` | color | `{brand.property.allergy.200}` |  |
| `property.body.accent` | color | `{brand.property.body.400}` |  |
| `property.body.accent` | color | `{brand.property.body.500}` |  |
| `property.body.on` | color | `{brand.ink.950}` |  |
| `property.body.on` | color | `{brand.neutral.on-light}` |  |
| `property.body.solid` | color | `{brand.property.body.300}` |  |
| `property.body.solid` | color | `{brand.property.body.700}` |  |
| `property.body.tint` | color | `{brand.property.body.900}` |  |
| `property.body.tint` | color | `{brand.property.body.100}` |  |
| `property.body.tint-strong` | color | `{brand.property.body.700}` |  |
| `property.body.tint-strong` | color | `{brand.property.body.200}` |  |
| `property.breath.accent` | color | `{brand.property.breath.400}` |  |
| `property.breath.accent` | color | `{brand.property.breath.500}` |  |
| `property.breath.on` | color | `{brand.ink.950}` |  |
| `property.breath.on` | color | `{brand.neutral.on-light}` |  |
| `property.breath.solid` | color | `{brand.property.breath.300}` |  |
| `property.breath.solid` | color | `{brand.property.breath.700}` |  |
| `property.breath.tint` | color | `{brand.property.breath.900}` |  |
| `property.breath.tint` | color | `{brand.property.breath.100}` |  |
| `property.breath.tint-strong` | color | `{brand.property.breath.700}` |  |
| `property.breath.tint-strong` | color | `{brand.property.breath.200}` |  |
| `property.condition.accent` | color | `{brand.property.condition.400}` |  |
| `property.condition.accent` | color | `{brand.property.condition.500}` |  |
| `property.condition.on` | color | `{brand.ink.950}` |  |
| `property.condition.on` | color | `{brand.neutral.on-light}` |  |
| `property.condition.solid` | color | `{brand.property.condition.300}` |  |
| `property.condition.solid` | color | `{brand.property.condition.700}` |  |
| `property.condition.tint` | color | `{brand.property.condition.900}` |  |
| `property.condition.tint` | color | `{brand.property.condition.100}` |  |
| `property.condition.tint-strong` | color | `{brand.property.condition.700}` |  |
| `property.condition.tint-strong` | color | `{brand.property.condition.200}` |  |
| `property.heart.accent` | color | `{brand.property.heart.400}` |  |
| `property.heart.accent` | color | `{brand.property.heart.500}` |  |
| `property.heart.on` | color | `{brand.ink.950}` |  |
| `property.heart.on` | color | `{brand.neutral.on-light}` |  |
| `property.heart.solid` | color | `{brand.property.heart.300}` |  |
| `property.heart.solid` | color | `{brand.property.heart.700}` |  |
| `property.heart.tint` | color | `{brand.property.heart.900}` |  |
| `property.heart.tint` | color | `{brand.property.heart.100}` |  |
| `property.heart.tint-strong` | color | `{brand.property.heart.700}` |  |
| `property.heart.tint-strong` | color | `{brand.property.heart.200}` |  |
| `property.identity.accent` | color | `{brand.property.identity.400}` |  |
| `property.identity.accent` | color | `{brand.property.identity.500}` |  |
| `property.identity.on` | color | `{brand.ink.950}` |  |
| `property.identity.on` | color | `{brand.neutral.on-light}` |  |
| `property.identity.solid` | color | `{brand.property.identity.300}` |  |
| `property.identity.solid` | color | `{brand.property.identity.700}` |  |
| `property.identity.tint` | color | `{brand.property.identity.900}` |  |
| `property.identity.tint` | color | `{brand.property.identity.100}` |  |
| `property.identity.tint-strong` | color | `{brand.property.identity.700}` |  |
| `property.identity.tint-strong` | color | `{brand.property.identity.200}` |  |
| `property.lab.accent` | color | `{brand.property.lab.400}` |  |
| `property.lab.accent` | color | `{brand.property.lab.500}` |  |
| `property.lab.on` | color | `{brand.ink.950}` |  |
| `property.lab.on` | color | `{brand.neutral.on-light}` |  |
| `property.lab.solid` | color | `{brand.property.lab.300}` |  |
| `property.lab.solid` | color | `{brand.property.lab.700}` |  |
| `property.lab.tint` | color | `{brand.property.lab.900}` |  |
| `property.lab.tint` | color | `{brand.property.lab.100}` |  |
| `property.lab.tint-strong` | color | `{brand.property.lab.700}` |  |
| `property.lab.tint-strong` | color | `{brand.property.lab.200}` |  |
| `property.medication.accent` | color | `{brand.property.medication.400}` |  |
| `property.medication.accent` | color | `{brand.property.medication.500}` |  |
| `property.medication.on` | color | `{brand.ink.950}` |  |
| `property.medication.on` | color | `{brand.neutral.on-light}` |  |
| `property.medication.solid` | color | `{brand.property.medication.300}` |  |
| `property.medication.solid` | color | `{brand.property.medication.700}` |  |
| `property.medication.tint` | color | `{brand.property.medication.900}` |  |
| `property.medication.tint` | color | `{brand.property.medication.100}` |  |
| `property.medication.tint-strong` | color | `{brand.property.medication.700}` |  |
| `property.medication.tint-strong` | color | `{brand.property.medication.200}` |  |
| `property.oxygen.accent` | color | `{brand.property.oxygen.400}` |  |
| `property.oxygen.accent` | color | `{brand.property.oxygen.500}` |  |
| `property.oxygen.on` | color | `{brand.ink.950}` |  |
| `property.oxygen.on` | color | `{brand.neutral.on-light}` |  |
| `property.oxygen.solid` | color | `{brand.property.oxygen.300}` |  |
| `property.oxygen.solid` | color | `{brand.property.oxygen.700}` |  |
| `property.oxygen.tint` | color | `{brand.property.oxygen.900}` |  |
| `property.oxygen.tint` | color | `{brand.property.oxygen.100}` |  |
| `property.oxygen.tint-strong` | color | `{brand.property.oxygen.700}` |  |
| `property.oxygen.tint-strong` | color | `{brand.property.oxygen.200}` |  |
| `property.pressure.accent` | color | `{brand.property.pressure.400}` |  |
| `property.pressure.accent` | color | `{brand.property.pressure.500}` |  |
| `property.pressure.on` | color | `{brand.ink.950}` |  |
| `property.pressure.on` | color | `{brand.neutral.on-light}` |  |
| `property.pressure.solid` | color | `{brand.property.pressure.300}` |  |
| `property.pressure.solid` | color | `{brand.property.pressure.700}` |  |
| `property.pressure.tint` | color | `{brand.property.pressure.900}` |  |
| `property.pressure.tint` | color | `{brand.property.pressure.100}` |  |
| `property.pressure.tint-strong` | color | `{brand.property.pressure.700}` |  |
| `property.pressure.tint-strong` | color | `{brand.property.pressure.200}` |  |
| `property.temperature.accent` | color | `{brand.property.temperature.400}` |  |
| `property.temperature.accent` | color | `{brand.property.temperature.500}` |  |
| `property.temperature.on` | color | `{brand.ink.950}` |  |
| `property.temperature.on` | color | `{brand.neutral.on-light}` |  |
| `property.temperature.solid` | color | `{brand.property.temperature.300}` |  |
| `property.temperature.solid` | color | `{brand.property.temperature.700}` |  |
| `property.temperature.tint` | color | `{brand.property.temperature.900}` |  |
| `property.temperature.tint` | color | `{brand.property.temperature.100}` |  |
| `property.temperature.tint-strong` | color | `{brand.property.temperature.700}` |  |
| `property.temperature.tint-strong` | color | `{brand.property.temperature.200}` |  |
| `sparkline.draw-in-duration` | duration | `600ms` | Stroke-dasharray reveal on mount. |
| `sparkline.marker-radius` | dimension | `3px` | Optional min/max markers. |
| `sparkline.stroke-width` | dimension | `2px` | Bumped from 1.6 — reads on phones at glance distance. |
| `state.active` | color | `{color.alpha.white-16}` |  |
| `state.active` | color | `{color.alpha.black-12}` | Overlay layered over a surface while pressed/active. |
| `state.disabled.text` | color | `{brand.fill.300}` |  |
| `state.disabled.text` | color | `{brand.ink.500}` |  |
| `state.hover` | color | `{color.alpha.white-08}` |  |
| `state.hover` | color | `{color.alpha.black-06}` | Overlay layered over a surface on hover. |
| `state.selected.text` | color | `{action.accent}` |  |
| `state.selected.text` | color | `{action.solid}` | Text/icon colour when selected. |
| `status.error.on` | color | `{brand.ink.950}` |  |
| `status.error.on` | color | `{brand.neutral.on-light}` |  |
| `status.error.solid` | color | `{brand.status.error.300}` |  |
| `status.error.solid` | color | `{brand.status.error.700}` |  |
| `status.error.tint` | color | `{brand.status.error.900}` |  |
| `status.error.tint` | color | `{brand.status.error.100}` |  |
| `status.info.on` | color | `{brand.ink.950}` |  |
| `status.info.on` | color | `{brand.neutral.on-light}` |  |
| `status.info.solid` | color | `{brand.status.info.300}` |  |
| `status.info.solid` | color | `{brand.status.info.700}` |  |
| `status.info.tint` | color | `{brand.status.info.900}` |  |
| `status.info.tint` | color | `{brand.status.info.100}` |  |
| `status.success.on` | color | `{brand.ink.950}` |  |
| `status.success.on` | color | `{brand.neutral.on-light}` |  |
| `status.success.solid` | color | `{brand.status.success.300}` |  |
| `status.success.solid` | color | `{brand.status.success.700}` |  |
| `status.success.tint` | color | `{brand.status.success.900}` |  |
| `status.success.tint` | color | `{brand.status.success.100}` |  |
| `status.warning.on` | color | `{brand.ink.950}` |  |
| `status.warning.on` | color | `{brand.neutral.on-light}` |  |
| `status.warning.solid` | color | `{brand.status.warning.300}` |  |
| `status.warning.solid` | color | `{brand.status.warning.700}` |  |
| `status.warning.tint` | color | `{brand.status.warning.900}` |  |
| `status.warning.tint` | color | `{brand.status.warning.100}` |  |
| `text.default` | color | `{brand.ink.100}` |  |
| `text.default` | color | `{brand.ink.950}` |  |
| `text.faint` | color | `{brand.ink.400}` | Tertiary / placeholder / functional-icon ink. |
| `text.faint` | color | `{brand.ink.500}` | Tertiary / placeholder. Decorative; not for body copy. |
| `text.muted` | color | `{brand.ink.300}` | Secondary text. Brand ink.300 meets AA on dark surfaces. |
| `text.muted` | color | `{brand.ink.700}` |  |
| `text.on-accent` | color | `{brand.neutral.on-light}` |  |

## How to choose a token

1. **For a color:** look in `semantic.color.*` for the role you need
   (`background`, `text`, `border`) and the modifier (`primary`,
   `error`, `success`, etc.). Don't reach into base color ramps from a
   component — that bypasses theming.

2. **For a spacing value:** in-component padding/gap should use a
   `field.*`, `surface.*`, or other family-specific token. For layout
   spacing between components, use the spacing scale (`space.*`) through
   a semantic alias.

3. **For a font size:** prefer a composite `typography.*` token (e.g.
   `typography.body`) over a raw `font.size.*`. The composite carries
   weight and line-height too — consistency wins.

4. **For a new component:** identify its family first. Reuse the family's
   shared tokens. Add component-specific tokens only for what's genuinely
   unique to that component.

## Cascade — what's affected when you change a token

Changing a token ripples through everything that aliases it.

- A change to a **base** token cascades to every alias and every
  component that touches it. Treat as a major operation.
- A change to a **semantic / alias** token cascades to its family and
  potentially to other families that share it. Identify the cascade
  before you commit.
- A change to a **component** token is localised to that component.

Use `scripts/validate_tokens.py` on every change. Read CHANGELOG.md to
trace why a token currently has the value it does.
