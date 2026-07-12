#!/usr/bin/env node
// Generates baseline CSF story files for every component in catalog.json.
// Run: node tools/gen-stories.mjs   (add --force to refresh generated baselines)
//
// Output: src/stories/{ComponentName}.stories.jsx — one file per catalog entry, EXCEPT
// deprecated aliases (Btn/PAv/Tip), which get no gallery entry (see tools/lib/taxonomy.mjs).
//
// Each generated file follows the Astryx model (astryx.atmeta.com):
//   - title from tools/lib/taxonomy.mjs  ({Tier}/{Category}/{Family?}/{Name})
//   - a **Playground** story: every prop wired as a control (the Astryx "Properties"
//     sandbox) — grouped Appearance / Content / Events / Accessibility, with the real
//     catalog descriptions, defaults, and required markers.
//   - a **Gallery** story for variant-atoms (renders the variant matrix at a glance).
//   - autodocs Docs page carrying summary + import + Do/Don't + Anatomy from `meta`.
//
// The single source of truth for props/tiers/titles is catalog.json + taxonomy.mjs.
// Hand-crafted files (marked `@hand-authored`) are never overwritten.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { titleFor, importFor, ALIAS_SKIP, ALIAS_OF } from './lib/taxonomy.mjs';

// Reverse the alias map: canonical component name → its deprecated aliases.
const ALIASES_FOR = {};
for (const [alias, canonical] of Object.entries(ALIAS_OF)) {
  (ALIASES_FOR[canonical] ||= []).push(alias);
}

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const outDir = join(root, 'src', 'stories');
const force = process.argv.includes('--force');

const catalog = JSON.parse(readFileSync(join(root, 'catalog.json'), 'utf8'));
const components = catalog.components ?? catalog;

// class → props-table section (Astryx groups Required/Optional; we group by ownership,
// which reads the same way and matches the Standard's prop-class vocabulary).
const CLASS_CATEGORY = {
  dsPresentation: 'Appearance',
  content: 'Content',
  event: 'Events',
  a11y: 'Accessibility',
  passThroughControl: 'Base UI (pass-through)',
};

function jsKey(name) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `'${name}'`;
}

// Map a catalog prop to a Storybook control descriptor, or null to disable the control.
function controlFor(prop) {
  const t = (prop.type || '').toLowerCase();
  if (Array.isArray(prop.values) && prop.values.length) return { control: 'select', options: prop.values };
  if (t === 'bool' || t === 'boolean') return { control: 'boolean' };
  if (t === 'number') return { control: 'number' };
  if (t === 'string') return { control: 'text' };
  if (prop.name === 'children' && (t.includes('node') || t.includes('string'))) return { control: 'text' };
  // node / element / object / fn / array / unknown: no safe generic control
  return { control: false };
}

// A safe baseline arg value (as a JS-source string), or null to omit the prop.
function defaultArg(prop) {
  const t = (prop.type || '').toLowerCase();
  if (prop.name === 'className' || prop.name === 'style' || prop.name === 'ref') return null;
  // `example` in the prop meta is the single source of realistic data shared by the CLI/MCP
  // docs AND the Storybook Playground. Inline any JSON-serializable example (arrays, objects,
  // strings, numbers, bools) so data-driven components (Sparkline, FieldList, …) render with
  // real content instead of empty.
  if (prop.example !== undefined) {
    try { return JSON.stringify(prop.example); } catch { /* non-serializable → fall through */ }
  }
  if (prop.default !== undefined && (typeof prop.default === 'string' || typeof prop.default === 'number' || typeof prop.default === 'boolean')) {
    return JSON.stringify(prop.default);
  }
  if (Array.isArray(prop.values) && prop.values.length) return JSON.stringify(prop.values[0]);
  if (t === 'bool' || t === 'boolean') return 'false';
  if (t === 'number') return '0';
  if (prop.name === 'children') return '"Content"';
  if (prop.name === 'label' || prop.name === 'title') return JSON.stringify('Label');
  // Plain string props (as, tone, placeholder, …) are left to the control — seeding them
  // with the prop name produced garbage like as="as" (an invalid element tag).
  return null; // string / node / element / object / fn / array / unknown → omit
}

// Compose the autodocs component description (Astryx "Overview": usage + Do/Don't +
// anatomy). Returns a real markdown string; the caller embeds it via JSON.stringify.
function descriptionMarkdown(comp, imp) {
  const parts = [];
  if (comp.summary) parts.push(comp.summary);
  parts.push('**Import**\n\n```ts\nimport { ' + comp.name + " } from '" + imp + "'\n```");
  const bp = Array.isArray(comp.bestPractices) ? comp.bestPractices : [];
  const dos = bp.filter(b => b.do).map(b => '- ' + b.text);
  const donts = bp.filter(b => !b.do).map(b => '- ' + b.text);
  if (dos.length) parts.push('**Do**\n' + dos.join('\n'));
  if (donts.length) parts.push("**Don't**\n" + donts.join('\n'));
  const anatomy = Array.isArray(comp.anatomy) ? comp.anatomy : [];
  if (anatomy.length) {
    parts.push('**Anatomy**\n' + anatomy.map(a =>
      `- **${a.name}**${a.required ? '' : ' _(optional)_'} — ${a.description || ''}`).join('\n'));
  }
  const aliases = ALIASES_FOR[comp.name];
  if (aliases && aliases.length) {
    const list = aliases.map(a => `\`${a}\``).join(', ');
    parts.push(`> **Deprecated alias:** ${list} ${aliases.length > 1 ? 'are' : 'is'} a deprecated alias of \`${comp.name}\` — use \`${comp.name}\`. The alias will be removed in the next major and has no separate story.`);
  }
  return parts.join('\n\n');
}

