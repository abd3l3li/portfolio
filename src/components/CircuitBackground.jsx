import { useEffect, useRef } from 'react';

const CELL = 46;
const DOT_R = 1.3;
const MAX_SIGNALS = 26;

export default function CircuitBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, cols, rows, nodes, lines, signals, gridCanvas;
    let raf;
    let previousTime = 0;

    function resetSignal(signal, initial = false) {
      signal.line = lines[Math.floor(Math.random() * lines.length)];
      signal.direction = Math.random() > 0.5 ? 1 : -1;
      signal.progress = initial ? Math.random() : 0;
      signal.speed = 22 + Math.random() * 34;
      signal.trail = 8 + Math.random() * 10;
      signal.active = initial;
      signal.wait = initial ? 0 : 0.45 + Math.random() * 2.2;
    }

    function build() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      nodes = [];
      lines = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // sparse: only some intersections are active nodes
          if (Math.random() < 0.16) {
            nodes.push({
              x: x * CELL,
              y: y * CELL,
              phase: Math.random() * Math.PI * 2,
              speed: 0.4 + Math.random() * 0.6,
            });
          }
        }
      }

      for (const node of nodes) {
        if (node.x + CELL <= width + CELL) {
          lines.push({ x1: node.x, y1: node.y, x2: node.x + CELL, y2: node.y });
        }
        if (node.y + CELL <= height + CELL) {
          lines.push({ x1: node.x, y1: node.y, x2: node.x, y2: node.y + CELL });
        }
      }

      gridCanvas = document.createElement('canvas');
      gridCanvas.width = width;
      gridCanvas.height = height;
      const gridCtx = gridCanvas.getContext('2d');
      gridCtx.strokeStyle = 'rgba(124, 58, 237, 0.07)';
      gridCtx.lineWidth = 1;
      for (const line of lines) {
        gridCtx.beginPath();
        gridCtx.moveTo(line.x1, line.y1);
        gridCtx.lineTo(line.x2, line.y2);
        gridCtx.stroke();
      }

      const signalCount = Math.min(MAX_SIGNALS, Math.max(8, Math.floor((cols * rows) / 85)));
      signals = Array.from({ length: signalCount }, (_, index) => {
        const signal = {
          line: null,
          direction: 1,
          progress: 0,
          speed: 0,
          trail: 0,
          active: false,
          wait: 0,
          cyan: index < Math.max(2, Math.floor(signalCount * 0.16)),
        };
        resetSignal(signal, true);
        return signal;
      });
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(gridCanvas, 0, 0);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, DOT_R, 0, Math.PI * 2);
        ctx.fill();
      }

    }

    function drawFrame(t) {
      const delta = previousTime ? Math.min((t - previousTime) / 1000, 0.05) : 0;
      previousTime = t;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(gridCanvas, 0, 0);

      for (const n of nodes) {
        const pulse = (Math.sin(t * 0.0006 * n.speed + n.phase) + 1) / 2;
        const alpha = 0.12 + pulse * 0.35;
        const r = DOT_R + pulse * 1.1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const signal of signals) {
        if (!signal.active) {
          signal.wait -= delta;
          if (signal.wait <= 0) resetSignal(signal, true);
          continue;
        }

        const line = signal.line;
        const lineLength = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
        signal.progress += (signal.speed * delta) / lineLength;
        if (signal.progress >= 1) {
          resetSignal(signal);
          continue;
        }

        const travel = signal.direction === 1 ? signal.progress : 1 - signal.progress;
        const tailDistance = signal.trail / lineLength;
        const tail = Math.max(0, Math.min(1, travel - signal.direction * tailDistance));
        const x = line.x1 + (line.x2 - line.x1) * travel;
        const y = line.y1 + (line.y2 - line.y1) * travel;
        const tailX = line.x1 + (line.x2 - line.x1) * tail;
        const tailY = line.y1 + (line.y2 - line.y1) * tail;
        const edgeFade = Math.min(1, signal.progress * 8, (1 - signal.progress) * 8);
        const color = signal.cyan ? '34, 211, 238' : '168, 85, 247';

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color}, ${0.08 * edgeFade})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${0.28 * edgeFade})`;
        ctx.shadowColor = `rgba(${color}, 0.4)`;
        ctx.shadowBlur = 4;
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(drawFrame);
    }

    build();
    if (reduceMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(drawFrame);
    }

    function onResize() {
      build();
      previousTime = 0;
      if (reduceMotion) drawStatic();
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="circuit-bg" aria-hidden="true" />;
}
