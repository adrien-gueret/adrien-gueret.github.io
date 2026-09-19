import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
// Dev-only Feedback Dev Toolbar app. Registers nothing during `astro build`.
import feedbackToolbar from "./src/dev-toolbar/feedback/integration.ts";

export default defineConfig({
  site: "https://adrien-gueret.github.io",
  output: "static",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/"),
      i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } },
    }),
    feedbackToolbar(),
  ],
});
