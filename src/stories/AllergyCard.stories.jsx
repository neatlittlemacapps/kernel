import { AllergyCard } from '@corilus/kernel/clinical';

export default {
  title: 'Kernel/Composite/Clinical/AllergyCard',
  component: AllergyCard,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The FHIR AllergyIntolerance: { substance, criticality, reactions, recordedDate, lastVerified }. substance is the title; " },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Fidelity forwarded to the underlying Card. Sprout and Shoot render the reaction list; Sprout adds recorded/verified date" },
    onEdit: {  control: false , description: "Invoked when the user enters edit, from the Shoot edit chip or the \"Ernst bijwerken\" CTA." },
  },
  parameters: {
    docs: {
      description: {
        component: "FHIR AllergyIntolerance card. Criticality maps to status interpretation (critical/borderline).",
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
      source: { code: `<AllergyCard data={allergy} stage="sprout" onEdit={handleEdit} />` },
    },
  },
};
