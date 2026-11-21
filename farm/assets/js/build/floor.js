// Concrete slab, foundation under the walls, manure zone and walkway surface.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { L, W, WALL_T, SLAB_T, PLATFORMS, PLAT_X0, PLAT_X1, WALK_Z0, WALK_Z1 } = Farm.config;
  const { M } = Farm.materials;
  const { boxFromTo } = Farm.helpers;

  function floorPatch(parent, x0, x1, z0, z1, mat, y) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    m.receiveShadow = true;
    parent.add(m);
  }

  Farm.build.floor = function (G) {
    // slab: x 0–90, z 0–22, top at y = 0
    const floorSlab = boxFromTo(0, L, -SLAB_T, 0, 0, W, M.concrete, G.floor);

    // foundation ring under the walls (the walls are outside the slab)
    boxFromTo(-WALL_T, L + WALL_T, -SLAB_T, 0, -WALL_T, 0, M.concrete, G.floor);
    boxFromTo(-WALL_T, L + WALL_T, -SLAB_T, 0, W, W + WALL_T, M.concrete, G.floor);
    boxFromTo(-WALL_T, 0, -SLAB_T, 0, 0, W, M.concrete, G.floor);
    boxFromTo(L, L + WALL_T, -SLAB_T, 0, 0, W, M.concrete, G.floor);

    // darker manure/litter under both platforms
    for (const p of PLATFORMS) floorPatch(G.floor, PLAT_X0, PLAT_X1, p.z0, p.z1, M.manure, 0.006);
    // central walkway x 0 → 90, continuous with the service area and the door
    floorPatch(G.floor, 0, L, WALK_Z0, WALK_Z1, M.walkway, 0.008);

    return { floorSlab };
  };
})(window.Farm);
