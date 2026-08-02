/* =========================================================
   Friendship Day — interactions
   Sections: Welcome · Typewriter · Reveal · Scroll animations
             Particles · Hearts · Confetti · Music
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Welcome screen ---------------- */
  const welcome = $("#welcome");
  const app = $("#app");

  function enterExperience() {
    welcome.classList.add("is-out");
    app.classList.add("is-in");
    app.setAttribute("aria-hidden", "false");
    window.setTimeout(() => { welcome.style.display = "none"; }, 950);
    startTypewriter();
    music.start();
  }
  $("#enterBtn").addEventListener("click", enterExperience);

  /* ---------------- Typewriter ---------------- */
  const typeEl = $("#typewriter");
  const LINES = [
    "Of all the people the world could have given me, it gave me you.",
    "Distance never mattered. Silence never mattered.",
    "You stayed — and that changed everything."
  ];

  function startTypewriter() {
    if (reduceMotion) { typeEl.textContent = LINES.join(" "); return; }
    let line = 0, char = 0, deleting = false;
    (function tick() {
      const text = LINES[line];
      typeEl.textContent = deleting ? text.slice(0, char--) : text.slice(0, char++);
      let delay = deleting ? 22 : 38;
      if (!deleting && char > text.length) { deleting = true; delay = 1900; }
      if (deleting && char < 0) { deleting = false; line = (line + 1) % LINES.length; delay = 320; }
      window.setTimeout(tick, delay);
    })();
  }

  /* ---------------- Reveal the wish ---------------- */
  const wish = $("#wish");
  $("#revealBtn").addEventListener("click", () => {
    wish.classList.add("is-open");
    wish.scrollIntoView({ behavior: "smooth", block: "center" });
    burstHearts(18);
    observeReveals();
  });

  $("#celebrateBtn").addEventListener("click", () => {
    confetti.fire();
    burstHearts(26);
  });

  $("#againBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    confetti.fire();
  });

  /* ---------------- Scroll reveal ---------------- */
  let observer;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add("is-visible"), i * 90);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
  }
  observeReveals();

  /* ---------------- Floating hearts ---------------- */
  const heartLayer = $("#hearts");
  const GLYPHS = ["\u2665", "\u2764", "\uD83E\uDD0D", "\u2726"];

  function spawnHeart(fast) {
    const el = document.createElement("span");
    el.className = "heart";
    el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 12 + Math.random() * 22 + "px";
    el.style.animationDuration = (fast ? 5 + Math.random() * 3 : 9 + Math.random() * 7) + "s";
    heartLayer.appendChild(el);
    window.setTimeout(() => el.remove(), 17000);
  }
  function burstHearts(n) { for (let i = 0; i < n; i++) window.setTimeout(() => spawnHeart(true), i * 90); }
  if (!reduceMotion) window.setInterval(() => spawnHeart(false), 1400);

  /* ---------------- Particle field ---------------- */
  const pCanvas = $("#particles");
  const pCtx = pCanvas.getContext("2d");
  let dots = [], dpr = 1;

  function sizeCanvas(canvas) {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }

  function initDots() {
    sizeCanvas(pCanvas);
    const count = Math.round(Math.min(window.innerWidth, 900) / 11);
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      vx: (Math.random() - 0.5) * 0.16 * dpr,
      vy: (-Math.random() * 0.28 - 0.05) * dpr,
      a: Math.random() * 0.5 + 0.2
    }));
  }

  function drawDots() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    dots.forEach((d) => {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -10) { d.y = pCanvas.height + 10; d.x = Math.random() * pCanvas.width; }
      if (d.x < -10) d.x = pCanvas.width + 10;
      if (d.x > pCanvas.width + 10) d.x = -10;
      pCtx.beginPath();
      pCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      pCtx.fillStyle = "rgba(255, 226, 200, " + d.a + ")";
      pCtx.shadowBlur = 10 * dpr;
      pCtx.shadowColor = "rgba(255, 170, 190, 0.8)";
      pCtx.fill();
    });
    if (!reduceMotion) window.requestAnimationFrame(drawDots);
  }
  initDots();
  drawDots();

  /* ---------------- Confetti ---------------- */
  const confetti = (function () {
    const canvas = $("#confetti");
    const ctx = canvas.getContext("2d");
    const COLORS = ["#ffb86b", "#ff6f91", "#f7d9a0", "#ffffff", "#b8508f"];
    let pieces = [], running = false;

    function fire() {
      sizeCanvas(canvas);
      const total = 150;
      for (let i = 0; i < total; i++) {
        pieces.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6,
          y: canvas.height * 0.35 + (Math.random() - 0.5) * 80,
          w: (4 + Math.random() * 6) * dpr,
          h: (7 + Math.random() * 9) * dpr,
          vx: (Math.random() - 0.5) * 9 * dpr,
          vy: (Math.random() * -11 - 3) * dpr,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 0
        });
      }
      if (!running) { running = true; loop(); }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces = pieces.filter((p) => p.life < 260 && p.y < canvas.height + 60);
      pieces.forEach((p) => {
        p.life++;
        p.vy += 0.22 * dpr;
        p.vx *= 0.995;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - p.life / 260);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (pieces.length) { window.requestAnimationFrame(loop); }
      else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }
    return { fire };
  })();

  /* ---------------- One-click source ZIP download ---------------- */
  (function initSourceDownload() {
    const sourceBtns = ["downloadSourceTop", "downloadSourceBottom"];
    sourceBtns.forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", () => {
        confetti.fire();
        burstHearts(12);
      });
    });
  })();

  /* ---------------- Music (file if present, else soft synth pad) ---------------- */
  const music = (function () {
    const btn = $("#musicBtn");
    const audio = new Audio("assets/music.mp3");
    audio.loop = true;
    audio.volume = 1;

    let ctxAudio = null, master = null, voices = [];
    let playing = false, useFile = true;

    function synthOn() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ctxAudio) {
        ctxAudio = new AC();
        master = ctxAudio.createGain();
        master.gain.value = 0;
        master.connect(ctxAudio.destination);
        [220, 277.18, 329.63, 440].forEach((freq, i) => {
          const osc = ctxAudio.createOscillator();
          const gain = ctxAudio.createGain();
          const lfo = ctxAudio.createOscillator();
          const lfoGain = ctxAudio.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.value = 0.09 / (i + 1);
          lfo.frequency.value = 0.07 + i * 0.03;
          lfoGain.gain.value = 0.05;
          lfo.connect(lfoGain).connect(gain.gain);
          osc.connect(gain).connect(master);
          osc.start(); lfo.start();
          voices.push(osc, lfo);
        });
      }
      ctxAudio.resume();
      master.gain.cancelScheduledValues(ctxAudio.currentTime);
      master.gain.linearRampToValueAtTime(0.5, ctxAudio.currentTime + 2.5);
    }

    function synthOff() {
      if (!ctxAudio) return;
      master.gain.cancelScheduledValues(ctxAudio.currentTime);
      master.gain.linearRampToValueAtTime(0, ctxAudio.currentTime + 0.8);
    }

    function play() {
      if (useFile) {
        audio.play().then(() => { playing = true; sync(); }).catch(() => {
          useFile = false; synthOn(); playing = true; sync();
        });
      } else { synthOn(); playing = true; sync(); }
    }

    function pause() {
      audio.pause(); synthOff(); playing = false; sync();
    }

    function sync() {
      btn.setAttribute("aria-pressed", String(playing));
      btn.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
    }

    btn.addEventListener("click", () => (playing ? pause() : play()));
    return { start: play };
  })();

  /* ---------------- Shareable e-card generator ---------------- */
  (function ecard() {
    const canvas = $("#ecardCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const nameEl = $("#ecardName");
    const msgEl = $("#ecardMsg");
    const fromEl = $("#ecardFrom");
    const btn = $("#ecardBtn");
    const dl = $("#ecardDl");
    const shareBtn = $("#ecardShare");
    const status = $("#ecardStatus");

    const wishText = ($(".wish-text") && $(".wish-text").textContent || "").replace(/\s+/g, " ").trim();
    msgEl.value = wishText;

    const PHOTOS = Array.from(document.querySelectorAll(".gallery .frame img")).slice(0, 3);
    let blob = null;

    function loadImage(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    }

    function wrap(text, maxWidth) {
      const words = text.split(/\s+/).filter(Boolean);
      const lines = [];
      let line = "";
      words.forEach((w) => {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
        else { line = test; }
      });
      if (line) lines.push(line);
      return lines;
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function drawCover(img, x, y, w, h, r) {
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.save();
      roundRect(x, y, w, h, r);
      ctx.clip();
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      ctx.restore();
    }

    async function build() {
      status.textContent = "Painting your card…";
      btn.disabled = true;
      const W = canvas.width, H = canvas.height, pad = 80;

      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#2a0a1e");
      bg.addColorStop(0.5, "#1a0512");
      bg.addColorStop(1, "#3b0f1c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      [[220, 240, "rgba(255,150,110,0.30)"], [880, 520, "rgba(255,110,150,0.26)"], [520, 1220, "rgba(255,200,140,0.20)"]]
        .forEach(([cx, cy, color]) => {
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 460);
          g.addColorStop(0, color);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        });

      ctx.strokeStyle = "rgba(255,225,205,0.28)";
      ctx.lineWidth = 2;
      roundRect(pad * 0.55, pad * 0.55, W - pad * 1.1, H - pad * 1.1, 40);
      ctx.stroke();

      // Eyebrow
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,232,215,0.62)";
      ctx.font = "600 26px Manrope, system-ui, sans-serif";
      ctx.fillText("H A P P Y   F R I E N D S H I P   D A Y", W / 2, 190);

      // Title
      const who = (nameEl.value || "").trim();
      const titleGrad = ctx.createLinearGradient(pad, 0, W - pad, 0);
      titleGrad.addColorStop(0, "#ffd9a8");
      titleGrad.addColorStop(0.5, "#ff8fa8");
      titleGrad.addColorStop(1, "#ffc59b");
      ctx.fillStyle = titleGrad;
      ctx.font = "italic 600 96px 'Cormorant Garamond', Georgia, serif";
      ctx.fillText(who ? "For " + who : "For you, always", W / 2, 300);

      // Message
      ctx.fillStyle = "rgba(255,244,238,0.92)";
      ctx.font = "300 38px Manrope, system-ui, sans-serif";
      const msg = (msgEl.value || wishText).replace(/\s+/g, " ").trim();
      const lines = wrap(msg, W - pad * 2.6).slice(0, 7);
      let y = 400;
      lines.forEach((l) => { ctx.fillText(l, W / 2, y); y += 54; });

      // Photos
      const imgs = (await Promise.all(PHOTOS.map((el) => loadImage(el.currentSrc || el.src)))).filter(Boolean);
      const bottomLimit = H - 330;
      const top = Math.max(y + 50, 740);
      if (imgs.length) {
        const gap = 24;
        const cw = (W - pad * 2 - gap * (imgs.length - 1)) / imgs.length;
        const ch = Math.max(180, Math.min(cw * 1.25, 340, bottomLimit - top));
        imgs.forEach((img, i) => {
          const x = pad + i * (cw + gap);
          drawCover(img, x, top, cw, ch, 26);
          ctx.strokeStyle = "rgba(255,225,205,0.25)";
          ctx.lineWidth = 2;
          roundRect(x, top, cw, ch, 26);
          ctx.stroke();
        });
      }

      // Signature
      const sign = (fromEl.value || "").trim();
      ctx.fillStyle = "rgba(255,214,180,0.9)";
      ctx.font = "italic 500 44px 'Cormorant Garamond', Georgia, serif";
      ctx.fillText(sign ? "— " + sign + " \u2661" : "— always yours \u2661", W / 2, H - 180);

      ctx.fillStyle = "rgba(253,238,230,0.42)";
      ctx.font = "600 22px Manrope, system-ui, sans-serif";
      ctx.fillText("M A D E   W I T H   H E A R T S ,   N O T   T E M P L A T E S", W / 2, H - 110);

      canvas.classList.add("is-ready");

      await new Promise((resolve) => canvas.toBlob((b) => {
        blob = b;
        if (b) {
          if (dl.dataset.url) URL.revokeObjectURL(dl.dataset.url);
          const url = URL.createObjectURL(b);
          dl.href = url;
          dl.dataset.url = url;
          dl.download = (who ? "friendship-day-" + who.toLowerCase().replace(/\s+/g, "-") : "friendship-day-card") + ".png";
          dl.classList.remove("is-hidden");
        }
        resolve();
      }, "image/png"));

      if (navigator.canShare && blob) {
        try {
          const file = new File([blob], dl.download, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) shareBtn.classList.remove("is-hidden");
        } catch (e) { /* sharing unsupported */ }
      }

      status.textContent = "Your card is ready — download it or share it.";
      btn.disabled = false;
      confetti.fire();
      burstHearts(14);
    }

    btn.addEventListener("click", () => {
      build().catch(() => {
        status.textContent = "Something went wrong making the card. Try again.";
        btn.disabled = false;
      });
    });

    shareBtn.addEventListener("click", async () => {
      if (!blob) return;
      try {
        await navigator.share({
          files: [new File([blob], dl.download, { type: "image/png" })],
          title: "Happy Friendship Day",
          text: "A little something for you 🤍"
        });
      } catch (e) { /* user cancelled */ }
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.catch(() => {});
  })();


  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(initDots, 200);
  });
})();
