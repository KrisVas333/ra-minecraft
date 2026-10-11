/* Žaidimų kūrėjai v2 · sutikimo vartai (taisyklė 16). Vienas failas visiems v2 puslapiams:
 * pagrindinis puslapis, lankstinukas, komandai, palyginimas (stilius įdedamas iš čia, kad veiktų be v2.css).
 * - track.js (Umami, be slapukų) kraunamas visada: anoniminiai įvykiai.
 * - Microsoft Clarity (šilumos žemėlapiai, seansų įrašai; įvestys paslėptos) TIK po „Leisti".
 * - Po „Leisti" Clarity gauna consentv2: analytics_Storage granted, ad_Storage denied.
 * - Po „Tik būtini" (kai Clarity jau veikė): consentv2 denied + consent(false), slapukai _clck/_clsk
 *   ištrinami ir puslapis perkraunamas, kad žyma dingtų visai.
 * - Pasirinkimas: localStorage 'ra_mc_v2_consent' = 'all' | 'necessary'. Keičiamas per „Slapukų nustatymai"
 *   ([data-cookie-settings] mygtukas arba window.raConsentReopen()).
 * - Juosta rodoma ne iš karto, o po pirmo slinkimo arba po 6 s, kad neuždengtų pirmo ekrano. Spausdinant nerodoma.
 */
(function () {
  'use strict';
  var CFG = window.RA_CFG || {};
  var me = document.currentScript;
  var CLARITY_ID = (me && me.getAttribute('data-clarity')) || CFG.clarityId || '';
  var KEY = 'ra_mc_v2_consent';
  var PRIVACY = CFG.privacyUrl || 'https://robotikosakademija.lt/privatumo-politika/';
  var SRC = window.RA_SRC || 'direct';
  var CSS = '.consent{position:fixed;left:0;right:0;bottom:0;z-index:60;background:#fff;color:#152039;padding:8px 12px calc(8px + env(safe-area-inset-bottom));box-shadow:0 -10px 30px rgba(10,20,60,.25);font:400 14px/1.35 Poppins,system-ui,sans-serif;display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center;transition:opacity .25s,transform .3s}' +
    '.consent p{margin:0}.consent a{color:#152039;font-weight:600;display:inline-block;padding:10px 0;margin:-10px 0}.consent .long{display:none}.consent.is-gone{opacity:0;transform:translateY(12px)}' +
    '.consent-actions{display:flex;gap:6px}.consent-actions button{min-height:44px;padding:8px 12px;border-radius:999px;border:2px solid #152039;background:#fff;color:#152039;font:600 14px/1.2 Poppins,system-ui,sans-serif;cursor:pointer;white-space:nowrap}.consent-actions button:hover{background:#F3F6FF}.consent-actions button:focus-visible{outline:3px solid #3D5BD6;outline-offset:2px}' +
    '@media (min-width:860px){.consent{left:auto;right:20px;bottom:20px;width:420px;border-radius:22px;padding:16px 18px;grid-template-columns:1fr;gap:10px;font-size:15px}.consent .long{display:inline}.consent-actions{justify-content:stretch}.consent-actions button{flex:1;font-size:15px}}' +
    '@media print{.consent{display:none!important}}';

  function track(n, p) { if (window.bt) { try { window.bt(n, Object.assign({ version: 'v2', src: SRC }, p || {})); } catch (e) {} } }
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

  function expireCookie(name) {
    var exp = '; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    var host = location.hostname, parts = host.split('.');
    document.cookie = name + '=' + exp;
    document.cookie = name + '=' + exp + '; domain=' + host;
    if (parts.length > 2) document.cookie = name + '=' + exp + '; domain=.' + parts.slice(-2).join('.');
    document.cookie = name + '=' + exp + '; domain=.' + host;
  }
  function hasClarityCookies() { return /(^|;\s*)_cl(ck|sk)=/.test(document.cookie); }
  /* Atšaukimas veikia taip pat, kaip sutikimas: sustabdyti įrašą, išvalyti slapukus, perkrauti. */
  function withdraw() {
    var running = !!window.clarity || hasClarityCookies();
    if (window.clarity) {
      try { window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }); } catch (e) {}
      try { window.clarity('consent', false); } catch (e) {}
      try { window.clarity('stop'); } catch (e) {}
    }
    ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'].forEach(expireCookie);
    if (running) setTimeout(function () { location.reload(); }, 150);
  }

  var el = null, armed = false;
  function setPad() {
    var h = el && !el.classList.contains('is-gone') ? el.offsetHeight : 0;
    document.documentElement.style.setProperty('--consent-h', h + 'px');
  }
  function css() {
    if (document.getElementById('consent-css')) return;
    var s = document.createElement('style'); s.id = 'consent-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  function banner() {
    if (el) return;
    css();
    el = document.createElement('div');
    el.className = 'consent';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Slapukų pasirinkimas');
    var note = document.getElementById('privatumas') ? ' · <a href="#privatumas" data-track="privacy-note-consent">Kaip tvarkome duomenis</a>' : '';
    el.innerHTML =
      '<p>Seansų įrašai (Microsoft Clarity<span class="long">, įvestys paslėptos</span>) tik jums leidus.<span class="long"> Be sutikimo: tik anoniminė statistika be slapukų.</span> ' +
      '<a href="' + PRIVACY + '" rel="noopener" data-track="privacy-consent">Privatumas</a>' + note + '</p>' +
      '<div class="consent-actions">' +
      '<button type="button" data-c="necessary">Tik būtini</button>' +
      '<button type="button" data-c="all">Leisti</button>' +
      '</div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (!b) return;
      var c = b.getAttribute('data-c');
      save(c);
      track('consent', { state: c });
      if (c === 'all') loadClarity(); else withdraw();
      el.classList.add('is-gone');
      setPad();
      setTimeout(function () { if (el) { el.remove(); el = null; } setPad(); }, 300);
    });
    document.body.insertBefore(el, document.body.firstChild);
    setPad();
    if (window.ResizeObserver) new ResizeObserver(setPad).observe(el);
  }
  /* Pirmas ekranas lieka švarus: juosta po pirmo slinkimo arba po 6 s. */
  function arm() {
    if (armed) return; armed = true;
    var t = setTimeout(show, 6000);
    function show() { clearTimeout(t); removeEventListener('scroll', onScroll); if (!read()) banner(); }
    function onScroll() { if (scrollY > 60) show(); }
    addEventListener('scroll', onScroll, { passive: true });
  }

  function init() {
    var c = read();
    if (c === 'all') { loadClarity(); return; }
    if (c === 'necessary') return;
    arm();
  }
  window.raConsentReopen = function () { clear(); track('consent', { state: 'reopen' }); if (!el) banner(); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (b) { e.preventDefault(); window.raConsentReopen(); }
  });
  window.addEventListener('resize', setPad);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
