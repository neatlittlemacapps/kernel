import { ReferenceRangeBar } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/ReferenceRangeBar',
  component: ReferenceRangeBar,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'number' , description: "The measured value; positions the marker and decides its in-range or out-of-range styling." },
    low: {  control: 'number' , description: "Lower bound of the normal band, shown as the left scale tick." },
    high: {  control: 'number' , description: "Upper bound of the normal band, shown as the right scale tick." },
    absMin: {  control: 'number' , description: "Left end of the drawn axis. Defaults to 70% of the smaller of value and low when omitted, so the marker never sits on th" },
    absMax: {  control: 'number' , description: "Right end of the drawn axis. Defaults to 130% of the larger of value and high when omitted." },
    ariaLabel: {  control: 'text' , description: "Accessible name for the img-role strip, e.g. the value against its reference range in words." },
  },
  parameters: {
    docs: {
      description: {
        component: "Horizontal reference-range strip: a normal band plus a marker for the measured value, colour-coded in or out of range.",
      },
    },
  },
};

export const Default = {
  args: {
    value: 0,
    low: 0,
    high: 0,
    absMin: 0,
    absMax: 0,
    ariaLabel: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ReferenceRangeBar value={5.9} low={4} high={5.6} ariaLabel="HbA1c 5.9%, reference 4 to 5.6" />` },
    },
  },
};
