import type { ImageMetadata } from "astro";
import marioKartWorldGuessrFrImage from "../assets/projects/mariokartworldguessr-fr.png";
import marioKartWorldGuessrEnImage from "../assets/projects/mariokartworldguessr-en.png";
import marioUniversalisImage from "../assets/projects/mariouniversalis.png";
import openclassroomsEnImage from "../assets/projects/openclassrooms-en.png";
import openclassroomsFrImage from "../assets/projects/openclassrooms-fr.png";

export type ProjectImage = ImageMetadata;

export const guessr = {
  id: "guessr",
  name: "Mario Kart World Guessr",
  slug: "mario-kart-world-guessr",
  url: "https://www.mariouniversalis.fr/mario-kart-world-guessr/",
  launched: "2025-06-21",
  measuredAt: "2026-09",
  metrics: {
    games: 65360,
    accounts: 1510,
    publishedPhotos: 1700,
    publishedContributors: 140,
    submittedPhotos: 1480,
    submittedContributors: 150,
  },
  dailyPhotos: 5,
  stack: ["React", "Vite", "React Leaflet", "PHP", "MariaDB", "ImageKit"],
};

export const professionalStack = [
  "TypeScript",
  "React",
  "OpenAPI",
  "Playwright",
  "React Testing Library",
  "Developer Experience",
];
export const universalis = {
  name: "Mario Universalis",
  slug: "mario-universalis",
  url: "https://www.mariouniversalis.fr/",
  games: 255,
  wonderClicks: 104000,
  relatedProjects: 10,
  twitterFollowers: 800,
  publishedAnecdotes: 270,
  created: "2007",
};

export interface Project {
  id: string;
  slug?: string;
  name: string;
  year?: string;
  context?: string;
  url?: string;
  extraUrl?: string;
  stack?: string[];
  ranks?: { category: string; place: number; total?: number }[];
  sizeKB?: number;
  released?: string;
}

export const unbalanced = {
  id: "unbalanced",
  name: "This Game Is Unbalanced!",
  slug: "this-game-is-unbalanced",
  year: "2025",
  context: "Gamedev.js",
  url: "https://adrien-gueret.itch.io/this-game-is-unbalanced",
  stack: ["Phaser", "JavaScript", "GitHub Copilot"],
  ranks: [
    { category: "Innovation", place: 1 },
    { category: "Vibe Coding", place: 1 },
  ],
} satisfies Project;

export const openclassrooms = {
  name: "OpenClassrooms",
  slug: "openclassrooms-frontend-engineering",
};

export const storyImages: {
  engineering: Record<"en" | "fr", ProjectImage>;
  universalis: ProjectImage;
  guessr: Record<"en" | "fr", ProjectImage>;
  wonder?: ProjectImage;
  unbalanced?: ProjectImage;
} = {
  engineering: {
    en: openclassroomsEnImage,
    fr: openclassroomsFrImage,
  },
  universalis: marioUniversalisImage,
  guessr: {
    en: marioKartWorldGuessrEnImage,
    fr: marioKartWorldGuessrFrImage,
  },
  wonder: undefined,
  unbalanced: undefined,
};

export const playground: Project[] = [
  {
    id: "hi",
    name: "Powered By HI",
    year: "2024",
    context: "Gamedev.js",
    url: "https://adrien-gueret.itch.io/powered-by-hi",
    ranks: [
      { category: "NPC", place: 1 },
      { category: "Innovation", place: 19 },
      { category: "Overall", place: 80 },
    ],
  },
  {
    id: "devil",
    name: "The Devil's Machine",
    year: "2026",
    context: "Gamedev.js",
    url: "https://adrien-gueret.itch.io/the-devils-machine",
    ranks: [
      { category: "Overall", place: 49, total: 484 },
      { category: "Innovation", place: 32, total: 484 },
    ],
  },
  {
    id: "huenicorns",
    name: "7 Huenicorns",
    year: "2026",
    context: "js13kGames",
    url: "https://wavedash.com/games/7-huenicorns",
    sizeKB: 12.7,
  },
  {
    id: "prism",
    name: "Prism Paddock",
    year: "2026",
    context: "js13kGames",
    url: "https://wavedash.com/games/prism-paddock",
    sizeKB: 12.9,
  },
  {
    id: "motigma",
    name: "Motigma",
    year: "2024",
    context: "Android / Web",
    url: "https://play.google.com/store/apps/details?id=com.agueret.motigma",
    extraUrl: "https://adrien-gueret.github.io/motigma/",
    released: "2024-12-14",
    stack: ["React", "Cordova"],
  },
  { id: "bingo", name: "Bingo Direct", stack: ["IndexedDB"] },
  { id: "yoshi", name: "Yoshi's Island Boss Builder" },
  {
    id: "birthday",
    name: "Bot anniversaires Mario",
    year: "2024",
    stack: ["Canvas", "Node.js", "GraphQL"],
  },
];

// Undefined values render honest structural placeholders, never broken <img> tags.
export const guessrImages: Record<
  "gameplay" | "result" | "contribution" | "album" | "daily",
  ProjectImage | undefined
> = {
  gameplay: undefined,
  result: undefined,
  contribution: undefined,
  album: undefined,
  daily: undefined,
};
