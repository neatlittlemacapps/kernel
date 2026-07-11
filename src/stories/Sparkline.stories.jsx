import { Sparkline } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    data: {  control: 'text' , description: "The ordered series to plot (oldest to newest). Renders nothing when empty; the axis auto-scales to the min and max." },
    width: {  control: 'number' , description: "Intrinsic viewBox width; the SVG itself scales to 100% of its container, so this only sets the drawing aspect ratio." },
    height: {  control: 'number' , description: "Rendered pixel height and viewBox height of the chart." },
    ariaLabel: {  control: 'text' , description: "Accessible name for the img-role SVG, e.g. a spoken summary of the trend. Provide a value that does not just repeat the " },
  },
  parameters: {
    docs: {
      description: {
        component: "Inline SVG line chart with soft gradient fill; draws in currentColor so it inherits the card tone.",
      },
    },
  },
};

export const Default = {
  args: {
    data: undefined,
    width: 0,
    height: 0,
    ariaLabel: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<Sparkline data={[72, 74, 71, 78, 75]} ariaLabel="Heart rate, last 5 readings" />` },
    },
  },
};
