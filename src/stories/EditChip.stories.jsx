import { EditChip } from '@corilus/kernel';

export default {
  title: 'Core/Actions/EditChip',
  component: EditChip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: "The chip text shown beside the pencil glyph.", table: { category: 'Content', defaultValue: { summary: "Bewerken" }, type: { summary: "string" } } },
    onClick: { control: false, description: "Invoked when the chip is activated (enters edit mode).", table: { category: 'Events', type: { summary: "fn" } } },
  },
  parameters: {
    docs: { description: { component: "Pencil + label trailing chip used on Shoot-stage cards. Composes Base UI Button for the a11y and focus baseline.\n\n**Import**\n\n```ts\nimport { EditChip } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Icon** — The pencil glyph.\n- **Label** — The chip text." } },
  },
};

export const Playground = {
  args: {
    label: "Bewerken",
  },
  parameters: { docs: { source: { code: `<EditChip label="Bewerken" onClick={startEdit} />` } } },
};
