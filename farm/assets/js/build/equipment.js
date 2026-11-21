// Per 7 × 9 ft pen: 2 hanging pan feeders and 1 bell drinker, in a line across the pen
// (feeder · drinker · feeder), centred along the pen's length.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { PLATFORMS, PEN_X, PENS_PER_PLATFORM, roofUnderY } = Farm.config;
  const { M } = Farm.materials;
  const { dummy, shade, lines } = Farm.helpers;

  Farm.build.equipment = function (G) {
    const feederSpots = [], drinkerSpots = [];
    for (const p of PLATFORMS) for (let i = 0; i < PENS_PER_PLATFORM; i++) {
      const x = (PEN_X[i] + PEN_X[i + 1]) / 2, wid = p.z1 - p.z0;
      feederSpots.push([x, p.z0 + wid * 0.25], [x, p.z0 + wid * 0.75]);
      drinkerSpots.push([x, p.z0 + wid * 0.5]);
    }

    const pan = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.6, 0.45, 0.4, 24), M.feeder, feederSpots.length);
    const tube = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.18, 1.0, 16), M.feeder, feederSpots.length);
    const bell = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.15, 0.65, 0.42, 24), M.drinker, drinkerSpots.length);
    const ring = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.65, 0.65, 0.08, 24), M.drinkerBase, drinkerSpots.length);
    const cords = [];

    feederSpots.forEach(([x, z], i) => {               // pan: Ø 1.2 ft, 0.4 ft high, bottom at y 3.3
      dummy.position.set(x, 3.5, z); dummy.updateMatrix(); pan.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 4.1, z); dummy.updateMatrix(); tube.setMatrixAt(i, dummy.matrix);
      cords.push(x, 4.6, z, x, roofUnderY(z), z);
    });
    drinkerSpots.forEach(([x, z], i) => {              // bell: Ø 1.3 ft, 0.5 ft high, bottom at y 3.4
      dummy.position.set(x, 3.44, z); dummy.updateMatrix(); ring.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 3.69, z); dummy.updateMatrix(); bell.setMatrixAt(i, dummy.matrix);
      cords.push(x, 3.9, z, x, roofUnderY(z), z);
    });

    for (const m of [pan, tube, bell, ring]) G.feeders.add(shade(m));
    G.feeders.add(lines(cords, M.cord));
    return { feederSpots, drinkerSpots };
  };
})(window.Farm);
