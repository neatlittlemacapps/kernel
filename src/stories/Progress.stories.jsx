import { Progress } from '@corilus/kernel';

export default {
  title: 'Core/Feedback & Status/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    label: { control: false, description: "Caption above the track; also the accessible name. If omitted you must supply aria-label instead.", table: { category: 'Content', type: { summary: "ReactNode" } } },
    'aria-label': { control: 'text', description: "Accessible name when there is no visible label. Exactly one of label / aria-label is required - Base UI names the progressbar only from a mounted label, so a bare bar is otherwise unnamed (WCAG 4.1.2).", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Determinate progress of a task toward completion (Base UI progress).\n\n**Import**\n\n```ts\nimport { Progress } from '@corilus/kernel'\n```\n\n**Do**\n- Give every Progress a name: a visible label, or aria-label when the bar stands alone. Without one the progressbar is unnamed.\n- Use for a task with a knowable percentage (upload, import); pair with a value so progress is legible.\n\n**Don't**\n- Use Progress to report a static level or score (battery, risk) - that is a Meter. Progress implies movement toward done.\n\n**Anatomy**\n- **Label** _(optional)_ — Caption + accessible name.\n- **Track** — The rail.\n- **Indicator** — The fill, sized to value/max by Base UI." } },
  },
};

export const Playground = {
  args: {
    label: "Label",
    value: 64,
    max: 100,
  },
  parameters: { docs: { source: { code: `<Progress label="Uploading" value={64} />` } } },
};
