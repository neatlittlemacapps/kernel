// Kernel template: settings (grove BACKLOG B-34).
//
// Frame-first reference skeleton - a starting layout to fill in, not a runnable app. The frame
// uses plain structural elements (Kernel has no shell/nav primitive yet; a future AppShell could
// promote in); every control is a real Kernel component. Discover the pieces with
// `kernel component <Name>`; this only fixes the regions and where each part goes.

export const meta = {
  name: 'settings',
  title: 'Settings screen',
  summary: 'App-shell settings surface: header + section nav + a grouped list of toggle/field rows.',
  regions: ['header', 'nav', 'main:settings-groups'],
  composes: ['IconButton', 'PropertyList', 'Card', 'Toggle', 'TextInput', 'Btn', 'Icon'],
};

import { IconButton, PropertyList, Card, Toggle, TextInput, Btn, Icon } from '@corilus/kernel';

export function SettingsScreen({ groups = [], onSave }) {
  return (
    <div className="app-shell">
      {/* region: header - title + primary actions */}
      <header className="app-shell__header">
        <h1>Settings</h1>
        <IconButton aria-label="Close settings">{Icon.close({ size: 18 })}</IconButton>
      </header>

      <div className="app-shell__body">
        {/* region: nav - section switcher (fill with the setting section list) */}
        <nav className="app-shell__nav" aria-label="Settings sections">
          {/* map sections here */}
        </nav>

        {/* region: main - grouped setting rows */}
        <main className="app-shell__main">
          <PropertyList
            items={groups}
            layout="rows"
            renderItem={(group) => (
              <Card title={group.title}>
                {group.fields.map((f) =>
                  f.type === 'toggle' ? (
                    <Toggle key={f.id} checked={f.value} onCheckedChange={f.onChange} />
                  ) : (
                    <TextInput key={f.id} value={f.value} onChange={f.onChange} placeholder={f.placeholder} />
                  )
                )}
              </Card>
            )}
          />
          <footer className="app-shell__footer">
            <Btn variant="primary" onClick={onSave}>Save changes</Btn>
          </footer>
        </main>
      </div>
    </div>
  );
}
