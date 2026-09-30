/**
 * OUSO Platform - Tools & Categories Registry (Expanded Architecture)
 * Designed for: Home -> Category -> Individual Tool Page routing & SEO
 */

const OUSO_CATEGORIES = [
  {
    id: "images",
    slug: "images",
    name: "Images",
    description: "Compress, resize, convert and edit images instantly in your browser.",
    icon: "🖼️"
  },
  {
    id: "pdf",
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge, split, convert, and manage your PDF documents securely.",
    icon: "📄"
  },
  {
    id: "videos",
    slug: "videos",
    name: "Videos",
    description: "Download, convert, and enhance your media files quickly.",
    icon: "🎬"
  },
  {
    id: "tools",
    slug: "tools",
    name: "Utilities",
    description: "Handy web utilities, text tools, converters, and minigames.",
    icon: "⚡"
  }
];

const OUSO_TOOLS = [
  // --- IMAGES CATEGORY ---
  {
    id: "compressor",
    slug: "compressor",
    category: "images",
    name: "Image Compressor",
    description: "Compress JPEG, PNG, and WebP images client-side without losing quality.",
    icon: "🗜️",
    status: "working",
    renderer: "renderImageCompressor",
    route: "/images/compressor",
    seo: {
      title: "Free Online Image Compressor - OUSO",
      description: "Compress JPEG, PNG, and WebP images instantly in your browser with zero quality loss."
    }
  },
  {
    id: "resizer",
    slug: "resizer",
    category: "images",
    name: "Image Resizer",
    description: "Resize images to custom pixel dimensions or scale percentages instantly.",
    icon: "📐",
    status: "working",
    renderer: "renderImageResizer",
    route: "/images/resizer",
    seo: {
      title: "Online Image Resizer - OUSO",
      description: "Easily resize your photos and images by width, height, or percentage right in your browser."
    }
  },
  {
    id: "converter",
    slug: "converter",
    category: "images",
    name: "Image Converter",
    description: "Convert images between PNG, JPEG, WebP, and BMP formats effortlessly.",
    icon: "🔄",
    status: "working",
    renderer: "renderImageConverter",
    route: "/images/converter",
    seo: {
      title: "Free Image Format Converter - OUSO",
      description: "Convert images between PNG, JPEG, WebP, and BMP instantly and securely."
    }
  },
  {
    id: "cropper",
    slug: "cropper",
    category: "images",
    name: "Image Cropper",
    description: "Crop photos to custom aspect ratios, circles, or specific pixel areas.",
    icon: "✂️",
    status: "working",
    renderer: "renderImageCropper",
    route: "/images/cropper",
    seo: {
      title: "Online Image Cropper - OUSO",
      description: "Crop your images and photos quickly with custom aspect ratios and precision."
    }
  },
  {
    id: "watermark",
    slug: "watermark",
    category: "images",
    name: "Watermark Maker",
    description: "Add text or image watermarks to protect your photos and artwork.",
    icon: "💧",
    status: "working",
    renderer: "renderImageWatermark",
    route: "/images/watermark",
    seo: {
      title: "Online Image Watermark Maker - OUSO",
      description: "Protect your photos with custom text or image watermarks directly in your browser."
    }
  },
  {
    id: "palette",
    slug: "palette",
    category: "images",
    name: "Color Palette Extractor",
    description: "Extract dominant color palettes and HEX codes from any uploaded image.",
    icon: "🎨",
    status: "working",
    renderer: "renderColorPalette",
    route: "/images/palette",
    seo: {
      title: "Color Palette Extractor from Image - OUSO",
      description: "Extract dominant HEX and RGB color palettes from any image instantly."
    }
  },
  {
    id: "filters",
    slug: "filters",
    category: "images",
    name: "Photo Filters & Effects",
    description: "Apply vintage, grayscale, sepia, blur, and brightness adjustments.",
    icon: "✨",
    status: "working",
    renderer: "renderPhotoFilters",
    route: "/images/filters",
    seo: {
      title: "Online Photo Filters and Effects - OUSO",
      description: "Apply professional photo filters, effects, and adjustments to your images online."
    }
  },
  {
    id: "meme",
    slug: "meme",
    category: "images",
    name: "Meme Generator",
    description: "Create funny custom memes with top and bottom impact text instantly.",
    icon: "🤪",
    status: "working",
    renderer: "renderMemeGenerator",
    route: "/images/meme",
    seo: {
      title: "Free Online Meme Generator - OUSO",
      description: "Create custom memes with top and bottom text easily in seconds."
    }
  },
  {
    id: "svg-pattern",
    slug: "svg-pattern",
    category: "images",
    name: "SVG Pattern Generator",
    description: "Generate geometric background patterns and export as SVG or PNG.",
    icon: "🔶",
    status: "working",
    renderer: "renderSvgPattern",
    route: "/images/svg-pattern",
    seo: {
      title: "SVG Pattern Background Generator - OUSO",
      description: "Create beautiful seamless SVG patterns for your web designs and backgrounds."
    }
  },
  {
    id: "svg-avatar",
    slug: "svg-avatar",
    category: "images",
    name: "Avatar & Identicon Maker",
    description: "Generate unique geometric identicons and SVG user avatars from text.",
    icon: "👤",
    status: "working",
    renderer: "renderSvgAvatar",
    route: "/images/svg-avatar",
    seo: {
      title: "Avatar and Identicon Maker - OUSO",
      description: "Generate unique geometric avatars and identicons from any text string."
    }
  },
  {
    id: "svg-badge",
    slug: "svg-badge",
    category: "images",
    name: "Badge & Shield Generator",
    description: "Create clean vector status badges and shields for GitHub or websites.",
    icon: "🛡️",
    status: "working",
    renderer: "renderSvgBadge",
    route: "/images/svg-badge",
    seo: {
      title: "SVG Badge and Shield Generator - OUSO",
      description: "Design clean vector badges and shields for READMEs and websites."
    }
  },
  {
    id: "svg-placeholder",
    slug: "svg-placeholder",
    category: "images",
    name: "Placeholder Image Creator",
    description: "Generate custom dimension placeholder graphics with text and colors.",
    icon: "🖼️",
    status: "working",
    renderer: "renderSvgPlaceholder",
    route: "/images/svg-placeholder",
    seo: {
      title: "Placeholder Image Creator - OUSO",
      description: "Generate custom placeholder images with specific dimensions, text, and colors."
    }
  },

  // --- PDF TOOLS CATEGORY ---
  {
    id: "pdf-merge",
    slug: "merge",
    category: "pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single organized document securely.",
    icon: "📚",
    status: "working",
    renderer: "renderPdfMerge",
    route: "/pdf/merge",
    seo: {
      title: "Merge PDF Files Online - OUSO",
      description: "Combine multiple PDF files into one secure document in your browser."
    }
  },
  {
    id: "pdf-split",
    slug: "split",
    category: "pdf",
    name: "Split PDF",
    description: "Extract specific pages or split a large PDF into individual files.",
    icon: "✂️️",
    status: "working",
    renderer: "renderPdfSplit",
    route: "/pdf/split",
    seo: {
      title: "Split PDF Pages Online - OUSO",
      description: "Extract pages or split your PDF documents into separate files effortlessly."
    }
  },
  {
    id: "pdf-compress",
    slug: "compress",
    category: "pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size by optimizing fonts, images, and internal structure.",
    icon: "📉",
    status: "working",
    renderer: "renderPdfCompress",
    route: "/pdf/compress",
    seo: {
      title: "Compress PDF File Size Online - OUSO",
      description: "Reduce the file size of your PDF documents quickly and securely."
    }
  },
  {
    id: "pdf-to-images",
    slug: "to-images",
    category: "pdf",
    name: "PDF to Images",
    description: "Convert every page of a PDF document into high-quality PNG or JPEG images.",
    icon: "🖼️",
    status: "working",
    renderer: "renderPdfToImages",
    route: "/pdf/to-images",
    seo: {
      title: "Convert PDF to Images Online - OUSO",
      description: "Extract and convert PDF pages into high-resolution PNG or JPEG images."
    }
  },
  {
    id: "images-to-pdf",
    slug: "images-to-pdf",
    category: "pdf",
    name: "Images to PDF",
    description: "Combine multiple JPEG or PNG images into a single professional PDF file.",
    icon: "📑",
    status: "working",
    renderer: "renderImagesToPdf",
    route: "/pdf/images-to-pdf",
    seo: {
      title: "Convert Images to PDF Online - OUSO",
      description: "Turn your JPG and PNG images into a single PDF document in seconds."
    }
  },
  {
    id: "pdf-watermark",
    slug: "watermark",
    category: "pdf",
    name: "Watermark PDF",
    description: "Stamp custom text watermarks across all pages of your PDF documents.",
    icon: " ©️",
    status: "working",
    renderer: "renderPdfWatermark",
    route: "/pdf/watermark",
    seo: {
      title: "Add Watermark to PDF Online - OUSO",
      description: "Stamp text watermarks across your PDF documents securely in your browser."
    }
  },
  {
    id: "pdf-rotate",
    slug: "rotate",
    category: "pdf",
    name: "Rotate PDF Pages",
    description: "Rotate landscape or portrait PDF pages by 90, 180, or 270 degrees.",
    icon: "🔄",
    status: "working",
    renderer: "renderPdfRotate",
    route: "/pdf/rotate",
    seo: {
      title: "Rotate PDF Pages Online - OUSO",
      description: "Easily rotate your PDF document pages to the correct orientation."
    }
  },
  {
    id: "pdf-page-numbers",
    slug: "page-numbers",
    category: "pdf",
    name: "Add Page Numbers",
    description: "Insert clean page numbers into headers or footers of PDF pages.",
    icon: "🔢",
    status: "working",
    renderer: "renderPdfPageNumbers",
    route: "/pdf/page-numbers",
    seo: {
      title: "Add Page Numbers to PDF - OUSO",
      description: "Insert custom page numbers into headers or footers of your PDF files."
    }
  },

  // --- VIDEOS CATEGORY ---
  {
    id: "video-downloader",
    slug: "downloader",
    category: "videos",
    name: "Video Downloader Helper",
    description: "Extract video direct links and generate download helper scripts.",
    icon: "📥",
    status: "working",
    renderer: "renderVideoDownloader",
    route: "/videos/downloader",
    seo: {
      title: "Video Downloader Helper - OUSO",
      description: "Extract direct video links and generate download helper scripts easily."
    }
  },
  {
    id: "video-trimmer",
    slug: "trimmer",
    category: "videos",
    name: "Video Trimmer / Cutter",
    description: "Trim video clips precisely using client-side HTML5 video controls.",
    icon: "✂️",
    status: "working",
    renderer: "renderVideoTrimmer",
    route: "/videos/trimmer",
    seo: {
      title: "Online Video Trimmer and Cutter - OUSO",
      description: "Trim and cut video clips directly in your browser with HTML5 controls."
    }
  },
  {
    id: "video-gif",
    slug: "gif-maker",
    category: "videos",
    name: "Video to GIF Converter",
    description: "Convert short video clips into animated looping GIF graphics.",
    icon: "🎞️",
    status: "working",
    renderer: "renderVideoGif",
    route: "/videos/gif-maker",
    seo: {
      title: "Video to GIF Converter Online - OUSO",
      description: "Convert short video clips into high-quality animated GIFs instantly."
    }
  },
  {
    id: "video-audio-extractor",
    slug: "audio-extractor",
    category: "videos",
    name: "Audio Extractor",
    description: "Extract audio tracks (MP3/WAV) from uploaded video files.",
    icon: "🎵",
    status: "working",
    renderer: "renderAudioExtractor",
    route: "/videos/audio-extractor",
    seo: {
      title: "Extract Audio from Video Online - OUSO",
      description: "Extract clean audio tracks and sound from video files in your browser."
    }
  },
  {
    id: "video-speed",
    slug: "speed-controller",
    category: "videos",
    name: "Video Speed Controller",
    description: "Adjust playback speed, create slow-motion or timelapse video previews.",
    icon: "⏩",
    status: "working",
    renderer: "renderVideoSpeed",
    route: "/videos/speed-controller",
    seo: {
      title: "Video Speed Controller Online - OUSO",
      description: "Adjust video playback speed for slow-motion or timelapse previews."
    }
  },
  {
    id: "video-subtitles",
    slug: "subtitle-editor",
    category: "videos",
    name: "Subtitle (.SRT) Formatter",
    description: "Clean, sync, and reformat SRT subtitle timestamp files.",
    icon: "💬",
    status: "working",
    renderer: "renderVideoSubtitles",
    route: "/videos/subtitle-editor",
    seo: {
      title: "Subtitle SRT Formatter and Editor - OUSO",
      description: "Clean, sync, and reformat SRT subtitle files for your videos easily."
    }
  },
  {
    id: "video-thumbnail",
    slug: "thumbnail-grabber",
    category: "videos",
    name: "Video Thumbnail Grabber",
    description: "Extract HD and 4K thumbnail frames from video files or URLs.",
    icon: "🖼️",
    status: "working",
    renderer: "renderVideoThumbnail",
    route: "/videos/thumbnail-grabber",
    seo: {
      title: "Video Thumbnail Grabber - OUSO",
      description: "Extract high-definition thumbnail frames from video files instantly."
    }
  },
  {
    id: "video-metadata",
    slug: "metadata-viewer",
    category: "videos",
    name: "Video Metadata Inspector",
    description: "Inspect codec, bitrate, framerate, resolution, and audio tracks.",
    icon: "🔍",
    status: "working",
    renderer: "renderVideoMetadata",
    route: "/videos/metadata-viewer",
    seo: {
      title: "Video Metadata Inspector - OUSO",
      description: "Check codecs, bitrates, framerates, and resolution of any video file."
    }
  },

  // --- UTILITIES / TOOLS CATEGORY ---
  {
    id: "calculator",
    slug: "calculator",
    category: "tools",
    name: "Advanced Calculator",
    description: "Scientific and standard calculation utility with history log.",
    icon: "🔢",
    status: "working",
    renderer: "renderCalculator",
    route: "/tools/calculator",
    seo: {
      title: "Advanced Online Calculator - OUSO",
      description: "Perform scientific and standard calculations with an easy-to-use interface."
    }
  },
  {
    id: "qr-generator",
    slug: "qr-generator",
    category: "tools",
    name: "QR Code Generator",
    description: "Generate customized QR codes for URLs, Wi-Fi, text, and vCards.",
    icon: "📱",
    status: "working",
    renderer: "renderQrGenerator",
    route: "/tools/qr-generator",
    seo: {
      title: "Free QR Code Generator - OUSO",
      description: "Create customized QR codes for websites, Wi-Fi, and text instantly."
    }
  },
  {
    id: "password-generator",
    slug: "password-generator",
    category: "tools",
    name: "Secure Password Generator",
    description: "Generate ultra-secure passwords with custom length and symbols.",
    icon: "🔑",
    status: "working",
    renderer: "renderPasswordGenerator",
    route: "/tools/password-generator",
    seo: {
      title: "Secure Password Generator - OUSO",
      description: "Generate strong, randomized passwords to secure your online accounts."
    }
  },
  {
    id: "unit-converter",
    slug: "unit-converter",
    category: "tools",
    name: "Unit & Currency Converter",
    description: "Convert length, weight, temperature, data size, and units instantly.",
    icon: "⚖️",
    status: "working",
    renderer: "renderUnitConverter",
    route: "/tools/unit-converter",
    seo: {
      title: "Online Unit Converter - OUSO",
      description: "Convert weight, length, temperature, and digital storage units easily."
    }
  },
  {
    id: "text-inspector",
    slug: "text-inspector",
    category: "tools",
    name: "Text Analyzer & Counter",
    description: "Count words, characters, paragraphs, reading time, and case converter.",
    icon: "📝",
    status: "working",
    renderer: "renderTextInspector",
    route: "/tools/text-inspector",
    seo: {
      title: "Text Analyzer and Word Counter - OUSO",
      description: "Count words, characters, and analyze text readability instantly."
    }
  },
  {
    id: "json-formatter",
    slug: "json-formatter",
    category: "tools",
    name: "JSON & XML Formatter",
    description: "Validate, beautify, minify, and inspect JSON or XML data structures.",
    icon: "💻",
    status: "working",
    renderer: "renderJsonFormatter",
    route: "/tools/json-formatter",
    seo: {
      title: "JSON and XML Formatter - OUSO",
      description: "Beautify, minify, and validate JSON and XML payloads in your browser."
    }
  },
  {
    id: "base64-tool",
    slug: "base64-tool",
    category: "tools",
    name: "Base64 Encoder / Decoder",
    description: "Encode or decode text and binary files to Base64 format securely.",
    icon: "🔐",
    status: "working",
    renderer: "renderBase64Tool",
    route: "/tools/base64-tool",
    seo: {
      title: "Base64 Encoder and Decoder - OUSO",
      description: "Encode and decode text or files to Base64 format instantly online."
    }
  },
  {
    id: "color-converter",
    slug: "color-converter",
    category: "tools",
    name: "Color Code Converter",
    description: "Convert between HEX, RGB, HSL, and CMYK color representations.",
    icon: "🎨",
    status: "working",
    renderer: "renderColorConverter",
    route: "/tools/color-converter",
    seo: {
      title: "Color Code Converter (HEX, RGB, HSL) - OUSO",
      description: "Convert color formats between HEX, RGB, HSL, and CMYK effortlessly."
    }
  },
  {
    id: "stopwatch",
    slug: "stopwatch",
    category: "tools",
    name: "Stopwatch & Timer",
    description: "Precise digital stopwatch with lap recording and countdown timers.",
    icon: "⏱️",
    status: "working",
    renderer: "renderStopwatch",
    route: "/tools/stopwatch",
    seo: {
      title: "Online Stopwatch and Timer - OUSO",
      description: "Use a precise digital stopwatch with lap splits and countdown timers."
    }
  },
  {
    id: "world-clock",
    slug: "world-clock",
    category: "tools",
    name: "World Clock & Timezone",
    description: "Check current local times across global cities and timezones.",
    icon: "🌍",
    status: "working",
    renderer: "renderWorldClock",
    route: "/tools/world-clock",
    seo: {
      title: "World Clock and Timezone Converter - OUSO",
      description: "Check live times across international timezones and global cities."
    }
  },
  {
    id: "markdown-previewer",
    slug: "markdown-previewer",
    category: "tools",
    name: "Markdown Live Previewer",
    description: "Write Markdown text and view rendered HTML output side by side.",
    icon: "📖",
    status: "working",
    renderer: "renderMarkdownPreviewer",
    route: "/tools/markdown-previewer",
    seo: {
      title: "Online Markdown Previewer - OUSO",
      description: "Write and preview Markdown documents with live HTML rendering."
    }
  },
  {
    id: "game",
    slug: "game",
    category: "tools",
    name: "OUSO Mini Arcade Game",
    description: "Play an entertaining browser arcade game built for quick breaks.",
    icon: "🎮",
    status: "working",
    renderer: "renderGame",
    route: "/tools/game",
    seo: {
      title: "OUSO Mini Arcade Game - Play Online",
      description: "Play an entertaining browser arcade game right here on OUSO."
    }
  },

  // --- MAINTENANCE / COMING SOON TOOLS ---
  {
    id: "ai-prompt-generator",
    slug: "ai-prompt-generator",
    category: "tools",
    name: "AI Prompt Generator",
    description: "Craft optimized prompts for Midjourney, DALL-E, and LLMs.",
    icon: "✨",
    status: "maintenance",
    renderer: null,
    route: "/tools/ai-prompt-generator",
    seo: {
      title: "AI Prompt Generator - OUSO",
      description: "Craft optimized prompts for AI image generators and language models."
    }
  },
  {
    id: "url-shortener",
    slug: "url-shortener",
    category: "tools",
    name: "URL Shortener & QR",
    description: "Shorten long web links and generate analytics tracking QR codes.",
    icon: "🔗",
    status: "maintenance",
    renderer: null,
    route: "/tools/url-shortener",
    seo: {
      title: "URL Shortener and QR - OUSO",
      description: "Shorten web links and generate QR codes with tracking."
    }
  },
  {
    id: "hash-generator",
    slug: "hash-generator",
    category: "tools",
    name: "Hash & Crypto Check",
    description: "Compute MD5, SHA-256, and SHA-512 cryptographic checksums.",
    icon: "🔒",
    status: "maintenance",
    renderer: null,
    route: "/tools/hash-generator",
    seo: {
      title: "Hash and Crypto Check - OUSO",
      description: "Compute MD5 and SHA cryptographic checksums online."
    }
  },
  {
    id: "regex-tester",
    slug: "regex-tester",
    category: "tools",
    name: "Regex Expression Tester",
    description: "Test regular expressions against sample text with live highlighting.",
    icon: "🔍",
    status: "maintenance",
    renderer: null,
    route: "/tools/regex-tester",
    seo: {
      title: "Regex Expression Tester - OUSO",
      description: "Test regular expressions against sample text with live matching."
    }
  },
  {
    id: "html-minifier",
    slug: "html-minifier",
    category: "tools",
    name: "HTML / CSS Minifier",
    description: "Minify and compress HTML, CSS, and JavaScript source code files.",
    icon: "⚙️",
    status: "maintenance",
    renderer: null,
    route: "/tools/html-minifier",
    seo: {
      title: "HTML and CSS Minifier - OUSO",
      description: "Minify and compress your HTML, CSS, and JS code."
    }
  },
  {
    id: "dns-lookup",
    slug: "dns-lookup",
    category: "tools",
    name: "DNS & IP Inspector",
    description: "Inspect domain DNS records, IP geolocation, and network headers.",
    icon: "🌐",
    status: "maintenance",
    renderer: null,
    route: "/tools/dns-lookup",
    seo: {
      title: "DNS and IP Inspector - OUSO",
      description: "Inspect domain DNS records, IP geolocation, and headers."
    }
  },
  {
    id: "speed-test",
    slug: "speed-test",
    category: "tools",
    name: "Network Speed Test",
    description: "Measure your internet connection download and upload speed.",
    icon: "⚡",
    status: "maintenance",
    renderer: null,
    route: "/tools/speed-test",
    seo: {
      title: "Network Speed Test - OUSO",
      description: "Measure your internet connection download and upload speeds."
    }
  },
  {
    id: "audio-cutter",
    slug: "audio-cutter",
    category: "tools",
    name: "Audio Cutter & Ringtone",
    description: "Trim audio files and export custom ringtones in MP3 or WAV format.",
    icon: "🎧",
    status: "maintenance",
    renderer: null,
    route: "/tools/audio-cutter",
    seo: {
      title: "Audio Cutter and Ringtone Maker - OUSO",
      description: "Trim audio files and create custom ringtones."
    }
  },
  {
    id: "favicon-generator",
    slug: "favicon-generator",
    category: "tools",
    name: "Favicon Package Creator",
    description: "Generate multi-size favicons and manifest icons from any image.",
    icon: "🌟",
    status: "maintenance",
    renderer: null,
    route: "/tools/favicon-generator",
    seo: {
      title: "Favicon Package Creator - OUSO",
      description: "Generate multi-size favicons and web icons from any graphic."
    }
  },
  {
    id: "css-generator",
    slug: "css-generator",
    category: "tools",
    name: "CSS Shadow & Box Generator",
    description: "Design box shadows, gradients, and border-radius with live CSS code.",
    icon: "🎨",
    status: "maintenance",
    renderer: null,
    route: "/tools/css-generator",
    seo: {
      title: "CSS Shadow and Box Generator - OUSO",
      description: "Design CSS shadows, gradients, and styles with live output."
    }
  }
];
