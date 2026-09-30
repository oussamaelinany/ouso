/**
 * OUSO Platform - Client-Side Router & Core Controller
 * Supports Clean URL Routing (/category, /category/tool), History API, Dynamic Renders, and PWA.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM ELEMENTS CACHE ---
  const splashScreen = document.getElementById("splash-screen");
  const globalSearchInput = document.getElementById("globalSearchInput");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const languageSelect = document.getElementById("languageSelect");
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettingsModal = document.getElementById("closeSettingsModal");
  const modalThemeSelect = document.getElementById("modalThemeSelect");
  const modalLangSelect = document.getElementById("modalLangSelect");
  const shareBtn = document.getElementById("shareBtn");
  const pwaBanner = document.getElementById("pwaBanner");
  const pwaInstallBtn = document.getElementById("pwaInstallBtn");
  const pwaDismissBtn = document.getElementById("pwaDismissBtn");
  const footerSettingsLink = document.getElementById("footerSettingsLink");

  // --- 2. INITIALIZATION & SPLASH SCREEN ---
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.classList.add("fade-out");
      setTimeout(() => splashScreen.remove(), 400);
    }
  }, 600);

  // --- 3. THEME MANAGEMENT ---
  const savedTheme = localStorage.getItem("ouso_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (modalThemeSelect) modalThemeSelect.value = savedTheme;

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("ouso_theme", newTheme);
    if (modalThemeSelect) modalThemeSelect.value = newTheme;
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (modalThemeSelect) {
    modalThemeSelect.addEventListener("change", (e) => {
      const newTheme = e.target.value;
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("ouso_theme", newTheme);
    });
  }

  // --- 4. SETTINGS MODAL ---
  function openSettings() {
    if (settingsModal) settingsModal.style.display = "flex";
  }
  function closeSettings() {
    if (settingsModal) settingsModal.style.display = "none";
  }

  if (settingsBtn) settingsBtn.addEventListener("click", openSettings);
  if (footerSettingsLink) {
    footerSettingsLink.addEventListener("click", (e) => {
      e.preventDefault();
      openSettings();
    });
  }
  if (closeSettingsModal) closeSettingsModal.addEventListener("click", closeSettings);
  if (settingsModal) {
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) closeSettings();
    });
  }

  // --- 5. SHARE FUNCTIONALITY ---
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "OUSO Platform",
        text: "Whatever You Need. It Starts Here. Discover powerful browser tools.",
        url: window.location.origin
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log("Share canceled or failed", err);
        }
      } else {
        navigator.clipboard.writeText(window.location.origin);
        alert("Platform link copied to clipboard!");
      }
    });
  }

  // --- 6. PWA INSTALL HANDLER ---
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner) pwaBanner.style.display = "block";
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          console.log("PWA installed");
        }
        deferredPrompt = null;
      }
      if (pwaBanner) pwaBanner.style.display = "none";
    });
  }

  if (pwaDismissBtn) {
    pwaDismissBtn.addEventListener("click", () => {
      if (pwaBanner) pwaBanner.style.display = "none";
    });
  }

  // --- 7. ROUTING & PAGE BUILDER ENGINE ---
  
  // Dynamic Content Container Generator (Injects main view dynamically if route changes)
  function ensureMainContainer() {
    let mainEl = document.querySelector("main.site-main");
    if (!mainEl) {
      mainEl = document.createElement("main");
      mainEl.className = "site-main";
      const header = document.querySelector("site-header") || document.querySelector("header");
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(mainEl, header.nextSibling);
      } else {
        document.body.appendChild(mainEl);
      }
    }
    return mainEl;
  }

  // Render Home Page View
  function renderHomeView() {
    const mainEl = ensureMainContainer();
    mainEl.innerHTML = `
      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-badge">Professional Web Suite</span>
          <h1>Whatever You Need.<br>It Starts Here.</h1>
          <p>Explore a comprehensive collection of lightning-fast, secure browser utilities, image converters, PDF tools, and developer helpers.</p>
          <div class="hero-actions">
            <a href="#categories" class="btn btn-primary" id="exploreBtn">Explore Categories</a>
            <a href="/tools/calculator" class="btn btn-secondary spa-link">Try Calculator</a>
          </div>
        </div>
      </section>

      <section id="categories" class="categories-section">
        <div class="section-header">
          <h2>Platform Categories</h2>
          <p>Select a category to access standalone tools and utilities</p>
        </div>
        <div id="categoriesGrid" class="categories-grid"></div>
      </section>

      <div class="ad-container ad-slot-middle">
        <div class="ad-placeholder">Advertisement Space</div>
      </div>

      <section class="featured-tools-section">
        <div class="section-header">
          <h2>Featured Utilities</h2>
          <p>Most popular tools ready to use instantly in your browser</p>
        </div>
        <div id="featuredToolsGrid" class="featured-tools-grid"></div>
      </section>

      <section class="about-ouso-section">
        <div class="about-card">
          <h2>About OUSO Platform</h2>
          <p>OUSO is engineered to deliver fast, secure, and client-side processing for everyday digital tasks. From image compression and PDF manipulation to developer utilities and calculators, all operations run directly within your browser to guarantee maximum privacy and zero data leakage.</p>
        </div>
      </section>

      <section id="faq" class="faq-section">
        <div class="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Got questions about OUSO? Find answers below.</p>
        </div>
        <div class="faq-accordion">
          <div class="faq-item">
            <h3>Are my uploaded files and data secure?</h3>
            <p>Yes. All image processing, PDF conversions, and utility calculations take place entirely within your browser client-side. Your files never leave your device.</p>
          </div>
          <div class="faq-item">
            <h3>Do I need to install any software or plugins?</h3>
            <p>No installation is required. OUSO is a modern web platform accessible directly from any desktop or mobile browser.</p>
          </div>
          <div class="faq-item">
            <h3>Is OUSO free to use?</h3>
            <p>All core utilities and tools on OUSO are completely free to use without mandatory subscriptions.</p>
          </div>
        </div>
      </section>
    `;

    // Populate Categories Grid
    const catGrid = document.getElementById("categoriesGrid");
    if (catGrid && typeof OUSO_CATEGORIES !== "undefined") {
      catGrid.innerHTML = OUSO_CATEGORIES.map(cat => `
        <a href="/${cat.slug}" class="category-card spa-link">
          <div>
            <h3>${cat.name}</h3>
            <p>${cat.description}</p>
          </div>
          <span class="status-badge working">Explore Tools &rarr;</span>
        </a>
      `).join("");
    }

    // Populate Featured Tools Grid
    const featGrid = document.getElementById("featuredToolsGrid");
    if (featGrid && typeof OUSO_TOOLS !== "undefined") {
      const featured = OUSO_TOOLS.filter(t => t.status === "working").slice(0, 8);
      featGrid.innerHTML = featured.map(tool => `
        <a href="${tool.route}" class="tool-card spa-link">
          <div>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
          </div>
          <span class="status-badge ${tool.status}">${tool.status.toUpperCase()}</span>
        </a>
      `).join("");
    }

    // Smooth scroll for explore button
    const exploreBtn = document.getElementById("exploreBtn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
      });
    }

    bindSpaLinks();
  }

  // Render Category Page View
  function renderCategoryView(categorySlug) {
    const category = OUSO_CATEGORIES.find(c => c.slug === categorySlug);
    const mainEl = ensureMainContainer();

    if (!category) {
      render404View();
      return;
    }

    const toolsInCategory = OUSO_TOOLS.filter(t => t.category === category.slug);

    mainEl.innerHTML = `
      <div class="breadcrumb-nav" style="margin-bottom: 1.5rem;">
        <a href="/" class="spa-link" style="color: var(--accent-blue); text-decoration: none;">Home</a> / <span style="color: var(--text-secondary);">${category.name}</span>
      </div>

      <section class="hero-section" style="padding: 2.5rem 1rem; margin-bottom: 2rem;">
        <div class="hero-content">
          <h1>${category.name}</h1>
          <p>${category.description}</p>
        </div>
      </section>

      <section class="categories-section">
        <div class="section-header">
          <h2>Available ${category.name} Utilities</h2>
          <p>Select any tool below to launch it instantly</p>
        </div>
        <div class="categories-grid">
          ${toolsInCategory.map(tool => `
            <a href="${tool.route}" class="tool-card spa-link">
              <div>
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
              </div>
              <span class="status-badge ${tool.status}">${tool.status.toUpperCase()}</span>
            </a>
          `).join("")}
        </div>
      </section>
    `;

    bindSpaLinks();
  }

  // Render Individual Tool Page View
  function renderToolView(categorySlug, toolSlug) {
    const tool = OUSO_TOOLS.find(t => t.category === categorySlug && t.slug === toolSlug);
    const mainEl = ensureMainContainer();

    if (!tool) {
      render404View();
      return;
    }

    const category = OUSO_CATEGORIES.find(c => c.slug === categorySlug);
    const categoryName = category ? category.name : categorySlug;

    if (tool.status === "maintenance") {
      mainEl.innerHTML = `
        <div class="breadcrumb-nav" style="margin-bottom: 1.5rem;">
          <a href="/" class="spa-link" style="color: var(--accent-blue); text-decoration: none;">Home</a> / 
          <a href="/${categorySlug}" class="spa-link" style="color: var(--accent-blue); text-decoration: none;">${categoryName}</a> / 
          <span style="color: var(--text-secondary);">${tool.name}</span>
        </div>
        <div class="hero-section" style="text-align: center; padding: 4rem 1rem;">
          <div class="hero-content">
            <span class="status-badge maintenance" style="margin-bottom: 1rem; font-size: 0.9rem; padding: 0.5rem 1rem;">COMING SOON / MAINTENANCE</span>
            <h1>${tool.name}</h1>
            <p>${tool.description}</p>
            <p style="margin-top: 1.5rem; color: var(--text-muted);">This tool is currently undergoing scheduled maintenance or enhancement. Check back soon!</p>
            <div style="margin-top: 2rem;">
              <a href="/${categorySlug}" class="btn btn-secondary spa-link">&larr; Back to ${categoryName}</a>
            </div>
          </div>
        </div>
      `;
      bindSpaLinks();
      return;
    }

    // Working Tool Render
    mainEl.innerHTML = `
      <div class="breadcrumb-nav" style="margin-bottom: 1.5rem;">
        <a href="/" class="spa-link" style="color: var(--accent-blue); text-decoration: none;">Home</a> / 
        <a href="/${categorySlug}" class="spa-link" style="color: var(--accent-blue); text-decoration: none;">${categoryName}</a> / 
        <span style="color: var(--text-secondary);">${tool.name}</span>
      </div>

      <div class="tool-header-section" style="margin-bottom: 2rem;">
        <h1>${tool.name}</h1>
        <p style="color: var(--text-secondary);">${tool.description}</p>
      </div>

      <div id="toolWorkspace" class="tool-workspace-container" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; min-height: 350px;">
        <!-- Tool renderer injects UI here -->
      </div>

      <div style="margin-top: 2rem;">
        <a href="/${categorySlug}" class="btn btn-secondary spa-link">&larr; Back to ${categoryName}</a>
      </div>
    `;

    // Execute Renderer if available
    const workspace = document.getElementById("toolWorkspace");
    if (tool.renderer && typeof window[tool.renderer] === "function") {
      try {
        window[tool.renderer](workspace);
      } catch (err) {
        console.error("Error rendering tool:", err);
        workspace.innerHTML = `<p style="color: var(--danger);">Error loading tool interface. Please try again later.</p>`;
      }
    } else {
      workspace.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <h3>Interactive Interface Ready</h3>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">The tool interface is initializing...</p>
        </div>
      `;
    }

    bindSpaLinks();
  }

  // Render 404 Not Found View
  function render404View() {
    const mainEl = ensureMainContainer();
    mainEl.innerHTML = `
      <div class="hero-section" style="text-align: center; padding: 5rem 1rem;">
        <div class="hero-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page or tool you are looking for does not exist or has been relocated.</p>
          <div style="margin-top: 2rem;">
            <a href="/" class="btn btn-primary spa-link">Return to Home</a>
          </div>
        </div>
      </div>
    `;
    bindSpaLinks();
  }

  // --- 8. ROUTER DISPATCHER ---
  function router() {
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      document.title = "OUSO - Whatever You Need. It Starts Here.";
      renderHomeView();
    } else if (segments.length === 1) {
      const categorySlug = segments[0];
      const category = OUSO_CATEGORIES.find(c => c.slug === categorySlug);
      if (category) {
        document.title = `${category.name} - OUSO`;
        renderCategoryView(categorySlug);
      } else {
        document.title = "Page Not Found - OUSO";
        render404View();
      }
    } else if (segments.length === 2) {
      const [categorySlug, toolSlug] = segments;
      const tool = OUSO_TOOLS.find(t => t.category === categorySlug && t.slug === toolSlug);
      if (tool) {
        document.title = tool.seo ? tool.seo.title : `${tool.name} - OUSO`;
        renderToolView(categorySlug, toolSlug);
      } else {
        document.title = "Tool Not Found - OUSO";
        render404View();
      }
    } else {
      document.title = "Page Not Found - OUSO";
      render404View();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- 9. SPA LINK INTERCEPTION ---
  function bindSpaLinks() {
    document.querySelectorAll("a.spa-link, .header-nav a, .footer-col a, .category-card, .tool-card").forEach(link => {
      // Avoid binding external or anchor links
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || link.getAttribute("target") === "_blank") {
        return;
      }
      
      // Ensure we don't bind twice
      link.removeEventListener("click", handleSpaClick);
      link.addEventListener("click", handleSpaClick);
    });
  }

  function handleSpaClick(e) {
    const href = this.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) return;

    e.preventDefault();
    window.history.pushState({}, "", href);
    router();
  }

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    router();
  });

  // --- 10. SEARCH AUTOCOMPLETE / REDIRECT INTEGRATION ---
  if (globalSearchInput && typeof OUSO_TOOLS !== "undefined") {
    globalSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = globalSearchInput.value.trim().toLowerCase();
        if (!query) return;

        const matchedTool = OUSO_TOOLS.find(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));
        if (matchedTool) {
          window.history.pushState({}, "", matchedTool.route);
          globalSearchInput.value = "";
          router();
        } else {
          alert("No matching tools found.");
        }
      }
    });
  }

  // Initial Router Run on Page Load
  router();
});
