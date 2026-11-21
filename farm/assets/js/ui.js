// Page controls: camera views, show/hide checkboxes, pen hover/tap, full screen.
(function (Farm) {
  const { THREE } = Farm.lib;

  const VIEWS = {
    three: { cam: 'p', pos: [-16, 46, -40], target: [42, 0, 9], fit: true },
    walk:  { cam: 'p', pos: [0.5, 5.5, 11], target: [30, 4.5, 11], labels: false },   // eye height 5.5 ft at the door
    top:   { cam: 'o', pos: [42, 150, 11.01], target: [42, 0, 11] },
  };

  Farm.initUI = function (stage, { pens }) {
    const { groups: G, controls, ortho, persp, renderer } = stage;

    // ---- show / hide ----
    const toggles = { roof: G.roof, walls: G.walls, birds: G.birds, feeders: G.feeders, labels: G.labels, vent: G.vent };
    for (const [key, group] of Object.entries(toggles)) {
      const box = document.getElementById(`t-${key}`);
      const apply = () => (group.visible = box.checked);
      box.addEventListener('change', apply);
      apply();
    }

    // ---- views ----
    function setView(name) {
      const v = VIEWS[name];
      stage.resetZoom?.();                                 // drop any zoom still gliding
      stage.camera = v.cam === 'o' ? ortho : persp;
      controls.object = stage.camera;
      stage.camera.position.set(...v.pos);
      controls.target.set(...v.target);
      if (v.fit) {                                          // narrow / tall box: step back so the whole shed fits
        const aspect = stage.size.w / stage.size.h;
        const back = Math.max(1, 1.5 / aspect);
        stage.camera.position.sub(controls.target).multiplyScalar(back).add(controls.target);
      }
      if (stage.camera === ortho) { ortho.zoom = 1; stage.fitOrtho(); }
      controls.update();
      const lb = document.getElementById('t-labels');      // labels are huge at eye level
      lb.checked = v.labels !== false;
      lb.dispatchEvent(new Event('change'));
      document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    }
    document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    const start = new URLSearchParams(location.search).get('view');       // ?view=top | walk | three
    setView(VIEWS[start] ? start : 'three');

    // ---- pen hover / tap ----
    const tip = document.getElementById('tip');
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = null;
    function pick(ev) {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      const pen = ray.intersectObjects(pens, false)[0]?.object ?? null;
      if (pen !== hovered) {
        if (hovered) hovered.material.opacity = 0;
        if (pen) pen.material.opacity = 0.28;
        hovered = pen;
      }
      if (!pen) { tip.style.display = 'none'; return; }
      const d = pen.userData;
      const [lo, hi] = Farm.config.penCapacity();
      tip.textContent = Farm.text.penTip(d.n, d.len, d.wid, lo, hi);
      tip.style.display = 'block';
      tip.style.left = `${Math.max(8, Math.min(ev.clientX - r.left + 14, r.width - tip.offsetWidth - 8))}px`;
      tip.style.top = `${Math.min(ev.clientY - r.top + 14, r.height - tip.offsetHeight - 8)}px`;
    }
    renderer.domElement.addEventListener('pointermove', pick);
    renderer.domElement.addEventListener('pointerdown', pick);
    renderer.domElement.addEventListener('pointerleave', () => {
      if (hovered) hovered.material.opacity = 0;
      hovered = null;
      tip.style.display = 'none';
    });

    // ---- full screen (the whole viewer card) ----
    const card = document.getElementById('viewer-card');
    const fsBtn = document.getElementById('fullscreen');
    if (!card.requestFullscreen) fsBtn.hidden = true;
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else card.requestFullscreen();
    });
  };
})(window.Farm);
