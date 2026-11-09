export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) +
    ", " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) +
    " UTC"
  );
}

export function confidencePercent(c: number): string {
  return `${Math.round(c * 100)}%`;
}

export function hostOf(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    // A Wayback link reads as "web.archive.org" and tells the reader nothing
    // about who published the proof: name the original site, then the archive.
    if (host === "web.archive.org") {
      const original = url.match(/\/web\/\d+\w*\/(https?:\/\/.+)$/)?.[1];
      if (original) return `${hostOf(original)} · web.archive.org`;
    }
    return host;
  } catch {
    return url;
  }
}

// A fiche's use_case runs to several sentences: search engines cut a
// description around 160 characters, so give them one that ends where the
// writing does. The full text stays on the page and in the JSON-LD.
export function metaDescription(text: string, max = 158): string {
  const s = text.trim();
  if (s.length <= max) return s;
  const firstSentence = s.match(/^.*?[.!?](?=\s)/)?.[0];
  if (firstSentence && firstSentence.length <= max) return firstSentence;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}
