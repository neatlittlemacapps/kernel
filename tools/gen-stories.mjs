#!/usr/bin/env node
// Generates baseline CSF story files for every component in catalog.json.
// Run: node tools/gen-stories.mjs
// Add --force to overwrite existing story files (default: skip existing).
//
// Output: src/stories/{ComponentName}.stories.jsx
// Each file gets:
//   - a Default story built from the `usage` snippet as a code reference
//   - argTypes derived from the `props` array
//   - tags: ['autodocs']
//   - title: Kernel/{Layer}/{Category}/{ComponentName}
//
// The single source of truth for props is catalog.json.
// Re-run after updating catalog.json to refresh baselines; hand-crafted files
// are protected unless --force is passed.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const catalogPath = join(root, 'catalog.json');
const outDir = join(root, 'src', 'stories');
const force = process.argv.includes('--force');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const components = catalog.components ?? catalog;

// Components that ship in the ./chat subpath
const CHAT_COMPONENTS = new Set(['ChatBubble', 'PromptField', 'Transcript', 'TypingIndicator']);
// Components that ship in the ./clinical subpath
const CLINICAL_COMPONENTS = new Set(['AllergyCard', 'ConditionCard', 'DemographicCard', 'LabResultCard', 'MedicationCard']);

function importPath(name) {
  if (CHAT_COMPONENTS.has(name)) return '@corilus/kernel/chat';
  if (CLINICAL_COMPONENTS.has(name)) return '@corilus/kernel/clinical';
  return '@corilus/kernel';
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Map catalog prop types to Storybook control types
function propToControl(prop) {
  const t = (prop.type || '').toLowerCase();
  if (prop.values && prop.values.length > 0) {
    return { control: 'select', options: prop.values };
  }
  if (t === 'bool' || t === 'boolean') return { control: 'boolean' };
  if (t === 'number') return { control: 'number' };
  if (t === 'node' || t === 'reactnode' || t === 'reactelement') return { control: 'text' };
  if (t === 'fn' || t.startsWith('(')) return { control: false };
  return { control: 'text' };
}

// Build a plausible default arg value from a prop
function defaultArg(prop) {
  const t = (prop.type || '').toLowerCase();
  if (prop.values && prop.values.length > 0) return JSON.stringify(prop.values[0]);
  if (t === 'bool' || t === 'boolean') return 'false';
  if (t === 'number') return '0';
  if (t === 'fn' || t.startsWith('(')) return '() => {}';
  if (t === 'node' || t === 'reactnode' || t === 'reactelement') return '"..."';
  if (prop.name === 'children') return '"Content"';
  if (prop.name === 'label' || prop.name === 'title') return `"${prop.name}"`;
  return 'undefined';
}

mkdirSync(outDir, { recursive: true });

let written = 0;
let skipped = 0;

for (const comp of components) {
  const outFile = join(outDir, `${comp.name}.stories.jsx`);

  if (existsSync(outFile) && !force) {
    skipped++;
    continue;
  }

  const layer = capitalize(comp.layer ?? 'atom');
  const category = comp.category ?? 'Misc';
  const imp = importPath(comp.name);

  // Build argTypes block
  const props = comp.props ?? [];
  const contentProps = props.filter(p => p.class !== 'pass-through' && p.name !== 'ref');
  const argTypesLines = contentProps.map(p => {
    const ctrl = propToControl(p);
    const desc = p.description ? p.description.replace(/"/g, '\\"').slice(0, 120) : '';
    let ctrlStr;
    if (ctrl.options) {
      ctrlStr = `{ control: 'select', options: ${JSON.stringify(ctrl.options)} }`;
    } else if (ctrl.control === false) {
      ctrlStr = `{ control: false }`;
    } else {
      ctrlStr = `{ control: '${ctrl.control}' }`;
    }
    const key = /[^a-zA-Z0-9_$]/.test(p.name) ? `'${p.name}'` : p.name;
    return `    ${key}: { ${ctrlStr.slice(1, -1)}${desc ? `, description: "${desc}"` : ''} },`;
  });

  // Build default args block (skip fn props)
  const argLines = contentProps
    .filter(p => {
      const t = (p.type || '').toLowerCase();
      return !t.startsWith('(') && t !== 'fn';
    })
    .map(p => {
      const key = /[^a-zA-Z0-9_$]/.test(p.name) ? `'${p.name}'` : p.name;
      return `    ${key}: ${defaultArg(p)},`;
    });

  // Escape usage snippet for embedding as a code string
  const usageCode = (comp.usage ?? `<${comp.name} />`).replace(/`/g, '\\`');

  const lines = [
    `import { ${comp.name} } from '${imp}';`,
    ``,
    `export default {`,
    `  title: 'Kernel/${layer}/${category}/${comp.name}',`,
    `  component: ${comp.name},`,
    `  tags: ['autodocs'],`,
    ...(argTypesLines.length > 0 ? [
      `  argTypes: {`,
      ...argTypesLines,
      `  },`,
    ] : []),
    `  parameters: {`,
    `    docs: {`,
    `      description: {`,
    `        component: ${JSON.stringify(comp.summary ?? '')},`,
    `      },`,
    `    },`,
    `  },`,
    `};`,
    ``,
    `export const Default = {`,
    ...(argLines.length > 0 ? [
      `  args: {`,
      ...argLines,
      `  },`,
    ] : []),
    `  parameters: {`,
    `    docs: {`,
    `      source: { code: \`${usageCode}\` },`,
    `    },`,
    `  },`,
    `};`,
    ``,
  ];

  writeFileSync(outFile, lines.join('\n'));
  written++;
}

console.log(`gen-stories: wrote ${written} stories, skipped ${skipped} existing`);
