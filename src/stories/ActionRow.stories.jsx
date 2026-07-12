import { ActionRow } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Navigation/ActionRow',
  component: ActionRow,
  tags: ['autodocs'],
  argTypes: {
    icon: {  control: 'text' , description: "Leading glyph, e.g. Icon.search({ size: 18 })." },
    label: {  control: 'text' , description: "The action name; the primary line and accessible name." },
    description: {  control: 'text' , description: "Secondary line beneath the label." },
    tone: {  control: 'text' , description: "Semantic colour accent for the row." },
    selected: {  control: 'boolean' , description: "Highlights the row as the current selection (keyboard / active item)." },
    reason: {  control: 'text' , description: "When disabled, the gating reason shown to explain why." },
    onClick: {  control: false , description: "Invoked when the row is activated." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "The one canonical action/command row (icon, label, description, chevron); gating-aware.",
      },
    },
  },
};

export const Default = {
  args: {
    label: "label",
    description: "description",
    tone: "tone",
    selected: false,
    reason: "reason",
  },
  parameters: {
    docs: {
      source: { code: `<ActionRow icon={Icon.search({ size: 18 })} label="Search records" description="Find a patient" onClick={run} />` },
    },
  },
};
