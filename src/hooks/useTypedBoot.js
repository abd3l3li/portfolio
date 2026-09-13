import { useEffect, useState } from 'react';

/**
 * Types out a scripted terminal boot sequence, one character at a time.
 * lines: [{ type: 'cmd' | 'out', text: string }]
 */
export function useTypedBoot(lines, { speed = 26, lineDelay = 320, startDelay = 500 } = {}) {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [lineIndex, setLineIndex] = useState(reduceMotion ? lines.length : 0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    if (lineIndex >= lines.length) {
      setDone(true);
      return;
    }
    const current = lines[lineIndex];
    const target = current.text;
    const isCmd = current.type === 'cmd';

    if (charIndex < target.length) {
      const delay =
        lineIndex === 0 && charIndex === 0 ? startDelay : isCmd ? speed : speed * 0.45;
      const t = setTimeout(() => setCharIndex((c) => c + 1), delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, lineDelay);
    return () => clearTimeout(t);
  }, [lineIndex, charIndex, lines, speed, lineDelay, startDelay, reduceMotion]);

  const displayed = lines.slice(0, lineIndex);
  const current =
    lineIndex < lines.length
      ? { ...lines[lineIndex], text: lines[lineIndex].text.slice(0, charIndex) }
      : null;

  return { displayed, current, done };
}
