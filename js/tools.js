// بيانات الأدوات والفئات مدعومة بالكلمات المفتاحية والـ Aliases لتفعيل البحث الشامل
const ousoData = {
    categories: [
        {
            id: "productivity",
            key: "productivity",
            slug: "category/productivity"
        },
        {
            id: "development",
            key: "development",
            slug: "category/development"
        }
    ],
    tools: [
        {
            id: "tool-1",
            categoryId: "productivity",
            key: "textFormatter",
            slug: "tools/text-formatter",
            keywords: ["text", "formatter", "format", "clean", "capitalize", "نصوص", "تنسيق"]
        },
        {
            id: "tool-2",
            categoryId: "development",
            key: "jsonValidator",
            slug: "tools/json-validator",
            keywords: ["json", "validator", "parser", "code", "lint", "برمجة", "فحص"]
        },
        {
            id: "tool-3",
            categoryId: "productivity",
            key: "imageCompressor",
            slug: "tools/image-compressor",
            keywords: ["compress", "image", "photo", "reduce", "size", "ضغط", "صور"]
        },
        {
            id: "tool-4",
            categoryId: "development",
            key: "calculatorTool",
            slug: "tools/calculator",
            keywords: ["calculator", "math", "calc", "حاسبة", "رياضيات"]
        }
    ]
};