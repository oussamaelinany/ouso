// إدارة اللغات ونظام التوجيه والـ SEO بشكل متكامل
let currentLang = localStorage.getItem("ouso_lang") || "en";

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
});

function initRouter() {
    handleRoute();
    window.addEventListener("popstate", handleRoute);
}

function setLanguage(lang) {
    if (translations && translations[lang]) {
        currentLang = lang;
        localStorage.setItem("ouso_lang", lang);
        handleRoute();
    }
}

function t(section, key) {
    if (typeof translations !== "undefined" && translations[currentLang] && translations[currentLang][section] && translations[currentLang][section][key]) {
        return translations[currentLang][section][key];
    }
    // Fallback إلى الإنجليزية إذا لم تتوفر الترجمة
    return translations?.["en"]?.[section]?.[key] || key;
}

function handleRoute() {
    const path = window.location.pathname;
    
    // ضبط اتجاه الصفحة والـ lang حسب اللغة المختارة
    const langData = (typeof translations !== "undefined" && translations[currentLang]) ? translations[currentLang] : { dir: "ltr" };
    document.documentElement.setAttribute("lang", currentLang);
    document.documentElement.setAttribute("dir", langData.dir || "ltr");

    // بناء قائمة التنقل العلوية مع محدد اللغات الحديث في Settings/Navigation
    renderNavbar();

    if (path.startsWith("/tools/")) {
        const toolSlug = path.split("/")[2];
        const tool = ousoData.tools.find(t => t.slug.endsWith(toolSlug));
        if (tool) {
            renderToolPage(tool);
            return;
        }
    } else if (path.startsWith("/category/")) {
        const catSlug = path.split("/")[2];
        const category = ousoData.categories.find(c => c.slug.endsWith(catSlug));
        if (category) {
            renderCategoryPage(category);
            return;
        }
    } else if (path.startsWith("/settings")) {
        renderSettingsPage();
        return;
    }
    
    renderHomePage();
}

function renderNavbar() {
    let navContainer = document.getElementById("main-nav");
    if (!navContainer) {
        const header = document.createElement("header");
        header.innerHTML = `
            <nav id="main-nav" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <div class="logo-container">
                    <a href="/" onclick="event.preventDefault(); history.pushState({}, '', '/'); handleRoute();" style="font-weight: bold; text-decoration: none; color: inherit;">OUSO</a>
                </div>
                <div class="nav-links" style="display: flex; gap: 1rem; align-items: center;">
                    <a href="/" onclick="event.preventDefault(); history.pushState({}, '', '/'); handleRoute();" id="nav-home"></a>
                    <a href="/settings" onclick="event.preventDefault(); history.pushState({}, '', '/settings'); handleRoute();" id="nav-settings"></a>
                    <div class="language-selector">
                        <select id="lang-switcher" onchange="setLanguage(this.value)" style="padding: 0.3rem; border-radius: 4px; border: 1px solid #cbd5e1;">
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="pt">Português</option>
                        </select>
                    </div>
                </div>
            </nav>
        `;
        document.body.prepend(header);
    }
    
    // تحديث نصوص الـ Navigation
    document.getElementById("nav-home").textContent = t("nav", "home");
    document.getElementById("nav-settings").textContent = t("nav", "settings");
    
    const switcher = document.getElementById("lang-switcher");
    if (switcher) switcher.value = currentLang;
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

function renderHomePage() {
    updateSEO({
        title: (translations && translations[currentLang]?.home?.welcome) || "OUSO Platform",
        description: (translations && translations[currentLang]?.home?.subtitle) || "Advanced digital tools.",
        canonical: "https://ouso.com/",
        ogTitle: translations?.[currentLang]?.home?.welcome,
        ogDesc: translations?.[currentLang]?.home?.subtitle
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem;">
                <h1>${t("home", "welcome")}</h1>
                <p>${t("home", "subtitle")}</p>
                <section class="categories-list">
                    <!-- عرض الفئات والأدوات -->
                </section>
            </main>
        `;
    }
}

function renderSettingsPage() {
    updateSEO({
        title: `${t("settings", "title")} - OUSO`,
        description: "Manage your preferences and language settings on OUSO.",
        canonical: "https://ouso.com/settings"
    });

    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem;">
                <h2>${t("settings", "title")}</h2>
                <div style="margin-top: 1rem;">
                    <label for="settings-lang-switcher" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">${t("settings", "language")}:</label>
                    <select id="settings-lang-switcher" onchange="setLanguage(this.value)" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #cbd5e1; width: 200px;">
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                        <option value="pt">Português</option>
                    </select>
                </div>
            </main>
        `;
        document.getElementById("settings-lang-switcher").value = currentLang;
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
                <h2>${catData.name}</h2>
                <p>${catData.description}</p>
            </main>
        `;
    }
}

function renderToolPage(tool) {
    const toolData = (translations && translations[currentLang]?.tools?.[tool.key]) || translations?.["en"]?.tools?.[tool.key] || { name: tool.id, description: "", seoTitle: tool.id };
    updateSEO({
        title: toolData.seoTitle,
        description: toolData.description,
        canonical: `https://ouso.com/${tool.slug}`,
        ogTitle: toolData.ogTitle,
        ogDesc: toolData.ogDescription
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main style="padding: 2rem;" class="tool-container">
                <h1>${toolData.name}</h1>
                <p>${toolData.description}</p>
                <div id="tool-functional-area">
                    <!-- مساحة عمل الأداة الأساسية دون المساس بوظائفها -->
                </div>
            </main>
        `;
    }
}