import { Progress } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Feedback & Status/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    label: {  control: 'text' , description: "Caption above the track; also the accessible name. If omitted you must supply aria-label instead." },
    'aria-label': {  control: 'text' , description: "Accessible name when there is no visible label. Exactly one of label / aria-label is required - Base UI names the progre" },
    value: {  control: 'text'  },
    max: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Determinate progress of a task toward completion (Base UI progress).",
      },
    },
  },
};

export const Default = {
  args: {
    label: "label",
    'aria-label': "aria-label",
  },
  parameters: {
    docs: {
      source: { code: `<Progress label="Uploading" value={64} />` },
    },
  },
};
