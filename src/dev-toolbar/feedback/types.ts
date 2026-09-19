/**
 * Shared types for the dev-only "Feedback" Dev Toolbar app.
 * These types are used both by the browser app and the Node/server integration.
 */

export type FeedbackType =
  "Content" | "Design" | "Bug" | "Responsive" | "Other";

export const FEEDBACK_TYPES: FeedbackType[] = [
  "Content",
  "Design",
  "Bug",
  "Responsive",
  "Other",
];

/** Bounding box captured from `getBoundingClientRect()`. */
export interface FeedbackRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FeedbackViewport {
  width: number;
  height: number;
}

/** Context extracted from the selected DOM element. */
export interface ElementContext {
  page: string;
  url: string;
  lang: string;
  tag: string;
  id: string | null;
  classes: string[];
  selector: string;
  section: string | null;
  sectionTitle: string | null;
  text: string;
  rect: FeedbackRect;
  viewport: FeedbackViewport;
}

/** A single stored feedback entry. */
export interface Feedback extends ElementContext {
  /** Stable unique id (also used as localStorage key part). */
  id: string;
  type: FeedbackType;
  comment: string;
  timestamp: string;
}

/** Payload exchanged between the browser app and the dev server. */
export interface FeedbackData {
  version: 1;
  generatedAt: string;
  feedbacks: Feedback[];
}
