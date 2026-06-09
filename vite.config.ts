/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import postcssNesting from 'postcss-nesting';

// 🌟 Check if Vitest is running the show right now
const isTest = process.env.VITEST === 'true';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
  // 🌟 Conditionally filter out reactRouter() if we are running unit tests
  plugins: [
    tailwindcss(),
    !isTest && reactRouter(), // Only run router dev compiler if NOT in a test environment
    svgr(),
    babel({ presets: [reactCompilerPreset()] }),
  ].filter(Boolean), // Clean up falsey values from the array layout
  test: {
    globals: true, // 🌟 Make sure globals is true for clean mocking!
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
});
