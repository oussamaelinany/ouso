/*
  OUSO — APP.JS (Individual Tool Pages, Dynamic Routing & Legal AdSense Pages)
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

/* Splash Screen Logic */
function setupSplash() {
  const splash = document.getElementById("splash-screen");
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 400);
  }, 1000);
}

/* ---------------------------------------------------------
   STATIC / LEGAL PAGES DICTIONARY (AdSense & Compliance)
--------------------------------------------------------- */
const OUSO_STATIC_PAGES = {
  "privacy": {
    title: "Privacy Policy — OUSO",
    heading: "Privacy Policy",
    subtitle: "Last updated: September 2026",
    content: `
      <h3>1. Information We Process</h3>
      <p>At OUSO, we prioritize your privacy. Most of our tools (such as image compressors, resizers, PDF mergers, and code utilities) run <strong>entirely client-side</strong> inside your web browser using JavaScript and WebAssembly. Your files, documents, and personal text inputs are processed locally on your device and are <strong>never uploaded, stored, or transmitted</strong> to our servers.</p>
      
      <h3>2. Local Storage and Cookies</h3>
      <p>We may use local storage or standard browser mechanisms solely to remember your preferences (such as Dark/Light mode settings or PWA installation prompts). We do not track you across other websites or build invasive personal profiles.</p>
      
      <h3>3. Advertising & Third-Party Providers</h3>
      <p>To keep OUSO free, we display advertisements via trusted third-party networks, including Google AdSense and programmatic ad partners. These providers may use cookies or web beacons to serve ads based on your prior visits to this website or other sites on the internet. You can manage your ad personalization settings through your browser or Google account settings.</p>
      
      <h3>4. User Rights & Data Control</h3>
      <p>Because we do not collect or store personal files or identification data on our servers, you retain absolute control over your data locally on your device at all times.</p>
      
      <h3>5. Contact Us</h3>
      <p>If you have any questions regarding this Privacy Policy, please reach out via our <a href="/legal/contact" data-route-link>Contact Page</a>.</p>
    `
  },
  "terms": {
    title: "Terms of Service — OUSO",
    heading: "Terms of Service",
    subtitle: "Please read these terms carefully before using OUSO.",
    content: `
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using OUSO (ouso.ouso.workers.dev), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our web tools.</p>
      
      <h3>2. Free Use and As-Is Provision</h3>
      <p>All tools and utilities provided on OUSO are offered completely free of charge on an "as-is" and "as-available" basis without warranties of any kind, either express or implied.</p>
      
      <h3>3. User Responsibilities</h3>
      <p>You agree to use OUSO solely for lawful purposes. Since most tools operate locally in your browser, you are entirely responsible for the data, images, and documents you process, download, or share.</p>
      
      <h3>4. Intellectual Property</h3>
      <p>The OUSO name, logo, branding, layout, and original code structure are protected by intellectual property guidelines. Unauthorized reproduction or commercial redistribution of the platform code is strictly prohibited.</p>
    `
  },
  "about": {
    title: "About OUSO — Whatever You Need. It Starts Here.",
    heading: "About OUSO",
    subtitle: "A powerful suite of browser tools designed for speed, privacy, and simplicity.",
    content: `
      <h3>Our Mission</h3>
      <p>OUSO was created with a clear vision: to provide a centralized, lightning-fast, and secure platform of everyday web utilities for creators, professionals, students, and developers worldwide.</p>
      
      <h3>Client-Side Privacy Focus</h3>
      <p>We believe that utility tools should respect user privacy. By leveraging modern web technologies, OUSO executes heavy file processing and conversions directly inside your browser window, eliminating unnecessary cloud uploads and server delays.</p>
      
      <h3>Continuous Innovation</h3>
      <p>We continuously optimize our performance, expand our toolsets, and refine our user interface to deliver a seamless experience across desktop and mobile devices.</p>
    `
  },
  "contact": {
    title: "Contact Us — OUSO",
    heading: "Contact Us",
    subtitle: "We would love to hear from you. Get in touch with our team.",
    content: `
      <h3>Get in Touch</h3>
      <p>Whether you have a suggestion, found a bug, or want to inquire about partnership opportunities, feel free to contact us.</p>
      
      <div style="background: var(--c-white); border: 1px solid var(--c-line-soft); border-radius: var(--radius-m); padding: 24px; margin-top: 20px;">
        <h4 style="margin-bottom: 8px; font-family: var(--f-body); font-weight: 700;">Official Support Email</h4>
        <p style="margin-bottom: 16px; color: rgba(11,11,12,0.7);">For general inquiries, copyright notices, or technical support:</p>
        <div style="font-weight: 600; color: var(--c-gold); font-size: 1.05rem;">support@ouso.workers.dev <span style="font-size: 0.8rem; color: rgba(11,11,12,0.4); font-weight: normal; display: block; margin-top: 4px;">(Replace with your active administrative email address)</span></div>
      </div>
    `
  },
  "disclaimer": {
    title: "Disclaimer — OUSO",
    heading: "Disclaimer",
    subtitle: "Important information regarding tool accuracy and external services.",
    content: `
      <h3>1. Tool Accuracy and Output</h3>
      <p>While OUSO strives to provide high-precision browser utilities, image processors, and format converters, we do not guarantee that outputs will be 100% error-free or suitable for every specialized professional requirement. Users should verify their generated files and documents independently.</p>
      
      <h3>2. External Links and Third-Party Services</h3>
      <p>Our platform may contain links to external websites or display third-party advertisements (such as Google AdSense). We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
      
      <h3>3. Limitation of Liability</h3>
      <p>Under no circumstances shall OUSO or its developer be held liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use our web tools or services.</p>
    `
  }
};

