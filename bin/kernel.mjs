#!/usr/bin/env node
// The `kernel` CLI (grove BACKLOG B-30) - the pull surface over catalog.json.
//
// A thin, zero-dependency projection of catalog.json + the token docs, with a JSON + error
// contract modeled on Astryx's: every command supports `--json` (typed {type,data} envelope)
// and `--dense` (token-efficient markdown for context windows). Error codes are stable and
// append-only (see CLI.md). Node built-ins only, so it runs with bare `node`.
//
// Commands: component | docs | search | impact | doctor | build   (see `kernel help`).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildCatalog, CATALOG_PATH } from '../tools/gen-catalog.mjs';
import { checkContrast } from '../tools/lib/contrast.mjs';
import { buildAgentBlock, renderDoc } from '../tools/gen-agent-docs.mjs';
import { loadCatalog as readCatalog, findComponent, scoreComponents, searchCatalog, suggestNames } from '../tools/lib/queries.mjs';
import { walk, extractMetaText, parseMeta } from '../tools/lib/meta.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const TOKENS = path.join(ROOT, 'tokens');
const TEMPLATES = path.join(ROOT, 'templates');

// ── stable, append-only error codes (documented in CLI.md) ────────────────────────
const CODES = ['ERR_UNKNOWN', 'ERR_UNKNOWN_COMPONENT', 'ERR_UNKNOWN_TOPIC', 'ERR_UNKNOWN_TEMPLATE', 'ERR_NO_CATALOG', 'ERR_STALE_CATALOG', 'ERR_INVALID_OPTION'];

// ── arg parse ─────────────────────────────────────────────────────────────────────
const raw = process.argv.slice(2);
// Pre-scan output flags so an ERR_INVALID_OPTION below still respects --json regardless of order.
const flags = { json: raw.includes('--json'), dense: raw.includes('--dense'), detail: 'compact', agents: raw.includes('--agents'), agent: 'all', skeleton: raw.includes('--skeleton') };
const positional = [];
for (let i = 0; i < raw.length; i++) {
  const a = raw[i];
  if (a === '--json' || a === '--dense' || a === '--agents' || a === '--skeleton') continue; // already captured
  else if (a === '--list') positional.push('--list'); // handled per-command
  else if (a === '--detail') { flags.detail = raw[++i]; if (!['brief', 'compact', 'full'].includes(flags.detail)) fail('ERR_INVALID_OPTION', `--detail must be brief|compact|full, got "${flags.detail}"`); }
  else if (a === '--agent') { flags.agent = raw[++i]; if (!['claude', 'codex', 'all'].includes(flags.agent)) fail('ERR_INVALID_OPTION', `--agent must be claude|codex|all, got "${flags.agent}"`); }
  else if (a.startsWith('--')) fail('ERR_INVALID_OPTION', `unknown option "${a}"`);
  else positional.push(a);
}
const command = positional[0];
const args = positional.slice(1);

// ── emit / fail ────────────────────────────────────────────────────────────────────
function emit(type, data, human) {
  if (flags.json) process.stdout.write(JSON.stringify({ type, data }, null, 2) + '\n');
  else process.stdout.write(human() + '\n');
}
function fail(code, message, suggestions = []) {
  if (!CODES.includes(code)) code = 'ERR_UNKNOWN';
  if (flags.json) process.stdout.write(JSON.stringify({ error: message, code, suggestions }, null, 2) + '\n');
  else {
    process.stderr.write(`error [${code}]: ${message}\n`);
    for (const s of suggestions) process.stderr.write(`  did you mean ${s.name}? (${s.reason})\n`);
  }
  process.exit(1);
}

// ── catalog load (query logic is shared with the MCP server via tools/lib/queries.mjs) ──
function loadCatalog() {
  try { return readCatalog(CATALOG_PATH); }
  catch (e) { fail(e.code || 'ERR_NO_CATALOG', e.message); }
}

