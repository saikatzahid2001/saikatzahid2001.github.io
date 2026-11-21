// Measures the built model and logs the result to the browser console.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { PEN_X, PEN_LEN, PEN_COUNT, PART_H, RIDGE, EAVE, BIRDS_PER_PEN } = Farm.config;

  Farm.verifyMeasurements = function ({ floorSlab, slatMeshes, beams, partitions, slatsPerPlatform, legs }) {
    const fb = new THREE.Box3().setFromObject(floorSlab);
    const [sl, sr] = slatMeshes.map(m => { m.computeBoundingBox(); return m.boundingBox; });
    const bb = new THREE.Box3().setFromObject(beams[0]);
    const xs = partitions.map(p => p.userData.x).sort((a, b) => a - b);
    const penLens = xs.slice(1).map((x, i) => x - xs[i]);

    const checks = [
      ['Building length (ft)', fb.max.x - fb.min.x, 90],
      ['Building width (ft)', fb.max.z - fb.min.z, 22],
      ['Service area depth (ft)', sl.min.x - fb.min.x, 6],
      ['Bird area length (ft)', bb.max.x - bb.min.x, 84],
      ['Left platform width (ft)', sl.max.z - sl.min.z, 9],
      ['Right platform width (ft)', sr.max.z - sr.min.z, 9],
      ['Walkway width (ft)', sr.min.z - sl.max.z, 4],
      ...penLens.map((v, i) => [`Pen length ${i + 1} (ft)`, v, 7]),
      ['Pens per platform', penLens.length, 12],
      ['Pens in total', PEN_COUNT, 24],
      ['First partition x (ft)', xs[0], PEN_X[0]],
      ['Last partition x (ft)', xs[xs.length - 1], 90],
      ['Slat top y (ft)', sl.max.y, 3],
      ['Partition height (ft)', PART_H, 3],
      ['Ridge height (ft)', RIDGE, 12],
      ['Eave height (ft)', EAVE, 8.5],
    ].map(([what, measured, expected]) => ({
      what, measured: +measured.toFixed(4), expected, ok: Math.abs(measured - expected) < 1e-3,
    }));

    console.table(checks);
    console.log(`Slats per platform: ${slatsPerPlatform} | legs: ${legs.count} | pens: ${PEN_COUNT} × ${PEN_LEN} ft | drawn birds: ${PEN_COUNT * BIRDS_PER_PEN}`);
    const pass = checks.every(c => c.ok);
    console.log(pass ? 'ALL MEASUREMENT CHECKS PASS' : 'SOME MEASUREMENT CHECKS FAILED');
    return { pass, checks };
  };
})(window.Farm);
