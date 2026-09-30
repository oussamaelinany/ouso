let currentLang = localStorage.getItem("ouso_lang") || "en";
let currentTheme = localStorage.getItem("ouso_theme") || "light";

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(currentTheme);
    initRouter();
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileMenu();
        }
    });
});

function initRouter() {
    handleRoute();
    window.addEventListener("popstate", handleRoute);
}

function setLanguage(lang) {
    if (typeof translations !== "undefined" && translations[lang]) {
        currentLang = lang;
        localStorage.setItem("ouso_lang", lang);
        handleRoute();
    }
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem("ouso_theme", theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

function t(section, key) {
    if (typeof translations !== "undefined" && translations[currentLang] && translations[currentLang][section] && translations[currentLang][section][key]) {
        return translations[currentLang][section][key];
    }
    return translations?.["en"]?.[section]?.[key] || key;
}

function handleRoute() {
    const path = window.location.pathname;
    
    const langData = (typeof translations !== "undefined" && translations[currentLang]) ? translations[currentLang] : { dir: "ltr" };
    document.documentElement.setAttribute("lang", currentLang);
    document.documentElement.setAttribute("dir", langData.dir || "ltr");

    renderNavbar(path);
    closeMobileMenu();

    if (path.startsWith("/tools/")) {
        const toolSlug = path.split("/")[2];
        const tool = ousoData.tools.find(t => t.slug.endsWith(toolSlug));
        if (tool) {
            renderToolPage(tool);
            renderFooterWithAd();
            return;
        }
    } else if (path.startsWith("/category/")) {
        const catSlug = path.split("/")[2];
        const category = ousoData.categories.find(c => c.slug.endsWith(catSlug));
        if (category) {
            renderCategoryPage(category);
            renderFooterWithAd();
            return;
        }
    } else if (path.startsWith("/settings")) {
        renderSettingsPage();
        renderFooterWithAd();
        return;
    } else if (path.startsWith("/faq")) {
        renderFaqPage();
        renderFooterWithAd();
        return;
    }
    
    renderHomePage();
    renderFooterWithAd();
}

function navigateTo(path, event) {
    if (event) event.preventDefault();
    history.pushState({}, "", path);
    handleRoute();
}

function toggleMobileMenu() {
    const navLinks = document.getElementById("nav-links-container");
    if (navLinks) {
        navLinks.classList.toggle("open");
    }
}

function closeMobileMenu() {
    const navLinks = document.getElementById("nav-links-container");
    if (navLinks) {
        navLinks.classList.remove("open");
    }
}

function triggerShare() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    }
}

function renderNavbar(currentPath) {
    let headerContainer = document.getElementById("main-header");
    if (!headerContainer) {
        headerContainer = document.createElement("header");
        headerContainer.id = "main-header";
        headerContainer.className = "site-header";
        document.body.prepend(headerContainer);
    }
    
    // SVG Icons القياسية بدون استخدام أي Emojis
    const icons = {
        home: `<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
        categories: `<svg viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>`,
        search: `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
        faq: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.03-.42 1.98-1.03 2.75z"/></svg>`,
        share: `<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
        menu: `<svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`
    };

    headerContainer.innerHTML = `
        <nav class="nav-container" aria-label="Main Navigation">
            <div class="logo-container">
                <a href="/" onclick="navigateTo('/', event)">OUSO</a>
            </div>
            
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Toggle navigation menu">
                ${icons.menu}
            </button>

            <div class="nav-links" id="nav-links-container">
                <a href="/" class="nav-link ${currentPath === '/' ? 'active' : ''}" onclick="navigateTo('/', event)">
                    ${icons.home} <span id="nav-home"></span>
                </a>
                <a href="/category/productivity" class="nav-link ${currentPath.startsWith('/category') ? 'active' : ''}" onclick="navigateTo('/category/productivity', event)">
                    ${icons.categories} <span id="nav-categories"></span>
                </a>
                <a href="/faq" class="nav-link ${currentPath === '/faq' ? 'active' : ''}" onclick="navigateTo('/faq', event)">
                    ${icons.faq} <span id="nav-faq"></span>
                </a>
                <a href="#" class="nav-link" onclick="event.preventDefault(); triggerShare();">
                    ${icons.share} <span id="nav-share"></span>
                </a>
                <a href="/settings" class="nav-link ${currentPath === '/settings' ? 'active' : ''}" onclick="navigateTo('/settings', event)">
                    ${icons.settings} <span id="nav-settings"></span>
                </a>
            </div>
        </nav>
    `;
    
    // ربط النصوص بنظام الترجمة
    document.getElementById("nav-home").textContent = t("nav", "home");
    document.getElementById("nav-categories").textContent = t("nav", "categories") || "Categories";
    document.getElementById("nav-faq").textContent = t("nav", "faq") || "FAQ";
    document.getElementById("nav-share").textContent = t("nav", "share") || "Share";
    document.getElementById("nav-settings").textContent = t("nav", "settings");
}

function updateSEO(data) {
    if (data.title) document.title = data.title;
    if (data.description) {
        let metaDesc = document.querySelector("meta[name='description']");
        if (metaDesc) metaDesc.setAttribute("content", data.description);
    }
    if (data.canonical) {
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) canonicalLink.setAttribute("href", data.canonical);
    }
    if (data.ogTitle) {
        let ogTitle = document.querySelector("meta[property='og:title']");
        if (ogTitle) ogTitle.setAttribute("content", data.ogTitle);
    }
    if (data.ogDesc) {
        let ogDesc = document.querySelector("meta[property='og:description']");
        if (ogDesc) ogDesc.setAttribute("content", data.ogDesc);
    }
}

function renderFooterWithAd() {
    let footerContainer = document.getElementById("site-footer-container");
    if (!footerContainer) {
        footerContainer = document.createElement("footer");
        footerContainer.id = "site-footer-container";
        footerContainer.className = "site-footer";
        document.body.appendChild(footerContainer);
    }
    
    footerContainer.innerHTML = `
        <div class="ad-slot ad-slot-bottom" id="ad-footer"></div>
        <p>&copy; 2026 OUSO Platform. All rights reserved.</p>
    `;
}

function renderHomePage() {
    updateSEO({
        title: (translations && translations[currentLang]?.home?.welcome) || "OUSO Platform",
        description: (translations && translations[currentLang]?.home?.subtitle) || "Advanced digital tools.",
        canonical: "https://ouso.com/"
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem;">
                <div class="ad-slot ad-slot-top" id="ad-home-top"></div>
                <h1>${t("home", "welcome")}</h1>
                <p>${t("home", "subtitle")}</p>
                <div class="ad-slot ad-slot-middle" id="ad-home-middle"></div>
                <section class="categories-list"></section>
            </main>
        `;
    }
}

