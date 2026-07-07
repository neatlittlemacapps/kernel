#!/usr/bin/env node
// Kernel catalog generator (grove BACKLOG B-29) - the machine-readable spine.
//
// Projects every component's `export const meta` into a single catalog.json at the repo
// root. The CLI (B-30), agent-docs (B-31), and MCP server (B-32) are all views over it.
// Zero-dependency: Node built-ins only + the shared parser in ./lib/meta.mjs, so it runs
// with bare `node` (the kernel package has no node_modules).
//
// Usage:
//   node tools/gen-catalog.mjs            # regenerate + write catalog.json
//   node tools/gen-catalog.mjs --check    # regenerate in memory; exit 1 if committed
//                                         # catalog.json is stale or missing (freshness gate)
//
// `buildCatalog()` is exported so the CLI (bin/kernel.mjs) can run the same freshness compare
// inline without spawning; the script body below only runs when invoked directly.
//
// Props are projected AS THEY EXIST TODAY (freeform meta.props strings), with only
// trivially-deterministic derivations (leading `?` -> optional; a clean quoted-enum ->
// values). No structured-prop migration is performed here; if a meta prop is already an
// object (post-migration shape) its fields are passed through. Same "ratchet up over time"
// logic applies to `usage`: components without a `usage` snippet record usage: null.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { walk, extractMetaText, parseMeta } from './lib/meta.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
export const CATALOG_PATH = path.join(ROOT, 'catalog.json');
const STANDARD_PATH = path.join(ROOT, 'standard.json');

// ── import-path resolution: derive from the entry files, NOT from `scope` ─────────
// (clinical cards are scope:'global' yet live behind the ./clinical subpath).
function parseNamedExports(file) {
  const names = new Set();
  let src;
  try { src = fs.readFileSync(file, 'utf8'); } catch { return names; }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const tok = part.trim();
      if (!tok) continue;
      const asMatch = tok.match(/\bas\s+([A-Za-z_$][\w$]*)/); // `X as Y` exports Y
      names.add(asMatch ? asMatch[1] : tok.split(/\s+/)[0]);
    }
  }
  return names;
}

// ── prop normalization (conservative, deterministic) ──────────────────────────────
const CLEAN_ENUM = /^'[^']*'(\|'[^']*')+$/; // 'a'|'b'|'c' (>= 2 members), no trailing prose

function normalizeProps(props) {
  if (!props || typeof props !== 'object') return [];
  const out = [];
  for (const [name, val] of Object.entries(props)) {
    if (typeof val === 'string') {
      const entry = { name, raw: val };
      const body = val.startsWith('?') ? val.slice(1) : val;
      if (val.startsWith('?')) entry.optional = true;
      if (CLEAN_ENUM.test(body)) entry.values = body.split('|').map((s) => s.slice(1, -1));
      out.push(entry);
    } else if (val && typeof val === 'object') {
      // future structured shape - pass its fields through (name stays first, not overwritten).
      out.push({ name, ...val });
    } else {
      out.push({ name, raw: String(val) });
    }
  }
  return out;
}

// ── build the catalog from every meta block under src/ ────────────────────────────
// Returns { json, components, seenAt, clinicalSet }. Exits (2) on a meta parse failure or a
// duplicate component name - the same fatal errors whether invoked as a script or imported.
export function buildCatalog() {
  const clinicalSet = parseNamedExports(path.join(SRC, 'clinical.js'));
  const importFor = (name) =>
    clinicalSet.has(name) ? '@corilus/kernel/clinical' : '@corilus/kernel';

  const standard = JSON.parse(fs.readFileSync(STANDARD_PATH, 'utf8'));
  const components = [];
  const seenAt = new Map(); // name -> file (duplicate-name guard)

  for (const file of walk(SRC)) {
    const src = fs.readFileSync(file, 'utf8');
    const metaText = extractMetaText(src);
    if (!metaText) continue;
    let meta;
    try {
      meta = parseMeta(metaText);
    } catch (e) {
      console.error(`gen-catalog: meta in ${path.relative(ROOT, file)} does not evaluate: ${e.message}`);
      process.exit(2);
    }
    for (const [name, c] of Object.entries(meta)) {
      if (seenAt.has(name)) {
        console.error(
          `gen-catalog: duplicate component name "${name}" in ${path.relative(ROOT, file)} ` +
          `(already defined in ${path.relative(ROOT, seenAt.get(name))}). Names must be unique across the catalog.`
        );
        process.exit(2);
      }
      seenAt.set(name, file);
      const entry = {
        name,
        import: importFor(name),
        layer: c.layer ?? null,
        scope: c.scope ?? null,
        status: c.status ?? null,
        summary: c.summary ?? null,
        usecases: Array.isArray(c.usecases) ? c.usecases : [],
        props: normalizeProps(c.props),
        composes: Array.isArray(c.composes) ? c.composes : [],
        usage: c.usage ?? null,
      };
      // optional Astryx-style enrichment fields - carried through only when present (B-37).
      if (Array.isArray(c.keywords)) entry.keywords = c.keywords;
      if (c.category) entry.category = c.category;
      if (Array.isArray(c.bestPractices)) entry.bestPractices = c.bestPractices;
      if (Array.isArray(c.anatomy)) entry.anatomy = c.anatomy;
      if (Array.isArray(c.related)) entry.related = c.related;
      if (Array.isArray(c.examples)) entry.examples = c.examples;
      if (c.storybook && typeof c.storybook === 'object') entry.storybook = c.storybook; // reserved for future Storybook embedding
      components.push(entry);
    }
  }

  components.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  const json = JSON.stringify({ standardVersion: standard.version, components }, null, 2) + '\n';
  return { json, components, seenAt, clinicalSet };
}

// ── coverage report (kernel/src only; never inside the gate, which also runs on
//    greenhouse/src where these would be false positives) ──────────────────────────
function reportCoverage(components, seenAt, clinicalSet) {
  const withUsage = components.filter((c) => c.usage != null).map((c) => c.name);
  const missing = components.filter((c) => c.usage == null).map((c) => c.name);
  console.error(`gen-catalog: usage ${withUsage.length}/${components.length} present` +
    (missing.length ? `; missing: ${missing.join(', ')}` : ''));

  // exported-but-meta-less components (named exports in the barrels with no meta entry).
  const exported = new Set([
    ...parseNamedExports(path.join(SRC, 'components', 'index.js')),
    ...clinicalSet,
  ]);
  const metaless = [...exported].filter((n) => !seenAt.has(n)).sort();
  if (metaless.length)
    console.error(`gen-catalog: exported but no meta (absent from catalog): ${metaless.join(', ')}`);
}

// ── script entry (only when invoked directly, not on import) ───────────────────────
function main() {
  const check = process.argv.slice(2).includes('--check');
  const { json, components, seenAt, clinicalSet } = buildCatalog();

  if (check) {
    let committed;
    try {
      committed = fs.readFileSync(CATALOG_PATH, 'utf8');
    } catch {
      console.error('gen-catalog: catalog.json is missing. Run `npm run catalog` and commit catalog.json.');
      process.exit(1);
    }
    if (committed !== json) {
      console.error('gen-catalog: catalog.json is STALE. Run `npm run catalog` and commit the result.');
      process.exit(1);
    }
    console.error(`gen-catalog: catalog.json is fresh (${components.length} components).`);
    process.exit(0);
  }

  fs.writeFileSync(CATALOG_PATH, json);
  console.error(`gen-catalog: wrote ${path.relative(ROOT, CATALOG_PATH)} (${components.length} components).`);
  reportCoverage(components, seenAt, clinicalSet);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
