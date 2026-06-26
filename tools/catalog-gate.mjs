#!/usr/bin/env node
// Kernel catalog gate (grove BACKLOG B-20) — v0: steps 1-2.
//
// Reads the Kernel Standard (standard.json) and audits component `meta` + source
// for drift. Zero-dependency: Node built-ins only, so it runs with bare `node`
// (the kernel package has no node_modules). Runs against kernel/src OR an external
// consumer like greenhouse/src.
//
// Usage:
//   node tools/catalog-gate.mjs [targetDir] [--audit] [--standard <path>]
//   node tools/catalog-gate.mjs src                       # self-check (Guard: exits 1 on error)
//   node tools/catalog-gate.mjs ../greenhouse/src --audit # Audit mode (report only, exits 0)
//
// Defaults: targetDir = ./src ; standard = <this dir>/../standard.json.
//
// v0 checks (steps 1-2):
//   1. meta parse + dictionary — banned interaction-state props; forbidden style synonyms.
//   2. raw-control / false-composes — raw <button|input|select|textarea> with no composed
//      Kernel equivalent; a composing layer (molecule/composite/organism) declaring composes:[].
// Heavier checks (hand-rolled .is-on/isOpen AST walk; scope dependency graph; tone-vs-CSS)
// are steps 3-4, not implemented here — see the report footer.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── args ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const audit = argv.includes('--audit');
const stdFlag = argv.indexOf('--standard');
const standardPath = stdFlag !== -1 ? argv[stdFlag + 1] : path.join(__dirname, '..', 'standard.json');
const targetDir = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--standard') || 'src';

// ── load standard ───────────────────────────────────────────────────────────────
let standard;
try {
  standard = JSON.parse(fs.readFileSync(standardPath, 'utf8'));
} catch (e) {
  console.error(`catalog-gate: cannot read standard at ${standardPath}\n  ${e.message}`);
  process.exit(2);
}
const banned = new Set(standard.ownershipClasses?.interactionState?.bannedProps || []);
const lint = standard.lint || {};
const synonyms = lint.forbiddenStyleSynonyms || {};
const rawEquivalents = lint.rawControlEquivalents || {};
const controlComponents = lint.controlComponents || {};
const composingLayers = new Set(lint.composingLayers || ['molecule', 'composite', 'organism']);
const atomsMayHandRollControls = lint.atomsMayHandRollControls !== false;

// ── walk source ─────────────────────────────────────────────────────────────────
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

// ── extract the `export const meta = { ... }` object literal (brace-matched) ──────
function extractMetaText(src) {
  const m = src.match(/export\s+const\s+meta\s*=\s*\{/);
  if (!m) return null;
  const start = m.index + m[0].length - 1; // index of the opening {
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

function parseMeta(text) {
  // meta is a pure object literal of string/array/object/bool values (no calls) in
  // every Kernel/greenhouse file. Evaluate it directly; report parse failures, don't crash.
  // eslint-disable-next-line no-new-func
  return new Function('return (' + text + ')')();
}

// ── checks ────────────────────────────────────────────────────────────────────
const findings = []; // {level:'error'|'warn', file, component, rule, msg, hint}
const add = (level, file, component, rule, msg, hint) =>
  findings.push({ level, file, component, rule, msg, hint });

const rel = (f) => path.relative(process.cwd(), f);

for (const file of walk(targetDir)) {
  const src = fs.readFileSync(file, 'utf8');
  const metaText = extractMetaText(src);

  // file-level raw-control scan (catches the raw <button>/<input>/… bypassing the family)
  const rawCounts = {};
  for (const tag of Object.keys(rawEquivalents)) {
    const n = (src.match(new RegExp('<' + tag + '[\\s/>]', 'g')) || []).length;
    if (n) rawCounts[tag] = n;
  }

  let meta = null;
  if (metaText) {
    try { meta = parseMeta(metaText); }
    catch (e) { add('error', file, '(file)', 'meta-parse', `meta does not evaluate: ${e.message}`); }
  }

  // gather all composes across this file's components (raw-control attribution is file-level)
  const composedAll = new Set();
  if (meta) for (const c of Object.values(meta)) (c.composes || []).forEach((x) => composedAll.add(x));

  // per-component prop + composes checks
  if (meta) {
    for (const [name, c] of Object.entries(meta)) {
      const props = c && typeof c.props === 'object' ? Object.keys(c.props) : [];
      for (const p of props) {
        if (banned.has(p))
          add('error', file, name, 'banned-state-prop',
            `prop \`${p}\` is interaction state — must be styled via [data-*], never a prop.`,
            'remove the prop; target the Base UI data-* attribute in CSS.');
        if (synonyms[p])
          add('error', file, name, 'style-synonym',
            `prop \`${p}\` is a non-canonical style axis.`, `use \`${synonyms[p]}\`.`);
      }
      if (composingLayers.has(c.layer) && Array.isArray(c.composes) && c.composes.length === 0)
        add('warn', file, name, 'empty-composes',
          `layer "${c.layer}" normally composes design-system parts but declares composes:[].`,
          'list what it composes, or extract the inlined parts into Kernel atoms.');
    }
  }

  // false-composes: raw control present but no Kernel equivalent composed.
  // Exempt, per tag, the file that DEFINES that tag's canonical control (it IS the primitive).
  const defined = meta ? new Set(Object.keys(meta)) : new Set();
  const metaVals = meta ? Object.values(meta) : [];
  const pureAtom = atomsMayHandRollControls && metaVals.length > 0 && metaVals.every((c) => c.layer === 'atom');
  const flagged = [];
  let rawError = false;
  for (const [tag, n] of Object.entries(rawCounts)) {
    const controls = controlComponents[tag] || [];
    if (controls.some((c) => defined.has(c))) continue; // this file defines the canonical control
    if (pureAtom) continue;                             // pure-atom file: atoms are leaf primitives
    flagged.push(`${tag}×${n}`);
    if (tag === 'button' && !controls.some((c) => composedAll.has(c))) rawError = true;
  }
  if (flagged.length)
    add(rawError ? 'error' : 'warn', file, '(file)', 'raw-control',
      `raw control(s) bypass the component family: ${flagged.join(', ')}.`,
      'compose ' + [...new Set(flagged.map((t) => rawEquivalents[t.split('×')[0]]))].join(' / ') +
      (meta ? ' and reflect it in composes.' : ' (no meta export found).'));
}

// ── report ──────────────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');

console.log(`\nKernel catalog gate — ${audit ? 'AUDIT' : 'GUARD'}  ·  target: ${rel(path.resolve(targetDir))}`);
console.log(`standard: ${rel(path.resolve(standardPath))} (v${standard.version})\n`);

const byFile = {};
for (const f of findings) (byFile[rel(f.file)] ||= []).push(f);
for (const [file, fs_] of Object.entries(byFile)) {
  console.log(`  ${file}`);
  for (const f of fs_) {
    const tag = f.level === 'error' ? 'ERR ' : 'WARN';
    console.log(`    ${tag} [${f.rule}] ${f.component}: ${f.msg}`);
    if (f.hint) console.log(`         → ${f.hint}`);
  }
}
if (!findings.length) console.log('  clean — no findings.\n');

console.log(`\n  ${errors.length} error(s), ${warns.length} warning(s).`);
console.log('  v0 covers: banned-state props, style synonyms, raw controls, empty composes.');
console.log('  not yet covered (steps 3-4): hand-rolled .is-on/isOpen state, scope graph, tone-vs-CSS.\n');

process.exit(!audit && errors.length ? 1 : 0);
