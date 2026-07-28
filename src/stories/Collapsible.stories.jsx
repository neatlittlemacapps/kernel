import { Collapsible } from '@corilus/kernel';

export default {
  title: 'Core/Structure/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: false, description: "The always-visible header that toggles the region (a chevron is added automatically).", table: { category: 'Content', type: { summary: "ReactNode" } } },
    children: { control: 'text', description: "The content revealed when open.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    variant: { control: false, description: "framed (default) draws the trigger as a bordered control; plain drops the box so the header reads as a heading row inside a frame that already exists (a settings pane, a Card, a drawer footer).", table: { category: 'Appearance', defaultValue: { summary: "framed" }, type: { summary: "'framed' | 'plain'" } } },
  },
  parameters: {
    docs: { description: { component: "A single region that expands and collapses (Base UI collapsible).\n\n**Import**\n\n```ts\nimport { Collapsible } from '@corilus/kernel'\n```\n\n**Do**\n- Use to hide secondary detail behind a clear header; keep the header label descriptive of what expands.\n\n**Don't**\n- Use several stacked Collapsibles where only one should be open at a time - use an Accordion for that.\n\n**Anatomy**\n- **Trigger** — The header toggle (with chevron).\n- **Panel** — The revealed region." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
    variant: "framed",
  },
  parameters: { docs: { source: { code: `<Collapsible trigger="Advanced options">
  <p>…</p>
</Collapsible>` } } },
};
