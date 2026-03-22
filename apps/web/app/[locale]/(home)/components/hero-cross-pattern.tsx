"use client";

import { useEffect, useRef } from "react";

export const HeroCrossPattern = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match the original SVG pattern grid
    const GRID = 30;
    const OFFSET_X = 6;
    const OFFSET_Y = 4;
    const ARM = 3; // half-length of each cross arm in px
    const BASE_ALPHA = 0.06;
    const HOVER_ALPHA = 0.3;
    const HOVER_SCALE = 2.5;
    const RADIUS = 90; // influence radius in px

    let logicalW = 0;
    let logicalH = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      ctx.clearRect(0, 0, logicalW, logicalH);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const startX = OFFSET_X % GRID;
      const startY = OFFSET_Y % GRID;

      for (let x = startX; x < logicalW + GRID; x += GRID) {
        for (let y = startY; y < logicalH + GRID; y += GRID) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / RADIUS);

          const alpha = BASE_ALPHA + (HOVER_ALPHA - BASE_ALPHA) * t;
          const scale = 1 + (HOVER_SCALE - 1) * t;

          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          ctx.strokeStyle = `rgba(44, 35, 26, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "square";
          ctx.beginPath();
          ctx.moveTo(0, -ARM);
          ctx.lineTo(0, ARM);
          ctx.moveTo(-ARM, 0);
          ctx.lineTo(ARM, 0);
          ctx.stroke();
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    resize();
    draw();

    const hero = canvas.parentElement;
    hero?.addEventListener("mousemove", handleMouseMove);
    hero?.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      hero?.removeEventListener("mousemove", handleMouseMove);
      hero?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};
