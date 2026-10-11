/* Žaidimų kūrėjai v2 · sutikimo vartai (taisyklė 16)
 * - track.js (Umami, be slapukų) kraunamas visada: anoniminiai įvykiai.
 * - Microsoft Clarity (šilumos žemėlapiai, seansų įrašai; įvestys paslėptos) TIK po „Leisti".
 * - Po „Leisti" Clarity gauna consentv2: analytics_Storage granted, ad_Storage denied.
 * - Pasirinkimas: localStorage 'ra_mc_v2_consent' = 'all' | 'necessary'. Keičiamas per „Slapukų nustatymai".
 */
(function () {
  'use strict';
  var CFG = window.RA_CFG || {};
  var CLARITY_ID = CFG.clarityId || '';
  var KEY = 'ra_mc_v2_consent';
  var PRIVACY = CFG.privacyUrl || 'https://robotikosakademija.lt/privatumo-politika/';

  function track(n, p) { if (window.bt) { try { window.bt(n, p || {}); } catch (e) {} } }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function loadClarity() {
    if (!CLARITY_ID) return;
    if (!window.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', CLARITY_ID);
    }
    try { window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' }); } catch (e) {}
  }

  var el = null;
  function setPad() {
    var h = el && !el.classList.contains('is-gone') ? el.offsetHeight : 0;
    document.documentElement.style.setProperty('--consent-h', h + 'px');
  }
  function banner() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'consent';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Slapukų pasirinkimas');
    el.innerHTML =
      '<p>„Leisti" įjungia Microsoft Clarity: šilumos žemėlapiai ir seansų įrašai, įvesti duomenys paslėpti. Be sutikimo: tik anoniminė statistika be slapukų. <a href="' + PRIVACY + '" rel="noopener" data-track="privacy-consent">Privatumo politika</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-navy" data-c="all">Leisti</button>' +
      '<button type="button" class="btn btn-line" data-c="necessary">Tik būtini</button>' +
      '</div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (!b) return;
      var c = b.getAttribute('data-c');
      save(c);
      if (c === 'all') loadClarity();
      track('engage', { consent: c });
      el.classList.add('is-gone');
      setPad();
      setTimeout(function () { if (el) { el.remove(); el = null; } setPad(); }, 300);
    });
    document.body.insertBefore(el, document.body.firstChild);
    setPad();
    track('engage', { consent: 'shown' });
    if (window.ResizeObserver) new ResizeObserver(setPad).observe(el);
  }

  function init() {
    var c = read();
    if (c === 'all') { loadClarity(); return; }
    if (c === 'necessary') return;
    banner();
  }
  window.raConsentReopen = function () { clear(); track('engage', { consent: 'reopen' }); if (!el) banner(); };
  window.addEventListener('resize', setPad);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
