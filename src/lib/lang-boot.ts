// Server-safe: the inline <head> script that sets data-lang before first
// paint, so a stored/browser French preference never flashes English.
// Keep the key and detection in sync with src/lib/lang.ts.
//
// It also raises data-js on the root element, which is what lets the scroll
// reveal hide anything at all. The reveal starts at opacity 0 and waits for
// the motion runtime to add .in; if the script never runs, that leaves the
// page blank even though the HTML is complete. Gating the rule on data-js
// makes "no JavaScript" mean "everything visible, nothing animated" instead.
// Setting it here, in the head, means it is in place before the first paint,
// so the content is never painted and then hidden.
export const LANG_BOOT_SCRIPT = `(function(){try{document.documentElement.dataset.js="1";var s=localStorage.getItem("agentipedia-lang");var l=(s==="fr"||s==="en")?s:((navigator.language||"").toLowerCase().indexOf("fr")===0?"fr":"en");document.documentElement.dataset.lang=l;document.documentElement.lang=l;}catch(e){}})();`;
