// Dimension lines and floating labels (pens, service area, walkway). Wording: text.js
(function (Farm) {
  const { L, W, EAVE, RIDGE, RIDGE_Z, SERVICE_END, PLAT_X0, PLAT_X1, PLATFORMS, PEN_X, PEN_LEN, PENS_PER_PLATFORM, SLAT_TOP, PART_H } = Farm.config;
  const { label, dim } = Farm.labels;
  const { v3 } = Farm.helpers;
  const T = Farm.text;

  Farm.build.annotations = function (G) {
    const P = G.labels;
    const X = v3(1, 0, 0), Y = v3(0, 1, 0), Z = v3(0, 0, 1);
    const zA = PLATFORMS[0].z1, zB = PLATFORMS[1].z0;   // walkway edges: 9 and 13
    const plat = zA - PLATFORMS[0].z0;                  // 9
    const walk = zB - zA;                               // 4

    dim(P, v3(0, 0.05, -5), v3(L, 0.05, -5), T.totalLength(L), Z);
    dim(P, v3(0, 0.05, -3), v3(SERVICE_END, 0.05, -3), T.serviceDepth(SERVICE_END), Z, v3(0, 0.7, 0), 0.9);
    dim(P, v3(PLAT_X0, 0.05, -3), v3(PLAT_X1, 0.05, -3), T.birdArea(PLAT_X1 - PLAT_X0), Z, v3(0, 0.7, 0), 0.9);
    dim(P, v3(-9, 0.05, 0), v3(-9, 0.05, W), T.totalWidth(W), X, v3(-2.5, 0.7, 0));
    dim(P, v3(-4.5, 0.05, 0), v3(-4.5, 0.05, zA), T.feet(plat), X, v3(-1.2, 0.7, 0), 0.9);
    dim(P, v3(-4.5, 0.05, zA), v3(-4.5, 0.05, zB), T.feet(walk), X, v3(-1.2, 0.7, 0), 0.9);
    dim(P, v3(-4.5, 0.05, zB), v3(-4.5, 0.05, W), T.feet(plat), X, v3(-1.2, 0.7, 0), 0.9);
    dim(P, v3(-1.5, 0, -1.5), v3(-1.5, EAVE, -1.5), T.wallHeight(EAVE), X, v3(-1.6, 0, 0));
    dim(P, v3(L + 3.5, 0, RIDGE_Z), v3(L + 3.5, RIDGE, RIDGE_Z), T.ridgeHeight(RIDGE), Z, v3(1.8, 0, 0));
    dim(P, v3(27, 6.45, zA - 0.3), v3(27 + PEN_LEN, 6.45, zA - 0.3), T.onePen(PEN_LEN), Y, v3(0, 0.6, 0), 0.9);
    dim(P, v3(5.6, 0, zA - 0.5), v3(5.6, SLAT_TOP, zA - 0.5), T.platformHeight(SLAT_TOP), X, v3(-1.7, 0, 0), 0.85);
    dim(P, v3(27.4, SLAT_TOP, zA + 0.35), v3(27.4, SLAT_TOP + PART_H, zA + 0.35), T.partitionHeight(PART_H), X, v3(2.0, 0, 0), 0.85);

    // short "খোপ N" tags (a full description is wider than a 7 ft pen); hover/tap shows the details
    for (const p of PLATFORMS) for (let i = 0; i < PENS_PER_PLATFORM; i++) {
      label(P, T.pen(p.firstPen + i), v3((PEN_X[i] + PEN_X[i + 1]) / 2, 6.9, (p.z0 + p.z1) / 2), 0.8);
    }
    label(P, T.serviceArea(SERVICE_END, W), v3(3, 6.3, 17), 0.85);
    label(P, T.walkway(walk), v3(62, 1.4, 11), 0.9);
  };
})(window.Farm);
