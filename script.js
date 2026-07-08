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
    // мгновенно показываем весь лог и кнопку входа
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
    if (bootAudio) { bootAudio.pause(); }
    boot.classList.add("gone");
    setTimeout(function () {
      boot.style.display = "none";
    }, 700);
  }

    /* ---------- BOOT AUDIO ---------- */
  var bootAudio = document.getElementById("boot-audio");
  var audioStarted = false;

 /* ---------- ACCESS GATE (перед интро) ---------- */
  var gate = document.getElementById("gate");
  var gateEnter = document.getElementById("gate-enter");
  var bootStarted = false;
  function startBoot() {
      if (bootStarted) return;
    bootStarted = true;
    var bootAudio = document.getElementById("boot-audio");
    if (bootAudio) {
      bootAudio.volume = 0.85;
      bootAudio.currentTime = 0;
      bootAudio.play().catch(function(e) {
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
  // На устройствах без hover включаем клик, чтобы раскрывать
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll('.redacted').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var isRevealed = el.classList.toggle('touch-reveal');
        if (isRevealed) {
          // снять через 2.5 с
          setTimeout(function () { el.classList.remove('touch-reveal'); }, 2500);
        }
      });
    });
    document.querySelectorAll('.ghost').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var isRevealed = el.classList.toggle('touch-show');
        if (isRevealed) {
          setTimeout(function () { el.classList.remove('touch-show'); }, 3000);
        }
      });
    });
  }

var mentions = document.querySelectorAll("[data-kmention]");
  var totalMentions = mentions.length;
  var unlockedCount = 0;
  function updateMeter() {
    var count = 0;
    mentions.forEach(function (el) {
      if (el.classList.contains("unlocked")) count++;
    });
    unlockedCount = count;
    var unlockedStates = [];
    mentions.forEach(function (el) {
      unlockedStates.push(el.classList.contains("unlocked") ? 1 : 0);
    });
    sessionStorage.setItem("scp-km-states", JSON.stringify(unlockedStates));
    var meterText = document.getElementById("k-meter-text");
    if (meterText) {
      var pct = Math.round((count / (totalMentions || 1)) * 100);
      var bars = "";
      for (var i = 0; i < totalMentions; i++) {
        bars += (i < count) ? "█" : "░";
      }
      meterText.textContent = count + "/" + totalMentions + " [" + bars + "] " + pct + "%";
      if (count === totalMentions && totalMentions > 0) {
        meterText.classList.add("blink");
      }
    }
    return count;
  }
  if (totalMentions > 0) {
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
          
          var a = document.getElementById("boot-audio");
          if (a) {
            try {
              var clone = a.cloneNode();
              clone.volume = 0.4;
              clone.currentTime = 0;
              clone.play().catch(function(){});
            } catch(err) {}
          }
          if (newCount === 1) {
            burst();
          }
        }
      });
    });
  }

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
  var whispers = lang === 'en' ? whispersEN : whispersRU;
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
      flashOpacity: Math.min(0.6, flashOpacity)
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
  function scheduleBurst() {
    var cfg = getGlitchConfig();
    var delay = cfg ? cfg.interval : 15000;
    setTimeout(function () {
      if (boot && boot.style.display !== "none") {
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

  /* ---------- LIVE CORRUPT LINES (in appendices) ---------- */
  if (!reduce) {
    document.querySelectorAll(".corrupt-line").forEach(function (el) {
      var original = el.textContent;
      setInterval(function () {
        // работаем только если приложение раскрыто (видно)
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
})();
