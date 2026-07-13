// Country centroid coordinates [lat, lon] for the deployment globe.
// Geography constants only; deployment data always comes from the store.
import type { Entry } from "@/lib/types";

export const COUNTRY_COORDS: Record<string, [number, number]> = {
  Antarctica: [-76.0, 15.0],
  Argentina: [-34.6, -64.0],
  Australia: [-25.3, 133.8],
  Brazil: [-10.8, -52.9],
  Canada: [56.1, -106.3],
  China: [35.0, 103.0],
  Estonia: [58.7, 25.0],
  France: [46.6, 2.4],
  Germany: [51.1, 10.4],
  India: [22.0, 79.0],
  Indonesia: [-2.5, 118.0],
  Italy: [42.8, 12.8],
  Japan: [36.2, 138.3],
  Kenya: [0.2, 37.9],
  Malaysia: [4.2, 102.0],
  Mexico: [23.9, -102.5],
  Netherlands: [52.2, 5.3],
  Nigeria: [9.1, 8.7],
  "Saudi Arabia": [24.0, 45.0],
  Singapore: [1.35, 103.82],
  "South Africa": [-29.0, 25.0],
  "South Korea": [36.4, 127.8],
  Spain: [40.2, -3.6],
  Sweden: [62.0, 15.0],
  Switzerland: [46.8, 8.2],
  "United Arab Emirates": [24.0, 54.0],
  "United Kingdom": [54.0, -2.5],
  "United States": [39.8, -98.6],
};

export type GlobeMarker = {
  /** Country name, or "Antarctica" for entries deployed there. */
  place: string;
  /** Filter to apply when clicked: country for real countries, region for Antarctica. */
  filterKey: "country" | "region";
  named: number;
  unnamed: number;
  lat: number;
  lon: number;
};

// One marker per place, with named/unnamed counts. Entries whose region is
// Antarctica are pinned to the continent (the deployment location) instead of
// the operating organization's home country.
export function buildMarkers(entries: Entry[]): GlobeMarker[] {
  const acc = new Map<string, { named: number; unnamed: number }>();
  for (const e of entries) {
    const place = e.region === "Antarctica" ? "Antarctica" : e.company_country;
    if (!place || !COUNTRY_COORDS[place]) continue;
    const slot = acc.get(place) ?? { named: 0, unnamed: 0 };
    if (e.solution_named === false) slot.unnamed += 1;
    else slot.named += 1;
    acc.set(place, slot);
  }
  return [...acc.entries()]
    .map(([place, c]) => {
      const [lat, lon] = COUNTRY_COORDS[place];
      return {
        place,
        filterKey: (place === "Antarctica" ? "region" : "country") as "country" | "region",
        named: c.named,
        unnamed: c.unnamed,
        lat,
        lon,
      };
    })
    .sort((a, b) => b.named + b.unnamed - (a.named + a.unnamed) || a.place.localeCompare(b.place));
}
