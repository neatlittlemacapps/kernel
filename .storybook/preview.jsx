// MUST be first: populates window.React before any Kernel component module evaluates
import './react-global.js';

import '../tokens/tokens.css';
import '../src/styles.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  globalTypes: {
    brand: {
      description: 'Brand',
      defaultValue: 'corilus',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'corilus', title: 'Corilus' },
          { value: 'semble', title: 'Semble' },
          { value: 'myneva', title: 'Myneva' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Density',
      defaultValue: 'comfortable',
      toolbar: {
        title: 'Density',
        icon: 'collapse',
        items: [
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
        ],
        dynamicTitle: true,
      },
    },
    breakpoint: {
      description: 'Breakpoint',
      defaultValue: 'md',
      toolbar: {
        title: 'Breakpoint',
        icon: 'expand',
        items: [
          { value: 'sm', title: 'SM' },
          { value: 'md', title: 'MD' },
          { value: 'lg', title: 'LG' },
          { value: 'xl', title: 'XL' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const { brand, theme, density, breakpoint } = context.globals;
      return (
        <div
          className="krnl-companion-layer"
          data-brand={brand}
          data-theme={theme}
          data-density={density}
          data-breakpoint={breakpoint}
          style={{ padding: '1rem' }}
        >
          <Story />
        </div>
      );
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
