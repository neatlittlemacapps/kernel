// Kernel components read React off a global -- `const React = window.React;` at
// module top-level, with no ESM import. This is intentional in the shipped source
// (the extraction-boundary design: components bind to a host-provided window.React).
//
// But for the Storybook gallery build it's a hazard: in Rolldown production builds
// (Vite 6+) component chunks can evaluate before preview.jsx sets window.React,
// yielding `undefined is not an object (evaluating '$.createContext')`.
//
// Fix, scoped to the Storybook build only (source on disk is untouched): rewrite the
// two uniform global reads into real ESM imports. Vite dedupes `react`, so every
// module gets the same singleton binding the working dev path already uses -- minus
// the evaluation-order hazard, since there's no longer any global to read.
const kernelReactGlobalPlugin = {
  name: 'kernel-react-global',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('/kernel/src/')) return;
    if (!code.includes('window.React')) return;
    const next = code
      .replace(/const React = window\.React;/g, `import * as React from 'react';`)
      .replace(/const ReactDOM = window\.ReactDOM;/g, `import * as ReactDOM from 'react-dom';`);
    if (next === code) return;
    return { code: next, map: null };
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
