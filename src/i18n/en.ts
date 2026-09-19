import type { Copy } from "./types";
import { engineering } from "../data/career";
import { profile } from "../data/profile";
import { guessr } from "../data/projects";
import { month, number } from "./routes";

export const en: Copy = {
  meta: {
    title:
      "Adrien Guéret | Engineering Manager & former Staff Frontend Engineer",
    description:
      "I help engineers grow and build things that people use. My work in engineering management, frontend architecture, and personal projects that got a little out of hand.",
    caseTitle:
      "Mario Kart World Guessr: from side project to community game | Adrien Guéret",
    caseDescription: `How I designed, built and maintain Mario Kart World Guessr: a custom map, community photos and a daily challenge, with over ${number(Math.floor(guessr.metrics.games / 1000) * 1000, "en")} games played.`,
  },
  nav: {
    work: "Projects",
    career: "Experience",
    approach: "How I work",
    playground: "Playground",
    skip: "Skip to content",
    label: "Main navigation",
    language: "Language",
  },
  hero: {
    eyebrow: "Engineering Manager",
    introduction: `Former Staff Frontend Engineer with ${profile.experienceYears}+ years of experience building software.`,
    today:
      "I help engineers grow, make sure my team has what it needs to move forward, and stay involved in technical decisions.",
    outside:
      "Outside of work, I enjoy building several projects of varying scope, whether tools or games, usually with web technologies, and increasingly using AI.",
    work: "See my work",
    career: "My career",
    resume: "View my résumé",
    resumePending: "Resume coming soon",
  },
  work: {
    title: "Projects that shaped my journey",
    intro:
      "Whether professional or personal, these are the projects that matter most to me.",
    study: "Learn more",
    visit: "Explore the project",
    personal: "Personal project",
    professional: "At OpenClassrooms",
    projects: {
      guessr: {
        title: "Mario Kart World Guessr",
        description:
          "A game inspired by GeoGuessr, set in the open world of Mario Kart World.",
      },
      engineering: {
        title: "Evolving frontend engineering at OpenClassrooms",
        description:
          "From Frontend Engineer to Engineering Manager, I have spent most of my time at OpenClassrooms improving our frontend practices.",
      },
      unbalanced: {
        title: "This Game Is Unbalanced!",
        description:
          "My first game entirely designed and coded with Copilot, for a game jam. The challenge? Building a complete game with a technology I had never used before: Phaser.",
      },
      universalis: {
        title: "Mario Universalis, a personal testing ground",
        description:
          "The project where I learned the web. A fansite I started in high school became a testing ground for learning new technologies. Almost twenty years later, I am still building things there. Today, Mario Universalis is an ecosystem spanning several websites, a blog, a Twitter account, and various tools and games.",
      },
    },
  },
  career: {
    title: "My journey",
    intro:
      "From engineering school to managing a team, my journey has been shaped by product, technology, and knowledge sharing.",
    present: "Present",
    entries: {
      manager: {
        role: "Engineering Manager",
        description: `I manage a squad of ${engineering.squad.total} engineers (${engineering.squad.backend} backend and ${engineering.squad.frontend} frontend). My work covers growth, one-to-ones, performance and careers, delivery, risks and dependencies, technical discovery, and hiring, in close collaboration with Product and Design.`,
      },
      staff: {
        role: "Staff Frontend Engineer",
        description: `Taking on various frontend architecture, technical strategy, testing and tooling topics. I took part in running the frontend chapter helping shared practices live in teams' everyday work.`,
      },
      frontend: {
        role: "Frontend Engineer → Senior Frontend Engineer",
        description: [
          "Building a JavaScript SDK to communicate with an OAuth2 API",
          "Setting up a reusable component library, laying the foundations of a design system",
          "Supporting students in their training through weekly mentoring sessions",
        ],
      },
      meetic: {
        role: "Junior Frontend Developer",
        description: "Building the mobile web application with AngularJS.",
      },
      krds: {
        role: "Software Engineer",
        description:
          "Building Facebook applications (JavaScript and PHP) for major brands (Air France, Danone, L'Oréal, Canal+...).",
      },
      school: {
        role: "Engineering degree",
        description:
          "My computer engineering studies at SUPINFO, where I built the foundations of my developer career.",
      },
    },
  },
  teaching: {
    title: "Teaching & mentoring",
    intro:
      "Sharing my knowledge to help others grow is something that has always been part of me. Even though AI makes our work much easier, I am convinced that we must keep learning every day; education makes us human!",
    mentoring: {
      eyebrow: "Weekly mentoring",
      title: "OpenClassrooms mentoring",
      paragraphs: [
        "Since 2019, I have supported a new student each year throughout their training.",
        "Every student I have supported through to the end of their program has graduated. Two even chose to take a second program and asked to have me as their mentor again. Fun fact: one of my students became my colleague at OpenClassrooms!",
      ],
      students: "students mentored",
      sessions: "mentoring sessions",
    },
    course: {
      eyebrow: "TypeScript course",
      paragraphs: [
        "While driving TypeScript adoption at OpenClassrooms, I realized we were missing a beginner-friendly course that could also help engineers get up to speed. I proposed writing one.",
        "I designed the content, examples, exercises, quizzes, and learning path. Published in 2023 and still maintained today, the course has reached more than 10,500 learners and led to more than 2,200 certificates.",
      ],
      learners: "learners",
      certifications: "certificates",
      cta: "View the course",
    },
    blog: {
      eyebrow: "OpenClassrooms tech blog",
      title: "Writing to share experience",
      paragraphs: [
        "Since 2018, I have written for the OpenClassrooms tech blog to share what we learn from our work.",
        "The topics I cover are varied: impostor syndrome, the value of test coverage, and reflections on artificial intelligence. Each article starts with a concrete experience and the lessons my teams and I learned from it.",
      ],
      articles: "articles",
      views: "views",
      reads: "reads",
      cta: "View my articles",
    },
  },
  approach: {
    title: "How I work",
    items: [
      {
        title: "My job is to help you do yours.",
        body: "I like to tell the engineers I manage that, even if I am their manager, I mostly work for them. If I do my job badly, they cannot do theirs properly. My role is to create the conditions for them to move forward, grow, and take responsibility.",
      },
      {
        title: "Make good practices easy.",
        body: "Tests, tooling, documentation, standards… I would rather improve the working environment than keep asking developers to “be careful”. This is even more true in the age of AI: safety harnesses have never mattered more.",
      },
      {
        title: "Be willing to change your mind.",
        body: "A solution can be right at a given point in time and become obsolete years later. I would rather solve today's problem than defend an old decision, even if (especially if!) that decision was mine.",
      },
      {
        title: "Question the problem.",
        body: "Rather than rushing headlong into an expensive solution, it is important to understand the need and check whether the problem is really a problem. No problem, no solution to build!",
      },
    ],
  },
  playground: {
    title: "Other projects I've built",
    intro:
      "Game jams, experiments, and other projects that follow me home after work.",
    descriptions: {
      hi: "A game built for the Gamedev.js Jam 2024.",
      devil:
        "A roguelite where an upgradeable slot machine determines your actions.",
      huenicorns:
        "A tiny web game that also became a physical prototype with printed cards.",
      prism:
        "Another experiment in making a complete web game fit in very little space.",
      motigma:
        "A game for Android and the web, published as a paid app on Google Play.",
      bingo:
        "Bingo grids saved locally with IndexedDB, shareable as images. Improved through user feedback.",
      yoshi: "A personal project around Yoshi's Island bosses.",
      birthday:
        "A daily Mario birthday bot. Canvas layers become a PNG, using the Mario Universalis GraphQL API. Published to X and Bluesky at 7 am.",
    },
    facts: {
      hi: [],
      devil: [],
      huenicorns: ["Also on paper"],
      prism: [],
      motigma: [],
      bingo: ["Shareable grids"],
      yoshi: [],
      birthday: ["Since August 2024"],
    },
  },
  labels: {
    home: "Home",
    back: "Back to selected work",
    stack: "Built with",
    role: "My role",
    solo: "Solo design, development & maintenance",
    launch: "Launched",
    play: "Play the game",
    figuresDate: `Figures recorded in ${month(guessr.measuredAt, "en")}.`,
    anonymous:
      "You can play without an account. Accounts and players are not the same thing.",
    screenshot: "Screenshot",
    figurePending: "Screenshot to be added",
    accounts: "accounts created",
    games: "games played",
    photos: "photos",
    contributors: "published contributors",
    codebase: "React codebase migrated to TypeScript",
    savings: "saved each year replacing Phrase",
    chapter: "engineers supported in the frontend chapter",
    perYear: "/ year",
    engineers: "engineers",
  },
};
