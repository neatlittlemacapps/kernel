import { SidePanel } from '@corilus/kernel';

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
  },
  parameters: {
    docs: { description: { component: "Injectable assistant shell: five modes (floating/sidebar/fullscreen/bottomsheet/embedded) laying out Header / Body / Footer.\n\n**Import**\n\n```ts\nimport { SidePanel } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Header** _(optional)_ — The top bar region (SidePanel.Header).\n- **Body** — The scrollable content region with a fade-scrim (SidePanel.Body); forwards a ref + onScroll + an overlay slot.\n- **Footer** _(optional)_ — Non-scrolling bottom rows (SidePanel.Footer), e.g. a context chip + composer.\n- **Resize** _(optional)_ — The drag handle, auto-rendered in sidebar mode." } },
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
  },
  parameters: { docs: { source: { code: `<SidePanel mode="sidebar" width={w} onWidth={setW}>
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
