import { Sparkline } from '@corilus/kernel/clinical';

export default {
  title: 'Clinical/Primitives/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    data: { control: false, description: "The ordered series to plot (oldest to newest). Renders nothing when empty; the axis auto-scales to the min and max.", type: { name: 'other', value: 'number[]', required: true }, table: { category: 'Content', type: { summary: "number[]" } } },
    width: { control: 'number', description: "Intrinsic viewBox width; the SVG itself scales to 100% of its container, so this only sets the drawing aspect ratio.", table: { category: 'Appearance', defaultValue: { summary: "240" }, type: { summary: "number" } } },
    height: { control: 'number', description: "Rendered pixel height and viewBox height of the chart.", table: { category: 'Appearance', defaultValue: { summary: "56" }, type: { summary: "number" } } },
    ariaLabel: { control: 'text', description: "Accessible name for the img-role SVG, e.g. a spoken summary of the trend. Provide a value that does not just repeat the metric name.", table: { category: 'Accessibility', type: { summary: "string" } } },
  },
  parameters: {
    docs: { description: { component: "Inline SVG line chart with soft gradient fill; draws in currentColor so it inherits the card tone.\n\n**Import**\n\n```ts\nimport { Sparkline } from '@corilus/kernel/clinical'\n```" } },
  },
};

export const Playground = {
  args: {
    data: [72,74,71,78,75,73,76],
    width: 240,
    height: 56,
  },
  parameters: { docs: { source: { code: `<Sparkline data={[72, 74, 71, 78, 75]} ariaLabel="Heart rate, last 5 readings" />` } } },
};
