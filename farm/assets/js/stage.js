// The 3D "stage": renderer inside the page box, scene, cameras, controls, lights,
// and one group per part of the shed (so parts can be shown/hidden).
(function (Farm) {
  const { THREE, OrbitControls } = Farm.lib;
  const { L, W } = Farm.config;

  const GROUP_NAMES = ['site', 'floor', 'walls', 'roof', 'service', 'platforms', 'pens',
    'feeders', 'birds', 'lights', 'labels', 'vent', 'hit'];

  function createStage(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcfe6f5);
    scene.fog = new THREE.Fog(0xcfe6f5, 180, 420);

    const persp = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    const controls = new OrbitControls(persp, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.495;

    // lights: soft sky light + a sun with shadows
    scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x5a6b45, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(95, 90, -45);
    sun.target.position.set(L / 2, 0, W / 2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 300 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    scene.add(sun, sun.target);

    const groups = {};
    for (const name of GROUP_NAMES) scene.add(groups[name] = new THREE.Group());

    const stage = {
      renderer, scene, persp, ortho, controls, groups, container,
      camera: persp,
      size: { w: 1, h: 1 },
      fitOrtho() {
        const aspect = stage.size.w / stage.size.h;
        let halfW = 57, halfH = halfW / aspect;
        if (halfH < 20) { halfH = 20; halfW = halfH * aspect; }
        Object.assign(ortho, { left: -halfW, right: halfW, top: halfH, bottom: -halfH });
        ortho.updateProjectionMatrix();
      },
      resize() {
        const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
        stage.size = { w, h };
        renderer.setSize(w, h, false);
        persp.aspect = w / h;
        persp.updateProjectionMatrix();
        stage.fitOrtho();
      },
      onFrame: [],                       // functions run every frame before rendering (e.g. smooth zoom)
      start() {
        renderer.setAnimationLoop(() => {
          for (const fn of stage.onFrame) fn();
          controls.update();
          renderer.render(scene, stage.camera);
        });
      },
    };

    // follow the box size (window resize, layout changes, full screen)
    new ResizeObserver(() => stage.resize()).observe(container);
    stage.resize();
    return stage;
  }

  Farm.createStage = createStage;
})(window.Farm);
