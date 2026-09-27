/*
  OUSO — APP.JS
  ------------------------------------------------------------
  This file reads the data from tools.js and builds the page:
  - draws the 5 category cards
  - draws the tool cards inside the tools panel
  - handles the mobile menu
  - runs the "Global Tool Activity" counter
  - opens a real tool's interface, or the maintenance modal
*/

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderReviewForm();
  setupNav();
  setupModal();
  setupActivityCounter();
  setupFooterYear();
  setupCategoryRouting();
});

/* ---------------------------------------------------------
   CATEGORY GRID
--------------------------------------------------------- */
function renderCategories() {
  const grid = document.getElementById("category-grid");
  grid.innerHTML = OUSO_CATEGORIES.map(cat => `
    <button class="category-card" data-open-category="${cat.id}">
      <span class="category-icon">
        <svg width="22" height="22"><use href="assets/icons/icons.svg#${cat.icon}"></use></svg>
      </span>
      <h3>${cat.name}</h3>
      <p>${cat.description}</p>
    </button>
  `).join("");

  grid.querySelectorAll("[data-open-category]").forEach(btn => {
    btn.addEventListener("click", () => openCategory(btn.dataset.openCategory));
  });
}

/* ---------------------------------------------------------
   TOOLS PANEL (opens when a category is clicked)
--------------------------------------------------------- */
function openCategory(categoryId) {
  const category = OUSO_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  const panel = document.getElementById("tools-panel");
  const tools = OUSO_TOOLS.filter(t => t.category === categoryId);

  document.getElementById("tools-panel-title").textContent = category.name;
  document.getElementById("tools-panel-desc").textContent = category.description;
  document.getElementById("tools-panel-icon").innerHTML =
    `<svg width="26" height="26"><use href="assets/icons/icons.svg#${category.icon}"></use></svg>`;

  document.getElementById("tool-grid").innerHTML = tools.map(tool => `
    <button class="tool-card" data-open-tool="${tool.id}">
      <span class="tool-icon">
        <svg width="20" height="20"><use href="assets/icons/icons.svg#${tool.icon}"></use></svg>
      </span>
      <h4>${tool.name}</h4>
      <p>${tool.description}</p>
      ${toolBadge(tool.status)}
    </button>
  `).join("");

  panel.querySelectorAll("[data-open-tool]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = OUSO_TOOLS.find(t => t.id === btn.dataset.openTool);
      handleToolClick(tool);
    });
  });

  panel.hidden = false;
  history.replaceState(null, "", `#${categoryId}`);
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toolBadge(status) {
  if (status === "working") return "";
  const icon = status === "api-ready" ? "icon-sparkle" : "icon-lock";
  const label = "Coming soon";
  return `<span class="tool-badge"><svg><use href="assets/icons/icons.svg#${icon}"></use></svg>${label}</span>`;
}

/* This is the single place that decides what happens when any
   tool is clicked. A "working" tool with a matching entry in
   TOOL_RENDERERS opens its real interface. Everything else
   opens the maintenance modal. */
function handleToolClick(tool) {
  if (!tool) return;

  if (tool.status === "working" && typeof TOOL_RENDERERS !== "undefined" && TOOL_RENDERERS[tool.id]) {
    openToolWorkspace(tool);
    return;
  }

  openModal(
    tool.name,
    "This service is under maintenance. It will be available soon."
  );
}

/* Opens the dedicated workspace for a real, working tool. */
function openToolWorkspace(tool) {
  document.getElementById("tools-panel").hidden = true;

  const workspace = document.getElementById("tool-workspace");
  document.getElementById("tool-workspace-title").textContent = tool.name;

  const content = document.getElementById("tool-workspace-content");
  content.innerHTML = "";
  TOOL_RENDERERS[tool.id](content);

  workspace.hidden = false;
  workspace.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeToolWorkspace() {
  document.getElementById("tool-workspace").hidden = true;
  const panel = document.getElementById("tools-panel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Back button + browser back/forward + direct #hash links */
function setupCategoryRouting() {
  document.getElementById("back-to-categories").addEventListener("click", closeToolsPanel);
  document.getElementById("back-to-tool-workspace").addEventListener("click", closeToolWorkspace);

  document.querySelectorAll("[data-category]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCategory(el.dataset.category);
    });
  });

  const initial = location.hash.replace("#", "");
  if (OUSO_CATEGORIES.some(c => c.id === initial)) {
    openCategory(initial);
  }
}

function closeToolsPanel() {
  document.getElementById("tools-panel").hidden = true;
  history.replaceState(null, "", "#categories");
  document.getElementById("categories").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------------------------------------------------
   MOBILE NAVIGATION
--------------------------------------------------------- */
function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   MODAL
--------------------------------------------------------- */
function setupModal() {
  const backdrop = document.getElementById("modal-backdrop");
  document.getElementById("modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  document.querySelectorAll("[data-footer-modal]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(link.textContent.trim(), "This page is coming soon.");
    });
  });
}

function openModal(title, message) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  const backdrop = document.getElementById("modal-backdrop");
  backdrop.hidden = false;
  document.getElementById("modal-close").focus();
}

function closeModal() {
  document.getElementById("modal-backdrop").hidden = true;
}

/* ---------------------------------------------------------
   GLOBAL TOOL ACTIVITY COUNTER
--------------------------------------------------------- */
function calculateActivityNumber() {
  const BASE_NUMBER = 84_213_940;
  const EPOCH = new Date("2026-01-01T00:00:00Z").getTime();
  const GROWTH_PER_SECOND = 3.2;

  const secondsElapsed = (Date.now() - EPOCH) / 1000;
  return Math.floor(BASE_NUMBER + secondsElapsed * GROWTH_PER_SECOND);
}

function setupActivityCounter() {
  const el = document.getElementById("activity-counter");
  let displayed = 0;
  const target = calculateActivityNumber();

  function animate() {
    const diff = target - displayed;
    const step = Math.max(1, Math.ceil(diff / 30));
    displayed = Math.min(target, displayed + step);
    el.textContent = displayed.toLocaleString("en-US");
    if (displayed < target) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  setInterval(() => {
    const newTarget = calculateActivityNumber();
    if (newTarget > displayed) {
      displayed += 1;
      el.textContent = displayed.toLocaleString("en-US");
    }
  }, 1400);
}

/* ---------------------------------------------------------
   REVIEW FORM
--------------------------------------------------------- */
function renderReviewForm() {
  const form = document.getElementById("review-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("review-confirm").hidden = false;
    form.reset();
  });
}

/* ---------------------------------------------------------
   FOOTER YEAR
--------------------------------------------------------- */
function setupFooterYear() {
  document.getElementById("footer-year").textContent = new Date().getFullYear();
                          }
