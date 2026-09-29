/*
  OUSO — APP.JS (Updated: Direct Opening for Gaming)
*/

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  setupNav();
  setupModal();
  setupActivityCounter();
  setupFooterYear();
  setupCategoryRouting();
  setupSplash();
  setupSearch();
  setupThemeToggle();
  setupShare();
  setupPwaPrompt();
});

/* 10. Splash Screen Logic */
function setupSplash() {
  const splash = document.getElementById("splash-screen");
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 400);
  }, 1000);
}

/* ---------------------------------------------------------
   CATEGORY GRID (With Direct Cat Logo for Gaming)
--------------------------------------------------------- */
function renderCategories() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  grid.innerHTML = OUSO_CATEGORIES.map(cat => {
    const isGaming = cat.id === "gaming";
    const iconHtml = isGaming ? `
      <svg width="24" height="24" viewBox="0 0 100 100" fill="#C6A15B">
        <path d="M30 35 L20 12 L42 26 Z M70 35 L80 12 L58 26 Z M22 45 C22 33 78 33 78 45 C78 70 72 88 50 88 C28 88 22 70 22 45 Z"/>
        <circle cx="38" cy="46" r="5" fill="#0B0B0C"/>
        <circle cx="62" cy="46" r="5" fill="#0B0B0C"/>
        <path d="M43 58 Q50 65 57 58" stroke="#0B0B0C" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
    ` : `
      <svg width="22" height="22"><use href="assets/icons/icons.svg#${cat.icon}"></use></svg>
    `;

    return `
      <button class="category-card" data-open-category="${cat.id}">
        <span class="category-icon">${iconHtml}</span>
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
      </button>
    `;
  }).join("");

  grid.querySelectorAll("[data-open-category]").forEach(btn => {
    btn.addEventListener("click", () => openCategory(btn.dataset.openCategory));
  });
}

/* ---------------------------------------------------------
   TOOLS PANEL & DIRECT OPENING FOR GAMING
--------------------------------------------------------- */
function openCategory(categoryId) {
  const category = OUSO_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  // إذا كانت الفئة هي الألعاب، نفتح اللعبة مباشرة بدون إظهار قائمة فرعية
  if (categoryId === "gaming") {
    const tool = OUSO_TOOLS.find(t => t.category === "gaming" && t.status === "working");
    if (tool) {
      document.getElementById("categories-section").hidden = true;
      document.querySelector(".hero").hidden = true;
      document.querySelector(".faq-section").hidden = true;
      document.querySelector(".testimonials").hidden = true;
      openToolWorkspace(tool);
      history.replaceState(null, "", `#${categoryId}`);
      return;
    }
  }

  document.getElementById("categories-section").hidden = true;
  document.querySelector(".hero").hidden = true;
  document.querySelector(".faq-section").hidden = true;
  document.querySelector(".testimonials").hidden = true;

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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toolBadge(status) {
  if (status === "working") return "";
  const icon = status === "api-ready" ? "icon-sparkle" : "icon-lock";
  const label = "Coming soon";
  return `<span class="tool-badge"><svg><use href="assets/icons/icons.svg#${icon}"></use></svg>${label}</span>`;
}

function handleToolClick(tool) {
  if (!tool) return;
  if (tool.status === "working" && typeof TOOL_RENDERERS !== "undefined" && TOOL_RENDERERS[tool.id]) {
    openToolWorkspace(tool);
    return;
  }
  openModal(tool.name, "This service is under maintenance. It will be available soon.");
}

function openToolWorkspace(tool) {
  // إذا كانت اللعبة، نخفي لوحة الأدوات إن كانت مفتوحة
  const panel = document.getElementById("tools-panel");
  if (panel) panel.hidden = true;

  const workspace = document.getElementById("tool-workspace");
  document.getElementById("tool-workspace-title").textContent = tool.name;
  const content = document.getElementById("tool-workspace-content");
  content.innerHTML = "";
  TOOL_RENDERERS[tool.id](content);
  workspace.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeToolWorkspace() {
  document.getElementById("tool-workspace").hidden = true;
  document.getElementById("categories-section").hidden = false;
  document.querySelector(".hero").hidden = false;
  document.querySelector(".faq-section").hidden = false;
  document.querySelector(".testimonials").hidden = false;
  history.replaceState(null, "", "#home");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupCategoryRouting() {
  document.getElementById("back-to-categories").addEventListener("click", closeToolsPanel);
  document.getElementById("back-to-tool-workspace").addEventListener("click", closeToolWorkspace);

  const initial = location.hash.replace("#", "");
  if (OUSO_CATEGORIES.some(c => c.id === initial)) {
    openCategory(initial);
  }
}

function closeToolsPanel() {
  document.getElementById("tools-panel").hidden = true;
  document.getElementById("categories-section").hidden = false;
  document.querySelector(".hero").hidden = false;
  document.querySelector(".faq-section").hidden = false;
  document.querySelector(".testimonials").hidden = false;
  history.replaceState(null, "", "#home");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* 3. Global Search */
function setupSearch() {
  const input = document.getElementById("global-search");
  if (!input) return;
  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;
    const found = OUSO_TOOLS.find(t => t.name.toLowerCase().includes(query));
    if (found) {
      openCategory(found.category);
    }
  });
}

/* 4. Theme Toggle */
function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isDark = document.body.classList.toggle("dark-theme");
    toggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

/* 12. Share Site Button */
function setupShare() {
  const shareBtn = document.getElementById("share-btn");
  if (!shareBtn) return;
  shareBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = "https://ouso.ouso.workers.dev";
    if (navigator.share) {
      navigator.share({ title: "OUSO", text: "Whatever You Need. It Starts Here.", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Site link copied to clipboard: " + url);
    }
  });
}

/* 13. PWA Install Prompt */
function setupPwaPrompt() {
  const banner = document.getElementById("pwa-banner");
  const installBtn = document.getElementById("pwa-install-action");
  const closeBtn = document.getElementById("pwa-close-action");
  if (!banner) return;

  if (localStorage.getItem("ouso_installed") === "true") return;

  setTimeout(() => {
    banner.hidden = false;
  }, 3000);

  installBtn.addEventListener("click", () => {
    localStorage.setItem("ouso_installed", "true");
    banner.hidden = true;
    alert("To install OUSO, use your browser menu and select 'Add to Home Screen' or 'Install App'.");
  });

  closeBtn.addEventListener("click", () => {
    banner.hidden = true;
    localStorage.setItem("ouso_installed", "true");
  });
}

/* MOBILE NAVIGATION */
function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

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

/* MODAL */
function setupModal() {
  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close");
  if (!backdrop || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  document.querySelectorAll("[data-footer-modal]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(link.textContent.trim(), "This legal page is coming soon.");
    });
  });
}

function openModal(title, message) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("modal-backdrop").hidden = false;
}

function closeModal() {
  document.getElementById("modal-backdrop").hidden = true;
}

/* 1. Random Fluctuating Visitor Counter */
function setupActivityCounter() {
  const el = document.getElementById("activity-counter");
  if (!el) return;
  
  let currentVal = 5528585;
  const min = 155888;
  const max = 8656641;

  setInterval(() => {
    const delta = Math.floor(Math.random() * 7000) - 3200;
    currentVal += delta;
    if (currentVal > max) currentVal = max;
    if (currentVal < min) currentVal = min;
    el.textContent = currentVal.toLocaleString("en-US");
  }, 1000);
}

/* FOOTER YEAR */
function setupFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
