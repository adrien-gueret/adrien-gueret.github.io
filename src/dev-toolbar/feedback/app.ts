/**
 * Browser-side "Feedback" Dev Toolbar app.
 *
 * Runs only during `astro dev` (registered by ./integration.ts). It provides a
 * DOM-selection based visual feedback tool whose output is exported to
 * `feedback/portfolio-review.md` for Codex to consume.
 *
 * All UI lives inside the Dev Toolbar Shadow DOM (style isolation). The page
 * overlays (hover highlight + numbered badges) are appended to the document but
 * are non-interactive (`pointer-events: none`) and flagged with `data-feedback-tool`
 * so they never interfere with the portfolio or get selected by the tool itself.
 */

import { defineToolbarApp } from "astro/toolbar";
import type { Feedback, FeedbackData, FeedbackType } from "./types.js";
import { FEEDBACK_TYPES } from "./types.js";
import {
  TOOL_ATTR,
  getElementContext,
  isToolElement,
  shortLabel,
} from "./selectors.js";

const STORAGE_KEY = "astro-feedback-tool:v1";

const CODEX_PROMPT = `Lis le fichier feedback/portfolio-review.md.

Traite chacun des feedbacks séparément et applique les corrections demandées dans le portfolio.

Pour chaque feedback :
- retrouve l'élément via la page, le selector, la section et le texte fournis ;
- interprète le feedback dans le contexte du design existant ;
- conserve le style et les conventions du projet ;
- ne fais pas de refonte globale sauf si le feedback le demande explicitement.

Après modification :
- lance les vérifications habituelles du projet ;
- indique pour chaque feedback ce que tu as changé ;
- signale les feedbacks que tu n'as pas pu appliquer avec certitude.

Ne modifie pas README.md.
Ne supprime PAS automatiquement le fichier feedback après traitement.`;

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadFeedbacks(): Feedback[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Feedback[]) : [];
  } catch {
    return [];
  }
}

function persist(feedbacks: Feedback[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  } catch {
    /* storage full / disabled — non fatal in dev */
  }
}

