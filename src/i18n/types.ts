export type Locale = "en" | "fr";

export interface Copy {
  meta: {
    title: string;
    description: string;
    caseTitle: string;
    caseDescription: string;
  };
  nav: {
    work: string;
    career: string;
    approach: string;
    playground: string;
    skip: string;
    label: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    introduction: string;
    today: string;
    outside: string;
    work: string;
    career: string;
    resume: string;
    resumePending: string;
  };
  work: {
    title: string;
    intro: string;
    study: string;
    visit: string;
    personal: string;
    professional: string;
    projects: Record<string, { title: string; description: string }>;
  };
  career: {
    title: string;
    intro: string;
    present: string;
    entries: Record<string, { role: string; description: string | string[] }>;
  };
  teaching: {
    title: string;
    intro: string;
    mentoring: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      students: string;
      sessions: string;
    };
    course: {
      eyebrow: string;
      paragraphs: string[];
      learners: string;
      certifications: string;
      cta: string;
    };
    blog: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      articles: string;
      views: string;
      reads: string;
      cta: string;
    };
  };
  approach: { title: string; items: { title: string; body: string }[] };
  playground: {
    title: string;
    intro: string;
    descriptions: Record<string, string>;
    facts: Record<string, string[]>;
  };
  labels: {
    home: string;
    back: string;
    stack: string;
    role: string;
    solo: string;
    launch: string;
    play: string;
    figuresDate: string;
    anonymous: string;
    screenshot: string;
    figurePending: string;
    accounts: string;
    games: string;
    photos: string;
    contributors: string;
    codebase: string;
    savings: string;
    chapter: string;
    perYear: string;
    engineers: string;
  };
}
