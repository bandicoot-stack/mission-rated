import { existsSync, readFileSync } from 'node:fs';

const forbiddenPublicArtifacts = [
  'dist/mission-control.html',
  'dist/mission-control.js',
  'dist/mission-control-metrics.json',
  'dist/agent-system',
];

const exposed = forbiddenPublicArtifacts.filter(path => existsSync(path));

if (exposed.length) {
  console.error('Operational exposure QA failed: founder/internal artifacts were published into dist:');
  for (const path of exposed) console.error(` - ${path}`);
  console.error('These artifacts must remain repo-only until protected by an authenticated server-side authorization boundary.');
  process.exit(1);
}

const metricsFunctionPath = 'supabase/functions/mission-control-metrics/index.ts';
if (!existsSync(metricsFunctionPath)) {
  console.error(`Operational exposure QA failed: ${metricsFunctionPath} must be repository-tracked.`);
  process.exit(1);
}

const metricsFunction = readFileSync(metricsFunctionPath, 'utf8');
const failClosedMarkers = [
  'founder_authorization_not_configured',
  'status: 403',
];
for (const marker of failClosedMarkers) {
  if (!metricsFunction.includes(marker)) {
    console.error(`Operational exposure QA failed: founder metrics function is missing fail-closed marker: ${marker}`);
    process.exit(1);
  }
}

for (const forbidden of ['SUPABASE_SERVICE_ROLE_KEY', '.from(', 'createClient(']) {
  if (metricsFunction.includes(forbidden)) {
    console.error(`Operational exposure QA failed: fail-closed founder metrics function must not access privileged data (${forbidden}).`);
    process.exit(1);
  }
}

console.log('Operational exposure QA passed: founder Command Center stays out of the public build and the tracked metrics function remains fail-closed.');