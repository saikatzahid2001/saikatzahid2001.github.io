// Entry point: builds the shed inside the #viewer box and wires up the page controls.
// Runs last; every other script has already registered itself on window.Farm.
(function (Farm) {
  Farm.main = function () {
    const stage = Farm.createStage(document.getElementById('viewer'));
    const G = stage.groups;
    const B = Farm.build;

    B.site(G);
    const { floorSlab } = B.floor(G);
    B.walls(G);
    B.roof(G);
    B.service(G);
    const platforms = B.platforms(G);
    const { partitions, pens } = B.pens(G);
    const spots = B.equipment(G);
    B.birds(G, spots);
    B.extras(G);
    B.annotations(G);

    Farm.stage = stage;                     // handy for debugging in the console
    Farm.initSmoothZoom(stage);
    Farm.initUI(stage, { pens });
    stage.start();

    Farm.checks = Farm.verifyMeasurements({ floorSlab, partitions, ...platforms });
  };
})(window.Farm);
