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
import { walk, extractMetaText, parseMeta, scopeKind } from './lib/meta.mjs';

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

// ── meta parser (walk / extractMetaText / parseMeta / scopeKind) is shared with
//    tools/gen-catalog.mjs via ./lib/meta.mjs ────────────────────────────────────

// ── checks ────────────────────────────────────────────────────────────────────
const findings = []; // {level:'error'|'warn', file, component, rule, msg, hint}
const add = (level, file, component, rule, msg, hint) =>
  findings.push({ level, file, component, rule, msg, hint });

const rel = (f) => path.relative(process.cwd(), f);

// state classes that should be a Base UI data-* attr, not a hand-toggled className
const STATE_CLASS = /\bis-(on|off|active|selected|open|closed|expanded|collapsed|checked|disabled|pressed|current|highlighted|loading|invalid)\b/g;

// ── pass 1: collect units + build the cross-file scope registry ─────────────────
const units = []; // {file, src, meta}
const scopeBy = {}; // componentName -> scopeKind (names are unique across the catalog by convention)
for (const file of walk(targetDir)) {
  const src = fs.readFileSync(file, 'utf8');
  const metaText = extractMetaText(src);
  let meta = null;
  if (metaText) {
    try { meta = parseMeta(metaText); }
    catch (e) { add('error', file, '(file)', 'meta-parse', `meta does not evaluate: ${e.message}`); }
  }
  if (meta) for (const [name, c] of Object.entries(meta)) scopeBy[name] = scopeKind(c.scope);
  units.push({ file, src, meta });
}

// ── pass 2: per-file checks ─────────────────────────────────────────────────────
for (const { file, src, meta } of units) {
  const rawCounts = {};
  for (const tag of Object.keys(rawEquivalents)) {
    const n = (src.match(new RegExp('<' + tag + '[\\s/>]', 'g')) || []).length;
    if (n) rawCounts[tag] = n;
  }

  const composedAll = new Set();
  if (meta) for (const c of Object.values(meta)) (c.composes || []).forEach((x) => composedAll.add(x));

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

      // scope presence (step 4)
      if (scopeKind(c.scope) === 'missing')
        add('warn', file, name, 'scope-missing',
          'no scope declared — set "global" / {agents:[…]} / {surfaces:[…]}.',
          'scope drives the promotion gate; an honest scope is required.');

      // upward dependency: a global component must not compose an agent-scoped one (step 4)
      if (scopeKind(c.scope) === 'global')
        for (const dep of c.composes || [])
          if (scopeBy[dep] === 'agents')
            add('error', file, name, 'scope-upward-dep',
              `global component composes agent-scoped \`${dep}\` — no upward dependency allowed.`,
              `promote \`${dep}\` to global/clinical, or make this component agent-scoped.`);
    }
  }

  // hand-rolled state classes (step 3) — WARN pending migration, then promote to ERROR
  const stateHits = [...new Set(src.match(STATE_CLASS) || [])];
  if (stateHits.length)
    add('warn', file, '(file)', 'handrolled-state',
      `hand-rolled state class(es): ${stateHits.join(', ')}.`,
      'drive state off the Base UI data-* attr ([data-pressed]/[data-selected]/…), not a toggled className.');

  // false-composes / raw-control. Exempt, per tag, the file that DEFINES that tag's
  // canonical control (it IS the primitive) and pure-atom files (atoms are leaf primitives).
  const defined = meta ? new Set(Object.keys(meta)) : new Set();
  const metaVals = meta ? Object.values(meta) : [];
  const pureAtom = atomsMayHandRollControls && metaVals.length > 0 && metaVals.every((c) => c.layer === 'atom');
  const flagged = [];
  let rawError = false;
  for (const [tag, n] of Object.entries(rawCounts)) {
    const controls = controlComponents[tag] || [];
    if (controls.some((c) => defined.has(c))) continue;
    if (pureAtom) continue;
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
console.log('  covers: banned-state props, style synonyms, raw controls, empty composes,');
console.log('          hand-rolled state classes, scope presence + upward-dependency.');
console.log('  not yet: forwardRef-on-render-target, tone-vs-CSS (need cross-file / CSS-parse work).\n');

process.exit(!audit && errors.length ? 1 : 0);
