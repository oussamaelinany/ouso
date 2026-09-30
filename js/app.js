/*
  OUSO — APP.JS (Individual Tool Pages & Dynamic Routing)
*/

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupModal();
  setupActivityCounter();
  setupFooterYear();
  setupSplash();
  setupSearch();
  setupThemeToggle();
  setupShare();
  setupPwaPrompt();
  
  // Handle URL Routing on Load & PopState
  handleRouting();
  window.addEventListener("popstate", handleRouting);
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
   ROUTING ENGINE (Direct URL, Refresh, Back/Forward support)
--------------------------------------------------------- */
function handleRouting() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const segments = path.split("/").filter(Boolean);

  // Home route: "/" or empty
  if (segments.length === 0) {
    renderHomeView();
    return;
  }

  // Category route: "/images", "/videos", "/pdf", "/tools", "/gaming", "/ai-content"
  if (segments.length === 1) {
    const catId = segments[0];
    const category = OUSO_CATEGORIES.find(c => c.id === catId);
    if (category) {
      renderCategoryView(category);
      return;
    }
  }

  // Individual Tool route: "/images/compressor", "/gaming/breakout-game", etc.
  if (segments.length === 2) {
    const catId = segments[0];
    const toolId = segments[1];
    const tool = OUSO_TOOLS.find(t => t.id === toolId && t.category === catId);
    if (tool) {
      renderToolPageView(tool);
      return;
    }
  }

  // Fallback: 404 or Home
  renderHomeView();
}

/* ---------------------------------------------------------
   VIEWS RENDERERS
--------------------------------------------------------- */

function hideAllViews() {
  document.getElementById("view-home").hidden = true;
  document.getElementById("view-category").hidden = true;
  document.getElementById("view-tool").hidden = true;
  document.getElementById("hero-section").style.display = "block";
}

