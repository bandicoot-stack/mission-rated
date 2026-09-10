export default [
  {
    files: ['scripts/vercel-ignore-build.mjs', 'scripts/qa-vercel-preview.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'error',
      'consistent-return': 'error',
    },
  },
];
