// All Bangla wording shown inside the 3D model (labels, dimensions, tooltip).
// Page text lives in index.html. Change wording here, not in the build files.
(function (Farm) {
  const DIGITS = '০১২৩৪৫৬৭৮৯';
  /** convert any Latin digits in a value to Bangla digits: 9.5 → ৯.৫ */
  const bn = v => String(v).replace(/[0-9]/g, d => DIGITS[d]);

  Farm.bn = bn;
  Farm.text = {
    // dimension lines
    totalLength: n => `লম্বায় ${bn(n)} ফুট`,
    totalWidth: n => `চওড়ায় ${bn(n)} ফুট`,
    serviceDepth: n => `কাজের জায়গা ${bn(n)} ফুট`,
    birdArea: n => `মুরগির জায়গা ${bn(n)} ফুট`,
    feet: n => `${bn(n)} ফুট`,
    wallHeight: n => `দেয়াল ${bn(n)} ফুট উঁচু`,
    ridgeHeight: n => `চালের চূড়া ${bn(n)} ফুট`,
    onePen: n => `একেকটি খোপ ${bn(n)} ফুট`,
    platformHeight: n => `মাচা ${bn(n)} ফুট উঁচু`,
    partitionHeight: n => `বেড়া ${bn(n)} ফুট`,

    // floating labels
    pen: n => `খোপ ${bn(n)}`,
    serviceArea: (d, w) => `কাজের জায়গা — পানি ও খাবার (${bn(d)} × ${bn(w)} ফুট)`,
    walkway: n => `হাঁটার পথ ${bn(n)} ফুট`,

    // hover / tap tooltip
    penTip: (n, len, wid, lo, hi) =>
      `খোপ ${bn(n)} · ${bn(len)} × ${bn(wid)} ফুট = ${bn(len * wid)} বর্গফুট · ${bn(lo)}–${bn(hi)}টি মুরগি ধরে`,
  };
})(window.Farm);
