import openclassroomsLogo from "../assets/companies/openclassrooms.png";
import meeticLogo from "../assets/companies/meetic.png";
import krdsLogo from "../assets/companies/krds.png";
import supinfoLogo from "../assets/companies/supinfo.png";

export const career = [
  {
    id: "manager",
    employer: "OpenClassrooms",
    logo: openclassroomsLogo,
    start: "2025-11",
    end: null,
  },
  {
    id: "staff",
    employer: "OpenClassrooms",
    logo: openclassroomsLogo,
    start: "2021",
    end: "2025",
  },
  {
    id: "frontend",
    employer: "OpenClassrooms",
    logo: openclassroomsLogo,
    start: "2016",
    end: "2021",
  },
  {
    id: "meetic",
    employer: "Meetic",
    logo: meeticLogo,
    start: "2015",
    end: "2016",
  },
  {
    id: "krds",
    employer: "KRDS",
    logo: krdsLogo,
    start: "2014",
    end: "2014",
  },
  {
    id: "school",
    employer: "SUPINFO",
    logo: supinfoLogo,
    start: "2008",
    end: "2013",
  },
] as const;

export const engineering = {
  squad: { total: 4, backend: 2, frontend: 2 },
  typescriptPercent: 70,
  annualSavings: 20000,
  chapterSize: 12,
};
