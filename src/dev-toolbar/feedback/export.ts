/**
 * Server-side (Node) helpers for the Feedback Dev Toolbar app.
 *
 * Only ever imported from the Astro integration during `astro dev`.
 * Responsible for reading/writing the local `feedback/` folder.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Feedback, FeedbackData } from "./types.js";

const FEEDBACK_DIR = "feedback";
const MARKDOWN_FILE = "portfolio-review.md";
const JSON_FILE = "portfolio-review.json";

export interface WriteResult {
  markdown: string;
  json: string;
}

function emptyData(): FeedbackData {
  return { version: 1, generatedAt: new Date().toISOString(), feedbacks: [] };
}

/** Format an ISO timestamp as `YYYY-MM-DD HH:mm` in local time. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function renderFeedback(feedback: Feedback, index: number): string {
  const lines: string[] = [];
  lines.push(`## Feedback ${index}`);
  lines.push("");
  lines.push(`- Page: ${feedback.page}`);
  if (feedback.section) lines.push(`- Section: ${feedback.section}`);
  lines.push(`- Selector: ${feedback.selector}`);
  lines.push(`- Tag: ${feedback.tag}`);
  if (feedback.sectionTitle)
    lines.push(`- Section title: ${feedback.sectionTitle}`);
  lines.push(`- Type: ${feedback.type}`);
  lines.push(
    `- Viewport: ${feedback.viewport.width} × ${feedback.viewport.height}`,
  );

  if (feedback.text) {
    lines.push("");
    lines.push("Text:");
    lines.push("");
    lines.push(`> ${feedback.text.replace(/\n/g, " ")}`);
  }

  lines.push("");
  lines.push("Feedback:");
  lines.push("");
  lines.push(feedback.comment.trim());
  lines.push("");
  return lines.join("\n");
}

/** Build the Codex-friendly Markdown document. */
export function renderMarkdown(data: FeedbackData): string {
  const parts: string[] = [];
  parts.push("# Portfolio feedback");
  parts.push("");
  parts.push(`Generated: ${formatDate(data.generatedAt)}`);
  parts.push("");

  if (data.feedbacks.length === 0) {
    parts.push("_No feedback recorded._");
    parts.push("");
  } else {
    data.feedbacks.forEach((feedback, i) => {
      parts.push(renderFeedback(feedback, i + 1));
    });
  }

  return `${parts.join("\n").trimEnd()}\n`;
}

/** Read the persisted JSON feedback (if any). Never throws. */
export async function readFeedbackJson(root: string): Promise<FeedbackData> {
  const file = path.join(root, FEEDBACK_DIR, JSON_FILE);
  try {
    const raw = await readFile(file, "utf-8");
    const parsed = JSON.parse(raw) as Partial<FeedbackData>;
    if (parsed && Array.isArray(parsed.feedbacks)) {
      return {
        version: 1,
        generatedAt: parsed.generatedAt ?? new Date().toISOString(),
        feedbacks: parsed.feedbacks as Feedback[],
      };
    }
  } catch {
    // Missing / invalid file → treat as empty.
  }
  return emptyData();
}

/** Write both the Markdown and JSON exports, creating the folder if needed. */
export async function writeFeedbackFiles(
  root: string,
  data: FeedbackData,
): Promise<WriteResult> {
  const dir = path.join(root, FEEDBACK_DIR);
  await mkdir(dir, { recursive: true });

  const normalized: FeedbackData = {
    version: 1,
    generatedAt: data.generatedAt ?? new Date().toISOString(),
    feedbacks: Array.isArray(data.feedbacks) ? data.feedbacks : [],
  };

  const markdownPath = path.join(dir, MARKDOWN_FILE);
  const jsonPath = path.join(dir, JSON_FILE);

  await writeFile(markdownPath, renderMarkdown(normalized), "utf-8");
  await writeFile(
    jsonPath,
    `${JSON.stringify(normalized, null, 2)}\n`,
    "utf-8",
  );

  return {
    markdown: path.relative(root, markdownPath).split(path.sep).join("/"),
    json: path.relative(root, jsonPath).split(path.sep).join("/"),
  };
}
