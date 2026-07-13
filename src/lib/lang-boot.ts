// Server-safe: the inline <head> script that sets data-lang before first
// paint, so a stored/browser French preference never flashes English.
// Keep the key and detection in sync with src/lib/lang.ts.
export const LANG_BOOT_SCRIPT = `(function(){try{var s=localStorage.getItem("agentipedia-lang");var l=(s==="fr"||s==="en")?s:((navigator.language||"").toLowerCase().indexOf("fr")===0?"fr":"en");document.documentElement.dataset.lang=l;document.documentElement.lang=l;}catch(e){}})();`;
