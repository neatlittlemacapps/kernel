import { ScheduleStrip } from '@corilus/kernel/clinical';

export default {
  title: 'Clinical/Primitives/ScheduleStrip',
  component: ScheduleStrip,
  tags: ['autodocs'],
  argTypes: {
    days: { control: false, description: "Ordered day cells. label is the short day name shown under each dot; status is one of taken, missed, upcoming, or paused and drives the dot colour.", type: { name: 'other', value: 'Array<{ label: string, status: string }>', required: true }, table: { category: 'Content', type: { summary: "Array<{ label: string, status: string }>" } } },
    ariaLabel: { control: 'text', description: "Accessible name for the img-role list, e.g. a summary of the adherence week.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Compact row of day cells for medication adherence; each cell colours by its taken / missed / upcoming / paused status.\n\n**Import**\n\n```ts\nimport { ScheduleStrip } from '@corilus/kernel/clinical'\n```\n\n**Do**\n- Use taken and missed for past days, upcoming for future doses, and paused for a suspended course.\n- Keep labels to one or two characters (weekday initials) so the strip stays compact.\n\n**Don't**\n- Drive this from a status value outside taken, missed, upcoming, or paused; unknown values get no styled dot." } },
  },
};

export const Playground = {
  args: {
    days: [{"label":"Mo","status":"taken"},{"label":"Tu","status":"taken"},{"label":"We","status":"missed"},{"label":"Th","status":"taken"},{"label":"Fr","status":"upcoming"},{"label":"Sa","status":"upcoming"},{"label":"Su","status":"paused"}],
  },
  parameters: { docs: { source: { code: `<ScheduleStrip days={[{ label: "Mo", status: "taken" }, { label: "Tu", status: "missed" }]} ariaLabel="Adherence this week" />` } } },
};
