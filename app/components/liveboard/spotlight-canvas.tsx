"use client";

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import type { SpotlightNode } from "@/app/lib/liveboard/types";

interface SpotlightCanvasProps {
  nodes: SpotlightNode[];
  onNodeClick: (node: SpotlightNode) => void;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface TooltipState {
  node: SpotlightNode;
  px: number;
  py: number;
}

interface Motion {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const DEFAULT_TRANSFORM: Transform = { x: 0, y: 0, scale: 1 };
const HOVER_COLOR = "#F17676";
const DEFAULT_FONT_SIZE = 12; // px — names default size
const HOVER_FONT_SIZE = 17; // px — name grows on hover
const DRIFT_SPEED = 0.25; // px per frame — names wander slowly

export default function SpotlightCanvas({ nodes, onNodeClick }: SpotlightCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const motionRef = useRef<Motion[]>([]);
  const hoveredIndexRef = useRef<number>(-1); // index paused while hovered

  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const dragStart = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null);

  // ---- Wheel zoom ----
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * delta)),
    }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ---- Auto-move: each name drifts and bounces inside the board, "lộn xộn".
  // Positions are mutated directly on the DOM each frame (refs, no re-render).
  // A hovered name is paused so it can be read/clicked. Re-inits on resize
  // (e.g. when the board is expanded to fullscreen).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let w = 0;
    let h = 0;

    const seed = (resetVelocity: boolean) => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      motionRef.current = nodes.map((n, i) => {
        const prev = motionRef.current[i];
        return {
          x: (n.x / 100) * w,
          y: (n.y / 100) * h,
          vx: resetVelocity || !prev ? (Math.random() * 2 - 1) * DRIFT_SPEED : prev.vx,
          vy: resetVelocity || !prev ? (Math.random() * 2 - 1) * DRIFT_SPEED : prev.vy,
        };
      });
    };
    seed(true);

    const ro = new ResizeObserver(() => seed(false));
    ro.observe(el);

    // Pause drifting while the board is scrolled out of view.
    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { threshold: 0 }
    );
    io.observe(el);

    const tick = () => {
      if (!visible) { raf = 0; return; }
      const m = motionRef.current;
      for (let i = 0; i < m.length; i++) {
        const p = m[i];
        if (i !== hoveredIndexRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x <= 0) { p.x = 0; p.vx = -p.vx; }
          else if (p.x >= w) { p.x = w; p.vx = -p.vx; }
          if (p.y <= 0) { p.y = 0; p.vy = -p.vy; }
          else if (p.y >= h) { p.y = h; p.vy = -p.vy; }
        }
        const span = spanRefs.current[i];
        if (span) {
          span.style.transform = `translate(calc(${p.x}px - 50%), calc(${p.y}px - 50%))`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [nodes]);

  // ---- Pointer pan (only on empty canvas, not on a name) ----
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.node) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { px: e.clientX, py: e.clientY, tx: transform.x, ty: transform.y };
    setIsPanning(true);
    setTooltip(null);
  }, [transform]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.px;
    const dy = e.clientY - dragStart.current.py;
    setTransform((prev) => ({
      ...prev,
      x: dragStart.current!.tx + dx,
      y: dragStart.current!.ty + dy,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
    setIsPanning(false);
  }, []);

  const updateTooltip = useCallback((node: SpotlightNode, e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ node, px: e.clientX - rect.left, py: e.clientY - rect.top });
  }, []);

  const handleNodeEnter = useCallback((node: SpotlightNode, index: number, e: React.MouseEvent<HTMLSpanElement>) => {
    hoveredIndexRef.current = index;
    setHoveredId(node.id);
    updateTooltip(node, e);
  }, [updateTooltip]);

  const handleNodeLeave = useCallback(() => {
    hoveredIndexRef.current = -1;
    setHoveredId(null);
    setTooltip(null);
  }, []);

  const handleNodeClick = useCallback((node: SpotlightNode, e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    onNodeClick(node);
  }, [onNodeClick]);

  const canvasCursor = isPanning ? "grabbing" : "grab";

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        cursor: canvasCursor,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Inner panning/zooming surface */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {nodes.map((node, i) => {
          const isHovered = hoveredId === node.id;
          return (
            <span
              key={node.id}
              ref={(el) => { spanRefs.current[i] = el; }}
              data-node="true"
              onClick={(e) => handleNodeClick(node, e)}
              onMouseEnter={(e) => handleNodeEnter(node, i, e)}
              onMouseLeave={handleNodeLeave}
              onMouseMove={(e) => updateTooltip(node, e)}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                fontSize: `${isHovered ? HOVER_FONT_SIZE : DEFAULT_FONT_SIZE}px`,
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                color: isHovered ? HOVER_COLOR : "#FFFFFF",
                whiteSpace: "nowrap",
                cursor: "pointer",
                lineHeight: 1.2,
                willChange: "transform",
                transition: "color 120ms ease, font-size 120ms ease",
              }}
            >
              {node.name}
            </span>
          );
        })}
      </div>

      {/* Tooltip — rendered outside the transform div, in canvas coords */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.px + 12,
            top: tooltip.py - 8,
            backgroundColor: "#00070C",
            border: "1px solid #FFEA9E",
            borderRadius: "6px",
            padding: "6px 10px",
            pointerEvents: "none",
            zIndex: 50,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#FFFFFF", fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 600 }}>
            {tooltip.node.name}
          </span>
          <span style={{ color: "#FFEA9E", fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 400, marginLeft: 6 }}>
            {tooltip.node.kudosCount} kudos
          </span>
        </div>
      )}
    </div>
  );
}
