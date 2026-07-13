"use client";

import { useEffect, useState } from "react";

export default function ToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      aria-label="Back to top / Retour en haut"
      onClick={() => window.scrollTo({ top: 0 })}
      className={`to-top grid h-11 w-11 place-items-center rounded-full text-lg font-black text-white shadow-lg ${show ? "show" : ""}`}
      style={{ background: "linear-gradient(135deg, #2439e0 0%, #6b2bd9 55%, #c62ecf 100%)" }}
    >
      ↑
    </button>
  );
}
