import { ConditionCard } from '@corilus/kernel/clinical';

export default {
  title: 'Kernel/Composite/Clinical/ConditionCard',
  component: ConditionCard,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The FHIR Condition: { code, clinicalStatus, severity, onsetDate, verification, note }. code is the title; clinicalStatus" },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Fidelity forwarded to the underlying Card. Sprout and Shoot render the onset/severity/verification field list; Sprout ad" },
    onEdit: {  control: false , description: "Invoked when the user taps the edit chip in Shoot stage." },
    onStatusChange: {  control: false , description: "Invoked with the condition when the user triggers the Shoot-stage status-update CTA." },
  },
  parameters: {
    docs: {
      description: {
        component: "FHIR Condition card. Status pill follows clinicalStatus mapped to interpretation.",
      },
    },
  },
};

export const Default = {
  args: {
    data: undefined,
    stage: "seed",
  },
  parameters: {
    docs: {
      source: { code: `<ConditionCard data={condition} stage="sprout" onEdit={handleEdit} />` },
    },
  },
};
