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
// Props are projected AS THEY EXIST TODAY (freeform meta.props strings), with only
// trivially-deterministic derivations (leading `?` -> optional; a clean quoted-enum ->
// values). No structured-prop migration is performed here; if a meta prop is already an
// object (post-migration shape) its fields are passed through. Same "ratchet up over time"
// logic applies to `usage`: components without a `usage` snippet record usage: null.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk, extractMetaText, parseMeta } from './lib/meta.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const CATALOG_PATH = path.join(ROOT, 'catalog.json');
const STANDARD_PATH = path.join(ROOT, 'standard.json');

const check = process.argv.slice(2).includes('--check');

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

const clinicalSet = parseNamedExports(path.join(SRC, 'clinical.js'));
const importFor = (name) =>
  clinicalSet.has(name) ? '@corilus/kernel/clinical' : '@corilus/kernel';

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

// ── collect components from every meta block under src/ ───────────────────────────
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
    components.push({
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
    });
  }
}

components.sort((a, b) => a.name.localeCompare(b.name, 'en'));

const catalog = { standardVersion: standard.version, components };
const json = JSON.stringify(catalog, null, 2) + '\n';

// ── coverage report (kernel/src only; never inside the gate, which also runs on
//    greenhouse/src where these would be false positives) ──────────────────────────
function reportCoverage() {
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

// ── check mode (freshness gate) ───────────────────────────────────────────────────
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

// ── write mode ────────────────────────────────────────────────────────────────────
fs.writeFileSync(CATALOG_PATH, json);
console.error(`gen-catalog: wrote ${path.relative(ROOT, CATALOG_PATH)} (${components.length} components).`);
reportCoverage();
