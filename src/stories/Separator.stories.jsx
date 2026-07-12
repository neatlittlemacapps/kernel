import { Separator } from '@corilus/kernel';

export default {
  title: 'Core/Structure/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: "A visual divider between sections or items (Base UI separator).\n\n**Import**\n\n```ts\nimport { Separator } from '@corilus/kernel'\n```\n\n**Do**\n- Use to group; often whitespace alone is enough - reach for a rule only when the grouping needs a hard edge.\n\n**Don't**\n- Stack multiple separators for spacing - adjust margins/tokens instead.\n\n**Anatomy**\n- **Rule** — The hairline; horizontal or vertical per orientation." } },
  },
};

export const Playground = {
  parameters: { docs: { source: { code: `<Separator />` } } },
};
