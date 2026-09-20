import type { Copy } from "./types";
import { engineering } from "../data/career";
import { profile } from "../data/profile";
import { guessr } from "../data/projects";
import { month, number } from "./routes";

export const fr: Copy = {
  meta: {
    title: "Adrien Guéret | Engineering Manager",
    description:
      "J'accompagne des ingénieurs et je construis des produits. Mon parcours, mes projets frontend et quelques projets personnels qui ont un peu dépassé le plan initial.",
    caseTitle:
      "Mario Kart World Guessr : du projet personnel au jeu communautaire | Adrien Guéret",
    caseDescription: `Comment j'ai conçu, développé et fait évoluer Mario Kart World Guessr : carte interactive, photos communautaires et défi quotidien, avec plus de ${number(Math.floor(guessr.metrics.games / 1000) * 1000, "fr")} parties jouées.`,
  },
  nav: {
    work: "Réalisations",
    career: "Parcours",
    approach: "Ma façon de travailler",
    playground: "Playground",
    skip: "Aller au contenu",
    label: "Navigation principale",
    language: "Langue",
  },
  hero: {
    eyebrow: "Engineering Manager",
    introduction: `Ancien Staff Frontend Engineer, avec plus de ${profile.experienceYears} ans d'expérience dans le développement web.`,
    today:
      "J'accompagne des ingénieurs dans leur progression, je m'assure que mon équipe puisse avancer dans de bonnes conditions et je reste impliqué dans les sujets techniques.",
    outside:
      "À côté du travail, je m'amuse à développer plusieurs projets plus ou moins importants, sous la forme d'outils ou de jeux, généralement avec des technologies du Web, et de plus en plus en utilisant l'IA.",
    work: "Voir mes projets",
    career: "Mon parcours",
    resume: "Voir mon CV",
    resumePending: "CV bientôt disponible",
  },
  work: {
    title: "Les projets qui ont marqué mon parcours",
    intro:
      "Pro ou perso, ce sont les projets qui ont le plus d'importance pour moi.",
    study: "En savoir plus",
    visit: "Découvrir le projet",
    personal: "Projet personnel",
    professional: "Chez OpenClassrooms",
    projects: {
      guessr: {
        title: "Mario Kart World Guessr",
        description:
          "Un jeu inspiré de GeoGuessr, dans le monde ouvert de Mario Kart World.",
      },
      engineering: {
        title: "Faire évoluer l'ingénierie frontend chez OpenClassrooms",
        description:
          "De Frontend Engineer à Engineering Manager, j'ai passé la majeure partie de mon temps à OpenClassrooms à faire évoluer nos pratiques frontend.",
      },
      unbalanced: {
        title: "This Game Is Unbalanced!",
        description:
          "Mon premier jeu entièrement pensé et codé avec Copilot, dans le cadre d'une game jam. Le défi ? Développer un jeu complet avec une technologie que je ne connaissais pas : Phaser.",
      },
      universalis: {
        title: "Mario Universalis, un véritable laboratoire personnel",
        description:
          "Le projet sur lequel j'ai appris le web. Un fansite lancé au lycée, véritable terrain d'expérimentation pour apprendre de nouvelles technologies. Presque vingt ans plus tard, j'y construis encore des choses. Aujourd'hui, Mario Universalis est un écosystème contenant plusieurs sites, un blog, un compte Twitter et différents outils/jeux.",
      },
    },
  },
  career: {
    title: "Mon parcours",
    intro:
      "De mes études d'ingénierie au management d'une équipe, mon parcours s'est construit autour du produit, de la technique et de la transmission.",
    present: "Aujourd'hui",
    entries: {
      manager: {
        role: "Engineering Manager",
        description: `J'accompagne une squad de ${engineering.squad.total} ingénieurs (${engineering.squad.backend} backend et ${engineering.squad.frontend} frontend). Progression, 1:1, performance, carrière, delivery, risques et dépendances, technical discovery et recrutement : le tout en lien étroit avec Product et Design.`,
      },
      staff: {
        role: "Staff Frontend Engineer",
        description: `Prise en charge de divers sujets d'architecture frontend, de stratégie technique, de tests et d'outillage. J'ai participé à l'animation du chapitre frontend pour faire vivre des pratiques communes dans le quotidien des équipes.`,
      },
      frontend: {
        role: "Frontend Engineer → Senior Frontend Engineer",
        description: [
          "Création d'un SDK JavaScript pour communiquer avec une API OAuth2",
          "Mise en place d'une librairie de composants réutilisables, définissant les débuts d'un Design System",
          "Accompagnement d'étudiants dans leur formation via des sessions de mentorat hebdomadaires",
        ],
      },
      meetic: {
        role: "Junior Frontend Developer",
        description: "Construction de l'application Web Mobile avec AngularJS.",
      },
      krds: {
        role: "Software Engineer",
        description:
          "Création d'applications Facebook (JavaScript et PHP) pour des grands comptes (Air France, Danone, L'Oréal, Canal+...).",
      },
      school: {
        role: "Diplôme d'ingénieur",
        description:
          "Mes études d'ingénierie informatique à SUPINFO, où j'ai posé les bases de mon parcours de développeur.",
      },
    },
  },
  teaching: {
    title: "Partager le savoir",
    intro:
      "Transmettre mes connaissances pour faire grandir les autres est quelque chose qui m'a toujours habité. Même si l'IA facilite grandement notre travail, je suis convaincu que nous devons continuer à apprendre au quotidien ; l'éducation fait notre humanité !",
    mentoring: {
      eyebrow: "Mentorat hebdomadaire",
      title: "Mentorat OpenClassrooms",
      paragraphs: [
        "Depuis 2019, j'accompagne chaque année un nouvel étudiant tout au long de sa formation.",
        "Tous les étudiants que j'ai accompagnés jusqu'au terme de leur formation ont obtenu leur diplôme. Deux ont même choisi de suivre une seconde formation et ont demandé à m'avoir à nouveau comme mentor. Détail amusant : l'un de mes étudiants est devenu mon collègue chez OpenClassrooms !",
      ],
      students: "étudiants accompagnés",
      sessions: "sessions de mentorat",
    },
    course: {
      eyebrow: "Cours TypeScript",
      paragraphs: [
        "En poussant l'adoption de TypeScript chez OpenClassrooms, je me suis rendu compte qu'il nous manquait un cours réellement accessible aux débutants. J'ai proposé de l'écrire.",
        "J'en ai conçu le contenu, les exemples, les exercices, les quiz et la progression pédagogique. Publié en 2023 et toujours maintenu aujourd'hui, le cours a été suivi par plus de 10 500 personnes et a permis la délivrance de plus de 2 200 certificats.",
      ],
      learners: "apprenants",
      certifications: "certificats",
      cta: "Voir le cours",
    },
    blog: {
      eyebrow: "Blog tech OpenClassrooms",
      title: "Écrire pour partager l'expérience",
      paragraphs: [
        "Depuis 2018, j'écris sur le blog tech d'OpenClassrooms pour partager ce que nous apprenons sur le terrain.",
        "Les sujets que je traite sont variés : syndrôme de l'imposteur, intérêts de la couverture de tests, réflexions sur l'intelligence artificielle : chaque article part d'une expérience concrète et des enseignements que moi et mes équipes ont tirés.",
      ],
      articles: "articles",
      views: "vues",
      reads: "lectures",
      cta: "Voir mes articles",
    },
  },
  approach: {
    title: "Ma façon de travailler",
    items: [
      {
        title: "Travailler pour mon équipe.",
        body: "J'aime dire à mes managés que, même si je suis leur N+1, c'est surtout moi qui travaille pour eux. Si je fais mal mon travail, ils ne peuvent pas faire correctement le leur. Mon rôle est de créer les conditions pour qu'ils puissent avancer, progresser et prendre des responsabilités.",
      },
      {
        title: "Faciliter les bonnes pratiques.",
        body: "Tests, tooling, documentation, standards… Je préfère améliorer l'environnement de travail plutôt que demander en permanence aux développeurs de « faire attention ». Ceci est d'autant plus vrai à l'ère de l'IA : les harnais de sécurité n'ont jamais été aussi importants.",
      },
      {
        title: "Savoir changer d'avis.",
        body: "Une solution peut être bonne à un instant T et devenir obsolète des années après. Je préfère résoudre le problème actuel plutôt que de défendre une ancienne décision, même si (surtout si !) cette décision venait de moi.",
      },
      {
        title: "Questionner les problèmes.",
        body: "Plutôt que de foncer tête baissée dans une solution coûteuse, il est important de cerner les besoins et de vérifier si le problème en est vraiment un. Pas de problème, pas de solution à développer !",
      },
    ],
  },
  playground: {
    title: "D'autres projets de ma conception",
    intro:
      "Des game jams, des expériences et autres projets qui s'invitent après le travail.",
    descriptions: {
      hi: "Un jeu développé pour la Gamedev.js Jam 2024.",
      devil:
        "Un roguelite dans lequel une machine à sous améliorable détermine les actions.",
      huenicorns:
        "Un petit jeu web, également adapté en prototype physique avec des cartes imprimées.",
      prism:
        "Une autre expérience pour faire tenir un jeu web complet dans très peu de place.",
      motigma:
        "Un jeu pour Android et le web, publié en version payante sur Google Play.",
      bingo:
        "Des grilles de bingo conservées dans IndexedDB, partageables sous forme d'images. Le projet évolue avec les retours utilisateurs.",
      yoshi: "Un projet personnel autour des boss de Yoshi's Island.",
      birthday:
        "Un bot d'anniversaires Mario : des layers Canvas fusionnés en PNG, l'API GraphQL de Mario Universalis et une publication quotidienne sur X et Bluesky à 7 h.",
    },
    facts: {
      hi: [],
      devil: [],
      huenicorns: ["Aussi sur papier"],
      prism: [],
      motigma: [],
      bingo: ["Grilles partageables"],
      yoshi: [],
      birthday: ["Depuis août 2024"],
    },
  },
  labels: {
    home: "Accueil",
    back: "Retour aux réalisations",
    stack: "Technologies",
    role: "Mon rôle",
    solo: "Conception, développement et maintenance en solo",
    launch: "Lancement",
    play: "Jouer au jeu",
    figuresDate: `Chiffres relevés en ${month(guessr.measuredAt, "fr")}.`,
    anonymous:
      "Il est possible de jouer sans compte. Le nombre de comptes n'est donc pas le nombre de joueurs.",
    screenshot: "Capture",
    figurePending: "Capture à ajouter",
    accounts: "comptes créés",
    games: "parties jouées",
    photos: "photos",
    contributors: "contributeurs publiés",
    codebase: "de la codebase React migrée vers TypeScript",
    savings: "économisés par an en remplaçant Phrase",
    chapter: "ingénieurs à accompagner dans le chapter frontend",
    perYear: "/ an",
    engineers: "ingénieurs",
  },
};
