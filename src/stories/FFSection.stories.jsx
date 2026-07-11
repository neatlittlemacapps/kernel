import { FFSection } from '@corilus/kernel';

export default {
  title: 'Kernel/Composite/Utility/FFSection',
  component: FFSection,
  tags: ['autodocs'],
  argTypes: {
    title: {  control: 'text' , description: "Section heading shown on the accordion trigger." },
    children: {  control: 'text' , description: "The flag controls revealed when the section is open." },
    value: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Collapsible Feature-flags section (Base UI Accordion item).",
      },
    },
  },
};

export const Default = {
  args: {
    title: "title",
    children: "...",
    value: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<FFSection value="experiments" title="Experiments">{flags}</FFSection>` },
    },
  },
};
