// tools/lib/token-graph.mjs
// Pure, isomorphic (no Node builtins) token-set dependency graph builder. Same module is
// imported by the Storybook "Foundations/Token Graph" page (via Vite JSON imports) and by
// the Node test suite (via fs-loaded JSON) -- one source of truth for the graph shape.
//
// A "set" here is a tokens/*.tokens.json file, named by its $ref path with the
// ".tokens.json" suffix stripped (e.g. "brand/corilus"), matching theme.resolver.json.

const ALIAS_RE = /^\{([^{}]+)\}$/;

export function setNameFromRef(ref) {
  return ref.replace(/\.tokens\.json$/, '');
}

// Every $ref (set + modifier context file) referenced anywhere in the resolver.
export function allRefs(resolver) {
  const refs = new Set();
  for (const set of Object.values(resolver.sets)) {
    for (const src of set.sources) refs.add(src.$ref);
  }
  for (const mod of Object.values(resolver.modifiers)) {
    for (const ctx of Object.values(mod.contexts)) {
      for (const src of ctx) refs.add(src.$ref);
    }
  }
  return [...refs];
}

// setName -> tier ("primitives" | "brand" | "theme" | "breakpoint" | "density" |
// "typography" | "foundations" | "components"), derived from the resolver structure
// (never hand-listed, so it can't drift from theme.resolver.json).
export function tierBySet(resolver) {
  const tiers = {};
  for (const [tier, set] of Object.entries(resolver.sets)) {
    for (const src of set.sources) tiers[setNameFromRef(src.$ref)] = tier;
  }
  for (const [modName, mod] of Object.entries(resolver.modifiers)) {
    for (const ctx of Object.values(mod.contexts)) {
      for (const src of ctx) tiers[setNameFromRef(src.$ref)] = modName;
    }
  }
  return tiers;
}

// Column order for layout, taken straight from resolutionOrder.
export function tierOrder(resolver) {
  return resolver.resolutionOrder.map((r) => r.$ref.split('/').pop());
}

// Flatten a DTCG token tree into [{ path: "a.b.c", value }], skipping $-prefixed keys.
// Mirrors tokens/to_css.py's walk().
function flatten(node, path, out) {
  if (node === null || typeof node !== 'object') return;
  if ('$value' in node) {
    out.push({ path: path.join('.'), value: node.$value });
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object') flatten(v, [...path, k], out);
  }
}

// Recursively collect every {dotted.path} alias reference inside a $value, at any depth
// (composite values like typography/shadow can bury an alias in a sub-field).
function findAliases(value, out = []) {
  if (typeof value === 'string') {
    const m = ALIAS_RE.exec(value);
    if (m) out.push(m[1]);
  } else if (Array.isArray(value)) {
    for (const v of value) findAliases(v, out);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) findAliases(v, out);
  }
  return out;
}

// Which sets are active for a given { brand, theme, breakpoint, density } selection.
// Primitives + typography/foundations/components are always active (never modifiers);
// each modifier contributes its selected context's sets (falling back to its default).
export function activeSetsFor(resolver, selection = {}) {
  const active = new Set();
  for (const src of resolver.sets.primitives.sources) active.add(setNameFromRef(src.$ref));
  for (const key of ['typography', 'foundations', 'components']) {
    for (const src of resolver.sets[key].sources) active.add(setNameFromRef(src.$ref));
  }
  for (const [modName, mod] of Object.entries(resolver.modifiers)) {
    const choice = selection[modName] in mod.contexts ? selection[modName] : mod.default;
    for (const src of mod.contexts[choice]) active.add(setNameFromRef(src.$ref));
  }
  return active;
}

// files: Map<ref, parsedJson> for every ref returned by allRefs(resolver).
// Returns { nodes, edges, tierOrder }.
//   node:  { id, tier, file, tokenCount }
//   edge:  { from, to, kinds: ("alias" | "cascade")[], pairs: ["fromPath -> toPath", ...] }
export function buildTokenGraph(files, resolver) {
  const tiers = tierBySet(resolver);
  const setTokens = new Map(); // setName -> [{ path, value }]
  const pathToSets = new Map(); // path -> Set<setName>

  for (const ref of allRefs(resolver)) {
    const name = setNameFromRef(ref);
    const json = files.get(ref);
    const flat = [];
    flatten(json, [], flat);
    setTokens.set(name, flat);
    for (const { path } of flat) {
      if (!pathToSets.has(path)) pathToSets.set(path, new Set());
      pathToSets.get(path).add(name);
    }
  }

  // A set pair can be linked by an alias AND be an additive cascade at once (e.g.
  // brand/semble both aliases brand/corilus.brand.ink.950 for one token AND loads
  // after it) -- so an edge carries a set of kinds, not a single one.
  const edgeMap = new Map(); // "from->to" -> { from, to, kinds: Set, pairs: Set }
  function addEdge(from, to, kind, pairKey) {
    if (from === to) return;
    const key = `${from}->${to}`;
    let e = edgeMap.get(key);
    if (!e) {
      e = { from, to, kinds: new Set(), pairs: new Set() };
      edgeMap.set(key, e);
    }
    e.kinds.add(kind);
    if (pairKey) e.pairs.add(pairKey);
  }

  for (const [fromSet, tokens] of setTokens) {
    for (const { path, value } of tokens) {
      for (const targetPath of findAliases(value)) {
        const targets = pathToSets.get(targetPath);
        if (!targets) continue;
        for (const toSet of targets) addEdge(fromSet, toSet, 'alias', `${path} -> ${targetPath}`);
      }
    }
  }

  // Cascade edges: additive load order within one modifier context (e.g. brand/semble
  // loads after brand/corilus; semantic/dark loads after semantic/light).
  for (const mod of Object.values(resolver.modifiers)) {
    for (const ctx of Object.values(mod.contexts)) {
      const names = ctx.map((src) => setNameFromRef(src.$ref));
      for (let i = 1; i < names.length; i++) addEdge(names[i], names[i - 1], 'cascade', null);
    }
  }

  const nodes = allRefs(resolver).map((ref) => {
    const name = setNameFromRef(ref);
    return { id: name, tier: tiers[name], file: ref, tokenCount: setTokens.get(name).length };
  });

  const edges = [...edgeMap.values()].map((e) => ({
    from: e.from,
    to: e.to,
    kinds: [...e.kinds],
    pairs: [...e.pairs],
  }));

  return { nodes, edges, tierOrder: tierOrder(resolver) };
}
