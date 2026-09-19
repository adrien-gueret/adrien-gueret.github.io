import type { Locale } from '../i18n/types';

export const profile = {
  name: 'Adrien Guéret',
  role: 'Engineering Manager',
  site: 'https://adrien-gueret.github.io',
  email: 'adrien.grt@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adrien-grt',
  github: 'https://github.com/adrien-gueret',
  experienceYears: 10,
  resume: {
    en: '/documents/adrien-gueret-resume-en.pdf',
    fr: '/documents/adrien-gueret-cv-fr.pdf',
  } satisfies Record<Locale, string>,
  social: {
    home: { en: null, fr: null },
    guessr: { en: null, fr: null },
  } as Record<'home' | 'guessr', Record<Locale, string | null>>,
};
