// @hand-authored - argTypes generated, Drawer story hand-crafted; not regenerated.
import { useState } from 'react';
import { SidePanel, IconButton, ActionRow, Button, Icon } from '@corilus/kernel';

export default {
  title: 'Core/Layout/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ["floating","sidebar","fullscreen","bottomsheet","embedded"], description: "How the panel is presented / anchored.", table: { category: 'Appearance', defaultValue: { summary: "sidebar" } } },
    width: { control: 'number', description: "Sidebar-mode width in px (controlled); the resize handle updates it via onWidth.", table: { category: 'Appearance', type: { summary: "number" } } },
    onWidth: { control: false, description: "Fires while the sidebar resize handle is dragged, with the new width.", table: { category: 'Events', type: { summary: "(px) => void" } } },
    minWidth: { control: 'number', description: "Lower clamp for the sidebar resize.", table: { category: 'Appearance', defaultValue: { summary: "360" }, type: { summary: "number" } } },
    maxWidth: { control: 'number', description: "Upper clamp for the sidebar resize (default min(900, 70vw)).", table: { category: 'Appearance', type: { summary: "number" } } },
    sheetHeight: { control: 'number', description: "Bottom-sheet height in px; the consumer measures its content and feeds it in.", table: { category: 'Appearance', type: { summary: "number" } } },
    sheetFull: { control: 'boolean', description: "Bottom-sheet has reached the fullscreen takeover threshold.", table: { category: 'Appearance', type: { summary: "bool" } } },
    children: { control: 'text', description: "SidePanel.Header / SidePanel.Body / SidePanel.Footer.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    drawer: { control: false, description: "Navigation content revealed underneath when the panel content slides right. Supplying it enables the drawer layer; omit it and the panel renders exactly as before. Use SidePanel.DrawerBody / SidePanel.DrawerFooter inside it for a scrolling list with a sticky bottom row.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    drawerOpen: { control: 'boolean', description: "Whether the drawer is revealed (controlled). The panel content translates right by the drawer width.", table: { category: 'Appearance', defaultValue: { summary: "false" }, type: { summary: "bool" } } },
    onDrawerOpenChange: { control: false, description: "Fires when the drawer requests a close — the scrim over the peeking content is clicked, or Escape is pressed inside the drawer.", table: { category: 'Events', type: { summary: "(open: boolean) => void" } } },
    drawerWidth: { control: 'number', description: "Requested drawer width in px. Clamped to (panel width − drawerPeek), so a narrow sidebar or phone gets a near-full-width drawer with the content peeking instead.", table: { category: 'Appearance', defaultValue: { summary: "320" }, type: { summary: "number" } } },
    drawerPeek: { control: 'number', description: "Minimum strip of panel content left visible when the drawer is open; the clamp floor for drawerWidth.", table: { category: 'Appearance', defaultValue: { summary: "56" }, type: { summary: "number" } } },
    drawerLabel: { control: 'text', description: "Accessible name for the drawer region and its close scrim.", table: { category: 'Accessibility', defaultValue: { summary: "Menu" }, type: { summary: "string" } } },
    drawerId: { control: 'text', description: "id on the drawer region, so an external toggle can point at it with aria-controls.", table: { category: 'Accessibility', type: { summary: "string" } } },
    cover: { control: false, description: "A layer that fills the PANEL rectangle (never the viewport), above both the content and the drawer. Supplying it enables the cover layer; omit it and the panel renders exactly as before. Use for a settings / management surface an injected assistant must not cover the host application with. Compose SidePanel.CoverHeader + SidePanel.CoverBody inside it.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    coverOpen: { control: 'boolean', description: "Whether the cover is up (controlled). While open the panel content and the drawer are set inert — non-interactive, out of the tab order and out of the a11y tree — and the drawer scrim is not rendered.", table: { category: 'Appearance', defaultValue: { summary: "false" }, type: { summary: "bool" } } },
    onCoverOpenChange: { control: false, description: "Fires when the cover requests a close — Escape pressed inside it. The cover takes Escape before the drawer; a consumer that needs Escape to mean \"go back a level\" stops propagation on its own descendant handler.", table: { category: 'Events', type: { summary: "(open: boolean) => void" } } },
    coverLabel: { control: 'text', description: "Accessible name for the cover region. The cover is a labelled region, NOT role=\"dialog\": it covers the panel but the host page behind stays reachable and there is no focus trap, so aria-modal would misdescribe it. Render the CoverHeader title as a heading with the same text.", table: { category: 'Accessibility', defaultValue: { summary: "Panel cover" }, type: { summary: "string" } } },
    coverId: { control: 'text', description: "id on the cover region, so an external trigger can point at it with aria-controls.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Injectable assistant shell: five modes (floating/sidebar/fullscreen/bottomsheet/embedded) laying out Header / Body / Footer, with an optional slide-away navigation drawer underneath and an optional in-panel cover above everything.\n\n**Import**\n\n```ts\nimport { SidePanel } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Header** _(optional)_ — The top bar region (SidePanel.Header).\n- **Body** — The scrollable content region with a fade-scrim (SidePanel.Body); forwards a ref + onScroll + an overlay slot.\n- **Footer** _(optional)_ — Non-scrolling bottom rows (SidePanel.Footer), e.g. a context chip + composer.\n- **Resize** _(optional)_ — The drag handle, auto-rendered in sidebar mode.\n- **Drawer** _(optional)_ — The slide-away navigation layer under the panel content (the `drawer` prop).\n- **DrawerBody** _(optional)_ — Scrolling region inside the drawer (SidePanel.DrawerBody).\n- **DrawerFooter** _(optional)_ — Sticky bottom row of the drawer, e.g. an account / settings trigger (SidePanel.DrawerFooter).\n- **Scrim** _(optional)_ — Click-to-close overlay on the peeking content while the drawer is open.\n- **Cover** _(optional)_ — A layer filling the panel rectangle above the content and the drawer (the `cover` prop); the panel-scoped alternative to a viewport-filling Dialog.\n- **CoverHeader** _(optional)_ — Non-scrolling top row of the cover (SidePanel.CoverHeader).\n- **CoverBody** _(optional)_ — The cover content region (SidePanel.CoverBody)." } },
  },
};

