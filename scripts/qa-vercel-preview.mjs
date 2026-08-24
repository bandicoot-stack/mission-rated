import assert from 'node:assert/strict';
import { decideVercelBuild } from './vercel-ignore-build.mjs';

const decide = input => decideVercelBuild(input);

assert.equal(decide({ env: { VERCEL_ENV: 'production' }, branch: 'main', commitMessage: '' }).action, 'build');
assert.equal(decide({ env: { VERCEL_TARGET_ENV: 'production' }, branch: 'feature/x', commitMessage: '' }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'main', commitMessage: '' }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '[preview] test this change' }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: 'runtime change' }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '[skip preview]' }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '' }).action, 'ignore');

console.log('Vercel preview policy QA passed: production always builds; previews require [preview].');
