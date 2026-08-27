"use client";

import { useEffect } from "react";

// The home page is long and reveals sections lazily (opacity 0 until scrolled
// into view). When arriving from another route with a hash — e.g. "/#offres"
// clicked from /methodology — the framework's own scroll (to top, or to an
// anchor that isn't laid out yet) can leave the target off-screen and hidden.
// We resolve the hash ourselves and re-apply the scroll a few times over ~1.5s
// so it wins after the framework's scroll and after the page reflows, while
// force-revealing the target so nothing stays invisible.
export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = decodeURIComponent(hash.slice(1));

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => n.classList.add("in"));
        if (el.hasAttribute("data-reveal")) el.classList.add("in");
        el.scrollIntoView({ block: "start", behavior: "auto" });
      }
      attempts += 1;
      if (attempts < 15) timer = setTimeout(tick, 100);
    };
    timer = setTimeout(tick, 60);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
