import { Slider } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    'aria-label': {  control: 'text' , description: "Accessible name; forwarded to each range-input thumb (a range slider suffixes \" minimum\" / \" maximum\"). Required - a" },
    value: {  control: 'text'  },
    defaultValue: {  control: 'text'  },
    onValueChange: {  control: 'text'  },
    min: {  control: 'text'  },
    max: {  control: 'text'  },
    step: {  control: 'text'  },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Choose a number or range by dragging along a track (Base UI slider).",
      },
    },
  },
};

export const Default = {
  args: {
    'aria-label': "aria-label",
  },
  parameters: {
    docs: {
      source: { code: `<Slider aria-label="Dose" defaultValue={40} />` },
    },
  },
};
