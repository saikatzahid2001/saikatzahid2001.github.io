// Floating text labels and red dimension lines.
(function (Farm) {
  const { THREE } = Farm.lib;

  /** a text sprite, `height` ft tall, always drawn on top */
  function label(parent, text, pos, height = 1.3, color = '#1f2a1f', bg = 'rgba(255,255,255,0.88)') {
    const pad = 18, fs = 64, font = `600 ${fs}px "Hind Siliguri", system-ui, sans-serif`;
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    g.font = font;
    const w = Math.ceil(g.measureText(text).width) + pad * 2, h = fs + pad * 2;   // room for Bangla vowel signs
    c.width = w; c.height = h;
    g.font = font;
    g.fillStyle = bg;
    g.beginPath(); g.roundRect(0, 0, w, h, 18); g.fill();
    g.fillStyle = color; g.textBaseline = 'middle';
    g.fillText(text, pad, h / 2 + 2);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    s.scale.set(height * w / h, height, 1);
    s.position.copy(pos);
    s.renderOrder = 10;
    parent.add(s);
    return s;
  }

  const dimMat = new THREE.LineBasicMaterial({ color: 0xc62828, depthTest: false, transparent: true });

  /** a dimension line from a to b with end ticks (along `tick`) and a label */
  function dim(parent, a, b, text, tick, labelOffset = new THREE.Vector3(0, 0.7, 0), h = 1.0) {
    const t = tick.clone().setLength(0.45);
    const pts = [a, b, a.clone().add(t), a.clone().sub(t), b.clone().add(t), b.clone().sub(t)];
    const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), dimMat);
    line.renderOrder = 9;
    parent.add(line);
    label(parent, text, a.clone().add(b).multiplyScalar(0.5).add(labelOffset), h, '#b71c1c', 'rgba(255,255,255,0.9)');
  }

  Farm.labels = { label, dim };
})(window.Farm);
