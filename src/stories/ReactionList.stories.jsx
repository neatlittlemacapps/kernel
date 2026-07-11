import { ReactionList } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/ReactionList',
  component: ReactionList,
  tags: ['autodocs'],
  argTypes: {
    reactions: {  control: 'text' , description: "The reaction descriptions to list, one bullet each (e.g. hives, anaphylaxis)." },
  },
  parameters: {
    docs: {
      description: {
        component: "Bulleted list of allergy reactions, each with a leading dot marker.",
      },
    },
  },
};

export const Default = {
  args: {
    reactions: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<ReactionList reactions={["Hives", "Anaphylaxis"]} />` },
    },
  },
};
