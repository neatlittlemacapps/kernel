import { SproutToneProvider } from '@corilus/kernel';

export default {
  title: 'Core/Utility/SproutToneProvider',
  component: SproutToneProvider,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ["neutral","heart","breath","oxygen","temperature","pressure","body","lab","identity","condition","allergy","medication"], description: "Named identity tone applied to the subtree via a krnl-tone--* class; descendant cards inherit it unless they set their own tone.", table: { category: 'Appearance' } },
    customColor: { control: false, description: "Colour escape hatch. A CSS colour string sets --card-tone; an object sets the matching --card-tone-* bindings (solid / tint / tintStrong / on) as inline vars.", table: { category: 'Appearance', type: { summary: "string|{solid,tint,tintStrong,on}" } } },
    className: { control: 'text', description: "Extra class names appended after the provider class.", table: { category: 'Appearance', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Sets --card-tone (and optionally tint / tintStrong / on) on a wrapper so descendant cards inherit a tone via the CSS cascade. Cards that explicitly pass their own tone override the provider default.\n\n**Import**\n\n```ts\nimport { SproutToneProvider } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    tone: "neutral",
  },
  parameters: { docs: { source: { code: `<SproutToneProvider tone="heart"><PropertyList items={items} renderItem={renderItem} /></SproutToneProvider>` } } },
};
