import { profile } from '../data/profile';
import { guessr, openclassrooms, unbalanced, universalis } from '../data/projects';
import { typescriptCourse } from '../data/teaching';
import { alternatePath } from '../i18n/routes';
import type { Locale } from '../i18n/types';

type Reference = { '@id': string };
interface Person {
  '@type': 'Person'; '@id': string; name: string; url: string;
  jobTitle: string; email: string; sameAs: string[]; knowsAbout: string[];
}
interface Website {
  '@type': 'WebSite'; '@id': string; name: string; url: string;
  inLanguage: string[]; publisher: Reference;
}
interface Page {
  '@type': 'ProfilePage' | 'WebPage'; '@id': string; url: string;
  name: string; description: string; inLanguage: Locale;
  isPartOf: Reference; mainEntity?: Reference; author: Reference;
  breadcrumb?: Reference;
}
interface VideoGame {
  '@type': 'VideoGame'; '@id': string; name: string; url: string;
  description: string; datePublished?: string; creator: Reference;
  gamePlatform: string; image?: string; isPartOf?: Reference;
}
interface BreadcrumbList {
  '@type': 'BreadcrumbList'; '@id': string;
  itemListElement: { '@type': 'ListItem'; position: number; name: string; item: string }[];
}
interface Course {
  '@type': 'Course'; '@id': string; name: string; url: string;
  description: string; creator: Reference;
  provider: { '@type': 'Organization'; name: string; url: string };
  datePublished: string; dateModified: string; inLanguage: 'fr';
}
export interface Graph {
  '@context': 'https://schema.org';
  '@graph': (Person | Website | Page | VideoGame | BreadcrumbList | Course)[];
}

const personId = `${profile.site}/#person`;
const websiteId = `${profile.site}/#website`;
const gameId = `${guessr.url}#videogame`;
const courseId = `${typescriptCourse.url}#course`;
const person: Person = {
  '@type': 'Person', '@id': personId, name: profile.name, url: `${profile.site}/`,
  jobTitle: profile.role, email: profile.email,
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: ['Engineering management', 'Frontend architecture', 'TypeScript', 'React', 'Developer Experience'],
};
const website: Website = {
  '@type': 'WebSite', '@id': websiteId, name: profile.name, url: `${profile.site}/`,
  inLanguage: ['en', 'fr'], publisher: { '@id': personId },
};

const course: Course = {
  '@type': 'Course', '@id': courseId, name: typescriptCourse.name, url: typescriptCourse.url,
  description: 'Un cours pour découvrir les bases de TypeScript, les mettre en pratique et utiliser TypeScript avec React.',
  creator: { '@id': personId },
  provider: { '@type': 'Organization', name: typescriptCourse.provider, url: 'https://openclassrooms.com/' },
  datePublished: typescriptCourse.publishedAt,
  dateModified: typescriptCourse.updatedAt,
  inLanguage: 'fr',
};

export function structuredData(locale: Locale, title: string, description: string, slug?: string): Graph {
  const url = new URL(alternatePath(locale, slug), profile.site).href;
  const page: Page = {
    '@type': slug ? 'WebPage' : 'ProfilePage', '@id': `${url}#webpage`, url,
    name: title, description, inLanguage: locale,
    isPartOf: { '@id': websiteId }, author: { '@id': personId },
  };
  if (!slug) {
    page.mainEntity = { '@id': personId };
    return { '@context': 'https://schema.org', '@graph': [person, website, page, course] };
  }
  page.breadcrumb = { '@id': `${url}#breadcrumb` };
  const project = [openclassrooms, universalis, guessr, unbalanced].find((entry) => entry.slug === slug);
  const breadcrumbs: BreadcrumbList = {
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'fr' ? 'Accueil' : 'Home', item: new URL(alternatePath(locale), profile.site).href },
      ...(slug === guessr.slug ? [{ '@type': 'ListItem' as const, position: 2, name: universalis.name, item: new URL(alternatePath(locale, universalis.slug), profile.site).href }] : []),
      { '@type': 'ListItem', position: slug === guessr.slug ? 3 : 2, name: project?.name ?? title, item: url },
    ],
  };
  const graph: Graph = { '@context': 'https://schema.org', '@graph': [person, website, page, breadcrumbs] };
  if (slug === universalis.slug || slug === guessr.slug) {
    const marioWebsite: Website = {
      '@type': 'WebSite', '@id': `${universalis.url}#website`, url: universalis.url,
      name: universalis.name, inLanguage: ['fr'], publisher: { '@id': personId },
    };
    graph['@graph'].push(marioWebsite);
    if (slug === universalis.slug) page.mainEntity = { '@id': marioWebsite['@id'] };
  }
  if (slug === guessr.slug || slug === unbalanced.slug) {
    const gameProject = slug === guessr.slug ? guessr : unbalanced;
    const id = slug === guessr.slug ? gameId : `${unbalanced.url}#videogame`;
    const image = slug === guessr.slug ? profile.social.guessr[locale] : null;
    page.mainEntity = { '@id': id };
    const game: VideoGame = {
      '@type': 'VideoGame', '@id': id, name: gameProject.name, url: gameProject.url,
      description, creator: { '@id': personId }, gamePlatform: 'Web browser',
      ...(slug === guessr.slug ? { datePublished: guessr.launched, isPartOf: { '@id': `${universalis.url}#website` } } : {}),
      ...(image ? { image: new URL(image, profile.site).href } : {}),
    };
    graph['@graph'].push(game);
  }
  return graph;
}
