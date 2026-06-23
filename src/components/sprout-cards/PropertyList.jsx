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
    'cc-pcard-list',
    `cc-pcard-list--${layout}`,
    className,
  ].filter(Boolean).join(' ');

  // CSS custom properties — the grid/column knobs are driven by minCard so
  // the consumer never edits the stylesheet. Token-only colour/spacing rules
  // still apply.
  const inlineVars = {
    '--cc-list-min-card': minCard + 'px',
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
        <header className="cc-pcard-list-head">
          {title && (
            <div className="cc-pcard-list-title-wrap">
              <h2 className="cc-pcard-list-title">{title}</h2>
              {items.length > 0 && <span className="cc-pcard-list-count">{items.length}</span>}
            </div>
          )}
          {(filter || sort) && (
            <div className="cc-pcard-list-controls">
              {filter && <div className="cc-pcard-list-filter">{filter}</div>}
              {sort && <div className="cc-pcard-list-sort">{sort}</div>}
            </div>
          )}
          {action && <div className="cc-pcard-list-action">{action}</div>}
        </header>
      )}

      {items.length === 0 ? (
        <div className="cc-pcard-list-empty">{emptyLabel}</div>
      ) : (
        <div className="cc-pcard-list-items">
          {items.map((item, i) => (
            <div className="cc-pcard-list-item" key={item.id ?? item.key ?? i}>
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
    summary: 'Collection view for sprout-cards. Three layouts (rows / grid / columns); cards keep their intrinsic width-morph. Header slots for filter / sort / action.',
    props: {
      title: '?string',
      items: 'object[]',
      renderItem: 'fn',
      layout: "'rows'|'grid'|'columns'",
      minCard: '?number',
      density: "?'comfortable'|'compact'|'spacious'",
      filter: '?node', sort: '?node', action: '?node',
      emptyLabel: '?string',
      ariaLabel: '?string',
      className: '?string',
    },
    composes: [],
  },
};
