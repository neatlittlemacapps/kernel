
// Vite transform plugin: Kernel source files do `const React = window.React` at the
// top of each module with no ESM import. In Rolldown production builds (Vite 6+),
// these chunks can evaluate before preview.jsx has set window.React. This plugin
// injects the global assignment *inside* each affected module so it is guaranteed
// to run before the window.React read in the same module evaluation context.
const kernelReactGlobalPlugin = {
  name: 'kernel-react-global',
  transform(code, id) {
    if (id.includes('/kernel/src/') && code.includes('window.React')) {
      const shim =
        `import * as __krnlReact__ from 'react';\n` +
        `import * as __krnlReactDOM__ from 'react-dom';\n` +
        `if (!globalThis.React) globalThis.React = __krnlReact__;\n` +
        `if (!globalThis.ReactDOM) globalThis.ReactDOM = __krnlReactDOM__;\n`;
      return { code: shim + code, map: null };
    }
  },
};

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), kernelReactGlobalPlugin],
    };
  },
};
export default config;
