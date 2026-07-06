// Kernel template: list-detail (grove BACKLOG B-34).
//
// Frame-first reference skeleton for the master/detail (CRUD) shape: a PropertyList collection
// beside a detail Card region. Not a runnable app - a layout to fill in. Every control is a real
// Kernel component; discover the pieces with `kernel component <Name>`.

export const meta = {
  name: 'list-detail',
  title: 'List + detail (master/detail)',
  summary: 'A PropertyList collection beside a detail Card region, with a header action.',
  regions: ['header', 'main:list', 'aside:detail'],
  composes: ['PropertyList', 'ActionRow', 'Card', 'Btn', 'IconButton', 'Icon'],
};

import { PropertyList, ActionRow, Card, Btn, IconButton, Icon } from '@corilus/kernel';

export function ListDetail({ items = [], selected, onSelect, onCreate }) {
  return (
    <div className="ld-shell">
      {/* region: header - collection title + create action */}
      <header className="ld-shell__header">
        <h1>Records</h1>
        <IconButton aria-label="Create record" onClick={onCreate}>{Icon.plus({ size: 18 })}</IconButton>
      </header>

      <div className="ld-shell__body">
        {/* region: main - the collection (rows/grid) */}
        <main className="ld-shell__list">
          <PropertyList
            items={items}
            layout="rows"
            renderItem={(it) => (
              <ActionRow
                key={it.id}
                label={it.title}
                description={it.subtitle}
                selected={it.id === selected?.id}
                onClick={() => onSelect(it)}
              />
            )}
          />
        </main>

        {/* region: aside - detail for the selected item (empty state when none) */}
        <aside className="ld-shell__detail">
          {selected ? (
            <Card title={selected.title} value={selected.value}>
              {selected.body}
              <Btn variant="primary">Edit</Btn>
            </Card>
          ) : (
            <p>Select a record to see its detail.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
