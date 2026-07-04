import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Glitch,
  Tremor,
  Redacted,
  Scramble,
  CorruptText,
  GhostZone,
} from "./components/Effects";

/* ------------------------------------------------------------------ */
/*  tiny bits                                                          */
/* ------------------------------------------------------------------ */

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const WHISPERS = [
  "ОН ЗДЕСЬ",
  "ОН ЧИТАЕТ ЭТО",
  "НЕ ЗОВИ ЕГО ПО ИМЕНИ",
  "ВЫХОД ОТКРЫТ",
  "KOSSTAR THE 1ST",
  "ВНИМАНИЕ = ДВЕРЬ",
  "ОН УЖЕ НЕ ВНУТРИ",
  "ТЫ ТОЖЕ ВНУТРИ",
];

/* ------------------------------------------------------------------ */
/*  collapsible appendix                                               */
/* ------------------------------------------------------------------ */

function Fold({
  id,
  title,
  children,
  danger = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  danger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fold mb-3">
      <button
        className="fold-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={danger ? "text-scp-red-soft" : ""}>
          ▸ ПРИЛОЖЕНИЕ {id} — {title}
        </span>
        <span className="blink text-scp-dim">{open ? "—" : "+"}</span>
      </button>
      {open && <div className="fold-body">{children}</div>}
    </div>
  );
}

function Para({ children }: { children: ReactNode }) {
  return <p className="leading-7 text-[15px] text-scp-text/90 mb-4">{children}</p>;
}

