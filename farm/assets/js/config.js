// ============================================================
// Every measurement of the shed, in feet. Change numbers here only.
// 1 Three.js unit = 1 ft. X = length (0 = entrance → 90 = back),
// Z = width (0 = left long wall → 22 = right long wall), Y = height.
// 90 × 22 ft is the INSIDE clear space; walls sit outside it.
// ============================================================
(function (Farm) {
  const C = {
    L: 90,                    // interior length
    W: 22,                    // interior width
    WALL_T: 0.42,             // 5-inch brick
    SLAB_T: 0.33,             // floor slab, extends below y = 0

    EAVE: 8.5,                // wall-top / eave height
    RIDGE: 12,                // roof ridge height
    RIDGE_Z: 11,              // ridge runs along X at z = 11
    KNEE: 2,                  // brick knee wall under the mesh
    OVER_SIDE: 2,             // roof overhang past the long walls
    OVER_END: 1.5,            // roof overhang past front/back walls
    ROOF_T: 0.05,

    SERVICE_END: 6,           // zone A: x 0 → 6
    WALK_Z0: 9,               // central walkway z 9 → 13 (4 ft)
    WALK_Z1: 13,
    DOOR_W: 3,                // front door, centred on the walkway
    DOOR_H: 7,

    PLAT_X0: 6,               // platforms x 6 → 90
    PLAT_X1: 90,
    PLATFORMS: [
      // 9 ft wide each; 4 leg rows per platform, 0.2 ft in from each edge, evenly spaced
      { name: 'left',  z0: 0,  z1: 9,  legZ: [0.2, 3.07, 5.93, 8.8],    fenceZ: 9 },
      { name: 'right', z0: 13, z1: 22, legZ: [13.2, 16.07, 18.93, 21.8], fenceZ: 13 },
    ],

    LEG: 0.25,                // leg cross-section
    LEG_TOP: 2.75,
    LEG_X_COUNT: 21,          // x = 6, 10.2 … 90
    LEG_X_STEP: 4.2,
    BEAM_W: 0.25,
    BEAM_Y0: 2.42,            // beam y 2.42 → 2.75

    SLAT_TOP: 3.0,
    SLAT_T: 0.083,            // 1 in thick
    SLAT_W: 0.125,            // 1.5 in wide
    SLAT_PITCH: 2.5 / 12,     // 1.5 in slat + 1 in gap

    PEN_LEN: 7,               // each pen 7 ft long (along X) × 9 ft (platform width)
    PART_H: 3,                // partition height above slats
    BAMBOO: 0.17,             // bamboo frame section
    GATE_W: 3,

    BIRDS_PER_SQFT: [1.25, 1.375],  // 250–275 birds per 200 sq ft
    FEEDERS_PER_PEN: 2,       // round pan feeders
    DRINKERS_PER_PEN: 1,      // bell drinkers
    BIRDS_PER_PEN: 20,        // drawn birds per pen: representative, not the full flock
  };
  // partition lines: x = 6, 13, 20 … 90 (incl. end barriers) → 12 pens per platform
  C.PEN_X = Array.from({ length: Math.round((C.PLAT_X1 - C.PLAT_X0) / C.PEN_LEN) + 1 }, (_, i) => C.PLAT_X0 + i * C.PEN_LEN);
  C.PENS_PER_PLATFORM = C.PEN_X.length - 1;
  C.PEN_COUNT = C.PENS_PER_PLATFORM * C.PLATFORMS.length;
  C.PLATFORMS.forEach((p, i) => (p.firstPen = 1 + i * C.PENS_PER_PLATFORM));   // left 1–12, right 13–24
  /** bird capacity of one pen: [min, max, typical] */
  C.penCapacity = () => {
    const area = C.PEN_LEN * (C.PLATFORMS[0].z1 - C.PLATFORMS[0].z0);
    const [lo, hi] = C.BIRDS_PER_SQFT.map(r => Math.round(area * r));
    return [lo, hi, Math.round((lo + hi) / 2)];
  };
  C.SLOPE = (C.RIDGE - C.EAVE) / C.RIDGE_Z;
  /** height of the roof underside (top of rafters) at a given z */
  C.roofUnderY = z => C.EAVE + C.SLOPE * (C.RIDGE_Z - Math.abs(z - C.RIDGE_Z));

  Farm.config = C;
})(window.Farm);
