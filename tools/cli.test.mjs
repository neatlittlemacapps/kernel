// Kernel CLI + contrast tests (grove BACKLOG B-30). Bare `node --test`, zero-dep.
// Asserts the {type,data} envelope shapes, the stable error codes, and the WCAG math.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastRatio, checkContrast } from './lib/contrast.mjs';
import { renderDoc } from './gen-agent-docs.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BIN = path.join(ROOT, 'bin', 'kernel.mjs');

function run(...args) {
  const r = spawnSync('node', [BIN, ...args], { encoding: 'utf8' });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch { /* not json */ }
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, json };
}
function runIn(cwd, ...args) {
  const r = spawnSync('node', [BIN, ...args], { cwd, encoding: 'utf8' });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch { /* not json */ }
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, json };
}
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'kernel-init-'));

test('component --list --json returns component.list with every component', () => {
  const { status, json } = run('component', '--list', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'component.list');
  assert.ok(json.data.count >= 30);
  assert.ok(json.data.components.some((c) => c.name === 'Btn'));
});

test('component <Name> --json returns component.detail with props + usage', () => {
  const { status, json } = run('component', 'Button', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'component.detail');
  assert.equal(json.data.name, 'Button');
  const variant = json.data.props.find((p) => p.name === 'variant');
  assert.deepEqual(variant.values, ['primary', 'secondary', 'tertiary']);
  assert.ok(json.data.usage.includes('<Button'));
});

test('deprecated alias surfaces its successor (Btn -> Button)', () => {
  const { status, json } = run('component', 'Btn', '--json');
  assert.equal(status, 0);
  assert.equal(json.data.status, 'deprecated');
  assert.equal(json.data.deprecated, 'Button');
});

test('unknown component -> ERR_UNKNOWN_COMPONENT + suggestion + non-zero exit', () => {
  const { status, json } = run('component', 'Togle', '--json'); // near-miss of Toggle
  assert.equal(status, 1);
  assert.equal(json.code, 'ERR_UNKNOWN_COMPONENT');
  assert.ok(json.suggestions.length >= 1);
  assert.ok(json.suggestions.some((s) => s.name === 'Toggle'));
});

test('docs tokens --json returns docs.detail', () => {
  const { status, json } = run('docs', 'tokens', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'docs.detail');
  assert.ok(json.data.content.length > 0);
});

test('unknown topic -> ERR_UNKNOWN_TOPIC + suggestion', () => {
  const { status, json } = run('docs', 'token', '--json'); // near-miss of tokens
  assert.equal(status, 1);
  assert.equal(json.code, 'ERR_UNKNOWN_TOPIC');
  assert.ok(json.suggestions.some((s) => s.name === 'tokens'));
});

test('search ranks the obvious component first', () => {
  const { status, json } = run('search', 'toggle', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'search');
  assert.equal(json.data.results[0].name, 'Toggle');
});

test('build "<idea>" returns a kit naming the relevant components', () => {
  const { status, json } = run('build', 'medication list', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'build');
  assert.ok(json.data.compose.includes('MedicationCard'));
});

test('impact <Name> --json returns the impact envelope', () => {
  const { status, json } = run('impact', 'Card', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'impact');
  assert.equal(json.data.target, 'Card');
  assert.ok(json.data.dependentCount >= 6);
});

test('doctor --json is healthy on the clean tree', () => {
  const { status, json } = run('doctor', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'doctor');
  assert.equal(json.data.ok, true);
});

test('unknown option -> ERR_INVALID_OPTION', () => {
  const { status, json } = run('component', '--nope', '--json');
  assert.equal(status, 1);
  assert.equal(json.code, 'ERR_INVALID_OPTION');
});

test('template --list returns the seeded templates', () => {
  const { status, json } = run('template', '--list', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'template.list');
  const names = json.data.templates.map((t) => t.name).sort();
  assert.deepEqual(names, ['ai-chat', 'list-detail', 'settings']);
});

test('template <name> --skeleton prints frame-first JSX composing Kernel', () => {
  const { status, stdout } = run('template', 'settings', '--skeleton');
  assert.equal(status, 0);
  assert.ok(stdout.includes('region:')); // frame-first region markers
  assert.ok(stdout.includes('<main')); // structural frame element
  assert.ok(stdout.includes('PropertyList') && stdout.includes('@corilus/kernel')); // real Kernel component
  assert.ok(!/<button[\s/>]/.test(stdout)); // no raw controls
});

test('template <name> --json (detail) carries regions + composes', () => {
  const { status, json } = run('template', 'ai-chat', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'template.detail');
  assert.ok(json.data.regions.length > 0);
  assert.ok(json.data.composes.includes('AIBadge'));
});

