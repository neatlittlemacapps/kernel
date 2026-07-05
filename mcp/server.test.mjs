// Kernel MCP server tests (grove BACKLOG B-32). Bare `node --test`, zero-dep.
// Unit-tests `dispatch` for every method/branch, plus one end-to-end stdio exchange.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dispatch, TOOLS } from './server.mjs';
import { loadCatalog } from '../tools/lib/queries.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const SERVER = path.join(HERE, 'server.mjs');
const catalog = loadCatalog(path.join(ROOT, 'catalog.json'));

const req = (id, method, params) => ({ jsonrpc: '2.0', id, method, params });

test('initialize echoes protocolVersion and reports serverInfo', () => {
  const r = dispatch(req(1, 'initialize', { protocolVersion: '2025-06-18' }), catalog);
  assert.equal(r.id, 1);
  assert.equal(r.result.protocolVersion, '2025-06-18');
  assert.equal(r.result.serverInfo.name, 'kernel');
  assert.ok(r.result.capabilities.tools);
});

test('initialize falls back to a default protocolVersion', () => {
  const r = dispatch(req(1, 'initialize', {}), catalog);
  assert.match(r.result.protocolVersion, /^\d{4}-\d{2}-\d{2}$/);
});

test('tools/list returns the two tools with input schemas', () => {
  const r = dispatch(req(2, 'tools/list', {}), catalog);
  const names = r.result.tools.map((t) => t.name).sort();
  assert.deepEqual(names, ['get', 'search']);
  for (const t of r.result.tools) assert.equal(t.inputSchema.type, 'object');
  assert.equal(TOOLS.length, 2);
});

test('tools/call search ranks the obvious component first', () => {
  const r = dispatch(req(3, 'tools/call', { name: 'search', arguments: { query: 'toggle' } }), catalog);
  assert.equal(r.result.content[0].type, 'text');
  assert.equal(r.result.structuredContent.results[0].name, 'Toggle');
  assert.ok(!r.result.isError);
});

test('tools/call get returns the component detail', () => {
  const r = dispatch(req(4, 'tools/call', { name: 'get', arguments: { name: 'Btn' } }), catalog);
  assert.equal(r.result.structuredContent.name, 'Btn');
  assert.ok(r.result.structuredContent.usage.includes('<Btn'));
});

test('tools/call get unknown -> isError + suggestions', () => {
  const r = dispatch(req(5, 'tools/call', { name: 'get', arguments: { name: 'Togle' } }), catalog);
  assert.equal(r.result.isError, true);
  assert.ok(r.result.structuredContent.suggestions.some((s) => s.name === 'Toggle'));
});

test('tools/call unknown tool -> -32602', () => {
  const r = dispatch(req(6, 'tools/call', { name: 'nope', arguments: {} }), catalog);
  assert.equal(r.error.code, -32602);
});

test('unknown method with id -> -32601', () => {
  const r = dispatch(req(7, 'resources/list', {}), catalog);
  assert.equal(r.error.code, -32601);
});

test('notifications get no response (any method, incl. known ones)', () => {
  assert.equal(dispatch({ jsonrpc: '2.0', method: 'notifications/initialized' }, catalog), null);
  assert.equal(dispatch({ jsonrpc: '2.0', method: 'resources/list' }, catalog), null); // unknown, no id
  assert.equal(dispatch({ jsonrpc: '2.0', method: 'tools/list' }, catalog), null); // known method, but no id => notification, no reply
});

test('end-to-end: initialize -> tools/list -> tools/call over stdio', async () => {
  const proc = spawn('node', [SERVER], { stdio: ['pipe', 'pipe', 'inherit'] });
  const frames = [
    req(1, 'initialize', { protocolVersion: '2025-06-18' }),
    { jsonrpc: '2.0', method: 'notifications/initialized' }, // no response expected
    req(2, 'tools/list', {}),
    req(3, 'tools/call', { name: 'get', arguments: { name: 'Btn' } }),
  ];
  let out = '';
  proc.stdout.on('data', (d) => { out += d; });
  for (const f of frames) proc.stdin.write(JSON.stringify(f) + '\n');
  proc.stdin.end();
  await new Promise((resolve) => proc.on('close', resolve));

  const responses = out.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  assert.equal(responses.length, 3); // the notification produced no line
  assert.equal(responses[0].result.serverInfo.name, 'kernel');
  assert.deepEqual(responses[1].result.tools.map((t) => t.name).sort(), ['get', 'search']);
  assert.equal(responses[2].result.structuredContent.name, 'Btn');
});
