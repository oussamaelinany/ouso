/*
  OUSO — ARCADE BREAKOUT GAME (No API required)
*/

TOOL_RENDERERS["breakout-game"] = renderBreakoutGame;

function renderBreakoutGame(root) {
  root.innerHTML = `
    <div class="tool-ui" style="text-align: center;">
      <p class="tool-meta">Help OUSO Cat jump across platforms! Use <strong style="color:var(--c-gold)">Space / Click</strong> to Jump.</p>
      <div style="position: relative; max-width: 400px; margin: 0 auto; background: #0B0B0C; border-radius: 14px; overflow: hidden; border: 1px solid rgba(198,161,91,0.3);">
        <canvas id="game-canvas" width="400" height="500" style="display: block; width: 100%; height: auto;"></canvas>
        <div id="game-overlay" style="position: absolute; inset: 0; background: rgba(11,11,12,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: white;">
          <h3 style="font-family: var(--f-display); color: var(--c-gold); font-size: 1.8rem; margin:0;">OUSO Jump</h3>
          <p id="game-score-text" style="font-size: 0.95rem; opacity: 0.8; margin:0;">Press Start to Play</p>
          <button type="button" class="btn btn-primary" id="game-start-btn">Start Game</button>
        </div>
      </div>
    </div>
  `;

  const canvas = root.querySelector("#game-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = root.querySelector("#game-overlay");
  const startBtn = root.querySelector("#game-start-btn");
  const scoreText = root.querySelector("#game-score-text");

  let gameRunning = false;
  let score = 0;

  // Cat player object
  let cat = {
    x: 185,
    y: 350,
    w: 30,
    h: 30,
    vx: 0,
    vy: 0,
    jump: -10
  };

  // Platforms
  let platforms = [];
  function initPlatforms() {
    platforms = [
      { x: 150, y: 450, w: 100, h: 12 },
      { x: 80, y: 330, w: 90, h: 12 },
      { x: 220, y: 210, w: 90, h: 12 },
      { x: 120, y: 90, w: 90, h: 12 }
    ];
  }

  function startGame() {
    overlay.style.display = "none";
    gameRunning = true;
    score = 0;
    cat.x = 185;
    cat.y = 350;
    cat.vy = 0;
    initPlatforms();
    loop();
  }

  startBtn.addEventListener("click", startGame);

  // Controls
  window.addEventListener("keydown", (e) => {
    if (!gameRunning) return;
    if (e.code === "Space" || e.code === "ArrowUp") {
      cat.vy = cat.jump;
      e.preventDefault();
    }
    if (e.code === "ArrowLeft") cat.vx = -4;
    if (e.code === "ArrowRight") cat.vx = 4;
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") cat.vx = 0;
  });

  canvas.addEventListener("click", () => {
    if (gameRunning) cat.vy = cat.jump;
  });

  function update() {
    cat.vy += 0.35; // Gravity
    cat.y += cat.vy;
    cat.x += cat.vx;

    // Screen bounds
    if (cat.x < 0) cat.x = 0;
    if (cat.x > canvas.width - cat.w) cat.x = canvas.width - cat.w;

    // Platform collision
    platforms.forEach(p => {
      if (
        cat.vy > 0 &&
        cat.x + cat.w > p.x &&
        cat.x < p.x + p.w &&
        cat.y + cat.h >= p.y &&
        cat.y + cat.h <= p.y + p.h + 8
      ) {
        cat.vy = cat.jump;
        score += 10;
      }
    });

    // Scroll platforms down if cat goes high
    if (cat.y < 200) {
      let diff = 200 - cat.y;
      cat.y = 200;
      platforms.forEach(p => {
        p.y += diff;
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * (canvas.width - p.w);
        }
      });
    }

    // Game over if cat falls down
    if (cat.y > canvas.height) {
      gameRunning = false;
      scoreText.textContent = `Game Over! Score: ${score}`;
      startBtn.textContent = "Play Again";
      overlay.style.display = "flex";
    }
  }

  function draw() {
    ctx.fillStyle = "#0B0B0C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = "#C6A15B";
    platforms.forEach(p => {
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 6);
      ctx.fill();
    });

    // Draw Cat
    ctx.fillStyle = "#E7C77E";
    ctx.beginPath();
    ctx.roundRect(cat.x, cat.y, cat.w, cat.h, 8);
    ctx.fill();

    // Cat ears & face details
    ctx.fillStyle = "#C6A15B";
    ctx.beginPath();
    ctx.moveTo(cat.x + 4, cat.y);
    ctx.lineTo(cat.x + 10, cat.y - 8);
    ctx.lineTo(cat.x + 14, cat.y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cat.x + cat.w - 14, cat.y);
    ctx.lineTo(cat.x + cat.w - 10, cat.y - 8);
    ctx.lineTo(cat.x + cat.w - 4, cat.y);
    ctx.fill();

    // Draw Score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px Manrope, sans-serif";
    ctx.fillText(`Score: ${score}`, 16, 30);
  }

  function loop() {
    if (!gameRunning) return;
    update();
    draw();
    requestAnimationFrame(loop);
  }
                          }
