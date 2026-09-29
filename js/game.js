/*
  OUSO — ARCADE BREAKOUT GAME (Harder & OUSO Cat Themed)
  ------------------------------------------------------------
  Difficulty upgrades vs the original:
    - stronger gravity + relatively weaker jump (tighter margin)
    - platforms shrink as your score grows (min width enforced)
    - some platforms drift left/right, so timing matters
    - landing tolerance cut from 8px to 3px (must land more precisely)
    - each platform only ever pays out points ONCE (10 points),
      so bouncing on the same spot earns nothing more — climbing
      across many new platforms is the only way to score high
*/

TOOL_RENDERERS["breakout-game"] = renderBreakoutGame;

function renderBreakoutGame(root) {
  root.innerHTML = `
    <div class="tool-ui" style="text-align: center;">
      <p class="tool-meta">Help OUSO Cat jump! It's faster and tighter now — platforms shrink and drift as you climb. Use <strong style="color:var(--c-gold)">Space / Click</strong> to Jump, <strong style="color:var(--c-gold)">← →</strong> to steer.</p>
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

  let cat = {
    x: 185,
    y: 350,
    w: 26,
    h: 26,
    vx: 0,
    vy: 0,
    jump: -10.5
  };

  const GRAVITY = 0.55;
  const LAND_TOLERANCE = 3;
  const MOVE_SPEED = 6;

  let platforms = [];

  function platformWidthFor(currentScore) {
    return Math.max(34, 70 - Math.floor(currentScore / 120) * 4);
  }

  function makePlatform(x, y) {
    const w = platformWidthFor(score);
    const isMoving = Math.random() < Math.min(0.15 + score / 1500, 0.55);
    return {
      x: Math.min(Math.max(x, 0), canvas.width - w),
      y,
      w,
      h: 10,
      moving: isMoving,
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: 1 + Math.random() * (1.4 + score / 900),
      scored: false // each platform only ever pays out points once
    };
  }

  function initPlatforms() {
    platforms = [
      makePlatform(160, 450),
      makePlatform(60, 320),
      makePlatform(240, 190),
      makePlatform(130, 70)
    ];
    platforms[0].moving = false;
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

  window.addEventListener("keydown", (e) => {
    if (!gameRunning) return;
    if (e.code === "Space" || e.code === "ArrowUp") {
      cat.vy = cat.jump;
      e.preventDefault();
    }
    if (e.code === "ArrowLeft") cat.vx = -MOVE_SPEED;
    if (e.code === "ArrowRight") cat.vx = MOVE_SPEED;
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") cat.vx = 0;
  });

  canvas.addEventListener("click", () => {
    if (gameRunning) cat.vy = cat.jump;
  });

  function update() {
    cat.vy += GRAVITY;
    cat.y += cat.vy;
    cat.x += cat.vx;

    if (cat.x < 0) cat.x = 0;
    if (cat.x > canvas.width - cat.w) cat.x = canvas.width - cat.w;

    platforms.forEach(p => {
      if (p.moving) {
        p.x += p.dir * p.speed;
        if (p.x <= 0 || p.x + p.w >= canvas.width) p.dir *= -1;
      }
    });

    // Landing always makes the cat jump again, but points are only
    // ever paid out the FIRST time a given platform is landed on.
    platforms.forEach(p => {
      if (
        cat.vy > 0 &&
        cat.x + cat.w > p.x &&
        cat.x < p.x + p.w &&
        cat.y + cat.h >= p.y &&
        cat.y + cat.h <= p.y + p.h + LAND_TOLERANCE
      ) {
        cat.vy = cat.jump;
        if (!p.scored) {
          score += 10;
          p.scored = true;
        }
      }
    });

    if (cat.y < 200) {
      let diff = 200 - cat.y;
      cat.y = 200;
      platforms.forEach(p => {
        p.y += diff;
        if (p.y > canvas.height) {
          const fresh = makePlatform(Math.random() * (canvas.width - 40), 0);
          p.x = fresh.x; p.y = 0; p.w = fresh.w;
          p.moving = fresh.moving; p.dir = fresh.dir; p.speed = fresh.speed;
          p.scored = false; // it's a "new" platform now, so it can pay out again
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

    platforms.forEach(p => {
      ctx.fillStyle = p.moving ? "#E7C77E" : "#C6A15B";
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 5);
      ctx.fill();
    });

    ctx.fillStyle = "#C6A15B";

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

    ctx.beginPath();
    ctx.roundRect(cat.x, cat.y, cat.w, cat.h, 9);
    ctx.fill();

    ctx.fillStyle = "#0B0B0C";
    ctx.beginPath();
    ctx.arc(cat.x + 7, cat.y + 10, 3, 0, Math.PI * 2);
    ctx.arc(cat.x + cat.w - 7, cat.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#0B0B0C";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cat.x + cat.w / 2, cat.y + 13, 4, 0, Math.PI);
    ctx.stroke();

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
