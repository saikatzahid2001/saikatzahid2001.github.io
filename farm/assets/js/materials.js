// Colours, materials and the hand-drawn textures (brick, wire mesh, roof sheet).
(function (Farm) {
  const { THREE } = Farm.lib;

  function canvasTexture(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  }

  /** a copy of a texture tiled rx × ry times */
  function repeated(tex, rx, ry) {
    const t = tex.clone();
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    return t;
  }

  // brick tile = 1.5 ft wide × 0.75 ft high (3 courses)
  const brickTex = canvasTexture(192, 96, (g, w, h) => {
    g.fillStyle = '#cbbfae'; g.fillRect(0, 0, w, h);
    const rows = 3, rh = h / rows, bw = w / 2;
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * bw / 2;
      for (let i = -1; i < 3; i++) {
        const v = 150 + Math.floor(Math.random() * 30);
        g.fillStyle = `rgb(${v}, ${55 + Math.random() * 20 | 0}, ${40 + Math.random() * 12 | 0})`;
        g.fillRect(i * bw + off + 2, r * rh + 2, bw - 4, rh - 4);
      }
    }
  });

  // wire mesh, 0.5 ft cells, transparent between the wires
  const meshTex = canvasTexture(64, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(70, 75, 80, 0.95)';
    g.lineWidth = 4;
    g.strokeRect(2, 2, w - 4, h - 4);
  });

  // corrugated GI sheet: light/dark stripes across X
  const roofTex = canvasTexture(32, 8, (g, w) => {
    const grad = g.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#8e959c'); grad.addColorStop(0.5, '#d9dee2'); grad.addColorStop(1, '#8e959c');
    g.fillStyle = grad; g.fillRect(0, 0, w, 8);
  });

  const std = o => new THREE.MeshStandardMaterial(o);

  Farm.materials = {
    repeated,
    roofTex,
    brickMat: (len, h) => std({ map: repeated(brickTex, len / 1.5, h / 0.75), roughness: 0.9 }),
    meshMat: (w, h) => std({
      map: repeated(meshTex, w / 0.5, h / 0.5), transparent: true, depthWrite: false,
      side: THREE.DoubleSide, metalness: 0.3, roughness: 0.6,
    }),
    M: {
      concrete: std({ color: 0xbdbdb8, roughness: 0.95 }),
      walkway: std({ color: 0xd0d0cb, roughness: 0.9 }),
      manure: std({ color: 0x75664f, roughness: 1 }),
      post: std({ color: 0x5f6468, metalness: 0.5, roughness: 0.5 }),
      steel: std({ color: 0x6f767c, metalness: 0.6, roughness: 0.45 }),
      curtain: std({ color: 0x2f5fa8, roughness: 0.8 }),
      wood: std({ color: 0x8a5a2b, roughness: 0.8 }),
      bamboo: std({ color: 0xd2b36f, roughness: 0.75 }),
      timber: std({ color: 0x9c7442, roughness: 0.8 }),
      tank: std({ color: 0x2f6fd1, roughness: 0.5 }),
      sack: std({ color: 0xebe0c6, roughness: 0.95 }),
      feeder: std({ color: 0xd32f2f, roughness: 0.5 }),
      drinker: std({ color: 0x1e88e5, roughness: 0.4 }),
      drinkerBase: std({ color: 0xf5f5f5, roughness: 0.4 }),
      bulb: std({ color: 0xfff6d5, emissive: 0xffe9a0, emissiveIntensity: 2 }),
      grass: std({ color: 0x6f9f4a, roughness: 1 }),
      vent: std({ color: 0x40c4ff, transparent: true, opacity: 0.4, depthWrite: false, emissive: 0x0a4a66 }),
      cord: new THREE.LineBasicMaterial({ color: 0x333333 }),
    },
  };
})(window.Farm);
