import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const integrations = [
  sitemap({
    filter: (page) => !page.endsWith("/404/") && !page.endsWith("/openclassrooms-frontend-engineering/"),
    i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } },
  }),
];

// Load the feedback toolbar only for the local development server.
if (process.argv.includes("dev")) {
  const { default: feedbackToolbar } = await import(
    "./src/dev-toolbar/feedback/integration.ts"
  );
  integrations.push(feedbackToolbar());
}

export default defineConfig({
  site: "https://adrien-gueret.github.io",
  output: "static",
  trailingSlash: "always",
  // Static HTML redirects keep old links working on GitHub Pages without JavaScript.
  redirects: {
    "/work/openclassrooms-frontend-engineering/": "/work/openclassrooms/",
    "/fr/work/openclassrooms-frontend-engineering/": "/fr/work/openclassrooms/",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  integrations,
});
