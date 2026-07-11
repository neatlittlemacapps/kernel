import { DemographicCard } from '@corilus/kernel/clinical';

export default {
  title: 'Kernel/Composite/Clinical/DemographicCard',
  component: DemographicCard,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The FHIR Patient: { name, birthDate, age, gender, identifier, gp, phone, address, lastVisit }. name is the title; the re" },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Fidelity forwarded to the underlying Card. Seed shows age only; Sprout and Shoot render the attribute field list; Sprout" },
    onEdit: {  control: false , description: "Invoked when the user taps the edit chip in Shoot stage." },
    onSave: {  control: false , description: "Invoked with the patient when the user triggers the Shoot-stage save CTA." },
  },
  parameters: {
    docs: {
      description: {
        component: "FHIR Patient identity card. Seed/Sprout/Shoot. No time-series; attributes flow as a field list.",
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
      source: { code: `<DemographicCard data={patient} stage="sprout" onEdit={handleEdit} />` },
    },
  },
};
