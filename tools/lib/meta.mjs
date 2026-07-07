// Shared Kernel meta parser - the one copy of the `export const meta` reader.
//
// Extracted verbatim from tools/catalog-gate.mjs (grove BACKLOG B-29) so the gate and
// tools/gen-catalog.mjs consume identical parsing. Zero-dependency: Node built-ins only,
// so it runs with bare `node` (the kernel package has no node_modules).
//
// A Kernel/greenhouse `meta` is a pure object literal (string/array/object/bool values,
// no calls) mapping componentName -> { layer, scope, usecases, status, summary, props,
// composes }. These four helpers locate, extract, evaluate, and classify it.

import fs from 'node:fs';
import path from 'node:path';

// ── walk source ─────────────────────────────────────────────────────────────────
export function walk(dir, out = []) {
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

// ── extract the `export const meta = { ... }` object literal (brace-matched) ──────
export function extractMetaText(src) {
  const m = src.match(/export\s+const\s+meta\s*=\s*\{/);
  if (!m) return null;
  const start = m.index + m[0].length - 1; // index of the opening {
  // Comment-aware brace matcher: `//` and `/* */` are skipped so a stray quote or brace in a
  // comment (e.g. "the Kernel's API" or "// { name, dose }") can't break string/brace tracking.
  // Comments remain in the returned slice - parseMeta evaluates it as JS, which ignores them.
  let depth = 0, inStr = null, prev = '', inLine = false, inBlock = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i], next = src[i + 1];
    if (inLine) { if (c === '\n') inLine = false; prev = c; continue; }
    if (inBlock) { if (c === '*' && next === '/') { inBlock = false; i++; prev = ''; continue; } prev = c; continue; }
    if (inStr) { if (c === inStr && prev !== '\\') inStr = null; prev = c; continue; }
    if (c === '/' && next === '/') { inLine = true; i++; prev = ''; continue; }
    if (c === '/' && next === '*') { inBlock = true; i++; prev = ''; continue; }
    if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === '{') depth++;
    else if (c === '}') { if (--depth === 0) return src.slice(start, i + 1); }
    prev = c;
  }
  return null;
}

export function parseMeta(text) {
  // meta is a pure object literal of string/array/object/bool values (no calls) in
  // every Kernel/greenhouse file. Evaluate it directly; report parse failures, don't crash.
  // eslint-disable-next-line no-new-func
  return new Function('return (' + text + ')')();
}

export function scopeKind(scope) {
  if (scope == null) return 'missing';
  if (typeof scope === 'string') return scope === 'global' ? 'global' : scope.startsWith('?') ? 'missing' : 'other';
  if (typeof scope === 'object') {
    if (Array.isArray(scope.agents) && scope.agents.length) return 'agents';
    if (Array.isArray(scope.surfaces) && scope.surfaces.length) return 'surfaces';
  }
  return 'other';
}