export const Playground = {
  args: {
    mode: "sidebar",
    width: 0,
    minWidth: "360",
    maxWidth: 0,
    sheetHeight: 0,
    sheetFull: false,
    children: "Content",
    drawerOpen: "false",
    drawerWidth: "320",
    drawerPeek: "56",
    drawerLabel: "Menu",
  },
  parameters: { docs: { source: { code: `<SidePanel mode="sidebar" width={w} onWidth={setW}
  drawer={<><SidePanel.DrawerBody>…history…</SidePanel.DrawerBody><SidePanel.DrawerFooter><Account/></SidePanel.DrawerFooter></>}
  drawerOpen={navOpen} onDrawerOpenChange={setNavOpen} drawerId="nav">
  <SidePanel.Header>…</SidePanel.Header>
  <SidePanel.Body ref={bodyRef} onScroll={onScroll} overlay={<JumpToLatest/>}>…</SidePanel.Body>
  <SidePanel.Footer><Composer/></SidePanel.Footer>
</SidePanel>` } } },
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {["floating","sidebar","fullscreen","bottomsheet","embedded"].map((v) => (
        <SidePanel key={v} mode={v}>{v}</SidePanel>
      ))}
    </div>
  ),
};

/* The drawer, with a REAL Header/Body/Footer composition — the generated Gallery above
   passes a bare string child, which never exercises the display:contents footer that the
   slider has to flex. Switch `mode` in the toolbar to check all five; in sidebar mode
   confirm the resize handle still surfaces OUTSIDE the panel edge on hover (the drawer's
   clip lives on the stage precisely so that keeps working). */
