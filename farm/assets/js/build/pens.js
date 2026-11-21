// Pen partitions, walkway-side fence with gates, and invisible hover volumes per pen.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { PLATFORMS, PEN_X, PENS_PER_PLATFORM, PART_H, BAMBOO, GATE_W, SLAT_TOP } = Farm.config;
  const { M } = Farm.materials;
  const { boxFromTo, meshPanel, shade } = Farm.helpers;

  const Y0 = SLAT_TOP, Y1 = SLAT_TOP + PART_H, YC = (Y0 + Y1) / 2, hb = BAMBOO / 2;

  function partition(G, p, x) {
    const grp = new THREE.Group();
    grp.userData.x = x;
    const mp = meshPanel(p.z1 - p.z0, PART_H, grp);
    mp.rotation.y = Math.PI / 2;
    mp.position.set(x, YC, (p.z0 + p.z1) / 2);
    boxFromTo(x - hb, x + hb, Y0, Y1, p.z0, p.z0 + BAMBOO, M.bamboo, grp);
    boxFromTo(x - hb, x + hb, Y0, Y1, p.z1 - BAMBOO, p.z1, M.bamboo, grp);
    boxFromTo(x - hb, x + hb, Y1 - BAMBOO, Y1, p.z0, p.z1, M.bamboo, grp);
    boxFromTo(x - hb, x + hb, Y0, Y0 + BAMBOO, p.z0, p.z1, M.bamboo, grp);
    G.pens.add(grp);
    return grp;
  }

  function gate(G, g0, g1, zf0, zf1, hingeZ) {
    const grp = new THREE.Group();
    const t = 0.12, lx0 = g0 + 0.05, lx1 = g1 - 0.05, ly0 = Y0 + 0.1, ly1 = Y1 - 0.05;
    boxFromTo(lx0, lx0 + t, ly0, ly1, zf0, zf1, M.wood, grp);
    boxFromTo(lx1 - t, lx1, ly0, ly1, zf0, zf1, M.wood, grp);
    boxFromTo(lx0, lx1, ly1 - t, ly1, zf0, zf1, M.wood, grp);
    boxFromTo(lx0, lx1, ly0, ly0 + t, zf0, zf1, M.wood, grp);
    boxFromTo(lx0, lx1, (ly0 + ly1 - t) / 2, (ly0 + ly1 + t) / 2, zf0, zf1, M.wood, grp);
    meshPanel(lx1 - lx0 - 2 * t, ly1 - ly0 - 2 * t, grp).position.set((lx0 + lx1) / 2, (ly0 + ly1) / 2, (zf0 + zf1) / 2);
    for (const hy of [ly0 + 0.4, ly1 - 0.4]) {
      const h = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 10), M.steel));
      h.position.set(g0, hy, hingeZ);
      grp.add(h);
    }
    G.pens.add(grp);
  }

  Farm.build.pens = function (G) {
    const partitions = [];
    for (const p of PLATFORMS) {
      // cross partitions every 7 ft, x = 6, 13 … 90 (incl. end barriers), 3 ft high on the slats
      for (const x of PEN_X) {
        const grp = partition(G, p, x);
        if (p.name === 'left') partitions.push(grp);
      }

      // walkway-side fence along z = 9 / 13 with a 3 ft gate centred in each pen
      const fz = p.fenceZ, zs = p.name === 'left' ? -1 : 1;           // platform side of the fence
      const zf0 = Math.min(fz, fz + zs * BAMBOO), zf1 = Math.max(fz, fz + zs * BAMBOO);
      for (let i = 0; i < PENS_PER_PLATFORM; i++) {
        const x0 = PEN_X[i], x1 = PEN_X[i + 1], gc = (x0 + x1) / 2;
        const g0 = gc - GATE_W / 2, g1 = gc + GATE_W / 2;
        for (const [a, b] of [[x0, g0], [g1, x1]]) {
          meshPanel(b - a, PART_H, G.pens).position.set((a + b) / 2, YC, (zf0 + zf1) / 2);
          boxFromTo(a, b, Y1 - BAMBOO, Y1, zf0, zf1, M.bamboo, G.pens);
          boxFromTo(a, b, Y0, Y0 + BAMBOO, zf0, zf1, M.bamboo, G.pens);
        }
        boxFromTo(g0 - BAMBOO, g0, Y0, Y1 + 0.2, zf0, zf1, M.bamboo, G.pens);      // gate posts
        boxFromTo(g1, g1 + BAMBOO, Y0, Y1 + 0.2, zf0, zf1, M.bamboo, G.pens);
        gate(G, g0, g1, zf0, zf1, fz - zs * 0.08);                                   // hinges on walkway face
      }
    }

    // invisible boxes used to detect hover/tap on each pen
    const pens = [];
    for (const p of PLATFORMS) for (let i = 0; i < PENS_PER_PLATFORM; i++) {
      const x0 = PEN_X[i], x1 = PEN_X[i + 1];
      const mat = new THREE.MeshBasicMaterial({ color: 0x4caf50, transparent: true, opacity: 0, depthWrite: false });
      const vol = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, PART_H, p.z1 - p.z0), mat);
      vol.position.set((x0 + x1) / 2, YC, (p.z0 + p.z1) / 2);
      vol.userData = { n: p.firstPen + i, len: x1 - x0, wid: p.z1 - p.z0 };
      G.hit.add(vol);
      pens.push(vol);
    }

    return { partitions, pens };
  };
})(window.Farm);