function renderHomeView() {
  hideAllViews();
  document.getElementById("view-home").hidden = false;
  renderCategories();
  
  // Update SEO for Home
  document.getElementById("page-title").textContent = "OUSO — Whatever You Need. It Starts Here.";
  document.getElementById("meta-desc").setAttribute("content", "A powerful suite of browser tools designed for speed, privacy, and simplicity.");
  document.getElementById("canonical-url").setAttribute("href", window.location.origin + "/");
  document.getElementById("og-title").setAttribute("content", "OUSO — Whatever You Need. It Starts Here.");
  document.getElementById("og-desc").setAttribute("content", "A powerful suite of browser tools designed for speed, privacy, and simplicity.");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCategoryView(category) {
  hideAllViews();
  document.getElementById("hero-section").style.display = "none";
  document.getElementById("view-category").hidden = false;

  const tools = OUSO_TOOLS.filter(t => t.category === category.id);

  document.getElementById("cat-panel-title").textContent = category.name;
  document.getElementById("cat-panel-desc").textContent = category.description;
  document.getElementById("cat-panel-icon").innerHTML =
    `<svg width="26" height="26"><use href="assets/icons/icons.svg#${category.icon}"></use></svg>`;

  document.getElementById("cat-tool-grid").innerHTML = tools.map(tool => `
    <a href="/${category.id}/${tool.id}" class="tool-card" data-route-link>
      <span class="tool-icon">
        <svg width="20" height="20"><use href="assets/icons/icons.svg#${tool.icon}"></use></svg>
      </span>
      <h4>${tool.name}</h4>
      <p>${tool.description}</p>
      ${toolBadge(tool.status)}
    </a>
  `).join("");

  // Back link
  const backBtn = document.getElementById("cat-back-link");
  backBtn.onclick = (e) => {
    e.preventDefault();
    navigateTo("/");
  };

  // Update SEO for Category
  document.getElementById("page-title").textContent = `${category.name} Tools — OUSO`;
  document.getElementById("meta-desc").setAttribute("content", category.description);
  document.getElementById("canonical-url").setAttribute("href", window.location.origin + "/" + category.id);

  window.scrollTo({ top: 0, behavior: "smooth" });
  bindInternalLinks();
}

function renderToolPageView(tool) {
  hideAllViews();
  document.getElementById("hero-section").style.display = "none";
  document.getElementById("view-tool").hidden = false;

  const category = OUSO_CATEGORIES.find(c => c.id === tool.category) || { id: tool.category, name: tool.category };

  // 1. Breadcrumb: Home → Category → Tool Name
  const breadcrumb = document.getElementById("tool-breadcrumb");
  breadcrumb.innerHTML = `
    <a href="/" data-route-link>Home</a>
    <span class="breadcrumb-sep">→</span>
    <a href="/${category.id}" data-route-link>${category.name}</a>
    <span class="breadcrumb-sep">→</span>
    <span class="breadcrumb-current">${tool.name}</span>
  `;

  // 2. Back Links
  document.getElementById("tool-back-home").onclick = (e) => { e.preventDefault(); navigateTo("/"); };
  document.getElementById("tool-back-cat").onclick = (e) => { e.preventDefault(); navigateTo("/" + category.id); };

  // 3. Tool Header Info
  document.getElementById("tool-page-icon").innerHTML =
    `<svg width="28" height="28"><use href="assets/icons/icons.svg#${tool.icon}"></use></svg>`;
  document.getElementById("tool-page-name").textContent = tool.name;
  document.getElementById("tool-page-desc").textContent = tool.description;

  // 4. Content Area: Working vs Maintenance (Coming Soon)
  const contentArea = document.getElementById("tool-page-content-area");
  contentArea.innerHTML = "";

  if (tool.status === "working" && typeof TOOL_RENDERERS !== "undefined" && TOOL_RENDERERS[tool.id]) {
    TOOL_RENDERERS[tool.id](contentArea);
  } else {
    // Professional Coming Soon Page
    contentArea.innerHTML = `
      <div class="coming-soon-box">
        <div class="coming-soon-badge">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="7" r="6"/><path d="M7 4v3l2 2"/></svg>
          Coming Soon / Maintenance
        </div>
        <h3>${tool.name} is Under Development</h3>
        <p>We are building this high-performance utility to provide secure, lightning-fast processing directly inside your browser. It will be released soon as part of the OUSO suite.</p>
        <div class="coming-soon-actions">
          <a href="/${category.id}" class="btn btn-primary" data-route-link>Explore Other ${category.name} Tools</a>
        </div>
      </div>
    `;
  }

  // 5. SEO Content Blocks
  document.querySelectorAll(".seo-tool-name-ref").forEach(el => el.textContent = tool.name);
  document.getElementById("seo-how-to-text").textContent = `Follow these simple steps to utilize ${tool.name} instantly and securely in your browser without any server uploads or registration.`;
  document.getElementById("seo-faq-q").textContent = `Is ${tool.name} free to use?`;
  document.getElementById("seo-faq-a").textContent = `Yes, ${tool.name} is completely free and runs securely client-side.`;

  // 6. Related Tools (from same category, excluding current tool, max 4)
  const relatedGrid = document.getElementById("related-tools-grid");
  const relatedTools = OUSO_TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  relatedGrid.innerHTML = relatedTools.map(rt => `
    <a href="/${rt.category}/${rt.id}" class="tool-card" data-route-link>
      <span class="tool-icon">
        <svg width="20" height="20"><use href="assets/icons/icons.svg#${rt.icon}"></use></svg>
      </span>
      <h4>${rt.name}</h4>
      <p>${rt.description}</p>
      ${toolBadge(rt.status)}
    </a>
  `).join("");

  // 7. Apply Specific Tool SEO Metadata
  document.getElementById("page-title").textContent = `${tool.name} — OUSO`;
  document.getElementById("meta-desc").setAttribute("content", tool.description);
  const currentUrl = window.location.origin + "/" + category.id + "/" + tool.id;
  document.getElementById("canonical-url").setAttribute("href", currentUrl);
  document.getElementById("og-title").setAttribute("content", `${tool.name} — OUSO`);
  document.getElementById("og-desc").setAttribute("content", tool.description);

  window.scrollTo({ top: 0, behavior: "smooth" });
  bindInternalLinks();
}

function toolBadge(status) {
  if (status === "working") return "";
  const icon = status === "api-ready" ? "icon-sparkle" : "icon-lock";
  return `<span class="tool-badge"><svg><use href="assets/icons/icons.svg#${icon}"></use></svg>Coming soon</span>`;
}

/* ---------------------------------------------------------
   INTERNALS ROUTING & CLICK INTERCEPTION
--------------------------------------------------------- */
function navigateTo(url) {
  history.pushState(null, "", url);
  handleRouting();
}

function bindInternalLinks() {
  document.querySelectorAll("[data-route-link]").forEach(link => {
    link.onclick = (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        navigateTo(href);
      }
    };
  });
}

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
      <a href="/${cat.id}" class="category-card" data-route-link>
        <span class="category-icon">${iconHtml}</span>
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
      </a>
    `;
  }).join("");

  bindInternalLinks();
}

/* Global Search */
function setupSearch() {
  const input = document.getElementById("global-search");
  if (!input) return;
  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;
    const found = OUSO_TOOLS.find(t => t.name.toLowerCase().includes(query));
    if (found) {
      navigateTo(`/${found.category}/${found.id}`);
      input.value = "";
    }
  });
}

/* Theme Toggle */
function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isDark = document.body.classList.toggle("dark-theme");
    toggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

/* Share Button */
function setupShare() {
  const shareBtn = document.getElementById("share-btn");
  if (!shareBtn) return;
  shareBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "OUSO", text: "Whatever You Need. It Starts Here.", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard: " + url);
    }
  });
}

/* PWA Prompt */
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

/* Mobile Navigation */
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

/* Modal */
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

/* Activity Counter */
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

/* Footer Year */
function setupFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}