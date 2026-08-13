// Shared tone-to-fill-colour resolver for the metering / data-visualisation family
// (Progress, Meter, DonutGauge). Generalises the RUNG CHOICE Banner made for its accent
// strip - the vivid `-accent` (.500) rung, not Card's `-solid` (.700, an AA *text*
// colour that reads muddy as a fat bar/ring fill) - to a wider tone set: status tones,
// data tones, and `primary` (the brand action colour), on top of the same neutral/null/
// arbitrary-colour semantics Card's resolver established (see Card.jsx's `toneVar`).
//
// This is NOT a replacement for Card's or Banner's own chrome resolvers - those style
// tinted SURFACES (a different visual language) and stay as they are. This is the
// canonical resolver for new components whose colour need is "one vivid fill colour."
// A later pass may fold Card/Banner onto this; out of scope for now.

export const STATUS_TONES = ['info', 'success', 'warning', 'error'];
export const DATA_TONES = ['data-1', 'data-2', 'data-3', 'data-4', 'data-5', 'data-6'];

// A named tone resolves to its token family slug (`status-error`, `data-tone-3`);
// arbitrary colour strings (and `primary`, handled separately in toneFill) return null.
export const toneSlug = (tone) =>
  STATUS_TONES.includes(tone) ? `status-${tone}`
  : DATA_TONES.includes(tone) ? tone.replace('data-', 'data-tone-')
  : null;

// The fill colour for a meter/gauge/bar. `undefined` means "use the caller's own
// default" (so an un-toned Progress keeps its current --action-solid, unchanged).
// `neutral` behaves exactly like an omitted tone - there is no --status-neutral-*
// family, so treating it as a real tone would repeat the invalid-CSS class of bug
// fixed on Card/Banner (see CHANGELOG: tone="neutral" IACVT).
export function toneFill(tone) {
  if (tone == null || tone === 'neutral') return undefined;
  if (tone === 'primary') return 'var(--action-accent)';
  const slug = toneSlug(tone);
  return slug ? `var(--${slug}-accent)` : tone;
}
