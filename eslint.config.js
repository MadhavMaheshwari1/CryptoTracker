import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },  // Ignore the 'dist' directory
  {
    files: ['**/*.{js,jsx}'],  // Apply these settings to all JavaScript and JSX files
    languageOptions: {
      ecmaVersion: 2020,  // Specify the ECMAScript version to use
      globals: globals.browser,  // Use browser-specific global variables
      parserOptions: {
        ecmaVersion: 'latest',  // Enable the latest ECMAScript version
        ecmaFeatures: { jsx: true },  // Enable JSX syntax support
        sourceType: 'module',  // Enable ES module support
      },
    },
    settings: { react: { version: '18.3' } },  // React settings, specifying React version
    plugins: {
      react,  // Enable the eslint-plugin-react
      'react-hooks': reactHooks,  // Enable the eslint-plugin-react-hooks
      'react-refresh': reactRefresh,  // Enable the eslint-plugin-react-refresh
    },
    rules: {
      ...js.configs.recommended.rules,  // Apply the recommended ESLint rules
      ...react.configs.recommended.rules,  // Apply the recommended React rules
      ...react.configs['jsx-runtime'].rules,  // Apply the JSX runtime rules for React 17+
      ...reactHooks.configs.recommended.rules,  // Apply the recommended React Hooks rules
      'react/jsx-no-target-blank': 'off',  // Disable the 'no target _blank' rule
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },  // Warn if non-components are exported except constants
      ],
      'react/prop-types': 'off',  // Disable the prop-types validation rule
    },
  },
];
