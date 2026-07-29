"use client";

import { usePathname } from "next/navigation";

// The optional login page at "/login" is full-screen: no app chrome. This thin
// client gate hides its children on "/login" only. Header/Footer stay
// server-rendered (they read the store), passed in as children — so no
// server-only code leaks into the client bundle.
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  return usePathname() === "/login" ? null : <>{children}</>;
}
