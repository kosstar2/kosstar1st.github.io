import { useEffect, useRef, useState, type ReactNode } from "react";

const GLYPHS =
  "█▓▒░<>/\\|¦=+*#@%&$АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789";

/** Glitch text with RGB split. Pass text via `text` (used for data-text). */
export function Glitch({
  text,
  className = "",
  hard = false,
}: {
  text: string;
  className?: string;
  hard?: boolean;
}) {
  return (
    <span
      className={`glitch ${hard ? "glitch-hard" : ""} ${className}`}
      data-text={text}
    >
      {text}
    </span>
  );
}

/** Text that subtly shakes. */
export function Tremor({
  children,
  className = "",
  slow = false,
}: {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}) {
  return (
    <span className={`${slow ? "tremor-slow" : "tremor"} ${className}`}>
      {children}
    </span>
  );
}

/** Blacked-out redaction that reveals a hidden whisper on hover. */
export function Redacted({
  reveal,
  children,
  className = "",
}: {
  reveal?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`redacted ${className}`}
      title={reveal ? `// дешифровано: ${reveal}` : "// данные удалены"}
    >
      {children ?? "████████"}
    </span>
  );
}

/** Scrambles through glyphs then resolves to the final text. */
export function Scramble({
  text,
  className = "",
  speed = 34,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    let revealed = 0;
    const total = text.length;
    setDisplay(text.replace(/[^ ]/g, "█"));

    const tick = (t: number) => {
      if (start === null) start = t;
      if (t - start < startDelay) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      let out = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (i < revealed || ch === " ") out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if ((t | 0) % speed < 16 && Math.random() > 0.35)
        revealed = Math.min(total, revealed + 1);
      if (revealed < total) raf.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, speed, startDelay]);

  return <span className={className}>{display}</span>;
}

/** Continuously glitching corrupted string. */
export function CorruptText({
  text,
  className = "",
  interval = 120,
}: {
  text: string;
  className?: string;
  interval?: number;
}) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const id = setInterval(() => {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") out += " ";
        else if (Math.random() > 0.78)
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else out += text[i];
      }
      setDisplay(out);
    }, interval);
    return () => clearInterval(id);
  }, [text, interval]);
  return <span className={`corrupt ${className}`}>{display}</span>;
}

/** A region that whispers a hidden message when hovered. */
export function GhostZone({
  whisper,
  children,
  className = "",
}: {
  whisper: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`ghost-zone ${className}`}>
      {children}
      <span className="ghost-text block text-sm mt-1">{whisper}</span>
    </span>
  );
}