function renderSettingsPage() {
    updateSEO({
        title: `${t("settings", "title")} - OUSO`,
        description: "Manage your preferences, theme, and language settings on OUSO.",
        canonical: "https://ouso.com/settings"
    });

    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem; max-width: 600px; margin: 0 auto;">
                <div class="ad-slot ad-slot-top" id="ad-settings-top"></div>
                <h2>${t("settings", "title")}</h2>
                
                <div style="margin-top: 1.5rem; background: var(--nav-bg); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                    <div style="margin-bottom: 1.25rem;">
                        <label for="settings-theme-switcher" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Theme:</label>
                        <select id="settings-theme-switcher" onchange="setTheme(this.value)" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); width: 100%;">
                            <option value="light">Light Mode</option>
                            <option value="dark">Dark Mode</option>
                        </select>
                    </div>

                    <div>
                        <label for="settings-lang-switcher" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">${t("settings", "language")}:</label>
                        <select id="settings-lang-switcher" onchange="setLanguage(this.value)" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); width: 100%;">
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="pt">Português</option>
                        </select>
                    </div>
                </div>
            </main>
        `;
        document.getElementById("settings-lang-switcher").value = currentLang;
        document.getElementById("settings-theme-switcher").value = currentTheme;
    }
}

function renderFaqPage() {
    updateSEO({
        title: `FAQ - OUSO`,
        description: "Frequently asked questions about OUSO platform and tools.",
        canonical: "https://ouso.com/faq"
    });

    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem; max-width: 800px; margin: 0 auto;">
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to common questions about using OUSO digital tools and services.</p>
            </main>
        `;
    }
}

function renderCategoryPage(category) {
    const catData = (translations && translations[currentLang]?.categories?.[category.key]) || translations?.["en"]?.categories?.[category.key] || { name: category.id, description: "" };
    updateSEO({
        title: `${catData.name} - OUSO`,
        description: catData.description,
        canonical: `https://ouso.com/${category.slug}`
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem;" class="category-container">
                <div class="ad-slot ad-slot-top" id="ad-category-top"></div>
                <h2>${catData.name}</h2>
                <p>${catData.description}</p>
                <div class="ad-slot ad-slot-bottom" id="ad-category-bottom"></div>
            </main>
        `;
    }
}

function renderToolPage(tool) {
    const toolData = (translations && translations[currentLang]?.tools?.[tool.key]) || translations?.["en"]?.tools?.[tool.key] || { name: tool.id, description: "", seoTitle: tool.id };
    updateSEO({
        title: toolData.seoTitle,
        description: toolData.description,
        canonical: `https://ouso.com/${tool.slug}`
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem;" class="tool-container">
                <div class="ad-slot ad-slot-top" id="ad-tool-top"></div>
                <h1>${toolData.name}</h1>
                <p>${toolData.description}</p>
                <div id="tool-functional-area"></div>
                <div class="ad-slot ad-slot-middle" id="ad-tool-middle"></div>
                <div class="ad-slot ad-slot-bottom" id="ad-tool-bottom"></div>
            </main>
        `;
    }
}