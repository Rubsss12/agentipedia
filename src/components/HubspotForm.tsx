"use client";

// Embeds the live HUB Institute contact form (HubSpot portal 1722292) so leads
// captured on Agentipedia land directly in the HUB Institute CRM, carrying the
// form's own fields and GDPR consent. Renders nothing extra if HubSpot is
// blocked (ad-blocker / offline): the surrounding block still shows the CTA.
import { useEffect, useRef } from "react";

const REGION = "na1";
const PORTAL_ID = "1722292";
const FORM_ID = "8b2a9fbc-886b-4f9d-a10e-8954f76b3a6a";
const TARGET_ID = "hub-contact-form";
const SCRIPT_ID = "hs-forms-embed-v2";

declare global {
  interface Window {
    hbspt?: { forms: { create: (opts: Record<string, unknown>) => void } };
  }
}

export default function HubspotForm() {
  const created = useRef(false);

  useEffect(() => {
    function create() {
      if (created.current || !window.hbspt) return;
      const target = document.getElementById(TARGET_ID);
      if (!target || target.childElementCount > 0) return;
      created.current = true;
      window.hbspt.forms.create({
        region: REGION,
        portalId: PORTAL_ID,
        formId: FORM_ID,
        target: `#${TARGET_ID}`,
      });
    }

    if (window.hbspt) {
      create();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", create);
      return () => existing.removeEventListener("load", create);
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.addEventListener("load", create);
    document.body.appendChild(script);
    return () => script.removeEventListener("load", create);
  }, []);

  return <div id={TARGET_ID} className="hub-hs-form min-h-[220px]" />;
}
