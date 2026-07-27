"use client";

import { usePathname } from "next/navigation";

// The login front door at "/" is full-screen: no app chrome. This thin client
// gate hides its children on "/" only. Header/Footer stay server-rendered (they
// read the store), passed in as children — so no server-only code leaks into
// the client bundle.
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
