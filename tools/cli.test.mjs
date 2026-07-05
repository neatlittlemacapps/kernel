// Kernel CLI + contrast tests (grove BACKLOG B-30). Bare `node --test`, zero-dep.
// Asserts the {type,data} envelope shapes, the stable error codes, and the WCAG math.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastRatio, checkContrast } from './lib/contrast.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BIN = path.join(ROOT, 'bin', 'kernel.mjs');

function run(...args) {
  const r = spawnSync('node', [BIN, ...args], { encoding: 'utf8' });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch { /* not json */ }
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, json };
}

test('component --list --json returns component.list with every component', () => {
  const { status, json } = run('component', '--list', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'component.list');
  assert.ok(json.data.count >= 30);
  assert.ok(json.data.components.some((c) => c.name === 'Btn'));
});

test('component <Name> --json returns component.detail with props + usage', () => {
  const { status, json } = run('component', 'Btn', '--json');
  assert.equal(status, 0);
  assert.equal(json.type, 'component.detail');
  assert.equal(json.data.name, 'Btn');
  const variant = json.data.props.find((p) => p.name === 'variant');
  assert.deepEqual(variant.values, ['primary', 'secondary']);
  assert.ok(json.data.usage.includes('<Btn'));
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
