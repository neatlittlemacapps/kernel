# Kernel component documentation guide

> What "documented" means for a Kernel component, and how much is required. The catalog gate
> enforces the floor; `kernel component <Name>` and the MCP `get` render whatever a component's
> `meta` carries. Documentation strictness scales with the component's tier (its `status`).

## The two tiers

| Tier | `status` | What it is | Doc requirement |
|---|---|---|---|
| **Proto / snowflake** | `experimental` | A one-off built on tokens because Kernel lacks it | **Floor** only (see below). Rich fields recommended (warn). |
| **Official** | `stable` | A promoted, shared component | **Full docs required** (gate errors otherwise). |

Promotion is the forcing function: you cannot mark a component `stable` without full docs, so a
snowflake earns official status by being documented.

## The floor (every component, both tiers - gate ERROR if missing)

- A `meta` block, and a non-empty **`summary`** (one line: what it is / when to use it).

## Full docs (official / `stable` - gate ERROR if missing)

- A **`usage`** snippet (on-system JSX).
- A **`description`** on every Kernel-invented prop (see "which props" below).

## Recommended (nudged, surfaced by the CLI when present)

- **`keywords`** - search synonyms; feeds `kernel search`. High value, cheap.
- **`category`** - a grouping label (e.g. `"Feedback & Status"`).
- **`bestPractices`** - `[{ do: true|false, text }]` do/don't guidance.
- **`anatomy`** - `[{ name, required?, description }]` the named parts of the component.
- **`related`** - related component names.
- **`examples`** - `[{ name, code, description? }]` named code examples beyond the single `usage`.
  The CLI renders them, and each is a **Storybook story seed** - this is the reserved slot for
  Storybook embedding later, so components authored now carry their stories forward.
- **`storybook`** - `{ story?, embed? }` **reserved** pointer to a future stories file / embed
  config. Carried through the catalog now; not yet rendered. Leave it out until Storybook lands.

## The `meta` shape

```js
export const meta = {
  Banner: {
    layer: 'molecule', scope: 'global', status: 'stable',
    summary: 'Single-line icon + message + optional trailing action.',
    usecases: ['status strip', 'inline notice'],
    keywords: ['alert', 'notification', 'notice', 'callout'],
    category: 'Feedback & Status',
    props: [
      { name: 'tone', class: 'dsPresentation', values: ['neutral','info','success','warning','error'],
        description: 'Semantic color. Drives --status-{tone}-* bindings.', default: 'neutral' },
      { name: 'onDismiss', class: 'event', type: '() => void',
        description: 'Optional; renders a close IconButton.' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.Collapsible.open' },
    ],
    bestPractices: [
      { do: true, text: 'Match tone to the message: error for problems, success for confirmations.' },
      { do: false, text: 'Use Banner for transient messages; use a Toast for those.' },
    ],
    anatomy: [
      { name: 'Icon', required: true, description: 'Set from the tone.' },
      { name: 'Action', required: false, description: 'A trailing Btn / IconButton.' },
    ],
    composes: ['Btn', 'IconButton'],
    usage: '<Banner tone="info">Saved</Banner>',
  },
};
```

## Which props need a description

The **Kernel-invented** props - `dsPresentation` (`variant`/`tone`/`size`), `content` (slots,
`children`, `icon`, `action`), `event` (`onDismiss`, ...), and `a11y` props. Describe what they do
and their consequences, not just restate the name.

## Pass-through props: point to Base UI, do not re-document

A prop Kernel forwards to a Base UI primitive (`checked`, `open`, `disabled`, `value`, ...) is a
`passThroughControl`. Mark it `passthrough: "BaseUI.<Primitive>.<prop>"` and give it **no**
`description` - Base UI owns that contract, and the CLI renders `-> see Base UI <Primitive>`.
Base UI ships no machine-readable prop docs, so we point at its site rather than duplicate (and
drift from) it.

## Interaction state is never a prop

Open/checked/pressed/etc. are styled off Base UI `data-*` attributes, never declared as props (the
gate errors on `is*` names). They are not documented as props for that reason.
