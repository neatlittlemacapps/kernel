import { ScheduleStrip } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/ScheduleStrip',
  component: ScheduleStrip,
  tags: ['autodocs'],
  argTypes: {
    days: {  control: 'text' , description: "Ordered day cells. label is the short day name shown under each dot; status is one of taken, missed, upcoming, or paused" },
    ariaLabel: {  control: 'text' , description: "Accessible name for the img-role list, e.g. a summary of the adherence week." },
  },
  parameters: {
    docs: {
      description: {
        component: "Compact row of day cells for medication adherence; each cell colours by its taken / missed / upcoming / paused status.",
      },
    },
  },
};

export const Default = {
  args: {
    days: undefined,
    ariaLabel: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ScheduleStrip days={[{ label: "Mo", status: "taken" }, { label: "Tu", status: "missed" }]} ariaLabel="Adherence this week" />` },
    },
  },
};
