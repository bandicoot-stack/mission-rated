import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const errors = [];
const requireTokens = (text, tokens, label) => {
  for (const token of tokens) if (!text.includes(token)) errors.push(`${label} missing ${token}`);
};

const home = read('dist/index.html');
const lifestyleHome = read('dist/lifestyle-home.js');
const car = read('dist/buy-a-car.html');

requireTokens(home, ['/lifestyle-home.js'], 'built home');
requireTokens(lifestyleHome, [
  'data-view="cars"',
  'Buy a Car',
  'mrCarFrame',
  '/buy-a-car.html?embedded=1',
  "get('view')==='cars'",
  "searchParams.set('view','cars')"
], 'Mission Rated Live car integration');
requireTokens(car, ['auto-dealers.js', 'car-embed.js'], 'built Buy a Car experience');

if (errors.length) {
  console.error('Mission Rated integration QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Mission Rated integration QA passed: Buy a Car remains embedded in Mission Rated Live and deep-linkable via ?view=cars.');
