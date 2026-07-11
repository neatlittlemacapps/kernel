import { PropertyList } from '@corilus/kernel';

export default {
  title: 'Kernel/Composite/Data display/PropertyList',
  component: PropertyList,
  tags: ['autodocs'],
  argTypes: {
    title: {  control: 'text' , description: "Optional list heading; also the fallback accessible name when ariaLabel is absent. Shown with a live item count." },
    items: {  control: 'text' , description: "The data records to render. Each is passed to renderItem; item.id or item.key is used as the list key." },
    renderItem: {  control: false , description: "Render prop (item, index) returning the card for one record. The list is agnostic about which Card component it returns." },
    layout: {  control: 'select', options: ["rows","grid","columns"] , description: "Arrangement: rows (single-column stack), grid (auto-fit cells at least minCard wide), columns (CSS multi-column flow). L" },
    minCard: {  control: 'number' , description: "Minimum cell width in px for grid, or the column-width for columns. Drives the --krnl-list-min-card var so the consumer " },
    density: {  control: 'select', options: ["comfortable","compact","spacious"] , description: "Overrides the page density token for this list only, via the data-density attribute." },
    filter: {  control: 'text' , description: "Header slot for a filter control the host composes." },
    sort: {  control: 'text' , description: "Header slot for a sort control the host composes." },
    action: {  control: 'text' , description: "Header slot for a primary action (e.g. an add button), placed at the end of the header." },
    emptyLabel: {  control: 'text' , description: "Text shown in place of the items when items is empty." },
    ariaLabel: {  control: 'text' , description: "Accessible name for the list region; falls back to title when omitted." },
    className: {  control: 'text' , description: "Extra class names appended after the canonical list + layout classes." },
  },
  parameters: {
    docs: {
      description: {
        component: "Collection view for sprout-cards. Three layouts (rows / grid / columns); cards keep their intrinsic width-morph. Header slots for filter / sort / action.",
      },
    },
  },
};

export const Default = {
  args: {
    title: "title",
    items: undefined,
    layout: "rows",
    minCard: 0,
    density: "comfortable",
    filter: "...",
    sort: "...",
    action: "...",
    emptyLabel: undefined,
    ariaLabel: undefined,
    className: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<PropertyList items={items} renderItem={(it) => <VitalSignCard data={it} stage="sprout" />} layout="grid" />` },
    },
  },
};
