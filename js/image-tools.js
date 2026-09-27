/*
  OUSO — IMAGE-TOOLS.JS
  ------------------------------------------------------------
  Real, working image tools that need no external API.
  Everything happens in the visitor's own browser using the
  Canvas API. Nothing is ever uploaded anywhere.

  Each tool adds itself to the shared TOOL_RENDERERS map
  (declared in js/tools.js) using its tool id.
*/

TOOL_RENDERERS["img-compressor"] = renderImageCompressor;
TOOL_RENDERERS["img-resizer"]    = renderImageResizer;
TOOL_RENDERERS["img-converter"]  = renderImageConverter;
TOOL_RENDERERS["img-rotator"]    = renderImageRotator;
TOOL_RENDERERS["img-cropper"]    = renderImageCropper;

/* ---------------------------------------------------------
   Shared helpers used by several image tools
--------------------------------------------------------- */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function buildUploadZone(id, label) {
  return `
    <div class="upload-zone" id="${id}-zone" tabindex="0" role="button" aria-label="${label}">
      <span class="upload-zone-icon">
        <svg width="26" height="26"><use href="assets/icons/icons.svg#icon-image"></use></svg>
      </span>
      <p>Tap to choose an image<span>or drag &amp; drop / paste it here</span></p>
      <input type="file" id="${id}-input" accept="image/*" hidden>
    </div>
  `;
}

/* Wires upload (click / drag&drop / paste) for a given prefix id.
   Calls onLoaded(dataUrl, file) once an image is chosen. */
function wireUploadZone(root, id, onLoaded) {
  const zone  = root.querySelector(`#${id}-zone`);
  const input = root.querySelector(`#${id}-input`);

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
  });
  input.addEventListener("change", () => {
    if (input.files[0]) readFile(input.files[0]);
  });

  ["dragover", "dragenter"].forEach(evt =>
    zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add("is-dragover"); })
  );
  ["dragleave", "drop"].forEach(evt =>
    zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove("is-dragover"); })
  );
  zone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) readFile(file);
  });

  document.addEventListener("paste", (e) => {
    const workspace = root.closest("#tool-workspace");
    if (!workspace || workspace.hidden) return;
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith("image/"));
    if (item) readFile(item.getAsFile());
  });

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = () => onLoaded(reader.result, file);
    reader.readAsDataURL(file);
  }
}

