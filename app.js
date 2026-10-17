(() => {
  "use strict";

  // External destinations are centralized in config.js; never link to dummy forms.
  const config = window.RECRUIT_CONFIG || {};
  const status = document.querySelector("#link-status");
  const destinations = {
    form: {
      value: config.googleFormUrl,
      label: "Googleフォーム",
      valid: (url) =>
        /^(forms\.gle|docs\.google\.com)$/.test(url.hostname) &&
        (url.hostname === "forms.gle" || url.pathname.startsWith("/forms/")),
    },
    line: {
      value: config.lineOpenChatUrl,
      label: "LINEオープンチャット",
      valid: (url) =>
        url.hostname === "line.me" && url.pathname.startsWith("/ti/g2/"),
    },
  };
  const pending = [];
  document.querySelectorAll("[data-join]").forEach((link) => {
    const destination = destinations[link.dataset.join];
    let url;
    try {
      const candidate = new URL(destination.value);
      if (candidate.protocol === "https:" && destination.valid(candidate))
        url = candidate;
    } catch {
      /* Unconfigured links intentionally remain on this page. */
    }
    if (url) {
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      pending.push(destination.label);
      link.setAttribute("aria-describedby", "link-status");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        status.textContent = `${destination.label}のリンクは準備中です。公開までお待ちください。`;
        status.classList.remove("highlight");
        requestAnimationFrame(() => status.classList.add("highlight"));
      });
    }
  });
  status.textContent = pending.length
    ? `${pending.join("・")}のリンクは準備中です。公開までお待ちください。`
    : "参加はGoogleフォームから。質問はLINEオープンチャットへどうぞ。";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.querySelector(".motion-toggle");
  let paused = reducedMotion.matches;
  function applyMotion() {
    document.documentElement.classList.toggle("motion-paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.innerHTML = paused
      ? '動きを再生する <span aria-hidden="true">▶</span>'
      : '動きを止める <span aria-hidden="true">Ⅱ</span>';
  }
  applyMotion();
  motionButton.addEventListener("click", () => {
    paused = !paused;
    applyMotion();
  });
  reducedMotion.addEventListener("change", () => {
    paused = reducedMotion.matches;
    applyMotion();
  });
  const art = document.querySelector(".hero-art");
  art.addEventListener("pointermove", (event) => {
    if (paused || reducedMotion.matches || event.pointerType === "touch")
      return;
    const rect = art.getBoundingClientRect();
    art.style.setProperty(
      "--art-x",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`,
    );
    art.style.setProperty(
      "--art-y",
      `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`,
    );
  });
  art.addEventListener("pointerleave", () => {
    art.style.setProperty("--art-x", "0px");
    art.style.setProperty("--art-y", "0px");
  });

  // A real, deliberately small game: one movable DOM target works with touch and keyboard.
  const arena = document.querySelector("#game-arena");
  const intro = document.querySelector("#game-intro");
  const target = document.querySelector("#game-target");
  const result = document.querySelector("#game-result");
  const scoreNode = document.querySelector("#game-score");
  const timeNode = document.querySelector("#time-left");
  const bestNode = document.querySelector("#best-score");
  const live = document.querySelector("#game-live");
  let score = 0;
  let best = 0;
  let playing = false;
  let deadline = 0;
  let timer;
  let lastHit = -Infinity;
  try {
    best = Math.max(0, Number(localStorage.getItem("nagata80-best")) || 0);
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  bestNode.textContent = String(best).padStart(2, "0");

  function moveTarget() {
    const padding = 15;
    const maxX = Math.max(
      0,
      arena.clientWidth - target.offsetWidth - padding * 2,
    );
    const maxY = Math.max(
      0,
      arena.clientHeight - target.offsetHeight - padding * 2,
    );
    target.style.left = `${padding + Math.random() * maxX}px`;
    target.style.top = `${padding + Math.random() * maxY}px`;
  }
  function finishGame() {
    if (!playing) return;
    playing = false;
    clearInterval(timer);
    target.hidden = true;
    timeNode.textContent = "0.0";
    document.querySelector("#final-score").textContent = score;
    document.querySelector("#game-message").textContent =
      score >= 15
        ? "すごい！その集中力、ものづくりの才能かも。"
        : "そのひらめき、開発班で活かそう。";
    if (score > best) {
      best = score;
      bestNode.textContent = String(best).padStart(2, "0");
      try {
        localStorage.setItem("nagata80-best", String(best));
      } catch {
        /* The game works without persistence. */
      }
    }
    result.hidden = false;
    live.textContent = `ゲーム終了。${score}個のひらめきをキャッチしました。`;
    document.querySelector("#game-restart").focus({ preventScroll: true });
  }
  function startGame() {
    clearInterval(timer);
    score = 0;
    lastHit = -Infinity;
    playing = true;
    scoreNode.textContent = "00";
    timeNode.textContent = "15.0";
    intro.hidden = true;
    result.hidden = true;
    target.hidden = false;
    deadline = performance.now() + 15000;
    moveTarget();
    target.focus({ preventScroll: true });
    live.textContent =
      "ゲーム開始。15秒で星をキャッチ。タップ、クリック、またはEnter・スペースキーで遊べます。";
    timer = setInterval(() => {
      const left = Math.max(0, (deadline - performance.now()) / 1000);
      timeNode.textContent = left.toFixed(1);
      if (left <= 0) finishGame();
    }, 50);
  }
  target.addEventListener("click", () => {
    const now = performance.now();
    if (!playing) return;
    if (now >= deadline) {
      finishGame();
      return;
    }
    if (now - lastHit < 80) return;
    lastHit = now;
    score += 1;
    scoreNode.textContent = String(score).padStart(2, "0");
    if (!paused && !reducedMotion.matches) {
      const pop = document.createElement("span");
      pop.className = "score-pop";
      pop.textContent = "+1";
      pop.style.left = `${target.offsetLeft + 18}px`;
      pop.style.top = `${target.offsetTop}px`;
      arena.append(pop);
      pop.addEventListener("animationend", () => pop.remove(), { once: true });
      setTimeout(() => pop.remove(), 800);
    }
    moveTarget();
  });
  document.querySelector("#game-start").addEventListener("click", startGame);
  document.querySelector("#game-restart").addEventListener("click", startGame);
  window.addEventListener("resize", () => {
    if (playing) moveTarget();
  });
  window.addEventListener("pagehide", () => clearInterval(timer));
})();