// ── per-component rendering ──────────────────────────────────────────────────────
// props may be legacy (name/raw/optional/values) or enriched (type/description/default/
// required/passthrough) - render both. Pass-through props point to Base UI instead of a desc.
function propLine(p) {
  const bits = [p.name];
  if (p.required) bits[0] += '*';
  else if (p.optional) bits[0] += '?';
  if (p.values) bits.push(`= ${p.values.join(' | ')}`);
  else if (p.type) bits.push(`: ${p.type}`);
  else if (p.raw) bits.push(`= ${p.raw.startsWith('?') ? p.raw.slice(1) : p.raw}`);
  else if (p.class) bits.push(`(${p.class})`);
  if (p.default != null) bits.push(`(default ${p.default})`);
  if (p.passthrough) bits.push(`-> see ${p.passthrough}`);
  else if (p.description) bits.push(`- ${p.description}`);
  return '  ' + bits.join(' ');
}
function renderComponentDense(c) {
  const lines = [`## ${c.name}  (import from "${c.import}")`, c.summary || ''];
  if (c.keywords?.length) lines.push(`keywords: ${c.keywords.join(', ')}`);
  lines.push('props:');
  if (c.props.length) for (const p of c.props) lines.push(propLine(p)); else lines.push('  (none)');
  if (c.composes.length) lines.push(`composes: ${c.composes.join(', ')}`);
  if (c.usage) lines.push('usage:\n  ' + c.usage);
  return lines.filter(Boolean).join('\n');
}
function renderComponentFull(c) {
  const lines = [
    `${c.name}${c.category ? `   [${c.category}]` : ''}`,
    `  import   ${c.import}`,
    `  layer    ${c.layer}    scope ${JSON.stringify(c.scope)}    status ${c.status}`,
    `  summary  ${c.summary || ''}`,
    `  usecases ${(c.usecases || []).join(', ') || '(none)'}`,
  ];
  if (c.keywords?.length) lines.push(`  keywords ${c.keywords.join(', ')}`);
  lines.push('  props:');
  if (c.props.length) for (const p of c.props) lines.push('  ' + propLine(p)); else lines.push('    (none)');
  if (c.anatomy?.length) {
    lines.push('  anatomy:');
    for (const a of c.anatomy) lines.push(`    ${a.name}${a.required ? '*' : ''} - ${a.description || ''}`);
  }
  if (c.bestPractices?.length) {
    lines.push('  best practices:');
    for (const b of c.bestPractices) lines.push(`    ${b.do ? 'DO   ' : "DON'T"} ${b.text}`);
  }
  lines.push(`  composes ${c.composes.join(', ') || '(none)'}`);
  if (c.related?.length) lines.push(`  related  ${c.related.join(', ')}`);
  lines.push(`  usage    ${c.usage || '(none yet)'}`);
  if (c.examples?.length) {
    lines.push('  examples:');
    for (const ex of c.examples) lines.push(`    ${ex.name}: ${ex.code}${ex.description ? `  (${ex.description})` : ''}`);
  }
  return lines.join('\n');
}

