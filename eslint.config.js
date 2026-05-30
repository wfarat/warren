import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  includeIgnoreFile('.gitignore', { gitignoreResolution: true }),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['function', 'class'] },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: ['return', 'if', 'function'] },
        { blankLine: 'always', prev: ['type', 'interface', 'import'], next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
      '@stylistic/max-len': ['error', { code: 160 }],
    },
  },
]);
