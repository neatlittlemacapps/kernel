// Shared chrome resolver for the Card family (Card / Banner / a framed Collapsible
// trigger). Resolves surface fill, border colour, accent-strip colour, and elevation
// into a fixed set of --card-* custom properties, written ONCE as inline style so
// nothing ever competes with a second CSS rule for the same property - the root
// cause of the B-54 bug where `.krnl-card--elevated` (a class rule) and
// `.krnl-card[data-accent]` (an attribute rule) both tried to set --card-elevation
// at different specificities, so a Card with both `accent` and the legacy
// appearance="elevated" silently lost its elevation. CSS below only ever READS these
// vars; interaction states (:hover, [data-dragging], [data-selected]) may still
// override the final value from a SINGLE state rule - that's fine, only a second
// competing BASE rule was ever the problem.
//
// Reuses the tone vocabulary from ./tone.js (status/data tones + arbitrary colour
// passthrough) rather than re-deriving it - see that file's own note that a later
// pass might fold Card/Banner onto it.
import { toneSlug } from './tone.js';

// A named tone resolves to its solid (.700, AA-text-weight) rung; `neutral` and
// arbitrary colours pass through unchanged (`neutral` has no --status-neutral-*
// family, so it must behave exactly like tone being omitted - see Card's own
// long-standing comment on this IACVT trap). `primary` (the brand action colour)
// is not a toneSlug family - it has no --action-tint/-tint-strong pair - so it's
// special-cased here to the AA-safe --action-solid rung, same rung status tones use.
export const toneVar = (tone) => (tone == null || tone === 'neutral') ? undefined
  : tone === 'primary' ? 'var(--action-solid)'
  : toneSlug(tone) ? `var(--${toneSlug(tone)}-solid)` : tone;

// A named tone binds the whole vivid family so accents read at full ramp saturation:
// tint (.100 body) / tint-strong (.200 icon-tile) / text (.700 AA) / accent (.500
// vivid, for the strip + icon glyph). Arbitrary colours return null and keep the
// generic color-mix fallback authored once in the base .krnl-card rule. `primary`
// has no tint/tint-strong token pair to bind (see toneVar above), so it returns a
// PARTIAL object: --card-tone-text (AA solid) + --card-accent (vivid, so the strip/
// border read as the brand accent rather than the muddy solid) - the tint and
// tint-strong rungs are left unset, falling through to the same generic color-mix
// fallback arbitrary colours use (mixing --card-tone, i.e. --action-solid, at 12%/22%
// into the surface - the same escape hatch, not a special case).
export const tintVars = (tone) => {
  if (tone === 'primary') return {
    '--card-tone-text': 'var(--action-solid)',
    '--card-accent': 'var(--action-accent)',
  };
  const slug = toneSlug(tone);
  return slug ? {
    '--card-tone-tint': `var(--${slug}-tint)`,
    '--card-tone-tint-strong': `var(--${slug}-tint-strong)`,
    '--card-tone-text': `var(--${slug}-solid)`,
    '--card-accent': `var(--${slug}-accent)`,
  } : null;
};

// Strip geometry per edge - top (Card's default) or left (Banner). Inset shadow:
// the browser auto-clips it to border-radius, no overflow/inner-radius hack needed.
const STRIP_EDGE = {
  top: 'inset 0 var(--card-strip-w) 0 0 var(--card-strip-color)',
  left: 'inset var(--card-strip-w) 0 0 0 var(--card-strip-color)',
};

