// Grass around the shed (150 × 80 ft).
(function (Farm) {
  const { THREE } = Farm.lib;
  const { L, W, SLAB_T } = Farm.config;
  const { M } = Farm.materials;

  Farm.build.site = function (G) {
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(150, 80), M.grass);
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(L / 2, -SLAB_T - 0.001, W / 2);
    grass.receiveShadow = true;
    G.site.add(grass);
  };
})(window.Farm);
