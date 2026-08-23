import assert from 'node:assert/strict';
import { decideVercelBuild } from './vercel-ignore-build.mjs';

const decide = input => decideVercelBuild({ gitContextValid: true, changedFiles: [], ...input });

assert.equal(decide({ env: { VERCEL_ENV: 'production' }, branch: 'main', commitMessage: '[skip preview]', changedFiles: ['specs/x.md'] }).action, 'build');
assert.equal(decide({ env: { VERCEL_TARGET_ENV: 'production' }, branch: 'feature/x', commitMessage: '[skip preview]', changedFiles: ['app.js'] }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'main', commitMessage: '[skip preview]', changedFiles: ['README.md'] }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: 'wip [skip preview]', changedFiles: ['app.js'] }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', changedFiles: ['specs/changes/a/proposal.md', '.github/workflows/qa.yml', 'README.md'] }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', changedFiles: [] }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', changedFiles: ['featured.html'] }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', changedFiles: ['assets/partners/yorktown-tools/logo.webp'] }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', changedFiles: ['vercel.json'] }).action, 'build');
assert.equal(decideVercelBuild({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '', changedFiles: null, gitContextValid: false }).action, 'build');

console.log('Vercel preview policy QA passed.');
