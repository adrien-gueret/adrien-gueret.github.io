/**
 * Browser-side helpers to build a stable CSS selector and to extract
 * contextual information from a selected DOM element.
 *
 * Runs only inside the Astro dev server (dev-toolbar app). No production impact.
 */

import type { ElementContext, FeedbackRect } from "./types.js";

/** Attribute flag used on every DOM node created by the Feedback tool. */
export const TOOL_ATTR = "data-feedback-tool";

/** Returns true when the element belongs to the Dev Toolbar or to our own overlays. */
export function isToolElement(el: Element | null): boolean {
  if (!el) return true;
  // The Astro Dev Toolbar retargets shadow events to its <astro-dev-toolbar> host.
  if (el.closest("astro-dev-toolbar")) return true;
  if (el.closest(`[${TOOL_ATTR}]`)) return true;
  const tag = el.tagName.toLowerCase();
  if (tag.startsWith("astro-dev-toolbar")) return true;
  return false;
}

/** CSS.escape fallback for identifiers. */
function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
}

/** Returns true when `selector` resolves to exactly `el` in the document. */
function matchesUniquely(selector: string, el: Element): boolean {
  try {
    const found = document.querySelectorAll(selector);
    return found.length === 1 && found[0] === el;
  } catch {
    return false;
  }
}

/** Meaningful, non-utility classes (drops tool + obviously dynamic classes). */
function usefulClasses(el: Element): string[] {
  return Array.from(el.classList).filter((cls) => {
    if (!cls) return false;
    if (cls.startsWith("astro-")) return false; // Astro scoped hashes
    if (/^[a-z0-9]{6,}$/.test(cls) && /\d/.test(cls)) return false; // hashed-ish
    return true;
  });
}

/** Finds the closest meaningful "section" ancestor and its selector fragment. */
function findSection(el: Element): {
  element: Element | null;
  selector: string | null;
} {
  const section = el.closest("section, [data-section], main, article");
  if (
    !section ||
    section === document.documentElement ||
    section === document.body
  ) {
    return { element: null, selector: null };
  }
  if (section.id) {
    return { element: section, selector: `#${cssEscape(section.id)}` };
  }
  const dataSection = section.getAttribute("data-section");
  if (dataSection) {
    return { element: section, selector: `[data-section="${dataSection}"]` };
  }

  const labelledBy = section.getAttribute("aria-labelledby");
  if (labelledBy) {
    const selector = `${section.tagName.toLowerCase()}[aria-labelledby="${cssEscape(labelledBy)}"]`;
    if (matchesUniquely(selector, section)) return { element: section, selector };
  }

  for (const cls of usefulClasses(section)) {
    const selector = `${section.tagName.toLowerCase()}.${cssEscape(cls)}`;
    if (matchesUniquely(selector, section)) return { element: section, selector };
  }

  return { element: section, selector: null };
}

/** Title of the section (first heading), if any. */
function sectionTitle(section: Element | null): string | null {
  if (!section) return null;
  const heading = section.querySelector("h1, h2, h3");
  const title = heading?.textContent?.trim();
  return title ? collapse(title) : null;
}

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizedText(text: string): string {
  return collapse(text);
}

/** Index among same-tag siblings, 1-based (for :nth-of-type). */
function nthOfType(el: Element): number {
  let index = 1;
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.tagName === el.tagName) index += 1;
    sibling = sibling.previousElementSibling;
  }
  return index;
}

/**
 * Build a selector that is as stable and readable as possible.
 * Priority: unique id → data-project/data-* → section + semantic class →
 * section + nth-of-type → short DOM path (last resort).
 */
