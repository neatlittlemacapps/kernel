import { Stepper } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    min: {  control: 'text'  },
    max: {  control: 'text'  },
    step: {  control: 'text'  },
    unit: {  control: 'text' , description: "Small trailing unit shown after the editable value (e.g. \"bpm\")." },
    onChange: {  control: false , description: "Called with the new numeric value on each change; wraps the Base UI onValueChange and skips null (mid-edit) values." },
    ariaLabel: {  control: 'text' , description: "Accessible name for the number field, since there is no visible label." },
  },
  parameters: {
    docs: {
      description: {
        component: "Shoot-stage editable value (minus / value / plus). No save; the consumer provides the CTA in the actions slot.",
      },
    },
  },
};

export const Default = {
  args: {
    unit: "unit",
    ariaLabel: "ariaLabel",
  },
  parameters: {
    docs: {
      source: { code: `<Stepper value={72} unit="bpm" min={30} max={220} onChange={setBpm} ariaLabel="Hartslag" />` },
    },
  },
};
