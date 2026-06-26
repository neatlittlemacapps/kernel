#!/usr/bin/env node
// Kernel component impact index (grove BACKLOG B-21) — "what breaks if I change X".
//
// The reverse of `composes`: given a component, list everything that composes it
// (direct + transitive) and the scope/agent each dependent lives in — so a change
// to a shared atom is flagged BEFORE it ripples. The component analog of the
// kernel-tokens cascade-impact report. Zero-dependency.
//
// Usage:
//   node tools/impact.mjs <ComponentName> [dir ...]
//   node tools/impact.mjs Banner                 # default scan: ./src + ../greenhouse/src
//   node tools/impact.mjs Btn ../greenhouse/src
//   node tools/impact.mjs --list                 # list every catalogued component + scope
//
// (Meta helpers are duplicated from catalog-gate.mjs on purpose — keeping both
//  scripts dependency-free and independently runnable.)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const list = args.includes('--list');
const positional = args.filter((a) => !a.startsWith('--'));
const target = list ? positional[0] : positional[0];
const dirs = (list ? positional : positional.slice(1));
if (!dirs.length) dirs.push(path.join(__dirname, '..', 'src'), path.join(__dirname, '..', '..', 'greenhouse', 'src'));

if (!list && !target) {
  console.error('usage: node tools/impact.mjs <ComponentName> [dir ...]   |   --list [dir ...]');
  process.exit(2);
}

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git' || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(jsx|tsx|js)$/.test(e.name)) out.push(full);
  }
  return out;
}
function extractMetaText(src) {
  const m = src.match(/export\s+const\s+meta\s*=\s*\{/);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0, inStr = null, prev = '';
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (c === inStr && prev !== '\\') inStr = null; }
    else if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === '{') depth++;
    else if (c === '}') { if (--depth === 0) return src.slice(start, i + 1); }
    prev = c;
  }
  return null;
}
function scopeLabel(scope) {
  if (scope == null) return '(no scope)';
  if (typeof scope === 'string') return scope;
  if (scope.agents) return `agents:[${scope.agents.join(',')}]`;
  if (scope.surfaces) return `surfaces:[${scope.surfaces.join(',')}]`;
  return JSON.stringify(scope);
}

// build the catalog: component -> { scope, composes, file }
const catalog = {};
for (const dir of dirs) {
  for (const file of walk(dir)) {
    const text = extractMetaText(fs.readFileSync(file, 'utf8'));
    if (!text) continue;
    let meta;
    try { meta = new Function('return (' + text + ')')(); } catch { continue; }
    for (const [name, c] of Object.entries(meta))
      catalog[name] = { scope: scopeLabel(c.scope), composes: c.composes || [], file: path.relative(process.cwd(), file) };
  }
}

if (list) {
  const names = Object.keys(catalog).sort();
  console.log(`\n${names.length} components across ${dirs.length} dir(s):\n`);
  for (const n of names) console.log(`  ${n}  ·  ${catalog[n].scope}  ·  ${catalog[n].file}`);
  console.log('');
  process.exit(0);
}

if (!catalog[target] && !Object.values(catalog).some((c) => c.composes.includes(target)))
  console.log(`\nnote: "${target}" is not in the catalog and nothing composes it (external or misspelled?).`);

// direct dependents
const directOf = (name) => Object.entries(catalog).filter(([, c]) => c.composes.includes(name)).map(([n]) => n);

// transitive closure of dependents
const seen = new Set();
const layers = [];
let frontier = directOf(target);
let depth = 0;
while (frontier.length && depth < 12) {
  const fresh = frontier.filter((n) => !seen.has(n));
  if (!fresh.length) break;
  fresh.forEach((n) => seen.add(n));
  layers.push(fresh);
  frontier = [...new Set(fresh.flatMap((n) => directOf(n)))];
  depth++;
}

console.log(`\nImpact of changing  ${target}  (${catalog[target] ? catalog[target].scope + ' · ' + catalog[target].file : 'not catalogued'})\n`);
if (!layers.length) {
  console.log('  no dependents — safe to change in isolation.\n');
} else {
  console.log(`  ${seen.size} dependent(s) across ${layers.length} level(s):\n`);
  layers.forEach((names, i) => {
    console.log(`  level ${i + 1} (${i === 0 ? 'direct' : 'transitive'}):`);
    for (const n of names.sort()) console.log(`    ${n}  ·  ${catalog[n].scope}  ·  ${catalog[n].file}`);
  });
  const agents = new Set();
  for (const n of seen) { const m = /agents:\[(.+)\]/.exec(catalog[n].scope); if (m) m[1].split(',').forEach((a) => agents.add(a)); }
  console.log(`\n  agents touched: ${agents.size ? [...agents].join(', ') : 'none flagged via scope'}.`);
  console.log('  → re-verify these (screenshot-diff the shared atom) before shipping the change.\n');
}
