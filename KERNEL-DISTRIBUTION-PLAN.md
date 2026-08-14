# Kernel → Greenhouse distribution plan

> How to make Greenhouse a real *customer* of Kernel and keep it on the latest
> components — without the current filesystem symlink. Written 2026-08-06.

## Reframe first: Greenhouse is not a fork

The premise ("derived from a local version") is only half true. Greenhouse already
consumes Kernel as a package — every import is `@corilus/kernel`, `/clinical`,
`/chat`, `/styles.css`. There is **no copied source** inside Greenhouse.

The one broken thing is the **distribution channel**:

```jsonc
// greenhouse/package.json
"@corilus/kernel": "file:../kernel"     // → node_modules/@corilus/kernel is a symlink to ../../../kernel
```

So Greenhouse only builds on a machine that has the Kernel repo checked out as a
sibling folder. No CI runner, and no other developer, can build it.

**Therefore the job is "add a release pipeline," not "extract and refactor."** That is
a much smaller piece of work than it sounds.

## Load-bearing fact (verified, not assumed)

Kernel is **source-distributed with no build step** — `exports` point straight at
`./src/index.js` (JSX inside), zero runtime deps, React/Base UI as peers. That only
mattered so far *through a symlink*. Tested it through a real install:

```
npm pack  →  install the .tgz into a scratch project  →  esbuild --bundle
```

✅ esbuild transformed the JSX inside `node_modules` and bundled cleanly (out.js 65kb,
out.css 120kb). The tarball contains all entries and does **not** leak `.npmrc`.

**Conclusion: Kernel needs no compile stage.** Publishing stays simple. (If we ever
switch Greenhouse's bundler to one that skips JSX in `node_modules`, e.g. certain
webpack configs, we'd revisit — esbuild does not have that problem.)

## The registry is already decided by precedent

Corilus already runs an internal npm registry — **Azure Artifacts**:

```
https://pkgs.dev.azure.com/corilusnv/_packaging/Corilus/npm/registry/
```

Sibling repos (`Health-UI`, `greenhouse`) already map `@cc:` and `@health:` scopes to
it. Kernel should live there too, not on public npm and not (ideally) on GitHub
Packages — that keeps it inside the toolchain Corilus developers and pipelines are
already authenticated against.

| Channel | Verdict | Notes |
|---|---|---|
| **Azure Artifacts (Corilus feed)** | ✅ **Recommended** | Matches existing `@cc`/`@health` precedent; devs & CI already auth against it. |
| GitHub Packages | Fallback | Repo is on GitHub (`neatlittlemacapps/kernel`) but this splits infra from the rest of Corilus and needs the scope to match the owning org. |
| Git dependency (`github:…#semver`) | Interim only | Works *today* because of the no-build design; no registry needed. Good as a stopgap while the feed is set up. |
| Public npm | ❌ | Design system is internal. |

## The key distinction: "latest" is two cadences, not one

"Ensure Greenhouse always has the latest" should **not** mean install-time `latest`.
Split it:

- **Publish cadence — automatic.** Every merge to `main` produces a consumable,
  versioned release. No human step.
- **Consume cadence — explicit but frictionless.** Greenhouse pins a semver range; a
  bot opens a bump PR that must pass Greenhouse's build **and** Kernel's existing
  `npm run gate` + `npm run audit:greenhouse` before it merges.

Literal auto-latest removes the version boundary you need to bisect when a Kernel
change breaks Greenhouse. The bump-PR gate — not the registry choice — is the real
answer to "always has the latest, safely."

---

## Work plan

### Phase 0 — Make Kernel publishable (in the `kernel` repo)
1. Remove `"private": true`; add
   `"publishConfig": { "registry": "https://pkgs.dev.azure.com/corilusnv/_packaging/Corilus/npm/registry/" }`.
2. **Decide the scope** — see open decision below (`@corilus` vs `@cc`).
3. Replace wildcard `peerDependencies` (`"*"`) with real ranges, e.g.
   `"react": ">=18", "@base-ui-components/react": "1.0.0-rc.0"` (match what Greenhouse pins).
4. **Ship the prebuilt tokens CSS.** `tokens/tokens.css` is already generated and in
   the tarball. Stop making consumers run `python3 to_css.py` at build time — expose the
   CSS as an entry (e.g. `"./tokens.css": "./tokens/tokens.css"`) so no Python runtime
   is a hidden part of the contract.
5. Adopt a versioning rule. Suggest **`0.x`, minor-bump per breaking change** while
   `STANDARD.md` is still moving; go `1.0.0` when the prop vocabulary stabilises.
6. Hygiene: the working-tree `.npmrc` holds a live Font Awesome token. It's gitignored
   (won't ship in the tarball or a git clone), but **rotate it** as good practice.

### Phase 1 — Release pipeline (CI in `kernel`)
7. Add a publish workflow (Azure Pipelines, or a GitHub Action pushing to the Azure
   feed) that on a version tag / merge to `main`: installs, runs `npm run gate`, bumps
   version, and `npm publish`. Auth via an Azure Artifacts PAT / service connection
   (same secret pattern as the existing FA-token step in `deploy-storybook.yml`).

### Phase 2 — Point Greenhouse at the published package
8. Add the scope→Azure-feed mapping to `greenhouse/.npmrc` (already present for other
   scopes — just add Kernel's scope if different).
9. Replace `"@corilus/kernel": "file:../kernel"` with a semver range
   (e.g. `"^0.2.0"`).
10. Replace the `tokens` script's `cd node_modules/@corilus/kernel/tokens && python3
    to_css.py …` with an import of the shipped `tokens.css` (from Phase 0.4).
11. Ensure Greenhouse CI authenticates to the Azure feed to restore packages.

### Phase 3 — "Always latest" automation
12. Enable Renovate or Dependabot on Greenhouse for the Kernel dependency, opening a
    bump PR on every new publish. Gate the PR on Greenhouse's build + Kernel's
    `gate` / `audit:greenhouse`. Optionally auto-merge patch/minor once green.

---

## Open decisions for Frank
- **Scope name:** publish as `@corilus/kernel` (current name) or realign to Corilus's
  existing Azure convention `@cc/kernel`? Existing Corilus packages use `@cc`/`@health`.
- **Registry:** confirm Azure Artifacts (recommended) vs GitHub Packages.
- **Interim:** use a git dependency now (works today, no feed setup) or wait for the
  Azure feed?
- **Auto-merge:** should green patch/minor Kernel bumps auto-merge into Greenhouse, or
  always require review?

## Jira (file in project `AD`, label `kernel` — MCP was offline this session)
1. **Publish Kernel to Azure Artifacts** — Phase 0 + 1 (unprivate, publishConfig,
   real peerDeps, ship tokens.css, versioning policy, publish pipeline).
2. **Greenhouse consumes published Kernel** — Phase 2 (drop `file:` symlink, semver
   range, .npmrc scope, drop consume-time Python, CI feed auth).
3. **Automate Kernel bump PRs into Greenhouse** — Phase 3 (Renovate/Dependabot gated
   by build + `audit:greenhouse`).
4. **Rotate the Font Awesome npm token** — hygiene.