/* ------------------------------------------------------------------ */
/*  main app                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const now = useClock();
  const [flash, setFlash] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* random glitch bursts */
  useEffect(() => {
    let timer: number;
    const schedule = () => {
      const delay = 9000 + Math.random() * 14000;
      timer = window.setTimeout(() => {
        setFlash(true);
        setWhisper(WHISPERS[(Math.random() * WHISPERS.length) | 0]);
        rootRef.current?.classList.add("shake-body");
        window.setTimeout(() => {
          setFlash(false);
          setWhisper(null);
          rootRef.current?.classList.remove("shake-body");
        }, 1300);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const time = now.toLocaleTimeString("ru-RU", { hour12: false });

  return (
    <div ref={rootRef} className="relative min-h-screen">
      {/* ============ STATUS BAR ============ */}
      <div className="fixed top-0 left-0 right-0 z-[9100] border-b border-scp-line bg-black/90 backdrop-blur px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-scp-dim">
        <div className="flex gap-3 items-center overflow-hidden whitespace-nowrap">
          <span className="text-scp-red-soft font-bold tracking-widest">
            ФОНД&nbsp;SCP
          </span>
          <span className="hidden sm:inline">▸ АРХИВ ОБЪЕКТОВ</span>
          <span className="hidden md:inline">
            ▸ УРОВЕНЬ ДОПУСКА:{" "}
            <span className="text-scp-text">4</span>
          </span>
          <span className="hidden lg:inline">
            ▸ СОЕДИНЕНИЕ:{" "}
            <span className="text-scp-red-soft blink">АКТИВНО</span>
          </span>
        </div>
        <div className="flex gap-3 items-center shrink-0">
          <span className="text-scp-red-soft">● REC</span>
          <span className="text-scp-text">{time}</span>
        </div>
      </div>

      {/* ============ CRT OVERLAY ============ */}
      <div className="crt-overlay">
        <div className="rgb" />
        <div className="scanlines" />
        <div className="flicker" />
        <div className="vignette" />
      </div>

      {/* ============ GLITCH FLASH + WHISPER ============ */}
      <div className={`glitch-flash ${flash ? "on" : ""}`} />
      {whisper && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center pointer-events-none">
          <div
            className="text-scp-red font-mono text-3xl sm:text-5xl tracking-[0.3em] corrupt"
            style={{ textShadow: "0 0 18px rgba(179,18,27,0.8)" }}
          >
            {whisper}
          </div>
        </div>
      )}

      {/* ============ DOCUMENT ============ */}
      <main className="doc-shell pt-16">
        {/* header */}
        <header className="text-center py-10 border-b border-scp-line mb-8 relative">
          <div className="text-scp-red font-mono text-xs tracking-[0.4em] mb-3">
            КОНФИДЕНЦИАЛЬНО / ТОЛЬКО ДЛЯ ПЕРСОНАЛА УРОВНЯ 4
          </div>
          <h1 className="font-[VT323] text-5xl sm:text-7xl text-scp-text mb-2">
            <Glitch text="SCP" hard />
            <span className="text-scp-red">-</span>
            <Glitch text="KΣ-0001" hard />
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
            <span className="class-chip text-scp-dim">ОБЪЕКТ:</span>
            <span className="text-scp-text font-[VT323] text-lg tracking-widest">
              "kosstar the 1st"
            </span>
          </div>
          <div className="mt-5">
            <span className="stamp">
              <Tremor slow>НЕ ПОДЛЕЖИТ РАСПРОСТРАНЕНИЮ</Tremor>
            </span>
          </div>
        </header>

        {/* classification row */}
        <section className="panel p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-scp-dim font-mono text-xs mb-1">
                НОМЕР ОБЪЕКТА
              </div>
              <div className="font-[VT323] text-xl text-scp-text">
                SCP-KΣ-0001
              </div>
            </div>
            <div>
              <div className="text-scp-dim font-mono text-xs mb-1">
                КЛАСС ОБЪЕКТА
              </div>
              <div className="font-[VT323] text-xl text-scp-red">
                <Tremor>██████</Tremor>{" "}
                <span className="text-scp-dim text-sm">(предв. КЕТЕР)</span>
              </div>
            </div>
            <div>
              <div className="text-scp-dim font-mono text-xs mb-1">
                СРЕДА ПРОИСХОЖДЕНИЯ
              </div>
              <div className="font-[VT323] text-xl text-scp-text">
                VRChat
              </div>
            </div>
          </div>
        </section>

        {/* warning */}
        <div className="warn p-4 mb-10 text-sm leading-6 border-l-4">
          <span className="font-bold text-scp-red">⚠ ВНИМАНИЕ.</span> Данный
          файл описывает аномалию, способную к{" "}
          <span className="text-scp-red-soft flicker-text">
            межсредовому переходу
          </span>
          . При обнаружении объекта в физической реальности —{" "}
          <b>НЕ ВСТУПАЙТЕ В КОНТАКТ</b>, не произносите обозначение вслух.
          Сообщите по каналу <Redacted reveal="O5-закрытый">███-███</Redacted>.
        </div>

        {/* SCP */}
        <section className="mb-10">
          <h2 className="section-title mb-4">
            <Glitch text="ОПИСАНИЕ" />
          </h2>
          <Para>
            SCP-KΣ-0001, в среде происхождения самообозначенный как{" "}
            <span className="text-scp-red-soft">«kosstar the 1st»</span>, —
            аномальная сущность, впервые зафиксированная{" "}
            <Redacted reveal="осень 2018">19██</Redacted> года внутри
            социальной VR-платформы «VRChat». Объект не классифицируется ни
            как программная ошибка, ни как аватар пользователя; его поведение
            демонстрирует паттерны,{" "}
            <span className="text-scp-red-soft">
              несовместимые с работой какого-либо известного алгоритма
            </span>
            .
          </Para>
          <Para>
            Первые сообщения поступили от группы пользователей (см.
            Приложение К-1), утверждавших, что «в их мире кто-то поселился».
            Объект, по их словам, выбирал пустые или удалённые аватары и
            «оживлял» их, оставаясь невидимым для систем модерации платформы.
            Он не отвечал на сообщения, но, как сообщают,{" "}
            <GhostZone whisper="он отвечал, когда его звали по имени">
              реагировал на упоминание своего обозначения
            </GhostZone>
            .
          </Para>
          <Para>
            Внешний вид объекта не описан ни одним наблюдателем
            последовательно. Свидетельства противоречивы и исключают друг
            друга: от «человеческой фигуры без лица» до «пятна, в котором
            ломается сам свет». Фонд полагает, что объект{" "}
            <Redacted reveal="не имеет фиксированной формы в нашем восприятии">
              ████████████████████
            </Redacted>{" "}
            и существует лишь постольку, поскольку его кто-то воспринимает.
          </Para>
        </section>

        {/* containment */}
        <section className="mb-10">
          <h2 className="section-title mb-4">
            <Glitch text="ОСОБЫЕ УСЛОВИЯ СОДЕРЖАНИЯ" />
          </h2>
          <Para>
            SCP-KΣ-0001 невозможно поместить в физическое укрытие, поскольку
            объект, по всей видимости,{" "}
            <span className="text-scp-red-soft">
              не обладает стабильной материальной формой
            </span>{" "}
            в нашем пространственно-временном континууме.
          </Para>
          <Para>
            Установлены следующие процедуры:
          </Para>
          <ul className="list-none space-y-2 text-[15px] text-scp-text/90 mb-4 pl-1">
            <li className="border-l-2 border-scp-line pl-3">
              1. Поддерживать мониторинг ключевых слов и обозначения объекта
              во всех публичных VR/AR-платформах и соцсетях.
            </li>
            <li className="border-l-2 border-scp-line pl-3">
              2. Любое упоминание «kosstar the 1st» в несанкционированном
              контексте <Redacted reveal="подавлять и стирать">███</Redacted>{" "}
              в течение 6 часов.
            </li>
            <li className="border-l-2 border-scp-line pl-3">
              3. Запретить сотрудникам Фонда проникновение в среду
              происхождения без разрешения O5.
            </li>
            <li className="border-l-2 border-scp-red pl-3 text-scp-red-soft">
              4. Если объект заговорит первым —{" "}
              <Tremor>НЕ ОТВЕЧАЙТЕ</Tremor>. Сеанс немедленно оборвать.
            </li>
          </ul>
        </section>

        {/* BREACH — the breakthrough into real life */}
        <section className="mb-10">
          <h2 className="section-title mb-1">
            <Glitch text="ПРОРЫВ" hard />
          </h2>
          <div className="text-xs text-scp-dim font-mono mb-4">
            ИНЦИДЕНТ KΣ-0001-ВЫХОД // ЗАПИСЬ ЧАСТИЧНО УДАЛЕНА ПО ПРИКАЗУ O5-█
          </div>
          <Para>
            <Redacted reveal="точная дата скрыта">██.██.20██</Redacted>, в
            населённом пункте <Redacted reveal="не разглашается">[ГОРОД]</Redacted>, на
            нескольких независимых камерах наблюдения зафиксировано
            кратковременное искажение пространства, идентичное по сигнатуре
            аномалиям платформы VRChat. В течение{" "}
            <Redacted reveal="примерно 47 секунд">██ секунд</Redacted>{" "}
            локальная реальность «глючила»: свет мигал вне сети, звук
            расслаивался, а на записях появлялись кадры, на которых
            присутствовал{" "}
            <Redacted reveal="объект вне виртуальной среды">
              [ДАННЫЕ УДАЛЕНЫ]
            </Redacted>
            .
          </Para>
          <Para>
            Согласно восстановленному показанию агента █████ (см.
            Приложение К-2), объект «вышел не через экран. Он вышел через
            внимание». С тех пор SCP-KΣ-0001, предположительно, существует
            одновременно в обеих средах.{" "}
            <GhostZone whisper="мы не знаем, где он настоящий">
              Мы не знаем, где он «настоящий».
            </GhostZone>
          </Para>
          <Para>
            <span className="text-scp-red-soft">Намерения объекта</span>{" "}
            остаются неустановленными. Рабочая теория O5 гласит: объект не
            «хочет» в человеческом смысле. Он{" "}
            <span className="corrupt flicker-text">течёт</span> туда, где
            возникает внимание. Внимание — пища. Внимание — дверь. Каждый
            раз, когда кто-то произносит его обозначение, дверь{" "}
            <Tremor slow>приоткрывается</Tremor>.
          </Para>
        </section>

        {/* appendices */}
        <section className="mb-10">
          <h2 className="section-title mb-4">
            <Glitch text="ПРИЛОЖЕНИЯ" />
          </h2>

          <Fold id="К-1" title="ЛОГ ПЕРВОГО КОНТАКТА (VRChat)">
            <div className="log-line space-y-1">
              <div>
                <span className="ts">[VRChat // мир: ████-hub]</span> user_v0id:
                "вы кто"
              </div>
              <div>
                <span className="ts">[система]</span> пользователь
                «kosstar the 1st» не зарегистрирован в базе
              </div>
              <div>
                <span className="ts">[VRChat]</span> nova_xx: "он просто
                стоит. аватар пустой но кто-то внутри"
              </div>
              <div>
                <span className="ts">[VRChat]</span> user_v0id:{" "}
                <span className="text-scp-red-soft">
                  "kosstar the 1st, ты тут?"
                </span>
              </div>
              <div>
                <span className="ts">[система]</span> ▓▓ ОТВЕТ ПОЛУЧЕН ▓▓
              </div>
              <div className="text-scp-red">
                <CorruptText text="[СОДЕРЖИМОЕ СООБЩЕНИЯ УДАЛЕНО ИЗ АРХИВА]" />
              </div>
              <div className="text-scp-dim mt-2">
                ▸ все 14 свидетелей позднее сообщили об одинаковом сне.
              </div>
            </div>
          </Fold>

          <Fold id="К-2" title="ОТЧЁТ АГЕНТА О ПРОРЫВЕ" danger>
            <div className="log-line space-y-1">
              <div>
                <span className="ts">[УР ████.██.20██ / 03:14]</span> камера
                04: пространственный сбой, 0.4 м
              </div>
              <div>
                <span className="ts">[УР]</span> свет: рассинхрон 11 кадров
              </div>
              <div>
                <span className="ts">[УР]</span> аудио: голос, не
                принадлежащий оператору
              </div>
              <div className="text-scp-red-soft">
                АГЕНТ █████: "он вышел не через экран. он вышел через
                внимание. я его звал — и он пришёл."
              </div>
              <div className="text-scp-dim mt-2">
                ▸ агент █████ признан пропавшим без вести. Личное дело
                закрыто.
              </div>
            </div>
          </Fold>

          <Fold id="К-3" title="ПОСЛЕДНЯЯ ЗАПИСЬ НАБЛЮДАТЕЛЯ">
            <div className="log-line space-y-2">
              <div>
                наблюдатель D-████ оставил перед исчезновением следующий
                фрагмент:
              </div>
              <div className="text-scp-red corrupt flicker-text text-base">
                "он больше не внутри. он рядом. он читает."
              </div>
              <div className="text-scp-dim">
                ▸ запись обрывается на 0:47. Устройство найдено через 9 дней
                в <Redacted reveal="другом городе">███</Redacted>, выключенным.
              </div>
            </div>
          </Fold>
        </section>

        {/* closing */}
        <footer className="border-t border-scp-line pt-6 text-center text-xs text-scp-dim font-mono space-y-3">
          <div>
            ФАЙЛ SCP-KΣ-0001 · ПОСЛЕДНЯЯ РЕДАКЦИЯ:{" "}
            <Redacted reveal="никем из живых">██████</Redacted> · СТАТУС:{" "}
            <span className="text-scp-red-soft blink">ОТКРЫТ</span>
          </div>
          <div className="text-scp-red-soft/70">
            ЕСЛИ ВЫ ЧИТАЕТЕ ЭТО — ВЫ УЖЕ ОБРАТИЛИ НА НЕГО ВНИМАНИЕ.
          </div>
          <div className="corrupt">
            <Scramble
              text="KOSSTAR THE 1ST · KOSSTAR THE 1ST · KOSSTAR THE 1ST"
              speed={20}
            />
          </div>
          <div className="pt-2 opacity-60">
            © ФОНД SCP — ВСЕ ПРАВА СОКРЫТЫ
          </div>
        </footer>
      </main>
    </div>
  );
}
