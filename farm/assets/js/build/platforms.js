// Slatted platforms (machas): legs, beams, battens and slats.
(function (Farm) {
  const { THREE } = Farm.lib;
  const {
    PLATFORMS, PLAT_X0, PLAT_X1, LEG, LEG_TOP, LEG_X_COUNT, LEG_X_STEP, BEAM_W, BEAM_Y0,
    SLAT_TOP, SLAT_T, SLAT_W, SLAT_PITCH,
  } = Farm.config;
  const { M } = Farm.materials;
  const { boxFromTo, dummy, shade } = Farm.helpers;

  Farm.build.platforms = function (G) {
    const legXs = Array.from({ length: LEG_X_COUNT }, (_, i) => +(PLAT_X0 + i * LEG_X_STEP).toFixed(4));

    // a) legs 0.25 × 0.25 ft, y 0 → 2.75
    const legs = new THREE.InstancedMesh(new THREE.BoxGeometry(LEG, LEG_TOP, LEG), M.timber, legXs.length * 8);
    let i = 0;
    for (const p of PLATFORMS) for (const z of p.legZ) for (const x of legXs) {
      dummy.position.set(x, LEG_TOP / 2, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      legs.setMatrixAt(i++, dummy.matrix);
    }
    G.platforms.add(shade(legs));

    // b) beams on each leg row (y 2.42 → 2.75) + 2-inch batten up to the slat bottom
    const beams = [];
    for (const p of PLATFORMS) for (const z of p.legZ) {
      beams.push(boxFromTo(PLAT_X0, PLAT_X1, BEAM_Y0, LEG_TOP, z - BEAM_W / 2, z + BEAM_W / 2, M.timber, G.platforms));
      boxFromTo(PLAT_X0, PLAT_X1, LEG_TOP, SLAT_TOP - SLAT_T, z - BEAM_W / 2, z + BEAM_W / 2, M.bamboo, G.platforms);
    }

    // c) slats across the width: 1.5 in wide, 1 in gap, top at y = 3.0
    const slatsPerPlatform = Math.floor((PLAT_X1 - PLAT_X0 - SLAT_W) / SLAT_PITCH) + 1;
    const slatMeshes = PLATFORMS.map(p => {
      const width = p.z1 - p.z0;
      const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(SLAT_W, SLAT_T, width), M.bamboo, slatsPerPlatform);
      for (let k = 0; k < slatsPerPlatform; k++) {
        dummy.position.set(PLAT_X0 + SLAT_W / 2 + k * SLAT_PITCH, SLAT_TOP - SLAT_T / 2, (p.z0 + p.z1) / 2);
        dummy.updateMatrix();
        slats.setMatrixAt(k, dummy.matrix);
      }
      slats.name = `slats-${p.name}`;
      G.platforms.add(shade(slats));
      return slats;
    });

    return { legs, beams, slatMeshes, slatsPerPlatform };
  };
})(window.Farm);
