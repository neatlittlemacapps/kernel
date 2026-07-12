import { SidePanel } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Layout/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  argTypes: {
    mode: {  control: 'select', options: ["floating","sidebar","fullscreen","bottomsheet","embedded"] , description: "How the panel is presented / anchored." },
    width: {  control: 'number' , description: "Sidebar-mode width in px (controlled); the resize handle updates it via onWidth." },
    onWidth: {  control: false , description: "Fires while the sidebar resize handle is dragged, with the new width." },
    minWidth: {  control: 'number' , description: "Lower clamp for the sidebar resize." },
    maxWidth: {  control: 'number' , description: "Upper clamp for the sidebar resize (default min(900, 70vw))." },
    sheetHeight: {  control: 'number' , description: "Bottom-sheet height in px; the consumer measures its content and feeds it in." },
    sheetFull: {  control: 'boolean' , description: "Bottom-sheet has reached the fullscreen takeover threshold." },
    children: {  control: 'text' , description: "SidePanel.Header / SidePanel.Body / SidePanel.Footer." },
  },
  parameters: {
    docs: {
      description: {
        component: "Injectable assistant shell: five modes (floating/sidebar/fullscreen/bottomsheet/embedded) laying out Header / Body / Footer.",
      },
    },
  },
};

export const Default = {
  args: {
    mode: "floating",
    width: 0,
    minWidth: 0,
    maxWidth: 0,
    sheetHeight: 0,
    sheetFull: false,
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<SidePanel mode="sidebar" width={w} onWidth={setW}>
  <SidePanel.Header>…</SidePanel.Header>
  <SidePanel.Body ref={bodyRef} onScroll={onScroll} overlay={<JumpToLatest/>}>…</SidePanel.Body>
  <SidePanel.Footer><Composer/></SidePanel.Footer>
</SidePanel>` },
    },
  },
};