/* ---------------------------------------------------------
   IMAGE COMPRESSOR
--------------------------------------------------------- */
function renderImageCompressor(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildUploadZone("ic", "Choose an image to compress")}
      <div class="tool-preview" id="ic-preview-wrap" hidden>
        <img id="ic-preview-img" alt="Selected image preview">
        <p class="tool-meta">Original size: <strong id="ic-original-size">–</strong></p>

        <label class="quality-label" for="ic-quality">Quality: <span id="ic-quality-value">80</span>%</label>
        <input type="range" id="ic-quality" min="10" max="95" value="80">

        <button type="button" class="btn btn-primary" id="ic-compress-btn">Compress Image</button>

        <div class="tool-result" id="ic-result" hidden>
          <div class="result-row">
            <span>New size: <strong id="ic-new-size">–</strong></span>
            <span class="result-savings" id="ic-savings"></span>
          </div>
          <img id="ic-result-img" alt="Compressed result preview">
          <a class="btn btn-primary" id="ic-download-btn" download="ouso-compressed.jpg">Download compressed image</a>
        </div>
      </div>
    </div>
  `;

  const previewWrap  = root.querySelector("#ic-preview-wrap");
  const previewImg   = root.querySelector("#ic-preview-img");
  const originalSize = root.querySelector("#ic-original-size");
  const qualityInput = root.querySelector("#ic-quality");
  const qualityValue = root.querySelector("#ic-quality-value");
  const compressBtn  = root.querySelector("#ic-compress-btn");
  const resultBox    = root.querySelector("#ic-result");
  const resultImg    = root.querySelector("#ic-result-img");
  const newSizeEl    = root.querySelector("#ic-new-size");
  const savingsEl    = root.querySelector("#ic-savings");
  const downloadBtn  = root.querySelector("#ic-download-btn");

  let currentImage = null;

  wireUploadZone(root, "ic", (dataUrl, file) => {
    previewImg.src = dataUrl;
    originalSize.textContent = formatBytes(file.size);
    previewWrap.hidden = false;
    resultBox.hidden = true;
    currentImage = new Image();
    currentImage.src = dataUrl;
  });

  qualityInput.addEventListener("input", () => { qualityValue.textContent = qualityInput.value; });

  compressBtn.addEventListener("click", () => {
    if (!currentImage) return;
    const run = () => {
      const canvas = document.createElement("canvas");
      canvas.width = currentImage.naturalWidth;
      canvas.height = currentImage.naturalHeight;
      canvas.getContext("2d").drawImage(currentImage, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        resultImg.src = url;
        newSizeEl.textContent = formatBytes(blob.size);

        const originalBytes = Math.round((previewImg.src.split(",")[1].length * 3) / 4);
        const savedPercent = Math.max(0, Math.round((1 - blob.size / originalBytes) * 100));
        savingsEl.textContent = savedPercent > 0 ? `${savedPercent}% smaller` : "";

        downloadBtn.href = url;
        resultBox.hidden = false;
      }, "image/jpeg", Number(qualityInput.value) / 100);
    };
    if (currentImage.complete) run(); else currentImage.onload = run;
  });
}

/* ---------------------------------------------------------
   IMAGE RESIZER
--------------------------------------------------------- */
function renderImageResizer(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildUploadZone("ir", "Choose an image to resize")}
      <div class="tool-preview" id="ir-preview-wrap" hidden>
        <img id="ir-preview-img" alt="Selected image preview">
        <p class="tool-meta">Original: <strong id="ir-original-dims">–</strong></p>

        <div class="dim-row">
          <label>Width (px)<input type="number" id="ir-width" min="1"></label>
          <label>Height (px)<input type="number" id="ir-height" min="1"></label>
        </div>
        <label class="checkbox-row"><input type="checkbox" id="ir-lock" checked> Keep aspect ratio</label>

        <button type="button" class="btn btn-primary" id="ir-resize-btn">Resize Image</button>

        <div class="tool-result" id="ir-result" hidden>
          <img id="ir-result-img" alt="Resized result preview">
          <a class="btn btn-primary" id="ir-download-btn" download="ouso-resized.png">Download resized image</a>
        </div>
      </div>
    </div>
  `;

  const previewWrap = root.querySelector("#ir-preview-wrap");
  const previewImg  = root.querySelector("#ir-preview-img");
  const originalDims= root.querySelector("#ir-original-dims");
  const widthInput  = root.querySelector("#ir-width");
  const heightInput = root.querySelector("#ir-height");
  const lockRatio   = root.querySelector("#ir-lock");
  const resizeBtn   = root.querySelector("#ir-resize-btn");
  const resultBox   = root.querySelector("#ir-result");
  const resultImg   = root.querySelector("#ir-result-img");
  const downloadBtn = root.querySelector("#ir-download-btn");

  let currentImage = null, ratio = 1;

  wireUploadZone(root, "ir", (dataUrl) => {
    previewImg.src = dataUrl;
    resultBox.hidden = true;
    currentImage = new Image();
    currentImage.onload = () => {
      widthInput.value = currentImage.naturalWidth;
      heightInput.value = currentImage.naturalHeight;
      ratio = currentImage.naturalWidth / currentImage.naturalHeight;
      originalDims.textContent = `${currentImage.naturalWidth} × ${currentImage.naturalHeight}px`;
      previewWrap.hidden = false;
    };
    currentImage.src = dataUrl;
  });

  widthInput.addEventListener("input", () => {
    if (lockRatio.checked && widthInput.value) {
      heightInput.value = Math.round(widthInput.value / ratio);
    }
  });
  heightInput.addEventListener("input", () => {
    if (lockRatio.checked && heightInput.value) {
      widthInput.value = Math.round(heightInput.value * ratio);
    }
  });

  resizeBtn.addEventListener("click", () => {
    if (!currentImage) return;
    const w = Number(widthInput.value), h = Number(heightInput.value);
    if (!w || !h) return;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(currentImage, 0, 0, w, h);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resultImg.src = url;
      downloadBtn.href = url;
      resultBox.hidden = false;
    }, "image/png");
  });
}