// Emit the argTypes block lines for a component's props.
function argTypesBlock(props) {
  const lines = [];
  for (const p of props) {
    if (p.name === 'ref') continue;
    const ctrl = controlFor(p);
    const bits = [];
    if (ctrl.control === false) bits.push(`control: false`);
    else if (ctrl.options) bits.push(`control: 'select', options: ${JSON.stringify(ctrl.options)}`);
    else bits.push(`control: '${ctrl.control}'`);
    if (p.description) bits.push(`description: ${JSON.stringify(p.description)}`);
    else if (p.passthrough) bits.push(`description: ${JSON.stringify('Pass-through → see Base UI: ' + p.passthrough)}`);
    if (p.required) bits.push(`type: { name: 'other', value: '${(p.type || 'any').replace(/'/g, "\\'")}', required: true }`);
    const tableBits = [`category: '${CLASS_CATEGORY[p.class] || 'Other'}'`];
    if (p.default !== undefined) tableBits.push(`defaultValue: { summary: ${JSON.stringify(String(p.default))} }`);
    if (p.type) tableBits.push(`type: { summary: ${JSON.stringify(p.type)} }`);
    bits.push(`table: { ${tableBits.join(', ')} }`);
    lines.push(`    ${jsKey(p.name)}: { ${bits.join(', ')} },`);
  }
  return lines;
}

// Should this component get a Gallery (variant matrix)? Safe only when it renders from a
// text-ish label/children AND has a values-bearing appearance prop.
function galleryPlan(props) {
  const variantProp = props.find(p => p.class === 'dsPresentation' && Array.isArray(p.values) && p.values.length > 1);
  const takesText = props.find(p => (p.name === 'children' || p.name === 'label') && /node|string/i.test(p.type || ''));
  if (variantProp && takesText) return { variantProp, textProp: takesText.name };
  return null;
}

mkdirSync(outDir, { recursive: true });
let written = 0, skipped = 0, removed = 0;

// Remove stale alias story files (Btn/PAv/Tip) — deprecated aliases get no gallery entry.
for (const alias of ALIAS_SKIP) {
  const f = join(outDir, `${alias}.stories.jsx`);
  if (existsSync(f)) { rmSync(f); removed++; }
}

for (const comp of components) {
  if (ALIAS_SKIP.has(comp.name)) continue;
  const title = titleFor(comp);
  if (!title) continue;

  const outFile = join(outDir, `${comp.name}.stories.jsx`);
  if (existsSync(outFile)) {
    if (!force || readFileSync(outFile, 'utf8').includes('@hand-authored')) { skipped++; continue; }
  }

  const imp = importFor(comp);
  const allProps = comp.props ?? [];
  const props = allProps.filter(p => p.class !== 'passThroughControl');
  const argTypes = argTypesBlock(props);
  // Args come from non-passthrough props (their defaultArg), PLUS any passthrough prop that
  // carries an explicit `example` — Base UI owns the control, but a seeded value stops
  // data-driven primitives (Progress/Slider/Stepper) rendering as NaN with no value.
  const passthroughSeed = allProps
    .filter(p => p.class === 'passThroughControl' && p.example !== undefined)
    .map(p => ({ p, v: JSON.stringify(p.example) }));
  const argLines = props
    .map(p => ({ p, v: defaultArg(p) }))
    .filter(({ v }) => v !== null)
    .concat(passthroughSeed)
    .map(({ p, v }) => `    ${jsKey(p.name)}: ${v},`);

  const gallery = galleryPlan(props);
  const usageCode = (comp.usage ?? `<${comp.name} />`).replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  const lines = [];
  lines.push(`import { ${comp.name} } from '${imp}';`, ``);
  lines.push(`export default {`);
  lines.push(`  title: '${title}',`);
  lines.push(`  component: ${comp.name},`);
  lines.push(`  tags: ['autodocs'],`);
  if (argTypes.length) { lines.push(`  argTypes: {`, ...argTypes, `  },`); }
  lines.push(`  parameters: {`);
  lines.push(`    docs: { description: { component: ${JSON.stringify(descriptionMarkdown(comp, imp))} } },`);
  lines.push(`  },`);
  lines.push(`};`, ``);

  // Playground — the Astryx "Properties" sandbox.
  lines.push(`export const Playground = {`);
  if (argLines.length) { lines.push(`  args: {`, ...argLines, `  },`); }
  lines.push(`  parameters: { docs: { source: { code: \`${usageCode}\` } } },`);
  lines.push(`};`, ``);

  // Gallery — the Astryx "Overview" hero, when safe to auto-render.
  if (gallery) {
    lines.push(`export const Gallery = {`);
    lines.push(`  parameters: { controls: { disable: true } },`);
    lines.push(`  render: () => (`);
    lines.push(`    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>`);
    lines.push(`      {${JSON.stringify(gallery.variantProp.values)}.map((v) => (`);
    lines.push(`        <${comp.name} key={v} ${gallery.variantProp.name}={v}>{v}</${comp.name}>`);
    lines.push(`      ))}`);
    lines.push(`    </div>`);
    lines.push(`  ),`);
    lines.push(`};`, ``);
  }

  writeFileSync(outFile, lines.join('\n'));
  written++;
}

console.log(`gen-stories: wrote ${written}, skipped ${skipped} (hand-authored / existing), removed ${removed} alias`);