/* ---------------------------------------------------------
   ROUTING ENGINE (Direct URL, Refresh, Back/Forward support)
--------------------------------------------------------- */
function handleRouting() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const segments = path.split("/").filter(Boolean);

  // Home route: "/" or empty
  if (segments.length === 0) {
    resetToolViewVisibility();
    renderHomeView();
    return;
  }

  // Legal / Static Pages route: "/legal/privacy", "/legal/terms", etc.
  if (segments.length === 2 && segments[0] === "legal") {
    resetToolViewVisibility();
    renderStaticPageView(segments[1]);
    return;
  }

  // Category route: "/images", "/videos", "/pdf", "/tools", "/gaming", "/ai-content"
  if (segments.length === 1) {
    resetToolViewVisibility();
    const catId = segments[0];
    const category = OUSO_CATEGORIES.find(c => c.id === catId);
    if (category) {
      renderCategoryView(category);
      return;
    }
  }

  // Individual Tool route: "/images/compressor", "/gaming/breakout-game", etc.
  if (segments.length === 2) {
    resetToolViewVisibility();
    const catId = segments[0];
    const toolId = segments[1];
    const tool = OUSO_TOOLS.find(t => t.id === toolId && t.category === catId);
    if (tool) {
      renderToolPageView(tool);
      return;
    }
  }

  // Fallback: Home
  renderHomeView();
}

