import { PrimaryCTA } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/PrimaryCTA',
  component: PrimaryCTA,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The button label. Write the action it performs (e.g. \"Save value\"), not \"OK\"." },
    onClick: {  control: false , description: "Invoked when the button is activated by pointer or keyboard." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Primary action button for the card actions slot; composes Base UI Button for the focus and keyboard baseline, styled via tokens.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<PrimaryCTA onClick={save}>Save value</PrimaryCTA>` },
    },
  },
};
