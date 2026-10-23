/* RA „Žaidimų kūrėjai" · sutikimo vartai + Clarity (taisyklė 16)
 * ---------------------------------------------------------------
 * - track.js (Umami, be slapukų) kraunamas visada: anoniminiai įvykiai.
 * - Microsoft Clarity (heatmap'ai, įrašai) kraunamas TIK po „Leisti".
 * - Pasirinkimas saugomas localStorage 'ra_mc_consent' = 'all' | 'necessary'.
 * TODO (Kris): sukurti Clarity projektą šiam puslapiui ir įrašyti ID žemiau.
 */
(function () {
  'use strict';
  var CLARITY_ID = 'yvooeforl7'; // Clarity projektas ra-minecraft (Strict masking); kraunamas TIK po „Leisti"
  var KEY = 'ra_mc_consent';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadClarity() {
    if (!CLARITY_ID || window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function css() {
    // telefonuose: kompaktiška juosta (≤ ~12 % ekrano), mygtukai ≥ 44 px
    var st = document.createElement('style');
    st.textContent = '.consent .consent-actions .btn{min-height:44px}' +
      '@media (max-width:599px){.consent{display:grid!important;grid-template-columns:1fr auto;gap:8px!important;padding:8px 12px calc(8px + env(safe-area-inset-bottom))!important;font-size:.8rem!important;line-height:1.3!important}' +
      '.consent p{flex:none!important}.consent .c-long{display:none}.consent .consent-actions{gap:6px}.consent .consent-actions .btn{min-height:44px;padding:6px 12px!important}}';
    document.head.appendChild(st);
  }

  function banner() {
    css();
    var el = document.createElement('div');
    el.className = 'consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Slapukų sutikimas');
    el.innerHTML =
      '<p>„Leisti" įjungia Microsoft Clarity<span class="c-long"> (anoniminius šilumos žemėlapius), kad matytume, kur puslapis neaiškus</span>. Be sutikimo: tik anoniminė statistika be slapukų.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-yellow" data-c="all">Leisti</button>' +
      '<button type="button" class="btn btn-ghost" data-c="necessary">Tik būtini</button>' +
      '</div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (!b) return;
      save(b.getAttribute('data-c'));
      if (b.getAttribute('data-c') === 'all') loadClarity();
      if (window.bt) window.bt('engage', { consent: b.getAttribute('data-c') });
      el.classList.add('is-gone');
      setTimeout(function () { el.remove(); }, 300);
    });
    document.body.appendChild(el);
  }

  function init() {
    var c = read();
    if (c === 'all') { loadClarity(); return; }
    if (c === 'necessary') return;
    banner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