export default defineToolbarApp({
  init(canvas, app, server) {
    let feedbacks = loadFeedbacks();
    let hasLocalState = localStorage.getItem(STORAGE_KEY) !== null;
    let active = false;
    let hovered: Element | null = null;
    let editing: { id: string | null; context: Feedback } | null = null;
    let rafId = 0;

    // --- Document-level overlay layer (created on activate) ---------------
    let overlay: HTMLDivElement | null = null;
    let highlight: HTMLDivElement | null = null;
    let label: HTMLDivElement | null = null;
    let styleTag: HTMLStyleElement | null = null;
    const badges = new Map<string, HTMLDivElement>();

    // --- Shadow-DOM UI ----------------------------------------------------
    const shadowStyle = document.createElement("style");
    shadowStyle.textContent = `
      :host { all: initial; }
      .fb-window { font-family: system-ui, sans-serif; display: flex; flex-direction: column; max-height: 432px; min-height: 0; }
      .fb-head { flex: 0 0 auto; display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
      .fb-head h1 { font-size: 1rem; margin: 0; color: white; font-weight: 600; }
      .fb-count { background: #7611a6; color: white; border-radius: 999px; padding: 0 .5rem; font-size: .75rem; line-height: 1.4rem; }
      .fb-hint { flex: 0 0 auto; color: #cbd5e1; font-size: .8rem; margin: 0 0 .75rem; }
      .fb-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; margin: 0 -4px; padding: 0 4px; }
      .fb-foot { flex: 0 0 auto; margin-top: .5rem; padding-top: .75rem; border-top: 1px solid rgba(255,255,255,.1); }
      .fb-panel { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: .5rem; padding: .75rem; margin-bottom: .75rem; }
      .fb-panel h2 { font-size: .8rem; margin: 0 0 .5rem; color: #e2e8f0; text-transform: uppercase; letter-spacing: .04em; }
      .fb-meta { font-size: .78rem; color: #cbd5e1; margin: 0 0 .5rem; word-break: break-word; }
      .fb-meta code { color: #f0abfc; background: rgba(0,0,0,.3); padding: 0 .25rem; border-radius: .25rem; }
      .fb-field { display: block; margin-bottom: .5rem; }
      .fb-field label { display: block; font-size: .75rem; color: #cbd5e1; margin-bottom: .25rem; }
      .fb-field select, .fb-field textarea {
        width: 100%; box-sizing: border-box; font: inherit; color: white;
        background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.2);
        border-radius: .35rem; padding: .35rem .5rem;
      }
      .fb-field textarea { min-height: 4.5rem; resize: vertical; }
      .fb-actions { display: flex; flex-wrap: wrap; gap: .4rem; }
      button.fb-btn {
        font: inherit; font-size: .8rem; cursor: pointer; color: white;
        background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
        border-radius: .4rem; padding: .35rem .6rem;
      }
      button.fb-btn:hover { background: rgba(255,255,255,.18); }
      button.fb-btn:focus-visible { outline: 2px solid #d97fff; outline-offset: 2px; }
      button.fb-btn.primary { background: #7611a6; border-color: #7611a6; }
      button.fb-btn.primary:hover { background: #8c1cc4; }
      button.fb-btn.danger { border-color: #ef4444; color: #fecaca; }
      button.fb-btn.small { padding: .15rem .4rem; font-size: .72rem; }
      .fb-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
      .fb-item { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: .5rem; padding: .5rem .6rem; }
      .fb-item .fb-item-head { display: flex; align-items: center; gap: .4rem; margin-bottom: .25rem; }
      .fb-item .fb-num { background: #7611a6; color: white; border-radius: 999px; min-width: 1.3rem; height: 1.3rem; display: inline-flex; align-items: center; justify-content: center; font-size: .72rem; }
      .fb-item .fb-type { font-size: .7rem; color: #f0abfc; text-transform: uppercase; letter-spacing: .04em; }
      .fb-item p { margin: .25rem 0; font-size: .78rem; color: #e2e8f0; word-break: break-word; }
      .fb-item .fb-sel { font-size: .72rem; color: #94a3b8; }
      .fb-item .fb-item-actions { display: flex; gap: .35rem; margin-top: .35rem; }
      .fb-empty { color: #94a3b8; font-size: .8rem; font-style: italic; }
      .fb-status { font-size: .75rem; color: #86efac; min-height: 1rem; margin-top: .4rem; }
    `;
    canvas.appendChild(shadowStyle);

    const win = document.createElement("astro-dev-toolbar-window");
    const ui = document.createElement("div");
    ui.className = "fb-window";
    win.appendChild(ui);
    canvas.appendChild(win);

    // Sub-containers are (re)rendered on demand.
    const editorHost = document.createElement("div");
    const listHost = document.createElement("div");
    const statusEl = document.createElement("div");
    statusEl.className = "fb-status";
    statusEl.setAttribute("role", "status");
    statusEl.setAttribute("aria-live", "polite");

    // ---------------------------------------------------------------------
    //  Helpers
    // ---------------------------------------------------------------------
    function el<K extends keyof HTMLElementTagNameMap>(
      tag: K,
      props: Partial<HTMLElementTagNameMap[K]> = {},
      children: (Node | string)[] = [],
    ): HTMLElementTagNameMap[K] {
      const node = document.createElement(tag);
      Object.assign(node, props);
      for (const child of children) {
        node.append(
          typeof child === "string" ? document.createTextNode(child) : child,
        );
      }
      return node;
    }

    function setStatus(message: string): void {
      statusEl.textContent = message;
      if (message) {
        window.setTimeout(() => {
          if (statusEl.textContent === message) statusEl.textContent = "";
        }, 4000);
      }
    }

    async function sendWhenConnected<T>(
      event: string,
      data: T,
      retries = 50,
    ): Promise<boolean> {
      for (let attempt = 0; attempt < retries; attempt += 1) {
        try {
          server.send(event, data);
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (!message.includes("before connect")) throw error;
          await new Promise<void>((resolve) => window.setTimeout(resolve, 100));
        }
      }
      return false;
    }

    function save(): void {
      persist(feedbacks);
      hasLocalState = true;
      app.toggleNotification({ state: feedbacks.length > 0, level: "info" });
    }

    function currentPageFeedbacks(): { feedback: Feedback; index: number }[] {
      return feedbacks
        .map((feedback, index) => ({ feedback, index }))
        .filter(({ feedback }) => feedback.page === location.pathname);
    }

    // ---------------------------------------------------------------------
    //  Page overlays (highlight + badges)
    // ---------------------------------------------------------------------
    function ensureOverlay(): void {
      if (overlay) return;

      styleTag = document.createElement("style");
      styleTag.setAttribute(TOOL_ATTR, "");
      styleTag.textContent = `
        html.astro-feedback-active, html.astro-feedback-active * { cursor: crosshair !important; }
        .astro-feedback-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 999998; }
        .astro-feedback-highlight { position: fixed; pointer-events: none; z-index: 999998;
          border: 2px solid #b429f9; background: rgba(180,41,249,.12); border-radius: 2px;
          box-shadow: 0 0 0 1px rgba(255,255,255,.4); transition: all .04s linear; display: none; }
        .astro-feedback-label { position: fixed; pointer-events: none; z-index: 999999;
          background: #b429f9; color: white; font: 600 11px/1.4 system-ui, sans-serif;
          padding: 1px 6px; border-radius: 4px; white-space: nowrap; display: none; }
        .astro-feedback-badge { position: fixed; pointer-events: none; z-index: 999997;
          background: #7611a6; color: white; font: 600 11px/1 system-ui, sans-serif;
          min-width: 18px; height: 18px; padding: 0 3px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,.4); transform: translate(-50%, -50%); }
      `;
      document.head.appendChild(styleTag);

      overlay = document.createElement("div");
      overlay.className = "astro-feedback-overlay";
      overlay.setAttribute(TOOL_ATTR, "");

      highlight = document.createElement("div");
      highlight.className = "astro-feedback-highlight";
      highlight.setAttribute(TOOL_ATTR, "");

      label = document.createElement("div");
      label.className = "astro-feedback-label";
      label.setAttribute(TOOL_ATTR, "");

      overlay.append(highlight, label);
      document.body.appendChild(overlay);
      document.documentElement.classList.add("astro-feedback-active");
    }

    function removeOverlay(): void {
      overlay?.remove();
      styleTag?.remove();
      badges.forEach((b) => b.remove());
      badges.clear();
      overlay = highlight = label = styleTag = null;
      document.documentElement.classList.remove("astro-feedback-active");
    }

    function positionHighlight(): void {
      if (!highlight || !label) return;
      if (!hovered || !hovered.isConnected) {
        highlight.style.display = "none";
        label.style.display = "none";
        return;
      }
      const r = hovered.getBoundingClientRect();
      highlight.style.display = "block";
      highlight.style.left = `${r.left}px`;
      highlight.style.top = `${r.top}px`;
      highlight.style.width = `${r.width}px`;
      highlight.style.height = `${r.height}px`;

      label.style.display = "block";
      label.textContent = shortLabel(hovered);
      const labelTop = r.top > 20 ? r.top - 18 : r.top + 2;
      label.style.left = `${Math.max(2, r.left)}px`;
      label.style.top = `${labelTop}px`;
    }

    function renderBadges(): void {
      if (!overlay) return;
      badges.forEach((b) => b.remove());
      badges.clear();
      for (const { feedback, index } of currentPageFeedbacks()) {
        let target: Element | null = null;
        try {
          target = document.querySelector(feedback.selector);
        } catch {
          target = null;
        }
        if (!target || isToolElement(target)) continue;
        const r = target.getBoundingClientRect();
        const badge = document.createElement("div");
        badge.className = "astro-feedback-badge";
        badge.setAttribute(TOOL_ATTR, "");
        badge.textContent = String(index + 1);
        badge.style.left = `${r.left + 8}px`;
        badge.style.top = `${r.top + 8}px`;
        overlay.appendChild(badge);
        badges.set(feedback.id, badge);
      }
    }

    function repositionBadges(): void {
      for (const { feedback, index } of currentPageFeedbacks()) {
        const badge = badges.get(feedback.id);
        if (!badge) continue;
        let target: Element | null = null;
        try {
          target = document.querySelector(feedback.selector);
        } catch {
          target = null;
        }
        if (!target) {
          badge.style.display = "none";
          continue;
        }
        const r = target.getBoundingClientRect();
        badge.style.display = "inline-flex";
        badge.style.left = `${r.left + 8}px`;
        badge.style.top = `${r.top + 8}px`;
        badge.textContent = String(index + 1);
      }
    }

    function scheduleReposition(): void {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        positionHighlight();
        repositionBadges();
      });
    }

    // ---------------------------------------------------------------------
    //  Inspection listeners
    // ---------------------------------------------------------------------
    function onMove(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element) || isToolElement(target)) return;
      if (target === document.documentElement || target === document.body)
        return;
      hovered = target;
      positionHighlight();
    }

    function onClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element) || isToolElement(target)) return;
      if (target === document.documentElement || target === document.body)
        return;
      // Intercept the click so links/buttons don't fire their normal behaviour.
      event.preventDefault();
      event.stopPropagation();
      openEditorFor(target);
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Escape") return;
      if (editing) {
        event.preventDefault();
        event.stopPropagation();
        closeEditor();
      } else if (active) {
        event.preventDefault();
        app.toggleState({ state: false });
      }
    }

    function enable(): void {
      if (active) return;
      active = true;
      ensureOverlay();
      document.addEventListener("mousemove", onMove, true);
      document.addEventListener("click", onClick, true);
      document.addEventListener("keydown", onKeyDown, true);
      window.addEventListener("scroll", scheduleReposition, true);
      window.addEventListener("resize", scheduleReposition, true);
      renderBadges();
      renderList();
    }

    function disable(): void {
      if (!active) return;
      active = false;
      hovered = null;
      closeEditor();
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("scroll", scheduleReposition, true);
      window.removeEventListener("resize", scheduleReposition, true);
      removeOverlay();
    }

    // ---------------------------------------------------------------------
    //  Editor
    // ---------------------------------------------------------------------
    function openEditorFor(target: Element): void {
      const context = getElementContext(target);
      editing = {
        id: null,
        context: {
          ...context,
          id: uid(),
          type: "Content",
          comment: "",
          timestamp: new Date().toISOString(),
        },
      };
      renderEditor();
    }

    function openEditorForExisting(feedback: Feedback): void {
      editing = { id: feedback.id, context: { ...feedback } };
      renderEditor();
    }

    function closeEditor(): void {
      editing = null;
      editorHost.replaceChildren();
    }

    function renderEditor(): void {
      editorHost.replaceChildren();
      if (!editing) return;
      const ctx = editing.context;

      const panel = el("div", { className: "fb-panel" });
      panel.setAttribute("role", "group");
      panel.setAttribute("aria-label", "Feedback editor");

      panel.append(
        el("h2", {}, [editing.id ? "Edit feedback" : "New feedback"]),
      );

      const meta = el("p", { className: "fb-meta" });
      const selCode = el("code", {}, [ctx.selector]);
      meta.append("Élément : ", selCode);
      panel.append(meta);

      if (ctx.sectionTitle || ctx.section) {
        panel.append(
          el("p", { className: "fb-meta" }, [
            `Contexte : ${ctx.sectionTitle ?? ctx.section ?? ""}`,
          ]),
        );
      }
      if (ctx.text) {
        panel.append(
          el("p", { className: "fb-meta" }, [
            `Extrait : “${ctx.text.slice(0, 120)}”`,
          ]),
        );
      }

      // Type select
      const typeField = el("div", { className: "fb-field" });
      const typeId = "fb-type";
      typeField.append(el("label", { htmlFor: typeId }, ["Type"]));
      const select = el("select", { id: typeId });
      for (const type of FEEDBACK_TYPES) {
        const option = el("option", { value: type, textContent: type });
        if (type === ctx.type) option.selected = true;
        select.append(option);
      }
      typeField.append(select);
      panel.append(typeField);

      // Comment textarea
      const commentField = el("div", { className: "fb-field" });
      const commentId = "fb-comment";
      const contentPrefill = ctx.text ? `"${ctx.text}"` : "";
      const initialComment =
        !editing.id && ctx.type === "Content" && !ctx.comment
          ? contentPrefill
          : ctx.comment;
      commentField.append(
        el("label", { htmlFor: commentId }, ["Feedback (obligatoire)"]),
      );
      const textarea = el("textarea", { id: commentId, value: initialComment });
      textarea.setAttribute("required", "true");
      commentField.append(textarea);
      panel.append(commentField);

      let previousType = ctx.type;
      select.addEventListener("change", () => {
        const nextType = select.value as FeedbackType;
        if (
          previousType === "Content" &&
          nextType !== "Content" &&
          textarea.value === contentPrefill
        ) {
          textarea.value = "";
        } else if (
          nextType === "Content" &&
          textarea.value.trim() === "" &&
          contentPrefill
        ) {
          textarea.value = contentPrefill;
        }
        previousType = nextType;
      });

      // Actions
      const actions = el("div", { className: "fb-actions" });
      const addBtn = el("button", {
        className: "fb-btn primary",
        textContent: editing.id ? "Enregistrer" : "Ajouter",
      });
      addBtn.type = "button";
      const submitFeedback = (): void => {
        const comment = textarea.value.trim();
        if (!comment) {
          textarea.focus();
          setStatus("Le feedback est obligatoire.");
          return;
        }
        commitEditor(select.value as FeedbackType, comment);
      };
      addBtn.addEventListener("click", submitFeedback);
      textarea.addEventListener("keydown", (event) => {
        if (
          event.key !== "Enter" ||
          event.shiftKey ||
          event.ctrlKey ||
          event.altKey ||
          event.metaKey ||
          event.isComposing
        ) {
          return;
        }
        event.preventDefault();
        submitFeedback();
      });
      const cancelBtn = el("button", {
        className: "fb-btn",
        textContent: "Annuler",
      });
      cancelBtn.type = "button";
      cancelBtn.addEventListener("click", () => closeEditor());
      actions.append(addBtn, cancelBtn);
      panel.append(actions);

      editorHost.append(panel);
      textarea.focus();
    }

    function commitEditor(type: FeedbackType, comment: string): void {
      if (!editing) return;
      if (editing.id) {
        feedbacks = feedbacks.map((f) =>
          f.id === editing!.id
            ? { ...f, type, comment, timestamp: new Date().toISOString() }
            : f,
        );
      } else {
        feedbacks = [...feedbacks, { ...editing.context, type, comment }];
      }
      save();
      closeEditor();
      renderBadges();
      renderList();
      setStatus("Feedback enregistré.");
    }

    // ---------------------------------------------------------------------
    //  List
    // ---------------------------------------------------------------------
    function goToElement(feedback: Feedback): void {
      if (feedback.page !== location.pathname) {
        setStatus(`Ce feedback est sur ${feedback.page}.`);
        return;
      }
      let target: Element | null = null;
      try {
        target = document.querySelector(feedback.selector);
      } catch {
        target = null;
      }
      if (!target) {
        setStatus("Élément introuvable sur cette page.");
        return;
      }
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      hovered = target;
      positionHighlight();
      const flash = highlight;
      if (flash) {
        flash.style.transition = "none";
        flash.style.boxShadow = "0 0 0 3px #22c55e";
        window.setTimeout(() => {
          if (flash) flash.style.boxShadow = "0 0 0 1px rgba(255,255,255,.4)";
        }, 700);
      }
    }

    function renderList(): void {
      listHost.replaceChildren();

      const panel = el("div", { className: "fb-panel" });
      panel.append(el("h2", {}, [`Feedbacks (${feedbacks.length})`]));

      if (feedbacks.length === 0) {
        panel.append(
          el("p", { className: "fb-empty" }, [
            "Aucun feedback pour le moment.",
          ]),
        );
      } else {
        const list = el("ul", { className: "fb-list" });
        feedbacks.forEach((feedback, index) => {
          const item = el("li", { className: "fb-item" });

          const head = el("div", { className: "fb-item-head" });
          head.append(
            el("span", { className: "fb-num", textContent: String(index + 1) }),
          );
          head.append(
            el("span", { className: "fb-type", textContent: feedback.type }),
          );
          item.append(head);

          item.append(
            el("p", {
              className: "fb-sel",
              textContent: `${feedback.page} · ${feedback.selector}`,
            }),
          );
          item.append(el("p", {}, [feedback.comment]));

          const itemActions = el("div", { className: "fb-item-actions" });
          const editBtn = el("button", {
            className: "fb-btn small",
            textContent: "Modifier",
          });
          editBtn.type = "button";
          editBtn.addEventListener("click", () =>
            openEditorForExisting(feedback),
          );

          const delBtn = el("button", {
            className: "fb-btn small danger",
            textContent: "Supprimer",
          });
          delBtn.type = "button";
          delBtn.addEventListener("click", () => {
            feedbacks = feedbacks.filter((f) => f.id !== feedback.id);
            save();
            renderBadges();
            renderList();
          });

          const gotoBtn = el("button", {
            className: "fb-btn small",
            textContent: "Aller à",
          });
          gotoBtn.type = "button";
          gotoBtn.disabled = feedback.page !== location.pathname;
          gotoBtn.addEventListener("click", () => goToElement(feedback));

          itemActions.append(editBtn, delBtn, gotoBtn);
          item.append(itemActions);
          list.append(item);
        });
        panel.append(list);
      }

      listHost.append(panel);
      updateCount();
    }

    // ---------------------------------------------------------------------
    //  Global actions (export / prompt / undo / clear)
    // ---------------------------------------------------------------------
    async function exportForCodex(): Promise<void> {
      const data: FeedbackData = {
        version: 1,
        generatedAt: new Date().toISOString(),
        feedbacks,
      };
      setStatus("Connexion au serveur de développement…");
      const sent = await sendWhenConnected("feedback:save", data);
      setStatus(
        sent
          ? "Export en cours…"
          : "Échec export : serveur de développement indisponible.",
      );
    }

    async function copyPrompt(): Promise<void> {
      try {
        await navigator.clipboard.writeText(CODEX_PROMPT);
        setStatus("Prompt Codex copié.");
      } catch {
        setStatus("Impossible de copier le prompt.");
      }
    }

    function undoLast(): void {
      if (feedbacks.length === 0) return;
      feedbacks = feedbacks.slice(0, -1);
      save();
      renderBadges();
      renderList();
      setStatus("Dernier feedback annulé.");
    }

    async function clearAll(): Promise<void> {
      if (feedbacks.length === 0) return;
      const confirmed = window.confirm(
        `Supprimer les ${feedbacks.length} feedbacks ? Cette action est irréversible.`,
      );
      if (!confirmed) return;
      feedbacks = [];
      save();
      renderBadges();
      renderList();
      setStatus("Suppression des feedbacks enregistrés…");
      const sent = await sendWhenConnected("feedback:clear", {});
      if (!sent) {
        setStatus(
          "Feedbacks supprimés localement, mais serveur de développement indisponible.",
        );
      }
    }

    // ---------------------------------------------------------------------
    //  Static chrome (built once)
    // ---------------------------------------------------------------------
    const head = el("div", { className: "fb-head" });
    const title = el("h1", { textContent: "Feedback" });
    const countBadge = el("span", { className: "fb-count", textContent: "0" });
    head.append(title, countBadge);

    const hint = el("p", {
      className: "fb-hint",
      textContent:
        "Survolez un élément, cliquez pour l’annoter. Échap pour quitter.",
    });

    const globalActions = el("div", { className: "fb-actions" });
    const exportBtn = el("button", {
      className: "fb-btn primary",
      textContent: "Export for Codex",
    });
    exportBtn.type = "button";
    exportBtn.addEventListener("click", exportForCodex);
    const promptBtn = el("button", {
      className: "fb-btn",
      textContent: "Copy Codex prompt",
    });
    promptBtn.type = "button";
    promptBtn.addEventListener("click", () => void copyPrompt());
    const undoBtn = el("button", {
      className: "fb-btn",
      textContent: "Undo last",
    });
    undoBtn.type = "button";
    undoBtn.addEventListener("click", undoLast);
    const clearBtn = el("button", {
      className: "fb-btn danger",
      textContent: "Clear all",
    });
    clearBtn.type = "button";
    clearBtn.addEventListener("click", () => void clearAll());
    globalActions.append(exportBtn, promptBtn, undoBtn, clearBtn);

    const body = el("div", { className: "fb-body" });
    body.append(editorHost, listHost);
    const foot = el("div", { className: "fb-foot" });
    foot.append(globalActions, statusEl);
    ui.append(head, hint, body, foot);

    function updateCount(): void {
      countBadge.textContent = String(feedbacks.length);
    }

    // ---------------------------------------------------------------------
    //  Server sync + lifecycle
    // ---------------------------------------------------------------------
    // On init, restore from disk only if no local state exists. An explicitly
    // stored empty list means the user cleared the feedbacks.
    server.on<FeedbackData>("feedback:data", (data) => {
      if (!hasLocalState && data?.feedbacks?.length) {
        feedbacks = data.feedbacks;
        save();
        renderBadges();
        renderList();
      }
    });
    server.on<{ ok: boolean; markdown?: string; error?: string }>(
      "feedback:saved",
      (result) => {
        setStatus(
          result.ok
            ? `Exporté → ${result.markdown}`
            : `Échec export : ${result.error ?? ""}`,
        );
      },
    );
    server.on<{ ok: boolean; error?: string }>(
      "feedback:cleared",
      (result) => {
        setStatus(
          result.ok
            ? "Tous les feedbacks ont été supprimés."
            : `Suppression incomplète : ${result.error ?? ""}`,
        );
      },
    );
    void sendWhenConnected("feedback:pull", {});

    app.onToggled(({ state }) => {
      if (state) enable();
      else disable();
    });

    // Initial paint of the (hidden until toggled) UI + notification dot.
    renderList();
    app.toggleNotification({ state: feedbacks.length > 0, level: "info" });
  },

  beforeTogglingOff() {
    // Allow toggling off; cleanup happens in the onToggled(false) handler.
    return true;
  },
});
