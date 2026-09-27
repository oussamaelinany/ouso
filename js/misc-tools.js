/*
  OUSO — MISC-TOOLS.JS
  ------------------------------------------------------------
  Real, working general-purpose tools shown under "Tools".
  All run entirely in the browser.
*/

TOOL_RENDERERS["text-tools"]          = renderTextTools;
TOOL_RENDERERS["calculator"]          = renderCalculator;
TOOL_RENDERERS["unit-converter"]      = renderUnitConverter;
TOOL_RENDERERS["color-tools"]         = renderColorTools;
TOOL_RENDERERS["qr-generator"]        = renderQrGenerator;
TOOL_RENDERERS["password-generator"]  = renderPasswordGenerator;
TOOL_RENDERERS["base64-tool"]         = renderBase64Tool;
TOOL_RENDERERS["timestamp-converter"] = renderTimestampConverter;

/* ---------------------------------------------------------
   TEXT TOOLS
--------------------------------------------------------- */
function renderTextTools(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <textarea id="tt-input" class="tool-textarea" rows="6" placeholder="Type or paste your text here…"></textarea>
      <p class="tool-meta">
        Words: <strong id="tt-words">0</strong> ·
        Characters: <strong id="tt-chars">0</strong> ·
        Sentences: <strong id="tt-sentences">0</strong>
      </p>
      <div class="btn-row">
        <button type="button" class="btn btn-secondary" data-tt="upper">UPPERCASE</button>
        <button type="button" class="btn btn-secondary" data-tt="lower">lowercase</button>
        <button type="button" class="btn btn-secondary" data-tt="title">Title Case</button>
        <button type="button" class="btn btn-secondary" data-tt="trim">Remove extra spaces</button>
        <button type="button" class="btn btn-secondary" data-tt="reverse">Reverse text</button>
        <button type="button" class="btn btn-primary" data-tt="copy">Copy</button>
      </div>
    </div>
  `;
  const input = root.querySelector("#tt-input");
  const words = root.querySelector("#tt-words");
  const chars = root.querySelector("#tt-chars");
  const sentences = root.querySelector("#tt-sentences");

  function updateStats() {
    const text = input.value;
    words.textContent = (text.trim().match(/\S+/g) || []).length;
    chars.textContent = text.length;
    sentences.textContent = (text.match(/[.!?]+/g) || []).length;
  }
  input.addEventListener("input", updateStats);
  updateStats();

  root.querySelectorAll("[data-tt]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.tt;
      if (action === "upper") input.value = input.value.toUpperCase();
      if (action === "lower") input.value = input.value.toLowerCase();
      if (action === "title") input.value = input.value.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
      if (action === "trim") input.value = input.value.replace(/\s+/g, " ").trim();
      if (action === "reverse") input.value = [...input.value].reverse().join("");
      if (action === "copy") navigator.clipboard?.writeText(input.value);
      updateStats();
    });
  });
}

/* ---------------------------------------------------------
   CALCULATOR
--------------------------------------------------------- */
function renderCalculator(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <div class="calc-display" id="calc-display">0</div>
      <div class="calc-grid">
        ${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","=","+"]
          .map(k => `<button type="button" class="calc-key${"+−×÷=".includes(k) ? " calc-key-op" : ""}" data-key="${k}">${k}</button>`).join("")}
        <button type="button" class="calc-key calc-key-clear" data-key="C">C</button>
      </div>
    </div>
  `;
  const display = root.querySelector("#calc-display");
  let expression = "";

  root.querySelectorAll("[data-key]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (key === "C") { expression = ""; }
      else if (key === "=") {
        try {
          const safe = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
          expression = String(Function(`"use strict"; return (${safe})`)());
        } catch { expression = "Error"; }
      } else {
        expression += key;
      }
      display.textContent = expression || "0";
    });
  });
}

/* ---------------------------------------------------------
   UNIT CONVERTER
--------------------------------------------------------- */
const UNIT_GROUPS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  temperature: null // handled specially
};

