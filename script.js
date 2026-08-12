(function () {
  "use strict";

  var COOKIE = "scp_arg_sessions";
  var MAX_SESSIONS = 4;
  var MAX_EVENTS = 28;
  var COOKIE_LIMIT = 3400;

  function z(n) { return n < 10 ? "0" + n : "" + n; }
  function stamp(value) {
    var d = value instanceof Date ? value : new Date(value);
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) + "-" +
      z(d.getHours()) + "-" + z(d.getMinutes()) + "-" + z(d.getSeconds());
  }
  function duration(seconds, lang) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    return lang === "ru"
      ? z(h) + "ч " + z(m) + "мин " + z(s) + "сек"
      : z(h) + "h " + z(m) + "m " + z(s) + "s";
  }
  function readCookie() {
    var m = document.cookie.match(/(?:^|; )scp_arg_sessions=([^;]*)/);
    if (!m) return [];
    try { return JSON.parse(decodeURIComponent(m[1])); } catch (e) { return []; }
  }
  function writeCookie(items) {
    items = items.slice(-MAX_SESSIONS);
    var encoded = encodeURIComponent(JSON.stringify(items));
    while (encoded.length > COOKIE_LIMIT && items.length) {
      if (items[0].e && items[0].e.length > 4) items[0].e.splice(1, 1);
      else items.shift();
      encoded = encodeURIComponent(JSON.stringify(items));
    }
    document.cookie = COOKIE + "=" + encoded + "; max-age=31536000; path=/; SameSite=Lax";
  }
  function clean(text, max) {
    return String(text || "").replace(/[\r\n]+/g, " ").slice(0, max || 180);
  }

  var records = [
    {
      id: "11-06-2026-14-23-04", sec: 244, employee: "Dr. Anna Goltz", employeeRu: "Др. Анна Гольц",
      level: "4", code: "DOC-READONLY", permissions: "read:true, modify:false, decrypt:false, control:false, administrator:false",
      access: "Chief Supervisor Pavel Romanov", accessRu: "Гл. супервайзер Павел Романов", mode: "manual", modeRu: "вручную",
      actions: "session opened, document opened, decryption attempt: denied, decryption attempt: denied, decryption attempt: denied, terminal action: help, terminal action: reboot, session closed",
      actionsRu: "сессия открыта, документ открыт, попытка расшифровки: отказ, попытка расшифровки: отказ, попытка расшифровки: отказ, выполнена команда help, выполнена команда reboot, сессия завершена",
      events: [[0,"session opened"],[7,"document --open KΣ-0001"],[58,"decrypt --attempt --level:4 → DENIED"],[117,"decrypt --attempt --level:4 → DENIED"],[174,"decrypt --attempt --level:4 → DENIED"],[190,"terminal --input help"],[218,"terminal --input reboot"],[244,"session closed"]]
    },
    {
      id: "03-07-2026-09-11-52", sec: 733, employee: "Dr. Mara Kade", employeeRu: "Др. Мара Кейд",
      level: "4", code: "EMP-3106", permissions: "read:true, modify:true, decrypt:false, control:false, administrator:false",
      access: "automated routing node MNT-4", accessRu: "автоматический маршрутный узел MNT-4", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, document opened, command document executed, command memetic-filter executed, command note executed, command request executed, document closed, session closed",
      actionsRu: "сессия открыта, документ открыт, выполнена команда document, выполнена команда memetic-filter, выполнена команда note, выполнена команда request, документ закрыт, сессия завершена",
      events: [[0,"session opened"],[8,"document --open KΣ-0001"],[281,"document --status"],[389,"memetic-filter --status"],[502,"memetic-filter --extract --template"],[506,"note --add 'maintenance template export approved'"],[613,"request --maint --target:memetic-filter --emp:EMP-3106 --oracle:OR-KEY-4415"],[733,"session closed"]]
    },
    {
      id: "19-07-2026-17-42-08", sec: 1130, employee: "Senior Researcher Lena Arden", employeeRu: "Ст. иссл. Лена Арден",
      level: "4", code: "EMP-4470", permissions: "read:true, modify:true, decrypt:false, control:true, administrator:false",
      access: "O5 infrastructure relay O5-R17", accessRu: "инфраструктурный ретранслятор O5-R17", mode: "manual", modeRu: "вручную",
      actions: "session opened, document opened, command oracle executed, command memetic-filter executed, command memetic-suppression executed, command note executed, document closed, session closed",
      actionsRu: "сессия открыта, документ открыт, выполнена команда oracle, выполнена команда memetic-filter, выполнена команда memetic-suppression, выполнена команда note, документ закрыт, сессия завершена",
      events: [[0,"session opened"],[9,"document --open KΣ-0001"],[183,"oracle --diagnostics --verbose"],[397,"oracle --policy --review"],[595,"memetic-filter --chain-review --full"],[822,"memetic-suppression --health-check --verbose"],[1014,"note --add 'ORACLE-CTL access confirmed for EMP-4470'"],[1130,"session closed"]]
    },
    {
      id: "02-08-2026-08-03-31", sec: 161, employee: "Technician Roman Sowa", employeeRu: "Техник Роман Сова",
      level: "2", code: "EMP-5012", permissions: "read:true, modify:false, decrypt:false, control:false, administrator:false",
      access: "automated routing node DOC-R2", accessRu: "автоматический маршрутный узел DOC-R2", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, document opened, command document executed: denied, terminal action: status, document closed, session closed",
      actionsRu: "сессия открыта, документ открыт, выполнена команда document: отказ, выполнена команда status, документ закрыт, сессия завершена",
      events: [[0,"session opened"],[8,"document --open KΣ-0001"],[76,"document --edit --section:description → DENIED (modify:false)"],[91,"terminal --input status"],[161,"session closed"]]
    },
    {
      id: "14-08-2026-22-14-55", sec: 79, employee: "O5-██ proxy", employeeRu: "доверенное лицо O5-██",
      level: "5", code: "EMP-0001", permissions: "read:true, modify:true, decrypt:true, control:true, administrator:true",
      access: "[REDACTED]", accessRu: "[УДАЛЕНО]", mode: "manual", modeRu: "вручную",
      actions: "session opened, document opened, command document executed, command audit executed, document closed, session closed",
      actionsRu: "сессия открыта, документ открыт, выполнена команда document, выполнена команда audit, документ закрыт, сессия завершена",
      events: [[0,"session opened"],[5,"document --open KΣ-0001"],[24,"document --edit --section:appendix-k4 --revise"],[43,"document --crosslinks --purge --recursive"],[58,"audit --mask --actor:O5-proxy --reason:containment"],[79,"session closed"]]
    },
    {
      id: "28-08-2026-13-09-07", sec: 48, employee: "Automated Maintenance Node 7", employeeRu: "Автоматический узел техобслуживания 7",
      level: "service", code: "DOC-MNT-AUTO", permissions: "read:true, modify:true, decrypt:false, control:false, administrator:false",
      access: "automated scheduling core SCH-2", accessRu: "автоматическое ядро расписаний SCH-2", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, document opened, command document executed, command cache executed, session closed",
      actionsRu: "сессия открыта, документ открыт, выполнена команда document, выполнена команда cache, сессия завершена",
      events: [[0,"session opened"],[6,"document --open KΣ-0001"],[14,"document --index --checksum --refresh"],[24,"cache --purge --all"],[48,"session closed"]]
    },
    {
      id: "05-09-2026-16-55-40", sec: 372, employee: "Archivist Ilya Belov", employeeRu: "Архивист Илья Белов",
      level: "3", code: "EMP-6124", permissions: "read:true, modify:false, decrypt:false, control:false, administrator:false",
      access: "Head Archivist Marina Krest", accessRu: "старший архивист Марина Кресть", mode: "manual", modeRu: "вручную",
      actions: "session opened, document opened, decryption request: denied, decryption request: denied, command note executed, command document executed, session closed",
      actionsRu: "сессия открыта, документ открыт, запрос на дешифровку: отказ, запрос на дешифровку: отказ, выполнена команда note, выполнена команда document, сессия завершена",
      events: [[0,"session opened"],[4,"document --open KΣ-0001"],[34,"decrypt --attempt --level:4 → DENIED"],[166,"decrypt --attempt --level:4 → DENIED"],[203,"note --add 'Looks good to me'"],[278,"document --status"],[372,"session closed"]]
    },
    {
      id: "17-09-2026-07-28-16", sec: 112, employee: "Memetics Intern Kara Dyer", employeeRu: "стажёр меметики Кара Дайер",
      level: "2", code: "EMP-7308", permissions: "read:true, modify:false, decrypt:false, control:false, administrator:false",
      access: "automated mentorship policy MTR-1", accessRu: "автоматическая политика наставничества MTR-1", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, appendix K-1 opened, shock response flag raised, session force-terminated",
      actionsRu: "сессия открыта, приложение K-1 открыто, поднят флаг шоковой реакции, сессия принудительно завершена",
      events: [[0,"session opened"],[9,"document --open KΣ-0001"],[28,"appendix --open K-1"],[66,"guardian --flag shock_response"],[112,"guardian --force-terminate --reason:shock_response"]]
    },
    {
      id: "21-09-2026-20-41-03", sec: 584, employee: "Senior Researcher Lena Arden", employeeRu: "Ст. иссл. Лена Арден",
      level: "4", code: "EMP-4470", permissions: "read:true, modify:true, decrypt:false, control:true, administrator:false",
      access: "automated ORACLE service queue ORQ-3", accessRu: "автоматическая сервисная очередь Оракула ORQ-3", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, command oracle executed, command memetic-filter executed, command memetic-suppression executed, command note executed, session closed",
      actionsRu: "сессия открыта, выполнена команда oracle, выполнена команда memetic-filter, выполнена команда memetic-suppression, выполнена команда note, сессия завершена",
      events: [[0,"session opened"],[16,"oracle --maintenance --audit --init"],[125,"memetic-filter --chain-review --full"],[439,"memetic-suppression --health-check --verbose"],[533,"note --add 'ORACLE maintenance audit passed'"],[584,"session closed"]]
    },
    {
      id: "30-09-2026-11-06-57", sec: 186, employee: "Chief Supervisor Pavel Romanov", employeeRu: "Гл. супервайзер Павел Романов",
      level: "4", code: "EMP-8840", permissions: "read:true, modify:true, decrypt:false, control:false, administrator:false",
      access: "O5 support route SRV-14", accessRu: "маршрут поддержки O5 SRV-14", mode: "manual", modeRu: "вручную",
      actions: "session opened, command access executed, command note executed, session closed",
      actionsRu: "сессия открыта, выполнена команда access, выполнена команда note, сессия завершена",
      events: [[0,"session opened"],[14,"access --request --review --queue:pending"],[87,"access --grant --target:EMP-2291 --mode:DOC-READONLY --scope:KΣ-0001"],[145,"note --add 'manual access grant for Dr. Goltz'"],[186,"session closed"]]
    },
    {
      id: "08-10-2026-03-14-00", sec: 215, employee: "Dr. S. Kadyrov", employeeRu: "Др. С. Кадыров",
      level: "4", code: "EMP-9021", permissions: "read:true, modify:true, decrypt:false, control:true, administrator:false",
      access: "automated routing node MNT-2", accessRu: "автоматический маршрутный узел MNT-2", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, document opened, command filterctl executed, note attached, document closed, session closed",
      actionsRu: "сессия открыта, документ открыт, выполнена команда filterctl, приложена заметка, документ закрыт, сессия завершена",
      events: [[0,"session opened"],[4,"document --open KΣ-0001"],[45,"filterctl --suspend GRAVE_WHISPER"],[120,"note --add 'GRAVE WHISPER protocol suspended for filter matrix adjustment'"],[195,"document --close KΣ-0001"],[215,"session closed"]]
    },
    {
      id: "09-10-2026-14-22-11", sec: 58, employee: "Automated Maintenance Node 3", employeeRu: "Автоматический узел техобслуживания 3",
      level: "service", code: "DOC-MNT-AUTO", permissions: "read:true, modify:true, decrypt:false, control:false, administrator:false",
      access: "scheduling core SCH-1", accessRu: "ядро расписаний SCH-1", mode: "automatic", modeRu: "автоматически",
      actions: "session opened, document opened, cache purge executed, session closed",
      actionsRu: "сессия открыта, документ открыт, очистка кэша выполнена, сессия завершена",
      events: [[0,"session opened"],[6,"document --open KΣ-0001"],[31,"cache --purge --routine"],[58,"session closed"]]
    },
    {
      id: "12-10-2026-11-22-30", sec: 412, employee: "Field Operative M. Hayes", employeeRu: "Полевой оперативник М. Хейс",
      level: "4", code: "EMP-1104", permissions: "read:true, modify:false, decrypt:true, control:false, administrator:false",
      access: "O5 infrastructure relay", accessRu: "инфраструктурный ретранслятор O5", mode: "manual", modeRu: "вручную",
      actions: "session opened, terminal action: oracle, oracle access granted, session closed",
      actionsRu: "сессия открыта, выполнена команда oracle, доступ к ОРАКУЛ предоставлен, сессия завершена",
      events: [[0,"session opened"],[12,"terminal --input oracle"],[28,"oracle-auth --id:EMP-1104 --key:OR-KEY-8192"],[35,"ORACLE remote interface invoked. Session established."],[412,"session closed"]]
    }
  ];

  function staticLog(r, lang) {
    var ru = lang === "ru";
    return r.id + ".log\n" +
      (ru ? "Сотрудник: " : "Employee: ") + (ru ? r.employeeRu : r.employee) + "\n" +
      (ru ? "Уровень допуска: " : "Clearance level: ") + r.level + "\n" +
      (ru ? "Системный код: " : "System code: ") + r.code + "\n" +
      (ru ? "Права: " : "Permissions: ") + "[" + r.permissions + "]\n" +
      (ru ? "Доступ предоставлен: " : "Access granted by: ") + (ru ? r.accessRu : r.access) + "\n" +
      (ru ? "Вид рассмотрения заявки: " : "Review mode: ") + (ru ? r.modeRu : r.mode) + "\n" +
      (ru ? "Длительность сессии: " : "Session duration: ") + duration(r.sec, lang) + "\n" +
      (ru ? "Действия: [" + r.actionsRu : "Actions: [" + r.actions) + "]";
  }
  function staticSyslog(r) {
    var start = new Date(
      +r.id.slice(6, 10), +r.id.slice(3, 5) - 1, +r.id.slice(0, 2),
      +r.id.slice(11, 13), +r.id.slice(14, 16), +r.id.slice(17, 19)
    );
    var lines = [
      "[" + stamp(start) + "] session init",
      "[" + stamp(start) + "] operator=" + r.code + " clearance=" + r.level + " mode=" + r.mode
    ];
    r.events.forEach(function (event) {
      lines.push("[" + stamp(new Date(start.getTime() + event[0] * 1000)) + "] " + event[1]);
    });
    lines.push("", "[SYS] duration validated: " + duration(r.sec, "en"));
    return lines.join("\n");
  }

  var history = readCookie();
  var current = {
    i: stamp(new Date()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
    s: Date.now(),
    l: document.documentElement.lang === "ru" ? "ru" : "en",
    e: [],
    c: 0
  };
  history.push(current);

  function save() { writeCookie(history); }
  function add(type, detail, labelEn, labelRu) {
    if (current.c) return;
    current.e.push([Date.now(), clean(type, 30), clean(detail, 150), clean(labelEn || detail, 110), clean(labelRu || labelEn || detail, 110)]);
    if (current.e.length > MAX_EVENTS) current.e.splice(1, 1);
    save();
  }
  function close(reason) {
    if (current.c) return;
    add("session", "session --close --reason:" + clean(reason || "navigation", 30), "session closed", "сессия завершена");
    current.c = Date.now();
    current.r = clean(reason || "navigation", 30);
    save();
  }
  add("session", "session --open", "session opened", "сессия открыта");

  function runtimeName(item, ext) { return item.i.slice(0, 19) + "." + ext; }
  function displayEvents(item, lang) {
    return item.e
      .filter(function (e) { return e[1] !== "session" || e[2].indexOf("session --close") === -1; })
      .map(function (e) { return lang === "ru" ? e[4] : e[3]; })
      .join(", ");
  }
  function runtimeLog(item, lang) {
    var ru = lang === "ru";
    var end = item.c || Date.now();
    return runtimeName(item, "log") + "\n" +
      (ru ? "Сотрудник: Текущий наблюдатель\n" : "Employee: Current observer\n") +
      (ru ? "Уровень допуска: 0\n" : "Clearance level: 0\n") +
      (ru ? "Системный код: VIS-" : "System code: VIS-") + item.i.slice(-4) + "\n" +
      (ru ? "Права: [чтение:истина, изменение:ложь, дешифровка:ложь, управление:ложь, администратор:ложь]\n" : "Permissions: [read:true, modify:false, decrypt:false, control:false, administrator:false]\n") +
      (ru ? "Доступ предоставлен: терминал открытого архива\n" : "Access granted by: open archive terminal\n") +
      (ru ? "Вид рассмотрения заявки: автоматически\n" : "Review mode: automatic\n") +
      (ru ? "Длительность сессии: " : "Session duration: ") + duration(Math.max(0, Math.floor((end - item.s) / 1000)), lang) + "\n" +
      (ru ? "Действия: [" : "Actions: [") + displayEvents(item, lang) + (item.c ? (ru ? ", сессия завершена]" : ", session closed]") : "]");
  }
  function runtimeSyslog(item) {
    var start = new Date(item.s);
    var lines = [
      "[" + stamp(start) + "] session init",
      "[" + stamp(start) + "] operator=VIS-" + item.i.slice(-4) + " clearance=0 mode=automatic"
    ];
    item.e.forEach(function (e) {
      if (!item.c && e[1] === "session" && e[2].indexOf("session --close") === 0) return;
      lines.push("[" + stamp(new Date(e[0])) + "] " + e[2]);
    });
    return lines.join("\n");
  }
  function runtimeItems(ext, lang) {
    var now = Date.now();
    return history.slice().reverse().map(function (item) {
      if (!item.c && now - item.s < 1500) return null;
      return { id: runtimeName(item, ext), body: ext === "log" ? runtimeLog(item, lang) : runtimeSyslog(item), runtime: true };
    }).filter(Boolean);
  }

  window.addEventListener("pagehide", function () { close("navigation"); });
  window.SCPLogs = {
    archive: function (lang) { return records.map(function (r) { return { id: r.id + ".log", body: staticLog(r, lang) }; }); },
    syslogs: function () { return records.map(function (r) { return { id: r.id + ".syslog", body: staticSyslog(r) }; }); },
    hierarchy: [
      "EMP-2291 → DECOMMISSIONED (operator deceased)",
      "EMP-3106 → reassigned; memetic-filter REVOKED",
      "EMP-4470 → EMP-8817; ORACLE-CTL retained; clearance 4→5",
      "EMP-5012 → unchanged; clearance 2",
      "ORACLE MASTER KEY: OR-KEY-4415 → OR-KEY-7731"
    ],
    runtime: runtimeItems,
    add: add,
    close: close
  };
  save();
})();