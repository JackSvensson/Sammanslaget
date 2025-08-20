export function haversineDistance(coord1, coord2) {
  const R = 6371;

  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateRouteDistance(path) {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    distance += haversineDistance(path[i], path[i + 1]);
  }
  return distance;
}

export function estimateWalkingTime(distanceKm, speedKmH = 5) {
  return (distanceKm / speedKmH) * 60;
}
