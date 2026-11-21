// Shed bulbs along the walkway and the (optional) ventilation arrows.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { L, RIDGE, RIDGE_Z } = Farm.config;
  const { M } = Farm.materials;
  const { lines } = Farm.helpers;

  Farm.build.extras = function (G) {
    // bulbs every 10 ft on the walkway centreline, y 7.5 ft
    const cords = [];
    for (let x = 0; x <= L; x += 10) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 12), M.bulb);
      b.position.set(x, 7.5, RIDGE_Z);
      G.lights.add(b);
      cords.push(x, 7.625, RIDGE_Z, x, RIDGE, RIDGE_Z);
    }
    G.lights.add(lines(cords, M.cord));

    // air entering through the z = 0 wall and leaving at the z = 22 wall
    for (const x of [12, 30, 48, 66, 84]) {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30, 16), M.vent);
      shaft.rotation.x = Math.PI / 2;
      shaft.position.set(x, 6, 10);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.5, 20), M.vent);
      head.rotation.x = Math.PI / 2;
      head.position.set(x, 6, 26.25);
      G.vent.add(shaft, head);
    }
  };
})(window.Farm);
