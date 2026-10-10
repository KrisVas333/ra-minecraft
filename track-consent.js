/* RA „Žaidimų kūrėjai" · sutikimo vartai + Clarity (taisyklė 16)
 * ---------------------------------------------------------------
 * - track.js (Umami, be slapukų) kraunamas visada: anoniminiai įvykiai.
 * - Microsoft Clarity (heatmap'ai, įrašai) kraunamas TIK po „Leisti".
 * - Pasirinkimas saugomas localStorage 'ra_mc_consent' = 'all' | 'necessary'.
 * TODO (Kris): sukurti Clarity projektą šiam puslapiui ir įrašyti ID žemiau.
 */
(function () {
  'use strict';
  var CLARITY_ID = ''; // TODO: Clarity project id for ra-minecraft (empty = Clarity never loads)
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

  function banner() {
    var el = document.createElement('div');
    el.className = 'consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Slapukų sutikimas');
    el.innerHTML =
      '<p>Norime matyti, kur puslapis tėvams neaiškus, ir jį gerinti. „Leisti" įjungia Microsoft Clarity (anoniminius šilumos žemėlapius ir sesijų įrašus). Be sutikimo renkame tik anoniminę statistiką be slapukų.</p>' +
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
