import { ReactionList } from '@corilus/kernel/clinical';

export default {
  title: 'Clinical/Primitives/ReactionList',
  component: ReactionList,
  tags: ['autodocs'],
  argTypes: {
    reactions: { control: false, description: "The reaction descriptions to list, one bullet each (e.g. hives, anaphylaxis).", type: { name: 'other', value: 'string[]', required: true }, table: { category: 'Content', type: { summary: "string[]" } } },
  },
  parameters: {
    docs: { description: { component: "Bulleted list of allergy reactions, each with a leading dot marker.\n\n**Import**\n\n```ts\nimport { ReactionList } from '@corilus/kernel/clinical'\n```" } },
  },
};

export const Playground = {
  args: {
    reactions: ["Netelroos","Angio-oedeem","Anafylaxie"],
  },
  parameters: { docs: { source: { code: `<ReactionList reactions={["Hives", "Anaphylaxis"]} />` } } },
};
