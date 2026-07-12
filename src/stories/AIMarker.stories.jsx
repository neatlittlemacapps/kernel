import { AIMarker } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/AI/AIMarker',
  component: AIMarker,
  tags: ['autodocs'],
  argTypes: {
    text: {  control: 'text' , description: "The disclosure text, e.g. \"AI-generated - verify before acting\"." },
  },
  parameters: {
    docs: {
      description: {
        component: "AI-generated / verify provenance marker.",
      },
    },
  },
};

export const Default = {
  args: {
    text: "text",
  },
  parameters: {
    docs: {
      source: { code: `<AIMarker text="AI-generated - verify before acting" />` },
    },
  },
};
