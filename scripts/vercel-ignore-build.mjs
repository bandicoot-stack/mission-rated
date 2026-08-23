import { execFileSync } from 'node:child_process';

const SAFE_PREVIEW_PATHS = [
  path => path.startsWith('specs/'),
  path => path.startsWith('docs/'),
  path => path.startsWith('.github/'),
  path => path.toLowerCase().endsWith('.md'),
];

export function decideVercelBuild({ env = {}, branch = '', commitMessage = '', changedFiles = null, gitContextValid = true } = {}) {
  const target = String(env.VERCEL_TARGET_ENV || env.VERCEL_ENV || '').toLowerCase();
  const ref = String(env.VERCEL_GIT_COMMIT_REF || branch || '');

  if (target === 'production' || ref === 'main') {
    return { action: 'build', reason: 'production/main must always build' };
  }

  if (/\[skip preview\]/i.test(commitMessage)) {
    return { action: 'ignore', reason: 'commit explicitly marked [skip preview]' };
  }

  if (!gitContextValid || !Array.isArray(changedFiles)) {
    return { action: 'build', reason: 'unable to determine changed files safely' };
  }

  if (changedFiles.length === 0) {
    return { action: 'ignore', reason: 'no changed files since previous deployment' };
  }

  const allNonRuntime = changedFiles.every(path => SAFE_PREVIEW_PATHS.some(match => match(path)));
  if (allNonRuntime) {
    return { action: 'ignore', reason: 'preview changes are documentation/spec/workflow metadata only' };
  }

  return { action: 'build', reason: 'runtime-impacting preview change detected' };
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function runCli() {
  let branch = process.env.VERCEL_GIT_COMMIT_REF || '';
  let commitMessage = '';
  let changedFiles = null;
  let gitContextValid = true;

  try {
    if (!branch) branch = git(['branch', '--show-current']);
    commitMessage = git(['log', '-1', '--pretty=%B']);

    const base = process.env.VERCEL_GIT_PREVIOUS_SHA || 'HEAD^';
    git(['cat-file', '-e', `${base}^{commit}`]);
    const output = git(['diff', '--name-only', base, 'HEAD']);
    changedFiles = output ? output.split('\n').filter(Boolean) : [];
  } catch {
    gitContextValid = false;
  }

  const decision = decideVercelBuild({
    env: process.env,
    branch,
    commitMessage,
    changedFiles,
    gitContextValid,
  });

  console.log(`[vercel-ignore-build] ${decision.action}: ${decision.reason}`);
  // Vercel ignored-build semantics: exit 0 = skip deployment, exit 1 = continue build.
  process.exit(decision.action === 'ignore' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) runCli();
