"use client";

import { useEffect, useRef } from "react";
import { LAND_B64 } from "@/lib/land";
import type { GlobeMarker } from "@/lib/geo";

// Orthographic canvas globe, zero dependencies. Land is a dot-cloud; each
// place carries up to two dots: magenta for named agents, coral for the
// unnamed collection. Auto-rotates when idle, drag to spin, hover for a
// tooltip, click to filter the index (dispatches "agentipedia:country" with
// {key, value}, which Explorer listens for).
const NAMED_RING = "rgba(230,46,200,0.9)";
const NAMED_GLOW = "rgba(230,46,200,0.5)";
const UNNAMED_RING = "rgba(242,118,79,0.95)";
const UNNAMED_GLOW = "rgba(242,118,79,0.55)";

type Dot = {
  place: string;
  filterKey: "country" | "region";
  kind: "named" | "unnamed";
  count: number;
  X: number; Y: number; Z: number;
  sx: number; sy: number; r: number;
  visible: boolean;
};

export default function Globe({ markers }: { markers: GlobeMarker[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const tip = tipRef.current!;
    const ctx = canvas.getContext("2d")!;

    // ---- decode land points into unit vectors
    const raw = atob(LAND_B64);
    const buf = new ArrayBuffer(raw.length);
    const u8 = new Uint8Array(buf);
    for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);
    const i16 = new Int16Array(buf);
    const nLand = i16.length / 2;
    const land = new Float32Array(nLand * 3);
    const D2R = Math.PI / 180;
    for (let i = 0; i < nLand; i++) {
      const la = (i16[i * 2] / 10) * D2R;
      const lo = (i16[i * 2 + 1] / 10) * D2R;
      land[i * 3] = Math.cos(la) * Math.cos(lo);
      land[i * 3 + 1] = Math.cos(la) * Math.sin(lo);
      land[i * 3 + 2] = Math.sin(la);
    }

    // ---- build dots: one per place per collection; offset the unnamed dot
    // when the place also has named agents so both stay visible.
    const maxNamed = Math.max(...markers.map((m) => m.named), 1);
    const maxUnnamed = Math.max(...markers.map((m) => m.unnamed), 1);
    const dots: Dot[] = [];
    const toVec = (lat: number, lon: number) => {
      const la = lat * D2R, lo = lon * D2R;
      return { X: Math.cos(la) * Math.cos(lo), Y: Math.cos(la) * Math.sin(lo), Z: Math.sin(la) };
    };
    for (const m of markers) {
      if (m.named > 0) {
        dots.push({
          place: m.place, filterKey: m.filterKey, kind: "named", count: m.named,
          ...toVec(m.lat, m.lon), sx: 0, sy: 0, r: 0, visible: false,
        });
      }
      if (m.unnamed > 0) {
        const off = m.named > 0;
        dots.push({
          place: m.place, filterKey: m.filterKey, kind: "unnamed", count: m.unnamed,
          ...toVec(m.lat - (off ? 4.5 : 0), m.lon + (off ? 7 : 0)), sx: 0, sy: 0, r: 0, visible: false,
        });
      }
    }

    // ---- view state
    let lam = -25 * D2R;
    let phi = 16 * D2R;
    let vLam = 0;
    let W = 0, H = 0, DPR = 1, R = 0, CX = 0, CY = 0;
    let dragging = false, lastX = 0, lastY = 0, lastInteract = 0, moved = 0;
    let hover: Dot | null = null;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.width;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.height = `${H}px`;
      R = W * 0.46; CX = W / 2; CY = H / 2;
    }

    function drawDot(d: Dot, px: number, py: number, r: number) {
      const ring = d.kind === "named" ? NAMED_RING : UNNAMED_RING;
      const glowC = d.kind === "named" ? NAMED_GLOW : UNNAMED_GLOW;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 2.4);
      glow.addColorStop(0, glowC);
      glow.addColorStop(1, glowC.replace(/[\d.]+\)$/, "0)"));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = hover === d ? "#ffffff" : "rgba(255,255,255,0.92)";
      ctx.fill();
      ctx.strokeStyle = ring;
      ctx.lineWidth = hover === d ? 2.5 : 1.5;
      ctx.stroke();
      if (r >= 8) {
        ctx.fillStyle = "#241468";
        ctx.font = `800 ${Math.max(9, r * 0.95)}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(d.count), px, py + 0.5);
      }
    }

    function draw(now: number) {
      if (!dragging && !reduced && now - lastInteract > 3500) lam += 0.0011;
      lam += vLam;
      vLam *= 0.94;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const g = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.1, CX, CY, R * 1.05);
      g.addColorStop(0, "#2b1a72");
      g.addColorStop(0.55, "#1d1160");
      g.addColorStop(1, "#12093f");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      const bloom = ctx.createRadialGradient(CX + R * 0.75, CY - R * 0.75, 0, CX + R * 0.75, CY - R * 0.75, R * 1.1);
      bloom.addColorStop(0, "rgba(230,46,200,0.28)");
      bloom.addColorStop(1, "rgba(230,46,200,0)");
      ctx.save();
      ctx.clip();
      ctx.fillStyle = bloom;
      ctx.fillRect(CX - R, CY - R, R * 2, R * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(185,196,255,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const sinL = Math.sin(lam), cosL = Math.cos(lam);
      const sinP = Math.sin(phi), cosP = Math.cos(phi);

      ctx.fillStyle = "rgba(185,196,255,0.8)";
      for (let i = 0; i < nLand; i++) {
        const X = land[i * 3], Y = land[i * 3 + 1], Z = land[i * 3 + 2];
        const T = X * cosL + Y * sinL;
        const depth = sinP * Z + cosP * T;
        if (depth <= 0.02) continue;
        const sx = Y * cosL - X * sinL;
        const sy = cosP * Z - sinP * T;
        ctx.globalAlpha = 0.16 + depth * 0.5;
        ctx.fillRect(CX + sx * R, CY - sy * R, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;

      for (const d of dots) {
        const T = d.X * cosL + d.Y * sinL;
        const depth = sinP * d.Z + cosP * T;
        d.visible = depth > 0.04;
        if (!d.visible) continue;
        const px = CX + (d.Y * cosL - d.X * sinL) * R;
        const py = CY - (cosP * d.Z - sinP * T) * R;
        const r = d.kind === "named"
          ? 3 + Math.sqrt(d.count / maxNamed) * 11
          : 3 + Math.sqrt(d.count / maxUnnamed) * 7;
        d.sx = px; d.sy = py; d.r = r;
        drawDot(d, px, py, r);
      }

      raf = requestAnimationFrame(draw);
    }

    function pick(x: number, y: number) {
      let best: Dot | null = null;
      let bd = 1e9;
      for (const d of dots) {
        if (!d.visible) continue;
        const dist = Math.hypot(d.sx - x, d.sy - y);
        if (dist < Math.max(14, d.r + 6) && dist < bd) { bd = dist; best = d; }
      }
      return best;
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true; moved = 0;
      lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now();
      canvas.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (dragging) {
        const k = 1 / (R || 1);
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        lam -= dx * k;
        vLam = -dx * k * 0.35;
        phi = Math.max(-1.35, Math.min(1.35, phi + dy * k));
        lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now();
        tip.style.opacity = "0";
        return;
      }
      const d = pick(x, y);
      hover = d;
      canvas.style.cursor = d ? "pointer" : "grab";
      if (d) {
        tip.style.opacity = "1";
        tip.style.left = `${d.sx}px`;
        tip.style.top = `${d.sy - d.r - 12}px`;
        const label = d.kind === "named"
          ? `<span class="lang-en">named agent${d.count > 1 ? "s" : ""}</span><span class="lang-fr">agent${d.count > 1 ? "s" : ""} nommé${d.count > 1 ? "s" : ""}</span>`
          : `<span class="lang-en">unnamed agent${d.count > 1 ? "s" : ""}</span><span class="lang-fr">agent${d.count > 1 ? "s" : ""} sans nom</span>`;
        tip.innerHTML =
          `<b>${d.place}</b> · ${d.count} ${label} ` +
          `<span class="lang-en">· click to filter</span><span class="lang-fr">· cliquer pour filtrer</span>`;
      } else {
        tip.style.opacity = "0";
      }
    }
    function onPointerUp(e: PointerEvent) {
      dragging = false;
      lastInteract = performance.now();
      if (moved < 6) {
        const rect = canvas.getBoundingClientRect();
        const d = pick(e.clientX - rect.left, e.clientY - rect.top);
        if (d) {
          window.dispatchEvent(
            new CustomEvent("agentipedia:country", { detail: { key: d.filterKey, value: d.place } }),
          );
          document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    function onLeave() {
      hover = null;
      tip.style.opacity = "0";
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [markers]);

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[560px] select-none">
      <canvas ref={canvasRef} className="block w-full" style={{ touchAction: "none", cursor: "grab" }} />
      <div
        ref={tipRef}
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity"
        style={{ background: "rgba(13,8,54,0.92)", border: "1px solid rgba(185,196,255,0.35)" }}
      />
    </div>
  );
}
