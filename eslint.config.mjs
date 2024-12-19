import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()

import eslintPluginLocal from './eslint-plugin-local/index.mjs'

export default [
  // standard,
  ...compat.extends('eslint-config-standard'),
  {
    files: ['**/**.js', '**/**.mjs'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: { 'local': eslintPluginLocal },
    rules: {
      /*
        This is inserted to make this compatible with prettier.
        Once https://github.com/prettier/prettier/issues/3845 and https://github.com/prettier/prettier/issues/3847 are solved this might be not needed any more.
      */
      'space-before-function-paren': 0,
      curly: [2, 'all'],
      'local/no-big-int': 'error',
    },
  },
]

