// WCAG contrast spot-check over the compiled token CSS (grove BACKLOG B-30).
//
// Zero-dependency: Node built-ins only, so it runs with bare `node`. Reads the compiled
// tokens/tokens.css, resolves a handful of key semantic foreground/background pairs down to
// concrete colors (per mode: :root = corilus/light default, [data-theme="dark"] layered over
// it), and computes the WCAG 2.x contrast ratio. This is a SPOT-CHECK; the fuller contrast
// gate is B-35, which can reuse these primitives.
//
// Leaf colors in tokens.css are hex primitives (#rrggbb); the only oklch() values are the
// alpha tints, which are never fg/bg pairs and are skipped. Both leaf forms are supported.

import fs from 'node:fs';

// ── parse `selector { --name: value; ... }` blocks into per-selector maps ──────────
export function parseCss(css) {
  const blocks = {};
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments (they glue onto selectors/decls)
  // tokens.css is flat (no nested braces inside a rule body).
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    const body = m[2];
    const map = (blocks[selector] ||= {});
    for (const decl of body.split(';')) {
      const i = decl.indexOf(':');
      if (i === -1) continue;
      const name = decl.slice(0, i).trim();
      const value = decl.slice(i + 1).trim();
      if (name.startsWith('--')) map[name] = value;
    }
  }
  return blocks;
}

// merged variable map for a mode: base selectors layered left-to-right (later overrides).
export function mergedMap(blocks, selectors) {
  const out = {};
  for (const sel of selectors) Object.assign(out, blocks[sel] || {});
  return out;
}

// resolve a --var down to a leaf color string, following var() chains. Returns null if the
// value carries an alpha (not a solid fg/bg), is transparent, or cannot be resolved.
export function resolveColor(map, varName, depth = 0) {
  if (depth > 24) return null;
  let value = map[varName];
  if (value == null) return null;
  value = value.trim();
  const varMatch = value.match(/^var\(\s*(--[A-Za-z0-9-]+)/);
  if (varMatch) return resolveColor(map, varMatch[1], depth + 1);
  if (/transparent/i.test(value)) return null;
  if (value.includes('/')) return null; // alpha component -> not a solid pair
  if (value.startsWith('#') || value.startsWith('oklch(')) return value;
  return null;
}

// ── color math: leaf -> linear sRGB [0,1] triple ──────────────────────────────────
function hexToLinear(hex) {
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const to = (s) => {
    const c = parseInt(s, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return [to(h.slice(0, 2)), to(h.slice(2, 4)), to(h.slice(4, 6))];
}

function oklchToLinear(str) {
  const m = str.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (!m) return null;
  let L = parseFloat(m[1]);
  if (m[1].endsWith('%')) L /= 100;
  const C = parseFloat(m[2]);
  const H = (parseFloat(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  // OKLab -> linear sRGB (Ottosson).
  let l = L + 0.3963377774 * a + 0.2158037573 * b;
  let mm = L - 0.1055613458 * a - 0.0638541728 * b;
  let s = L - 0.0894841775 * a - 1.291485548 * b;
  l = l ** 3; mm = mm ** 3; s = s ** 3;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  return [
    clamp(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s),
  ];
}

export function leafToLinear(leaf) {
  if (!leaf) return null;
  if (leaf.startsWith('#')) return hexToLinear(leaf);
  if (leaf.startsWith('oklch(')) return oklchToLinear(leaf);
  return null;
}

export function relLuminance(linear) {
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(fgLeaf, bgLeaf) {
  const fg = leafToLinear(fgLeaf);
  const bg = leafToLinear(bgLeaf);
  if (!fg || !bg) return null;
  const l1 = relLuminance(fg);
  const l2 = relLuminance(bg);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// ── the spot-check pairs ────────────────────────────────────────────────────────
// Real fg/bg usages (verified against the component tokens in tokens.css), text -> AA 4.5.
// action-accent is a border/accent line, NOT a text fill, so it is intentionally not paired
// against text here; the primary button fill is action-solid / action-on.
export const PAIRS = [
  { name: 'text-default on surface-page', fg: '--text-default', bg: '--surface-page', min: 4.5 },
  { name: 'text-muted on surface-panel', fg: '--text-muted', bg: '--surface-panel', min: 4.5 },
  { name: 'button-primary-text on button-primary-background', fg: '--button-primary-text', bg: '--button-primary-background', min: 4.5 },
  { name: 'button-error-text on button-error-background', fg: '--button-error-text', bg: '--button-error-background', min: 4.5 },
];

const MODES = {
  light: [':root'],
  dark: [':root', '[data-theme="dark"]'],
};

// Run every pair in every mode. Returns [{pair, mode, ratio, min, pass}]; a pair that cannot
// be resolved in a mode is reported pass:null (skipped, not a failure).
export function checkContrast(cssPath, pairs = PAIRS) {
  const blocks = parseCss(fs.readFileSync(cssPath, 'utf8'));
  const results = [];
  for (const [mode, selectors] of Object.entries(MODES)) {
    const map = mergedMap(blocks, selectors);
    for (const p of pairs) {
      const fg = resolveColor(map, p.fg);
      const bg = resolveColor(map, p.bg);
      const ratio = contrastRatio(fg, bg);
      results.push({
        pair: p.name, mode,
        ratio: ratio == null ? null : Math.round(ratio * 100) / 100,
        min: p.min,
        pass: ratio == null ? null : ratio >= p.min,
      });
    }
  }
  return results;
}
