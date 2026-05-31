/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import postcssNesting from 'postcss-nesting';
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
  plugins: [tailwindcss(), reactRouter(), svgr(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
});
