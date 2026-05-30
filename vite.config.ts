/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    tsconfigPaths(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  test: {
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
});
