const isValidLatitude = (latitude: number): boolean => {
  return isFinite(latitude) && Math.abs(latitude) <= 90;
};

const isValidLongitude = (longitude: number): boolean => {
  return isFinite(longitude) && Math.abs(longitude) <= 180;
};

export const calculateDistanceBetweenTwoPoints = (
  latFrom: number,
  lngFrom: number,
  latTo: number,
  lngTo: number
): number => {
  if (!isValidLatitude(latFrom)) {
    throw new Error(
      `Invalid latitude from: ${latFrom}. Must be between -90 and 90 degrees`
    );
  }
  if (!isValidLatitude(latTo)) {
    throw new Error(
      `Invalid latitude to: ${latTo}. Must be between -90 and 90 degrees`
    );
  }
  if (!isValidLongitude(lngFrom)) {
    throw new Error(
      `Invalid longitude from: ${lngFrom}. Must be between -180 and 180 degrees`
    );
  }
  if (!isValidLongitude(lngTo)) {
    throw new Error(
      `Invalid longitude to: ${lngTo}. Must be between -180 and 180 degrees`
    );
  }

  if (latFrom === latTo && lngFrom === lngTo) {
    return 0;
  }

  const radlat1 = (Math.PI * latFrom) / 180;
  const radlat2 = (Math.PI * latTo) / 180;
  const theta = lngFrom - lngTo;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
};
