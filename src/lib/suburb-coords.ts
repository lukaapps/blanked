// Approximate suburb centroids for Melbourne — used only to place a fuzzy
// "somewhere around here" circle on the space location map, never an exact
// address. Deliberately coarse: precision to a suburb, not a street.
export const suburbCoords: Record<string, [number, number]> = {
  Fitzroy: [-37.7986, 144.9784],
  Brunswick: [-37.7663, 144.9599],
  Collingwood: [-37.8033, 144.9852],
  CBD: [-37.8136, 144.9631],
  Carlton: [-37.8006, 144.9668],
  Richmond: [-37.8183, 145.0],
  "St Kilda": [-37.8677, 144.9811],
  Other: [-37.8136, 144.9631],
};

// Deterministic small offset (roughly +/-400m) so multiple spaces in the
// same suburb don't render as one exact overlapping dot.
function seededOffset(seed: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const a = ((hash % 1000) / 1000) * 0.008 - 0.004;
  const b = (((hash >> 8) % 1000) / 1000) * 0.008 - 0.004;
  return [a, b];
}

export function approximateLocation(suburb: string, seed: string): [number, number] {
  const [lat, lng] = suburbCoords[suburb] ?? suburbCoords.Other;
  const [dLat, dLng] = seededOffset(seed);
  return [lat + dLat, lng + dLng];
}
