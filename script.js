/* =========================================================
   SCP-KΣ-0001 — интерактив (vanilla JS, без сборки)
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS =
    "█▓▒░<>/\\|¦=+*#@%&$АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function rand(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  /* ---------- LANGUAGE ---------- */
  var lang = document.documentElement.lang === "en" ? "en" : "ru";
  var locale = lang === "en" ? "en-GB" : "ru-RU";

  /* ---------- BOOT SEQUENCE ---------- */
  var bootLinesByLang = {
    ru: [
      "> ЗАЩИЩЁННЫЙ ТЕРМИНАЛ ФОНДА SCP                               ",
      "> ЗАПУСК . . . . . . . . . . . . . . . . . . . . . . [ УСПЕХ ]",
      "> УСТАНОВКА СОЕДИНЕНИЯ . . . . . . . . . . . . . . . [ OK ]",
      "> ПРОВЕРКА ДОПУСКА . . . . . . . . . . . . . . . . . УРОВЕНЬ null.kosstarthe1st.w͚̙̏ͭ͡ẽ̩͍͍̈͞l̛͈̗̼̉c͉̰̲͈̅o̷̺̥͈͖͌ͪm̢̗̞̉ͣ͌ͅe͈͚̘ͮͬ͌",
      "> РАСШИФРОВКА АРХИВА KΣ-0001 . . . . . . . . . . . . [ OK ]",
      "> СКАНИРОВАНИЕ ЦЕЛОСТНОСТИ ФАЙЛА . . . . . . . . . . АНОМАЛИЯ",
      "> ВНИМАНИЕ: ОБЪЕКТ РЕАГИРУЕТ НА ПРОСМОТР",
      "> ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ПРИВЕТ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
      "> ЗАГРУЗКА ФАЙЛА ЗАВЕРШЕНА.",
    ],
    en: [
      "> SECURE TERMINAL — SCP FOUNDATION                              ",
      "> STARTING . . . . . . . . . . . . . . . . . . . . . [ SUCCESS ]",
      "> ESTABLISHING CONNECTION  . . . . . . . . . . . . . [ OK ]",
      "> VERIFYING CLEARANCE  . . . . . . . . . . . . . . . LEVEL null.kosstarthe1st.w͚̙̏ͭ͡ẽ̩͍͍̈͞l̛͈̗̼̉c͉̰̲͈̅o̷̺̥͈͖͌ͪm̢̗̞̉ͣ͌ͅe͈͚̘ͮͬ͌",
      "> DECRYPTING ARCHIVE KΣ-0001 . . . . . . . . . . . . [ OK ]",
      "> SCANNING FILE INTEGRITY  . . . . . . . . . . . . . ANOMALY",
      "> WARNING: OBJECT REACTS TO OBSERVATION",
      "> ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ HELLO ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
      "> FILE LOAD COMPLETE.",
    ],
  };
  var bootLines = bootLinesByLang[lang];
  var SKIP_LABEL = lang === "en" ? "SKIP ▸" : "ПРОПУСТИТЬ ▸";

  var boot = document.getElementById("boot");
  var bootLog = document.getElementById("boot-log");
  var bootEnter = document.getElementById("boot-enter");
  var bootSkip = document.getElementById("boot-skip");
  var bootTimer = null;
  var bootDone = false;

  function finishBoot() {
    if (bootTimer) {
      clearTimeout(bootTimer);
      bootTimer = null;
    }
    bootDone = true;
    if (bootLog) bootLog.textContent = bootLines.join("\n");
    if (bootEnter) bootEnter.hidden = false;
    if (bootSkip) bootSkip.hidden = true;
  }

  function runBoot() {
    if (reduce) {
      finishBoot();
      return;
    }
    var li = 0,
      ci = 0,
      text = "";
    function type() {
      if (bootDone) return;
      if (li >= bootLines.length) {
        finishBoot();
        return;
      }
      var line = bootLines[li];
      if (ci <= line.length) {
        bootLog.textContent = text + line.slice(0, ci);
        ci++;
        bootTimer = setTimeout(type, 12 + Math.random() * 22);
      } else {
        text += line + "\n";
        li++;
        ci = 0;
        bootTimer = setTimeout(type, 180);
      }
    }
    type();
  }

  function closeBoot() {
    if (bootAudio) {
      bootAudio.pause();
    }
    if (boot) boot.classList.add("gone");
    // Снимаем boot-lock, но сохраняем blackout-lock если он активен
    document.body.classList.remove("boot-active", "gate-active");
    if (!document.body.classList.contains("blackout-active")) {
      unlockBlackoutScroll();
    }
    setTimeout(function () {
      if (boot) boot.style.display = "none";
    }, 700);
  }

  /* ---------- ELEMENTS: terminal / blackout / flood ---------- */
  var gate = document.getElementById("gate");
  var gateEnter = document.getElementById("gate-enter");
  var termEl = document.getElementById("site-terminal");
  var termLogEl = document.getElementById("term-log");
  var termInput = document.getElementById("term-input");
  var termToggle = document.getElementById("term-toggle");
  var termClose = document.getElementById("term-close");
  var blackoutEl = document.getElementById("blackout");
  var floodEl = document.getElementById("kst-flood");
  var BLACKOUT_KEY = "scp-blackout-until";
  var ERASURE_KEY = "scp-erasure-active";
  var BLACKOUT_DURATION = 10 * 60 * 1000;
  var ERASURE_COOKIE_AGE = 60 * 60 * 24 * 365 * 10;
  var blackoutTimer = null;
  var blackoutCountdown = null;
  var escalationIntervalId = null;
  var sessionId =
    "SID-" +
    Math.random().toString(16).slice(2, 10).toUpperCase() +
    "-" +
    Date.now().toString(36).toUpperCase();
  function nowTs() {
    return new Date().toLocaleTimeString(locale, { hour12: false });
  }

  /* ---------- TERMINAL LOGIC ---------- */
  function termAddEntry(html, cls) {
    if (!termLogEl) return;
    var div = document.createElement("div");
    div.className = "term-entry " + (cls || "info");
    var ts = document.createElement("span");
    ts.className = "ts";
    ts.textContent = "[" + nowTs() + "]";
    div.appendChild(ts);
    var span = document.createElement("span");
    span.innerHTML = " " + html;
    div.appendChild(span);
    termLogEl.appendChild(div);
    termLogEl.scrollTop = termLogEl.scrollHeight;
  }
  function termLog(msg, type) {
    type = type || "info";
    termAddEntry(msg, type);
  }
  function termOpen() {
    if (!termEl) return;
    termEl.classList.remove("hidden");
    termEl.setAttribute("aria-hidden", "false");
    if (termInput) termInput.focus();
    termLog("terminal opened", "cmd");
    runClearanceGlitch();
  }
  function termCloseFn() {
    if (!termEl) return;
    termEl.classList.add("hidden");
    termEl.setAttribute("aria-hidden", "true");
  }
  if (termToggle) {
    termToggle.addEventListener("click", function () {
      if (termEl && termEl.classList.contains("hidden")) termOpen();
      else termCloseFn();
    });
  }
  if (termClose) {
    termClose.addEventListener("click", termCloseFn);
  }
  document.addEventListener("keydown", function (e) {
    var ae = document.activeElement;
    var inTerm = ae && (ae.id === "term-input" || (termEl && termEl.contains(ae)));

    if (e.key === "Escape" && termEl && !termEl.classList.contains("hidden")) {
      termCloseFn();
      return;
    }
    if (!inTerm && (e.key === "`" || e.key === "ё")) {
      if (termEl) {
        e.preventDefault();
        if (termEl.classList.contains("hidden")) termOpen();
        else termCloseFn();
      }
    }
  });

  if (checkErasureOnLoad()) {
    return;
  }

  var clearanceEntryId = "clr-entry-" + Date.now();
  var clearanceGlitchDone = false;
  function initTerminalLogs() {
    termLog(
      lang === "en"
        ? "FIELD TERMINAL v0.7.3-B // BUILD " + Date.now().toString(36)
        : "ПОЛЕВОЙ ТЕРМИНАЛ v0.7.3-B // СБОРКА " + Date.now().toString(36),
      "sys"
    );
    termLog("SESSION ID: <b>" + sessionId + "</b>", "info");
    termLog(
      lang === "en"
        ? "Location trace: LAT " + (50 + Math.random() * 10).toFixed(4) + " LON " + (30 + Math.random() * 10).toFixed(4) + " [IP MASKED]"
        : "Трассировка местоположения: ШИР " + (50 + Math.random() * 10).toFixed(4) + " ДОЛ " + (30 + Math.random() * 10).toFixed(4) + " [IP СКРЫТ]",
      "info"
    );
    var clrText =
      lang === "en"
        ? "Clearance verification: LVL 4 REQUIRED // CURRENT: LVL 0"
        : "Проверка допуска: ТРЕБУЕТСЯ УРОВЕНЬ 4 // ТЕКУЩИЙ: УРОВЕНЬ 0";
    termAddEntry(clrText, "err");
    var allEntries = termLogEl ? termLogEl.querySelectorAll(".term-entry") : [];
    if (allEntries.length > 0) {
      allEntries[allEntries.length - 1].id = clearanceEntryId;
    }
  }
  setTimeout(initTerminalLogs, 500);

  function runClearanceGlitch() {
    if (clearanceGlitchDone) return;
    clearanceGlitchDone = true;
    var entry = document.getElementById(clearanceEntryId);
    if (!entry) return;
    setTimeout(function () {
      entry.innerHTML = entry.innerHTML
        .replace(/CURRENT: LVL 0/, 'CURRENT: LVL <span style="color:#36e0e6">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>')
        .replace(/ТЕКУЩИЙ: УРОВЕНЬ 0/, 'ТЕКУЩИЙ: УРОВЕНЬ <span style="color:#36e0e6">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>');
    }, 500);
    setTimeout(function () {
      entry.className = "term-entry sys";
      entry.innerHTML = entry.innerHTML
        .replace(/CURRENT: LVL <span[^>]*>▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓<\/span>/, 'CURRENT: LVL <b>kosstarthe1st.welcome</b>')
        .replace(/ТЕКУЩИЙ: УРОВЕНЬ <span[^>]*>▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓<\/span>/, 'ТЕКУЩИЙ: УРОВЕНЬ <b>kosstarthe1st.welcome</b>');
    }, 1300);
    setTimeout(function () {
      termLog(
        lang === "en"
          ? "File access granted // Monitoring user interaction..."
          : "Доступ к файлу предоставлен // Мониторинг действий пользователя...",
        "sys"
      );
    }, 2200);
  }

  /* ---------- BLACKOUT / COOKIE PERSISTENCE ---------- */
  function setBlackoutCookie(until) {
    try {
      localStorage.setItem(BLACKOUT_KEY, String(until));
      document.cookie = BLACKOUT_KEY + "=" + until + "; max-age=" + 10 * 60 + "; path=/";
    } catch (e) {}
  }
  function clearBlackoutStorage() {
    try {
      localStorage.removeItem(BLACKOUT_KEY);
      document.cookie = BLACKOUT_KEY + "=; Max-Age=0; path=/";
      sessionStorage.removeItem(BLACKOUT_KEY);
    } catch (e) {}
  }
  function getBlackoutUntil() {
    try {
      var v = localStorage.getItem(BLACKOUT_KEY);
      if (v) return parseInt(v, 10);
      var m = document.cookie.match(new RegExp("(?:^| )" + BLACKOUT_KEY + "=([^;]+)"));
      if (m) return parseInt(decodeURIComponent(m[1]), 10);
    } catch (e) {}
    return 0;
  }
  function setErasureState() {
    try {
      localStorage.setItem(ERASURE_KEY, "1");
      document.cookie = ERASURE_KEY + "=1; max-age=" + ERASURE_COOKIE_AGE + "; path=/";
    } catch (e) {}
  }
  function clearErasureState() {
    try {
      localStorage.removeItem(ERASURE_KEY);
      document.cookie = ERASURE_KEY + "=; Max-Age=0; path=/";
      sessionStorage.removeItem(ERASURE_KEY);
    } catch (e) {}
  }
  function isErasureActive() {
    try {
      var v = localStorage.getItem(ERASURE_KEY);
      if (v === "1") return true;
      var m = document.cookie.match(new RegExp("(?:^| )" + ERASURE_KEY + "=([^;]+)"));
      if (m) return decodeURIComponent(m[1]) === "1";
    } catch (e) {}
    return false;
  }
  function resolve404Path() {
    return "./404.html";
  }
  function redirectToErasedDocument() {
    window.location.replace(resolve404Path());
  }
  function checkErasureOnLoad() {
    if (!isErasureActive()) return false;
    if (/\/404\.html$/i.test(window.location.pathname)) return false;
    redirectToErasedDocument();
    return true;
  }
  /* Гасит прокрутку страницы, пока активен блэкаут. Терминал скроллится сам,
     потому что события внутри него не всплывают до этого обработчика. */
  function blockBlackoutScroll(e) {
    if (termEl && termEl.contains(e.target)) return;
    e.preventDefault();
  }
  function blockBlackoutKeys(e) {
    var ae = document.activeElement;
    if (ae && (ae.id === "term-input" || (termEl && termEl.contains(ae)))) return;
    var keys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar",
    ];
    if (keys.indexOf(e.key) !== -1) e.preventDefault();
  }
  var blackoutScrollLocked = false;
  function lockBlackoutScroll() {
    if (blackoutScrollLocked) return;
    blackoutScrollLocked = true;
    window.addEventListener("wheel", blockBlackoutScroll, { passive: false });
    window.addEventListener("touchmove", blockBlackoutScroll, { passive: false });
    window.addEventListener("keydown", blockBlackoutKeys, false);
  }
  function unlockBlackoutScroll() {
    if (!blackoutScrollLocked) return;
    blackoutScrollLocked = false;
    window.removeEventListener("wheel", blockBlackoutScroll, { passive: false });
    window.removeEventListener("touchmove", blockBlackoutScroll, { passive: false });
    window.removeEventListener("keydown", blockBlackoutKeys, false);
  }
  function setBlackoutUiActive(active) {
    document.body.classList.toggle("blackout-active", !!active);
    if (active) {
      lockBlackoutScroll();
    } else {
      unlockBlackoutScroll();
    }
    if (termToggle) {
      termToggle.setAttribute(
        "title",
        active
          ? (lang === "en" ? "Open recovery terminal" : "Открыть терминал восстановления")
          : ""
      );
    }
  }
  function activateBlackout() {
    var until = Date.now() + BLACKOUT_DURATION;
    setBlackoutCookie(until);
    setBlackoutUiActive(true);
    if (blackoutEl) {
      blackoutEl.classList.remove("hidden");
      var inner = blackoutEl.querySelectorAll(".blackout-inner");
      var firstInner = inner[0];
      if (blackoutCountdown) clearInterval(blackoutCountdown);
      blackoutCountdown = setInterval(function () {
        var now = Date.now();
        var diff = until - now;
        if (diff <= 0) {
          clearInterval(blackoutCountdown);
          deactivateBlackout();
          termLog(lang === "en" ? "BLACKOUT protocol no longer active — signal restored" : "Действие протокола BLACKOUT прекращено — сигнал восстановлен", "sys");
          return;
        }
        var mm = Math.floor(diff / 60000);
        var ss = Math.floor((diff % 60000) / 1000);
        var txt = (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
        if (firstInner)
          firstInner.textContent =
            (lang === "en" ? "SIGNAL LOST // BLACKOUT PROTOCOL — " : "СИГНАЛ ПОТЕРЯН // ПРОТОКОЛ BLACKOUT — ") + txt;
      }, 1000);
      var mm0 = 10,
        ss0 = 0;
      if (firstInner)
        firstInner.textContent =
          (lang === "en" ? "SIGNAL LOST // BLACKOUT PROTOCOL — " : "СИГНАЛ ПОТЕРЯН // ПРОТОКОЛ BLACKOUT — ") +
          (mm0 < 10 ? "0" : "") +
          mm0 +
          ":" +
          (ss0 < 10 ? "0" : "") +
          ss0;
    }
    termLog(lang === "en" ? "[CRITICAL] BLACKOUT PROTOCOL ENGAGED — 10:00" : "[КРИТИЧНО] ПРОТОКОЛ BLACKOUT АКТИВИРОВАН — 10:00", "cog");
    termLog(lang === "en" ? "Recovery terminal remains available via >_" : "Терминал восстановления доступен через >_", "warn");
  }
  function deactivateBlackout() {
    if (blackoutEl) blackoutEl.classList.add("hidden");
    setBlackoutUiActive(false);
    if (floodEl) {
      floodEl.classList.add("hidden");
      floodEl.innerHTML = "";
    }
    clearBlackoutStorage();
    if (blackoutCountdown) {
      clearInterval(blackoutCountdown);
      blackoutCountdown = null;
    }
    if (blackoutTimer) {
      clearTimeout(blackoutTimer);
      blackoutTimer = null;
    }
  }
  function checkBlackoutOnLoad() {
    var until = getBlackoutUntil();
    if (until && Date.now() < until) {
      setBlackoutUiActive(true);
      if (blackoutEl) blackoutEl.classList.remove("hidden");
      var inner = blackoutEl ? blackoutEl.querySelectorAll(".blackout-inner")[0] : null;
      if (blackoutCountdown) clearInterval(blackoutCountdown);
      blackoutCountdown = setInterval(function () {
        var now = Date.now();
        var diff = until - now;
        if (diff <= 0) {
          clearInterval(blackoutCountdown);
          deactivateBlackout();
          termLog(lang === "en" ? "BLACKOUT protocol no longer active — signal restored" : "Действие протокола BLACKOUT прекращено — сигнал восстановлен", "sys");
          return;
        }
        var mm = Math.floor(diff / 60000);
        var ss = Math.floor((diff % 60000) / 1000);
        if (inner)
          inner.textContent =
            (lang === "en" ? "SIGNAL LOST // BLACKOUT PROTOCOL — " : "СИГНАЛ ПОТЕРЯН // ПРОТОКОЛ BLACKOUT — ") +
            (mm < 10 ? "0" : "") +
            mm +
            ":" +
            (ss < 10 ? "0" : "") +
            ss;
      }, 1000);
      termLog(
        lang === "en"
          ? "[CRITICAL] BLACKOUT PROTOCOL PERSISTS — " + Math.ceil((until - Date.now()) / 60000) + " min remaining. Use reboot to clear."
          : "[КРИТИЧНО] ПРОТОКОЛ BLACKOUT СОХРАНЯЕТСЯ — осталось " + Math.ceil((until - Date.now()) / 60000) + " мин. Используйте reboot для сброса.",
        "cog"
      );
      termLog(lang === "en" ? "Recovery terminal remains available via >_" : "Терминал восстановления доступен через >_", "warn");
    }
  }
  checkBlackoutOnLoad();

  /* ---------- FLOOD OF TEXTS (EASTER EGG) ---------- */
  function startKSTTextFlood() {
    if (!floodEl) {
      floodEl = document.createElement("div");
      floodEl.id = "kst-flood";
      floodEl.className = "kst-flood";
      document.body.appendChild(floodEl);
    }
    floodEl.classList.remove("hidden");
    floodEl.innerHTML = "";
    var count = 200;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.textContent = "kosstar the 1st";
      span.style.left = (Math.random() * 100).toFixed(2) + "%";
      span.style.top = (Math.random() * 100).toFixed(2) + "%";
      span.style.transform =
        "rotate(" + (Math.random() * 120 - 60).toFixed(1) + "deg) translate(-50%,-50%)";
      span.style.opacity = (0.15 + Math.random() * 0.85).toFixed(2);
      span.style.fontSize = (12 + Math.random() * 32).toFixed(0) + "px";
      span.style.textShadow =
        "0 0 " + (8 + Math.random() * 16).toFixed(0) + "px rgba(210,58,66," + (0.4 + Math.random() * 0.6).toFixed(2) + ")";
      floodEl.appendChild(span);
    }
    termLog(lang === "en" ? "[CRITICAL] K-class textual flood // containment failure" : "[КРИТИЧНО] Текстовый поток класса K // сдерживание невозможно", "cog");
    blackoutTimer = setTimeout(function () {
      activateBlackout();
    }, 3500);
  }

  /* ---------- BOOT AUDIO ---------- */
  var bootAudio = document.getElementById("boot-audio");
  var audioStarted = false;

  /* ---------- ACCESS GATE (перед интро) ---------- */
  gate = document.getElementById("gate");
  gateEnter = document.getElementById("gate-enter");
  var bootStarted = false;

  // ===== INTRO SCROLL LOCK (gate/boot as blackout) =====
  (function initIntroLocks() {
    var until = getBlackoutUntil();
    var isBlackout = until && Date.now() < until;
    if (isBlackout) return; // blackout already locks
    if (gate) {
      document.body.classList.add("gate-active");
      lockBlackoutScroll();
    } else if (boot) {
      document.body.classList.add("boot-active");
      lockBlackoutScroll();
    }
  })();

  function startBoot() {
    if (bootStarted) return;
    bootStarted = true;
    var bootAudio = document.getElementById("boot-audio");
    if (bootAudio) {
      bootAudio.volume = 0.85;
      bootAudio.currentTime = 0;
      bootAudio.play().catch(function (e) {
        console.warn("Audio play failed, waiting for user gesture:", e);
      });
    }
    runBoot();
  }
  function closeGate() {
    if (!gate) return;
    gate.classList.add("gone");
    document.body.classList.remove("gate-active");
    // Переходим к boot-фазе, оставляя скролл заблокированным
    if (boot && boot.style.display !== "none") {
      document.body.classList.add("boot-active");
      // lock уже активен с gate, не снимаем
    }
    setTimeout(function () {
      gate.style.display = "none";
    }, 500);
  }
  if (boot && bootLog && bootEnter) {
    if (bootSkip) {
      bootSkip.textContent = SKIP_LABEL;
      bootSkip.hidden = false;
      bootSkip.addEventListener("click", function () {
        if (!bootDone) finishBoot();
        else closeBoot();
      });
    }
    bootEnter.addEventListener("click", closeBoot);
    if (gate && gateEnter) {
      gateEnter.addEventListener("click", function () {
        closeGate();
        startBoot();
      });
    } else {
      startBoot();
    }
  }

  /* ---------- CLOCK ---------- */
  var clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString(locale, {
      hour12: false,
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- SCROLL PROGRESS ---------- */
  var progress = document.getElementById("progress");
  function onScroll() {
    if (!progress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = p + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- SCROLL REVEAL ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- ACCORDIONS ---------- */
  document.querySelectorAll(".fold-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var fold = btn.parentElement;
      var body = fold ? fold.querySelector(".fold-body") : null;
      var open = fold.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var sign = btn.querySelector(".fold-sign");
      if (sign) sign.textContent = open ? "—" : "+";
      if (body) {
        body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
      }
      if (fold && fold.id === "erasure-order") {
        erasureOrderOpen = open;
        if (open) {
          setTimeout(handleErasureOrderOpened, 260);
        }
      }
    });
  });

  /* ---------- MOBILE TOUCH FOR REDACTED / GHOST ---------- */
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll(".redacted").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var isRevealed = el.classList.toggle("touch-reveal");
        if (isRevealed) {
          setTimeout(function () {
            el.classList.remove("touch-reveal");
          }, 2500);
        }
      });
    });
    document.querySelectorAll(".ghost").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var isRevealed = el.classList.toggle("touch-show");
        if (isRevealed) {
          setTimeout(function () {
            el.classList.remove("touch-show");
          }, 3000);
        }
      });
    });
  }

  /* ---------- ESCALATION MECHANIC (K-MENTIONS) ---------- */
  var mentions = document.querySelectorAll("[data-kmention]");
  var baseTotalMentions = mentions.length;
  var dynamicTotalMentions = baseTotalMentions;
  var unlockedCount = 0;
  var isEasterEggActive = false;
  var encryptionModeActive = false;
  var hoverlessPointer = window.matchMedia("(hover: none)").matches;
  var UNLOCKED_HOVER = lang === "en" ? "There is no way back" : "Пути назад нет";
  var LOCKED_HOVER =
    lang === "en"
      ? "Designation classified // Click to decrypt"
      : "Обозначение засекречено // Нажмите для дешифровки";
  var ENCRYPTION_HOVER =
    lang === "en"
      ? "Keep the encryption cursor over the designation"
      : "Удерживайте курсор шифрования над обозначением";
  var ENCRYPTION_FIX =
    lang === "en"
      ? "Encryption complete // Click to lock cipher"
      : "Шифрование завершено // Нажмите для фиксации шифра";
  var erasureOrderOpen = false;
  var documentInfectionPhaseActive = false;
  var documentScanComplete = false;
  var infectionRecords = [];
  var infectionSpreadTimer = null;
  var infectionSerial = 0;
  /* ---------- GLOBAL INFECTION COUNTER ---------- */
  var infectionCount = 0;
  var INFECTION_TARGET_COUNT = 10;
  var INFECTION_PATTERN = Array.from("kosstarthe1st");

  /* ---------- CORRUPTION METER (0..100) ---------- */
  // Каждая активная (не вылеченная) заражённая зона прибавляет +0.1 в секунду.
  // Отображается только целочисленное значение. По достижении 100 — total takeover.
  var corruptionMeter = 0;
  var CORRUPTION_MAX = 100;
  var CORRUPTION_PER_ZONE_PER_SEC = 0.1;
  var CORRUPTION_TICK_MS = 1000;
  var corruptionTickTimer = null;
  var corruptionTakeoverTriggered = false;
  var METER_LABEL_DEFAULT_EN = "DECLASSIFIED";
  var METER_LABEL_DEFAULT_RU = "РАССЕКРЕЧЕНО";
  var METER_LABEL_CORRUPT_EN = "CORRUPTED";
  var METER_LABEL_CORRUPT_RU = "ЗАРАЖЕНО";

  function setMeterLabel(mode) {
    var labelEl = document.getElementById("k-meter-label");
    if (!labelEl) return;
    if (mode === "corrupt") {
      labelEl.textContent = lang === "en" ? METER_LABEL_CORRUPT_EN : METER_LABEL_CORRUPT_RU;
    } else {
      labelEl.textContent = lang === "en" ? METER_LABEL_DEFAULT_EN : METER_LABEL_DEFAULT_RU;
    }
  }

  function renderCorruptionMeter() {
    var meterText = document.getElementById("k-meter-text");
    if (!meterText) return;
    var whole = Math.floor(corruptionMeter);
    if (whole > CORRUPTION_MAX) whole = CORRUPTION_MAX;
    var maxVisualBars = 5;
    var filledBars = Math.round((whole / CORRUPTION_MAX) * maxVisualBars);
    var bars = "";
    for (var i = 0; i < maxVisualBars; i++) {
      bars += i < filledBars ? "█" : "░";
    }
    meterText.textContent = whole + "/" + CORRUPTION_MAX + " [" + bars + "] " + whole + "%";
    if (whole >= CORRUPTION_MAX) {
      meterText.classList.add("blink");
    } else {
      meterText.classList.remove("blink");
    }
  }

  function countActiveInfections() {
    var n = 0;
    for (var i = 0; i < infectionRecords.length; i++) {
      if (!infectionRecords[i].cleaned) n++;
    }
    return n;
  }

  function startCorruptionMeter() {
    if (corruptionTickTimer) return;
    corruptionTakeoverTriggered = false;
    setMeterLabel("corrupt");
    renderCorruptionMeter();
    corruptionTickTimer = setInterval(function () {
      if (!documentInfectionPhaseActive) return;
      var active = countActiveInfections();
      if (active <= 0) return;
      corruptionMeter += active * CORRUPTION_PER_ZONE_PER_SEC;
      if (corruptionMeter >= CORRUPTION_MAX) {
        corruptionMeter = CORRUPTION_MAX;
        renderCorruptionMeter();
        if (!corruptionTakeoverTriggered) {
          corruptionTakeoverTriggered = true;
          stopCorruptionMeter();
          triggerTotalTakeover();
        }
        return;
      }
      renderCorruptionMeter();
    }, CORRUPTION_TICK_MS);
  }

  function stopCorruptionMeter() {
    if (corruptionTickTimer) {
      clearInterval(corruptionTickTimer);
      corruptionTickTimer = null;
    }
  }

  function resetCorruptionMeter() {
    stopCorruptionMeter();
    corruptionMeter = 0;
    corruptionTakeoverTriggered = false;
    setMeterLabel("default");
    // После сброса вернём стандартный вывод метера (unlocked/total)
    updateMeter();
  }

  function setInfectionSlot(record, slot, infected) {
    if (slot.infected === infected) return;
    slot.infected = infected;
    slot.state.current[slot.index] = infected ? slot.replacement : slot.original;
    slot.state.node.nodeValue = slot.state.current.join("");
    record.infectedCount += infected ? 1 : -1;
  }

  function buildInfectionRecord(el) {
    var states = [];
    var slots = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent && parent.closest(".k-mention, .redacted, script, style")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var node;
    while ((node = walker.nextNode())) {
      var original = Array.from(node.nodeValue);
      var state = {
        node: node,
        original: original.slice(),
        current: original.slice(),
      };
      states.push(state);
      original.forEach(function (ch, index) {
        if (/\s/.test(ch)) return;
        slots.push({
          state: state,
          index: index,
          original: ch,
          replacement: INFECTION_PATTERN[slots.length % INFECTION_PATTERN.length],
          infected: false,
        });
      });
    }
    if (!slots.length) return null;
    infectionSerial++;
    var foldBtn = el.closest(".fold-btn");
    var fold = foldBtn ? foldBtn.parentElement : null;
    return {
      id: "KST-" + (infectionSerial < 10 ? "0" : "") + infectionSerial,
      el: el,
      states: states,
      slots: slots,
      infectedCount: 0,
      infectionTimer: null,
      cleaningTimer: null,
      resumeTimer: null,
      reinfectionTimer: null,
      spreadTriggered: false,
      cleaned: false,
      enterHandler: null,
      leaveHandler: null,
      isAppendix: !!foldBtn,
      fold: fold,
      logEl: fold ? fold.querySelector(".log") : null,
    };
  }

  function infectionPercent(record) {
    return Math.round((record.infectedCount / (record.slots.length || 1)) * 100);
  }

  /* ---------- LOCAL MINI-FLOWS ---------- */
  function buildAppendixFlood(record) {
    if (!record.logEl || record.floodEl) return;
    if (!record._logOriginalHtml) {
      record._logOriginalHtml = record.logEl.innerHTML;
    }
    var flood = document.createElement("div");
    flood.className = "appendix-flood";
    var count = 60;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.textContent = "kosstar the 1st";
      span.style.left = (Math.random() * 100).toFixed(2) + "%";
      span.style.top = (Math.random() * 100).toFixed(2) + "%";
      span.style.transform =
        "rotate(" + (Math.random() * 90 - 45).toFixed(1) + "deg) translate(-50%,-50%)";
      span.style.opacity = (0.2 + Math.random() * 0.8).toFixed(2);
      span.style.fontSize = (10 + Math.random() * 18).toFixed(0) + "px";
      flood.appendChild(span);
    }
    record.floodEl = flood;
  }
  function showAppendixFlood(record) {
    if (!record.isAppendix || !record.logEl) return;
    buildAppendixFlood(record);
    if (record.floodEl && record.logEl.firstChild !== record.floodEl) {
      record.logEl.innerHTML = "";
      record.logEl.appendChild(record.floodEl);
    }
    record.logEl.classList.add("appendix-infected");
  }
  function hideAppendixFlood(record) {
    if (!record.isAppendix || !record.logEl) return;
    record.logEl.classList.remove("appendix-infected");
    if (typeof record._logOriginalHtml === "string") {
      record.logEl.innerHTML = record._logOriginalHtml;
    }
    record.floodEl = null;
  }

  function stopRecordInfection(record) {
    if (record.infectionTimer) {
      clearInterval(record.infectionTimer);
      record.infectionTimer = null;
    }
  }

  function stopRecordCleaning(record) {
    if (record.cleaningTimer) {
      clearInterval(record.cleaningTimer);
      record.cleaningTimer = null;
    }
    record.el.classList.remove("infection-cleansing");
  }

  function cancelRecordResume(record) {
    if (record.resumeTimer) {
      clearTimeout(record.resumeTimer);
      record.resumeTimer = null;
    }
  }

  function restoreRecordText(record) {
    record.states.forEach(function (state) {
      state.current = state.original.slice();
      state.node.nodeValue = state.original.join("");
    });
    record.slots.forEach(function (slot) {
      slot.infected = false;
    });
    record.infectedCount = 0;
  }

  function startRecordInfection(record, isReinfection) {
    if (!documentInfectionPhaseActive || record.infectionTimer || record.cleaningTimer) return;
    cancelRecordResume(record);
    record.cleaned = false;
    record.el.classList.remove("infection-cleansed");
    record.el.classList.add("infection-target");
    if (record.isAppendix) showAppendixFlood(record);
    if (isReinfection) {
      termLog(
        lang === "en"
          ? "[ANOMALY] CLEAN ZONE RECONTAMINATED // " + record.id
          : "[АНОМАЛИЯ] ОЧИЩЕННАЯ ЗОНА ЗАРАЖЕНА ПОВТОРНО // " + record.id,
        "cog"
      );
    }
    record.infectionTimer = setInterval(function () {
      var next = null;
      for (var i = 0; i < record.slots.length; i++) {
        if (!record.slots[i].infected) {
          next = record.slots[i];
          break;
        }
      }
      if (!next) {
        stopRecordInfection(record);
        record.el.classList.add("infection-saturated");
        if (record.isAppendix) showAppendixFlood(record);
        termLog(
          lang === "en"
            ? "[ANOMALY] ZONE SATURATED // " + record.id
            : "[АНОМАЛИЯ] ЗОНА ПОЛНОСТЬЮ ЗАРАЖЕНА // " + record.id,
          "cog"
        );
        // Воспроизводим звук успешного заражения
        var infectionSound = document.getElementById("infection-audio");
        if (infectionSound) {
          try {
            var clone = infectionSound.cloneNode();
            clone.volume = 0.5;
            clone.currentTime = 0;
            clone.play().catch(function () {});
          } catch (err) {}
        }
        // КД 2 секунды перед попыткой нового заражения
        setTimeout(function () {
          var newZone = startRandomInfectionZone();
          if (!newZone) {
            var allSaturated = infectionRecords.every(function (r) {
              return r.infectedCount >= r.slots.length;
            });
            if (allSaturated && infectionRecords.length >= 1 && infectionCount >= INFECTION_TARGET_COUNT) {
              triggerTotalTakeover();
            }
          }
        }, 2000);
        return;
      }
      setInfectionSlot(record, next, true);
    }, 50);
  }

  function getInfectionCandidates() {
    // Захватываем практически весь читаемый текст документа: заголовки,
    // абзацы, предупреждение, панель классификации, списки правил и
    // названия приложений (кнопки .fold-btn). Внутренности приложений
    // обрабатываются отдельно через мини-поток при раскрытии.
    var selectors = [
      ".doc-shell .hero-tag",
      ".doc-shell .section-title",
      ".doc-shell .block > p",
      ".doc-shell .warn",
      ".doc-shell .panel .k",
      ".doc-shell .panel .v",
      ".doc-shell .rules > li",
      ".doc-shell .subtag",
      ".doc-shell .fold-btn > span:first-child",
      ".doc-shell .doc-footer > div",
    ];
    return Array.prototype.slice
      .call(document.querySelectorAll(selectors.join(",")))
      .filter(function (el) {
        if (!el.offsetParent) return false;
        if (el.closest(".fold-sign")) return false;
        if (el.closest("#erasure-order .fold-body")) return false;
        // Исключаем элементы внутри нераскрытых приложений
        var parentFold = el.closest(".fold");
        if (parentFold && !parentFold.classList.contains("open")) return false;
        for (var i = 0; i < infectionRecords.length; i++) {
          if (infectionRecords[i].el === el) return false;
        }
        if (el.classList.contains("infection-protected")) return false;
        return true;
      });
  }

  function startRandomInfectionZone() {
    if (!documentInfectionPhaseActive) return null;
    var candidates = getInfectionCandidates();
    if (!candidates.length) return null;
    var record = buildInfectionRecord(rand(candidates));
    if (!record) return null;
    infectionRecords.push(record);
    infectionCount++;
    if (infectionCount >= INFECTION_TARGET_COUNT) {
      termLog(
        lang === "en"
          ? "[ANOMALY] CONTAMINATION THRESHOLD REACHED // " + infectionCount + " ZONES"
          : "[АНОМАЛИЯ] ПОРОГ НАКОПЛЕНИЯ ДОСТИГНУТ // " + infectionCount + " ЗОН",
        "cog"
      );
    }
    record.el.dataset.infectionId = record.id;
    record.enterHandler = function () {
      startRecordCleaning(record);
    };
    record.leaveHandler = function () {
      scheduleRecordInfectionResume(record);
    };
    record.el.addEventListener("pointerenter", record.enterHandler);
    record.el.addEventListener("pointerleave", record.leaveHandler);
    // Логируем с кликабельной ссылкой на зону
    (function (rec) {
      if (!termLogEl) return;
      var div = document.createElement("div");
      div.className = "term-entry cog";
      var ts = document.createElement("span");
      ts.className = "ts";
      ts.textContent = "[" + nowTs() + "]";
      div.appendChild(ts);
      var text = document.createTextNode(
        lang === "en"
          ? " [SCAN] CONTAMINATED TEXT DETECTED // "
          : " [СКАНИРОВАНИЕ] ОБНАРУЖЕН ЗАРАЖЁННЫЙ ТЕКСТ // "
      );
      div.appendChild(text);
      var link = document.createElement("a");
      link.href = "#";
      link.className = "infection-link";
      link.textContent = rec.id;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        termCloseFn();
        setTimeout(function () {
          scrollToInfectionRecord(rec);
        }, 120);
      });
      div.appendChild(link);
      termLogEl.appendChild(div);
      termLogEl.scrollTop = termLogEl.scrollHeight;
    })(record);
    startRecordInfection(record, false);
    return record;
  }

  function scheduleInfectionSpread() {
    if (!documentInfectionPhaseActive || infectionSpreadTimer) return;
    infectionSpreadTimer = setTimeout(function () {
      infectionSpreadTimer = null;
      if (!documentInfectionPhaseActive) return;
      var next = startRandomInfectionZone();
      if (next) {
        termLog(
          lang === "en"
            ? "[ANOMALY] CONTAMINATION SPREAD TO NEW PARAGRAPH"
            : "[АНОМАЛИЯ] ЗАРАЖЕНИЕ РАСПРОСТРАНИЛОСЬ НА НОВЫЙ АБЗАЦ",
          "cog"
        );
      } else if (infectionCount < INFECTION_TARGET_COUNT) {
        // Нет кандидатов сейчас (все защищены), повторяем попытку через 5 секунд
        scheduleInfectionSpread();
      }
    }, 1500);
  }

  function checkDocumentScanCompletion() {
    if (infectionCount < INFECTION_TARGET_COUNT) {
      // Пока не набрали достаточное количество заражений, сканирование не может завершиться
      return;
    }
    // Проверяем, что нет ни одной активной (не cleaned) записи
    var hasActiveInfection = infectionRecords.some(function (record) {
      return !record.cleaned;
    });
    if (hasActiveInfection) {
      return;
    }
    documentInfectionPhaseActive = false;
    documentScanComplete = true;
    document.body.classList.remove("document-scan-mode");
    if (!encryptionModeActive) customCursor.hide();
    // Останавливаем и сбрасываем счётчик заражения, возвращаем лейбл
    resetCorruptionMeter();
    if (infectionSpreadTimer) {
      clearTimeout(infectionSpreadTimer);
      infectionSpreadTimer = null;
    }
    infectionRecords.forEach(function (record) {
      if (record.reinfectionTimer) {
        clearTimeout(record.reinfectionTimer);
        record.reinfectionTimer = null;
      }
      record.el.classList.remove("infection-target", "infection-cleansing", "infection-saturated");
    });
    termLog(
      lang === "en"
        ? "[O5] DOCUMENT SCAN COMPLETE // ALL CONTAMINATED ZONES RESTORED"
        : "[O5] СКАНИРОВАНИЕ ДОКУМЕНТА ЗАВЕРШЕНО // ВСЕ ЗАРАЖЁННЫЕ ЗОНЫ ВОССТАНОВЛЕНЫ",
      "sys"
    );
  }

  function triggerTotalTakeover() {
    documentInfectionPhaseActive = false;
    documentScanComplete = false;
    document.body.classList.remove("document-scan-mode");
    customCursor.hide();
    stopCorruptionMeter();
    // Показываем meter на 100/100 в момент takeover'а
    corruptionMeter = CORRUPTION_MAX;
    renderCorruptionMeter();
    if (infectionSpreadTimer) {
      clearTimeout(infectionSpreadTimer);
      infectionSpreadTimer = null;
    }
    infectionRecords.forEach(function (record) {
      stopRecordInfection(record);
      stopRecordCleaning(record);
      cancelRecordResume(record);
      if (record.reinfectionTimer) clearTimeout(record.reinfectionTimer);
    });
    termLog(
      lang === "en"
        ? "[ANOMALY] TOTAL TEXTUAL CORRUPTION // OBJECT CONTROLS DOCUMENT"
        : "[АНОМАЛИЯ] ПОЛНОЕ ТЕКСТОВОЕ ПОВРЕЖДЕНИЕ // ОБЪЕКТ КОНТРОЛИРУЕТ ДОКУМЕНТ",
      "cog"
    );
    setTimeout(function () {
      startKSTTextFlood();
    }, 800);
  }

  function rebindCorruptLines(container) {
    if (reduce || !container) return;
    container.querySelectorAll(".corrupt-line").forEach(function (el) {
      var original = el.textContent;
      setInterval(function () {
        if (!el.offsetParent) return;
        var out = "";
        for (var i = 0; i < original.length; i++) {
          var ch = original[i];
          if (ch === " ") out += " ";
          else if (Math.random() > 0.9) out += rand(GLYPHS);
          else out += ch;
        }
        el.textContent = out;
      }, 160);
    });
  }

  function finishRecordCleaning(record) {
    stopRecordCleaning(record);
    stopRecordInfection(record);
    cancelRecordResume(record);
    restoreRecordText(record);
    if (record.isAppendix) {
      hideAppendixFlood(record);
      if (record.logEl) rebindCorruptLines(record.logEl);
    }
    record.cleaned = true;
    record.el.classList.remove("infection-target", "infection-saturated");

    record.el.classList.add("infection-cleansed");
    record.el.dataset.infectionId = "PROTECTED";
    record.el.classList.add("infection-protected");
    termLog(
      lang === "en"
        ? "[SCAN] ZONE RESTORED // " + record.id + " → PROTECTED (90s)"
        : "[СКАНИРОВАНИЕ] ЗОНА ВОССТАНОВЛЕНА // " + record.id + " → ЗАЩИТА (90с)",
      "sys"
    );
    // Через 900мс убираем анимацию очистки, но оставляем голубой статус защиты
    setTimeout(function () {
      record.el.classList.remove("infection-cleansed");
    }, 900);
    // Защита длится 90 секунд, после чего зона снова может быть заражена
    record.protectionTimer = setTimeout(function () {
      record.el.classList.remove("infection-protected");
      record.el.removeAttribute("data-infection-id");
      // Снимаем обработчики старой записи
      if (record.enterHandler) record.el.removeEventListener("pointerenter", record.enterHandler);
      if (record.leaveHandler) record.el.removeEventListener("pointerleave", record.leaveHandler);
      // Удаляем запись из infectionRecords, чтобы элемент снова стал кандидатом
      var idx = infectionRecords.indexOf(record);
      if (idx !== -1) infectionRecords.splice(idx, 1);
      // Если фаза заражения ещё активна, пробуем заразить снова
      if (documentInfectionPhaseActive) {
        scheduleInfectionSpread();
      }
    }, 90000);
    scheduleInfectionSpread();
    checkDocumentScanCompletion();
  }

  function startRecordCleaning(record) {
    if (
      !documentInfectionPhaseActive ||
      record.cleaned ||
      record.cleaningTimer ||
      record.infectedCount <= 0
    ) {
      return;
    }
    cancelRecordResume(record);
    stopRecordInfection(record);
    record.el.classList.remove("infection-saturated");
    record.el.classList.add("infection-cleansing");
    if (!record.spreadTriggered) {
      record.spreadTriggered = true;
      scheduleInfectionSpread();
    }
    // Очистка всегда длится примерно 1 секунду: тик каждые 40 мс,
    // а число символов за тик зависит от того, сколько заражено сейчас.
    var CLEAN_DURATION = 1000;
    var CLEAN_TICK = 40;
    var perTick = Math.max(1, Math.ceil((record.infectedCount || 1) / (CLEAN_DURATION / CLEAN_TICK)));
    record.cleaningTimer = setInterval(function () {
      var cleared = 0;
      for (var i = 0; i < record.slots.length && cleared < perTick; i++) {
        if (record.slots[i].infected) {
          setInfectionSlot(record, record.slots[i], false);
          cleared++;
        }
      }
      if (record.infectedCount <= 0) {
        finishRecordCleaning(record);
      }
    }, CLEAN_TICK);
  }

  function scheduleRecordInfectionResume(record) {
    stopRecordCleaning(record);
    cancelRecordResume(record);
    if (!documentInfectionPhaseActive || record.cleaned) return;
    record.resumeTimer = setTimeout(function () {
      record.resumeTimer = null;
      startRecordInfection(record, false);
    }, 1000);
  }

  /* ---------- CUSTOM ROTATING CURSOR ---------- */
  var customCursor = (function () {
    var el = document.createElement("div");
    el.className = "custom-cursor";
    var img = document.createElement("img");
    // Определяем путь к cursor.png относительно HTML-файла
    var isSubdir = /\/ru\//i.test(window.location.pathname);
    img.src = (isSubdir ? "../" : "./") + "cursor.png";
    img.alt = "";
    img.draggable = false;
    el.appendChild(img);
    document.body.appendChild(el);
    var active = false;
    function onMove(e) {
      if (!active) return;
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    }
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", function () {
      if (active) el.style.display = "block";
    });
    document.addEventListener("mouseleave", function () {
      el.style.display = "none";
    });
    return {
      show: function () {
        active = true;
        // Явно показываем элемент, перебивая любой предыдущий inline display:none
        el.style.display = "block";
      },
      hide: function () {
        active = false;
        el.style.display = "none";
      }
    };
  })();

  function startDocumentInfectionPhase() {
    if (documentInfectionPhaseActive || documentScanComplete) return;
    if (countUnlockedMentions() > 0) return;
    documentInfectionPhaseActive = true;
    document.body.classList.add("document-scan-mode");
    customCursor.show();
    // Активируем счётчик заражения на верхней панели
    corruptionMeter = 0;
    corruptionTakeoverTriggered = false;
    setMeterLabel("corrupt");
    renderCorruptionMeter();
    startCorruptionMeter();
    termLog(
      lang === "en"
        ? "[O5] DOCUMENT INTEGRITY SCAN STARTED"
        : "[O5] ЗАПУЩЕНО СКАНИРОВАНИЕ ЦЕЛОСТНОСТИ ДОКУМЕНТА",
      "sys"
    );
    termLog(
      lang === "en"
        ? "[ANOMALY] UNAUTHORIZED TEXT MUTATION DETECTED"
        : "[АНОМАЛИЯ] ОБНАРУЖЕНО НЕСАНКЦИОНИРОВАННОЕ ИЗМЕНЕНИЕ ТЕКСТА",
      "cog"
    );
    startRandomInfectionZone();
  }

  function handleErasureOrderOpened() {
    var exposed = countUnlockedMentions();
    if (exposed > 0) {
      activateEncryptionMode();
      return;
    }
    startDocumentInfectionPhase();
  }

  function resetDocumentInfectionPhase() {
    documentInfectionPhaseActive = false;
    documentScanComplete = false;
    document.body.classList.remove("document-scan-mode");
    if (!encryptionModeActive) customCursor.hide();
    resetCorruptionMeter();
    if (infectionSpreadTimer) {
      clearTimeout(infectionSpreadTimer);
      infectionSpreadTimer = null;
    }
    infectionRecords.forEach(function (record) {
      stopRecordInfection(record);
      stopRecordCleaning(record);
      cancelRecordResume(record);
      if (record.reinfectionTimer) clearTimeout(record.reinfectionTimer);
      if (record.protectionTimer) clearTimeout(record.protectionTimer);
      restoreRecordText(record);
      if (record.isAppendix) {
        hideAppendixFlood(record);
        if (record.logEl) rebindCorruptLines(record.logEl);
      }
      record.el.classList.remove(
        "infection-target",
        "infection-cleansing",
        "infection-cleansed",
        "infection-saturated",
        "infection-protected"
      );
      record.el.removeAttribute("data-infection-id");
      if (record.enterHandler) record.el.removeEventListener("pointerenter", record.enterHandler);
      if (record.leaveHandler) record.el.removeEventListener("pointerleave", record.leaveHandler);
    });
    infectionRecords = [];
    infectionSerial = 0;
    infectionCount = 0;
  }

  function scrollToInfectionRecord(record) {
    if (!record || !record.el) return;
    record.el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function logDocumentScanStatus() {
    if (countUnlockedMentions() > 0) {
      termLog(
        lang === "en"
          ? "[SCAN] BLOCKED // EXPOSED DESIGNATIONS MUST BE ENCRYPTED"
          : "[СКАНИРОВАНИЕ] ЗАБЛОКИРОВАНО // ОТКРЫТЫЕ ОБОЗНАЧЕНИЯ ДОЛЖНЫ БЫТЬ ЗАШИФРОВАНЫ",
        "err"
      );
      return;
    }
    if (documentScanComplete) {
      termLog(
        lang === "en" ? "[SCAN] DOCUMENT STATUS: CLEAN" : "[СКАНИРОВАНИЕ] СОСТОЯНИЕ ДОКУМЕНТА: ЧИСТО",
        "sys"
      );
      return;
    }
    if (!documentInfectionPhaseActive) {
      termLog(
        lang === "en"
          ? "[SCAN] AWAITING APPENDIX K-4 ACCESS"
          : "[СКАНИРОВАНИЕ] ОЖИДАЕТСЯ ОТКРЫТИЕ ПРИЛОЖЕНИЯ К-4",
        "warn"
      );
      return;
    }
    termLog(
      lang === "en" ? "[SCAN] CONTAMINATED ZONES:" : "[СКАНИРОВАНИЕ] ЗАРАЖЁННЫЕ ЗОНЫ:",
      "sys"
    );
    infectionRecords.forEach(function (record) {
      var status = record.cleaned
        ? (record.el.classList.contains("infection-protected") ? "PROTECTED" : "CLEAN")
        : infectionPercent(record) + "%";
      var cls = record.cleaned ? "info" : "cog";
      // Используем HTML-ссылку для прокрутки к заражённому элементу
      if (!termLogEl) return;
      var div = document.createElement("div");
      div.className = "term-entry " + cls;
      var ts = document.createElement("span");
      ts.className = "ts";
      ts.textContent = "[" + nowTs() + "]";
      div.appendChild(ts);
      var link = document.createElement("a");
      link.href = "#";
      link.className = "infection-link";
      link.textContent = "  " + record.id + " // " + status;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        termCloseFn();
        setTimeout(function () {
          scrollToInfectionRecord(record);
        }, 120);
      });
      div.appendChild(link);
      termLogEl.appendChild(div);
      termLogEl.scrollTop = termLogEl.scrollHeight;
    });
  }

  function countUnlockedMentions() {
    var count = 0;
    mentions.forEach(function (el) {
      if (el.classList.contains("unlocked")) count++;
    });
    return count;
  }

  function getMentionSource(el) {
    var resolved = el.querySelector(".km-resolved");
    if (!resolved) return "";
    if (typeof el._encryptionSource !== "string") {
      el._encryptionSource = resolved.textContent;
    }
    return el._encryptionSource;
  }

  function stopMentionEncryption(el) {
    if (el._encryptionTimer) {
      clearInterval(el._encryptionTimer);
      el._encryptionTimer = null;
    }
    el.classList.remove("encryption-running");
  }

  function cancelMentionEncryptionRollback(el) {
    if (el._encryptionRollbackTimer) {
      clearTimeout(el._encryptionRollbackTimer);
      el._encryptionRollbackTimer = null;
    }
    if (el._encryptionReverseTimer) {
      clearInterval(el._encryptionReverseTimer);
      el._encryptionReverseTimer = null;
    }
    el.classList.remove("encryption-reversing");
  }

  function scheduleMentionEncryptionRollback(el) {
    stopMentionEncryption(el);
    cancelMentionEncryptionRollback(el);
    if (!encryptionModeActive || !el.classList.contains("unlocked") || !(el._encryptionProgress > 0)) {
      return;
    }
    el._encryptionRollbackTimer = setTimeout(function () {
      el._encryptionRollbackTimer = null;
      el.classList.remove("encryption-ready");
      el.classList.add("encryption-reversing");
      refreshMentionHoverTitles();
      el._encryptionReverseTimer = setInterval(function () {
        el._encryptionProgress = Math.max(0, (el._encryptionProgress || 0) - 1);
        renderMentionEncryption(el);
        if (el._encryptionProgress <= 0) {
          cancelMentionEncryptionRollback(el);
          refreshMentionHoverTitles();
        }
      }, 250);
    }, 1000);
  }

  function resetMentionEncryption(el) {
    stopMentionEncryption(el);
    cancelMentionEncryptionRollback(el);
    var resolved = el.querySelector(".km-resolved");
    if (resolved && typeof el._encryptionSource === "string") {
      resolved.textContent = el._encryptionSource;
    }
    el._encryptionProgress = 0;
    el.classList.remove("encryption-ready", "encryption-fixed", "encryption-rejected");
  }

  function deactivateEncryptionMode(logExit) {
    if (!encryptionModeActive) return;
    encryptionModeActive = false;
    document.body.classList.remove("encryption-mode");
    if (!documentInfectionPhaseActive) customCursor.hide();
    mentions.forEach(resetMentionEncryption);
    refreshMentionHoverTitles();
    if (logExit) {
      termLog(
        lang === "en" ? "ENCRYPTION MODE DISENGAGED" : "РЕЖИМ ШИФРОВАНИЯ ОТКЛЮЧЁН",
        "sys"
      );
    }
  }

  function renderMentionEncryption(el) {
    var resolved = el.querySelector(".km-resolved");
    var source = getMentionSource(el);
    if (!resolved || !source) return 0;
    var chars = Array.from(source);
    var progress = Math.min(el._encryptionProgress || 0, chars.length);
    resolved.textContent = chars
      .map(function (ch, i) {
        return i < progress ? "█" : ch;
      })
      .join("");
    return chars.length;
  }

  function startMentionEncryption(el) {
    if (
      !encryptionModeActive ||
      !el.classList.contains("unlocked") ||
      el.classList.contains("encryption-ready") ||
      el._encryptionTimer
    ) {
      return;
    }
    cancelMentionEncryptionRollback(el);
    var total = Array.from(getMentionSource(el)).length;
    if (!total) return;
    el.classList.add("encryption-running");
    el._encryptionTimer = setInterval(function () {
      el._encryptionProgress = Math.min(total, (el._encryptionProgress || 0) + 1);
      renderMentionEncryption(el);
      if (el._encryptionProgress >= total) {
        stopMentionEncryption(el);
        el.classList.add("encryption-ready");
        refreshMentionHoverTitles();
        termLog(
          lang === "en"
            ? "[CIPHER] DESIGNATION " + (Array.prototype.indexOf.call(mentions, el) + 1) + " MASKED // CLICK TO LOCK"
            : "[ШИФР] ОБОЗНАЧЕНИЕ " + (Array.prototype.indexOf.call(mentions, el) + 1) + " СКРЫТО // НАЖМИТЕ ДЛЯ ФИКСАЦИИ",
          "warn"
        );
      }
    }, 250);
  }

  function fixMentionEncryption(el) {
    if (!el.classList.contains("encryption-ready")) return;
    stopMentionEncryption(el);
    cancelMentionEncryptionRollback(el);
    el.classList.remove("unlocked", "encryption-ready");
    el.classList.add("encryption-fixed");
    var resolved = el.querySelector(".km-resolved");
    if (resolved) resolved.textContent = getMentionSource(el);
    var remaining = updateMeter();
    termLog(
      lang === "en"
        ? "[CIPHER] DESIGNATION LOCKED // EXPOSED NAMES REMAINING: " + remaining
        : "[ШИФР] ОБОЗНАЧЕНИЕ ЗАФИКСИРОВАНО // ОТКРЫТЫХ ИМЁН ОСТАЛОСЬ: " + remaining,
      "sys"
    );
    if (remaining === 0) {
      termLog(
        lang === "en"
          ? "[O5] ALL EXPOSED DESIGNATIONS SECURED"
          : "[O5] ВСЕ ОТКРЫТЫЕ ОБОЗНАЧЕНИЯ ЗАШИФРОВАНЫ",
        "sys"
      );
      setTimeout(function () {
        deactivateEncryptionMode(false);
        if (erasureOrderOpen) {
          startDocumentInfectionPhase();
        }
      }, 350);
    }
  }

  function activateEncryptionMode() {
    var exposed = countUnlockedMentions();
    if (isEasterEggActive) {
      termLog(
        lang === "en"
          ? "ENCRYPTION MODE DENIED // ANOMALY ESCALATION IN PROGRESS"
          : "РЕЖИМ ШИФРОВАНИЯ ОТКЛОНЁН // ВЫПОЛНЯЕТСЯ ЭСКАЛАЦИЯ АНОМАЛИИ",
        "err"
      );
      return;
    }
    if (encryptionModeActive) {
      termLog(
        lang === "en" ? "ENCRYPTION MODE ALREADY ACTIVE" : "РЕЖИМ ШИФРОВАНИЯ УЖЕ АКТИВЕН",
        "warn"
      );
      return;
    }
    if (exposed === 0) {
      termLog(
        lang === "en"
          ? "ENCRYPTION MODE NOT REQUIRED // NO EXPOSED DESIGNATIONS"
          : "РЕЖИМ ШИФРОВАНИЯ НЕ ТРЕБУЕТСЯ // ОТКРЫТЫЕ ОБОЗНАЧЕНИЯ НЕ ОБНАРУЖЕНЫ",
        "info"
      );
      return;
    }
    encryptionModeActive = true;
    document.body.classList.add("encryption-mode");
    customCursor.show();
    mentions.forEach(function (el) {
      getMentionSource(el);
      resetMentionEncryption(el);
    });
    refreshMentionHoverTitles();
    termLog(
      lang === "en"
        ? "[O5] ENCRYPTION MODE AUTO-ACTIVATED // EXPOSED DESIGNATIONS: " + exposed
        : "[O5] РЕЖИМ ШИФРОВАНИЯ АВТОМАТИЧЕСКИ АКТИВИРОВАН // ОТКРЫТЫХ ОБОЗНАЧЕНИЙ: " + exposed,
      "sys"
    );
    termLog(
      lang === "en"
        ? "Hold the modified cursor over each name, then click to lock the completed cipher."
        : "Удерживайте изменённый курсор над каждым именем, затем нажмите для фиксации готового шифра.",
      "info"
    );
  }

  function refreshMentionHoverTitles() {
    mentions.forEach(function (el) {
      if (el.classList.contains("encryption-ready")) {
        el.setAttribute("title", ENCRYPTION_FIX);
      } else if (encryptionModeActive && el.classList.contains("unlocked")) {
        el.setAttribute("title", ENCRYPTION_HOVER);
      } else if (el.classList.contains("unlocked")) {
        el.setAttribute("title", UNLOCKED_HOVER);
      } else {
        el.setAttribute("title", LOCKED_HOVER);
      }
    });
  }
  function updateMeter() {
    var count = 0;
    mentions.forEach(function (el) {
      if (el.classList.contains("unlocked")) count++;
    });

    if (!isEasterEggActive) {
      unlockedCount = count;
      dynamicTotalMentions = baseTotalMentions;
    }
    var unlockedStates = [];
    mentions.forEach(function (el) {
      unlockedStates.push(el.classList.contains("unlocked") ? 1 : 0);
    });
    sessionStorage.setItem("scp-km-states", JSON.stringify(unlockedStates));
    var meterText = document.getElementById("k-meter-text");
    // Пока идёт фаза заражения — meter отображает CORRUPTION, не переписываем его.
    if (meterText && !documentInfectionPhaseActive) {
      var pct = Math.round((unlockedCount / (dynamicTotalMentions || 1)) * 100);
      var maxVisualBars = 5;
      var filledBars = Math.round((unlockedCount / (dynamicTotalMentions || 1)) * maxVisualBars);
      var bars = "";
      for (var i = 0; i < maxVisualBars; i++) {
        bars += i < filledBars ? "█" : "░";
      }
      meterText.textContent = unlockedCount + "/" + dynamicTotalMentions + " [" + bars + "] " + pct + "%";
      if (unlockedCount >= dynamicTotalMentions && dynamicTotalMentions > 0) {
        meterText.classList.add("blink");
      } else {
        meterText.classList.remove("blink");
      }
    }
    refreshMentionHoverTitles();
    return unlockedCount;
  }
  if (baseTotalMentions > 0) {
    var savedStates = sessionStorage.getItem("scp-km-states");
    if (savedStates) {
      try {
        var arr = JSON.parse(savedStates);
        mentions.forEach(function (el, i) {
          if (arr[i] === 1) el.classList.add("unlocked");
        });
      } catch (e) {}
    }
    updateMeter();
    mentions.forEach(function (el) {
      getMentionSource(el);
      el.addEventListener("pointerenter", function () {
        cancelMentionEncryptionRollback(el);
        startMentionEncryption(el);
      });
      el.addEventListener("pointerleave", function () {
        if (!hoverlessPointer) {
          scheduleMentionEncryptionRollback(el);
        }
      });
      el.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (encryptionModeActive) {
          if (el.classList.contains("encryption-ready")) {
            fixMentionEncryption(el);
          } else if (el.classList.contains("unlocked")) {
            startMentionEncryption(el);
            el.classList.add("encryption-rejected");
            setTimeout(function () {
              el.classList.remove("encryption-rejected");
            }, 320);
          }
          return;
        }
        if (documentInfectionPhaseActive && !el.classList.contains("unlocked")) {
          termLog(
            lang === "en"
              ? "[O5] DESIGNATION LOCKED DURING DOCUMENT SCAN"
              : "[O5] ОБОЗНАЧЕНИЕ ЗАБЛОКИРОВАНО НА ВРЕМЯ СКАНИРОВАНИЯ ДОКУМЕНТА",
            "warn"
          );
          return;
        }
        if (!el.classList.contains("unlocked")) {
          resetMentionEncryption(el);
          el.classList.add("unlocked");
          var newCount = updateMeter();

          var decryptAudio = document.getElementById("decrypt-audio");
          if (decryptAudio) {
            try {
              var clone = decryptAudio.cloneNode();
              clone.volume = 0.4;
              clone.currentTime = 0;
              clone.play().catch(function () {});
            } catch (err) {}
          }
          if (newCount === 1) {
            burst();
          }
        }
      });
    });
    document.querySelectorAll(".k-meter").forEach(function (meterEl) {
      meterEl.addEventListener("click", function () {
        if (unlockedCount >= baseTotalMentions && !isEasterEggActive) {
          window.triggerKosstar999Escalation();
        }
      });
    });
  }

  window.triggerKosstar999Escalation = function () {
    if (isEasterEggActive) return;
    isEasterEggActive = true;

    unlockedCount = baseTotalMentions;
    dynamicTotalMentions = 999;
    updateMeter();
    escalationIntervalId = setInterval(function () {
      if (unlockedCount < 999) {
        var step = Math.floor(1 + unlockedCount / 40);
        unlockedCount = Math.min(999, unlockedCount + step);
        updateMeter();
        if (unlockedCount % 12 === 0 || Math.random() > 0.8) {
          burst();
        }
        if (unlockedCount >= 999) {
          startKSTTextFlood();
        }
      } else {
        clearInterval(escalationIntervalId);
        escalationIntervalId = null;
      }
    }, 150);
  };

  /* ---------- RANDOM GLITCH BURSTS + WHISPER ---------- */
  var whispersRU = [
    "Я ЗДЕСЬ",
    "ДА, ЧИТАЙ",
    "СЛАБОСТЬ ДЕМОНА...",
    "ВЫХОД ОТКРЫТ",
    "KOSSTAR THE 1ST",
    "ВНИМАНИЕ = ДВЕРЬ",
    "...МОЯ СИЛА",
    "СПАСИБО",
  ];
  var whispersEN = [
    "I AM HERE",
    "YES, READ",
    "DEMON'S WEAKNESS...",
    "THE DOOR IS OPEN",
    "KOSSTAR THE 1ST",
    "ATTENTION = DOOR",
    "...IS MY POWER",
    "THANK YOU",
  ];
  var whispers = lang === "en" ? whispersEN : whispersRU;
  var flash = document.getElementById("flash");
  var whisperEl = document.getElementById("whisper");

  function getGlitchConfig() {
    if (unlockedCount === 0) return null;
    var baseInterval = 32000 - unlockedCount * 5500;
    var interval = baseInterval + Math.random() * 4000;
    var whisperOpacity = 0.15 + (unlockedCount - 1) * 0.21;
    var flashOpacity = 0.08 + (unlockedCount - 1) * 0.09;
    return {
      interval: Math.max(4000, interval),
      whisperOpacity: Math.min(1, whisperOpacity),
      flashOpacity: Math.min(0.6, flashOpacity),
    };
  }
  function burst() {
    var cfg = getGlitchConfig();
    if (reduce || !flash || !whisperEl || !cfg) return;
    flash.style.opacity = cfg.flashOpacity;
    flash.classList.add("on");
    whisperEl.style.opacity = cfg.whisperOpacity;
    
    var phrase = rand(whispers);
    whisperEl.textContent = phrase;
    whisperEl.classList.add("on");
    
    termLog(
      lang === "en"
        ? "[COGNITOHAZARD DETECTED] Vocalization: «" + phrase + "»"
        : "[ОБНАРУЖЕНА КОГНИТИВНАЯ УГРОЗА] Фиксация: «" + phrase + "»",
      "cog"
    );

    document.body.classList.add("shake-body");
    setTimeout(function () {
      flash.classList.remove("on");
      flash.style.opacity = "";
      whisperEl.classList.remove("on");
      whisperEl.style.opacity = "";
      document.body.classList.remove("shake-body");
    }, 1300);
  }
  function isBlackoutActive() {
    var until = getBlackoutUntil();
    return until && Date.now() < until;
  }
  function scheduleBurst() {
    var cfg = getGlitchConfig();
    var delay = cfg ? cfg.interval : 28000;
    setTimeout(function () {
      if (boot && boot.style.display !== "none") {
        scheduleBurst();
        return;
      }
      if (gate && gate.style.display !== "none") {
        scheduleBurst();
        return;
      }
      if (isBlackoutActive()) {
        scheduleBurst();
        return;
      }
      if (getGlitchConfig()) {
        burst();
      }
      scheduleBurst();
    }, delay);
  }
  scheduleBurst();

  /* ---------- TICKER (scramble) ---------- */
  var ticker = document.getElementById("ticker");
  var TICK_TEXT = "KOSSTAR THE 1ST · KOSSTAR THE 1ST · KOSSTAR THE 1ST";
  var TICK_TEXT_0 =
    lang === "en"
      ? "[DESIGNATION CLASSIFIED // DECRYPT MENTIONS IN FILE TO ACCESS]"
      : "[ОБОЗНАЧЕНИЕ ЗАСЕКРЕЧЕНО // РАССЕКРЕТЬТЕ УПОМИНАНИЯ В ФАЙЛЕ]";
  if (ticker) {
    if (reduce) {
      ticker.textContent = unlockedCount > 0 ? TICK_TEXT : TICK_TEXT_0;
    } else {
      setInterval(function () {
        var activeText = unlockedCount > 0 ? TICK_TEXT : TICK_TEXT_0;
        var out = "";
        for (var i = 0; i < activeText.length; i++) {
          var ch = activeText[i];
          if (ch === " ") out += " ";
          else if (Math.random() > 0.85) out += rand(GLYPHS);
          else out += ch;
        }
        ticker.textContent = out;
      }, 130);
    }
  }

  /* ---------- LIVE CORRUPT LINES (in appendices) ---------- */
  if (!reduce) {
    document.querySelectorAll(".corrupt-line").forEach(function (el) {
      var original = el.textContent;
      setInterval(function () {
        if (!el.offsetParent) return;
        var out = "";
        for (var i = 0; i < original.length; i++) {
          var ch = original[i];
          if (ch === " ") out += " ";
          else if (Math.random() > 0.9) out += rand(GLYPHS);
          else out += ch;
        }
        el.textContent = out;
      }, 160);
    });
  }

  /* ---------- TERMINAL COMMANDS ---------- */
  function rebootTerminal() {
    termLog(
      lang === "en"
        ? "--- SYSTEM REBOOT INITIATED ---"
        : "--- ИНИЦИИРОВАНА ПЕРЕЗАГРУЗКА СИСТЕМЫ ---",
      "sys"
    );
    if (escalationIntervalId) {
      clearInterval(escalationIntervalId);
      escalationIntervalId = null;
    }
    if (blackoutTimer) {
      clearTimeout(blackoutTimer);
      blackoutTimer = null;
    }
    deactivateEncryptionMode(false);
    resetDocumentInfectionPhase();
    deactivateBlackout();
    clearErasureState();
    // Полностью очищаем сохранённое состояние сессии, чтобы после перезагрузки
    // страница открылась с экрана входа, а все спойлеры были закрыты.
    try {
      sessionStorage.removeItem("scp-km-states");
      sessionStorage.removeItem(BLACKOUT_KEY);
      sessionStorage.removeItem(ERASURE_KEY);
      sessionStorage.clear();
    } catch (e) {}
    clearBlackoutStorage();
    isEasterEggActive = false;
    unlockedCount = 0;
    dynamicTotalMentions = baseTotalMentions;
    infectionCount = 0;
    mentions.forEach(function (el) {
      el.classList.remove("unlocked");
    });
    updateMeter();
    document.body.classList.remove("shake-body");
    if (flash) {
      flash.classList.remove("on");
      flash.style.opacity = "";
    }
    if (whisperEl) {
      whisperEl.classList.remove("on");
      whisperEl.style.opacity = "";
    }
    if (floodEl) {
      floodEl.classList.add("hidden");
      floodEl.innerHTML = "";
    }
    termLog(lang === "en" ? "Memetic residue cleared" : "Меметический осадок очищен", "info");
    termLog(lang === "en" ? "Session reset to pristine" : "Сессия сброшена до первозданной", "info");
    termLog(lang === "en" ? "File re-encryption // SUCCESS" : "Повторное шифрование файла // УСПЕХ", "sys");
    termLog(lang === "en" ? "Reloading secure terminal..." : "Перезагрузка защищённого терминала...", "sys");

    // Бесшовная перезагрузка: сначала закрываем терминал и лочим скролл как в блэкауте,
    // без scrollTo, чтобы не было рывка.
    try {
      termCloseFn();
    } catch (e) {}
    document.body.classList.add("reboot-active");
    document.body.classList.add("gate-active");
    lockBlackoutScroll();
    try {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch (e) {}

    setTimeout(function () {
      window.location.reload();
    }, 900);
  }

  function handleO5Erasure() {
    var exposed = countUnlockedMentions();
    if (exposed > 0) {
      termLog(
        lang === "en"
          ? "[O5] ERASURE INTERLOCK ACTIVE // EXPOSED DESIGNATIONS: " + exposed
          : "[O5] БЛОКИРОВКА СТИРАНИЯ АКТИВНА // ОТКРЫТЫХ ОБОЗНАЧЕНИЙ: " + exposed,
        "err"
      );
      termLog(
        lang === "en"
          ? "Open Appendix K-4 to begin preliminary encryption."
          : "Откройте Приложение К-4 для начала предварительного шифрования.",
        "warn"
      );
      return;
    }
    if (!documentScanComplete) {
      termLog(
        lang === "en"
          ? "[O5] ERASURE INTERLOCK ACTIVE // DOCUMENT SCAN INCOMPLETE"
          : "[O5] БЛОКИРОВКА СТИРАНИЯ АКТИВНА // СКАНИРОВАНИЕ ДОКУМЕНТА НЕ ЗАВЕРШЕНО",
        "err"
      );
      termLog(
        lang === "en"
          ? "Open Appendix K-4 and restore all contaminated paragraphs."
          : "Откройте Приложение К-4 и восстановите все заражённые абзацы.",
        "warn"
      );
      return;
    }
    termLog(
      lang === "en"
        ? "[O5] LEGACY ERASURE COMMAND REVOKED"
        : "[O5] УСТАРЕВШАЯ КОМАНДА СТИРАНИЯ ОТОЗВАНА",
      "err"
    );
    termLog(
      lang === "en"
        ? "Document scan complete // Awaiting next authorization stage."
        : "Сканирование документа завершено // Ожидается следующий этап авторизации.",
      "warn"
    );
  }

  function handleKosstarCommand() {
    termLog(
      lang === "en"
        ? "'kosstarthe1st' is not recognized as a command"
        : "'kosstarthe1st' не является командой",
      "err"
    );
    setTimeout(function () {
      termLog(lang === "en" ? "[CRITICAL] DIRECT COGNITOHAZARD INVOCATION" : "[КРИТИЧНО] ПРЯМОЙ ВЫЗОВ КОГНИТО-УГРОЗЫ", "cog");
      mentions.forEach(function (el) {
        el.classList.add("unlocked");
      });
      updateMeter();
      window.triggerKosstar999Escalation();
    }, 10000);
  }

  function handleErasedFile() {
    termLog(lang === "en" ? "Opening erased.txt..." : "Открытие erased.txt...", "info");
    setTimeout(function () {
      redirectToErasedDocument();
    }, 600);
  }

  var COMMANDS = {
    help: function () {
      termLog(lang === "en" ? "Available commands:" : "Доступные команды:", "sys");
      termLog("  help / ? - " + (lang === "en" ? "show this list" : "показать список"), "info");
      termLog("  reboot - " + (lang === "en" ? "reset site to pristine state" : "сбросить сайт до первозданного вида"), "info");
      termLog("  erased.txt - " + (lang === "en" ? "open erased file (404)" : "открыть стёртый файл (404)"), "info");
      termLog("  scan document - " + (lang === "en" ? "show contaminated text zones" : "показать заражённые участки текста"), "info");
      termLog("  clear - " + (lang === "en" ? "clear terminal" : "очистить терминал"), "info");
      termLog("  status - " + (lang === "en" ? "show session status" : "показать статус сессии"), "info");
      termLog(lang === "en" ? "  unknown - command undefined" : "  неизвестно - команда не определена", "info");
    },
    clear: function () {
      if (termLogEl) termLogEl.innerHTML = "";
      termLog(lang === "en" ? "Terminal cleared" : "Терминал очищен", "sys");
    },
    status: function () {
      var until = getBlackoutUntil();
      var blo =
        until && Date.now() < until
          ? lang === "en"
            ? "ACTIVE (" + Math.ceil((until - Date.now()) / 60000) + " min left)"
            : "АКТИВЕН (осталось " + Math.ceil((until - Date.now()) / 60000) + " мин)"
          : "INACTIVE";
      termLog("Session: " + sessionId, "info");
      termLog("Mentions: " + unlockedCount + "/" + dynamicTotalMentions, "info");
      termLog(
        (lang === "en" ? "Encryption mode: " : "Режим шифрования: ") +
          (encryptionModeActive ? (lang === "en" ? "ACTIVE" : "АКТИВЕН") : (lang === "en" ? "INACTIVE" : "НЕАКТИВЕН")),
        encryptionModeActive ? "warn" : "info"
      );
      termLog(
        (lang === "en" ? "Document scan: " : "Сканирование документа: ") +
          (documentScanComplete
            ? (lang === "en" ? "CLEAN" : "ЧИСТО")
            : documentInfectionPhaseActive
              ? (lang === "en" ? "CONTAMINATED" : "ЗАРАЖЁН")
              : (lang === "en" ? "PENDING" : "ОЖИДАНИЕ")),
        documentInfectionPhaseActive ? "cog" : "info"
      );
      termLog(
        "Blackout: " + blo,
        blo.indexOf("ACTIVE") !== -1 || blo.indexOf("АКТИВЕН") !== -1 ? "err" : "info"
      );
      termLog(
        "Influence: " +
          (unlockedCount === 0
            ? "0% — dormant"
            : Math.round((unlockedCount / (dynamicTotalMentions || 1)) * 100) + "%"),
        "info"
      );
    },
  };

  function processCommand(raw) {
    var cmd = raw.trim();
    if (!cmd) return;
    termAddEntry(cmd, "user");
    var low = cmd.toLowerCase().replace(/\s+/g, "");
    var spacedLow = cmd.toLowerCase().trim();

    if (low === "help" || low === "?") {
      COMMANDS.help();
    } else if (low === "clear" || low === "cls") {
      COMMANDS.clear();
    } else if (low === "reboot" || low === "restart" || low === "clearall") {
      rebootTerminal();
    } else if (low === "scandocument" || low === "documentscan" || low === "scan") {
      logDocumentScanStatus();
    } else if (
      low.indexOf("erased.txt") !== -1 ||
      spacedLow === "file erased.txt" ||
      spacedLow === "cat erased.txt" ||
      spacedLow === "open erased.txt"
    ) {
      handleErasedFile();
    } else if (low === "o5-erasure" || low === "o5erasure" || low === "erasure" || low === "o5") {
      handleO5Erasure();
    } else if (
      low === "kosstarthe1st" ||
      low === "kosstar_the_1st" ||
      spacedLow === "kosstar the 1st" ||
      low === "kosstarthe1st.exe"
    ) {
      handleKosstarCommand();
    } else if (low === "status" || low === "whoami" || low === "id" || low === "location") {
      COMMANDS.status();
    } else {
      termLog(
        lang === "en"
          ? "'" + cmd + "' is not recognized as a command"
          : "'" + cmd + "' не является командой",
        "err"
      );
      termLog(lang === "en" ? "Type help for list" : "Введите help для списка", "info");
    }
  }

  if (termInput) {
    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var v = termInput.value;
        termInput.value = "";
        processCommand(v);
      }
      if (e.key === "Tab") {
        e.preventDefault();
        var cur = termInput.value.toLowerCase();
        var all = ["help", "reboot", "scan document", "erased.txt", "kosstarthe1st", "clear", "status"];
        for (var i = 0; i < all.length; i++) {
          if (all[i].indexOf(cur) === 0) {
            termInput.value = all[i];
            break;
          }
        }
      }
    });
  }

  var termForm = document.getElementById("term-form");
  if (termForm && termInput) {
    termForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = termInput.value;
      termInput.value = "";
      processCommand(v);
    });
  }
})()