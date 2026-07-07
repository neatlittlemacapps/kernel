// PropertyList — Act 2 of the Sprout cards system. The collection view that
// renders many cards (typically Seeds) in one of three responsive layouts.
//
// Layout choice belongs to the LIST, not the card. Each card morphs to the
// width the list gives it (Card.jsx owns the container-query rules). This
// keeps "morphs nicely" intrinsic to the card while letting the list own
// how many cards live side-by-side.
//
// Layouts:
//   rows    — single-column flex stack. Default for sidebars / narrow surfaces.
//   grid    — CSS grid with auto-fit minmax. Each cell at least `minCard` wide.
//   columns — CSS multi-column. Browser flows seeds into 1/2/3 columns based
//             on width; great for many small seeds in a dashboard tile.
//
// Composition: consumers pass `items` + `renderItem(item, index)`. The list
// has no opinion about which Card component renders an item — VitalSign,
// Lab, Allergy, mixed, anything goes.

import { iconFor, txtNL } from './lib.jsx';

const React = window.React;

export function PropertyList({
  title,
  items = [],
  renderItem,
  layout = 'grid',            // 'rows' | 'grid' | 'columns'
  minCard = 240,              // grid: min cell width (px); columns: column-width
  density = 'comfortable',    // override the page density for this list only (optional)
  // header slots — placeholders for filter / sort UIs the host will compose
  filter, sort, action,
  // empty state
  emptyLabel = 'Geen items',
  // a11y
  ariaLabel,
  className = '',
  ...rest
}) {
  const cls = [
    'krnl-pcard-list',
    `krnl-pcard-list--${layout}`,
    className,
  ].filter(Boolean).join(' ');

  // CSS custom properties — the grid/column knobs are driven by minCard so
  // the consumer never edits the stylesheet. Token-only colour/spacing rules
  // still apply.
  const inlineVars = {
    '--krnl-list-min-card': minCard + 'px',
  };

  const showHeader = title || filter || sort || action;

  return (
    <section
      className={cls}
      data-density={density}
      aria-label={ariaLabel || title}
      style={inlineVars}
      {...rest}
    >
      {showHeader && (
        <header className="krnl-pcard-list-head">
          {title && (
            <div className="krnl-pcard-list-title-wrap">
              <h2 className="krnl-pcard-list-title">{title}</h2>
              {items.length > 0 && <span className="krnl-pcard-list-count">{items.length}</span>}
            </div>
          )}
          {(filter || sort) && (
            <div className="krnl-pcard-list-controls">
              {filter && <div className="krnl-pcard-list-filter">{filter}</div>}
              {sort && <div className="krnl-pcard-list-sort">{sort}</div>}
            </div>
          )}
          {action && <div className="krnl-pcard-list-action">{action}</div>}
        </header>
      )}

      {items.length === 0 ? (
        <div className="krnl-pcard-list-empty">{emptyLabel}</div>
      ) : (
        <div className="krnl-pcard-list-items">
          {items.map((item, i) => (
            <div className="krnl-pcard-list-item" key={item.id ?? item.key ?? i}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export const meta = {
  PropertyList: {
    layer: 'composite',
    scope: 'global',
    usecases: ['property-list', 'dashboard', 'sprout-pattern'],
    status: 'experimental',
    category: 'Data display',
    keywords: ['list', 'collection', 'grid', 'rows', 'columns', 'layout', 'sprout', 'cards', 'dashboard', 'property-list'],
    summary: 'Collection view for sprout-cards. Three layouts (rows / grid / columns); cards keep their intrinsic width-morph. Header slots for filter / sort / action.',
    props: {
      title: { class: 'content', type: 'string', required: false, description: 'Optional list heading; also the fallback accessible name when ariaLabel is absent. Shown with a live item count.' },
      items: { class: 'content', type: 'object[]', description: 'The data records to render. Each is passed to renderItem; item.id or item.key is used as the list key.' },
      renderItem: { class: 'content', type: 'fn', description: 'Render prop (item, index) returning the card for one record. The list is agnostic about which Card component it returns.' },
      layout: { class: 'dsPresentation', values: ['rows', 'grid', 'columns'], default: 'grid', description: 'Arrangement: rows (single-column stack), grid (auto-fit cells at least minCard wide), columns (CSS multi-column flow). Layout belongs to the list, not the card.' },
      minCard: { class: 'dsPresentation', type: 'number', default: 240, description: 'Minimum cell width in px for grid, or the column-width for columns. Drives the --krnl-list-min-card var so the consumer never edits the stylesheet.' },
      density: { class: 'dsPresentation', values: ['comfortable', 'compact', 'spacious'], default: 'comfortable', description: 'Overrides the page density token for this list only, via the data-density attribute.' },
      filter: { class: 'content', type: 'node', required: false, description: 'Header slot for a filter control the host composes.' },
      sort: { class: 'content', type: 'node', required: false, description: 'Header slot for a sort control the host composes.' },
      action: { class: 'content', type: 'node', required: false, description: 'Header slot for a primary action (e.g. an add button), placed at the end of the header.' },
      emptyLabel: { class: 'content', type: 'string', default: 'Geen items', description: 'Text shown in place of the items when items is empty.' },
      ariaLabel: { class: 'a11y', type: 'string', description: 'Accessible name for the list region; falls back to title when omitted.' },
      className: { class: 'dsPresentation', type: 'string', description: 'Extra class names appended after the canonical list + layout classes.' },
    },
    anatomy: [
      { name: 'Header', required: false, description: 'Shown when a title, filter, sort, or action is present.' },
      { name: 'Title', required: false, description: 'The list heading plus a live item count.' },
      { name: 'Controls', required: false, description: 'The filter and sort slots.' },
      { name: 'Action', required: false, description: 'The trailing header action slot.' },
      { name: 'Items', required: false, description: 'The rendered cards, one per record via renderItem.' },
      { name: 'Empty', required: false, description: 'The emptyLabel message shown when there are no items.' },
    ],
    composes: [],
    usage: '<PropertyList items={items} renderItem={(it) => <VitalSignCard data={it} stage="sprout" />} layout="grid" />',
  },
};
