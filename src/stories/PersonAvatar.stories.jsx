import { PersonAvatar } from '@corilus/kernel';

export default {
  title: 'Core/AI & Identity/PersonAvatar',
  component: PersonAvatar,
  tags: ['autodocs'],
  argTypes: {
    p: { control: false, description: "The person record; the name drives the initials fallback when no photo is available.", table: { category: 'Content', type: { summary: "patient" } } },
    size: { control: 'number', description: "Pixel diameter of the (always circular) avatar.", table: { category: 'Appearance', type: { summary: "number" } } },
  },
  parameters: {
    docs: { description: { component: "Person avatar with initials fallback.\n\n**Import**\n\n```ts\nimport { PersonAvatar } from '@corilus/kernel'\n```\n\n**Anatomy**\n- **Photo** _(optional)_ — The person image, shown when available.\n- **Initials** _(optional)_ — One or two letters from the name; shown when there is no photo.\n\n> **Deprecated alias:** `PAv` is a deprecated alias of `PersonAvatar` — use `PersonAvatar`. The alias will be removed in the next major and has no separate story." } },
  },
};

export const Playground = {
  args: {
    size: 0,
  },
  parameters: { docs: { source: { code: `<PersonAvatar p={patient} size={32} />` } } },
};
