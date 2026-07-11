import { MedicationCard } from '@corilus/kernel/clinical';

export default {
  title: 'Kernel/Composite/Clinical/MedicationCard',
  component: MedicationCard,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The FHIR MedicationStatement: { name, dose, frequency, medicationStatus, schedule, reason, prescriber }." },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Fidelity (forwarded to the underlying Card)." },
    onEdit: {  control: false , description: "Invoked when the user enters edit (Shoot stage)." },
    onMarkTaken: {  control: false , description: "Invoked when the user marks a dose taken." },
  },
  parameters: {
    docs: {
      description: {
        component: "FHIR MedicationStatement. Schedule strip in Sprout; mark-taken in Shoot. Prescribing requires Rooted.",
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
      source: { code: `<MedicationCard data={med} stage="sprout" onMarkTaken={markTaken} />` },
    },
  },
};
