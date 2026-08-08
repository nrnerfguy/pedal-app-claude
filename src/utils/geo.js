// Haversine distance in kilometers between two lat/lng points.
export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Free, no-API-key static map preview image (OpenStreetMap-based).
// Swap for Google Static Maps if/when you add a Maps API key.
export function staticMapUrl({ fromLat, fromLng, toLat, toLng, width = 640, height = 300 }) {
  const markers = `markers=${fromLat},${fromLng},lightblue1|markers=${toLat},${toLng},red-pushpin`;
  const midLat = (fromLat + toLat) / 2;
  const midLng = (fromLng + toLng) / 2;
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${midLat},${midLng}&zoom=14&size=${width}x${height}&${markers}`;
}

export function googleMapsDirectionsUrl({ fromLat, fromLng, toLat, toLng }) {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=bicycling`;
}

export function appleMapsDirectionsUrl({ fromLat, fromLng, toLat, toLng }) {
  return `https://maps.apple.com/?saddr=${fromLat},${fromLng}&daddr=${toLat},${toLng}&dirflg=b`;
}
