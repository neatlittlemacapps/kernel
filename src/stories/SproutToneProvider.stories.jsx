import { SproutToneProvider } from '@corilus/kernel';

export default {
  title: 'Kernel/Composite/Utility/SproutToneProvider',
  component: SproutToneProvider,
  tags: ['autodocs'],
  argTypes: {
    tone: {  control: 'select', options: ["neutral","heart","breath","oxygen","temperature","pressure","body","lab","identity","condition","allergy","medication"] , description: "Named identity tone applied to the subtree via a krnl-tone--* class; descendant cards inherit it unless they set their o" },
    customColor: {  control: 'text' , description: "Colour escape hatch. A CSS colour string sets --card-tone; an object sets the matching --card-tone-* bindings (solid / t" },
    className: {  control: 'text' , description: "Extra class names appended after the provider class." },
  },
  parameters: {
    docs: {
      description: {
        component: "Sets --card-tone (and optionally tint / tintStrong / on) on a wrapper so descendant cards inherit a tone via the CSS cascade. Cards that explicitly pass their own tone override the provider default.",
      },
    },
  },
};

export const Default = {
  args: {
    tone: "neutral",
    customColor: undefined,
    className: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<SproutToneProvider tone="heart"><PropertyList items={items} renderItem={renderItem} /></SproutToneProvider>` },
    },
  },
};
