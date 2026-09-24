import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Run after the production build, including when the broader portfolio check fails.
const origin = 'https://adrien-gueret.github.io';
const read = (route) => readFileSync(`dist${route}index.html`, 'utf8');
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
assert(!sitemap.includes('openclassrooms-frontend-engineering'));

for (const prefix of ['', '/fr']) {
  const route = `${prefix}/work/openclassrooms/`;
  const legacy = read(`${prefix}/work/openclassrooms-frontend-engineering/`);
  assert(legacy.includes(`content="0;url=${route}"`), 'Immediate static redirect');
  assert(legacy.includes(`rel="canonical" href="${origin}${route}"`));
  assert(legacy.includes('content="noindex"'));
  assert(legacy.includes(`href="${route}"`), 'Fallback link');

  const html = read(route);
  assert(html.includes(`rel="canonical" href="${origin}${route}"`));
  assert(html.includes(`property="og:url" content="${origin}${route}"`));
  for (const [language, alternate] of [['en', ''], ['fr', '/fr'], ['x-default', '']]) {
    assert(html.includes(`hreflang="${language}" href="${origin}${alternate}/work/openclassrooms/"`));
  }
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(JSON.stringify(graph).includes(`${origin}${route}#webpage`));
  assert.equal([...html.matchAll(/<h2 class="experience-title">/g)].length, 2, 'Two experience-level h2 headings');
  assert.equal([...html.matchAll(/<section class="case-section" aria-labelledby="[^"]+"><h3 id=/g)].length, 10, 'Each case-study section starts with an h3');
  assert(!html.includes('openclassrooms-frontend-engineering'));
  assert(read(`${prefix}/`).includes(`href="${route}"`));
  assert(sitemap.includes(`<loc>${origin}${route}</loc>`));
}
console.log('OpenClassrooms FR/EN routes, redirects, internal links and SEO: OK');
