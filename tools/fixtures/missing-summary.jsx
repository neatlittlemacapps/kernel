// FIXTURE (grove BACKLOG B-37) - a seeded violation for the documentation floor. NOT under src/,
// so gen-catalog / `npm run gate` never see it; the gate test points catalog-gate.mjs here.
// `NoSummary` has a meta but an empty `summary`, which the floor rejects (guard mode, both tiers).
// The comment on the next line contains an apostrophe and a brace { to prove the comment-aware
// extractor doesn't choke: it's the developer's shorthand for { a, b }.
export const meta = {
  NoSummary: { layer: 'atom', scope: 'global', usecases: ['fixture'], status: 'experimental', summary: '', props: {}, composes: [] },
};

export function NoSummary() { return null; }
