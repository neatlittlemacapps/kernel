// Bare `node --test`, zero-dep. Loads the real tokens/*.tokens.json files from disk and
// asserts buildTokenGraph() finds real, known edges -- not just that it doesn't crash.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokenGraph, allRefs, activeSetsFor } from './lib/token-graph.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_ROOT = join(ROOT, 'tokens');

function loadAll() {
  const resolver = JSON.parse(readFileSync(join(TOKENS_ROOT, 'theme.resolver.json'), 'utf8'));
  const files = new Map();
  for (const ref of allRefs(resolver)) {
    files.set(ref, JSON.parse(readFileSync(join(TOKENS_ROOT, ref), 'utf8')));
  }
  return { resolver, files };
}

test('buildTokenGraph finds one node per token set from theme.resolver.json', () => {
  const { resolver, files } = loadAll();
  const { nodes } = buildTokenGraph(files, resolver);
  const ids = nodes.map((n) => n.id).sort();
  assert.ok(ids.includes('primitives/colors'));
  assert.ok(ids.includes('brand/corilus'));
  assert.ok(ids.includes('semantic/light'));
  assert.ok(ids.includes('components/button'));
  assert.equal(new Set(ids).size, ids.length, 'node ids must be unique');
});

test('semantic/light aliases brand/corilus via action.solid -> brand.primary-deep', () => {
  const { resolver, files } = loadAll();
  const { edges } = buildTokenGraph(files, resolver);
  const edge = edges.find(
    (e) => e.from === 'semantic/light' && e.to === 'brand/corilus' && e.kinds.includes('alias'),
  );
  assert.ok(edge, 'expected an alias edge semantic/light -> brand/corilus');
  assert.ok(
    edge.pairs.includes('action.solid -> brand.primary-deep'),
    `expected action.solid -> brand.primary-deep among ${JSON.stringify(edge.pairs)}`,
  );
});

test('brand modifier cascade: semble and myneva are additive over corilus', () => {
  const { resolver, files } = loadAll();
  const { edges } = buildTokenGraph(files, resolver);
  assert.ok(edges.some((e) => e.from === 'brand/semble' && e.to === 'brand/corilus' && e.kinds.includes('cascade')));
  assert.ok(edges.some((e) => e.from === 'brand/myneva' && e.to === 'brand/corilus' && e.kinds.includes('cascade')));
});

test('theme modifier cascade: dark is additive over light', () => {
  const { resolver, files } = loadAll();
  const { edges } = buildTokenGraph(files, resolver);
  assert.ok(edges.some((e) => e.from === 'semantic/dark' && e.to === 'semantic/light' && e.kinds.includes('cascade')));
});

test('activeSetsFor: selecting brand=semble activates corilus base + semble delta, not myneva', () => {
  const { resolver } = loadAll();
  const active = activeSetsFor(resolver, { brand: 'semble', theme: 'light', breakpoint: 'desktop', density: 'comfortable' });
  assert.ok(active.has('brand/corilus'));
  assert.ok(active.has('brand/semble'));
  assert.ok(!active.has('brand/myneva'));
});

test('activeSetsFor: selecting theme=light does not activate semantic/dark', () => {
  const { resolver } = loadAll();
  const active = activeSetsFor(resolver, { brand: 'corilus', theme: 'light', breakpoint: 'desktop', density: 'comfortable' });
  assert.ok(active.has('semantic/light'));
  assert.ok(!active.has('semantic/dark'));
});

test('activeSetsFor: primitives and components tiers are always active', () => {
  const { resolver } = loadAll();
  const active = activeSetsFor(resolver, {});
  assert.ok(active.has('primitives/colors'));
  assert.ok(active.has('components/button'));
  assert.ok(active.has('semantic/foundations'));
});
