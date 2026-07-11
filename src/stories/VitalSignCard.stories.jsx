import { VitalSignCard } from '@corilus/kernel/clinical';

export default {
  title: 'Kernel/Composite/Clinical/VitalSignCard',
  component: VitalSignCard,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The FHIR Observation projection: { property, value, unit, status, history, measuredAt, reference, trend }. For bloodPres" },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Fidelity forwarded to the underlying Card. Sprout adds sparkline plus trend; Shoot swaps the value for an editable Stepp" },
    onSave: {  control: false , description: "Invoked with the new value when the Shoot-stage Stepper changes or the save CTA fires." },
    onEdit: {  control: false , description: "Invoked when the user taps the edit chip in Sprout stage." },
  },
  parameters: {
    docs: {
      description: {
        component: "FHIR Observation (vital-signs) at Seed/Sprout/Shoot. Handles 9 properties incl. blood pressure (multi-component).",
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
      source: { code: `<VitalSignCard data={vital} stage="sprout" onEdit={handleEdit} />` },
    },
  },
};
