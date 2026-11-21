// Long side walls, front wall with door, back wall.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { L, W, WALL_T, EAVE, KNEE, WALK_Z0, WALK_Z1, DOOR_W, DOOR_H } = Farm.config;
  const { M, brickMat } = Farm.materials;
  const { boxFromTo, meshPanel, shade } = Farm.helpers;

  Farm.build.walls = function (G) {
    const meshH = EAVE - KNEE;

    // a) long side walls: brick 0 → 2 ft, wire mesh 2 → 8.5 ft, posts every 10 ft, rolled curtain
    for (const [z0, z1] of [[-WALL_T, 0], [W, W + WALL_T]]) {
      const len = L + 2 * WALL_T, zc = (z0 + z1) / 2;
      boxFromTo(-WALL_T, L + WALL_T, 0, KNEE, z0, z1, brickMat(len, KNEE), G.walls);
      meshPanel(len, meshH, G.walls).position.set(L / 2, KNEE + meshH / 2, zc);
      for (let x = 0; x <= L; x += 10) boxFromTo(x - 0.165, x + 0.165, 0, EAVE, zc - 0.165, zc + 0.165, M.post, G.walls);
      boxFromTo(-WALL_T, L + WALL_T, EAVE - 0.17, EAVE, zc - 0.1, zc + 0.1, M.steel, G.walls);   // wall plate
      const curtain = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, len, 16), M.curtain));
      curtain.rotation.z = Math.PI / 2;
      curtain.position.set(L / 2, 8.3, z0 < 0 ? z0 - 0.15 : z1 + 0.15);
      G.walls.add(curtain);
    }

    // b) front wall (x = 0): solid brick, 3 × 7 ft door opening centred on the walkway (z 9.5 → 12.5)
    const x0 = -WALL_T, x1 = 0;
    const d0 = (WALK_Z0 + WALK_Z1 - DOOR_W) / 2, d1 = d0 + DOOR_W;
    boxFromTo(x0, x1, 0, EAVE, -WALL_T, d0, brickMat(d0 + WALL_T, EAVE), G.walls);
    boxFromTo(x0, x1, 0, EAVE, d1, W + WALL_T, brickMat(W + WALL_T - d1, EAVE), G.walls);
    boxFromTo(x0, x1, DOOR_H, EAVE, d0, d1, brickMat(DOOR_W, EAVE - DOOR_H), G.walls);
    // wooden door leaf, hinged at the d0 side on the outer face, half-open (45°) outward
    const hinge = new THREE.Group();
    hinge.position.set(-WALL_T, 0, d0);
    hinge.rotation.y = -Math.PI / 4;
    boxFromTo(-0.15, 0, 0.02, DOOR_H, 0.03, DOOR_W - 0.03, M.wood, hinge);
    const handle = shade(new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), M.steel));
    handle.position.set(-0.2, 3.4, DOOR_W - 0.3);
    hinge.add(handle);
    G.walls.add(hinge);

    // c) back wall (x = 90): brick 0 → 2 ft, mesh 2 → 8.5 ft
    const wid = W + 2 * WALL_T;
    boxFromTo(L, L + WALL_T, 0, KNEE, -WALL_T, W + WALL_T, brickMat(wid, KNEE), G.walls);
    const mp = meshPanel(wid, meshH, G.walls);
    mp.rotation.y = Math.PI / 2;
    mp.position.set(L + WALL_T / 2, KNEE + meshH / 2, W / 2);
    boxFromTo(L, L + WALL_T, EAVE - 0.17, EAVE, -WALL_T, W + WALL_T, M.steel, G.walls);
  };
})(window.Farm);