function resetToolViewVisibility() {
  const seoContent = document.getElementById("tool-seo-content");
  const relatedSec = document.querySelector(".related-tools-section");
  const catBack = document.getElementById("tool-back-cat");
  if (seoContent) seoContent.style.display = "grid";
  if (relatedSec) relatedSec.style.display = "block";
  if (catBack) catBack.style.display = "inline-flex";
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

function renderStaticPageView(pageKey) {
  hideAllViews();
  document.getElementById("hero-section").style.display = "none";
  
  let toolView = document.getElementById("view-tool");
  toolView.hidden = false;

  const pageData = OUSO_STATIC_PAGES[pageKey];
  if (!pageData) {
    renderHomeView();
    return;
  }

  // Breadcrumb
  const breadcrumb = document.getElementById("tool-breadcrumb");
  breadcrumb.innerHTML = `
    <a href="/" data-route-link>Home</a>
    <span class="breadcrumb-sep">→</span>
    <span class="breadcrumb-current">${pageData.heading}</span>
  `;

  // Back Links
  document.getElementById("tool-back-home").onclick = (e) => { e.preventDefault(); navigateTo("/"); };
  document.getElementById("tool-back-cat").style.display = "none";

  // Header Info
  document.getElementById("tool-page-icon").innerHTML = `
    <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  `;
  document.getElementById("tool-page-name").textContent = pageData.heading;
  document.getElementById("tool-page-desc").textContent = pageData.subtitle;

  // Content Area
  const contentArea = document.getElementById("tool-page-content-area");
  contentArea.innerHTML = `
    <div style="background: var(--c-white); border: 1px solid var(--c-line-soft); border-radius: var(--radius-l); padding: 36px 30px; margin: 20px 0; font-size: 0.96rem; line-height: 1.7; color: rgba(11,11,12,0.85);">
      ${pageData.content}
      
      <!-- Language Translation Placeholder -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--c-line-soft); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <span style="font-size: 0.85rem; color: rgba(11,11,12,0.5);">Language: English (More translations coming soon)</span>
        <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem;" onclick="alert('Additional language packs will be available soon.')">Translate Page</button>
      </div>
    </div>
  `;

  // Hide SEO Card blocks & Related tools for static legal pages
  document.getElementById("tool-seo-content").style.display = "none";
  document.querySelector(".related-tools-section").style.display = "none";

  // Update SEO Metadata
  document.getElementById("page-title").textContent = pageData.title;
  document.getElementById("meta-desc").setAttribute("content", pageData.subtitle);
  const currentUrl = window.location.origin + "/legal/" + pageKey;
  document.getElementById("canonical-url").setAttribute("href", currentUrl);
  document.getElementById("og-title").setAttribute("content", pageData.title);
  document.getElementById("og-desc").setAttribute("content", pageData.subtitle);

  window.scrollTo({ top: 0, behavior: "smooth" });
  bindInternalLinks();
}

function renderToolPageView(tool) {
  hideAllViews();
  document.getElementById("hero-section").style.display = "none";
  document.getElementById("view-tool").hidden = false;

  const category = OUSO_CATEGORIES.find(c => c.id === tool.category) || { id: tool.category, name: tool.category };

  // Breadcrumb
  const breadcrumb = document.getElementById("tool-breadcrumb");
  breadcrumb.innerHTML = `
    <a href="/" data-route-link>Home</a>
    <span class="breadcrumb-sep">→</span>
    <a href="/${category.id}" data-route-link>${category.name}</a>
    <span class="breadcrumb-sep">→</span>
    <span class="breadcrumb-current">${tool.name}</span>
  `;

  // Back Links
  document.getElementById("tool-back-home").onclick = (e) => { e.preventDefault(); navigateTo("/"); };
  document.getElementById("tool-back-cat").onclick = (e) => { e.preventDefault(); navigateTo("/" + category.id); };

  // Tool Header Info
  document.getElementById("tool-page-icon").innerHTML =
    `<svg width="28" height="28"><use href="assets/icons/icons.svg#${tool.icon}"></use></svg>`;
  document.getElementById("tool-page-name").textContent = tool.name;
  document.getElementById("tool-page-desc").textContent = tool.description;

  // Content Area
  const contentArea = document.getElementById("tool-page-content-area");
  contentArea.innerHTML = "";

  if (tool.status === "working" && typeof TOOL_RENDERERS !== "undefined" && TOOL_RENDERERS[tool.id]) {
    TOOL_RENDERERS[tool.id](contentArea);
  } else {
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

  // SEO Content Blocks
  document.querySelectorAll(".seo-tool-name-ref").forEach(el => el.textContent = tool.name);
  document.getElementById("seo-how-to-text").textContent = `Follow these simple steps to utilize ${tool.name} instantly and securely in your browser without any server uploads or registration.`;
  document.getElementById("seo-faq-q").textContent = `Is ${tool.name} free to use?`;
  document.getElementById("seo-faq-a").textContent = `Yes, ${tool.name} is completely free and runs securely client-side.`;

  // Related Tools
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

  // SEO Metadata
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

/* Navigation & Interception */
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