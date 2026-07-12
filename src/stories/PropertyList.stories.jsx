import { PropertyList } from '@corilus/kernel';

export default {
  title: 'Core/Data Display/PropertyList',
  component: PropertyList,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: "Optional list heading; also the fallback accessible name when ariaLabel is absent. Shown with a live item count.", table: { category: 'Content', type: { summary: "string" } } },
    items: { control: false, description: "The data records to render. Each is passed to renderItem; item.id or item.key is used as the list key.", table: { category: 'Content', type: { summary: "object[]" } } },
    renderItem: { control: false, description: "Render prop (item, index) returning the card for one record. The list is agnostic about which Card component it returns.", table: { category: 'Content', type: { summary: "fn" } } },
    layout: { control: 'select', options: ["rows","grid","columns"], description: "Arrangement: rows (single-column stack), grid (auto-fit cells at least minCard wide), columns (CSS multi-column flow). Layout belongs to the list, not the card.", table: { category: 'Appearance', defaultValue: { summary: "grid" } } },
    minCard: { control: 'number', description: "Minimum cell width in px for grid, or the column-width for columns. Drives the --krnl-list-min-card var so the consumer never edits the stylesheet.", table: { category: 'Appearance', defaultValue: { summary: "240" }, type: { summary: "number" } } },
    density: { control: 'select', options: ["comfortable","compact","spacious"], description: "Overrides the page density token for this list only, via the data-density attribute.", table: { category: 'Appearance', defaultValue: { summary: "comfortable" } } },
    filter: { control: false, description: "Header slot for a filter control the host composes.", table: { category: 'Content', type: { summary: "node" } } },
    sort: { control: false, description: "Header slot for a sort control the host composes.", table: { category: 'Content', type: { summary: "node" } } },
    action: { control: false, description: "Header slot for a primary action (e.g. an add button), placed at the end of the header.", table: { category: 'Content', type: { summary: "node" } } },
    emptyLabel: { control: 'text', description: "Text shown in place of the items when items is empty.", table: { category: 'Content', defaultValue: { summary: "Geen items" }, type: { summary: "string" } } },
    ariaLabel: { control: 'text', description: "Accessible name for the list region; falls back to title when omitted.", table: { category: 'Accessibility', type: { summary: "string" } } },
    className: { control: 'text', description: "Extra class names appended after the canonical list + layout classes.", table: { category: 'Appearance', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Collection view for sprout-cards. Three layouts (rows / grid / columns); cards keep their intrinsic width-morph. Header slots for filter / sort / action.\n\n**Import**\n\n```ts\nimport { PropertyList } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Header** _(optional)_ — Shown when a title, filter, sort, or action is present.\n- **Title** _(optional)_ — The list heading plus a live item count.\n- **Controls** _(optional)_ — The filter and sort slots.\n- **Action** _(optional)_ — The trailing header action slot.\n- **Items** _(optional)_ — The rendered cards, one per record via renderItem.\n- **Empty** _(optional)_ — The emptyLabel message shown when there are no items." } },
  },
};

export const Playground = {
  args: {
    title: "Label",
    layout: "grid",
    minCard: 240,
    density: "comfortable",
    emptyLabel: "Geen items",
  },
  parameters: { docs: { source: { code: `<PropertyList items={items} renderItem={(it) => <VitalSignCard data={it} stage="sprout" />} layout="grid" />` } } },
};
