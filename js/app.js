// إدارة مسارات الموقع وتحديث وسوم SEO ديناميكياً مع الحفاظ على وظائف التطبيق والتصميم الأصلي
document.addEventListener("DOMContentLoaded", () => {
    initRouter();
});

function initRouter() {
    handleRoute();
    window.addEventListener("popstate", handleRoute);
}

function handleRoute() {
    const path = window.location.pathname;
    
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
    }
    
    renderHomePage();
}

function updateSEO(data) {
    if (data.title) {
        document.title = data.title;
    }
    if (data.description) {
        let metaDesc = document.querySelector("meta[name='description']");
        if (metaDesc) {
            metaDesc.setAttribute("content", data.description);
        }
    }
    if (data.canonical) {
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", data.canonical);
        }
    }
    if (data.ogTitle) {
        let ogTitle = document.querySelector("meta[property='og:title']");
        if (ogTitle) {
            ogTitle.setAttribute("content", data.ogTitle);
        }
    }
    if (data.ogDesc) {
        let ogDesc = document.querySelector("meta[property='og:description']");
        if (ogDesc) {
            ogDesc.setAttribute("content", data.ogDesc);
        }
    }
}

function renderHomePage() {
    updateSEO({
        title: "منصة OUSO - أدوات رقمية متقدمة وخدمات ويب ذكية",
        description: "اكتشف مجموعة شاملة من الأدوات الرقمية وخدمات الويب الذكية وحلول الإنتاجية.",
        canonical: "https://ouso.com/",
        ogTitle: "منصة OUSO - أدوات رقمية متقدمة",
        ogDesc: "اكتشف مجموعة شاملة من الأدوات الرقمية وحلول الإنتاجية عبر منصة OUSO."
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <header>
                <h1>مرحباً بك في منصة OUSO</h1>
            </header>
            <main>
                <section class="categories-list">
                    <!-- يتم عرض الفئات هنا ديناميكياً -->
                </section>
            </main>
        `;
    }
}

function renderCategoryPage(category) {
    updateSEO({
        title: category.title,
        description: category.description,
        canonical: `https://ouso.com/${category.slug}`,
        ogTitle: category.title,
        ogDesc: category.description
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main class="category-container">
                <h2>${category.name}</h2>
                <p>${category.description}</p>
            </main>
        `;
    }
}

function renderToolPage(tool) {
    updateSEO({
        title: tool.seoTitle,
        description: tool.description,
        canonical: `https://ouso.com/${tool.slug}`,
        ogTitle: tool.ogTitle,
        ogDesc: tool.ogDescription
    });
    
    const appContainer = document.getElementById("app");
    if (appContainer) {
        appContainer.innerHTML = `
            <main class="tool-container">
                <h1>${tool.name}</h1>
                <p>${tool.description}</p>
                <div id="tool-functional-area">
                    <!-- مساحة عمل الأداة الأساسية دون المساس بوظائفها -->
                </div>
            </main>
        `;
    }
}