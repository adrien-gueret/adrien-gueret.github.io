import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Run after the production build. No browser or extra dependency required.
const origin = 'https://adrien-gueret.github.io';
const slugs = ['openclassrooms-frontend-engineering', 'mario-universalis', 'mario-kart-world-guessr', 'this-game-is-unbalanced'];
const locales = ['en', 'fr'];
const route = (locale, slug) => `${locale === 'fr' ? '/fr/' : '/'}${slug ? `work/${slug}/` : ''}`;
const read = (pathname) => readFileSync(resolve('dist', `.${pathname}index.html`), 'utf8');
const attributes = (tag) => {
  const parsed = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
  for (const match of tag.matchAll(/\s([\w:-]+)(?=\s|\/?>)/g)) parsed[match[1]] ??= '';
  return parsed;
};
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((match) => attributes(match[0]));
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
const pages = new Map();

for (const locale of locales) {
  for (const slug of [undefined, ...slugs]) {
    const pathname = route(locale, slug);
    const html = read(pathname);
    pages.set(pathname, html);
    assert.equal(tags(html, 'html')[0].lang, locale, `${pathname}: language`);
    assert.equal(tags(html, 'h1').length, 1, `${pathname}: one h1`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${pathname}: unique IDs`);
    for (const element of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
      for (const id of element[1].split(' ')) assert(ids.includes(id), `${pathname}: label ${id}`);
    }
    const links = tags(html, 'link');
    assert.equal(links.find((link) => link.rel === 'canonical')?.href, origin + pathname);
    for (const language of ['en', 'fr', 'x-default']) {
      assert.equal(links.find((link) => link.hreflang === language)?.href, origin + route(language === 'fr' ? 'fr' : 'en', slug));
    }
    const metas = tags(html, 'meta');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert(title && metas.find((meta) => meta.name === 'description')?.content, `${pathname}: title and description`);
    for (const property of ['og:title', 'og:description', 'og:type', 'og:url', 'og:locale']) {
      assert(metas.find((meta) => meta.property === property)?.content, `${pathname}: ${property}`);
    }
    assert.equal(metas.find((meta) => meta.property === 'og:url').content, origin + pathname);
    for (const name of ['twitter:title', 'twitter:description', 'twitter:card']) assert(metas.find((meta) => meta.name === name)?.content);
    const entry = sitemapEntries.find((item) => item.includes(`<loc>${origin + pathname}</loc>`));
    assert(entry, `${pathname}: sitemap entry`);
    for (const language of locales) assert(entry.includes(`hreflang="${language}" href="${origin + route(language, slug)}"`));
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? 'null');
    assert.equal(data?.['@context'], 'https://schema.org');
    const graph = data['@graph'];
    const graphIds = graph.map((node) => node['@id']);
    assert.equal(new Set(graphIds).size, graphIds.length, `${pathname}: unique graph IDs`);
    const page = graph.find((node) => node['@id'] === `${origin + pathname}#webpage`);
    assert.equal(page?.url, origin + pathname);
    assert.equal(page.inLanguage, locale);
    for (const node of graph) {
      for (const property of ['mainEntity', 'isPartOf', 'author', 'creator', 'publisher', 'breadcrumb']) {
        if (node[property]?.['@id']) assert(graphIds.includes(node[property]['@id']), `${pathname}: resolved ${property}`);
      }
    }
    if (slug) {
      assert.equal(page['@type'], 'WebPage');
      const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList').itemListElement;
      assert.equal(crumbs.at(-1).item, origin + pathname);
      assert.equal(crumbs.length, slug === 'mario-kart-world-guessr' ? 3 : 2);
      assert(!html.includes('—'), `${pathname}: no editorial em dash`);
      if (slug === 'openclassrooms-frontend-engineering') assert(!graph.some((node) => node['@type'] === 'VideoGame'));
      if (slug === 'mario-universalis') assert.equal(page.mainEntity['@id'], 'https://www.mariouniversalis.fr/#website');
    } else {
      const work = html.split('id="work"')[1]?.split('<section')[0];
      assert(work, `${pathname}: stories section`);
      const headings = [...work.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map((match) => match[1]);
      assert.equal(headings.length, 4);
      assert(headings[0].includes('OpenClassrooms'));
      assert(headings[1].startsWith('Mario Universalis'));
      assert.equal(headings[2], 'Mario Kart World Guessr');
      assert.equal(headings[3], 'This Game Is Unbalanced!');
      assert(!work.includes('—'), `${pathname}: no editorial em dash`);
      assert(!work.includes('class="tags"'), `${pathname}: no tag grid`);
      assert(work.includes(`href="${route(locale, 'openclassrooms-frontend-engineering')}"`));
      for (const item of slugs.filter((slug) => slug !== 'openclassrooms-frontend-engineering')) {
        assert(!work.includes(`href="${route(locale, item)}"`));
      }
    }
    for (const img of tags(html, 'img')) {
      assert(Object.hasOwn(img, 'alt'), `${pathname}: image alternative`);
      assert(img.src, `${pathname}: no empty image`);
    }
    assert(!/<[^>]+tabindex="[1-9]/.test(html), `${pathname}: natural keyboard order`);
  }
}

for (const [pathname, html] of pages) {
  for (const tag of [...tags(html, 'a'), ...tags(html, 'link'), ...tags(html, 'img'), ...tags(html, 'script')]) {
    const value = tag.href ?? tag.src;
    if (!value || /^(mailto:|data:|tel:)/.test(value)) continue;
    // The resume links are intentionally wired before the user-provided PDFs are added.
    if (value === '/documents/adrien-gueret-resume-en.pdf' || value === '/documents/adrien-gueret-cv-fr.pdf') continue;
    // Motigma is a separate GitHub Pages project on the same origin.
    if (value === `${origin}/motigma/`) continue;
    const url = new URL(value.replaceAll('&amp;', '&'), origin + pathname);
    if (url.origin !== origin) continue;
    const target = resolve('dist', `.${url.pathname}${url.pathname.endsWith('/') ? 'index.html' : ''}`);
    assert(existsSync(target), `${pathname}: missing local target ${url.pathname}`);
    if (url.hash) {
      const targetHtml = readFileSync(target, 'utf8');
      assert(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${pathname}: missing anchor ${value}`);
    }
  }
}
for (const locale of locales) {
  assert(pages.get(route(locale, 'mario-universalis')).includes(`href="${route(locale, 'mario-kart-world-guessr')}"`));
  assert(pages.get(route(locale, 'mario-kart-world-guessr')).includes(`href="${route(locale, 'mario-universalis')}"`));
}
console.log('PASS: 10 EN/FR pages, metadata, canonical/hreflang, sitemap, JSON-LD, stories, cross-links, anchors and local assets.');
console.log('Browser rendering and keyboard interaction require a separate browser check.');
