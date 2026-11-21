// Low-poly chickens, 20 per pen (a representative density), scattered on the slats.
(function (Farm) {
  const { THREE, mergeGeometries } = Farm.lib;
  const { PLATFORMS, PEN_X, PEN_LEN, PENS_PER_PLATFORM, PEN_COUNT, SLAT_TOP, BIRDS_PER_PEN } = Farm.config;
  const { dummy, shade } = Farm.helpers;

  function colored(geo, hex) {
    const c = new THREE.Color(hex), n = geo.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) c.toArray(arr, i * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return geo;
  }

  function chickenGeometry() {
    const body = new THREE.SphereGeometry(0.5, 12, 8); body.scale(0.6, 0.4, 0.4); body.translate(0, 0.28, 0);
    const head = new THREE.SphereGeometry(0.1, 10, 8); head.translate(0.3, 0.52, 0);
    const comb = new THREE.SphereGeometry(0.05, 6, 4); comb.scale(1.2, 0.8, 0.4); comb.translate(0.3, 0.63, 0);
    const beak = new THREE.ConeGeometry(0.035, 0.1, 6); beak.rotateZ(-Math.PI / 2); beak.translate(0.42, 0.5, 0);
    const tail = new THREE.ConeGeometry(0.1, 0.2, 6); tail.rotateZ(Math.PI / 3); tail.translate(-0.32, 0.4, 0);
    const legs = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4); legs.translate(0, 0.05, 0);
    return mergeGeometries([
      colored(body, 0xffffff), colored(head, 0xffffff), colored(comb, 0xd62020),
      colored(beak, 0xf2a20c), colored(tail, 0xf4f4f4), colored(legs, 0xf2a20c),
    ]);
  }

  Farm.build.birds = function (G, { feederSpots, drinkerSpots }) {
    let seed = 7;                                                   // fixed seed: same layout every load
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    const birds = new THREE.InstancedMesh(chickenGeometry(),
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), BIRDS_PER_PEN * PEN_COUNT);
    const white = new THREE.Color(0xffffff), brown = new THREE.Color(0xa0622d);
    const blocked = [...feederSpots.map(s => [...s, 0.85]), ...drinkerSpots.map(s => [...s, 0.9])];

    let i = 0;
    for (const p of PLATFORMS) for (let pen = 0; pen < PENS_PER_PLATFORM; pen++) {
      for (let k = 0; k < BIRDS_PER_PEN; k++) {
        let x, z, tries = 0;
        do {
          x = PEN_X[pen] + 0.5 + rnd() * (PEN_LEN - 1);
          z = p.z0 + 0.5 + rnd() * (p.z1 - p.z0 - 1);
        } while (tries++ < 30 && blocked.some(([bx, bz, r]) => Math.hypot(bx - x, bz - z) < r));
        dummy.position.set(x, SLAT_TOP, z);
        dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
        dummy.updateMatrix();
        birds.setMatrixAt(i, dummy.matrix);
        birds.setColorAt(i, rnd() < 0.7 ? white : brown);
        i++;
      }
    }
    G.birds.add(shade(birds));
    return { birds };
  };
})(window.Farm);
