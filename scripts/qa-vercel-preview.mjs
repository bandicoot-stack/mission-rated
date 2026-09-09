import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decideVercelBuild } from './vercel-ignore-build.mjs';

const decide = input => decideVercelBuild(input);

assert.equal(decide({ env: { VERCEL_ENV: 'production' }, branch: 'main', commitMessage: '' }).action, 'build');
assert.equal(decide({ env: { VERCEL_TARGET_ENV: 'production' }, branch: 'feature/x', commitMessage: '' }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'main', commitMessage: '' }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '[preview] test this change' }).action, 'build');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: 'runtime change' }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '[skip preview]' }).action, 'ignore');
assert.equal(decide({ env: { VERCEL_ENV: 'preview' }, branch: 'feature/x', commitMessage: '' }).action, 'ignore');

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(
  packageJson.engines?.node,
  '20.x',
  'Mission Rated must pin the Node major to 20.x so Vercel cannot silently advance to a future major.'
);

const nvmrc = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim();
assert.equal(
  nvmrc,
  '20',
  'Mission Rated local Node selection must stay on the same Node 20 major as production.'
);

console.log('Vercel runtime QA passed: production always builds, previews require [preview], and production/local Node stay pinned to major 20.');
