import { ActionRow } from '@corilus/kernel';

export default {
  title: 'Core/Navigation/ActionRow',
  component: ActionRow,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false, description: "Leading glyph, e.g. Icon.search({ size: 18 }).", table: { category: 'Content', type: { summary: "node" } } },
    label: { control: 'text', description: "The action name; the primary line and accessible name.", table: { category: 'Content', type: { summary: "string" } } },
    description: { control: 'text', description: "Secondary line beneath the label.", table: { category: 'Content', type: { summary: "string" } } },
    tone: { control: 'text', description: "Semantic colour accent for the row.", table: { category: 'Appearance', type: { summary: "string" } } },
    selected: { control: 'boolean', description: "Highlights the row as the current selection (keyboard / active item).", table: { category: 'Appearance', type: { summary: "bool" } } },
    reason: { control: 'text', description: "When disabled, the gating reason shown to explain why.", table: { category: 'Content', type: { summary: "string" } } },
    onClick: { control: false, description: "Invoked when the row is activated.", table: { category: 'Events', type: { summary: "fn" } } },
  },
  parameters: {
    docs: { description: { component: "The one canonical action/command row (icon, label, description, chevron); gating-aware.\n\n**Import**\n\n```ts\nimport { ActionRow } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Icon** _(optional)_ — Leading glyph.\n- **Label** — The action name.\n- **Description** _(optional)_ — Secondary supporting line.\n- **Chevron** _(optional)_ — Trailing affordance for drill-in rows." } },
  },
};

export const Playground = {
  args: {
    label: "Label",
    selected: false,
  },
  parameters: { docs: { source: { code: `<ActionRow icon={Icon.search({ size: 18 })} label="Search records" description="Find a patient" onClick={run} />` } } },
};