// Resolves the full chrome matrix into --card-* custom properties.
//
//   surface   - 'plain' (neutralFill, pure white/bright) | 'tinted' (a light tone wash)
//               | 'none' (transparent)
//   tone      - a named status/data tone, or any colour/var, or undefined
//   toneScope - 'box' (tone paints background/border/strip) | 'content' (tone stays
//               on slot content - e.g. an icon tile - while the box stays neutral)
//   accent    - the edge strip, on/off
//   bordered  - the hairline border, on/off
//   elevated  - the floating drop shadow, on/off (shared by Card/Banner/Collapsible)
//   collapsible - true for a Card with `detail` (also floats, same family as accent)
//   legacyElevated - Card's deprecated appearance="elevated": a raised RING + shadow
//               instead of a flat border, mutually exclusive with the plain
//               `elevated` boolean's look (kept pixel-identical for PatientCard)
//   edge      - 'top' (Card) | 'left' (Banner) - strip geometry
//   neutralFill - which --surface-* token 'plain' resolves to. Both Card and Banner
//               now pass 'bright' (pure white in light; note --surface-bright equals
//               --surface-raised in DARK - the token's own $description: "bright is a
//               light-mode concept" - so plain/raised look the same in dark, by design,
//               not a bug). Use surface="panel" for the tinted section look instead.
export function resolveCardChrome({
  surface = 'plain', tone, toneScope = 'box', accent = false, bordered = true,
  elevated = false, collapsible = false, legacyElevated = false,
  edge = 'top', neutralFill = 'bright',
} = {}) {
  const tc = toneVar(tone);
  const tv = tintVars(tone);
  const paintsBox = toneScope === 'box' && tc != null;

  const style = {};
  if (tc != null) style['--card-tone'] = tc;
  if (tv) Object.assign(style, tv);

  // surface fill. `plain` (neutralFill, white) is the default; `none` transparent;
  // `tinted` a light wash. legacyElevated (deprecated appearance="elevated") keeps its
  // own raised fill internally. The tinted box wash is deliberately LIGHTER than the
  // tone triad's own .100 tint - it's mixed further toward the white surface so the box
  // reads as a faint hint, not a saturated panel (the triad itself stays untouched, so
  // slot content - icon tiles, chart panels - keeps full saturation).
  style['--card-surface'] = legacyElevated ? 'var(--surface-raised)'
    : surface === 'none' ? 'var(--surface-none)'
    : surface === 'tinted' ? (paintsBox
        ? 'color-mix(in oklch, var(--card-tone-tint) 55%, var(--surface-bright))'
        : 'var(--surface-sunken)')
    : `var(--surface-${neutralFill})`;

  // accent strip - gated by paintsBox like border/surface (the strip is part of
  // "the box", so toneScope="content" keeps it neutral too, same as Banner's
  // original contract). Never silently invisible: falls back to a neutral hairline
  // rather than transparent when `accent` is on without the box painted.
  style['--card-strip-color'] = paintsBox ? (tv ? 'var(--card-accent)' : tc) : 'var(--border-subtle)';
  style['--card-strip-w'] = edge === 'left' ? '4px' : '3px';
  style['--card-strip'] = accent ? STRIP_EDGE[edge] : '0 0 #0000';

  // border colour (legacyElevated draws a ring via --card-elevation instead of a
  // flat border, so its own border is switched off here). When the box is painted,
  // the border matches the STRIP colour (the vivid ~500 accent) rather than the
  // softer .300 border rung - accent and border read as one saturated edge instead
  // of two different weights.
  style['--card-border-color'] = (!bordered || legacyElevated) ? 'transparent'
    : paintsBox ? style['--card-strip-color']
    : 'var(--border-subtle)';

  // elevation - the ONE place the RESTING elevation is decided (in JS, so accent /
  // elevated / legacy never fight on CSS specificity - the B-54 fix). Writes
  // --card-elevation-REST, not --card-elevation: the base .krnl-card rule maps
  // `--card-elevation: var(--card-elevation-rest)`, and the interaction-state rules
  // (:hover / :active / [data-dragging]) override --card-elevation itself. That
  // indirection is essential - an inline custom property beats every stylesheet rule,
  // so if the resolver wrote --card-elevation directly (as it did before), the state
  // rules could never override the shadow (dragging/hover/press silently did nothing).
  style['--card-elevation-rest'] = legacyElevated
    ? '0 0 0 var(--dimension-rule-hair) var(--border-subtle), var(--elevation-raised)'
    : (elevated || accent || collapsible) ? 'var(--elevation-floating)' : '0 0 #0000';

  return style;
}
