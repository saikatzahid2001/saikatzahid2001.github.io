// Zone A, front service area (x 0 → 6): water tank and feed sacks.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { M } = Farm.materials;
  const { boxFromTo, shade } = Farm.helpers;

  Farm.build.service = function (G) {
    const tank = shade(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4, 40), M.tank));
    tank.position.set(3, 2, 3);
    const lid = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.15, 24), M.tank));
    lid.position.set(3, 4.07, 3);
    G.service.add(tank, lid);

    // 6 sacks, 2.5 × 1.5 × 0.8 ft: 3 groups stacked 2 high, near z 16 → 21
    for (const zc of [16.5, 18.5, 20.5]) {
      for (let k = 0; k < 2; k++) {
        const s = boxFromTo(1.75, 4.25, k * 0.8, k * 0.8 + 0.8, zc - 0.75, zc + 0.75, M.sack, G.service);
        s.rotation.y = k ? 0.04 : -0.03;
      }
    }
  };
})(window.Farm);