// ── docs registry ────────────────────────────────────────────────────────────────
const DOCS = {
  tokens: { file: 'TOKENS.md', mode: 'index' },
  usage: { file: 'USAGE.md', mode: 'full' },
  brands: { file: 'TOKENS.md', section: '## Modes and brands' },
  density: { file: 'TOKENS.md', section: '## Modes and brands' },
  motion: { file: 'TOKENS.md', section: '### Base / motion' },
};
function readDoc(file) { return fs.readFileSync(path.join(TOKENS, file), 'utf8'); }
function docHeadings(md) {
  return md.split('\n').filter((l) => /^#{2,3}\s/.test(l)).map((l) => l.trim());
}
function docSection(md, section) {
  const lines = md.split('\n');
  const level = (section.match(/^#+/) || [''])[0].length;
  let start = lines.findIndex((l) => l.trim() === section);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s/);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trim();
}

// ── commands ──────────────────────────────────────────────────────────────────────
function cmdComponent() {
  const catalog = loadCatalog();
  if (args[0] === '--list' || raw.includes('--list')) {
    const data = catalog.components.map((c) => ({ name: c.name, import: c.import, layer: c.layer, scope: c.scope, status: c.status }));
    return emit('component.list', { count: data.length, components: data }, () =>
      [`${data.length} components:`, ...data.map((c) => `  ${c.name.padEnd(20)} ${c.layer.padEnd(10)} ${c.status.padEnd(12)} ${c.import}`)].join('\n'));
  }
  const name = args[0];
  if (!name) fail('ERR_INVALID_OPTION', 'component: pass a <Name> or --list.');
  const c = findComponent(catalog, name);
  if (!c) fail('ERR_UNKNOWN_COMPONENT', `no component named "${name}".`, suggestNames(name, catalog.components.map((x) => x.name)));
  return emit('component.detail', c, () => (flags.dense ? renderComponentDense(c) : renderComponentFull(c)));
}

function cmdDocs() {
  const topic = args[0];
  if (!topic) fail('ERR_INVALID_OPTION', 'docs: pass a <topic>.', Object.keys(DOCS).map((t) => ({ name: t, reason: 'available topic' })));
  const spec = DOCS[topic];
  if (!spec) fail('ERR_UNKNOWN_TOPIC', `no docs topic "${topic}".`, suggestNames(topic, Object.keys(DOCS)));
  const md = readDoc(spec.file);
  let content;
  if (spec.mode === 'full') content = md.trim();
  else if (spec.mode === 'index') content = docHeadings(md).join('\n');
  else { content = docSection(md, spec.section); if (content == null) fail('ERR_UNKNOWN_TOPIC', `section "${spec.section}" not found in ${spec.file}.`); }
  return emit('docs.detail', { topic, file: `tokens/${spec.file}`, content }, () => content);
}

function cmdSearch() {
  const query = args.join(' ');
  if (!query) fail('ERR_INVALID_OPTION', 'search: pass a <query>.');
  const catalog = loadCatalog();
  const ranked = searchCatalog(catalog, query);
  return emit('search', { query, results: ranked }, () =>
    ranked.length ? [`${ranked.length} match(es) for "${query}":`, ...ranked.map((r) => `  ${r.name.padEnd(20)} ${r.summary || ''}`)].join('\n') : `no matches for "${query}".`);
}

function cmdImpact() {
  const name = args[0];
  if (!name) fail('ERR_INVALID_OPTION', 'impact: pass a <Name>.');
  const passArgs = [path.join(TOOLS, 'impact.mjs'), name];
  if (flags.json) passArgs.push('--json');
  const res = spawnSync('node', passArgs, { encoding: 'utf8' });
  if (res.status !== 0 && res.status !== null && !flags.json) { process.stderr.write(res.stderr || ''); process.exit(res.status || 1); }
  if (flags.json) {
    let parsed;
    try { parsed = JSON.parse(res.stdout); } catch { fail('ERR_UNKNOWN', `impact did not return JSON: ${res.stderr || res.stdout}`); }
    process.stdout.write(JSON.stringify(parsed, null, 2) + '\n');
  } else {
    process.stdout.write(res.stdout);
  }
}

function cmdDoctor() {
  const checks = [];
  // 1. catalog freshness (inline, no spawn)
  let committed = null;
  try { committed = fs.readFileSync(CATALOG_PATH, 'utf8'); } catch { /* handled below */ }
  if (committed == null) checks.push({ name: 'catalog present', status: 'FAIL', code: 'ERR_NO_CATALOG', detail: 'catalog.json missing; run `npm run catalog`.' });
  else {
    const fresh = buildCatalog().json === committed;
    checks.push({ name: 'catalog fresh', status: fresh ? 'PASS' : 'FAIL', ...(fresh ? {} : { code: 'ERR_STALE_CATALOG' }), detail: fresh ? 'catalog.json matches source metas.' : 'catalog.json is stale; run `npm run catalog`.' });
  }
  // 2. catalog gate
  const gate = spawnSync('node', [path.join(TOOLS, 'catalog-gate.mjs'), path.join(ROOT, 'src')], { encoding: 'utf8' });
  checks.push({ name: 'catalog gate', status: gate.status === 0 ? 'PASS' : 'FAIL', detail: gate.status === 0 ? 'no gate errors.' : 'gate reported errors (run `npm run gate`).' });
  // 3. token-file sanity
  const files = [{ p: path.join(TOKENS, 'tokens.css'), kind: 'css' }, { p: path.join(ROOT, 'standard.json'), kind: 'json' }, { p: CATALOG_PATH, kind: 'json' }];
  let sane = true, badFile = null;
  for (const f of files) {
    try { const t = fs.readFileSync(f.p, 'utf8'); if (f.kind === 'json') JSON.parse(t); else if (!t.includes('{')) throw new Error('empty css'); }
    catch { sane = false; badFile = path.relative(ROOT, f.p); break; }
  }
  checks.push({ name: 'token files parse', status: sane ? 'PASS' : 'FAIL', detail: sane ? 'tokens.css / standard.json / catalog.json all parse.' : `failed to parse ${badFile}.` });
  // 4. WCAG contrast spot-check
  let contrast;
  try { contrast = checkContrast(path.join(TOKENS, 'tokens.css')); } catch (e) { contrast = null; }
  if (!contrast) checks.push({ name: 'wcag contrast', status: 'WARN', detail: 'could not run contrast check.' });
  else {
    const failing = contrast.filter((r) => r.pass === false);
    checks.push({ name: 'wcag contrast', status: failing.length ? 'FAIL' : 'PASS', detail: failing.length ? failing.map((f) => `${f.pair} [${f.mode}] ${f.ratio} < ${f.min}`).join('; ') : `${contrast.length} pairs meet AA.`, pairs: contrast });
  }

  const ok = !checks.some((c) => c.status === 'FAIL');
  emit('doctor', { ok, checks }, () =>
    ['kernel doctor:', ...checks.map((c) => `  ${c.status.padEnd(4)} ${c.name}${c.detail ? ' - ' + c.detail : ''}`), `\n  ${ok ? 'healthy.' : 'FAILures present.'}`].join('\n'));
  if (!ok) process.exit(1);
}

function cmdBuild() {
  const idea = args.join(' ');
  if (!idea) fail('ERR_INVALID_OPTION', 'build: pass an "<idea>".');
  const catalog = loadCatalog();
  const ranked = scoreComponents(idea, catalog.components).slice(0, 6);
  const matches = ranked.map(({ c, score }) => ({ name: c.name, layer: c.layer, import: c.import, score, summary: c.summary }));
  const compose = matches.map((m) => m.name);
  emit('build', { idea, matches, compose }, () =>
    matches.length
      ? [`kit for "${idea}":`, ...matches.map((m) => `  ${m.name.padEnd(20)} ${m.layer.padEnd(10)} ${m.summary || ''}`), `\n  Compose: ${compose.join(' + ')}`].join('\n')
      : `no on-system components matched "${idea}". Try \`kernel component --list\`.`);
}

// ── templates (frame-first reference skeletons under templates/) ───────────────────
function loadTemplates() {
  return walk(TEMPLATES)
    .filter((f) => f.endsWith('.jsx'))
    .map((file) => {
      const source = fs.readFileSync(file, 'utf8');
      const metaText = extractMetaText(source);
      const meta = metaText ? parseMeta(metaText) : {};
      return { ...meta, name: meta.name || path.basename(file, '.jsx'), file, source };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

function cmdTemplate() {
  const templates = loadTemplates();
  if (args[0] === '--list' || raw.includes('--list')) {
    const data = templates.map((t) => ({ name: t.name, title: t.title || null, summary: t.summary || null }));
    return emit('template.list', { count: data.length, templates: data }, () =>
      [`${data.length} templates:`, ...data.map((t) => `  ${t.name.padEnd(14)} ${t.summary || t.title || ''}`)].join('\n'));
  }
  const name = args[0];
  if (!name) fail('ERR_INVALID_OPTION', 'template: pass a <name> or --list.');
  const t = templates.find((x) => x.name === name);
  if (!t) fail('ERR_UNKNOWN_TEMPLATE', `no template named "${name}".`, suggestNames(name, templates.map((x) => x.name)));
  const detail = { name: t.name, title: t.title || null, summary: t.summary || null, regions: t.regions || [], composes: t.composes || [] };
  if (flags.skeleton) {
    return emit('template.detail', { ...detail, skeleton: t.source }, () => t.source);
  }
  return emit('template.detail', detail, () =>
    [`${t.name} - ${t.title || ''}`, `  ${t.summary || ''}`, `  regions:  ${(t.regions || []).join(', ') || '(none)'}`,
     `  composes: ${(t.composes || []).join(', ') || '(none)'}`, `\n  see the layout: kernel template ${t.name} --skeleton`].join('\n'));
}

function cmdInit() {
  if (!flags.agents) fail('ERR_INVALID_OPTION', 'init: pass --agents to write the Kernel agent-docs block.');
  const targets = flags.agent === 'claude' ? ['CLAUDE.md'] : flags.agent === 'codex' ? ['AGENTS.md'] : ['CLAUDE.md', 'AGENTS.md'];
  const block = buildAgentBlock();
  const written = [];
  for (const file of targets) {
    const p = path.join(process.cwd(), file);
    let existing = null;
    try { existing = fs.readFileSync(p, 'utf8'); } catch { /* new file */ }
    const { contents, action } = renderDoc(existing, block);
    fs.writeFileSync(p, contents);
    written.push({ file, action });
  }
  emit('init', { written }, () => ['kernel init --agents:', ...written.map((w) => `  ${w.action.padEnd(9)} ${w.file}`)].join('\n'));
}

// ── help / dispatch ────────────────────────────────────────────────────────────────
const HELP = `kernel - Corilus design-system CLI (a view over catalog.json)

usage: kernel <command> [args] [--json] [--dense] [--detail brief|compact|full]

commands:
  component --list           list every component
  component <Name>           show one component (props, composes, usage)
  docs <topic>               token docs: ${Object.keys(DOCS).join(', ')}
  search <query>             rank components by name/usecases/summary
  impact <Name>              what breaks if you change <Name>
  doctor                     setup + drift + WCAG contrast health
  build "<idea>"             closest component kit + a Compose suggestion
  template --list            list frame-first starter templates
  template <name> --skeleton print a template's frame-first layout
  init --agents              write/refresh the Kernel agent-docs block (CLAUDE.md/AGENTS.md)

global flags: --json (typed {type,data} envelope), --dense (context-window format).
init flags: --agents (required), --agent claude|codex|all (default all).
error codes are stable + append-only; see CLI.md.`;

const COMMANDS = { component: cmdComponent, docs: cmdDocs, search: cmdSearch, impact: cmdImpact, doctor: cmdDoctor, build: cmdBuild, template: cmdTemplate, init: cmdInit };

if (!command || command === 'help' || command === '--help') { process.stdout.write(HELP + '\n'); process.exit(0); }
const handler = COMMANDS[command];
if (!handler) fail('ERR_UNKNOWN', `unknown command "${command}".`, suggestNames(command, Object.keys(COMMANDS)));
handler();
