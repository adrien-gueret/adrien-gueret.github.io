/**
 * Astro integration that registers the dev-only "Feedback" Dev Toolbar app.
 *
 * IMPORTANT: everything here is gated on `command === 'dev'`. During
 * `astro build` / `astro preview` nothing is registered, so no client code,
 * DOM, or feedback data ever reaches the production output.
 */

import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { FeedbackData } from "./types.js";
import { readFeedbackJson, writeFeedbackFiles } from "./export.js";

const APP_ID = "portfolio-feedback";

// Simple speech-bubble / annotation icon (inline SVG string is accepted by the API).
const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
  '<path d="M8 9h8M8 13h5"/></svg>';

export default function feedbackToolbar(): AstroIntegration {
  let root = process.cwd();

  return {
    name: "feedback-toolbar",
    hooks: {
      "astro:config:setup": ({ command, config, addDevToolbarApp }) => {
        // Dev only — never touch production builds.
        if (command !== "dev") return;

        root = fileURLToPath(config.root);

        addDevToolbarApp({
          id: APP_ID,
          name: "Feedback",
          icon: ICON,
          entrypoint: fileURLToPath(new URL("./app.ts", import.meta.url)),
        });
      },

      "astro:server:setup": ({ toolbar, logger }) => {
        // The browser app asks for any previously saved feedback on init.
        toolbar.on("feedback:pull", async () => {
          const data = await readFeedbackJson(root);
          toolbar.send("feedback:data", data);
        });

        // The browser app requests an export (writes Markdown + JSON to disk).
        toolbar.on<FeedbackData>("feedback:save", async (data) => {
          try {
            const files = await writeFeedbackFiles(root, data);
            toolbar.send("feedback:saved", { ok: true, ...files });
            logger.info(`Feedback exported → ${files.markdown}`);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            toolbar.send("feedback:saved", { ok: false, error: message });
            logger.error(`Failed to export feedback: ${message}`);
          }
        });
      },
    },
  };
}
