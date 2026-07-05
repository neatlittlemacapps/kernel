// Shared catalog queries (grove BACKLOG B-32) - the one implementation of Kernel's read-side
// projections, consumed by BOTH the `kernel` CLI (bin/kernel.mjs) and the MCP server
// (mcp/server.mjs) so they can never drift. Zero-dependency: Node built-ins only.
//
// These are pure data functions: `loadCatalog` throws a typed error (`.code`) that each caller
// maps to its own surface (the CLI to an ERR_* envelope, the MCP server to a JSON-RPC error).

import fs from 'node:fs';

export function loadCatalog(catalogPath) {
  let text;
  try { text = fs.readFileSync(catalogPath, 'utf8'); }
  catch { const e = new Error('catalog.json not found. Run `npm run catalog` to generate it.'); e.code = 'ERR_NO_CATALOG'; throw e; }
  try { return JSON.parse(text); }
  catch (err) { const e = new Error(`catalog.json is not valid JSON: ${err.message}`); e.code = 'ERR_NO_CATALOG'; throw e; }
}

export function findComponent(catalog, name) {
  return catalog.components.find((c) => c.name === name)
    || catalog.components.find((c) => c.name.toLowerCase() === name.toLowerCase())
    || null;
}

function levenshtein(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export function suggestNames(query, names, n = 3) {
  const q = query.toLowerCase();
  return names
    .map((name) => {
      const l = name.toLowerCase();
      let reason = null, rank;
      if (l.startsWith(q)) { reason = 'same prefix'; rank = 0; }
      else if (l.includes(q)) { reason = 'substring match'; rank = 1; }
      else { const dist = levenshtein(query, name); if (dist <= Math.max(2, Math.ceil(name.length / 3))) { reason = 'similar name'; rank = 2 + dist; } }
      return reason ? { name, reason, rank } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, n)
    .map(({ name, reason }) => ({ name, reason }));
}

// ranked [{ c, score }] over name (x3) + usecases (x2) + summary (x1). Used by search + build.
export function scoreComponents(query, components) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return components
    .map((c) => {
      const name = c.name.toLowerCase();
      const uses = (c.usecases || []).join(' ').toLowerCase();
      const summary = (c.summary || '').toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (name.includes(t)) score += 3;
        if (uses.includes(t)) score += 2;
        if (summary.includes(t)) score += 1;
      }
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name, 'en'));
}

// the `kernel search` / MCP `search` data shape.
export function searchCatalog(catalog, query) {
  return scoreComponents(query, catalog.components)
    .map(({ c, score }) => ({ name: c.name, import: c.import, score, summary: c.summary }));
}
