"use client";

import { useEffect, useRef } from "react";

interface PlexusEffectProps {
  /** RGB triplet for dots/lines. */
  color?: string;
  /** Max distance (px) at which two points are linked. */
  maxDist?: number;
  /** Larger = fewer points (one point per ~density px²). */
  density?: number;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Animated "plexus" network: points drift and bounce inside the canvas, linking
 * with thin lines as they come close — the moving constellation behind the
 * spotlight names. Pure canvas, transparent background (sits over artwork).
 */
export default function PlexusEffect({
  color = "255,255,255",
  maxDist = 130,
  density = 5500,
}: PlexusEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let points: Point[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(240, Math.max(50, Math.round((w * h) / density)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() * 2 - 1) * 0.3,
        vy: (Math.random() * 2 - 1) * 0.3,
      }));
    };
    seed();

    const ro = new ResizeObserver(seed);
    ro.observe(canvas);

    // Pause the animation loop while the board is scrolled out of view.
    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const tick = () => {
      if (!visible) { raf = 0; return; }
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= w) p.vx = -p.vx;
        if (p.y <= 0 || p.y >= h) p.vy = -p.vy;
      }

      // Links
      ctx.lineWidth = 0.6;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(${color},${(1 - dist / maxDist) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      ctx.fillStyle = `rgba(${color},0.85)`;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [color, maxDist, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