export function generateSelector(el: Element): string {
  const tag = el.tagName.toLowerCase();

  // 1. Unique id.
  if (el.id) {
    const byId = `#${cssEscape(el.id)}`;
    if (matchesUniquely(byId, el)) return byId;
  }

  // 2. Stable data-* attributes (data-project first, then any data-*).
  const dataProject = el.getAttribute("data-project");
  if (dataProject) {
    const sel = `[data-project="${dataProject}"]`;
    if (matchesUniquely(sel, el)) return sel;
  }
  for (const attr of Array.from(el.attributes)) {
    if (!attr.name.startsWith("data-") || attr.name === "data-project")
      continue;
    if (attr.name === TOOL_ATTR) continue;
    if (!attr.value) continue;
    const sel = `[${attr.name}="${attr.value}"]`;
    if (matchesUniquely(sel, el)) return sel;
  }

  const classes = usefulClasses(el);
  const { element: section, selector: sectionSel } = findSection(el);

  // 3. Section-scoped semantic class(es).
  if (sectionSel) {
    for (const cls of classes) {
      const sel = `${sectionSel} ${tag}.${cssEscape(cls)}`;
      if (matchesUniquely(sel, el)) return sel;
      const selNoTag = `${sectionSel} .${cssEscape(cls)}`;
      if (matchesUniquely(selNoTag, el)) return selNoTag;
    }
    // 4. Section-scoped nth-of-type against direct parent.
    const parent = el.parentElement;
    if (parent && section && section.contains(parent)) {
      const parentSel =
        parent === section
          ? sectionSel
          : `${sectionSel} ${parent.tagName.toLowerCase()}`;
      const sel = `${parentSel} > ${tag}:nth-of-type(${nthOfType(el)})`;
      if (matchesUniquely(sel, el)) return sel;
    }

    // Repeated layouts often need the complete path inside their section.
    // Keep the semantic section anchor so the selector survives other groups
    // being inserted, removed or reordered.
    const relativePath: string[] = [];
    let current: Element | null = el;
    while (current && current !== section) {
      relativePath.unshift(
        `${current.tagName.toLowerCase()}:nth-of-type(${nthOfType(current)})`,
      );
      const sel = `${sectionSel} > ${relativePath.join(" > ")}`;
      if (matchesUniquely(sel, el)) return sel;
      current = current.parentElement;
    }
  }

  // 3b. Globally-unique semantic class (no section).
  for (const cls of classes) {
    const sel = `${tag}.${cssEscape(cls)}`;
    if (matchesUniquely(sel, el)) return sel;
  }

  // 5. Last resort: grow the DOM path until it uniquely identifies the
  // element. Stopping after a fixed number of levels can omit the section and
  // make repeated card layouts resolve to the first matching group.
  const path: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.body) {
    if (current.id) {
      path.unshift(`#${cssEscape(current.id)}`);
      const selector = path.join(" > ");
      if (matchesUniquely(selector, el)) return selector;
      current = current.parentElement;
      continue;
    }
    path.unshift(
      `${current.tagName.toLowerCase()}:nth-of-type(${nthOfType(current)})`,
    );
    const selector = path.join(" > ");
    if (matchesUniquely(selector, el)) return selector;
    current = current.parentElement;
  }
  return path.join(" > ");
}

/**
 * Resolve a stored selector. Older feedbacks may contain a selector that
 * matches the same child position in several repeated card grids. In that
 * case, use the stored element context to recover the intended target.
 */
export function resolveStoredTarget(
  context: Pick<ElementContext, "selector" | "text" | "tag" | "classes">,
): Element | null {
  let candidates: Element[] = [];
  try {
    candidates = Array.from(document.querySelectorAll(context.selector));
  } catch {
    return null;
  }
  if (candidates.length <= 1) return candidates[0] ?? null;

  const expectedText = normalizedText(context.text);
  const matchingContext = candidates.filter((candidate) => {
    if (candidate.tagName.toLowerCase() !== context.tag) return false;
    if (
      context.classes.length > 0 &&
      !context.classes.every((cls) => candidate.classList.contains(cls))
    ) {
      return false;
    }
    return !expectedText || normalizedText(candidate.textContent ?? "") === expectedText;
  });

  return matchingContext[0] ?? candidates[0] ?? null;
}

function toRect(el: Element): FeedbackRect {
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x),
    y: Math.round(r.y),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
}

/** Detect the active locale from the URL prefix, falling back to <html lang>. */
export function detectLang(): string {
  const path = location.pathname;
  const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
  if (match && (match[1] === "fr" || match[1] === "en")) return match[1];
  return document.documentElement.lang || "en";
}

/** Extract the full context needed to describe and later re-find an element. */
export function getElementContext(el: Element): ElementContext {
  const { element: section, selector: sectionSel } = findSection(el);
  return {
    page: location.pathname,
    url: location.href,
    lang: detectLang(),
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: usefulClasses(el),
    selector: generateSelector(el),
    section: sectionSel,
    sectionTitle: sectionTitle(section),
    text: normalizedText(el.textContent ?? ""),
    rect: toRect(el),
    viewport: { width: window.innerWidth, height: window.innerHeight },
  };
}

/** Short human label for the hover overlay, e.g. `section#teaching` or `article.course-card`. */
export function shortLabel(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (el.id) return `${tag}#${el.id}`;
  const classes = usefulClasses(el);
  if (classes.length) return `${tag}.${classes.slice(0, 2).join(".")}`;
  return tag;
}
