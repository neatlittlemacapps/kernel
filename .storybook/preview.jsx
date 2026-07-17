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
          style={{
            padding: '1rem',
            minHeight: '100vh',
            background: 'var(--surface-page)',
            color: 'var(--color-text-primary, inherit)',
          }}
        >
          <Story />
        </div>
      );
    },
  ],

  parameters: {
    options: {
      // Tier is fixed (Core, Chat, Clinical); everything under a tier (category, family,
      // component name) sorts A-Z; within one component, Docs then Playground always lead,
      // then the rest keep their declared order.
      storySort: (a, b) => {
        const TIER_ORDER = ['Core', 'Chat', 'Clinical'];
        const tierRank = (title) => {
          const idx = TIER_ORDER.indexOf(title.split('/')[0]);
          return idx === -1 ? TIER_ORDER.length : idx;
        };

        if (a.title !== b.title) {
          const diff = tierRank(a.title) - tierRank(b.title);
          if (diff !== 0) return diff;
          return a.title.localeCompare(b.title, 'en-US', { numeric: true });
        }

        const STORY_ORDER = ['Docs', 'Playground'];
        const storyRank = (name) => {
          const idx = STORY_ORDER.indexOf(name);
          return idx === -1 ? STORY_ORDER.length : idx;
        };
        return storyRank(a.name) - storyRank(b.name);
      },
    },
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
