import { ValueDisplay } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/ValueDisplay',
  component: ValueDisplay,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text' , description: "The primary reading, rendered large (e.g. 74)." },
    unit: {  control: 'text' , description: "Small trailing unit shown after the value (e.g. \"bpm\")." },
    prefix: {  control: 'text' , description: "Optional small marker before the value (e.g. a comparator like \"<\")." },
  },
  parameters: {
    docs: {
      description: {
        component: "Big numeric value + small unit; the canonical value-slot content for vitals and labs.",
      },
    },
  },
};

export const Default = {
  args: {
    value: undefined,
    unit: undefined,
    prefix: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ValueDisplay value="74" unit="bpm" />` },
    },
  },
};
