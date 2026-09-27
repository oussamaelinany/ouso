/*
  OUSO — PDF-TOOLS.JS
  ------------------------------------------------------------
  Real, working PDF tools that need no server. They use two
  small open-source libraries, loaded only when a PDF tool is
  actually opened (keeps the site fast for everyone else):
    - pdf-lib  -> create / merge / split PDF files
    - pdf.js   -> render PDF pages so they can be saved as images
*/

TOOL_RENDERERS["merge-pdf"]    = renderMergePdf;
TOOL_RENDERERS["split-pdf"]    = renderSplitPdf;
TOOL_RENDERERS["image-to-pdf"] = renderImageToPdf;
TOOL_RENDERERS["pdf-to-image"] = renderPdfToImage;

/* ---------------------------------------------------------
   Shared helpers
--------------------------------------------------------- */
const OUSO_LIBS = {};

function loadScriptOnce(src, globalCheck) {
  return new Promise((resolve, reject) => {
    if (globalCheck()) return resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { existing.addEventListener("load", resolve); return; }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(script);
  });
}

function loadPdfLib() {
  return loadScriptOnce(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js",
    () => typeof PDFLib !== "undefined"
  );
}

function loadPdfJs() {
  return loadScriptOnce(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    () => typeof pdfjsLib !== "undefined"
  ).then(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  });
}

function buildFileZone(id, label, accept, multiple) {
  return `
    <div class="upload-zone" id="${id}-zone" tabindex="0" role="button" aria-label="${label}">
      <span class="upload-zone-icon">
        <svg width="26" height="26"><use href="assets/icons/icons.svg#icon-pdf"></use></svg>
      </span>
      <p>${label}<span>Tap to browse your files</span></p>
      <input type="file" id="${id}-input" accept="${accept}" ${multiple ? "multiple" : ""} hidden>
    </div>
  `;
}

function wireFileZone(root, id, onFiles) {
  const zone = root.querySelector(`#${id}-zone`);
  const input = root.querySelector(`#${id}-input`);
  zone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => { if (input.files.length) onFiles([...input.files]); });
}

function showLoading(el, message) {
  el.innerHTML = `<p class="tool-meta">${message}</p>`;
  el.hidden = false;
}

/* ---------------------------------------------------------
   MERGE PDF
--------------------------------------------------------- */
function renderMergePdf(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildFileZone("mp", "Tap to choose 2 or more PDF files", "application/pdf", true)}
      <ul class="file-list" id="mp-list"></ul>
      <button type="button" class="btn btn-primary" id="mp-merge-btn" hidden>Merge PDFs</button>
      <div class="tool-result" id="mp-result" hidden></div>
    </div>
  `;
  const list = root.querySelector("#mp-list");
  const mergeBtn = root.querySelector("#mp-merge-btn");
  const result = root.querySelector("#mp-result");
  let files = [];

  wireFileZone(root, "mp", (chosen) => {
    files = chosen;
    list.innerHTML = files.map(f => `<li>${f.name}</li>`).join("");
    mergeBtn.hidden = files.length < 2;
  });

  mergeBtn.addEventListener("click", async () => {
    showLoading(result, "Merging your PDFs…");
    await loadPdfLib();
    const merged = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const doc = await PDFLib.PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const outBytes = await merged.save();
    const url = URL.createObjectURL(new Blob([outBytes], { type: "application/pdf" }));
    result.innerHTML = `<a class="btn btn-primary" href="${url}" download="ouso-merged.pdf">Download merged PDF</a>`;
  });
}

/* ---------------------------------------------------------
   SPLIT PDF (one download link per page)
--------------------------------------------------------- */
function renderSplitPdf(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildFileZone("sp", "Tap to choose a PDF file to split", "application/pdf", false)}
      <div class="tool-result" id="sp-result" hidden></div>
    </div>
  `;
  const result = root.querySelector("#sp-result");

  wireFileZone(root, "sp", async (chosen) => {
    const file = chosen[0];
    showLoading(result, "Splitting your PDF…");
    await loadPdfLib();
    const bytes = await file.arrayBuffer();
    const doc = await PDFLib.PDFDocument.load(bytes);
    const total = doc.getPageCount();

    const links = [];
    for (let i = 0; i < total; i++) {
      const single = await PDFLib.PDFDocument.create();
      const [page] = await single.copyPages(doc, [i]);
      single.addPage(page);
      const outBytes = await single.save();
      const url = URL.createObjectURL(new Blob([outBytes], { type: "application/pdf" }));
      links.push(`<a class="btn btn-secondary" href="${url}" download="ouso-page-${i + 1}.pdf">Page ${i + 1}</a>`);
    }
    result.innerHTML = `<p class="tool-meta">${total} page(s) ready:</p><div class="btn-row">${links.join("")}</div>`;
  });
}

/* ---------------------------------------------------------
   IMAGE TO PDF
--------------------------------------------------------- */
function renderImageToPdf(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildFileZone("i2p", "Tap to choose one or more images", "image/*", true)}
      <ul class="file-list" id="i2p-list"></ul>
      <button type="button" class="btn btn-primary" id="i2p-btn" hidden>Create PDF</button>
      <div class="tool-result" id="i2p-result" hidden></div>
    </div>
  `;
  const list = root.querySelector("#i2p-list");
  const btn = root.querySelector("#i2p-btn");
  const result = root.querySelector("#i2p-result");
  let files = [];

  wireFileZone(root, "i2p", (chosen) => {
    files = chosen;
    list.innerHTML = files.map(f => `<li>${f.name}</li>`).join("");
    btn.hidden = files.length === 0;
  });

  btn.addEventListener("click", async () => {
    showLoading(result, "Building your PDF…");
    await loadPdfLib();
    const doc = await PDFLib.PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const isPng = file.type === "image/png";
      const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const page = doc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    const outBytes = await doc.save();
    const url = URL.createObjectURL(new Blob([outBytes], { type: "application/pdf" }));
    result.innerHTML = `<a class="btn btn-primary" href="${url}" download="ouso-images.pdf">Download PDF</a>`;
  });
}

/* ---------------------------------------------------------
   PDF TO IMAGE (renders each page as a PNG)
--------------------------------------------------------- */
function renderPdfToImage(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildFileZone("p2i", "Tap to choose a PDF file", "application/pdf", false)}
      <div class="tool-result" id="p2i-result" hidden></div>
    </div>
  `;
  const result = root.querySelector("#p2i-result");

  wireFileZone(root, "p2i", async (chosen) => {
    const file = chosen[0];
    showLoading(result, "Rendering pages…");
    await loadPdfJs();

    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const links = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

      const url = await new Promise(r => canvas.toBlob(b => r(URL.createObjectURL(b)), "image/png"));
      links.push(`<a class="btn btn-secondary" href="${url}" download="ouso-page-${i}.png">Page ${i}</a>`);
    }
    result.innerHTML = `<p class="tool-meta">${pdf.numPages} page(s) ready:</p><div class="btn-row">${links.join("")}</div>`;
  });
}
