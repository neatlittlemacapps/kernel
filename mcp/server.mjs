#!/usr/bin/env node
// Kernel MCP server (grove BACKLOG B-32) - a live query surface over catalog.json.
//
// Exposes two MCP tools, `search(query)` and `get(name)`, that mirror the `kernel` CLI's
// projections exactly (shared code in tools/lib/queries.mjs), so an MCP client (Claude Code,
// Desktop, Cursor) - and, via grove B-33, the design skills - can query Kernel as data.
//
// Zero-dependency: the MCP stdio transport is newline-delimited JSON-RPC 2.0, hand-rolled here
// with Node built-ins only, so @corilus/kernel keeps zero runtime AND zero dev dependencies. The
// query logic is shared, so swapping in the official MCP SDK later would be a thin transport swap.

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadCatalog, findComponent, searchCatalog, suggestNames } from '../tools/lib/queries.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', 'catalog.json');
const SERVER_NAME = 'kernel';
const DEFAULT_PROTOCOL = '2025-06-18';

export const TOOLS = [
  {
    name: 'search',
    description: 'Search the Kernel component catalog. Ranks components by name, use-cases, and summary.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Free-text query, e.g. "toggle" or "medication list".' } },
      required: ['query'],
    },
  },
  {
    name: 'get',
    description: 'Get one Kernel component: import path, props (with values/tokens), composes, and a usage snippet.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Component name, e.g. "Btn" or "SproutCard".' } },
      required: ['name'],
    },
  },
];

// JSON-RPC helpers ------------------------------------------------------------------
const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const err = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
// MCP tool results wrap data in a content[] array; structuredContent carries the typed payload.
const toolResult = (data, isError = false) => ({
  content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  structuredContent: data,
  ...(isError ? { isError: true } : {}),
});

// tool handlers (over the shared query layer) ---------------------------------------
function callTool(name, args, catalog) {
  if (name === 'search') {
    const query = (args && args.query) || '';
    if (!query) return toolResult({ error: 'search requires a "query" argument.' }, true);
    return toolResult({ query, results: searchCatalog(catalog, query) });
  }
  if (name === 'get') {
    const compName = args && args.name;
    if (!compName) return toolResult({ error: 'get requires a "name" argument.' }, true);
    const c = findComponent(catalog, compName);
    if (!c) return toolResult({ error: `no component named "${compName}".`, suggestions: suggestNames(compName, catalog.components.map((x) => x.name)) }, true);
    return toolResult(c);
  }
  return null; // unknown tool -> caller emits an error
}

// dispatch one JSON-RPC message. Returns a response object, or null for notifications. ----
export function dispatch(msg, catalog) {
  const { id, method, params } = msg || {};
  // JSON-RPC notifications (no id) never get a response, whatever the method. None of this
  // server's methods have side effects, so a notification is simply a no-op.
  if (id === undefined || id === null) return null;

  switch (method) {
    case 'initialize':
      return ok(id, {
        protocolVersion: (params && params.protocolVersion) || DEFAULT_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: catalog.standardVersion || '0.0.0' },
      });
    case 'ping':
      return ok(id, {});
    case 'tools/list':
      return ok(id, { tools: TOOLS });
    case 'tools/call': {
      const toolName = params && params.name;
      const result = callTool(toolName, params && params.arguments, catalog);
      if (result === null) return err(id, -32602, `unknown tool "${toolName}".`);
      return ok(id, result);
    }
    default:
      return err(id, -32601, `method not found: ${method}`);
  }
}

// stdio main loop (newline-delimited JSON-RPC) --------------------------------------
function main() {
  let catalog;
  try { catalog = loadCatalog(CATALOG_PATH); }
  catch (e) {
    process.stderr.write(`kernel-mcp: ${e.message}\n`);
    process.exit(1);
  }
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let msg;
    try { msg = JSON.parse(trimmed); }
    catch { process.stdout.write(JSON.stringify(err(null, -32700, 'parse error')) + '\n'); return; }
    const res = dispatch(msg, catalog);
    if (res !== null) process.stdout.write(JSON.stringify(res) + '\n');
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
