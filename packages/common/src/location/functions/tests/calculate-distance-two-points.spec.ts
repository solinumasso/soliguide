import { calculateDistanceBetweenTwoPoints } from "../calculate-distance-two-points";

describe("calculateDistanceBetweenTwoPoints", () => {
  // Points de repère à Paris
  const TOUR_EIFFEL = {
    lat: 48.85837,
    lng: 2.294481,
  };

  const NOTRE_DAME = {
    lat: 48.852966,
    lng: 2.349902,
  };

  const ARC_TRIOMPHE = {
    lat: 48.873792,
    lng: 2.295028,
  };

  const SACRE_COEUR = {
    lat: 48.886705,
    lng: 2.343104,
  };

  const LOUVRE = {
    lat: 48.860611,
    lng: 2.337644,
  };

  it("should return 0 when calculating distance between same point", () => {
    const distance = calculateDistanceBetweenTwoPoints(
      TOUR_EIFFEL.lat,
      TOUR_EIFFEL.lng,
      TOUR_EIFFEL.lat,
      TOUR_EIFFEL.lng
    );

    expect(distance).toBe(0);
  });

  it("should calculate correct distance between Tour Eiffel and Notre-Dame", () => {
    const distance = calculateDistanceBetweenTwoPoints(
      TOUR_EIFFEL.lat,
      TOUR_EIFFEL.lng,
      NOTRE_DAME.lat,
      NOTRE_DAME.lng
    );

    // Around  4.1 km
    expect(distance).toBeGreaterThan(3.9);
    expect(distance).toBeLessThan(4.3);
  });

  it("should calculate correct distance between Sacré-Coeur and Arc de Triomphe", () => {
    const distance = calculateDistanceBetweenTwoPoints(
      SACRE_COEUR.lat,
      SACRE_COEUR.lng,
      ARC_TRIOMPHE.lat,
      ARC_TRIOMPHE.lng
    );

    // around 3.7 km
    expect(distance).toBeGreaterThan(3.5);
    expect(distance).toBeLessThan(3.9);
  });

  it("should be symmetric (distance A->B equals B->A)", () => {
    const distanceAB = calculateDistanceBetweenTwoPoints(
      LOUVRE.lat,
      LOUVRE.lng,
      NOTRE_DAME.lat,
      NOTRE_DAME.lng
    );

    const distanceBA = calculateDistanceBetweenTwoPoints(
      NOTRE_DAME.lat,
      NOTRE_DAME.lng,
      LOUVRE.lat,
      LOUVRE.lng
    );

    expect(Math.abs(distanceAB - distanceBA)).toBeLessThan(0.0001);
  });

  it("should handle negative coordinates correctly", () => {
    const distance = calculateDistanceBetweenTwoPoints(
      -TOUR_EIFFEL.lat,
      -TOUR_EIFFEL.lng,
      -NOTRE_DAME.lat,
      -NOTRE_DAME.lng
    );

    // Same distance than positive
    const distancePositive = calculateDistanceBetweenTwoPoints(
      TOUR_EIFFEL.lat,
      TOUR_EIFFEL.lng,
      NOTRE_DAME.lat,
      NOTRE_DAME.lng
    );

    expect(Math.abs(distance - distancePositive)).toBeLessThan(0.0001);
  });

  it("should throw error for invalid latitude values", () => {
    expect(() =>
      calculateDistanceBetweenTwoPoints(
        91, // Invalid latitude (>90)
        TOUR_EIFFEL.lng,
        NOTRE_DAME.lat,
        NOTRE_DAME.lng
      )
    ).toThrow();
  });
});
