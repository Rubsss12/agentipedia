// Country centroid coordinates [lat, lon] for the deployment globe.
// Geography constants only; deployment data always comes from the store.
export const COUNTRY_COORDS: Record<string, [number, number]> = {
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

export type GlobeMarker = { country: string; count: number; lat: number; lon: number };

export function buildMarkers(countryCounts: Record<string, number>): GlobeMarker[] {
  return Object.entries(countryCounts)
    .filter(([country]) => COUNTRY_COORDS[country])
    .map(([country, count]) => {
      const [lat, lon] = COUNTRY_COORDS[country];
      return { country, count, lat, lon };
    })
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
}
