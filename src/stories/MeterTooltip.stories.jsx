import { MeterTooltip } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Overlay/MeterTooltip',
  component: MeterTooltip,
  tags: ['autodocs'],
  argTypes: {
    tip: {  control: 'text' , description: "The metadata content shown in the popup; when absent the children render bare with no tooltip." },
    children: {  control: 'text' , description: "The trigger element the tooltip is attached to (a value or status pill)." },
    side: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Tooltip wrapper that exposes measurement metadata on hover (timestamp, source). Composes Base UI Tooltip.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<MeterTooltip tip="Gemeten 11:42 · Philips monitor"><ValueDisplay value="74" unit="bpm" /></MeterTooltip>` },
    },
  },
};
