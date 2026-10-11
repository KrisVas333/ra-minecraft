/* Žaidimų kūrėjai v2 · kraunamas PRIEŠ track.js (ne defer).
 * 1) window.RA_SRC = ?src= iš adreso (kanalas: fb, ig, lankstinukas, qa-…), be nesaugių ženklų, iki 60 ženklų.
 * 2) Apgaubia umami.track prieš jam įsikeliant, todėl KIEKVIENAS įvykis (ir automatiniai open/engage/dwell/share/error)
 *    neša { version: 'v2', src }. Vienas failas visiems v2 puslapiams. */
(function () {
  window.RA_SRC = ((new URLSearchParams(location.search).get('src') || 'direct').replace(/[^a-z0-9_.-]/gi, '') || 'direct').slice(0, 60);
  var u;
  try {
    Object.defineProperty(window, 'umami', {
      configurable: true, enumerable: true,
      get: function () { return u; },
      set: function (v) {
        if (v && typeof v.track === 'function' && !v.__ra) {
          var t = v.track.bind(v);
          v.track = function (n, p) { if (typeof n === 'string') { p = Object.assign({ version: 'v2', src: window.RA_SRC }, p || {}); } return t(n, p); };
          v.__ra = true;
        }
        u = v;
      }
    });
  } catch (e) {}
})();
