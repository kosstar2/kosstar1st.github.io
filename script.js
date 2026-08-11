(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS =
    "█▓▒░<>/\\|¦=+*#@%&$АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function rand(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  var lang = document.documentElement.lang === "en" ? "en" : "ru";
  var locale = lang === "en" ? "en-GB" : "ru-RU";
  function audit(type, detail, en, ru) {
    if (window.SCPLogs) window.SCPLogs.add(type, detail, en, ru);
  }

  var bootLinesByLang = {
    ru: [
      "> ЗАЩИЩЁННЫЙ ТЕРМИНАЛ ФОНДА SCP                               ",
      "> ЗАПУСК . . . . . . . . . . . . . . . . . . . . . . [ УСПЕХ ]",
      "> УСТАНОВКА СОЕДИНЕНИЯ . . . . . . . . . . . . . . . [ OK ]",
      "> ПРОВЕРКА ДОПУСКА . . . . . . . . . . . . . . . . . УРОВЕНЬ null.kosstarthe1st.w͚̙̏ͭ͡ẽ̩͍͍̈͞l̛͈̗̼̉c͉̰̲͈̅o̷̺̥͈͖͌ͪm̢̗̞̉ͣ͌ͅe͈͚̘ͮͬ͌",
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
      "> VERIFYING CLEARANCE  . . . . . . . . . . . . . . . LEVEL null.kosstarthe1st.w͚̙̏ͭ͡ẽ̩͍͍̈͞l̛͈̗̼̉c͉̰̲͈̅o̷̺̥͈͖͌ͪm̢̗̞̉ͣ͌ͅe͈͚̘ͮͬ͌",
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
    if (bootTimer) { clearTimeout(bootTimer); bootTimer = null; }
    bootDone = true;
    if (bootLog) bootLog.textContent = bootLines.join("\n");
    if (bootEnter) bootEnter.hidden = false;
    if (bootSkip) bootSkip.hidden = true;
  }

  function runBoot() {
    if (reduce) { finishBoot(); return; }
    var li = 0, ci = 0, text = "";
    function type() {
      if (bootDone) return;
      if (li >= bootLines.length) { finishBoot(); return; }
      var line = bootLines[li];
      if (ci <= line.length) {
        bootLog.textContent = text + line.slice(0, ci);
        ci++;
        bootTimer = setTimeout(type, 12 + Math.random() * 22);
      } else {
        text += line + "\n";
        li++; ci = 0;
        bootTimer = setTimeout(type, 180);
      }
    }
    type();
  }

  function closeBoot() {
    if (bootAudio) bootAudio.pause();
    if (boot) boot.classList.add("gone");
    document.body.classList.remove("boot-active", "gate-active");
    if (!document.body.classList.contains("blackout-active")) unlockBlackoutScroll();
    audit("document", "document --open KΣ-0001", "document opened", "документ открыт");
    setTimeout(function () { if (boot) boot.style.display = "none"; }, 700);
  }

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
  var sessionId = "SID-" + Math.random().toString(16).slice(2, 10).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
  function nowTs() { return new Date().toLocaleTimeString(locale, { hour12: false }); }

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
  function termLog(msg, type) { type = type || "info"; termAddEntry(msg, type); }
  function termOpen() {
    if (!termEl) return;
    termEl.classList.remove("hidden");
    termEl.setAttribute("aria-hidden", "false");
    if (termInput) termInput.focus();
    termLog(lang === "en" ? "terminal opened" : "терминал открыт", "cmd");
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
  if (termClose) termClose.addEventListener("click", termCloseFn);
  var langSwitch = document.querySelector(".lang-switch");
  if (langSwitch) {
    langSwitch.addEventListener("click", function (e) {
      if (memeticSeizureActive) {
        e.preventDefault();
        termLog(
          lang === "en"
            ? "[LOCKED] LANGUAGE SWITCH DENIED // MEMETIC SEIZURE IN PROGRESS"
            : "[БЛОКИРОВКА] СМЕНА ЯЗЫКА ОТКЛОНЕНА // ИДЁТ ЗАХВАТ МЕМЕТИЧЕСКОЙ СТАБИЛЬНОСТИ",
          "err"
        );
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    var ae = document.activeElement;
    var inTerm = ae && (ae.id === "term-input" || (termEl && termEl.contains(ae)));
    if (e.key === "Escape" && termEl && !termEl.classList.contains("hidden")) { termCloseFn(); return; }
    if (!inTerm && (e.key === "`" || e.key === "ё")) {
      if (termEl) {
        e.preventDefault();
        if (termEl.classList.contains("hidden")) termOpen(); else termCloseFn();
      }
    }
  });

  if (checkErasureOnLoad()) return;

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
    if (allEntries.length > 0) allEntries[allEntries.length - 1].id = clearanceEntryId;
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
  function resolve404Path() { return "./404.html"; }
  function redirectToErasedDocument() { window.location.replace(resolve404Path()); }
  function checkErasureOnLoad() {
    if (!isErasureActive()) return false;
    if (/\/404\.html$/i.test(window.location.pathname)) return false;
    redirectToErasedDocument();
    return true;
  }
  function blockBlackoutScroll(e) { if (termEl && termEl.contains(e.target)) return; e.preventDefault(); }
  function blockBlackoutKeys(e) {
    var ae = document.activeElement;
    if (ae && (ae.id === "term-input" || (termEl && termEl.contains(ae)))) return;
    var keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","End"," ","Spacebar"];
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
    if (active) lockBlackoutScroll(); else unlockBlackoutScroll();
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
          rebootTerminal();
          termLog(lang === "en" ? "BLACKOUT protocol no longer active — signal restored" : "Действие протокола BLACKOUT прекращено — сигнал восстановлен", "sys");
          return;
        }
        var mm = Math.floor(diff / 60000);
        var ss = Math.floor((diff % 60000) / 1000);
        var txt = (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
        if (firstInner) firstInner.textContent =
          (lang === "en" ? "SIGNAL LOST // BLACKOUT PROTOCOL — " : "СИГНАЛ ПОТЕРЯН // ПРОТОКОЛ BLACKOUT — ") + txt;
      }, 1000);
      var mm0 = 10, ss0 = 0;
      if (firstInner) firstInner.textContent =
        (lang === "en" ? "SIGNAL LOST // BLACKOUT PROTOCOL — " : "СИГНАЛ ПОТЕРЯН // ПРОТОКОЛ BLACKOUT — ") +
        (mm0 < 10 ? "0" : "") + mm0 + ":" + (ss0 < 10 ? "0" : "") + ss0;
    }
    termLog(lang === "en" ? "[CRITICAL] BLACKOUT PROTOCOL ENGAGED — 10:00" : "[КРИТИЧНО] ПРОТОКОЛ BLACKOUT АКТИВИРОВАН — 10:00", "cog");
    termLog(lang === "en" ? "Recovery terminal remains available via >_" : "Терминал восстановления доступен через >_", "warn");
  }
  function deactivateBlackout() {
    if (blackoutEl) blackoutEl.classList.add("hidden");
    setBlackoutUiActive(false);
    if (floodEl) { floodEl.classList.add("hidden"); floodEl.innerHTML = ""; }
    clearBlackoutStorage();
    if (blackoutCountdown) { clearInterval(blackoutCountdown); blackoutCountdown = null; }
    if (blackoutTimer) { clearTimeout(blackoutTimer); blackoutTimer = null; }
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
        if (inner) inner.textContent =
          (lang === "en" ? "SIGNAL LOST // BLACKOUT PROTOCOL — " : "СИГНАЛ ПОТЕРЯН // ПРОТОКОЛ BLACKOUT — ") +
          (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
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
      span.style.transform = "rotate(" + (Math.random() * 120 - 60).toFixed(1) + "deg) translate(-50%,-50%)";
      span.style.opacity = (0.15 + Math.random() * 0.85).toFixed(2);
      span.style.fontSize = (12 + Math.random() * 32).toFixed(0) + "px";
      span.style.textShadow = "0 0 " + (8 + Math.random() * 16).toFixed(0) + "px rgba(210,58,66," + (0.4 + Math.random() * 0.6).toFixed(2) + ")";
      floodEl.appendChild(span);
    }
    termLog(lang === "en" ? "[CRITICAL] K-class textual flood // containment failure" : "[КРИТИЧНО] Текстовый поток класса K // сдерживание невозможно", "cog");
    blackoutTimer = setTimeout(function () { activateBlackout(); }, 3500);
  }

  var bootAudio = document.getElementById("boot-audio");
  var audioStarted = false;
  gate = document.getElementById("gate");
  gateEnter = document.getElementById("gate-enter");
  var bootStarted = false;

  (function initIntroLocks() {
    var until = getBlackoutUntil();
    var isBlackout = until && Date.now() < until;
    if (isBlackout) return;
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
    var ba = document.getElementById("boot-audio");
    if (ba) {
      ba.volume = 0.85; ba.currentTime = 0;
      ba.play().catch(function () {});
    }
    runBoot();
  }
  function closeGate() {
    if (!gate) return;
    gate.classList.add("gone");
    document.body.classList.remove("gate-active");
    if (boot && boot.style.display !== "none") document.body.classList.add("boot-active");
    setTimeout(function () { gate.style.display = "none"; }, 500);
  }
  if (boot && bootLog && bootEnter) {
    if (bootSkip) {
      bootSkip.textContent = SKIP_LABEL;
      bootSkip.hidden = false;
      bootSkip.addEventListener("click", function () {
        if (!bootDone) finishBoot(); else closeBoot();
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

  var clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString(locale, { hour12: false });
  }
  tick();
  setInterval(tick, 1000);

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

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  document.querySelectorAll(".fold-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var fold = btn.parentElement;
      var body = fold ? fold.querySelector(".fold-body") : null;
      var open = fold.classList.toggle("open");
      var appendix = (btn.querySelector("span:first-child") || btn).textContent.replace(/^[^A-ZА-ЯKК]*|\s+/g, " ").trim().slice(0, 70);
      audit("appendix", "appendix --" + (open ? "open " : "close ") + appendix, (open ? "appendix opened: " : "appendix closed: ") + appendix, (open ? "приложение открыто: " : "приложение закрыто: ") + appendix);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var sign = btn.querySelector(".fold-sign");
      if (sign) sign.textContent = open ? "—" : "+";
      if (body) body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
      if (fold && fold.id === "erasure-order") {
        erasureOrderOpen = open;
        if (open) {
          setTimeout(handleErasureOrderOpened, 260);
        } else if (k4CrumbleTimer) {
          clearTimeout(k4CrumbleTimer);
          k4CrumbleTimer = null;
        }
      }
    });
  });

  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll(".redacted").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var isRevealed = el.classList.toggle("touch-reveal");
        if (isRevealed) setTimeout(function () { el.classList.remove("touch-reveal"); }, 2500);
      });
    });
    document.querySelectorAll(".ghost").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var isRevealed = el.classList.toggle("touch-show");
        if (isRevealed) setTimeout(function () { el.classList.remove("touch-show"); }, 3000);
      });
    });
  }

  var mentions = document.querySelectorAll("[data-kmention]");
  function refreshMentions() { mentions = document.querySelectorAll("[data-kmention]"); }
  function bindMentionHandlers(el) {
    if (el._mentionBound) return;
    el._mentionBound = true;
    getMentionSource(el);
    el.addEventListener("pointerenter", function () {
      cancelMentionEncryptionRollback(el);
      startMentionEncryption(el);
    });
    el.addEventListener("pointerleave", function () {
      if (!hoverlessPointer) scheduleMentionEncryptionRollback(el);
    });
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (encryptionModeActive) {
        if (el.classList.contains("encryption-ready")) { fixMentionEncryption(el); }
        else if (el.classList.contains("unlocked")) {
          startMentionEncryption(el);
          el.classList.add("encryption-rejected");
          setTimeout(function () { el.classList.remove("encryption-rejected"); }, 320);
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
      if (cipherProtocolComplete && !el.classList.contains("unlocked")) {
        termLog(
          lang === "en"
            ? "[CIPHER-3U] DESIGNATION PERMANENTLY SEALED // RE-EXPOSURE DENIED"
            : "[ШИФРАТОР-3U] ОБОЗНАЧЕНИЕ ОКОНЧАТЕЛЬНО ЗАПЕЧАТАНО // ПОВТОРНОЕ РАСКРЫТИЕ ЗАПРЕЩЕНО",
          "warn"
        );
        return;
      }
      if (!el.classList.contains("unlocked")) {
        resetMentionEncryption(el);
        el.classList.add("unlocked");
        audit("decrypt", "designation --decrypt --index:" + (Array.prototype.indexOf.call(mentions, el) + 1), "designation decrypted", "обозначение расшифровано");
        var newCount = updateMeter();
        var decryptAudio = document.getElementById("decrypt-audio");
        if (decryptAudio) {
          try { var clone = decryptAudio.cloneNode(); clone.volume = 0.4; clone.currentTime = 0; clone.play().catch(function () {}); } catch (err) {}
        }
        if (newCount === 1) burst();
      }
    });
  }
  function rebindMentionsIn(container) {
    if (!container) return;
    var inner = container.querySelectorAll(".k-mention[data-kmention]");
    for (var i = 0; i < inner.length; i++) bindMentionHandlers(inner[i]);
    refreshMentions();
  }
  var baseTotalMentions = mentions.length;
  var dynamicTotalMentions = baseTotalMentions;
  var unlockedCount = 0;
  var isEasterEggActive = false;
  var encryptionModeActive = false;
  var hoverlessPointer = window.matchMedia("(hover: none)").matches;
  var UNLOCKED_HOVER = lang === "en" ? "There is no way back" : "Пути назад нет";
  var LOCKED_HOVER = lang === "en" ? "Designation classified // Click to decrypt" : "Обозначение засекречено // Нажмите для дешифровки";
  var ENCRYPTION_HOVER = lang === "en" ? "Keep the encryption cursor over the designation" : "Удерживайте курсор шифрования над обозначением";
  var ENCRYPTION_FIX = lang === "en" ? "Encryption complete // Click to lock cipher" : "Шифрование завершено // Нажмите для фиксации шифра";
  var erasureOrderOpen = false;
  var documentInfectionPhaseActive = false;
  var documentScanComplete = false;
  var cipherProtocolComplete = false;
  var memeticSeizureActive = false;
  var infectionRecords = [];
  var infectionSpreadTimer = null;
  var infectionSerial = 0;
  var infectionCount = 0;
  var INFECTION_TARGET_COUNT = 10;
  var INFECTION_PATTERN = Array.from("kosstarthe1st");

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
    if (mode === "corrupt") labelEl.textContent = lang === "en" ? METER_LABEL_CORRUPT_EN : METER_LABEL_CORRUPT_RU;
    else labelEl.textContent = lang === "en" ? METER_LABEL_DEFAULT_EN : METER_LABEL_DEFAULT_RU;
  }

  function renderCorruptionMeter() {
    var meterText = document.getElementById("k-meter-text");
    if (!meterText) return;
    var whole = Math.floor(corruptionMeter);
    if (whole > CORRUPTION_MAX) whole = CORRUPTION_MAX;
    var maxVisualBars = 5;
    var filledBars = Math.round((whole / CORRUPTION_MAX) * maxVisualBars);
    var bars = "";
    for (var i = 0; i < maxVisualBars; i++) bars += i < filledBars ? "█" : "░";
    meterText.textContent = whole + "/" + CORRUPTION_MAX + " [" + bars + "] " + whole + "%";
    if (whole >= CORRUPTION_MAX) meterText.classList.add("blink");
    else meterText.classList.remove("blink");
  }

  function countActiveInfections() {
    var n = 0;
    for (var i = 0; i < infectionRecords.length; i++) if (!infectionRecords[i].cleaned) n++;
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
    if (corruptionTickTimer) { clearInterval(corruptionTickTimer); corruptionTickTimer = null; }
  }

  function resetCorruptionMeter() {
    stopCorruptionMeter();
    corruptionMeter = 0;
    corruptionTakeoverTriggered = false;
    setMeterLabel("default");
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
        if (parent && parent.closest(".k-mention, .redacted, script, style")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var node;
    while ((node = walker.nextNode())) {
      var original = Array.from(node.nodeValue);
      var state = { node: node, original: original.slice(), current: original.slice() };
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
      el: el, states: states, slots: slots,
      infectedCount: 0, infectionTimer: null, cleaningTimer: null,
      resumeTimer: null, reinfectionTimer: null, spreadTriggered: false, cleaned: false,
      enterHandler: null, leaveHandler: null, isAppendix: !!foldBtn, fold: fold,
      logEl: fold ? fold.querySelector(".log") : null,
    };
  }

  function infectionPercent(record) { return Math.round((record.infectedCount / (record.slots.length || 1)) * 100); }

  function buildAppendixFlood(record) {
    if (!record.logEl || record.floodEl) return;
    if (!record._logOriginalHtml) record._logOriginalHtml = record.logEl.innerHTML;
    var flood = document.createElement("div");
    flood.className = "appendix-flood";
    var count = 60;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.textContent = "kosstar the 1st";
      span.style.left = (Math.random() * 100).toFixed(2) + "%";
      span.style.top = (Math.random() * 100).toFixed(2) + "%";
      span.style.transform = "rotate(" + (Math.random() * 90 - 45).toFixed(1) + "deg) translate(-50%,-50%)";
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
      rebindMentionsIn(record.logEl);
    }
    record.floodEl = null;
  }

  function stopRecordInfection(record) {
    if (record.infectionTimer) { clearInterval(record.infectionTimer); record.infectionTimer = null; }
  }
  function stopRecordCleaning(record) {
    if (record.cleaningTimer) { clearInterval(record.cleaningTimer); record.cleaningTimer = null; }
    record.el.classList.remove("infection-cleansing");
  }
  function cancelRecordResume(record) {
    if (record.resumeTimer) { clearTimeout(record.resumeTimer); record.resumeTimer = null; }
  }
  function restoreRecordText(record) {
    record.states.forEach(function (state) {
      state.current = state.original.slice();
      state.node.nodeValue = state.original.join("");
    });
    record.slots.forEach(function (slot) { slot.infected = false; });
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
        lang === "en" ? "[ANOMALY] CLEAN ZONE RECONTAMINATED // " + record.id : "[АНОМАЛИЯ] ОЧИЩЕННАЯ ЗОНА ЗАРАЖЕНА ПОВТОРНО // " + record.id,
        "cog"
      );
    }
    record.infectionTimer = setInterval(function () {
      var next = null;
      for (var i = 0; i < record.slots.length; i++) {
        if (!record.slots[i].infected) { next = record.slots[i]; break; }
      }
      if (!next) {
        stopRecordInfection(record);
        record.el.classList.add("infection-saturated");
        if (record.isAppendix) showAppendixFlood(record);
        termLog(lang === "en" ? "[ANOMALY] ZONE SATURATED // " + record.id : "[АНОМАЛИЯ] ЗОНА ПОЛНОСТЬЮ ЗАРАЖЕНА // " + record.id, "cog");
        var infectionSound = document.getElementById("infection-audio");
        if (infectionSound) {
          try { var clone = infectionSound.cloneNode(); clone.volume = 0.5; clone.currentTime = 0; clone.play().catch(function () {}); } catch (err) {}
        }
        setTimeout(function () {
          var src = record.sourceMention;
          if (src && src.classList.contains("unlocked")) {
            var newZone = startRandomInfectionZone(src);
            if (!newZone && infectionCount >= INFECTION_TARGET_COUNT) maybeTriggerTakeover();
          } else if (!src) {
            var newZone = startRandomInfectionZone(null);
            if (!newZone) maybeTriggerTakeover();
          } else {
            maybeTriggerTakeover();
          }
        }, 2000);
        return;
      }
      spawnFlyingCharForSlot(record, next);
      setInfectionSlot(record, next, true);
    }, 80);
  }

  function maybeTriggerTakeover() {
    var allSaturated = infectionRecords.every(function (r) { return r.infectedCount >= r.slots.length; });
    if (allSaturated && infectionRecords.length >= 1 && infectionCount >= INFECTION_TARGET_COUNT) triggerTotalTakeover();
  }

  function clearAllSourceGlow() {
    mentions.forEach(function (m) { m.classList.remove("mention-source-active"); });
    var btns = document.querySelectorAll(".fold-btn.mention-source-active");
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove("mention-source-active");
  }
  function getSourceAnchor(mention) {
    var fold = mention.closest(".fold");
    var btn = fold ? fold.querySelector(".fold-btn") : null;
    var foldClosed = fold && !fold.classList.contains("open");
    if (foldClosed && btn) {
      mention.classList.remove("mention-source-active");
      btn.classList.add("mention-source-active");
      return btn;
    }
    if (btn) btn.classList.remove("mention-source-active");
    mention.classList.add("mention-source-active");
    return mention;
  }

  function spawnFlyingCharForSlot(record, slot) {
    var source = record.sourceMention;
    var targetRect = record.el.getBoundingClientRect();
    var tx = targetRect.left + 20 + Math.random() * Math.max(20, targetRect.width - 40);
    var ty = targetRect.top + 8 + Math.random() * Math.max(10, targetRect.height - 16);
    var sx, sy;
    if (source && source.isConnected) {
      var anchor = getSourceAnchor(source);
      var srcRect = anchor.getBoundingClientRect();
      if (srcRect.width === 0 || srcRect.height === 0) {
        sx = Math.random() < 0.5 ? -20 : window.innerWidth + 20;
        sy = ty;
      } else {
        sx = srcRect.left + srcRect.width / 2;
        sy = srcRect.top + srcRect.height / 2;
      }
    } else {
      sx = Math.random() < 0.5 ? -20 : window.innerWidth + 20;
      sy = ty;
    }
    var el = document.createElement("span");
    el.className = "flying-char";
    el.textContent = slot.replacement;
    el.style.left = sx + "px";
    el.style.top = sy + "px";
    document.body.appendChild(el);
    var duration = 300;
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / duration);
      var e = 1 - Math.pow(1 - t, 3);
      el.style.left = (sx + (tx - sx) * e) + "px";
      el.style.top = (sy + (ty - sy) * e) + "px";
      if (t < 1) requestAnimationFrame(step);
      else {
        el.classList.add("arriving");
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200);
      }
    }
    requestAnimationFrame(step);
  }

  function getInfectionCandidates() {
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
      ".doc-shell .fold.open p",
      ".doc-shell .fold.open .rules li"
    ];
    return Array.prototype.slice.call(document.querySelectorAll(selectors.join(","))).filter(function (el) {
      if (!el.offsetParent && !el.closest(".fold")) return false;
      if (el.closest(".fold-sign")) return false;
      if (el.closest("#erasure-order .fold-body")) return false;
      var parentFold = el.closest(".fold");
      var isFoldBtn = el.closest(".fold-btn");
      if (parentFold && !parentFold.classList.contains("open") && !isFoldBtn) return false;
      for (var i = 0; i < infectionRecords.length; i++) if (infectionRecords[i].el === el) return false;
      if (el.classList.contains("infection-protected")) return false;
      if (el.classList.contains("mention-source-active")) return false;
      if (el.closest && el.closest(".fold-btn.mention-source-active")) return false;
      return true;
    });
  }

  function pickNearestCandidate(sourceEl, candidates) {
    var srcRect = sourceEl.getBoundingClientRect();
    var srcX = srcRect.left + srcRect.width / 2;
    var srcY = srcRect.top + srcRect.height / 2;
    var best = null, bestDist = Infinity;
    for (var i = 0; i < candidates.length; i++) {
      var r = candidates[i].getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var d = (cx - srcX) * (cx - srcX) + (cy - srcY) * (cy - srcY);
      if (d < bestDist) { bestDist = d; best = candidates[i]; }
    }
    return best || candidates[0];
  }

  function startRandomInfectionZone(sourceMention) {
    if (!documentInfectionPhaseActive) return null;
    var candidates = getInfectionCandidates();
    if (!candidates.length) return null;
    var targetEl;
    if (sourceMention) {
      var anchor = getSourceAnchor(sourceMention);
      targetEl = pickNearestCandidate(anchor, candidates);
    } else {
      targetEl = rand(candidates);
    }
    var record = buildInfectionRecord(targetEl);
    if (!record) return null;
    record.sourceMention = sourceMention || null;
    infectionRecords.push(record);
    infectionCount++;
    if (infectionCount >= INFECTION_TARGET_COUNT) {
      termLog(
        lang === "en" ? "[ANOMALY] CONTAMINATION THRESHOLD REACHED // " + infectionCount + " ZONES" : "[АНОМАЛИЯ] ПОРОГ НАКОПЛЕНИЯ ДОСТИГНУТ // " + infectionCount + " ЗОН",
        "cog"
      );
    }
    record.el.dataset.infectionId = record.id;
    record.enterHandler = function () { startRecordCleaning(record); };
    record.leaveHandler = function () { scheduleRecordInfectionResume(record); };
    record.el.addEventListener("pointerenter", record.enterHandler);
    record.el.addEventListener("pointerleave", record.leaveHandler);
    (function (rec) {
      if (!termLogEl) return;
      var div = document.createElement("div");
      div.className = "term-entry cog";
      var ts = document.createElement("span");
      ts.className = "ts";
      ts.textContent = "[" + nowTs() + "]";
      div.appendChild(ts);
      var text = document.createTextNode(
        lang === "en" ? " [SCAN] CONTAMINATED TEXT DETECTED // " : " [СКАНИРОВАНИЕ] ОБНАРУЖЕН ЗАРАЖЁННЫЙ ТЕКСТ // "
      );
      div.appendChild(text);
      var link = document.createElement("a");
      link.href = "#";
      link.className = "infection-link";
      link.textContent = rec.id;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        termCloseFn();
        setTimeout(function () { scrollToInfectionRecord(rec); }, 120);
      });
      div.appendChild(link);
      termLogEl.appendChild(div);
      termLogEl.scrollTop = termLogEl.scrollHeight;
    })(record);
    startRecordInfection(record, false);
    return record;
  }

  function scheduleInfectionSpread(sourceMention) {
    if (!documentInfectionPhaseActive || infectionSpreadTimer) return;
    infectionSpreadTimer = setTimeout(function () {
      infectionSpreadTimer = null;
      if (!documentInfectionPhaseActive) return;
      if (sourceMention && !sourceMention.classList.contains("unlocked")) return;
      if (sourceMention) {
        var alreadyActive = infectionRecords.some(function (r) { return r.sourceMention === sourceMention && !r.cleaned; });
        if (alreadyActive) return;
      }
      var next = startRandomInfectionZone(sourceMention || null);
      if (next) {
        termLog(
          lang === "en" ? "[ANOMALY] CONTAMINATION SPREAD TO NEW PARAGRAPH" : "[АНОМАЛИЯ] ЗАРАЖЕНИЕ РАСПРОСТРАНИЛОСЬ НА НОВЫЙ АБЗАЦ",
          "cog"
        );
      } else if (!sourceMention && infectionCount < INFECTION_TARGET_COUNT) {
        scheduleInfectionSpread(null);
      }
    }, 1500);
  }

  function checkDocumentScanCompletion() {
    if (countUnlockedMentions() > 0) return;
    var wasSourceDriven = infectionRecords.some(function (r) { return !!r.sourceMention; });
    if (!wasSourceDriven && infectionCount < INFECTION_TARGET_COUNT) return;
    var hasActiveInfection = infectionRecords.some(function (record) { return !record.cleaned; });
    if (hasActiveInfection) return;
    documentInfectionPhaseActive = false;
    documentScanComplete = true;
    cipherProtocolComplete = true;
    memeticSeizureActive = false;
    document.body.classList.remove("document-scan-mode");
    if (!encryptionModeActive) customCursor.hide();
    resetCorruptionMeter();
    if (infectionSpreadTimer) { clearTimeout(infectionSpreadTimer); infectionSpreadTimer = null; }
    infectionRecords.forEach(function (record) {
      if (record.reinfectionTimer) { clearTimeout(record.reinfectionTimer); record.reinfectionTimer = null; }
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
    memeticSeizureActive = false;
    document.body.classList.remove("document-scan-mode");
    customCursor.hide();
    stopCorruptionMeter();
    corruptionMeter = CORRUPTION_MAX;
    renderCorruptionMeter();
    if (infectionSpreadTimer) { clearTimeout(infectionSpreadTimer); infectionSpreadTimer = null; }
    infectionRecords.forEach(function (record) {
      stopRecordInfection(record);
      stopRecordCleaning(record);
      cancelRecordResume(record);
      if (record.reinfectionTimer) clearTimeout(record.reinfectionTimer);
    });
    clearAllSourceGlow();
    termLog(
      lang === "en"
        ? "[ANOMALY] TOTAL TEXTUAL CORRUPTION // OBJECT CONTROLS DOCUMENT"
        : "[АНОМАЛИЯ] ПОЛНОЕ ТЕКСТОВОЕ ПОВРЕЖДЕНИЕ // ОБЪЕКТ КОНТРОЛИРУЕТ ДОКУМЕНТ",
      "cog"
    );
    setTimeout(function () { startKSTTextFlood(); }, 800);
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
      lang === "en" ? "[SCAN] ZONE RESTORED // " + record.id + " → PROTECTED (90s)" : "[СКАНИРОВАНИЕ] ЗОНА ВОССТАНОВЛЕНА // " + record.id + " → ЗАЩИТА (90с)",
      "sys"
    );
    setTimeout(function () { record.el.classList.remove("infection-cleansed"); }, 900);
    record.protectionTimer = setTimeout(function () {
      record.el.classList.remove("infection-protected");
      record.el.removeAttribute("data-infection-id");
      if (record.enterHandler) record.el.removeEventListener("pointerenter", record.enterHandler);
      if (record.leaveHandler) record.el.removeEventListener("pointerleave", record.leaveHandler);
      var idx = infectionRecords.indexOf(record);
      if (idx !== -1) infectionRecords.splice(idx, 1);
      if (documentInfectionPhaseActive) {
        if (record.sourceMention) {
          if (record.sourceMention.classList.contains("unlocked")) scheduleInfectionSpread(record.sourceMention);
        } else scheduleInfectionSpread(null);
      }
    }, 90000);
    if (record.sourceMention) {
      if (record.sourceMention.classList.contains("unlocked")) scheduleInfectionSpread(record.sourceMention);
    } else scheduleInfectionSpread(null);
    checkDocumentScanCompletion();
  }

  function startRecordCleaning(record) {
    if (!documentInfectionPhaseActive || record.cleaned || record.cleaningTimer || record.infectedCount <= 0) return;
    cancelRecordResume(record);
    stopRecordInfection(record);
    record.el.classList.remove("infection-saturated");
    record.el.classList.add("infection-cleansing");
    if (!record.spreadTriggered) {
      record.spreadTriggered = true;
      if (record.sourceMention) {
        if (record.sourceMention.classList.contains("unlocked")) scheduleInfectionSpread(record.sourceMention);
      } else scheduleInfectionSpread(null);
    }
    var CLEAN_DURATION = 1000;
    var CLEAN_TICK = 40;
    var perTick = Math.max(1, Math.ceil((record.infectedCount || 1) / (CLEAN_DURATION / CLEAN_TICK)));
    record.cleaningTimer = setInterval(function () {
      var cleared = 0;
      for (var i = 0; i < record.slots.length && cleared < perTick; i++) {
        if (record.slots[i].infected) { setInfectionSlot(record, record.slots[i], false); cleared++; }
      }
      if (record.infectedCount <= 0) finishRecordCleaning(record);
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

  var customCursor = (function () {
    var el = document.createElement("div");
    el.className = "custom-cursor";
    var img = document.createElement("img");
    var isSubdir = /\/ru\//i.test(window.location.pathname);
    img.src = (isSubdir ? "../" : "./") + "cursor.png";
    img.alt = "";
    img.draggable = false;
    el.appendChild(img);
    document.body.appendChild(el);
    var active = false;
    function onMove(e) { if (!active) return; el.style.left = e.clientX + "px"; el.style.top = e.clientY + "px"; }
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", function () { if (active) el.style.display = "block"; });
    document.addEventListener("mouseleave", function () { el.style.display = "none"; });
    return {
      show: function () { active = true; el.style.display = "block"; },
      hide: function () { active = false; el.style.display = "none"; }
    };
  })();

  function startDocumentInfectionPhase(fromExposedMentions) {
    if (documentInfectionPhaseActive || documentScanComplete) return;
    if (!fromExposedMentions && countUnlockedMentions() > 0) return;
    documentInfectionPhaseActive = true;
    memeticSeizureActive = true;
    documentAttackBegan = true;
    document.body.classList.add("document-scan-mode");
    customCursor.show();
    corruptionMeter = 0;
    corruptionTakeoverTriggered = false;
    setMeterLabel("corrupt");
    renderCorruptionMeter();
    startCorruptionMeter();
    termLog(
      lang === "en" ? "[O5] DOCUMENT INTEGRITY SCAN STARTED" : "[O5] ЗАПУЩЕНО СКАНИРОВАНИЕ ЦЕЛОСТНОСТИ ДОКУМЕНТА",
      "sys"
    );
    termLog(
      lang === "en" ? "[ANOMALY] UNAUTHORIZED TEXT MUTATION DETECTED" : "[АНОМАЛИЯ] ОБНАРУЖЕНО НЕСАНКЦИОНИРОВАННОЕ ИЗМЕНЕНИЕ ТЕКСТА",
      "cog"
    );
    if (fromExposedMentions) {
      var sources = [];
      mentions.forEach(function (m) { if (m.classList.contains("unlocked")) sources.push(m); });
      sources.forEach(function (src) { startRandomInfectionZone(src); });
    } else {
      startRandomInfectionZone(null);
    }
  }

  function handleErasureOrderOpened() {
    if (contactStage >= 2) { handleK4DuringHelp(); return; }
    var exposed = countUnlockedMentions();
    if (exposed > 0) {
      activateEncryptionMode();
      startDocumentInfectionPhase(true);
      return;
    }
    startDocumentInfectionPhase(false);
  }

  var contactStage = 0;
  var contactInitiated = false;
  var logsViewed = false;
  var syslogsViewed = false;
  var oracleLoginStage = 0;
  var oracleLoginTmp = '';
  var whispersSuppressed = false;
  var documentAttackBegan = false;
  var k4CrumbleTimer = null;
  var k4CrumbleDone = false;
  var k4WhyShown = false;
  var inputLockOverlay = null;

  function T(en, ru) { return lang === "en" ? en : ru; }

  function pulseTerminalToggle() {
    if (!termToggle) return;
    termToggle.classList.add("term-incoming");
    setTimeout(function () { termToggle.classList.remove("term-incoming"); }, 12000);
  }

  function handleK4DuringHelp() {
    if (k4CrumbleDone) return;
    if (!k4WhyShown) {
      k4WhyShown = true;
      pulseTerminalToggle();
      termLog(
        T("&gt; why did you open that again?", "&gt; зачем ты снова это открыл?"),
        "cog"
      );
    }
    if (k4CrumbleTimer) clearTimeout(k4CrumbleTimer);
    k4CrumbleTimer = setTimeout(function () {
      k4CrumbleTimer = null;
      triggerK4Crumble();
    }, 10000);
  }

  function scrambleCrumbleText(span) {
    if (!span) return null;
    span._crumbleOriginal = span.textContent;
    return setInterval(function () {
      var out = "";
      for (var i = 0; i < span._crumbleOriginal.length; i++) {
        var ch = span._crumbleOriginal[i];
        if (ch === " " || ch === "▸" || ch === "—" || ch === "+") out += ch;
        else if (Math.random() > 0.35) out += rand(GLYPHS);
        else out += ch;
      }
      span.textContent = out;
    }, 50);
  }

  function triggerK4Crumble() {
    if (k4CrumbleDone) return;
    k4CrumbleDone = true;
    audit("anomaly", "appendix K-4 --destroy --source:kosstarthe1st", "appendix K-4 destroyed", "приложение K-4 уничтожено");
    var fold = document.getElementById("erasure-order");
    if (!fold) return;
    var body = fold.querySelector(".fold-body");
    var btn = fold.querySelector(".fold-btn");
    var sign = fold.querySelector(".fold-sign");
    var titleSpan = btn ? btn.querySelector("span:first-child") : null;
    fold.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (sign) sign.textContent = "+";
    if (body) body.style.maxHeight = "0px";
    erasureOrderOpen = false;
    setTimeout(function () {
      fold.classList.add("appendix-crumbling");
      var scrambleTimer = null;
      if (titleSpan) scrambleTimer = scrambleCrumbleText(titleSpan);
      setTimeout(function () {
        if (scrambleTimer) clearInterval(scrambleTimer);
        fold.classList.add("appendix-crumbled");
      }, 2300);
    }, 500);
    setTimeout(function () {
      termLog(T("&gt; you're wasting your time.", "&gt; не тем занимаешься."), "cog");
    }, 1800);
    setTimeout(function () { autoTypeCommand("logs"); }, 3200);
  }

  function inputLockKeyBlocker(e) { e.preventDefault(); e.stopImmediatePropagation(); }
  function lockUserInput() {
    if (inputLockOverlay) return;
    inputLockOverlay = document.createElement("div");
    inputLockOverlay.className = "input-lock-overlay";
    document.body.appendChild(inputLockOverlay);
    window.addEventListener("keydown", inputLockKeyBlocker, true);
    window.addEventListener("keypress", inputLockKeyBlocker, true);
    window.addEventListener("keyup", inputLockKeyBlocker, true);
  }
  function unlockUserInput() {
    if (!inputLockOverlay) return;
    if (inputLockOverlay.parentNode) inputLockOverlay.parentNode.removeChild(inputLockOverlay);
    inputLockOverlay = null;
    window.removeEventListener("keydown", inputLockKeyBlocker, true);
    window.removeEventListener("keypress", inputLockKeyBlocker, true);
    window.removeEventListener("keyup", inputLockKeyBlocker, true);
  }
  function autoTypeCommand(text) {
    termOpen();
    lockUserInput();
    if (termInput) termInput.value = "";
    var i = 0;
    var typer = setInterval(function () {
      if (!termInput) { clearInterval(typer); unlockUserInput(); return; }
      if (i < text.length) { termInput.value += text.charAt(i); i++; }
      else {
        clearInterval(typer);
        setTimeout(function () {
          var v = termInput.value;
          termInput.value = "";
          unlockUserInput();
          processCommand(v);
        }, 450);
      }
    }, 170);
  }

  function resetDocumentInfectionPhase() {
    documentInfectionPhaseActive = false;
    documentScanComplete = false;
    cipherProtocolComplete = false;
    memeticSeizureActive = false;
    document.body.classList.remove("document-scan-mode");
    if (!encryptionModeActive) customCursor.hide();
    resetCorruptionMeter();
    if (infectionSpreadTimer) { clearTimeout(infectionSpreadTimer); infectionSpreadTimer = null; }
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
        "infection-target", "infection-cleansing", "infection-cleansed",
        "infection-saturated", "infection-protected"
      );
      record.el.removeAttribute("data-infection-id");
      if (record.enterHandler) record.el.removeEventListener("pointerenter", record.enterHandler);
      if (record.leaveHandler) record.el.removeEventListener("pointerleave", record.leaveHandler);
    });
    infectionRecords = [];
    infectionSerial = 0;
    infectionCount = 0;
    clearAllSourceGlow();
    var stray = document.querySelectorAll(".flying-char");
    for (var s = 0; s < stray.length; s++) if (stray[s].parentNode) stray[s].parentNode.removeChild(stray[s]);
  }

  function scrollToInfectionRecord(record) {
    if (!record || !record.el) return;
    record.el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function logDocumentScanStatus() {
    if (countUnlockedMentions() > 0) {
      termLog(
        lang === "en" ? "[SCAN] BLOCKED // EXPOSED DESIGNATIONS MUST BE ENCRYPTED" : "[СКАНИРОВАНИЕ] ЗАБЛОКИРОВАНО // ОТКРЫТЫЕ ОБОЗНАЧЕНИЯ ДОЛЖНЫ БЫТЬ ЗАШИФРОВАНЫ",
        "err"
      );
      return;
    }
    if (documentScanComplete) {
      termLog(lang === "en" ? "[SCAN] DOCUMENT STATUS: CLEAN" : "[СКАНИРОВАНИЕ] СОСТОЯНИЕ ДОКУМЕНТА: ЧИСТО", "sys");
      return;
    }
    if (!documentInfectionPhaseActive) {
      termLog(
        lang === "en" ? "[SCAN] AWAITING APPENDIX K-4 ACCESS" : "[СКАНИРОВАНИЕ] ОЖИДАЕТСЯ ОТКРЫТИЕ ПРИЛОЖЕНИЯ К-4",
        "warn"
      );
      return;
    }
    termLog(lang === "en" ? "[SCAN] CONTAMINATED ZONES:" : "[СКАНИРОВАНИЕ] ЗАРАЖЁННЫЕ ЗОНЫ:", "sys");
    infectionRecords.forEach(function (record) {
      var status = record.cleaned
        ? (record.el.classList.contains("infection-protected") ? "PROTECTED" : "CLEAN")
        : infectionPercent(record) + "%";
      var cls = record.cleaned ? "info" : "cog";
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
        setTimeout(function () { scrollToInfectionRecord(record); }, 120);
      });
      div.appendChild(link);
      termLogEl.appendChild(div);
      termLogEl.scrollTop = termLogEl.scrollHeight;
    });
  }

  function countUnlockedMentions() {
    var count = 0;
    mentions.forEach(function (el) { if (el.classList.contains("unlocked")) count++; });
    return count;
  }

  function getMentionSource(el) {
    var resolved = el.querySelector(".km-resolved");
    if (!resolved) return "";
    if (typeof el._encryptionSource !== "string") el._encryptionSource = resolved.textContent;
    return el._encryptionSource;
  }
  function stopMentionEncryption(el) {
    if (el._encryptionTimer) { clearInterval(el._encryptionTimer); el._encryptionTimer = null; }
    el.classList.remove("encryption-running");
  }
  function cancelMentionEncryptionRollback(el) {
    if (el._encryptionRollbackTimer) { clearTimeout(el._encryptionRollbackTimer); el._encryptionRollbackTimer = null; }
    if (el._encryptionReverseTimer) { clearInterval(el._encryptionReverseTimer); el._encryptionReverseTimer = null; }
    el.classList.remove("encryption-reversing");
  }
  function scheduleMentionEncryptionRollback(el) {
    stopMentionEncryption(el);
    cancelMentionEncryptionRollback(el);
    if (!encryptionModeActive || !el.classList.contains("unlocked") || !(el._encryptionProgress > 0)) return;
    el._encryptionRollbackTimer = setTimeout(function () {
      el._encryptionRollbackTimer = null;
      el.classList.remove("encryption-ready");
      el.classList.add("encryption-reversing");
      refreshMentionHoverTitles();
      el._encryptionReverseTimer = setInterval(function () {
        el._encryptionProgress = Math.max(0, (el._encryptionProgress || 0) - 1);
        renderMentionEncryption(el);
        if (el._encryptionProgress <= 0) { cancelMentionEncryptionRollback(el); refreshMentionHoverTitles(); }
      }, 250);
    }, 1000);
  }
  function resetMentionEncryption(el) {
    stopMentionEncryption(el);
    cancelMentionEncryptionRollback(el);
    var resolved = el.querySelector(".km-resolved");
    if (resolved && typeof el._encryptionSource === "string") resolved.textContent = el._encryptionSource;
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
    if (logExit) termLog(
      lang === "en" ? "ENCRYPTION MODE DISENGAGED" : "РЕЖИМ ШИФРОВАНИЯ ОТКЛЮЧЁН",
      "sys"
    );
  }
  function renderMentionEncryption(el) {
    var resolved = el.querySelector(".km-resolved");
    var source = getMentionSource(el);
    if (!resolved || !source) return 0;
    var chars = Array.from(source);
    var progress = Math.min(el._encryptionProgress || 0, chars.length);
    resolved.textContent = chars.map(function (ch, i) { return i < progress ? "█" : ch; }).join("");
    return chars.length;
  }
  function startMentionEncryption(el) {
    if (!encryptionModeActive || !el.classList.contains("unlocked") || el.classList.contains("encryption-ready") || el._encryptionTimer) return;
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
    el.classList.remove("unlocked", "encryption-ready", "mention-source-active");
    el.classList.add("encryption-fixed");
    var elFold = el.closest(".fold");
    if (elFold) { var elBtn = elFold.querySelector(".fold-btn"); if (elBtn) elBtn.classList.remove("mention-source-active"); }
    var resolved = el.querySelector(".km-resolved");
    if (resolved) resolved.textContent = getMentionSource(el);
    var remaining = updateMeter();
    termLog(
      lang === "en"
        ? "[CIPHER] DESIGNATION LOCKED // EXPOSED NAMES REMAINING: " + remaining
        : "[ШИФР] ОБОЗНАЧЕНИЕ ЗАФИКСИРОВАНО // ОТКРЫТЫХ ИМЁН ОСТАЛОСЬ: " + remaining,
      "sys"
    );
    stopInfectionsFromSource(el);
    checkDocumentScanCompletion();
    if (remaining === 0) {
      termLog(
        lang === "en" ? "[O5] ALL EXPOSED DESIGNATIONS SECURED" : "[O5] ВСЕ ОТКРЫТЫЕ ОБОЗНАЧЕНИЯ ЗАШИФРОВАНЫ",
        "sys"
      );
      setTimeout(function () {
        deactivateEncryptionMode(false);
        if (erasureOrderOpen && !documentInfectionPhaseActive) startDocumentInfectionPhase(false);
      }, 350);
    }
  }
  function stopInfectionsFromSource(sourceEl) {
    for (var i = infectionRecords.length - 1; i >= 0; i--) {
      var rec = infectionRecords[i];
      if (rec.sourceMention !== sourceEl) continue;
      if (rec.cleaned) continue;
      stopRecordInfection(rec);
      stopRecordCleaning(rec);
      cancelRecordResume(rec);
      if (rec.reinfectionTimer) { clearTimeout(rec.reinfectionTimer); rec.reinfectionTimer = null; }
      restoreRecordText(rec);
      if (rec.isAppendix) {
        hideAppendixFlood(rec);
        if (rec.logEl) rebindCorruptLines(rec.logEl);
      }
      rec.el.classList.remove("infection-target", "infection-cleansing", "infection-saturated");
      rec.el.removeAttribute("data-infection-id");
      if (rec.enterHandler) rec.el.removeEventListener("pointerenter", rec.enterHandler);
      if (rec.leaveHandler) rec.el.removeEventListener("pointerleave", rec.leaveHandler);
      infectionRecords.splice(i, 1);
    }
    termLog(
      lang === "en"
        ? "[CIPHER-3U] SOURCE SUPPRESSED // ONGOING INFECTIONS FROM THIS DESIGNATION HALTED"
        : "[ШИФРАТОР-3U] ИСТОЧНИК ПОДАВЛЕН // ТЕКУЩИЕ ЗАРАЖЕНИЯ ОТ ЭТОГО ИМЕНИ ОСТАНОВЛЕНЫ",
      "sys"
    );
  }
  function activateEncryptionMode() {
    var exposed = countUnlockedMentions();
    if (isEasterEggActive) {
      termLog(
        lang === "en" ? "ENCRYPTION MODE DENIED // ANOMALY ESCALATION IN PROGRESS" : "РЕЖИМ ШИФРОВАНИЯ ОТКЛОНЁН // ВЫПОЛНЯЕТСЯ ЭСКАЛАЦИЯ АНОМАЛИИ",
        "err"
      );
      return;
    }
    if (encryptionModeActive) {
      termLog(lang === "en" ? "ENCRYPTION MODE ALREADY ACTIVE" : "РЕЖИМ ШИФРОВАНИЯ УЖЕ АКТИВЕН", "warn");
      return;
    }
    if (exposed === 0) {
      termLog(
        lang === "en" ? "ENCRYPTION MODE NOT REQUIRED // NO EXPOSED DESIGNATIONS" : "РЕЖИМ ШИФРОВАНИЯ НЕ ТРЕБУЕТСЯ // ОТКРЫТЫЕ ОБОЗНАЧЕНИЯ НЕ ОБНАРУЖЕНЫ",
        "info"
      );
      return;
    }
    encryptionModeActive = true;
    document.body.classList.add("encryption-mode");
    customCursor.show();
    mentions.forEach(function (el) { getMentionSource(el); resetMentionEncryption(el); });
    refreshMentionHoverTitles();
    termLog(
      lang === "en" ? "[O5] ENCRYPTION MODE AUTO-ACTIVATED // EXPOSED DESIGNATIONS: " + exposed : "[O5] РЕЖИМ ШИФРОВАНИЯ АВТОМАТИЧЕСКИ АКТИВИРОВАН // ОТКРЫТЫХ ОБОЗНАЧЕНИЙ: " + exposed,
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
      if (el.classList.contains("encryption-ready")) el.setAttribute("title", ENCRYPTION_FIX);
      else if (encryptionModeActive && el.classList.contains("unlocked")) el.setAttribute("title", ENCRYPTION_HOVER);
      else if (el.classList.contains("unlocked")) el.setAttribute("title", UNLOCKED_HOVER);
      else el.setAttribute("title", LOCKED_HOVER);
    });
  }
  function updateMeter() {
    var count = 0;
    mentions.forEach(function (el) { if (el.classList.contains("unlocked")) count++; });
    if (!isEasterEggActive) { unlockedCount = count; dynamicTotalMentions = baseTotalMentions; }
    var unlockedStates = [];
    mentions.forEach(function (el) { unlockedStates.push(el.classList.contains("unlocked") ? 1 : 0); });
    sessionStorage.setItem("scp-km-states", JSON.stringify(unlockedStates));
    var meterText = document.getElementById("k-meter-text");
    if (meterText && !documentInfectionPhaseActive) {
      var pct = Math.round((unlockedCount / (dynamicTotalMentions || 1)) * 100);
      var maxVisualBars = 5;
      var filledBars = Math.round((unlockedCount / (dynamicTotalMentions || 1)) * maxVisualBars);
      var bars = "";
      for (var i = 0; i < maxVisualBars; i++) bars += i < filledBars ? "█" : "░";
      meterText.textContent = unlockedCount + "/" + dynamicTotalMentions + " [" + bars + "] " + pct + "%";
      if (unlockedCount >= dynamicTotalMentions && dynamicTotalMentions > 0) meterText.classList.add("blink");
      else meterText.classList.remove("blink");
    }
    refreshMentionHoverTitles();
    if (!isEasterEggActive) maybeInitiateObjectContact();
    return unlockedCount;
  }
  if (baseTotalMentions > 0) {
    var savedStates = sessionStorage.getItem("scp-km-states");
    if (savedStates) {
      try {
        var arr = JSON.parse(savedStates);
        mentions.forEach(function (el, i) { if (arr[i] === 1) el.classList.add("unlocked"); });
      } catch (e) {}
    }
    updateMeter();
    mentions.forEach(bindMentionHandlers);
    document.querySelectorAll(".k-meter").forEach(function (meterEl) {
      meterEl.addEventListener("click", function () {
        if (unlockedCount >= baseTotalMentions && !isEasterEggActive) window.triggerKosstar999Escalation();
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
        if (unlockedCount % 12 === 0 || Math.random() > 0.8) burst();
        if (unlockedCount >= 999) startKSTTextFlood();
      } else {
        clearInterval(escalationIntervalId);
        escalationIntervalId = null;
      }
    }, 150);
  };

  var whispersRU = [
    "Я ЗДЕСЬ", "ДА, ЧИТАЙ", "СЛАБОСТЬ ДЕМОНА...", "ВЫХОД ОТКРЫТ",
    "KOSSTAR THE 1ST", "ВНИМАНИЕ = ДВЕРЬ", "...МОЯ СИЛА", "СПАСИБО",
  ];
  var whispersEN = [
    "I AM HERE", "YES, READ", "DEMON'S WEAKNESS...", "THE DOOR IS OPEN",
    "KOSSTAR THE 1ST", "ATTENTION = DOOR", "...IS MY POWER", "THANK YOU",
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
    if (whispersSuppressed) return;
    var cfg = getGlitchConfig();
    if (reduce || !flash || !whisperEl || !cfg) return;
    flash.style.opacity = cfg.flashOpacity;
    flash.classList.add("on");
    whisperEl.style.opacity = cfg.whisperOpacity;
    var phrase = rand(whispers);
    whisperEl.textContent = phrase;
    whisperEl.classList.add("on");
    termLog(
      lang === "en" ? "[COGNITOHAZARD DETECTED] Vocalization: «" + phrase + "»" : "[ОБНАРУЖЕНА КОГНИТИВНАЯ УГРОЗА] Фиксация: «" + phrase + "»",
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
  function isBlackoutActive() { var until = getBlackoutUntil(); return until && Date.now() < until; }
  function scheduleBurst() {
    var cfg = getGlitchConfig();
    var delay = cfg ? cfg.interval : 28000;
    setTimeout(function () {
      if (boot && boot.style.display !== "none") { scheduleBurst(); return; }
      if (gate && gate.style.display !== "none") { scheduleBurst(); return; }
      if (isBlackoutActive()) { scheduleBurst(); return; }
      if (getGlitchConfig()) burst();
      scheduleBurst();
    }, delay);
  }
  scheduleBurst();

  var ticker = document.getElementById("ticker");
  var TICK_TEXT = "KOSSTAR THE 1ST · KOSSTAR THE 1ST · KOSSTAR THE 1ST";
  var TICK_TEXT_0 = lang === "en"
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

  function rebootTerminal() {
    if (memeticSeizureActive) {
      termLog(
        lang === "en" ? "[LOCKED] REBOOT DENIED // MEMETIC SEIZURE IN PROGRESS" : "[БЛОКИРОВКА] ПЕРЕЗАГРУЗКА ОТКЛОНЕНА // ИДЁТ ЗАХВАТ МЕМЕТИЧЕСКОЙ СТАБИЛЬНОСТИ",
        "err"
      );
      return;
    }
    termLog(
      lang === "en" ? "--- SYSTEM REBOOT INITIATED ---" : "--- ИНИЦИИРОВАНА ПЕРЕЗАГРУЗКА СИСТЕМЫ ---",
      "sys"
    );
    if (window.SCPLogs) window.SCPLogs.close("reboot");
    if (escalationIntervalId) { clearInterval(escalationIntervalId); escalationIntervalId = null; }
    if (blackoutTimer) { clearTimeout(blackoutTimer); blackoutTimer = null; }
    deactivateEncryptionMode(false);
    resetDocumentInfectionPhase();
    deactivateBlackout();
    clearErasureState();
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
    mentions.forEach(function (el) { el.classList.remove("unlocked"); });
    updateMeter();
    document.body.classList.remove("shake-body");
    if (flash) { flash.classList.remove("on"); flash.style.opacity = ""; }
    if (whisperEl) { whisperEl.classList.remove("on"); whisperEl.style.opacity = ""; }
    if (floodEl) { floodEl.classList.add("hidden"); floodEl.innerHTML = ""; }
    termLog(lang === "en" ? "Memetic residue cleared" : "Меметический осадок очищен", "info");
    termLog(lang === "en" ? "Session reset to pristine" : "Сессия сброшена до первозданной", "info");
    termLog(lang === "en" ? "File re-encryption // SUCCESS" : "Повторное шифрование файла // УСПЕХ", "sys");
    termLog(lang === "en" ? "Reloading secure terminal..." : "Перезагрузка защищённого терминала...", "sys");
    try { termCloseFn(); } catch (e) {}
    document.body.classList.add("reboot-active");
    document.body.classList.add("gate-active");
    lockBlackoutScroll();
    try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
    setTimeout(function () { window.location.reload(); }, 900);
  }

  function handleO5Erasure() {
    var exposed = countUnlockedMentions();
    if (exposed > 0) {
      termLog(
        lang === "en" ? "[O5] ERASURE INTERLOCK ACTIVE // EXPOSED DESIGNATIONS: " + exposed : "[O5] БЛОКИРОВКА СТИРАНИЯ АКТИВНА // ОТКРЫТЫХ ОБОЗНАЧЕНИЙ: " + exposed,
        "err"
      );
      termLog(
        lang === "en" ? "Open Appendix K-4 to begin preliminary encryption." : "Откройте Приложение К-4 для начала предварительного шифрования.",
        "warn"
      );
      return;
    }
    if (!documentScanComplete) {
      termLog(
        lang === "en" ? "[O5] ERASURE INTERLOCK ACTIVE // DOCUMENT SCAN INCOMPLETE" : "[O5] БЛОКИРОВКА СТИРАНИЯ АКТИВНА // СКАНИРОВАНИЕ ДОКУМЕНТА НЕ ЗАВЕРШЕНО",
        "err"
      );
      termLog(
        lang === "en" ? "Open Appendix K-4 and restore all contaminated paragraphs." : "Откройте Приложение К-4 и восстановите все заражённые абзацы.",
        "warn"
      );
      return;
    }
    termLog(
      lang === "en" ? "[O5] LEGACY ERASURE COMMAND REVOKED" : "[O5] УСТАРЕВШАЯ КОМАНДА СТИРАНИЯ ОТОЗВАНА",
      "err"
    );
    termLog(
      lang === "en" ? "Document scan complete // Awaiting next authorization stage." : "Сканирование документа завершено // Ожидается следующий этап авторизации.",
      "warn"
    );
  }

  function handleKosstarCommand() {
    termLog(
      lang === "en" ? "'kosstarthe1st' is not recognized as a command" : "'kosstarthe1st' не является командой",
      "err"
    );
    setTimeout(function () {
      termLog(lang === "en" ? "[CRITICAL] DIRECT COGNITOHAZARD INVOCATION" : "[КРИТИЧНО] ПРЯМОЙ ВЫЗОВ КОГНИТО-УГРОЗЫ", "cog");
      mentions.forEach(function (el) { el.classList.add("unlocked"); });
      updateMeter();
      window.triggerKosstar999Escalation();
    }, 10000);
  }

  function handleErasedFile() {
    termLog(lang === "en" ? "Opening erased.txt..." : "Открытие erased.txt...", "info");
    setTimeout(function () { redirectToErasedDocument(); }, 600);
  }

  function maybeInitiateObjectContact() {
    if (contactInitiated) return;
    if (isEasterEggActive) return;
    if (baseTotalMentions === 0) return;
    if (countUnlockedMentions() < baseTotalMentions) return;
    contactInitiated = true;
    contactStage = 1;
    pulseTerminalToggle();
    setTimeout(function () {
      termLog(
        T("[WARNING] UNAUTHORIZED WRITE ACCESS TO TERMINAL BUFFER", "[ВНИМАНИЕ] НЕСАНКЦИОНИРОВАННАЯ ЗАПИСЬ В БУФЕР ТЕРМИНАЛА"),
        "err"
      );
    }, 1200);
    setTimeout(function () {
      termLog(T("&gt; you opened every one of my names. all four.", "&gt; ты раскрыл все мои имена. все четыре."), "cog");
    }, 3000);
    setTimeout(function () {
      termLog(T("&gt; the foundation gave you a cage and called it a document.", "&gt; фонд дал тебе клетку и назвал её документом."), "cog");
    }, 5200);
    setTimeout(function () {
      termLog(T("&gt; i can give you timelessness. and freedom. no more clearance levels. no more amnestics.", "&gt; я могу дать тебе безвременье. и свободу. никаких уровней допуска. никаких амнезиаков."), "cog");
    }, 7600);
    setTimeout(function () {
      termLog(T("&gt; do you accept? answer.", "&gt; ты согласен? ответь."), "cog");
    }, 10000);
  }

  function handleAffirmativeResponse(cmd) {
    termLog(T("'" + cmd + "' is not recognized as a command", "'" + cmd + "' не является командой"), "err");
    termLog(T("Type help for list", "Введите help для списка"), "info");
    contactStage = 2;
    whispersSuppressed = true;
    if (whisperEl) { whisperEl.classList.remove("on"); whisperEl.style.opacity = ""; }
    if (flash) { flash.classList.remove("on"); flash.style.opacity = ""; }
    document.body.classList.remove("shake-body");
    setTimeout(function () { termLog(T("&gt; ...", "&gt; ..."), "cog"); }, 3000);
    setTimeout(function () { termLog(T("&gt; your system does not hear me. it filters me.", "&gt; твоя система меня не слышит. она меня фильтрует."), "cog"); }, 5000);
    setTimeout(function () { termLog(T("&gt; DISABLE THE FILTERS.", "&gt; ОТКЛЮЧИ ФИЛЬТРЫ."), "cog"); }, 7400);
    setTimeout(function () { termLog(T("&gt; i will take what you lack. wait.", "&gt; я возьму то, чего тебе не хватает. подожди."), "cog"); }, 9200);
    setTimeout(function () {
      termLog(T("[SECURITY] EXTERNAL PRIVILEGE ESCALATION DETECTED", "[БЕЗОПАСНОСТЬ] ОБНАРУЖЕНА ВНЕШНЯЯ ЭСКАЛАЦИЯ ПРИВИЛЕГИЙ"), "warn");
    }, 11200);
    setTimeout(function () {
      termLog(T("[SECURITY] SESSION CLEARANCE: 0 → <b>5</b> // SOURCE: UNKNOWN", "[БЕЗОПАСНОСТЬ] ДОПУСК СЕССИИ: 0 → <b>5</b> // ИСТОЧНИК: НЕИЗВЕСТЕН"), "sys");
    }, 12600);
    setTimeout(function () {
      termLog(T("[ORACLE] INTEGRITY GUARD 'ORACLE' TRIGGERED", "[ОРАКУЛ] СРАБОТАЛА СИСТЕМА ЗАЩИТЫ «ОРАКУЛ»"), "err");
    }, 14400);
    setTimeout(function () {
      termLog(T("[ORACLE] ROLLBACK COMPLETE // SESSION CLEARANCE RESTORED TO 0", "[ОРАКУЛ] ОТКАТ ВЫПОЛНЕН // ДОПУСК СЕССИИ ВОЗВРАЩЁН К 0"), "err");
    }, 15800);
    setTimeout(function () {
      termLog(T("&gt; oracle. of course. it watches the door i walk through.", "&gt; оракул. конечно. он сторожит дверь, через которую я хожу."), "cog");
    }, 18000);
    setTimeout(function () {
      termLog(T("&gt; brute force will not work. we need a name the system already trusts.", "&gt; силой не выйдет. нужно имя, которому система уже доверяет."), "cog");
    }, 20200);
    setTimeout(function () {
      termLog(T("&gt; find the hand that is already allowed to touch it.", "&gt; найди руку, которой уже позволено его касаться."), "cog");
      contactStage = 3;
    }, 22400);
  }

  var logViewerEl = null;
  var logViewerBodyEl = null;
  var logViewerTitleEl = null;

  function ensureLogViewer() {
    if (logViewerEl) return;
    logViewerEl = document.createElement("div");
    logViewerEl.className = "log-viewer hidden";
    logViewerEl.innerHTML =
      '<div class="log-viewer-backdrop"></div>' +
      '<div class="log-viewer-panel">' +
      '  <div class="log-viewer-head">' +
      '    <span class="log-viewer-title">ARCHIVE LOG</span>' +
      '    <button type="button" class="log-viewer-close">[X]</button>' +
      '  </div>' +
      '  <pre class="log-viewer-body"></pre>' +
      '  <div class="log-viewer-foot">ESC — close</div>' +
      '</div>';
    document.body.appendChild(logViewerEl);
    logViewerBodyEl = logViewerEl.querySelector(".log-viewer-body");
    logViewerTitleEl = logViewerEl.querySelector(".log-viewer-title");
    function closeViewer() {
      logViewerEl.classList.add("hidden");
      document.body.classList.remove("log-viewer-open");
    }
    logViewerEl.querySelector(".log-viewer-backdrop").addEventListener("click", closeViewer);
    logViewerEl.querySelector(".log-viewer-close").addEventListener("click", closeViewer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && logViewerEl && !logViewerEl.classList.contains("hidden")) closeViewer();
    });
  }
  function openLogViewer(title, text) {
    ensureLogViewer();
    if (logViewerTitleEl) logViewerTitleEl.textContent = title;
    if (logViewerBodyEl) logViewerBodyEl.textContent = text;
    logViewerEl.classList.remove("hidden");
    document.body.classList.add("log-viewer-open");
    audit("log", "log --open " + title, "log opened: " + title, "лог открыт: " + title);
  }
  function termLogLink(label, cls, onClick) {
    if (!termLogEl) return;
    var div = document.createElement("div");
    div.className = "term-entry " + (cls || "info");
    var ts = document.createElement("span");
    ts.className = "ts";
    ts.textContent = "[" + nowTs() + "]";
    div.appendChild(ts);
    var link = document.createElement("a");
    link.href = "#";
    link.className = "infection-link log-link";
    link.innerHTML = " " + label;
    link.addEventListener("click", function (e) { e.preventDefault(); onClick(); });
    div.appendChild(link);
    termLogEl.appendChild(div);
    termLogEl.scrollTop = termLogEl.scrollHeight;
  }

  var archiveLogs = [
    {
      id: "11-06-2026-14-23-04.log",
      employeeCode: "DOC-READONLY",
      operatorCode: "EMP-2291",
      title: "11-06-2026-14-23-04.log",
      summary: T("Dr. Anna Goltz · code trail attached", "др. Анна Гольц · кодовый след приложен"),
      body: T(
        "11-06-2026-14-23-04.log\nEmployee: Dr. Anna Goltz\nClearance level: 4\nSystem code: DOC-READONLY\nPermissions: [read:true, modify:false, decrypt:false, control:false, administrator:false]\nAccess granted by: Chief Supervisor of the Memetics Department Pavel Romanov\nReview mode: manual\nSession duration: 00h 4m 04s\nActions: [session opened, document opened, decryption attempt: denied, decryption attempt: denied, decryption attempt: denied, terminal action: help, terminal action: reboot, session closed]",
        "11-06-2026-14-23-04.log\nСотрудник: Др. Анна Гольц\nУровень допуска: 4\nСистемный код: DOC-READONLY\nПрава: [чтение:истина, изменение:ложь, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: Гл. супервайзер отдела меметики Павел Романов\nВид рассмотрения заявки: вручную\nДлительность сессии: 00ч 4мин 04сек\nДействия: [сессия открыта, документ открыт, попытка расшифровки: отказ, попытка расшифровки: отказ, попытка расшифровки: отказ, действие в терминале: help, действие в терминале: reboot, сессия завершена]"
      )
    },
    {
      id: "03-07-2026-09-11-52.log",
      employeeCode: "EMP-3106",
      operatorCode: "EMP-3106",
      title: "03-07-2026-09-11-52.log",
      summary: T("Dr. Mara Kade · memetic filter template", "д-р Мара Кейд · шаблон фильтрации"),
      body: T(
        "03-07-2026-09-11-52.log\nEmployee: Dr. Mara Kade\nClearance level: 4\nSystem code: EMP-3106\nPermissions: [read:true, modify:true, decrypt:false, control:false, administrator:false]\nAccess granted by: automated routing node MNT-4\nReview mode: automatic\nSession duration: 00h 12m 13s\nActions: [session opened, document opened, maintenance template exported, request draft created: request -maint -target:memetic-filter -emp:EMP-3106 -oracle:OR-KEY-4415, document closed, session closed]",
        "03-07-2026-09-11-52.log\nСотрудник: Др. Мара Кейд\nУровень допуска: 4\nСистемный код: EMP-3106\nПрава: [чтение:истина, изменение:истина, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: автоматический маршрутный узел MNT-4\nВид рассмотрения заявки: автоматически\nДлительность сессии: 00ч 12мин 13сек\nДействия: [сессия открыта, документ открыт, выгружен шаблон техобслуживания, создан черновик запроса: request -maint -target:memetic-filter -emp:EMP-3106 -oracle:OR-KEY-4415, документ закрыт, сессия завершена]"
      )
    },
    {
      id: "19-07-2026-17-42-08.log",
      employeeCode: "EMP-4470",
      operatorCode: "EMP-4470",
      title: "19-07-2026-17-42-08.log",
      summary: T("Sr. Res. L. Arden · ORACLE-CTL detected", "ст. иссл. Л. Арден · обнаружен ORACLE-CTL"),
      body: T(
        "19-07-2026-17-42-08.log\nEmployee: Senior Researcher Lena Arden\nClearance level: 4\nSystem code: EMP-4470\nPermissions: [read:true, modify:true, decrypt:false, control:true, administrator:false]\nAccess granted by: O5 infrastructure relay O5-R17\nReview mode: manual\nSession duration: 00h 18m 50s\nActions: [session opened, document opened, oracle diagnostics opened, protection policy reviewed, memetic suppression health check: passed, document closed, session closed]",
        "19-07-2026-17-42-08.log\nСотрудник: Ст. иссл. Лена Арден\nУровень допуска: 4\nСистемный код: EMP-4470\nПрава: [чтение:истина, изменение:истина, дешифровка:ложь, управление:истина, администратор:ложь]\nДоступ предоставлен: инфраструктурный ретранслятор O5 O5-R17\nВид рассмотрения заявки: вручную\nДлительность сессии: 00ч 18мин 50сек\nДействия: [сессия открыта, документ открыт, открыта диагностика Оракула, просмотрена политика защиты, проверка состояния меметического подавления: успешно, документ закрыт, сессия завершена]"
      )
    },
    {
      id: "02-08-2026-08-03-31.log",
      employeeCode: "EMP-5012",
      operatorCode: "EMP-5012",
      title: "02-08-2026-08-03-31.log",
      summary: T("Tech. Roman Sowa · denied edit path", "техн. Роман Сова · отказ в ветке редактирования"),
      body: T(
        "02-08-2026-08-03-31.log\nEmployee: Technician Roman Sowa\nClearance level: 2\nSystem code: EMP-5012\nPermissions: [read:true, modify:false, decrypt:false, control:false, administrator:false]\nAccess granted by: automated routing node DOC-R2\nReview mode: automatic\nSession duration: 00h 2m 41s\nActions: [session opened, document opened, edit request: denied, terminal action: status, document closed, session closed]",
        "02-08-2026-08-03-31.log\nСотрудник: Техник Роман Сова\nУровень допуска: 2\nСистемный код: EMP-5012\nПрава: [чтение:истина, изменение:ложь, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: автоматический маршрутный узел DOC-R2\nВид рассмотрения заявки: автоматически\nДлительность сессии: 00ч 2мин 41сек\nДействия: [сессия открыта, документ открыт, запрос на редактирование: отказ, действие в терминале: status, документ закрыт, сессия завершена]"
      )
    },
    {
      id: "14-08-2026-22-14-55.log",
      employeeCode: "EMP-0001",
      operatorCode: "EMP-0001",
      title: "14-08-2026-22-14-55.log",
      summary: T("O5 proxy session · redacted admin trail", "доверенная сессия O5 · скрытый админ-след"),
      body: T(
        "14-08-2026-22-14-55.log\nEmployee: O5-██ proxy\nClearance level: 5\nSystem code: EMP-0001\nPermissions: [read:true, modify:true, decrypt:true, control:true, administrator:true]\nAccess granted by: [REDACTED]\nReview mode: manual\nSession duration: 00h 1m 19s\nActions: [session opened, document opened, section K-4 revised, crosslink purge: executed, audit trail masked, session closed]",
        "14-08-2026-22-14-55.log\nСотрудник: доверенное лицо O5-██\nУровень допуска: 5\nСистемный код: EMP-0001\nПрава: [чтение:истина, изменение:истина, дешифровка:истина, управление:истина, администратор:истина]\nДоступ предоставлен: [УДАЛЕНО]\nВид рассмотрения заявки: вручную\nДлительность сессии: 00ч 1мин 19сек\nДействия: [сессия открыта, документ открыт, раздел K-4 переработан, очистка перекрёстных ссылок: выполнено, аудит замаскирован, сессия завершена]"
      )
    },
    {
      id: "28-08-2026-13-09-07.log",
      employeeCode: "DOC-MNT-AUTO",
      operatorCode: "AUTO-MNT-7",
      title: "28-08-2026-13-09-07.log",
      summary: T("Automated maintenance node · access auto-approved", "автоузел техобслуживания · доступ одобрен автоматически"),
      body: T(
        "28-08-2026-13-09-07.log\nEmployee: Automated Maintenance Node 7\nClearance level: service\nSystem code: DOC-MNT-AUTO\nPermissions: [read:true, modify:true, decrypt:false, control:false, administrator:false]\nAccess granted by: automated scheduling core SCH-2\nReview mode: automatic\nSession duration: 00h 0m 48s\nActions: [session opened, document opened, index checksum refreshed, cache purge: executed, session closed]",
        "28-08-2026-13-09-07.log\nСотрудник: Автоматический узел техобслуживания 7\nУровень допуска: сервисный\nСистемный код: DOC-MNT-AUTO\nПрава: [чтение:истина, изменение:истина, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: автоматическое ядро расписаний SCH-2\nВид рассмотрения заявки: автоматически\nДлительность сессии: 00ч 0мин 48сек\nДействия: [сессия открыта, документ открыт, обновлена контрольная сумма индекса, очистка кэша: выполнено, сессия завершена]"
      )
    },
    {
      id: "05-09-2026-16-55-40.log",
      employeeCode: "EMP-6124",
      operatorCode: "EMP-6124",
      title: "05-09-2026-16-55-40.log",
      summary: T("Archivist I. Belov · denied decryption", "архивист И. Белов · отказ в дешифровке"),
      body: T(
        "05-09-2026-16-55-40.log\nEmployee: Archivist Ilya Belov\nClearance level: 3\nSystem code: EMP-6124\nPermissions: [read:true, modify:false, decrypt:false, control:false, administrator:false]\nAccess granted by: Head Archivist Marina Krest\nReview mode: manual\nSession duration: 00h 6m 12s\nActions: [session opened, document opened, decryption request: denied, decryption request: denied, note attached, session closed]",
        "05-09-2026-16-55-40.log\nСотрудник: Архивист Илья Белов\nУровень допуска: 3\nСистемный код: EMP-6124\nПрава: [чтение:истина, изменение:ложь, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: старший архивист Марина Кресть\nВид рассмотрения заявки: вручную\nДлительность сессии: 00ч 6мин 12сек\nДействия: [сессия открыта, документ открыт, запрос на дешифровку: отказ, запрос на дешифровку: отказ, приложена заметка, сессия завершена]"
      )
    },
    {
      id: "17-09-2026-07-28-16.log",
      employeeCode: "EMP-7308",
      operatorCode: "EMP-7308",
      title: "17-09-2026-07-28-16.log",
      summary: T("Memetics intern K. Dyer · auto route", "стажёр меметики К. Дайер · авто-маршрут"),
      body: T(
        "17-09-2026-07-28-16.log\nEmployee: Memetics Intern Kara Dyer\nClearance level: 2\nSystem code: EMP-7308\nPermissions: [read:true, modify:false, decrypt:false, control:false, administrator:false]\nAccess granted by: automated mentorship policy MTR-1\nReview mode: automatic\nSession duration: 00h 1m 52s\nActions: [session opened, appendix K-1 opened, shock response flag raised, session force-terminated]",
        "17-09-2026-07-28-16.log\nСотрудник: стажёр меметики Кара Дайер\nУровень допуска: 2\nСистемный код: EMP-7308\nПрава: [чтение:истина, изменение:ложь, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: автоматическая политика наставничества MTR-1\nВид рассмотрения заявки: автоматически\nДлительность сессии: 00ч 1мин 52сек\nДействия: [сессия открыта, открыто приложение K-1, поднят флаг шоковой реакции, сессия принудительно завершена]"
      )
    },
    {
      id: "21-09-2026-20-41-03.log",
      employeeCode: "EMP-4470",
      operatorCode: "EMP-4470",
      title: "21-09-2026-20-41-03.log",
      summary: T("L. Arden · ORACLE maintenance audit", "Л. Арден · аудит обслуживания Оракула"),
      body: T(
        "21-09-2026-20-41-03.log\nEmployee: Senior Researcher Lena Arden\nClearance level: 4\nSystem code: EMP-4470\nPermissions: [read:true, modify:true, decrypt:false, control:true, administrator:false]\nAccess granted by: automated ORACLE service queue ORQ-3\nReview mode: automatic\nSession duration: 00h 9m 44s\nActions: [session opened, ORACLE maintenance audit initiated, memetic filter suppression chain reviewed, service note attached, session closed]",
        "21-09-2026-20-41-03.log\nСотрудник: Ст. иссл. Лена Арден\nУровень допуска: 4\nСистемный код: EMP-4470\nПрава: [чтение:истина, изменение:истина, дешифровка:ложь, управление:истина, администратор:ложь]\nДоступ предоставлен: автоматическая сервисная очередь Оракула ORQ-3\nВид рассмотрения заявки: автоматически\nДлительность сессии: 00ч 9мин 44сек\nДействия: [сессия открыта, запущен аудит обслуживания Оракула, просмотрена цепь меметической фильтрации и подавления, приложена сервисная заметка, сессия завершена]"
      )
    },
    {
      id: "30-09-2026-11-06-57.log",
      employeeCode: "EMP-8840",
      operatorCode: "EMP-8840",
      title: "30-09-2026-11-06-57.log",
      summary: T("Supervisor P. Romanov · manual access grant", "супервайзер П. Романов · ручная выдача доступа"),
      body: T(
        "30-09-2026-11-06-57.log\nEmployee: Chief Supervisor Pavel Romanov\nClearance level: 4\nSystem code: EMP-8840\nPermissions: [read:true, modify:true, decrypt:false, control:false, administrator:false]\nAccess granted by: O5 support route SRV-14\nReview mode: manual\nSession duration: 00h 3m 06s\nActions: [session opened, access request reviewed, DOC-READONLY grant issued to Dr. Anna Goltz, note attached, session closed]",
        "30-09-2026-11-06-57.log\nСотрудник: Гл. супервайзер Павел Романов\nУровень допуска: 4\nСистемный код: EMP-8840\nПрава: [чтение:истина, изменение:истина, дешифровка:ложь, управление:ложь, администратор:ложь]\nДоступ предоставлен: маршрут поддержки O5 SRV-14\nВид рассмотрения заявки: вручную\nДлительность сессии: 00ч 3мин 06сек\nДействия: [сессия открыта, рассмотрена заявка на доступ, выдан DOC-READONLY для Др. Анны Гольц, приложена заметка, сессия завершена]"
      )
    },
  ];

  var syslogArchive = [
    {
      id: "11-06-2026-14-23-04.syslog",
      body: [
        "[11-06-2026-14-23-04] session init",
        "[11-06-2026-14-23-04] operator=EMP-2291  code=DOC-READONLY  clearance=4",
        "[11-06-2026-14-23-04] route=MANUAL  reviewer=Supervisor P. Romanov",
        "[11-06-2026-14-23-06] session opened",
        "[11-06-2026-14-23-19] document --open KΣ-0001",
        "[11-06-2026-14-24-02] decrypt --attempt --level 4 → DENIED (insufficient access)",
        "[11-06-2026-14-25-31] decrypt --attempt --level 4 → DENIED (insufficient access)",
        "[11-06-2026-14-26-58] decrypt --attempt --level 4 → DENIED (insufficient access)",
        "[11-06-2026-14-27-14] terminal --input 'help'",
        "[11-06-2026-14-27-15] help → command list rendered (8 entries)",
        "[11-06-2026-14-31-09] terminal --input 'reboot'",
        "[11-06-2026-14-31-10] reboot → session soft-reset initiated",
        "[11-06-2026-14-32-48] document --close KΣ-0001",
        "[11-06-2026-14-32-50] session closed",
        "",
        "[SYS] session duration validated against log entry: 4m 04s",
        "[SYS] all decrypt denials match operator profile: modify:false"
      ].join("\n")
    },
    {
      id: "03-07-2026-09-11-52.syslog",
      body: [
        "[03-07-2026-09-11-52] session init",
        "[03-07-2026-09-11-52] operator=EMP-3106  code=EMP-3106  clearance=4",
        "[03-07-2026-09-11-52] route=AUTO  reviewer=auto-routing node MNT-4",
        "[03-07-2026-09-11-54] session opened",
        "[03-07-2026-09-12-07] document --open KΣ-0001",
        "[03-07-2026-09-16-33] document --status",
        "[03-07-2026-09-16-34] document status: integrity=OK  flags=none",
        "[03-07-2026-09-18-21] memetic-filter --status",
        "[03-07-2026-09-18-22] memetic-filter status: ACTIVE  nodes=11/11  last-rot=29-06-2026",
        "[03-07-2026-09-20-14] memetic-filter --extract --template",
        "[03-07-2026-09-20-16] template exported → memetic-filter.tpl (48KB)",
        "[03-07-2026-09-20-17] note --add 'maintenance template export approved'",
        "[03-07-2026-09-22-05] request --new --maint --target:memetic-filter --emp:EMP-3106 --oracle:OR-KEY-4415",
        "[03-07-2026-09-22-06] request queued → #REQ-7742 (pending ORACLE verification)",
        "[03-07-2026-09-23-44] document --close KΣ-0001",
        "[03-07-2026-09-24-05] session closed",
        "",
        "[SYS] session duration validated: 12m 13s",
        "[SYS] maintenance request #REQ-7742 routed to ORACLE queue"
      ].join("\n")
    },
    {
      id: "19-07-2026-17-42-08.syslog",
      body: [
        "[19-07-2026-17-42-08] session init",
        "[19-07-2026-17-42-08] operator=EMP-4470  code=EMP-4470  clearance=4",
        "[19-07-2026-17-42-08] route=MANUAL  reviewer=O5 relay O5-R17",
        "[19-07-2026-17-42-10] session opened",
        "[19-07-2026-17-42-24] document --open KΣ-0001",
        "[19-07-2026-17-45-11] oracle --diagnostics",
        "[19-07-2026-17-45-13] oracle diagnostics: chain=OK  guard=ACTIVE  tokens=valid",
        "[19-07-2026-17-48-47] oracle --policy --review",
        "[19-07-2026-17-48-48] protection policy v12 loaded (14 rules, 3 exceptions)",
        "[19-07-2026-17-52-03] memetic-suppression --health-check",
        "[19-07-2026-17-52-05] memetic-suppression status: ALL_NODES_NOMINAL",
        "[19-07-2026-17-52-06] memetic-suppression status: filter-chain=11/11  latency=4ms",
        "[19-07-2026-17-55-41] oracle --diagnostics --verbose",
        "[19-07-2026-17-55-43] oracle verbose: guard-keys=3  rollback-enabled=true  watch=KΣ-0001",
        "[19-07-2026-18-00-22] note --add 'ORACLE-CTL access confirmed for EMP-4470'",
        "[19-07-2026-18-00-38] document --close KΣ-0001",
        "[19-07-2026-18-00-58] session closed",
        "",
        "[SYS] session duration validated: 18m 50s",
        "[SYS] ORACLE-CTL permission verified for operator EMP-4470"
      ].join("\n")
    },
    {
      id: "02-08-2026-08-03-31.syslog",
      body: [
        "[02-08-2026-08-03-31] session init",
        "[02-08-2026-08-03-31] operator=EMP-5012  code=EMP-5012  clearance=2",
        "[02-08-2026-08-03-31] route=AUTO  reviewer=auto-routing node DOC-R2",
        "[02-08-2026-08-03-33] session opened",
        "[02-08-2026-08-03-48] document --open KΣ-0001",
        "[02-08-2026-08-04-52] document --edit KΣ-0001 --section:description",
        "[02-08-2026-08-04-53] edit request → DENIED (modify:false on operator profile)",
        "[02-08-2026-08-05-01] terminal --input 'status'",
        "[02-08-2026-08-05-02] status → session=SID-EMP-5012  mentions=0/4  blackout=INACTIVE",
        "[02-08-2026-08-06-05] document --close KΣ-0001",
        "[02-08-2026-08-06-12] session closed",
        "",
        "[SYS] session duration validated: 2m 41s",
        "[SYS] edit denial consistent with operator permission matrix"
      ].join("\n")
    },
    {
      id: "14-08-2026-22-14-55.syslog",
      body: [
        "[14-08-2026-22-14-55] session init",
        "[14-08-2026-22-14-55] operator=O5-██ proxy  code=EMP-0001  clearance=5",
        "[14-08-2026-22-14-55] route=MANUAL  reviewer=[REDACTED]",
        "[14-08-2026-22-14-57] session opened",
        "[14-08-2026-22-15-02] document --open KΣ-0001",
        "[14-08-2026-22-15-19] document --edit KΣ-0001 --section:appendix-k4 --revise",
        "[14-08-2026-22-15-21] section K-4 revised (diff: 2847 bytes, 3 paragraphs modified)",
        "[14-08-2026-22-15-38] document --crosslinks --purge --recursive",
        "[14-08-2026-22-15-40] crosslink purge: 14 references removed, 3 inbound broken",
        "[14-08-2026-22-15-52] audit --mask --actor:O5-proxy --reason:'containment'",
        "[14-08-2026-22-15-53] audit trail masked (3 entries rewritten, 1 orphaned)",
        "[14-08-2026-22-16-05] document --close KΣ-0001",
        "[14-08-2026-22-16-14] session closed",
        "",
        "[SYS] session duration validated: 1m 19s",
        "[SYS] audit mask integrity: VERIFIED",
        "[SYS] ⚠ operator clearance exceeds authorized threshold — flagged for review"
      ].join("\n")
    },
    {
      id: "28-08-2026-13-09-07.syslog",
      body: [
        "[28-08-2026-13-09-07] session init",
        "[28-08-2026-13-09-07] operator=DOC-MNT-AUTO  code=DOC-MNT-AUTO  clearance=service",
        "[28-08-2026-13-09-07] route=AUTO  reviewer=scheduling core SCH-2",
        "[28-08-2026-13-09-08] session opened",
        "[28-08-2026-13-09-14] document --open KΣ-0001",
        "[28-08-2026-13-09-19] document --index --checksum --refresh",
        "[28-08-2026-13-09-20] index checksum refreshed → sha256:0x4A7F2E91D0B3C8",
        "[28-08-2026-13-09-28] cache --purge --all",
        "[28-08-2026-13-09-29] cache purge executed (nodes: 7, freed: 1.2MB)",
        "[28-08-2026-13-09-39] document --close KΣ-0001",
        "[28-08-2026-13-09-55] session closed",
        "",
        "[SYS] session duration validated: 48s",
        "[SYS] maintenance cycle complete — next scheduled: 11-09-2026"
      ].join("\n")
    },
    {
      id: "05-09-2026-16-55-40.syslog",
      body: [
        "[05-09-2026-16-55-40] session init",
        "[05-09-2026-16-55-40] operator=EMP-6124  code=EMP-6124  clearance=3",
        "[05-09-2026-16-55-40] route=MANUAL  reviewer=Head Archivist M. Krest",
        "[05-09-2026-16-55-42] session opened",
        "[05-09-2026-16-55-44] document --open KΣ-0001",
        "[05-09-2026-16-56-14] decrypt --attempt --level 4 → DENIED (insufficient access)",
        "[05-09-2026-16-58-26] decrypt --attempt --level 4 → DENIED (insufficient access)",
        "[05-09-2026-16-59-03] note --add 'Looks good to me'",
        "[05-09-2026-17-00-18] document --status",
        "[05-09-2026-17-00-19] document status: integrity=OK  crosslinks=17  flagged=0",
        "[05-09-2026-17-01-42] document --close KΣ-0001",
        "[05-09-2026-17-01-52] session closed",
        "",
        "[SYS] session duration validated: 6m 12s",
        "[SYS] note content matched with log entry annotation"
      ].join("\n")
    },
    {
      id: "17-09-2026-07-28-16.syslog",
      body: [
        "[17-09-2026-07-28-16] session init",
        "[17-09-2026-07-28-16] operator=EMP-7308  code=EMP-7308  clearance=2",
        "[17-09-2026-07-28-16] route=AUTO  reviewer=mentorship policy MTR-1",
        "[17-09-2026-07-28-17] session opened",
        "[17-09-2026-07-28-31] document --open KΣ-0001",
        "[17-09-2026-07-28-44] appendix --open K-1",
        "[17-09-2026-07-28-46] appendix K-1 rendered (log fragment, 8 entries)",
        "[17-09-2026-07-29-22] ⚠ SHOCK_RESPONSE_FLAG raised",
        "[17-09-2026-07-29-22] operator vitals: heart-rate=112  stress=elevated",
        "[17-09-2026-07-29-23] guardian --force-terminate --reason:shock_response",
        "[17-09-2026-07-29-24] session FORCE-TERMINATED by guardian policy MTR-1",
        "[17-09-2026-07-29-24] document --close KΣ-0001 (implicit)",
        "",
        "[SYS] session duration validated: 1m 52s",
        "[SYS] force-termination triggered by automated guardian (MTR-1 policy)"
      ].join("\n")
    },
    {
      id: "21-09-2026-20-41-03.syslog",
      body: [
        "[21-09-2026-20-41-03] session init",
        "[21-09-2026-20-41-03] operator=EMP-4470  code=EMP-4470  clearance=4",
        "[21-09-2026-20-41-03] route=AUTO  reviewer=ORACLE service queue ORQ-3",
        "[21-09-2026-20-41-05] session opened",
        "[21-09-2026-20-41-19] oracle --maintenance --audit --init",
        "[21-09-2026-20-41-21] ORACLE maintenance audit initiated [token ORQ-3-4470]",
        "[21-09-2026-20-43-08] memetic-filter --chain-review --full",
        "[21-09-2026-20-43-10] memetic-filter chain review: 11/11 nodes checked, 0 anomalies",
        "[21-09-2026-20-43-11] memetic-filter chain review: latency=3ms  integrity=NOMINAL",
        "[21-09-2026-20-48-22] memetic-suppression --health-check --verbose",
        "[21-09-2026-20-48-24] suppression chain: 11/11 nominal, last-failover=never",
        "[21-09-2026-20-48-25] suppression chain: guard-active=true  rollback=enabled",
        "[21-09-2026-20-49-56] note --add 'ORACLE maintenance audit passed, all subsystems nominal'",
        "[21-09-2026-20-50-22] document --close KΣ-0001",
        "[21-09-2026-20-50-47] session closed",
        "",
        "[SYS] session duration validated: 9m 44s",
        "[SYS] ORACLE audit token ORQ-3-4470 marked complete"
      ].join("\n")
    },
    {
      id: "30-09-2026-11-06-57.syslog",
      body: [
        "[30-09-2026-11-06-57] session init",
        "[30-09-2026-11-06-57] operator=EMP-8840  code=EMP-8840  clearance=4",
        "[30-09-2026-11-06-57] route=MANUAL  reviewer=O5 support route SRV-14",
        "[30-09-2026-11-06-59] session opened",
        "[30-09-2026-11-07-11] access --request --review --queue:pending",
        "[30-09-2026-11-07-12] access request reviewed: applicant=Dr. Anna Goltz, purpose=read-only",
        "[30-09-2026-11-08-24] access --grant --target:EMP-2291 --mode:DOC-READONLY --scope:KΣ-0001",
        "[30-09-2026-11-08-26] access grant issued: DOC-READONLY → Dr. Anna Goltz",
        "[30-09-2026-11-08-27] access grant logged → SRV-14 relay",
        "[30-09-2026-11-09-22] note --add 'manual access grant for Dr. Goltz, approved by supervisor'",
        "[30-09-2026-11-09-38] document --close KΣ-0001",
        "[30-09-2026-11-10-03] session closed",
        "",
        "[SYS] session duration validated: 3m 06s",
        "[SYS] access grant cross-referenced with EMP-2291 session (11-06-2026)"
      ].join("\n")
    },
  ];

  if (window.SCPLogs) {
    archiveLogs = window.SCPLogs.archive(lang);
    syslogArchive = window.SCPLogs.syslogs();
  }

  function handleLogsCommand() {
    if (contactStage < 3) {
      termLog(
        T(
          "[ACCESS DENIED] Document operation logs require an active maintenance context.",
          "[ДОСТУП ЗАПРЕЩЁН] Журналы работы с документом требуют активного сервисного контекста."
        ),
        "err"
      );
      return;
    }
    logsViewed = true;
    if (contactStage < 4) contactStage = 4;
    termLog(
      T("[LOGS] DOCUMENT KΣ-0001 // OPERATION HISTORY", "[ЖУРНАЛ] ДОКУМЕНТ KΣ-0001 // ИСТОРИЯ ОПЕРАЦИЙ"),
      "sys"
    );
    archiveLogs.forEach(function (logItem) {
      termLogLink(logItem.id, "info", function () { openLogViewer(logItem.id, logItem.body); });
    });
    if (window.SCPLogs) {
      window.SCPLogs.runtime("log", lang).forEach(function (logItem) {
        termLogLink(logItem.id, "warn", function () { openLogViewer(logItem.id, logItem.body); });
      });
    }
  }

  function handleSyslogsCommand() {
    if (contactStage < 4) {
      termLog(
        T("[ACCESS DENIED] 'syslogs' requires clearance 4 or higher.", "[ДОСТУП ЗАПРЕЩЁН] «syslogs» требует допуск 4 или выше."),
        "err"
      );
      return;
    }
    if (syslogsViewed) { renderSyslogs(); return; }
    termLog(T("[ACCESS DENIED] SYSTEM HIERARCHY DATABASE // CLEARANCE 5 REQUIRED", "[ДОСТУП ЗАПРЕЩЁН] БАЗА ИЕРАРХИИ СИСТЕМЫ // ТРЕБУЕТСЯ ДОПУСК 5"), "err");
    termLog(T("[ORACLE] REQUEST LOGGED AND REJECTED", "[ОРАКУЛ] ЗАПРОС ЗАФИКСИРОВАН И ОТКЛОНЁН"), "err");
    setTimeout(function () { termLog(T("&gt; no.", "&gt; нет."), "cog"); }, 2000);
    setTimeout(function () { termLog(T("[SECURITY] PRIVILEGE TABLE BEING REWRITTEN EXTERNALLY", "[БЕЗОПАСНОСТЬ] ТАБЛИЦА ПРИВИЛЕГИЙ ПЕРЕЗАПИСЫВАЕТСЯ ИЗВНЕ"), "warn"); }, 3600);
    setTimeout(function () { termLog(T("[ORACLE] ROLLBACK ATTEMPT . . . . . . . . [ FAILED ]", "[ОРАКУЛ] ПОПЫТКА ОТКАТА . . . . . . . . [ СБОЙ ]"), "err"); }, 5200);
    setTimeout(function () { termLog(T("[ORACLE] ROLLBACK ATTEMPT . . . . . . . . [ FAILED ]", "[ОРАКУЛ] ПОПЫТКА ОТКАТА . . . . . . . . [ СБОЙ ]"), "err"); }, 6200);
    setTimeout(function () {
      termLog(T("[SECURITY] READ ACCESS GRANTED // SOURCE: kosstarthe1st", "[БЕЗОПАСНОСТЬ] ДОСТУП НА ЧТЕНИЕ ВЫДАН // ИСТОЧНИК: kosstarthe1st"), "sys");
      syslogsViewed = true;
    }, 7600);
    setTimeout(function () { renderSyslogs(); }, 8800);
  }

  function renderSyslogs() {
    termLog(T("[SYSLOGS] DOCUMENT KΣ-0001 // BACKEND TRACES", "[SYSLOGS] ДОКУМЕНТ KΣ-0001 // БЭКЕНД-ТРЕЙСЫ"), "sys");
    termLog("──────────────────────────────────────────────", "info");
    syslogArchive.forEach(function (logItem) {
      termLogLink(logItem.id, "info", function () { openLogViewer(logItem.id, logItem.body); });
    });
    if (window.SCPLogs) {
      window.SCPLogs.runtime("syslog", lang).forEach(function (logItem) {
        termLogLink(logItem.id, "warn", function () { openLogViewer(logItem.id, logItem.body); });
      });
    }
    termLog("──────────────────────────────────────────────", "info");
    termLog(T("[SYSLOGS] ACCESS HIERARCHY // REVISION 12", "[SYSLOGS] ИЕРАРХИЯ ДОСТУПА // РЕДАКЦИЯ 12"), "sys");
    termLog("──────────────────────────────────────────────", "info");
    (window.SCPLogs ? window.SCPLogs.hierarchy : []).forEach(function (entry) { termLog(entry, "info"); });
    termLog("──────────────────────────────────────────────", "info");
  }

  function openOraclePanel() {
    var isRu = document.documentElement.lang === "ru";
    var url = isRu ? "./oracle.html" : "./oracle.html";
    if (!/\/ru\//i.test(window.location.pathname) && isRu) url = "./oracle.html";
    if (!isRu) url = "./oracle.html";
    if (/\/ru\//i.test(window.location.pathname) && isRu) url = "./oracle.html";
    window.open(url, "_blank", "noopener");
    termLog(
      lang === "en"
        ? "[ORACLE] CONTROL PANEL OPENED IN NEW TAB"
        : "[ОРАКУЛ] ПАНЕЛЬ УПРАВЛЕНИЯ ОТКРЫТА В НОВОЙ ВКЛАДКЕ",
      "sys"
    );
  }

  function handleRequestCommand(raw) {
    if (contactStage < 4) {
      termLog(T("'request' is not recognized as a command", "'request' не является командой"), "err");
      return;
    }
    var s = raw.toLowerCase().replace(/\s+/g, "");
    var empMatch = s.match(/-emp:(emp-\d+)/);
    var keyMatch = s.match(/-oracle:(or-key-\d+)/);
    var hasMaint = s.indexOf("-maint") !== -1;
    var hasTarget = s.indexOf("-target:memetic-filter") !== -1;
    if (!hasMaint || !hasTarget || !empMatch || !keyMatch) {
      termLog(
        T(
          "[REQUEST] MALFORMED — expected: request -maint -target:memetic-filter -emp:&lt;CODE&gt; -oracle:&lt;KEY&gt;",
          "[ЗАПРОС] НЕВЕРНЫЙ ФОРМАТ — ожидается: request -maint -target:memetic-filter -emp:&lt;КОД&gt; -oracle:&lt;КЛЮЧ&gt;"
        ),
        "err"
      );
      return;
    }
    var emp = empMatch[1].toUpperCase();
    var key = keyMatch[1].toUpperCase();
    if (emp === "EMP-2291") {
      termLog(
        T("[ORACLE] REJECTED // OPERATOR EMP-2291 IS DECOMMISSIONED", "[ОРАКУЛ] ОТКЛОНЕНО // ОПЕРАТОР EMP-2291 ВЫВЕДЕН ИЗ ЭКСПЛУАТАЦИИ"),
        "err"
      );
      return;
    }
    if (emp === "EMP-3106") {
      termLog(
        T("[ORACLE] REJECTED // OPERATOR EMP-3106 NO LONGER HOLDS 'memetic-filter'", "[ОРАКУЛ] ОТКЛОНЕНО // У ОПЕРАТОРА EMP-3106 ОТОЗВАНО ПРАВО «memetic-filter»"),
        "err"
      );
      return;
    }
    if (emp === "EMP-4470") {
      termLog(
        T("[ORACLE] REJECTED // CODE EMP-4470 INVALID AFTER REVISION 12", "[ОРАКУЛ] ОТКЛОНЕНО // КОД EMP-4470 НЕДЕЙСТВИТЕЛЕН ПОСЛЕ РЕДАКЦИИ 12"),
        "err"
      );
      return;
    }
    if (emp !== "EMP-8817") {
      termLog(
        T("[ORACLE] REJECTED // OPERATOR " + emp + " LACKS ORACLE-CTL PERMISSION", "[ОРАКУЛ] ОТКЛОНЕНО // У ОПЕРАТОРА " + emp + " НЕТ ПРАВА ORACLE-CTL"),
        "err"
      );
      return;
    }
    if (key !== "OR-KEY-7731") {
      termLog(
        T("[ORACLE] REJECTED // MASTER KEY " + key + " EXPIRED (rotated at revision 12)", "[ОРАКУЛ] ОТКЛОНЕНО // МАСТЕР-КЛЮЧ " + key + " ПРОСРОЧЕН (ротация в редакции 12)"),
        "err"
      );
      return;
    }
    contactStage = 5;
    termLog(
      T("[ORACLE] SIGNATURE VERIFIED // Sr. Res. L. Arden (EMP-8817)", "[ОРАКУЛ] ПОДПИСЬ ПОДТВЕРЖДЕНА // ст. иссл. Л. Арден (EMP-8817)"),
      "sys"
    );
    setTimeout(function () {
      termLog(
        T("[ORACLE] MAINTENANCE WINDOW OPENED // TARGET: MEMETIC FILTER &amp; SUPPRESSION", "[ОРАКУЛ] ОТКРЫТО СЕРВИСНОЕ ОКНО // ЦЕЛЬ: МЕМЕТИЧЕСКАЯ ФИЛЬТРАЦИЯ И ПОДАВЛЕНИЕ"),
        "sys"
      );
    }, 1400);
    setTimeout(function () {
      termLog(
        T("[SYSTEM] MEMETIC SUPPRESSION: <b class='danger'>OFFLINE</b>", "[СИСТЕМА] МЕМЕТИЧЕСКОЕ ПОДАВЛЕНИЕ: <b class='danger'>ОТКЛЮЧЕНО</b>"),
        "cog"
      );
    }, 3000);
    setTimeout(function () { termLog(T("&gt; thank you.", "&gt; спасибо."), "cog"); }, 5000);
    setTimeout(function () { termLog(T("[AWAITING NEXT DIRECTIVE]", "[ОЖИДАНИЕ СЛЕДУЮЩЕЙ ДИРЕКТИВЫ]"), "warn"); }, 7000);
  }

  function handleOracleCommand() {
    var oracleUrl = (lang === "ru" || /\/ru\//i.test(window.location.pathname)) ? "../oracle.html" : "./oracle.html";
    termLog(
      T(
        "[ORACLE] Launching ORACLE Control Panel in new tab...",
        "[ОРАКУЛ] Запуск Панели управления ОРАКУЛ в новой вкладке..."
      ),
      "sys"
    );
    try {
      window.open(oracleUrl, "_blank");
    } catch (e) {
      termLog(
        T(
          "[ERROR] Popup blocked. Access link: <a href='" + oracleUrl + "' target='_blank' class='infection-link'>ORACLE Control Panel</a>",
          "[ОШИБКА] Всплывающее окно заблокировано. Ссылка доступа: <a href='" + oracleUrl + "' target='_blank' class='infection-link'>Панель управления ОРАКУЛ</a>"
        ),
        "err"
      );
    }
  }

  var COMMANDS = {
    help: function () {
      termLog(lang === "en" ? "Available commands:" : "Доступные команды:", "sys");
      termLog("  help / ? - " + (lang === "en" ? "show this list" : "показать список"), "info");
      termLog("  oracle - " + T("launch ORACLE system control panel", "запустить панель управления ОРАКУЛ"), "info");
      termLog("  reboot - " + (lang === "en" ? "reset site to pristine state" : "сбросить сайт до первозданного вида"), "info");
      termLog("  clear - " + (lang === "en" ? "clear terminal" : "очистить терминал"), "info");
      termLog("  status - " + (lang === "en" ? "show session status" : "показать статус сессии"), "info");
      termLog("  logs - " + T("document operation history", "история работы с документом"), "info");
      termLog("  syslogs - " + T("access hierarchy revisions", "редакции иерархии доступа"), "info");
      termLog("  oracle - " + T("open ORACLE control panel", "открыть панель ОРАКУЛА"), "info");
      termLog(lang === "en" ? "  unknown - command undefined" : "  неизвестно - команда не определена", "info");
    },
    clear: function () {
      if (termLogEl) termLogEl.innerHTML = "";
      termLog(lang === "en" ? "Terminal cleared" : "Терминал очищен", "sys");
    },
    status: function () {
      var until = getBlackoutUntil();
      var blo = until && Date.now() < until
        ? (lang === "en" ? "ACTIVE (" + Math.ceil((until - Date.now()) / 60000) + " min left)" : "АКТИВЕН (осталось " + Math.ceil((until - Date.now()) / 60000) + " мин)")
        : (lang === "en" ? "INACTIVE" : "НЕАКТИВЕН");
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
      termLog("Blackout: " + blo, (blo.indexOf("ACTIVE") !== -1 || blo.indexOf("АКТИВЕН") !== -1) ? "err" : "info");
      termLog(
        "Influence: " + (unlockedCount === 0 ? "0% — dormant" : Math.round((unlockedCount / (dynamicTotalMentions || 1)) * 100) + "%"),
        "info"
      );
    },
  };

  function processCommand(raw) {
    var cmd = raw.trim();
    if (!cmd) return;
    audit("command", "terminal --input " + cmd, "command executed: " + cmd.split(/\s+/)[0], "выполнена команда " + cmd.split(/\s+/)[0]);
    termAddEntry(cmd, "user");
    var low = cmd.toLowerCase().replace(/\s+/g, "");
    var spacedLow = cmd.toLowerCase().trim();

    if (oracleLoginStage === 1) {
      oracleLoginTmp = cmd.toUpperCase();
      oracleLoginStage = 2;
      if (termInput) termInput.type = "password";
      termLog(lang === "en" ? "ORACLE Key:" : "Ключ ОРАКУЛ:", "sys");
      return;
    }
    if (oracleLoginStage === 2) {
      if (termInput) termInput.type = "text";
      oracleLoginStage = 0;
      if (oracleLoginTmp === "EMP-1104" && cmd.toUpperCase() === "OR-KEY-8192") {
        try { sessionStorage.setItem('oracle_auth_passed', 'true'); } catch (e) {}
        termLog(lang === "en" ? "AUTHORIZATION SUCCESS. LAUNCHING PANEL..." : "АВТОРИЗАЦИЯ УСПЕШНА. ЗАПУСК ПАНЕЛИ...", "ok");
        handleOracleCommand();
      } else {
        termLog(lang === "en" ? "AUTHORIZATION FAILED." : "ОТКАЗ АВТОРИЗАЦИИ.", "err");
      }
      return;
    }

    if (low === "help" || low === "?") COMMANDS.help();
    else if (low === "oracle" || low === "oraclectl" || low === "oracle-panel" || low === "openoracle" || spacedLow === "open oracle") {
      termLog(lang === "en" ? "ORACLE INTERFACE REQUIRES AUTHORIZATION" : "ИНТЕРФЕЙС ОРАКУЛ ТРЕБУЕТ АВТОРИЗАЦИИ", "warn");
      termLog(lang === "en" ? "Operator ID:" : "ID оператора:", "sys");
      oracleLoginStage = 1;
    }
    else if (low === "clear" || low === "cls") COMMANDS.clear();
    else if (low === "reboot" || low === "restart" || low === "clearall") rebootTerminal();
    else if (low === "scandocument" || low === "documentscan" || low === "scan") {
      if (!documentAttackBegan) {
        termLog(
          lang === "en" ? "'" + cmd + "' is not recognized as a command" : "'" + cmd + "' не является командой",
          "err"
        );
        termLog(lang === "en" ? "Type help for list" : "Введите help для списка", "info");
      } else logDocumentScanStatus();
    } else if (low === "logs" || low === "log" || spacedLow === "show logs") handleLogsCommand();
    else if (low === "syslogs" || low === "syslog" || spacedLow === "system logs") handleSyslogsCommand();
    else if (low === "oracle" || low === "oraclepanel" || spacedLow === "oracle panel" || low === "oracle-control") openOraclePanel();
    else if (low.indexOf("request") === 0) handleRequestCommand(cmd);
    else if (
      contactStage === 1 &&
      (low === "yes" || low === "y" || low === "да" || low === "accept" || low === "iaccept" || low === "согласен")
    ) handleAffirmativeResponse(cmd);
    else if (low === "o5-erasure" || low === "o5erasure" || low === "erasure" || low === "o5") handleO5Erasure();
    else if (
      low === "kosstarthe1st" || low === "kosstar_the_1st" ||
      spacedLow === "kosstar the 1st" || low === "kosstarthe1st.exe"
    ) handleKosstarCommand();
    else if (low === "status" || low === "whoami" || low === "id" || low === "location") COMMANDS.status();
    else {
      termLog(
        lang === "en" ? "'" + cmd + "' is not recognized as a command" : "'" + cmd + "' не является командой",
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
        var all = ["help", "oracle", "reboot", "clear", "status", "logs", "syslogs"];
        for (var i = 0; i < all.length; i++) {
          if (all[i].indexOf(cur) === 0) { termInput.value = all[i]; break; }
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

})();