export const Drawer = {
  // width matters: .krnl-panel--sidebar is position:fixed with no intrinsic width, so
  // without it the panel shrink-to-fits its content and the clamp has nothing to clamp to.
  args: { mode: 'sidebar', width: 420, drawerWidth: 320, drawerPeek: 56 },
  argTypes: { children: { control: false }, drawer: { control: false }, drawerOpen: { control: false } },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <SidePanel {...args} drawerOpen={open} onDrawerOpenChange={setOpen}
        drawerId="sp-drawer" drawerLabel="History"
        drawer={<>
          <div style={{ padding: 'var(--space-3) var(--space-3) var(--space-2)' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>{Icon.plus({ size: 13 })}New chat</Button>
          </div>
          <SidePanel.DrawerBody>
            <nav aria-label="Recent">
              {['Prescription renewal', 'Referral letter', 'HbA1c targets', 'Absence certificate'].map((c) => (
                <ActionRow key={c} icon={Icon.chat({ size: 14 })} label={c} onClick={() => setOpen(false)} />
              ))}
            </nav>
          </SidePanel.DrawerBody>
          <SidePanel.DrawerFooter>
            <ActionRow icon={Icon.user({ size: 14 })} label="Dr. Vermeulen" description="Manage assistant" />
          </SidePanel.DrawerFooter>
        </>}>
        <SidePanel.Header>
          <IconButton aria-label="Menu" active={open} aria-expanded={open} aria-controls="sp-drawer"
            onClick={() => setOpen((v) => !v)}>{Icon.menu({ size: 16, w: 2 })}</IconButton>
          <div className="krnl-header-title">Assistant</div>
        </SidePanel.Header>
        <SidePanel.Body>
          <div className="krnl-page" style={{ padding: 'var(--space-3)' }}>
            {Array.from({ length: 12 }, (_, i) => <p key={i}>Body line {i + 1} — scrolls independently of the drawer.</p>)}
          </div>
        </SidePanel.Body>
        <SidePanel.Footer>
          <div className="krnl-inputbar" style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
            Composer — must stay pinned while the panel slides.
          </div>
        </SidePanel.Footer>
      </SidePanel>
    );
  },
};

/* The cover — an in-panel settings-style takeover. Resize the panel (drag the handle in
   sidebar mode, or switch `mode` in the toolbar) while the cover is open: the handle
   stays outside the stage's clip and therefore operable, which is the whole point — a
   real consumer uses this to flip a settings surface between drill-down and rail
   layouts live, with nothing unmounting. Tab through the body: focus must stay inside
   the cover (the underlying content is inert), and Escape must close it. */
export const Cover = {
  args: { mode: 'sidebar', width: 420 },
  argTypes: { children: { control: false }, cover: { control: false }, coverOpen: { control: false } },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <SidePanel {...args} coverOpen={open} onCoverOpenChange={setOpen}
        coverId="sp-cover" coverLabel="Settings"
        cover={open ? (
          <>
            <SidePanel.CoverHeader>
              <h2 className="krnl-cover-head-title">Settings</h2>
              <div className="krnl-cover-head-action">
                <IconButton aria-label="Close" onClick={() => setOpen(false)}>{Icon.close({ size: 15, w: 2 })}</IconButton>
              </div>
            </SidePanel.CoverHeader>
            <SidePanel.CoverBody scroll>
              <div style={{ padding: 'var(--space-4)' }}>
                {['Billing', 'Usage', 'Feature flags'].map((c) => (
                  <ActionRow key={c} icon={Icon.flag({ size: 14 })} label={c} description="Example settings row" />
                ))}
              </div>
            </SidePanel.CoverBody>
          </>
        ) : null}>
        <SidePanel.Header>
          <IconButton aria-label="Open settings" onClick={() => setOpen(true)}>{Icon.dots({ size: 15, w: 2 })}</IconButton>
          <div className="krnl-header-title">Assistant</div>
        </SidePanel.Header>
        <SidePanel.Body>
          <div className="krnl-page" style={{ padding: 'var(--space-3)' }}>
            {Array.from({ length: 12 }, (_, i) => <p key={i}>Body line {i + 1} — inert and unreachable while the cover is open.</p>)}
          </div>
        </SidePanel.Body>
        <SidePanel.Footer>
          <div className="krnl-inputbar" style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
            Composer — inert while the cover is open.
          </div>
        </SidePanel.Footer>
      </SidePanel>
    );
  },
};
