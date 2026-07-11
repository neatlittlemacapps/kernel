import { EditChip } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/EditChip',
  component: EditChip,
  tags: ['autodocs'],
  argTypes: {
    label: {  control: 'text' , description: "The chip text shown beside the pencil glyph." },
    onClick: {  control: false , description: "Invoked when the chip is activated (enters edit mode)." },
  },
  parameters: {
    docs: {
      description: {
        component: "Pencil + label trailing chip used on Shoot-stage cards. Composes Base UI Button for the a11y and focus baseline.",
      },
    },
  },
};

export const Default = {
  args: {
    label: "label",
  },
  parameters: {
    docs: {
      source: { code: `<EditChip label="Bewerken" onClick={startEdit} />` },
    },
  },
};
