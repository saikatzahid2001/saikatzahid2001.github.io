// Gable roof (ridge along X at z = 11) with steel trusses every 10 ft. Hidden by default.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { L, W, WALL_T, EAVE, RIDGE, RIDGE_Z, SLOPE, OVER_SIDE, OVER_END, ROOF_T, roofUnderY } = Farm.config;
  const { M, roofTex, repeated } = Farm.materials;
  const { boxFromTo, beam, shade, v3 } = Farm.helpers;

  Farm.build.roof = function (G) {
    const xA = -WALL_T - OVER_END, xB = L + WALL_T + OVER_END;      // -1.92 → 91.92
    const zEdge = -WALL_T - OVER_SIDE;                               // -2.42
    const ang = Math.atan(SLOPE);
    const slopeLen = (RIDGE_Z - zEdge) / Math.cos(ang);
    const lift = (0.1 + ROOF_T / 2) / Math.cos(ang);                 // sheet sits on 0.2 ft rafters
    const roofMat = new THREE.MeshStandardMaterial({
      map: repeated(roofTex, (xB - xA) / 0.4, 1), metalness: 0.55, roughness: 0.4,
    });

    for (const side of [-1, 1]) {
      const panel = shade(new THREE.Mesh(new THREE.BoxGeometry(xB - xA, ROOF_T, slopeLen), roofMat));
      const zc = side < 0 ? (zEdge + RIDGE_Z) / 2 : W - (zEdge + RIDGE_Z) / 2;
      panel.position.set((xA + xB) / 2, roofUnderY(zc) + lift, zc);
      panel.rotation.x = side * ang;
      G.roof.add(panel);
    }
    boxFromTo(xA, xB, RIDGE + 0.1, RIDGE + 0.25, RIDGE_Z - 0.35, RIDGE_Z + 0.35, M.steel, G.roof);   // ridge cap

    for (const z of [0, 3.67, 7.33, 14.67, 18.33, 22]) {                                         // purlins
      boxFromTo(xA + 1, xB - 1, 0, 0.12, z - 0.06, z + 0.06, M.steel, G.roof).position.y = roofUnderY(z) + 0.04;
    }

    for (let x = 0; x <= L; x += 10) {                                                           // trusses
      beam(v3(x, EAVE, 0), v3(x, EAVE, W), 0.2, M.steel, G.roof);
      beam(v3(x, EAVE, 0), v3(x, RIDGE, RIDGE_Z), 0.2, M.steel, G.roof);
      beam(v3(x, EAVE, W), v3(x, RIDGE, RIDGE_Z), 0.2, M.steel, G.roof);
      beam(v3(x, EAVE, RIDGE_Z), v3(x, RIDGE, RIDGE_Z), 0.2, M.steel, G.roof);
    }
  };
})(window.Farm);