/* ---------------------------------------------------------
   IMAGE CONVERTER
--------------------------------------------------------- */
function renderImageConverter(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildUploadZone("icv", "Choose an image to convert")}
      <div class="tool-preview" id="icv-preview-wrap" hidden>
        <img id="icv-preview-img" alt="Selected image preview">

        <label class="quality-label" for="icv-format">Convert to</label>
        <select id="icv-format">
          <option value="image/jpeg">JPG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WebP</option>
        </select>

        <button type="button" class="btn btn-primary" id="icv-convert-btn">Convert Image</button>

        <div class="tool-result" id="icv-result" hidden>
          <img id="icv-result-img" alt="Converted result preview">
          <a class="btn btn-primary" id="icv-download-btn" download="ouso-converted">Download converted image</a>
        </div>
      </div>
    </div>
  `;

  const previewWrap = root.querySelector("#icv-preview-wrap");
  const previewImg  = root.querySelector("#icv-preview-img");
  const formatSel   = root.querySelector("#icv-format");
  const convertBtn  = root.querySelector("#icv-convert-btn");
  const resultBox   = root.querySelector("#icv-result");
  const resultImg   = root.querySelector("#icv-result-img");
  const downloadBtn = root.querySelector("#icv-download-btn");

  let currentImage = null;

  wireUploadZone(root, "icv", (dataUrl) => {
    previewImg.src = dataUrl;
    resultBox.hidden = true;
    currentImage = new Image();
    currentImage.src = dataUrl;
    previewWrap.hidden = false;
  });

  convertBtn.addEventListener("click", () => {
    if (!currentImage) return;
    const run = () => {
      const canvas = document.createElement("canvas");
      canvas.width = currentImage.naturalWidth;
      canvas.height = currentImage.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (formatSel.value === "image/jpeg") { // JPG has no transparency: fill white first
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(currentImage, 0, 0);

      const ext = formatSel.value.split("/")[1];
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resultImg.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `ouso-converted.${ext}`;
        resultBox.hidden = false;
      }, formatSel.value, 0.92);
    };
    if (currentImage.complete) run(); else currentImage.onload = run;
  });
}

/* ---------------------------------------------------------
   IMAGE ROTATOR / FLIPPER
--------------------------------------------------------- */
function renderImageRotator(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildUploadZone("irt", "Choose an image to rotate")}
      <div class="tool-preview" id="irt-preview-wrap" hidden>
        <canvas id="irt-canvas" class="rotate-canvas"></canvas>
        <div class="btn-row">
          <button type="button" class="btn btn-secondary" id="irt-left">Rotate Left</button>
          <button type="button" class="btn btn-secondary" id="irt-right">Rotate Right</button>
          <button type="button" class="btn btn-secondary" id="irt-flip-h">Flip Horizontal</button>
          <button type="button" class="btn btn-secondary" id="irt-flip-v">Flip Vertical</button>
        </div>
        <a class="btn btn-primary" id="irt-download-btn" download="ouso-rotated.png">Download image</a>
      </div>
    </div>
  `;

  const previewWrap = root.querySelector("#irt-preview-wrap");
  const canvas      = root.querySelector("#irt-canvas");
  const downloadBtn = root.querySelector("#irt-download-btn");
  const ctx = canvas.getContext("2d");

  let img = null, rotation = 0, flipH = 1, flipV = 1;

  wireUploadZone(root, "irt", (dataUrl) => {
    img = new Image();
    img.onload = () => { rotation = 0; flipH = 1; flipV = 1; draw(); previewWrap.hidden = false; };
    img.src = dataUrl;
  });

  function draw() {
    const swap = rotation % 180 !== 0;
    canvas.width  = swap ? img.naturalHeight : img.naturalWidth;
    canvas.height = swap ? img.naturalWidth  : img.naturalHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH, flipV);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    canvas.toBlob((blob) => { downloadBtn.href = URL.createObjectURL(blob); }, "image/png");
  }

  root.querySelector("#irt-left").addEventListener("click", () => { rotation = (rotation - 90 + 360) % 360; draw(); });
  root.querySelector("#irt-right").addEventListener("click", () => { rotation = (rotation + 90) % 360; draw(); });
  root.querySelector("#irt-flip-h").addEventListener("click", () => { flipH *= -1; draw(); });
  root.querySelector("#irt-flip-v").addEventListener("click", () => { flipV *= -1; draw(); });
}

