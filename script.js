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
    boot.classList.add("gone");
    setTimeout(function () {
      boot.style.display = "none";
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
  var BLACKOUT_DURATION = 10 * 60 * 1000;
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
        .replace(/CURRENT: LVL 0/, 'CURRENT: LVL <span style="color:#36e0e6">▓▓▓▓▓</span>')
        .replace(/ТЕКУЩИЙ: УРОВЕНЬ 0/, 'ТЕКУЩИЙ: УРОВЕНЬ <span style="color:#36e0e6">▓▓▓▓▓</span>');
    }, 500);
    setTimeout(function () {
      entry.className = "term-entry sys";
      entry.innerHTML = entry.innerHTML
        .replace(/CURRENT: LVL <span[^>]*>▓▓▓▓▓<\/span>/, 'CURRENT: LVL <b>kosstarthe1st.welcome</b>')
        .replace(/ТЕКУЩИЙ: УРОВЕНЬ <span[^>]*>▓▓▓▓▓<\/span>/, 'ТЕКУЩИЙ: УРОВЕНЬ <b>kosstarthe1st.welcome</b>');
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
  function activateBlackout() {
    var until = Date.now() + BLACKOUT_DURATION;
    setBlackoutCookie(until);
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
          termLog(lang === "en" ? "BLACKOUT EXPIRED — signal restored" : "БЛЭКАУТ ИСТЁК — сигнал восстановлен", "sys");
          return;
        }
        var mm = Math.floor(diff / 60000);
        var ss = Math.floor((diff % 60000) / 1000);
        var txt = (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
        if (firstInner)
          firstInner.textContent =
            (lang === "en" ? "SIGNAL LOST // BLACKOUT ACTIVE — " : "СИГНАЛ ПОТЕРЯН // БЛЭКАУТ АКТИВЕН — ") + txt;
      }, 1000);
      var mm0 = 10,
        ss0 = 0;
      if (firstInner)
        firstInner.textContent =
          (lang === "en" ? "SIGNAL LOST // BLACKOUT ACTIVE — " : "СИГНАЛ ПОТЕРЯН // БЛЭКАУТ АКТИВЕН — ") +
          (mm0 < 10 ? "0" : "") +
          mm0 +
          ":" +
          (ss0 < 10 ? "0" : "") +
          ss0;
    }
    termLog(lang === "en" ? "[CRITICAL] BLACKOUT PROTOCOL ENGAGED — 10:00" : "[КРИТИЧНО] ПРОТОКОЛ БЛЭКАУТА АКТИВИРОВАН — 10:00", "cog");
  }
  function deactivateBlackout() {
    if (blackoutEl) blackoutEl.classList.add("hidden");
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
      if (blackoutEl) blackoutEl.classList.remove("hidden");
      var inner = blackoutEl ? blackoutEl.querySelectorAll(".blackout-inner")[0] : null;
      if (blackoutCountdown) clearInterval(blackoutCountdown);
      blackoutCountdown = setInterval(function () {
        var now = Date.now();
        var diff = until - now;
        if (diff <= 0) {
          clearInterval(blackoutCountdown);
          deactivateBlackout();
          termLog(lang === "en" ? "BLACKOUT EXPIRED — signal restored" : "БЛЭКАУТ ИСТЁК — сигнал восстановлен", "sys");
          return;
        }
        var mm = Math.floor(diff / 60000);
        var ss = Math.floor((diff % 60000) / 1000);
        if (inner)
          inner.textContent =
            (lang === "en" ? "SIGNAL LOST // BLACKOUT ACTIVE — " : "СИГНАЛ ПОТЕРЯН // БЛЭКАУТ АКТИВЕН — ") +
            (mm < 10 ? "0" : "") +
            mm +
            ":" +
            (ss < 10 ? "0" : "") +
            ss;
      }, 1000);
      termLog(
        lang === "en"
          ? "[CRITICAL] BLACKOUT PERSISTS — " + Math.ceil((until - Date.now()) / 60000) + " min remaining. Use reboot to clear."
          : "[КРИТИЧНО] БЛЭКАУТ СОХРАНЯЕТСЯ — осталось " + Math.ceil((until - Date.now()) / 60000) + " мин. Используйте reboot для сброса.",
        "cog"
      );
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
    termLog(lang === "en" ? "[CRITICAL] K-class textual flood // containment failure" : "[КРИТИЧНО] K-класс текстовый поток // отказ содержания", "cog");
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
      var open = fold.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var sign = btn.querySelector(".fold-sign");
      if (sign) sign.textContent = open ? "—" : "+";
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
  var UNLOCKED_HOVER = lang === "en" ? "There is no way back" : "Пути назад нет";
  var LOCKED_HOVER =
    lang === "en"
      ? "Designation classified // Click to decrypt"
      : "Обозначение засекречено // Нажмите для дешифровки";
  function refreshMentionHoverTitles() {
    mentions.forEach(function (el) {
      if (el.classList.contains("unlocked")) {
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
    if (meterText) {
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
      el.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!el.classList.contains("unlocked")) {
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
    whisperEl.textContent = rand(whispers);
    whisperEl.classList.add("on");
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
    deactivateBlackout();
    try {
      sessionStorage.removeItem("scp-km-states");
      sessionStorage.removeItem(BLACKOUT_KEY);
    } catch (e) {}
    clearBlackoutStorage();
    isEasterEggActive = false;
    unlockedCount = 0;
    dynamicTotalMentions = baseTotalMentions;
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
    termLog(lang === "en" ? "File re-encrypted // 0/5" : "Файл повторно зашифрован // 0/5", "sys");
  }

  function handleO5Erasure() {
    termLog(
      lang === "en"
        ? "[O5] ERASURE PROTOCOL INITIATED // AUTH CODE ████"
        : "[O5] ПРОТОКОЛ СТИРАНИЯ ИНИЦИИРОВАН // КОД ████",
      "err"
    );
    termLog(lang === "en" ? "Purging document..." : "Очистка документа...", "warn");
    var doc = document.querySelector(".doc-shell");
    if (doc) {
      doc.style.transition = "opacity 0.9s ease, filter 0.9s ease";
      doc.style.opacity = "0";
      doc.style.filter = "blur(18px)";
    }
    setTimeout(function () {
      termLog(lang === "en" ? "Document erased by order of O5-█" : "Документ стёрт по приказу O5-█", "err");
      var p404 = lang === "en" ? "./404.html" : "../404.html";
      if (lang === "ru") {
        if (window.location.pathname.indexOf("/ru/") !== -1) p404 = "../404.html";
        else p404 = "./404.html";
      }
      window.location.href = p404;
    }, 1800);
  }

  function handleKosstarCommand() {
    termLog("kosstarthe1st is not a valid command or application", "err");
    termLog(
      lang === "en"
        ? "Command recognition failed // logging attempt..."
        : "Распознавание команды не удалось // логирование попытки...",
      "warn"
    );
    termLog(lang === "en" ? "ANOMALY: designation vocalized in terminal" : "АНОМАЛИЯ: обозначение произнесено в терминале", "cog");
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
      var p404 =
        (lang === "en" || (lang === "ru" && window.location.pathname.indexOf("/ru/") === -1))
          ? "./404.html"
          : "../404.html";
      if (window.location.pathname.indexOf("/ru/") !== -1) p404 = "../404.html";
      else p404 = "./404.html";
      window.location.href = p404;
    }, 600);
  }

  var COMMANDS = {
    help: function () {
      termLog(lang === "en" ? "Available commands:" : "Доступные команды:", "sys");
      termLog("  help / ? - " + (lang === "en" ? "show this list" : "показать список"), "info");
      termLog("  reboot - " + (lang === "en" ? "reset site to pristine state" : "сбросить сайт до первозданного вида"), "info");
      termLog("  erased.txt - " + (lang === "en" ? "open erased file (404)" : "открыть стёртый файл (404)"), "info");
      termLog("  o5-erasure - " + (lang === "en" ? "initiate document erasure protocol" : "запустить протокол уничтожения документа"), "info");
      termLog("  kosstarthe1st - ???", "info");
      termLog("  clear - " + (lang === "en" ? "clear terminal" : "очистить терминал"), "info");
      termLog("  status - " + (lang === "en" ? "show session status" : "показать статус сессии"), "info");
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
        var all = ["help", "reboot", "erased.txt", "o5-erasure", "kosstarthe1st", "clear", "status"];
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
})();
