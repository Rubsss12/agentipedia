"use client";

import { useEffect, useRef } from "react";
import { LAND_B64 } from "@/lib/land";
import type { GlobeMarker } from "@/lib/geo";

// Orthographic canvas globe, zero dependencies. Land is a dot-cloud; each
// marker is a country with its deployment count. Auto-rotates when idle,
// drag to spin, hover for a tooltip, click to filter the index by country
// (dispatches "agentipedia:country", which Explorer listens for).
export default function Globe({ markers }: { markers: GlobeMarker[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const tip = tipRef.current!;
    const ctx = canvas.getContext("2d")!;

    // ---- decode land points into unit vectors (X=coslat·coslon, Y=coslat·sinlon, Z=sinlat)
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
    const mks = markers.map((m) => {
      const la = m.lat * D2R, lo = m.lon * D2R;
      return {
        ...m,
        X: Math.cos(la) * Math.cos(lo),
        Y: Math.cos(la) * Math.sin(lo),
        Z: Math.sin(la),
        sx: 0, sy: 0, r: 0, visible: false,
      };
    });
    const maxCount = Math.max(...markers.map((m) => m.count), 1);

    // ---- view state
    let lam = -25 * D2R;   // center longitude (Atlantic view: Americas + Europe + Africa)
    let phi = 16 * D2R;    // center latitude
    let vLam = 0;          // drag inertia
    let W = 0, H = 0, DPR = 1, R = 0, CX = 0, CY = 0;
    let dragging = false, lastX = 0, lastY = 0, lastInteract = 0, moved = 0;
    let hover: (typeof mks)[number] | null = null;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.width; // square
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.height = `${H}px`;
      R = W * 0.46; CX = W / 2; CY = H / 2;
    }

    function draw(now: number) {
      if (!dragging && !reduced && now - lastInteract > 3500) lam += 0.0011;
      lam += vLam;
      vLam *= 0.94;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // sphere ground + rim
      const g = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.1, CX, CY, R * 1.05);
      g.addColorStop(0, "#2b1a72");
      g.addColorStop(0.55, "#1d1160");
      g.addColorStop(1, "#12093f");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      // magenta bloom top-right, echoing the hero
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

      // land dots
      ctx.fillStyle = "rgba(185,196,255,0.8)";
      for (let i = 0; i < nLand; i++) {
        const X = land[i * 3], Y = land[i * 3 + 1], Z = land[i * 3 + 2];
        const T = X * cosL + Y * sinL;
        const depth = sinP * Z + cosP * T;
        if (depth <= 0.02) continue;
        const sx = Y * cosL - X * sinL;
        const sy = cosP * Z - sinP * T;
        const a = 0.16 + depth * 0.5;
        ctx.globalAlpha = a;
        const px = CX + sx * R, py = CY - sy * R;
        ctx.fillRect(px, py, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;

      // markers
      for (const m of mks) {
        const T = m.X * cosL + m.Y * sinL;
        const depth = sinP * m.Z + cosP * T;
        m.visible = depth > 0.04;
        if (!m.visible) continue;
        const sx = m.Y * cosL - m.X * sinL;
        const sy = cosP * m.Z - sinP * T;
        const px = CX + sx * R, py = CY - sy * R;
        const r = 3 + Math.sqrt(m.count / maxCount) * 11;
        m.sx = px; m.sy = py; m.r = r;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 2.4);
        glow.addColorStop(0, "rgba(230,46,200,0.5)");
        glow.addColorStop(1, "rgba(230,46,200,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = hover === m ? "#ffffff" : "rgba(255,255,255,0.92)";
        ctx.fill();
        ctx.strokeStyle = "rgba(230,46,200,0.9)";
        ctx.lineWidth = hover === m ? 2.5 : 1.5;
        ctx.stroke();
        if (r >= 8) {
          ctx.fillStyle = "#241468";
          ctx.font = `800 ${Math.max(9, r * 0.95)}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(m.count), px, py + 0.5);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function pick(x: number, y: number) {
      let best: (typeof mks)[number] | null = null;
      let bd = 1e9;
      for (const m of mks) {
        if (!m.visible) continue;
        const d = Math.hypot(m.sx - x, m.sy - y);
        if (d < Math.max(14, m.r + 6) && d < bd) { bd = d; best = m; }
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
        phi += dy * k;
        phi = Math.max(-1.25, Math.min(1.25, phi));
        lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now();
        tip.style.opacity = "0";
        return;
      }
      const m = pick(x, y);
      hover = m;
      canvas.style.cursor = m ? "pointer" : "grab";
      if (m) {
        tip.style.opacity = "1";
        tip.style.left = `${m.sx}px`;
        tip.style.top = `${m.sy - m.r - 12}px`;
        tip.innerHTML =
          `<b>${m.country}</b> · ${m.count} ` +
          `<span class="lang-en">deployment${m.count > 1 ? "s" : ""} — click to filter</span>` +
          `<span class="lang-fr">déploiement${m.count > 1 ? "s" : ""} — cliquer pour filtrer</span>`;
      } else {
        tip.style.opacity = "0";
      }
    }
    function onPointerUp(e: PointerEvent) {
      dragging = false;
      lastInteract = performance.now();
      if (moved < 6) {
        const rect = canvas.getBoundingClientRect();
        const m = pick(e.clientX - rect.left, e.clientY - rect.top);
        if (m) {
          window.dispatchEvent(new CustomEvent("agentipedia:country", { detail: m.country }));
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
