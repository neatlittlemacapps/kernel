import { PrimaryCTA } from '@corilus/kernel/clinical';

export default {
  title: 'Clinical/Primitives/PrimaryCTA',
  component: PrimaryCTA,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "The button label. Write the action it performs (e.g. \"Save value\"), not \"OK\".", table: { category: 'Content', type: { summary: "ReactNode" } } },
    onClick: { control: false, description: "Invoked when the button is activated by pointer or keyboard.", table: { category: 'Events', type: { summary: "fn" } } },
  },
  parameters: {
    docs: { description: { component: "Primary action button for the card actions slot; composes Base UI Button for the focus and keyboard baseline, styled via tokens.\n\n**Import**\n\n```ts\nimport { PrimaryCTA } from '@corilus/kernel/clinical'\n```" } },
  },
};

export const Playground = {
  args: {
    children: "Waarde opslaan",
  },
  parameters: { docs: { source: { code: `<PrimaryCTA onClick={save}>Save value</PrimaryCTA>` } } },
};
