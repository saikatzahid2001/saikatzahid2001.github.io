// Smooth scroll-wheel zoom, toward the mouse pointer.
// OrbitControls' own wheel zoom jumps a fixed step per event; here each wheel event only
// moves a *goal*, and the camera glides toward it every frame. Pinch zoom (touch) is still
// handled by OrbitControls.
(function (Farm) {
  const { THREE } = Farm.lib;
  const { SLAT_TOP } = Farm.config;

  const EASE = 0.18;          // share of the remaining distance covered per frame
  const SENSITIVITY = 0.0012; // zoom per pixel of wheel movement
  const MAX_STEP = 180;       // cap on one wheel event (big mouse-wheel notches)

  Farm.initSmoothZoom = function (stage) {
    const { controls, renderer } = stage;
    controls.minDistance = 3;
    controls.maxDistance = 220;
    controls.minZoom = 0.6;
    controls.maxZoom = 14;
    controls.zoomSpeed = 0.7;               // gentler pinch on touch screens

    let goal = null;                        // target distance (perspective) or zoom (top view)
    let useAnchor = false;
    const anchor = new THREE.Vector3();
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    const slatPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SLAT_TOP);   // y = 3 ft

    // capture on the box, so OrbitControls on the canvas never sees the wheel
    renderer.domElement.parentElement.addEventListener('wheel', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const unit = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? 400 : 1;   // lines / pages → pixels
      const dy = THREE.MathUtils.clamp(ev.deltaY * unit, -MAX_STEP, MAX_STEP);
      const factor = Math.exp(dy * SENSITIVITY);
      const cam = stage.camera;

      if (cam.isOrthographicCamera) {
        goal = THREE.MathUtils.clamp((goal ?? cam.zoom) / factor, controls.minZoom, controls.maxZoom);
        return;
      }
      const dist = cam.position.distanceTo(controls.target);
      goal = THREE.MathUtils.clamp((goal ?? dist) * factor, controls.minDistance, controls.maxDistance);

      // zoom toward the point under the pointer (on the slat level), if it is in front of us
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, cam);
      useAnchor = !!ray.ray.intersectPlane(slatPlane, anchor) && anchor.distanceTo(cam.position) < 300;
    }, { passive: false, capture: true });

    stage.onFrame.push(() => {
      if (goal === null) return;
      const cam = stage.camera;

      if (cam.isOrthographicCamera) {
        cam.zoom += (goal - cam.zoom) * EASE;
        cam.updateProjectionMatrix();
        if (Math.abs(goal - cam.zoom) < 1e-3) goal = null;
        return;
      }
      const dist = cam.position.distanceTo(controls.target);
      const next = dist + (goal - dist) * EASE;
      const k = next / dist;
      const pivot = useAnchor ? anchor : controls.target;
      // scale camera and orbit centre around the pivot, so the pointed-at spot stays put
      cam.position.sub(pivot).multiplyScalar(k).add(pivot);
      controls.target.sub(pivot).multiplyScalar(k).add(pivot);
      if (Math.abs(goal - next) < 0.01) goal = null;
    });

    stage.resetZoom = () => { goal = null; };    // called when switching views
  };
})(window.Farm);
