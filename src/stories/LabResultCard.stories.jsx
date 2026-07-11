import { LabResultCard } from '@corilus/kernel/clinical';

export default {
  title: 'Kernel/Composite/Clinical/LabResultCard',
  component: LabResultCard,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The FHIR Observation projection: { property, value, unit, status, low, high, measuredAt, trend }. low/high define the re" },
    stage: {  control: 'select', options: ["seed","sprout","shoot"] , description: "Fidelity forwarded to the underlying Card. Sprout renders the reference-range bar plus range/measured footer. Shoot is r" },
    onAcknowledge: {  control: false , description: "Optional handler for acknowledging an out-of-range result; lab acknowledge is generally routed to Rooted." },
  },
  parameters: {
    docs: {
      description: {
        component: "FHIR Observation (laboratory) Seed/Sprout. Reference range central; Shoot rare (lab acknowledge pushed to Rooted).",
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
      source: { code: `<LabResultCard data={lab} stage="sprout" />` },
    },
  },
};