test('unknown template -> ERR_UNKNOWN_TEMPLATE + suggestion', () => {
  const { status, json } = run('template', 'setings', '--json');
  assert.equal(status, 1);
  assert.equal(json.code, 'ERR_UNKNOWN_TEMPLATE');
  assert.ok(json.suggestions.some((s) => s.name === 'settings'));
});

test('init --agents writes a delimited block reflecting standard + catalog', () => {
  const dir = tmp();
  const r = runIn(dir, 'init', '--agents');
  assert.equal(r.status, 0);
  const claude = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
  assert.ok(claude.includes('<!-- KERNEL:START -->') && claude.includes('<!-- KERNEL:END -->'));
  assert.ok(claude.includes('isOpen')); // banned prop from standard.json
  assert.ok(claude.includes('SproutCard')); // component from catalog.json
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')));
});

test('init --agents is idempotent and preserves content outside the markers', () => {
  const dir = tmp();
  runIn(dir, 'init', '--agents');
  const claude = path.join(dir, 'CLAUDE.md');
  fs.appendFileSync(claude, '\n# my notes\nkeep me\n');
  const snapshot = fs.readFileSync(claude, 'utf8');
  const r = runIn(dir, 'init', '--agents');
  assert.equal(r.status, 0);
  const after = fs.readFileSync(claude, 'utf8');
  assert.ok(after.includes('keep me'));
  assert.equal(after, snapshot); // byte-identical: only between-markers is managed, and it was fresh
});

test('init --agent claude writes only CLAUDE.md', () => {
  const dir = tmp();
  const r = runIn(dir, 'init', '--agents', '--agent', 'claude');
  assert.equal(r.status, 0);
  assert.ok(fs.existsSync(path.join(dir, 'CLAUDE.md')));
  assert.ok(!fs.existsSync(path.join(dir, 'AGENTS.md')));
});

test('renderDoc replaces only between markers', () => {
  const block = '<!-- KERNEL:START -->\nNEW\n<!-- KERNEL:END -->';
  const existing = 'top\n<!-- KERNEL:START -->\nOLD\n<!-- KERNEL:END -->\nbottom\n';
  const { contents, action } = renderDoc(existing, block);
  assert.equal(action, 'refreshed');
  assert.ok(contents.startsWith('top\n') && contents.endsWith('bottom\n'));
  assert.ok(contents.includes('NEW') && !contents.includes('OLD'));
});

test('catalog gate flags a non-forwardRef render target (seeded fixture)', () => {
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'catalog-gate.mjs'), path.join(ROOT, 'tools', 'fixtures')], { encoding: 'utf8' });
  assert.equal(r.status, 1); // guard mode exits 1 on an error
  assert.match(r.stdout, /forwardref-render-target/);
  assert.match(r.stdout, /BadChip/);
  // fires once per component per file, not once per textual match (comment + use)
  assert.equal((r.stdout.match(/forwardref-render-target/g) || []).length, 1);
});

test('catalog gate flags an empty summary (documentation floor)', () => {
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'catalog-gate.mjs'), path.join(ROOT, 'tools', 'fixtures')], { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /missing-summary/);
  assert.match(r.stdout, /NoSummary/);
});

test('extractMetaText is comment-aware (apostrophe + brace in a comment do not break it)', async () => {
  const { extractMetaText, parseMeta } = await import('./lib/meta.mjs');
  const src = "export const meta = {\n  X: { summary: 'ok', // the dev's note for { a, b }\n  props: {} },\n};\n";
  const text = extractMetaText(src);
  assert.ok(text, 'meta should extract despite the comment');
  assert.equal(Object.keys(parseMeta(text))[0], 'X');
});

test('component detail renders enriched fields (Button)', () => {
  const { json } = run('component', 'Button', '--json');
  assert.ok(json.data.keywords.includes('cta'));
  assert.equal(json.data.category, 'Action');
  const variant = json.data.props.find((p) => p.name === 'variant');
  assert.ok(variant.description && variant.description.length > 0);
  const disabled = json.data.props.find((p) => p.name === 'disabled');
  assert.equal(disabled.passthrough, 'BaseUI.Button.disabled');
  assert.ok(Array.isArray(json.data.bestPractices) && json.data.bestPractices.length > 0);
});

test('search matches keywords (cta -> Btn)', () => {
  const { json } = run('search', 'cta', '--json');
  assert.ok(json.data.results.some((r) => r.name === 'Btn'));
});

test('contrast math: black on white is 21:1', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff')), 21);
});

test('real tokens pass the WCAG spot-check (no failing pairs)', () => {
  const results = checkContrast(path.join(ROOT, 'tokens', 'tokens.css'));
  assert.ok(results.length > 0);
  assert.equal(results.filter((r) => r.pass === false).length, 0);
  // every pair must resolve to a real ratio (a null would silently skip, e.g. a renamed token).
  assert.equal(results.filter((r) => r.pass === null).length, 0);
});
