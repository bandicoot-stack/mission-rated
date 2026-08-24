import { execFileSync } from 'node:child_process';

export function decideVercelBuild({ env = {}, branch = '', commitMessage = '' } = {}) {
  const target = String(env.VERCEL_TARGET_ENV || env.VERCEL_ENV || '').toLowerCase();
  const ref = String(env.VERCEL_GIT_COMMIT_REF || branch || '');

  if (target === 'production' || ref === 'main') {
    return { action: 'build', reason: 'production/main must always build' };
  }

  if (/\[preview\]/i.test(commitMessage)) {
    return { action: 'build', reason: 'preview explicitly requested with [preview]' };
  }

  return { action: 'ignore', reason: 'preview deployments are opt-in to preserve Vercel build quota' };
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function runCli() {
  let branch = process.env.VERCEL_GIT_COMMIT_REF || '';
  let commitMessage = '';

  try {
    if (!branch) branch = git(['branch', '--show-current']);
    commitMessage = git(['log', '-1', '--pretty=%B']);
  } catch {
    // If Git metadata is unavailable, non-production remains ignored by default.
  }

  const decision = decideVercelBuild({
    env: process.env,
    branch,
    commitMessage,
  });

  console.log(`[vercel-ignore-build] ${decision.action}: ${decision.reason}`);
  // Vercel ignored-build semantics: exit 0 = skip deployment, exit 1 = continue build.
  process.exit(decision.action === 'ignore' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) runCli();
