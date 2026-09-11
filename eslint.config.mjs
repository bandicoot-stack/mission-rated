export default [
  {
    // Keep the first lint scope bounded to release-control scripts; expand only through reviewed follow-on work.
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