/* ---------------------------------------------------------
   IMAGE CROPPER (drag a box over the image, then crop)
--------------------------------------------------------- */
function renderImageCropper(root) {
  root.innerHTML = `
    <div class="tool-ui">
      ${buildUploadZone("icr", "Choose an image to crop")}
      <div class="tool-preview" id="icr-preview-wrap" hidden>
        <p class="tool-meta">Drag a box on the image to select the crop area.</p>
        <div class="crop-stage" id="icr-stage">
          <img id="icr-img" alt="Image to crop">
          <div class="crop-box" id="icr-box" hidden></div>
        </div>
        <button type="button" class="btn btn-primary" id="icr-crop-btn">Crop Image</button>
        <div class="tool-result" id="icr-result" hidden>
          <img id="icr-result-img" alt="Cropped result preview">
          <a class="btn btn-primary" id="icr-download-btn" download="ouso-cropped.png">Download cropped image</a>
        </div>
      </div>
    </div>
  `;

  const previewWrap = root.querySelector("#icr-preview-wrap");
  const stage       = root.querySelector("#icr-stage");
  const imgEl       = root.querySelector("#icr-img");
  const box         = root.querySelector("#icr-box");
  const cropBtn     = root.querySelector("#icr-crop-btn");
  const resultBox   = root.querySelector("#icr-result");
  const resultImg   = root.querySelector("#icr-result-img");
  const downloadBtn = root.querySelector("#icr-download-btn");

  let naturalImg = null;
  let start = null, rect = null;

  wireUploadZone(root, "icr", (dataUrl) => {
    imgEl.src = dataUrl;
    naturalImg = new Image();
    naturalImg.src = dataUrl;
    box.hidden = true;
    resultBox.hidden = true;
    previewWrap.hidden = false;
  });

  function pointerPos(e) {
    const r = stage.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: Math.min(Math.max(point.clientX - r.left, 0), r.width), y: Math.min(Math.max(point.clientY - r.top, 0), r.height) };
  }

  function startDrag(e) {
    start = pointerPos(e);
    box.hidden = false;
    updateBox(start, start);
    e.preventDefault();
  }
  function moveDrag(e) {
    if (!start) return;
    updateBox(start, pointerPos(e));
    e.preventDefault();
  }
  function endDrag() { start = null; }

  function updateBox(a, b) {
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const w = Math.abs(a.x - b.x), h = Math.abs(a.y - b.y);
    box.style.left = x + "px"; box.style.top = y + "px";
    box.style.width = w + "px"; box.style.height = h + "px";
    rect = { x, y, w, h };
  }

  stage.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);
  stage.addEventListener("touchstart", startDrag, { passive: false });
  stage.addEventListener("touchmove", moveDrag, { passive: false });
  stage.addEventListener("touchend", endDrag);

  cropBtn.addEventListener("click", () => {
    if (!rect || !rect.w || !rect.h || !naturalImg) return;
    const run = () => {
      const scaleX = naturalImg.naturalWidth / imgEl.clientWidth;
      const scaleY = naturalImg.naturalHeight / imgEl.clientHeight;

      const canvas = document.createElement("canvas");
      canvas.width = rect.w * scaleX;
      canvas.height = rect.h * scaleY;
      canvas.getContext("2d").drawImage(
        naturalImg,
        rect.x * scaleX, rect.y * scaleY, rect.w * scaleX, rect.h * scaleY,
        0, 0, canvas.width, canvas.height
      );
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resultImg.src = url;
        downloadBtn.href = url;
        resultBox.hidden = false;
      }, "image/png");
    };
    if (naturalImg.complete) run(); else naturalImg.onload = run;
  });
                        }
