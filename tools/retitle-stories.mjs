#!/usr/bin/env node
// One-shot (idempotent) migration: rewrite the `title:` line of every story file to the
// taxonomy in tools/lib/taxonomy.mjs, so hand-authored and generated stories share one
// tree. Only the title line is touched; story bodies are left alone. Alias files
// (Btn/PAv/Tip) are removed. Run: node tools/retitle-stories.mjs

import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { titleFor, ALIAS_SKIP } from './lib/taxonomy.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const outDir = join(root, 'src', 'stories');
const catalog = JSON.parse(readFileSync(join(root, 'catalog.json'), 'utf8'));
const byName = new Map((catalog.components ?? catalog).map(c => [c.name, c]));

let retitled = 0, removed = 0, unchanged = 0, unknown = 0;

for (const file of readdirSync(outDir)) {
  if (!file.endsWith('.stories.jsx')) continue;
  const name = file.replace(/\.stories\.jsx$/, '');
  const path = join(outDir, file);

  if (ALIAS_SKIP.has(name)) { rmSync(path); removed++; continue; }

  const entry = byName.get(name);
  if (!entry) { unknown++; continue; }        // no catalog entry → leave as-is
  const title = titleFor(entry);
  if (!title) { rmSync(path); removed++; continue; }

  const src = readFileSync(path, 'utf8');
  const next = src.replace(/title:\s*(['"`])[^'"`]*\1/, `title: '${title}'`);
  if (next === src) { unchanged++; continue; }
  writeFileSync(path, next);
  retitled++;
}

console.log(`retitle-stories: retitled ${retitled}, unchanged ${unchanged}, removed ${removed} alias, no-catalog-entry ${unknown}`);
