import { MeterTooltip } from '@corilus/kernel';

export default {
  title: 'Core/Overlays/Tooltip/MeterTooltip',
  component: MeterTooltip,
  tags: ['autodocs'],
  argTypes: {
    tip: { control: false, description: "The metadata content shown in the popup; when absent the children render bare with no tooltip.", table: { category: 'Content', type: { summary: "node" } } },
    children: { control: 'text', description: "The trigger element the tooltip is attached to (a value or status pill).", table: { category: 'Content', type: { summary: "node" } } },
  },
  parameters: {
    docs: { description: { component: "Tooltip wrapper that exposes measurement metadata on hover (timestamp, source). Composes Base UI Tooltip.\n\n**Import**\n\n```ts\nimport { MeterTooltip } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  args: {
    children: "Content",
  },
  parameters: { docs: { source: { code: `<MeterTooltip tip="Gemeten 11:42 · Philips monitor"><ValueDisplay value="74" unit="bpm" /></MeterTooltip>` } } },
};