function renderUnitConverter(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <label class="quality-label" for="uc-group">Category</label>
      <select id="uc-group">
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>

      <div class="dim-row">
        <label>From<input type="number" id="uc-value" value="1"></label>
        <select id="uc-from"></select>
        <select id="uc-to"></select>
      </div>

      <p class="tool-meta">Result: <strong id="uc-result">–</strong></p>
    </div>
  `;
  const groupSel = root.querySelector("#uc-group");
  const fromSel = root.querySelector("#uc-from");
  const toSel = root.querySelector("#uc-to");
  const valueInput = root.querySelector("#uc-value");
  const resultEl = root.querySelector("#uc-result");

  function populateUnits() {
    const group = groupSel.value;
    const units = group === "temperature" ? ["C", "F", "K"] : Object.keys(UNIT_GROUPS[group]);
    fromSel.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
    toSel.innerHTML = units.map((u, i) => `<option value="${u}" ${i === 1 ? "selected" : ""}>${u}</option>`).join("");
    convert();
  }

  function convert() {
    const group = groupSel.value, val = Number(valueInput.value) || 0;
    let result;
    if (group === "temperature") {
      const toC = { C: v => v, F: v => (v - 32) * 5/9, K: v => v - 273.15 }[fromSel.value](val);
      result = { C: v => v, F: v => v * 9/5 + 32, K: v => v + 273.15 }[toSel.value](toC);
    } else {
      const table = UNIT_GROUPS[group];
      result = (val * table[fromSel.value]) / table[toSel.value];
    }
    resultEl.textContent = `${Number(result.toFixed(4))} ${toSel.value}`;
  }

  [groupSel].forEach(el => el.addEventListener("change", populateUnits));
  [fromSel, toSel, valueInput].forEach(el => el.addEventListener("input", convert));
  populateUnits();
}

/* ---------------------------------------------------------
   COLOR TOOLS
--------------------------------------------------------- */
function renderColorTools(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <input type="color" id="ct-picker" value="#C6A15B" class="color-picker">
      <div class="field-row-light"><label>HEX</label><input type="text" id="ct-hex" value="#C6A15B"></div>
      <div class="field-row-light"><label>RGB</label><input type="text" id="ct-rgb" readonly></div>
      <div class="field-row-light"><label>HSL</label><input type="text" id="ct-hsl" readonly></div>
    </div>
  `;
  const picker = root.querySelector("#ct-picker");
  const hexInput = root.querySelector("#ct-hex");
  const rgbInput = root.querySelector("#ct-rgb");
  const hslInput = root.querySelector("#ct-hsl");

  function hexToRgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  function update(hex) {
    hex = hex.startsWith("#") ? hex : "#" + hex;
    const { r, g, b } = hexToRgb(hex);
    picker.value = hex;
    hexInput.value = hex;
    rgbInput.value = `rgb(${r}, ${g}, ${b})`;
    hslInput.value = rgbToHsl(r, g, b);
  }

  picker.addEventListener("input", () => update(picker.value));
  hexInput.addEventListener("input", () => { if (/^#?[0-9a-fA-F]{6}$/.test(hexInput.value)) update(hexInput.value); });
  update(picker.value);
}

/* ---------------------------------------------------------
   QR CODE GENERATOR (loads a tiny external library on demand)
--------------------------------------------------------- */
function renderQrGenerator(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <input type="text" id="qr-text" placeholder="Type a link or any text…" class="tool-input">
      <button type="button" class="btn btn-primary" id="qr-generate-btn">Generate QR Code</button>
      <div id="qr-output" class="qr-output"></div>
    </div>
  `;
  const input = root.querySelector("#qr-text");
  const output = root.querySelector("#qr-output");

  root.querySelector("#qr-generate-btn").addEventListener("click", async () => {
    if (!input.value.trim()) return;
    output.innerHTML = "";
    await loadScriptOnce(
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
      () => typeof QRCode !== "undefined"
    );
    new QRCode(output, { text: input.value.trim(), width: 200, height: 200 });
  });
}

/* ---------------------------------------------------------
   PASSWORD GENERATOR
--------------------------------------------------------- */
function renderPasswordGenerator(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <div class="tool-result-box" id="pg-output">Click Generate</div>
      <label class="quality-label" for="pg-length">Length: <span id="pg-length-value">16</span></label>
      <input type="range" id="pg-length" min="6" max="40" value="16">
      <label class="checkbox-row"><input type="checkbox" id="pg-symbols" checked> Include symbols</label>
      <label class="checkbox-row"><input type="checkbox" id="pg-numbers" checked> Include numbers</label>
      <button type="button" class="btn btn-primary" id="pg-generate-btn">Generate Password</button>
    </div>
  `;
  const output = root.querySelector("#pg-output");
  const lengthInput = root.querySelector("#pg-length");
  const lengthValue = root.querySelector("#pg-length-value");
  const symbolsCheck = root.querySelector("#pg-symbols");
  const numbersCheck = root.querySelector("#pg-numbers");

  lengthInput.addEventListener("input", () => lengthValue.textContent = lengthInput.value);

  root.querySelector("#pg-generate-btn").addEventListener("click", () => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numbersCheck.checked) chars += "0123456789";
    if (symbolsCheck.checked) chars += "!@#$%^&*()_+-=[]{}";
    const bytes = new Uint32Array(Number(lengthInput.value));
    crypto.getRandomValues(bytes);
    output.textContent = [...bytes].map(b => chars[b % chars.length]).join("");
  });
}

/* ---------------------------------------------------------
   BASE64 ENCODER / DECODER
--------------------------------------------------------- */
function renderBase64Tool(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <textarea id="b64-input" class="tool-textarea" rows="4" placeholder="Type text or Base64 here…"></textarea>
      <div class="btn-row">
        <button type="button" class="btn btn-primary" id="b64-encode-btn">Encode to Base64</button>
        <button type="button" class="btn btn-primary" id="b64-decode-btn">Decode from Base64</button>
      </div>
      <textarea id="b64-output" class="tool-textarea" rows="4" readonly placeholder="Result appears here…"></textarea>
    </div>
  `;
  const input = root.querySelector("#b64-input");
  const output = root.querySelector("#b64-output");

  root.querySelector("#b64-encode-btn").addEventListener("click", () => {
    try { output.value = btoa(unescape(encodeURIComponent(input.value))); }
    catch { output.value = "Could not encode this text."; }
  });
  root.querySelector("#b64-decode-btn").addEventListener("click", () => {
    try { output.value = decodeURIComponent(escape(atob(input.value))); }
    catch { output.value = "This is not valid Base64."; }
  });
}

/* ---------------------------------------------------------
   TIMESTAMP CONVERTER
--------------------------------------------------------- */
function renderTimestampConverter(root) {
  root.innerHTML = `
    <div class="tool-ui">
      <label class="quality-label">Unix timestamp (seconds)</label>
      <input type="number" id="ts-input" class="tool-input" placeholder="e.g. 1780000000">
      <button type="button" class="btn btn-secondary" id="ts-now-btn">Use current time</button>
      <p class="tool-meta">Human date: <strong id="ts-output">–</strong></p>

      <hr class="tool-divider">

      <label class="quality-label">Or pick a date</label>
      <input type="datetime-local" id="ts-date-input" class="tool-input">
      <p class="tool-meta">Unix timestamp: <strong id="ts-date-output">–</strong></p>
    </div>
  `;
  const tsInput = root.querySelector("#ts-input");
  const tsOutput = root.querySelector("#ts-output");
  const dateInput = root.querySelector("#ts-date-input");
  const dateOutput = root.querySelector("#ts-date-output");

  root.querySelector("#ts-now-btn").addEventListener("click", () => {
    tsInput.value = Math.floor(Date.now() / 1000);
    tsInput.dispatchEvent(new Event("input"));
  });
  tsInput.addEventListener("input", () => {
    const n = Number(tsInput.value);
    tsOutput.textContent = n ? new Date(n * 1000).toUTCString() : "–";
  });
  dateInput.addEventListener("input", () => {
    dateOutput.textContent = dateInput.value ? Math.floor(new Date(dateInput.value).getTime() / 1000) : "–";
  });
}
