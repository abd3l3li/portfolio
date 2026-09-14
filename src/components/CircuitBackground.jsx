import { useEffect, useRef } from 'react';

const CELL = 46;
const DOT_R = 1.3;
const SIGNAL_COUNT = 24;

export default function CircuitBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, cols, rows, nodes, signals;
    let raf;

    function build() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      nodes = [];
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
      signals = Array.from({ length: SIGNAL_COUNT }, () => ({
        x: Math.floor(Math.random() * (cols - 1)) * CELL,
        y: Math.floor(Math.random() * (rows - 1)) * CELL,
        horizontal: Math.random() > 0.5,
        offset: Math.random() * CELL,
        speed: 0.035 + Math.random() * 0.035,
        trail: 7 + Math.random() * 8,
      }));
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.10)';
      ctx.lineWidth = 1;
      for (const n of nodes) {
        if (Math.random() < 0.5) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n.x + CELL, n.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, DOT_R, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawFrame(t) {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.07)';
      ctx.lineWidth = 1;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n.x + CELL, n.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n.x, n.y + CELL);
        ctx.stroke();
      }

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
        const distance = (signal.offset + t * signal.speed) % CELL;
        const position = signal.horizontal ? signal.x + distance : signal.y + distance;
        const start = position - signal.trail;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.18)';
        ctx.lineWidth = 1.5;
        if (signal.horizontal) {
          ctx.moveTo(start, signal.y);
          ctx.lineTo(position, signal.y);
        } else {
          ctx.moveTo(signal.x, start);
          ctx.lineTo(signal.x, position);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(103, 232, 249, 0.8)';
        ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        ctx.shadowBlur = 5;
        if (signal.horizontal) {
          ctx.arc(position, signal.y, 1.4, 0, Math.PI * 2);
        } else {
          ctx.arc(signal.x, position, 1.4, 0, Math.PI * 2);
        }
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
