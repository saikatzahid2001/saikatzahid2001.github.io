# Bayt al-Rizq — Poultry Shed 3D

An interactive, to-scale 3D model of the poultry shed (90 × 22 ft inside, 24 pens of
7 × 9 ft on slatted platforms either side of a 4 ft walkway — 12 per side, ~83 birds each, 2 pan feeders + 1 bell drinker per pen), built with [Three.js](https://threejs.org) loaded from a CDN.
There is no build step: double-click `index.html` or serve the folder (an internet connection is needed for Three.js).

Our own files are plain scripts that register themselves on `window.Farm` (not ES modules),
because browsers block local module files opened from disk (`file://`). The small loader at the
bottom of `index.html` imports Three.js from the CDN, then loads each file in order.

Live (once pushed): `https://saikatzahid2001.github.io/farm/`
Open a view directly: `?view=three`, `?view=top` or `?view=walk`.

## Files

```
farm/
├─ index.html                 page: header + logo, 3D viewer, space below; loader at the bottom
├─ README.md
└─ assets/
   ├─ css/style.css           page and viewer styling (colours from the logo)
   ├─ img/logo.png            farm logo (header)
   ├─ img/favicon.png         browser-tab icon
   └─ js/
      ├─ main.js              entry point: builds everything, starts the viewer
      ├─ config.js            ALL measurements (feet) — change numbers here only
      ├─ text.js              Bangla wording inside the 3D model (labels, tooltip) + Bangla digits
      ├─ materials.js         colours and drawn textures (brick, wire mesh, roof sheet)
      ├─ helpers.js           shared building blocks (boxes, beams, mesh panels)
      ├─ labels.js            text labels and dimension lines
      ├─ stage.js             renderer, scene, cameras, lights, resizing to the box
      ├─ zoom.js              smooth scroll-wheel zoom toward the pointer (eases, with limits)
      ├─ ui.js                view buttons, show/hide, pen hover, full screen
      ├─ verify.js            measures the model and logs the result in the console
      └─ build/
         ├─ site.js           grass
         ├─ floor.js          slab, foundation, manure zone, walkway
         ├─ walls.js          side walls, front wall + door, back wall
         ├─ roof.js           gable roof, purlins, trusses
         ├─ service.js        water tank, feed sacks
         ├─ platforms.js      legs, beams, battens, slats
         ├─ pens.js           partitions, walkway fence, gates, hover volumes
         ├─ equipment.js      feeders and drinkers
         ├─ birds.js          chickens
         ├─ extras.js         bulbs, ventilation arrows
         └─ annotations.js    dimensions and labels
```

## Language

The page is in Bangla (`lang="bn"`, fonts Hind Siliguri and Noto Serif Bengali from Google Fonts).
Page text is in `index.html`; text drawn inside the 3D model is in `assets/js/text.js`.
The loader waits up to 4 s for the Bangla font before drawing the 3D labels.
The console measurement check stays in English (developer tool).

## Adding page content

`index.html` has an empty section below the viewer, marked with a comment. Replace its
`slot-hint` paragraph with your own content, or add more `<section>` blocks after it.
The 3D viewer resizes itself to fit its box automatically.

## Adding a new JS file

Wrap it like the others — `(function (Farm) { … })(window.Farm);` — and add its name to the
`FILES` list in `index.html`, after the files it depends on.

## Checking measurements

Open the browser console (Developer Tools). The page logs a table of measured vs. expected
sizes and `ALL MEASUREMENT CHECKS PASS` when everything matches.

## Note on the platform structure

The beam tops are at 2.75 ft and the slat bottoms at 2.917 ft. A 2-inch batten on each beam
closes that gap so the slats rest on the structure; all other numbers are exactly as specified.
