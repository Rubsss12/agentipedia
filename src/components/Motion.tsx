"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Site-wide motion runtime: scroll reveals for [data-reveal] and count-up
// animation for [data-count]. No-ops entirely when the visitor prefers
// reduced motion.
//
// This lives in the root layout, which does NOT remount on client-side
// navigation. Scanning the DOM once at first load therefore missed every page
// reached by a link afterwards: arriving on "/#index" from a fiche left the
// sectors and the CODA map at opacity 0 for good. So the scan re-runs on every
// route change, and a MutationObserver picks up anything mounted later (the
// new page streaming in, the index paginating).
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const showAll = () =>
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("in"));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target) || el.dataset.counted) return;
      el.dataset.counted = "1";
      const t0 = performance.now();
      const dur = 1300;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (hits) => {
        for (const h of hits) {
          if (!h.isIntersecting) continue;
          const el = h.target as HTMLElement;
          el.classList.add("in");
          if (el.dataset.count) countUp(el);
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    const SELECTOR = "[data-reveal]:not(.in), [data-count]:not([data-counted])";
    const watch = (root: ParentNode) => root.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    watch(document);

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches(SELECTOR)) io.observe(n);
          watch(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
