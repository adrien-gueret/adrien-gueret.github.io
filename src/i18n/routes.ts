import type { Locale } from './types';

export function homePath(locale: Locale): string {
  return locale === 'fr' ? '/fr/' : '/';
}

// The same slug is used in both languages. No runtime router is needed.
export function workPath(locale: Locale, slug: string): string {
  return `${homePath(locale)}work/${slug}/`;
}

export function alternatePath(locale: Locale, slug?: string): string {
  return slug ? workPath(locale, slug) : homePath(locale);
}

export function number(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB').format(value);
}

export function date(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(value));
}

export function month(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}-01`));
}
