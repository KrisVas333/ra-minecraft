/* Kūrėjų klubas (kk-testas) · puslapio logika: config → DOM, sekimas, forma, judesys. Kopija iš v2/, pritaikyta bandomajam būreliui. */
(function () {
  'use strict';
  var CFG = window.RA_CFG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var SRC = window.RA_SRC || 'direct';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VERSION = CFG.version || 'kk-testas';
  var CONSENT_VERSION = CFG.consentVersion || VERSION;
  var NB = ' ';

  /* ---------- sekimas: kiekvienas įvykis su version + src ----------
     cta    = paspaudė mygtuką link formos ar telefono
     engage = TIK lankytojo veiksmas (DUK, kortelė, žaidimas, formos žingsnis, klaida)
     view   = automatinis signalas (sekcija pasirodė ekrane), skaičiuojamas atskirai
     value  = užklausa išsiųsta (waitlist_submit / org_submit)                       */
  function track(n, p) {
    if (!window.bt) return;
    try { window.bt(n, Object.assign({ version: VERSION, src: SRC }, p || {})); } catch (e) {}
  }

  /* ---------- config → DOM ---------- */
  function eur(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.00', '').replace('.', ',') + NB + '€'; }
  function get(path) {
    var m = path.split('.');
    if (path === 'price.trial') return CFG.trial ? eur(CFG.trial.price) : undefined;
    if (m[0] === 'price' && CFG.prices && CFG.prices[m[1]]) return eur(CFG.prices[m[1]].amount);
    if (m[0] === 'perlesson' && CFG.prices && CFG.prices[m[1]]) return eur(CFG.prices[m[1]].amount / (CFG.lessonsPerMonth || 4));
    var v = CFG;
    for (var i = 0; i < m.length; i++) { if (v == null) return undefined; v = v[m[i]]; }
    return v;
  }
  /* {{price.mokykla}} ir pan. config tekstuose */
  function tpl(s) { return String(s).replace(/\{\{([\w.]+)\}\}/g, function (_, k) { var v = get(k); return v == null ? '' : String(v); }); }
  function fillList(sel, items, cls) {
    var ul = $(sel); if (!ul || !items || !items.length) return;
    ul.innerHTML = '';
    items.forEach(function (t) {
      var li = document.createElement('li');
      li.innerHTML = '<img class="px" src="assets/v1/' + (cls || 'ico-check-navy') + '.svg" alt=""><span></span>';
      li.querySelector('span').textContent = tpl(t); ul.appendChild(li);
    });
  }
  function render() {
    $$('[data-cfg]').forEach(function (el) {
      var keys = el.getAttribute('data-cfg').split('|');
      var out = keys.map(function (k) { var v = get(k.trim()); return v == null ? null : tpl(v); });
      if (out.some(function (x) { return x === null; })) return;
      el.textContent = out.join(' · ');
    });
    $$('[data-cfg-attr]').forEach(function (el) {
      var p = el.getAttribute('data-cfg-attr').split(':');
      var v = get(p[1]); if (v != null) el.setAttribute(p[0], String(v));
    });
    $$('[data-cfg-show]').forEach(function (el) {
      var k = el.getAttribute('data-cfg-show'), show;
      if (k === 'stemOrg') {
        var s = CFG.trust && CFG.trust.stemOrg;
        show = !!(s && s.show && (!s.validUntil || new Date(s.validUntil + 'T23:59:59') >= new Date()));
      } else show = !!get(k);
      el.hidden = !show;
      el.style.display = show ? '' : 'none';
    });
    $$('[data-trust]').forEach(function (el) {
      var t = CFG.trust && CFG.trust[el.getAttribute('data-trust')];
      if (t && t.show === false) el.style.display = 'none';
      if (t && t.src) el.setAttribute('title', 'Šaltinis: ' + t.src);
    });
    if (CFG.included) fillList('#incl', CFG.included);
    if (CFG.school) { fillList('#school-tiles', CFG.school.tiles); fillList('#org-needs', CFG.school.needs); }
    /* Atsiliepimų šiame puslapyje nėra (tikrų dar nesurinkome): jokių pavyzdinių kortelių. */
    renderProgram(); renderValues(); renderSchools(); renderMentors(); renderIntroVideo();
  }

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function safeUrl(u) { return /^https:\/\/[^\s"'<>]+$/i.test(u || '') ? u : ''; }

  /* ---------- „Ką vaikas išsineša": kortelės iš config.values ---------- */
  function renderValues() {
    var box = $('#values'), V = CFG.values; if (!box || !V || !V.length) return;
    box.innerHTML = '';
    V.forEach(function (v) {
      var a = el('article', 'value');
      if (v.icon && /^[\w.-]+\.svg$/.test(v.icon)) { var im = el('img'); im.src = 'assets/icons/' + v.icon; im.alt = ''; im.loading = 'lazy'; a.appendChild(im); }
      var d = el('div'); d.appendChild(el('h3', '', v.title || '')); d.appendChild(el('p', '', v.text || '')); a.appendChild(d);
      box.appendChild(a);
    });
  }

  /* ---------- programa: 4 pamokos iš config.program ---------- */
  function renderProgram() {
    var ol = $('#program'), P = CFG.program; if (!ol || !P || !P.length) return;
    ol.innerHTML = '';
    P.forEach(function (p, i) {
      var li = el('li', 'prog-item' + (p.img ? ' has-img' : ''));
      var n = el('span', 'prog-n', String(i + 1)); n.setAttribute('aria-hidden', 'true'); li.appendChild(n);
      var d = el('div'); d.appendChild(el('h3', '', p.title || '')); d.appendChild(el('p', '', p.text || '')); li.appendChild(d);
      if (p.img) { var im = el('img'); im.src = p.img; im.alt = p.imgAlt || ''; im.width = 800; im.height = 533; im.loading = 'lazy'; im.decoding = 'async'; li.appendChild(im); }
      ol.appendChild(li);
    });
  }

  /* ---------- mokyklos: kortelės + formos sąrašas iš config.schools ----------
     exoUrl užpildyta → mygtukas veda tiesiai į ExoClass; tuščia → į rezervacijos formą su pažymėta mokykla */
  var SCHOOLS = CFG.schools || [];
  function dayLine(s) { return s.dayTime ? s.dayTime : (CFG.dayTimeEmpty || ''); }
  function renderSchools() {
    var list = $('#school-list'), sel = $('#school_pick');
    if (list && SCHOOLS.length) {
      list.innerHTML = '';
      SCHOOLS.forEach(function (s, i) {
        var li = el('li', 'school-card'); li.appendChild(el('b', '', s.name)); li.appendChild(el('span', s.dayTime ? 'dt is-set' : 'dt', dayLine(s)));
        var a = el('a', 'btn btn-yellow btn-sm', (CFG.ctas && CFG.ctas.primaryShort) || 'Rezervuoti'), exo = safeUrl(s.exoUrl);
        if (exo) { a.href = exo; a.rel = 'noopener'; a.setAttribute('data-cta', 'school-exo-' + (i + 1)); }
        else { a.href = '#sarasas'; a.setAttribute('data-cta', 'school-' + (i + 1)); a.setAttribute('data-school', String(i + 1)); }
        li.appendChild(a); list.appendChild(li);
      });
      var o = el('li', 'school-card other'); o.appendChild(el('b', '', CFG.schoolOtherLabel || 'Kita mokykla'));
      o.appendChild(el('span', 'dt', 'Įrašysime į sąrašą ir parašysime, jei jūsų mokykloje susirinks grupė.'));
      var oa = el('a', 'btn btn-white btn-sm', 'Įrašyti mano mokyklą'); oa.href = '#sarasas'; oa.setAttribute('data-cta', 'school-other'); oa.setAttribute('data-school', 'kita');
      o.appendChild(oa); list.appendChild(o);
    }
    if (sel && SCHOOLS.length) {
      sel.innerHTML = '';
      var f = el('option', '', 'Pasirinkite'); f.value = ''; sel.appendChild(f);
      SCHOOLS.forEach(function (s, i) { var op = el('option', '', s.name); op.value = String(i + 1); sel.appendChild(op); });
      var ko = el('option', '', CFG.schoolOtherLabel || 'Kita mokykla'); ko.value = 'kita'; sel.appendChild(ko);
    }
  }

  /* ---------- mentoriai: nuotrauka, jei config'e yra, kitaip inicialai ---------- */
  function renderMentors() {
    var ul = $('#mentor-cards'), M = CFG.mentors; if (!ul || !M || !M.length) return;
    ul.innerHTML = '';
    M.forEach(function (m) {
      var li = el('li', 'mentor-card'), photo = m.photo && (/^https:\/\//i.test(m.photo) || /^assets\//.test(m.photo)) ? m.photo : '';
      if (photo) { var im = el('img', 'avatar'); im.src = photo; im.alt = m.name; im.width = 96; im.height = 96; im.loading = 'lazy'; li.appendChild(im); }
      else {
        var ini = (m.name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
        var av = el('span', 'avatar', ini); av.setAttribute('aria-hidden', 'true'); li.appendChild(av);
      }
      var d = el('div'); d.appendChild(el('b', '', m.name)); d.appendChild(el('span', '', m.bio || m.role || '')); li.appendChild(d);
      ul.appendChild(li);
    });
  }

  /* ---------- įžanginis video: kol youtubeId tuščias, sekcijos nėra ---------- */
  function renderIntroVideo() {
    var sec = $('#video'), fig = $('#intro-fig'), v = CFG.introVideo || {};
    if (!sec || !fig) return;
    var ok = /^[\w-]{11}$/.test(v.youtubeId || '');
    sec.hidden = !ok;
    if (ok) { fig.setAttribute('data-yt', v.youtubeId); var ai = $('#intro-ai-voice'); if (ai) ai.hidden = !v.aiVoice; }
    else sec.remove();
  }
  render();

  /* ---------- oficialūs Minecraft Education video: YouTube grotuvas įkeliamas tik paspaudus (taisyklė 16) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.mcv[data-yt]'), function (fig) {
    var btn = fig.querySelector('.mcv-play'); if (!btn) return;
    btn.addEventListener('click', function () {
      var id = fig.getAttribute('data-yt');
      if (!/^[\w-]{11}$/.test(id)) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&hl=lt&cc_lang_pref=lt&cc_load_policy=1';
      var intro = fig.id === 'intro-fig';
      f.title = fig.getAttribute('data-yt-title') || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      btn.replaceWith(f);
      track('engage', intro ? { intro_video: id } : { mce_video: id });
    });
  });

  /* ---------- bendras sekimas: CTA, nuorodos, DUK, skirtukai (vienas įvykis per paspaudimą) ---------- */
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-cta]');
    if (cta) { track('cta', { id: cta.getAttribute('data-cta') }); return; }
    var t = e.target.closest('[data-track]');
    var a = e.target.closest('a[href]');
    var p = {};
    if (t && t.tagName !== 'DETAILS') p.what = t.getAttribute('data-track');
    if (a) {
      var href = a.getAttribute('href') || '';
      if (/^mailto:/i.test(href)) p.mailto = 1;
      else if (/^https?:/i.test(href)) { try { var h = new URL(href).hostname.replace(/^www\./, ''); if (h !== location.hostname) p.outbound = h.slice(0, 40); } catch (x) {} }
    }
    if (Object.keys(p).length) track('engage', p);
  }, true);
  document.addEventListener('toggle', function (e) {
    var d = e.target; if (!d || d.tagName !== 'DETAILS' || !d.open) return;
    if (d.dataset.prog) { delete d.dataset.prog; return; }   /* atidarė kodas, ne lankytojas */
    if (d.hasAttribute('data-faq')) track('engage', { faq: d.getAttribute('data-faq') });
    else if (d.classList.contains('mce-item')) track('engage', { mce: d.getAttribute('data-mce') || 'x' });
    else if (d.id === 'saltiniai') track('engage', { sources: 'open' });
    else if (d.id === 'klases') track('engage', { grades: 'open' });
    else if (d.id === 'privatumas') track('engage', { privacy_note: 'open' });
  }, true);
  function progOpen(d, on) { if (!d || d.open === on) return; if (on) d.dataset.prog = '1'; d.open = on; }

  /* ---------- sekcijų matomumas: atskiras „view" įvykis, ne engage ---------- */
  if ('IntersectionObserver' in window) {
    var seen = {};
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var id = en.target.getAttribute('data-section');
        if (en.isIntersecting && !seen[id]) { seen[id] = 1; track('view', { section: id }); so.unobserve(en.target); }
      });
    }, { threshold: 0.25 });
    $$('[data-section]').forEach(function (s) { so.observe(s); });
  }

  /* ---------- išskleidžiamos kortelės (mobilus) ---------- */
  var DESK = innerWidth >= 760;
  function setOpen(holder, btn, on) { holder.classList.toggle('is-open', on); btn.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  function toggler(sel, holderSel, key) {
    $$(sel).forEach(function (b, i) {
      var holder = b.closest(holderSel);
      if (DESK) setOpen(holder, b, true);
      b.addEventListener('click', function () {
        if (innerWidth >= 760) return;
        var on = !holder.classList.contains('is-open');
        setOpen(holder, b, on);
        if (on) { var p = {}; p[key] = i + 1; track('engage', p); }
      });
    });
  }
  toggler('.ph', '.pillar', 'pillar');
  toggler('.wef .wh', '.wef li', 'wef');
  var firstPillar = $('.pillar .ph');
  $$('.m-details').forEach(function (d) { progOpen(d, DESK); d.addEventListener('toggle', function () { if (d.open && !DESK && !d.dataset.prog) track('engage', { more: d.id }); }); });
  $$('.more-lines').forEach(function (d) { if (DESK) progOpen(d, true); d.addEventListener('toggle', function () { if (d.open && !DESK) track('engage', { more: d.id }); }); });
  var wefMore = $('#wef-more'); if (wefMore) wefMore.addEventListener('click', function () { $('.wef').classList.add('is-all'); wefMore.hidden = true; });
  var faqMore = $('#faq-more'); if (faqMore) faqMore.addEventListener('click', function () { $('.faq').classList.add('is-all'); faqMore.hidden = true; });
  var stepsMore = $('#steps-more'); if (stepsMore) stepsMore.addEventListener('click', function () { $('#steps').classList.add('is-all'); stepsMore.hidden = true; track('engage', { steps: 'all' }); });
  /* nuoroda į paslėptą DUK (pvz. „Kas kuria programą" iš mentoriaus eilutės) atidaro jį */
  $$('a[href^="#faq-"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = $(a.getAttribute('href')); if (!d) return;
      $('.faq').classList.add('is-all'); if (faqMore) faqMore.hidden = true; d.open = true;
    });
  });

  /* ---------- amžiaus ir klasės perjungikliai ---------- */
  var dna = $('#dna');
  $$('.age-switch button').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-age');
      dna.setAttribute('data-age', v);
      $$('.age-switch button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      /* mobiliajame paspaudimas turi būti matomas: jei nė viena kortelė neatidaryta, atidarome pirmą */
      if (innerWidth < 760 && !$('.pillar.is-open') && firstPillar) setOpen(firstPillar.closest('.pillar'), firstPillar, true);
      track('engage', { age: v });
    });
  });
  var grades = $('#klases');
  if (grades) {
    $$('.switch button', grades).forEach(function (b) {
      b.addEventListener('click', function () {
        grades.setAttribute('data-g', b.getAttribute('data-g'));
        $$('.switch button', grades).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        track('engage', { grade: b.getAttribute('data-g') });
      });
    });
    if (innerWidth >= 900) progOpen(grades, true);
  }
  if (innerWidth < 760) {
    /* mobilus: Minecraft Education paaiškinimai keliauja į DUK (ta pati informacija, trumpesnis puslapis):
       pirmasis po „Vaikas ir taip daug žaidžia", kiti du į sąrašo galą */
    var faqWrap = $('.faq .wrap'), faqMoreBtn = $('#faq-more'), items = $$('.mce-item');
    items.forEach(function (d, i) { d.removeAttribute('open'); d.setAttribute('data-faq', 'mce-' + (i + 1)); });
    if (faqWrap && faqMoreBtn) {
      var after = $('[data-faq="too_much_gaming"]', faqWrap);
      if (items[0]) { if (after && after.nextSibling) faqWrap.insertBefore(items[0], after.nextSibling); else faqWrap.insertBefore(items[0], faqMoreBtn); }
      items.slice(1).forEach(function (d) { faqWrap.insertBefore(d, faqMoreBtn); });
    }
  }

  /* ---------- mini žaidimas: Daugybos tvirtovė (4×6), roving tabindex ---------- */
  var game = $('#game'), fort = $('#fort'), gcount = $('#g-count'), filled = 0, played = false, slots = [];
  if (fort) {
    for (var i = 0; i < 24; i++) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'slot';
      b.setAttribute('aria-label', 'Blokas ' + (i + 1) + ' iš 24'); b.setAttribute('aria-pressed', 'false');
      b.tabIndex = i === 0 ? 0 : -1; fort.appendChild(b); slots.push(b);
    }
    function confetti() {
      if (RM) return;
      var cols = ['#6CC644', '#FEC404', '#6FEFF5', '#A0703F', '#B3B3B3', '#fff'];
      for (var i = 0; i < 26; i++) {
        var c = document.createElement('span'); c.className = 'conf';
        c.style.setProperty('--x', (8 + Math.random() * 84) + '%'); c.style.setProperty('--c', cols[i % cols.length]);
        c.style.setProperty('--dx', ((Math.random() - .5) * 160) + 'px'); c.style.setProperty('--dy', (-80 - Math.random() * 160) + 'px');
        c.style.animationDelay = (Math.random() * .25) + 's'; game.appendChild(c);
        setTimeout(function (el) { return function () { el.remove(); }; }(c), 1600);
      }
    }
    function fill(s) {
      if (s.classList.contains('on')) return;
      s.classList.add('on'); s.setAttribute('aria-pressed', 'true'); filled++; gcount.textContent = filled + ' / 24';
      if (!played) { played = true; track('engage', { game: 'start' }); }
      if (filled === 24) { game.classList.add('is-open'); confetti(); track('engage', { game: 'done' }); }
    }
    fort.addEventListener('click', function (e) { var s = e.target.closest('.slot'); if (s) fill(s); });
    fort.addEventListener('keydown', function (e) {
      var s = e.target.closest('.slot'); if (!s) return;
      var i = slots.indexOf(s), n = -1;
      if (e.key === 'ArrowRight') n = Math.min(23, i + 1); else if (e.key === 'ArrowLeft') n = Math.max(0, i - 1);
      else if (e.key === 'ArrowDown') n = Math.min(23, i + 6); else if (e.key === 'ArrowUp') n = Math.max(0, i - 6);
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fill(s); return; }
      if (n >= 0) { e.preventDefault(); slots[i].tabIndex = -1; slots[n].tabIndex = 0; slots[n].focus(); }
    });
    $('#g-reset').addEventListener('click', function () {
      slots.forEach(function (s) { s.classList.remove('on'); s.setAttribute('aria-pressed', 'false'); });
      filled = 0; gcount.textContent = '0 / 24'; game.classList.remove('is-open'); track('engage', { game: 'reset' });
    });
  }

  /* ---------- lipni juosta (stovi virš sutikimo juostos, jos neslepia) ---------- */
  var sticky = $('#sticky'), hero = $('.hero'), join = $('#sarasas'), pastHero = false, atForm = false;
  function sync() {
    var on = pastHero && !atForm;
    sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', on ? 'false' : 'true'); sticky.inert = !on;
    document.body.classList.toggle('has-sticky', on);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; sync(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (es) { atForm = es[0].isIntersecting; sync(); }, { threshold: .15 }).observe(join);
  }
  sync();

  /* ---------- formų skirtukai: Tėvams / Mokyklai (kairė skiltis keičiasi kartu) ---------- */
  var wl = $('#waitlist'), org = $('#orgform');
  function showTab(t, viaHash) {
    $$('.tabs button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tab') === t ? 'true' : 'false'); });
    wl.hidden = t !== 'tevai'; org.hidden = t !== 'istaiga';
    $$('[data-aside]').forEach(function (a) { a.hidden = a.getAttribute('data-aside') !== t; });
    if (!viaHash) track('engage', { tab: t });
  }
  $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); }); });
  function hashTab() { if (location.hash === '#mokykloms') showTab('istaiga', true); else if (location.hash === '#sarasas') showTab('tevai', true); }
  window.addEventListener('hashchange', hashTab); hashTab();
  $$('a[href="#mokykloms"]').forEach(function (a) { a.addEventListener('click', function () { showTab('istaiga', true); }); });
  $$('a[href="#sarasas"]').forEach(function (a) { a.addEventListener('click', function () { showTab('tevai', true); }); });

  /* ---------- bendri formų įrankiai ---------- */
  function err(form, name, on, focusEl) {
    var e = form.querySelector('[data-err="' + name + '"]'); if (e) e.classList.toggle('is-on', !!on);
    if (on) track('engage', { form_error: name, form: form.id });
    if (on && focusEl) focusEl.focus();
  }
  function val(form, name) {
    var els = form.querySelectorAll('[name="' + name + '"]'); if (!els.length) return '';
    if (els[0].type === 'radio') { var c = form.querySelector('[name="' + name + '"]:checked'); return c ? c.value : ''; }
    if (els[0].type === 'checkbox') return $$('[name="' + name + '"]:checked', form).map(function (x) { return x.value; }).join(',');
    return els[0].value.trim();
  }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function phoneOk(p) { var d = p.replace(/[^\d+]/g, ''); return d.length >= 8 && d.length <= 16; }
  function post(payload) {
    return fetch(CFG.supabase.url, {
      method: 'POST',
      headers: { 'apikey': CFG.supabase.key, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify(payload)
    });
  }
  function done(form, label) {
    $$('.fstep', form).forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-step') === 'done'); });
    $$('.progress span', form).forEach(function (s) { s.classList.add('done'); });
    var c = form.querySelector('[aria-live]'); if (c) c.textContent = label;
    var h = form.querySelector('.thanks h3'); if (h) { h.focus(); }
    form.scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' });
  }
  /* dalinimasis: native share'ą suskaičiuoja track.js, kopijavimą suskaičiuojame čia (vienas įvykis per paspaudimą) */
  function shareInit(btn, text) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var url = (CFG.siteUrl || location.href.split('#')[0].split('?')[0]) + '?src=share';
      if (navigator.share) { navigator.share({ title: document.title, text: text, url: url }).catch(function () {}); return; }
      track('share', { how: 'copy' });
      if (navigator.clipboard) { navigator.clipboard.writeText(url).then(function () { btn.textContent = 'Nuoroda nukopijuota'; }).catch(function () {}); }
    });
  }

  /* ---------- tėvų forma „Rezervuoti vietą": 3 žingsniai (mokykla ir klasė · kontaktai · sutikimas) ---------- */
  var steps = $$('.fstep', wl), pslots = $$('.progress span', wl), count = $('#f-count'), cur = 1, stepsSeen = {};
  var names = { 1: 'Mokykla', 2: 'Kontaktai', 3: 'Sutikimas' }, LAST = 3;
  function clearErrs(form) { $$('.err.is-on', form).forEach(function (e) { e.classList.remove('is-on'); }); $$('[aria-invalid="true"]', form).forEach(function (i) { i.setAttribute('aria-invalid', 'false'); }); }
  function show(n, fromHistory) {
    clearErrs(wl);
    steps.forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-step') === String(n)); });
    pslots.forEach(function (s, i) { s.classList.toggle('done', i < n - 1); });
    count.textContent = n + ' iš ' + LAST + ' · ' + names[n];
    cur = n;
    if (!fromHistory && history.pushState) { try { history.pushState({ raStep: n }, '', '#sarasas'); } catch (e) {} }
    var top = wl.getBoundingClientRect().top;
    if (top < 70 || top > innerHeight * .5) wl.scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' });
    var h = $('.fstep.is-on h3', wl); if (h) h.focus({ preventScroll: true });
  }
  window.addEventListener('popstate', function (e) {
    var s = e.state && e.state.raStep;
    if (s && s !== cur && steps.length) show(s, true);
    else if (!s && cur > 1 && !wl.hidden) show(1, true);
  });

  /* mokyklos pasirinkimas: „Kita mokykla" atidaro laisvo teksto lauką; prie pasirinktos mokyklos rodoma diena/valanda
     ir, jei yra, ExoClass registracijos nuoroda */
  var sel = $('#school_pick'), otherBox = $('#school-other'), note = $('#school-note');
  function school() { var p = val(wl, 'school_pick'); return p && p !== 'kita' ? SCHOOLS[+p - 1] || null : null; }
  function onSchool() {
    var p = sel.value, s = school();
    otherBox.classList.toggle('is-on', p === 'kita');
    note.textContent = '';
    if (s) {
      note.appendChild(document.createTextNode(dayLine(s)));
      var exo = safeUrl(s.exoUrl);
      if (exo) { note.appendChild(document.createTextNode(' ')); var a = el('a', '', 'Registruotis ir apmokėti iš karto'); a.href = exo; a.rel = 'noopener'; a.setAttribute('data-cta', 'form-exo-' + p); note.appendChild(a); }
    } else if (p === 'kita') note.textContent = 'Įrašysime jus į laukiančiųjų sąrašą ir parašysime, jei jūsų mokykloje susirinks grupė.';
  }
  sel.addEventListener('change', function () { onSchool(); if (sel.value === 'kita') $('#school_other').focus(); });
  function pickSchool(v) { if (!v) return; sel.value = v; if (sel.value !== v) return; onSchool(); }
  $$('[data-school]').forEach(function (a) { a.addEventListener('click', function () { pickSchool(a.getAttribute('data-school')); }); });
  /* ?mokykla=1…6 arba ?mokykla=kita (QR kiekvienai mokyklai) */
  try { var qm = new URLSearchParams(location.search).get('mokykla'); if (qm && /^(\d{1,2}|kita)$/.test(qm)) pickSchool(qm); } catch (e) {}

  function validate(n) {
    var ok = true;
    if (n === 1) {
      if (!val(wl, 'school_pick')) { sel.setAttribute('aria-invalid', 'true'); err(wl, 'school_pick', 1, sel); ok = false; } else { sel.setAttribute('aria-invalid', 'false'); err(wl, 'school_pick', 0); }
      var oEl = $('#school_other');
      if (val(wl, 'school_pick') === 'kita' && !val(wl, 'school_other')) { oEl.setAttribute('aria-invalid', 'true'); err(wl, 'school_other', 1, ok ? oEl : null); ok = false; }
      else { oEl.setAttribute('aria-invalid', 'false'); err(wl, 'school_other', 0); }
      if (!val(wl, 'child_age')) { err(wl, 'child_age', 1, ok ? $('[name="child_age"]', wl) : null); ok = false; } else err(wl, 'child_age', 0);
    }
    if (n === 2) {
      var nm = val(wl, 'parent_name'), nEl = $('#parent_name');
      nEl.setAttribute('aria-invalid', nm ? 'false' : 'true'); err(wl, 'parent_name', !nm, nm ? null : nEl); if (!nm) ok = false;
      var em = val(wl, 'email'), eEl = $('#email'); var good = EMAIL.test(em) && em.length <= 160;
      eEl.setAttribute('aria-invalid', good ? 'false' : 'true'); err(wl, 'email', !good, nm && !good ? eEl : null); if (!good) ok = false;
      var ph = val(wl, 'phone'), pEl = $('#phone'); var pgood = !ph || phoneOk(ph);
      pEl.setAttribute('aria-invalid', pgood ? 'false' : 'true'); err(wl, 'phone', !pgood, (ok && !pgood) ? pEl : null); if (!pgood) ok = false;
    }
    if (n === 3) { if (!val(wl, 'consent_contact')) { err(wl, 'consent_contact', 1, $('[name="consent_contact"]', wl)); ok = false; } else err(wl, 'consent_contact', 0); }
    return ok;
  }
  function next() { if (validate(cur)) { if (!stepsSeen[cur]) { stepsSeen[cur] = 1; track('engage', { form_step: cur }); } show(cur + 1); } }
  wl.addEventListener('click', function (e) {
    if (e.target.closest('[data-next]')) next();
    if (e.target.closest('[data-back]')) { track('engage', { form_back: cur }); show(cur - 1); }
  });
  /* Enter teksto lauke: į kitą matomą lauką to paties žingsnio viduje; paskutiniame = kitas žingsnis. */
  wl.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (t.closest('.hp')) { e.preventDefault(); return; }
    if (t.tagName === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio' && cur !== LAST) {
      e.preventDefault();
      var step = t.closest('.fstep');
      var inputs = $$('input[type=text],input[type=email],input[type=tel]', step).filter(function (i) { return i.offsetParent !== null && !i.closest('.hp'); });
      var i = inputs.indexOf(t);
      if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus(); else next();
    }
  });
  wl.addEventListener('change', function () { if (!stepsSeen.start) { stepsSeen.start = 1; track('engage', { form_start: 1 }); } });
  function thanks(isOther) {
    var t = $('#thanks-text'); if (t) t.textContent = isOther ? (CFG.successOtherText || '') : (CFG.successText || '');
    done(wl, isOther ? 'Įrašyta į laukiančiųjų sąrašą' : 'Vieta rezervuota');
  }
  wl.addEventListener('submit', function (e) {
    e.preventDefault();
    if (cur !== LAST) { next(); return; }
    if (!validate(LAST)) return;
    var btn = $('#submit-btn'); btn.disabled = true; btn.textContent = 'Siunčiama…'; err(wl, 'submit', 0);
    var pick = val(wl, 'school_pick'), isOther = pick === 'kita', s = school();
    if (val(wl, 'website')) { thanks(isOther); return; }
    var payload = {
      product: 'minecraft', lead_type: 'tevai', page_version: VERSION,
      parent_name: val(wl, 'parent_name').slice(0, 80),
      email: val(wl, 'email').toLowerCase(),
      phone: (val(wl, 'phone') || '').slice(0, 30) || null,
      child_age: val(wl, 'child_age'),
      city: isOther ? 'nenurodyta' : 'Vilnius',
      location_pref: 'mokykla',
      kindergarten_name: (isOther ? val(wl, 'school_other') : (s ? s.name : '')).slice(0, 120),
      interest: isOther ? 'kk-laukiantys' : 'kk-rezervacija',
      src: SRC, consent_contact: true, consent_text_version: CONSENT_VERSION
    };
    post(payload).then(function (r) {
      if (r.status === 201) {
        track('value', { step: isOther ? 'waitlist_submit' : 'reserve_submit', klase: payload.child_age, mokykla: isOther ? 'kita' : pick });
        thanks(isOther);
      } else { throw new Error('status ' + r.status); }
    }).catch(function (ex) {
      track('error', { where: 'reserve', msg: String(ex && ex.message || ex).slice(0, 60) });
      err(wl, 'submit', 1); btn.disabled = false; btn.textContent = 'Rezervuoti vietą';
    });
  });
  shareInit($('#share-btn'), 'Kūrėjų klubas: Minecraft ir programavimas 1–4 klasei, Robotikos akademijos būrelis vaiko mokykloje.');

  /* ---------- mokyklos forma: 1 žingsnis, el. paštas būtinas, telefonas pasirinktinai ---------- */
  var orgSeen = false;
  org.addEventListener('change', function () { if (!orgSeen) { orgSeen = true; track('engage', { org_form_start: 1 }); } });
  org.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (t.closest('.hp')) { e.preventDefault(); return; }
    if (t.tagName === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio') {
      e.preventDefault();
      /* Enter = kitas matomas laukas; paskutiniame (telefonas) = siųsti. Spąstų laukas niekada negauna fokuso. */
      var inputs = $$('input[type=text],input[type=email],input[type=tel],select', org).filter(function (i) { return i.offsetParent !== null && !i.closest('.hp'); });
      var i = inputs.indexOf(t);
      if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus();
      else if (org.requestSubmit) org.requestSubmit(); else $('#org-submit').click();
    }
  });
  org.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrs(org);
    var ok = true, first = null;
    function bad(name, el) { err(org, name, 1); if (el) { el.setAttribute('aria-invalid', 'true'); if (!first) first = el; } ok = false; }
    if (!val(org, 'org_role')) bad('org_role', $('#org_role'));
    if (!val(org, 'org_name')) bad('org_name', $('#org_name'));
    if (!val(org, 'org_city')) bad('org_city', $('#org_city'));
    var em = val(org, 'org_email'), ph = val(org, 'org_phone');
    if (!(em && EMAIL.test(em) && em.length <= 160)) bad('org_email', $('#org_email'));
    if (ph && !phoneOk(ph)) bad('org_phone', $('#org_phone'));
    if (!val(org, 'org_consent')) bad('org_consent', $('[name="org_consent"]', org));
    if (!ok) { if (first) first.focus(); return; }
    var btn = $('#org-submit'); btn.disabled = true; btn.textContent = 'Siunčiama…'; err(org, 'org_submit', 0);
    if (val(org, 'website')) { done(org, 'Ačiū'); return; }
    var payload = {
      product: 'minecraft', lead_type: 'istaiga', page_version: VERSION,
      org_role: val(org, 'org_role').slice(0, 60),
      org_name: val(org, 'org_name').slice(0, 160),
      org_size: val(org, 'org_size') || null,
      city: val(org, 'org_city').slice(0, 120),
      location_pref: 'mokykla',
      parent_name: (val(org, 'org_contact_name') || '').slice(0, 80) || null,
      email: em.toLowerCase(),
      phone: ph ? ph.slice(0, 30) : null,
      src: SRC, consent_contact: true, consent_text_version: CONSENT_VERSION
    };
    post(payload).then(function (r) {
      if (r.status === 201) { track('value', { step: 'org_submit', role: payload.org_role, size: payload.org_size || 'nenurodė' }); done(org, 'Ačiū'); }
      else throw new Error('status ' + r.status);
    }).catch(function (ex) {
      track('error', { where: 'orgform', msg: String(ex && ex.message || ex).slice(0, 60) });
      err(org, 'org_submit', 1); btn.disabled = false; btn.textContent = 'Pakviesti į mokyklą';
    });
  });
  shareInit($('#org-share-btn'), 'Kūrėjų klubas mokyklai: Minecraft ir programavimas 1–4 klasei, Robotikos akademijos bandomasis būrelis.');

  /* ---------- judesys: antraštės žodžiai kyla CSS animacija (nuo pirmo piešimo, be GSAP); GSAP tik RAbotukui,
     burbului ir švelniems atskleidimams slenkant. Pradinės RAbotuko/burbulo būsenos CSS (html.js-motion). ---------- */
  var root = document.documentElement;
  function motion() {
    if (!window.gsap || RM) { root.classList.remove('js-motion'); return; }
    var mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: function () { root.classList.remove('js-motion'); } });
      tl.to('.hero .robot', { y: 0, autoAlpha: 1, rotation: 0, duration: .7, ease: 'back.out(1.6)' }, .25)
        .to('.hero .bubble', { scale: 1, autoAlpha: 1, duration: .45, ease: 'back.out(2)', transformOrigin: '100% 100%' }, .7);
      gsap.to('.hero .robot img', { y: -6, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 });
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.batch('.prog-item, .value, .school-card, .mentor-card, .safe-item, .num, .price, .tile, .mcr', {
          start: 'top 88%', once: true,
          onEnter: function (els) { gsap.from(els, { y: 22, autoAlpha: 0, duration: .6, stagger: .06, ease: 'power3.out', overwrite: true, clearProps: 'transform,opacity,visibility' }); }
        });
        gsap.from('.cycle .blk', { scale: .6, autoAlpha: 0, duration: .35, ease: 'back.out(1.7)', stagger: .1, scrollTrigger: { trigger: '.cycle', start: 'top 85%', once: true } });
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', motion); else motion();
  /* jei GSAP neatkeliavo (CDN), antraštė vis tiek matoma */
  setTimeout(function () { if (!window.gsap) root.classList.remove('js-motion'); }, 2500);
})();
