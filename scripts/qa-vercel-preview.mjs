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
  '24.x',
  'Mission Rated must pin the Node major to 24.x so Vercel builds remain supported after Node 20 deprecation.'
);

const nvmrc = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim();
assert.equal(
  nvmrc,
  '24',
  'Mission Rated local Node selection must stay on the same Node 24 major as production.'
);

const vercelConfig = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const globalHeaders = vercelConfig.headers?.find(rule => rule.source === '/(.*)')?.headers ?? [];
const headerValue = key => globalHeaders.find(header => header.key.toLowerCase() === key.toLowerCase())?.value;

assert.equal(
  headerValue('Strict-Transport-Security'),
  'max-age=63072000; includeSubDomains; preload',
  'Mission Rated must preserve the production HSTS policy.'
);
assert.equal(headerValue('X-Frame-Options'), 'DENY', 'Mission Rated must remain protected against framing.');
assert.equal(headerValue('X-Content-Type-Options'), 'nosniff', 'Mission Rated must disable MIME sniffing.');
assert.equal(
  headerValue('Referrer-Policy'),
  'strict-origin-when-cross-origin',
  'Mission Rated must preserve the production referrer policy.'
);
assert.equal(
  headerValue('Permissions-Policy'),
  'camera=(), microphone=(), geolocation=()',
  'Mission Rated must keep unused browser capabilities disabled by default.'
);

console.log('Vercel runtime QA passed: production always builds, previews require [preview], Node stays pinned to major 24, and baseline security headers are enforced.');
