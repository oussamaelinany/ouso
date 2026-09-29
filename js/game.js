/*
  OUSO — ARCADE BREAKOUT GAME (Harder & OUSO Cat Themed)
*/

TOOL_RENDERERS["breakout-game"] = renderBreakoutGame;

function renderBreakoutGame(root) {
  root.innerHTML = `
    <div class="tool-ui" style="text-align: center;">
      <p class="tool-meta">Help OUSO Cat jump! Watch out, it's faster and harder now. Use <strong style="color:var(--c-gold)">Space / Click</strong> to Jump.</p>
      <div style="position: relative; max-width: 400px; margin: 0 auto; background: #0B0B0C; border-radius: 14px; overflow: hidden; border: 1px solid rgba(198,161,91,0.3);">
        <canvas id="game-canvas" width="400" height="500" style="display: block; width: 100%; height: auto;"></canvas>
        <div id="game-overlay" style="position: absolute; inset: 0; background: rgba(11,11,12,0.88); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: white;">
          <h3 style="font-family: var(--f-display); color: var(--c-gold); font-size: 1.8rem; margin:0;">OUSO Hard Jump</h3>
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

  // Cat player object (Slightly smaller & trickier)
  let cat = {
    x: 185,
    y: 350,
    w: 28,
    h: 28,
    vx: 0,
    vy: 0,
    jump: -11.5 // Higher jump for harder platforms
  };

  // Platforms (Narrower and moving faster in difficulty)
  let platforms = [];
  function initPlatforms() {
    platforms = [
      { x: 150, y: 450, w: 80, h: 10 },
      { x: 60, y: 320, w: 75, h: 10 },
      { x: 240, y: 190, w: 75, h: 10 },
      { x: 130, y: 70, w: 70, h: 10 }
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
    if (e.code === "ArrowLeft") cat.vx = -5;
    if (e.code === "ArrowRight") cat.vx = 5;
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") cat.vx = 0;
  });

  canvas.addEventListener("click", () => {
    if (gameRunning) cat.vy = cat.jump;
  });

  function update() {
    cat.vy += 0.42; // Heavier gravity makes it harder
    cat.y += cat.vy;
    cat.x += cat.vx;

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
        score += 15; // More points for harder jump
      }
    });

    // Scroll platforms
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

    if (cat.y > canvas.height) {
      gameRunning = false;
      scoreText.textContent = `Game Over! Score: ${score}`;
      startBtn.textContent = "Try Again";
      overlay.style.display = "flex";
    }
  }

  function draw() {
    ctx.fillStyle = "#0B0B0C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Platforms
    ctx.fillStyle = "#C6A15B";
    platforms.forEach(p => {
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 5);
      ctx.fill();
    });

    // Draw OUSO Cat (Matching the logo shape and smiling face)
    ctx.fillStyle = "#C6A15B";
    
    // Ears matching OUSO logo
    ctx.beginPath();
    ctx.moveTo(cat.x + 3, cat.y + 6);
    ctx.lineTo(cat.x - 2, cat.y - 6);
    ctx.lineTo(cat.x + 10, cat.y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cat.x + cat.w - 3, cat.y + 6);
    ctx.lineTo(cat.x + cat.w + 2, cat.y - 6);
    ctx.lineTo(cat.x + cat.w - 10, cat.y);
    ctx.fill();

    // Cat Head Body
    ctx.beginPath();
    ctx.roundRect(cat.x, cat.y, cat.w, cat.h, 9);
    ctx.fill();

    // Eyes (Dark)
    ctx.fillStyle = "#0B0B0C";
    ctx.beginPath();
    ctx.arc(cat.x + 8, cat.y + 11, 3, 0, Math.PI * 2);
    ctx.arc(cat.x + cat.w - 8, cat.y + 11, 3, 0, Math.PI * 2);
    ctx.fill();

    // Smiling Mouth (Matching logo smile)
    ctx.strokeStyle = "#0B0B0C";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cat.x + cat.w / 2, cat.y + 14, 4, 0, Math.PI);
    ctx.stroke();

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
