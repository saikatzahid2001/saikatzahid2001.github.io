// Small building blocks shared by every part of the shed.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { meshMat } = Farm.materials;

  function shade(m, cast = true, receive = true) {
    m.castShadow = cast;
    m.receiveShadow = receive;
    return m;
  }

  /** a box given by its min/max corners */
  function boxFromTo(x0, x1, y0, y1, z0, z1, mat, parent) {
    const m = shade(new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat));
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    if (parent) parent.add(m);
    return m;
  }

  /** a square beam of the given size between two points */
  function beam(a, b, size, mat, parent) {
    const m = shade(new THREE.Mesh(new THREE.BoxGeometry(size, size, a.distanceTo(b)), mat));
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    parent.add(m);
    return m;
  }

  /** a flat wire-mesh panel, w × h, facing +Z (rotate for other directions) */
  function meshPanel(w, h, parent) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), meshMat(w, h));
    m.receiveShadow = true;
    if (parent) parent.add(m);
    return m;
  }

  /** thin line segments from a flat [x, y, z, x, y, z, …] list */
  function lines(points, mat) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return new THREE.LineSegments(g, mat);
  }

  Farm.helpers = {
    dummy: new THREE.Object3D(),          // reused to fill InstancedMesh matrices
    shade, boxFromTo, beam, meshPanel, lines,
    v3: (x, y, z) => new THREE.Vector3(x, y, z),
  };
})(window.Farm);
