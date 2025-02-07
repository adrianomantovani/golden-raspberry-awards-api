import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    files: ['**/*.js'],
    ignores: ['**/dist/', '**/node_modules/'],
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: { ...globals.node },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      'import/extensions': ['.js', '.d.ts', '.mjs', '.mts'],
    },

    rules: {
      'camelcase': 'off',
      'consistent-return': 'off',
      'no-use-before-define': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-constructor': 'off',
      'no-unused-vars': [
        'off',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
