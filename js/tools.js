// بيانات الأدوات والفئات مع خصائص SEO مستقلة لكل عنصر لمنع التكرار وضمان الفهرسة المستقلة
const ousoData = {
    categories: [
        {
            id: "productivity",
            name: "أدوات الإنتاجية",
            slug: "category/productivity",
            title: "أدوات الإنتاجية الرقمية - OUSO",
            description: "تصفح أفضل أدوات الإنتاجية الرقمية المصممة لتنظيم أعمالك، توفير وقتك، وزيادة كفاءتك اليومية عبر منصة OUSO."
        },
        {
            id: "development",
            name: "أدوات المطورين",
            slug: "category/development",
            title: "أدوات المطورين وبرمجيات الويب - OUSO",
            description: "مجموعة متكاملة من أدوات المطورين لتسهيل كتابة وفحص وتنسيق الأكواد البرمجية بكفاءة عالية."
        }
    ],
    tools: [
        {
            id: "tool-1",
            categoryId: "productivity",
            slug: "tools/text-formatter",
            name: "منسق النصوص الذكي",
            seoTitle: "منسق النصوص الذكي وتنقيح المقالات - OUSO",
            description: "أداة سريعة لتنسيق النصوص، إزالة المسافات الزائدة، وتحسين صياغة المقالات والتدوين للشركات وصناع المحتوى.",
            ogTitle: "منسق النصوص الذكي وتنقيح المقالات",
            ogDescription: "حسن نصوصك ومقالاتك بضغطة زر واحدة عبر أداة تنسيق النصوص الذكية من OUSO."
        },
        {
            id: "tool-2",
            categoryId: "development",
            slug: "tools/json-validator",
            name: "فاحص ومصحح ملفات JSON",
            seoTitle: "فاحص وتصحيح ملفات JSON أونلاين - OUSO",
            description: "تأكد من صحة وهيكلة بيانات JSON البرمجية واكتشاف الأخطاء الإملائية والتركيبية لحظياً.",
            ogTitle: "فاحص وتصحيح ملفات JSON أونلاين",
            ogDescription: "أداة مطورين لا غنى عنها لفحص وتنسيق ملفات JSON بدقة وسرعة عالية."
        }
    ]
};