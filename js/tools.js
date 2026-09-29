/*
  OUSO — TOOLS DATA FILE (With Direct Cat Logo Icon)
*/

const OUSO_CATEGORIES = [
  { id: "images", name: "Images", description: "Edit, convert and enhance your images.", icon: "icon-image" },
  { id: "videos", name: "Videos", description: "Useful tools for working with video files.", icon: "icon-video" },
  { id: "ai-content", name: "AI Content", description: "Create content faster with AI assistance.", icon: "icon-sparkle" },
  { id: "pdf", name: "PDF", description: "Convert, manage and optimize PDF files.", icon: "icon-pdf" },
  { id: "tools", name: "Tools", description: "More handy utilities, all in one place.", icon: "icon-grid" },
  { id: "gaming", name: "Mini Games", description: "Relax and play a quick game during your break.", icon: "cat-logo" }
];

const OUSO_TOOLS = [
  // ---------------- IMAGES ----------------
  { id: "bg-remover", category: "images", name: "Background Remover", description: "Remove any image background in seconds.", icon: "icon-scissors", status: "maintenance" },
  { id: "img-compressor", category: "images", name: "Image Compressor", description: "Shrink file size without losing quality.", icon: "icon-compress", status: "working" },
  { id: "img-resizer", category: "images", name: "Image Resizer", description: "Resize images to any dimension.", icon: "icon-resize", status: "working" },
  { id: "img-cropper", category: "images", name: "Image Cropper", description: "Crop images to the perfect frame.", icon: "icon-crop", status: "working" },
  { id: "img-converter", category: "images", name: "Image Converter", description: "Convert between JPG, PNG and WebP.", icon: "icon-convert", status: "working" },
  { id: "img-rotator", category: "images", name: "Image Rotator", description: "Rotate or flip an image instantly.", icon: "icon-rotate", status: "working" },
  { id: "img-upscaler", category: "images", name: "Image Upscaler", description: "Increase resolution without losing detail.", icon: "icon-upscale", status: "maintenance" },

  // ---------------- VIDEOS ----------------
  { id: "video-downloader", category: "videos", name: "Video Downloader", description: "Paste a link and save the video.", icon: "icon-download", status: "maintenance" },
  { id: "video-compressor", category: "videos", name: "Video Compressor", description: "Reduce video size for easy sharing.", icon: "icon-compress", status: "maintenance" },
  { id: "video-converter", category: "videos", name: "Video Converter", description: "Convert video files between formats.", icon: "icon-convert", status: "maintenance" },
  { id: "video-trimmer", category: "videos", name: "Video Trimmer", description: "Cut and trim clips with precision.", icon: "icon-trim", status: "maintenance" },
  { id: "video-to-gif", category: "videos", name: "Video to GIF", description: "Turn a short clip into a looping GIF.", icon: "icon-gif", status: "maintenance" },

  // ---------------- AI CONTENT ----------------
  { id: "ai-script-writer", category: "ai-content", name: "AI Script Writer", description: "Generate a ready-to-use video script.", icon: "icon-quill", status: "maintenance" },
  { id: "yt-title-generator", category: "ai-content", name: "YouTube Title Generator", description: "Get catchy titles for your videos.", icon: "icon-title", status: "maintenance" },
  { id: "caption-generator", category: "ai-content", name: "Caption Generator", description: "Write captions for social media posts.", icon: "icon-caption", status: "maintenance" },
  { id: "blog-outline-generator", category: "ai-content", name: "Blog Outline Generator", description: "Turn any topic into a structured outline.", icon: "icon-outline", status: "maintenance" },

  // ---------------- PDF ----------------
  { id: "merge-pdf", category: "pdf", name: "Merge PDF", description: "Combine multiple PDFs into one file.", icon: "icon-merge", status: "working" },
  { id: "split-pdf", category: "pdf", name: "Split PDF", description: "Split one PDF into separate files.", icon: "icon-split", status: "working" },
  { id: "image-to-pdf", category: "pdf", name: "Image to PDF", description: "Turn JPG or PNG files into a PDF.", icon: "icon-image", status: "working" },
  { id: "pdf-to-image", category: "pdf", name: "PDF to Image", description: "Export PDF pages as image files.", icon: "icon-image", status: "working" },
  { id: "compress-pdf", category: "pdf", name: "Compress PDF", description: "Reduce PDF file size for sharing.", icon: "icon-compress", status: "maintenance" },
  { id: "pdf-to-word", category: "pdf", name: "PDF to Word", description: "Convert a PDF into an editable document.", icon: "icon-word", status: "maintenance" },

  // ---------------- TOOLS ----------------
  { id: "qr-generator", category: "tools", name: "QR Code Generator", description: "Create a QR code from any link or text.", icon: "icon-qr", status: "working" },
  { id: "text-tools", category: "tools", name: "Text Tools", description: "Count, clean and reformat text instantly.", icon: "icon-text", status: "working" },
  { id: "calculator", category: "tools", name: "Calculator", description: "A simple, fast everyday calculator.", icon: "icon-calculator", status: "working" },
  { id: "unit-converter", category: "tools", name: "Unit Converter", description: "Convert length, weight, and more.", icon: "icon-ruler", status: "working" },
  { id: "color-tools", category: "tools", name: "Color Tools", description: "Convert HEX, RGB and HSL colors.", icon: "icon-palette", status: "working" },
  { id: "password-generator", category: "tools", name: "Password Generator", description: "Create strong, random passwords.", icon: "icon-key", status: "working" },
  { id: "base64-tool", category: "tools", name: "Base64 Encoder/Decoder", description: "Encode or decode Base64 text instantly.", icon: "icon-code", status: "working" },
  { id: "timestamp-converter", category: "tools", name: "Timestamp Converter", description: "Convert between Unix time and dates.", icon: "icon-clock", status: "working" },

  // ---------------- MINI GAMES ----------------
  { id: "breakout-game", category: "gaming", name: "Arcade Breakout", description: "Play a fun retro game during your break.", icon: "icon-sparkle", status: "working" },
  { id: "puzzle-game", category: "gaming", name: "Quick Puzzle", description: "Test your brain with a tile matching mini-game.", icon: "icon-grid", status: "maintenance" }
];

const TOOL_RENDERERS = {};
