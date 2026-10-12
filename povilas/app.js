/* Žaidimų kūrėjai v2 · puslapio logika: config → DOM, sekimas, forma, žaidimas, judesys */
(function () {
  'use strict';
  var CFG = window.RA_CFG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var SRC = window.RA_SRC || 'direct';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CONSENT_VERSION = 'v2';
  var NB = ' ';

  /* ---------- sekimas: kiekvienas įvykis su version + src ----------
     cta    = paspaudė mygtuką link formos ar telefono
     engage = TIK lankytojo veiksmas (DUK, kortelė, žaidimas, formos žingsnis, klaida)
     view   = automatinis signalas (sekcija pasirodė ekrane), skaičiuojamas atskirai
     value  = užklausa išsiųsta (waitlist_submit / org_submit)                       */
  function track(n, p) {
    if (!window.bt) return;
    try { window.bt(n, Object.assign({ version: 'v2', src: SRC }, p || {})); } catch (e) {}
  }

  /* ---------- config → DOM ---------- */
  function eur(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.00', '').replace('.', ',') + NB + '€'; }
  function get(path) {
    var m = path.split('.');
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
    if (CFG.testimonials && $('#quotes')) {
      var q = $('#quotes'), cards = $$('.quote', q), allPlaceholders = true;
      CFG.testimonials.forEach(function (t, i) {
        var c = cards[i]; if (!c) return;
        c.querySelector('.who b').textContent = t.who || '';
        c.querySelector('.who small').textContent = t.meta || '';
        c.querySelector('p').textContent = t.text || '';
        if (!t.placeholder) { allPlaceholders = false; c.classList.add('is-real'); var tag = c.querySelector('.tag'); if (tag) tag.remove(); }
      });
      var hideFor = CFG.placeholdersHideSrc || [];
      var hide = allPlaceholders && hideFor.some(function (p) { return SRC.indexOf(p) === 0; });
      var qw = $('#quotes-wrap'); if (qw) { qw.hidden = hide; if (!allPlaceholders) qw.classList.add('has-real'); }
    }
    /* startas: data iš config (jei yra) arba sąžininga eilutė */
    var st = $('#start-line');
    if (st && CFG.start && CFG.start.date) { st.textContent = ''; var sb = document.createElement('b'); sb.textContent = 'Startas: ' + CFG.start.date; st.appendChild(sb); }
    /* tvarkaraščio laikai (kai config'e yra) → spaudžiamos kortelės prie kainos, pažymi dieną formoje */
    var sl = CFG.schedule && CFG.schedule.slots, box = $('#slots');
    if (sl && sl.length && box) {
      box.hidden = false;
      sl.forEach(function (s) {
        var b = document.createElement('a'); b.className = 'slot-chip'; b.href = '#sarasas'; b.setAttribute('data-cta', 'slot');
        if (s.dayCode) b.setAttribute('data-day', s.dayCode);
        b.textContent = [s.place, s.day, s.time, s.status ? '(' + s.status + ')' : ''].filter(Boolean).join(' · ');
        b.addEventListener('click', function () { var cb = $('[name="preferred_day"][value="' + (s.dayCode || '') + '"]'); if (cb) cb.checked = true; });
        box.appendChild(b);
      });
    }
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
      f.title = fig.getAttribute('data-yt-title') || 'Minecraft Education video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      btn.replaceWith(f);
      track('engage', { mce_video: id });
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

  /* ---------- tėvų forma: 4 žingsniai, žingsniai įrašomi į naršyklės istoriją ---------- */
  var steps = $$('.fstep', wl), pslots = $$('.progress span', wl), count = $('#f-count'), cur = 1, stepsSeen = {};
  var names = { 1: 'Vaikas', 2: 'Vieta', 3: 'Kontaktai', 4: 'Sutikimas' };
  function clearErrs(form) { $$('.err.is-on', form).forEach(function (e) { e.classList.remove('is-on'); }); $$('[aria-invalid="true"]', form).forEach(function (i) { i.setAttribute('aria-invalid', 'false'); }); }
  function show(n, fromHistory) {
    clearErrs(wl);
    steps.forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-step') === String(n)); });
    pslots.forEach(function (s, i) { s.classList.toggle('done', i < n - 1); });
    count.textContent = n + ' iš 4 · ' + names[n];
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
  function city() { var p = val(wl, 'city_pick'); return p === 'kitas' ? val(wl, 'city') : p; }
  var cityOther = $('#city-other'), schoolField = $('#school-field');
  $$('[name="city_pick"]', wl).forEach(function (r) { r.addEventListener('change', function () { cityOther.classList.toggle('is-on', r.value === 'kitas'); if (r.value === 'kitas') $('#city').focus(); }); });
  $$('[name="location_pref"]', wl).forEach(function (r) {
    r.addEventListener('change', function () {
      schoolField.classList.toggle('is-on', r.value === 'mokykla');
      var cityRadios = $$('[name="city_pick"]', wl);
      if (r.value === 'techzity') { cityRadios.forEach(function (c) { c.checked = c.value === 'Vilnius'; c.disabled = c.value !== 'Vilnius'; }); cityOther.classList.remove('is-on'); }
      else cityRadios.forEach(function (c) { c.disabled = false; });
    });
  });
  function validate(n) {
    var ok = true;
    if (n === 1) { if (!val(wl, 'child_age')) { err(wl, 'child_age', 1, $('[name="child_age"]', wl)); ok = false; } else err(wl, 'child_age', 0); }
    if (n === 2) {
      if (!val(wl, 'location_pref')) { err(wl, 'location_pref', 1, $('[name="location_pref"]', wl)); ok = false; } else err(wl, 'location_pref', 0);
      /* mokykloje: mokyklos pavadinimas būtinas, nes grupė atsiranda tik mokyklai pakvietus */
      var needSchool = val(wl, 'location_pref') === 'mokykla', sEl = $('#kindergarten_name');
      if (needSchool && !val(wl, 'kindergarten_name')) { sEl.setAttribute('aria-invalid', 'true'); err(wl, 'kindergarten_name', 1, ok ? sEl : null); ok = false; }
      else { sEl.setAttribute('aria-invalid', 'false'); err(wl, 'kindergarten_name', 0); }
      if (!city()) { err(wl, 'city', 1, ok ? $('[name="city_pick"]', wl) : null); ok = false; } else err(wl, 'city', 0);
    }
    if (n === 3) {
      var em = val(wl, 'email'), eEl = $('#email'); var good = EMAIL.test(em) && em.length <= 160;
      eEl.setAttribute('aria-invalid', good ? 'false' : 'true'); err(wl, 'email', !good, good ? null : eEl); if (!good) ok = false;
      var ph = val(wl, 'phone'), pEl = $('#phone'); var pgood = !ph || phoneOk(ph);
      pEl.setAttribute('aria-invalid', pgood ? 'false' : 'true'); err(wl, 'phone', !pgood, (good && !pgood) ? pEl : null); if (!pgood) ok = false;
    }
    if (n === 4) { if (!val(wl, 'consent_contact')) { err(wl, 'consent_contact', 1, $('[name="consent_contact"]', wl)); ok = false; } else err(wl, 'consent_contact', 0); }
    return ok;
  }
  function next() { if (validate(cur)) { if (!stepsSeen[cur]) { stepsSeen[cur] = 1; track('engage', { form_step: cur }); } show(cur + 1); } }
  wl.addEventListener('click', function (e) {
    if (e.target.closest('[data-next]')) next();
    if (e.target.closest('[data-back]')) { track('engage', { form_back: cur }); show(cur - 1); }
  });
  /* Enter (klaviatūros „Toliau") teksto lauke: į kitą matomą lauką to paties žingsnio viduje; paskutiniame = kitas žingsnis.
     Tikriname tik paspaudus „Toliau" arba paskutiniame lauke, kad klaidos nerodytume per anksti. */
  wl.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (t.closest('.hp')) { e.preventDefault(); return; }
    if (t.tagName === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio' && cur !== 4) {
      e.preventDefault();
      var step = t.closest('.fstep');
      var inputs = $$('input[type=text],input[type=email],input[type=tel]', step).filter(function (i) { return i.offsetParent !== null && !i.closest('.hp'); });
      var i = inputs.indexOf(t);
      if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus(); else next();
    }
  });
  wl.addEventListener('change', function () { if (!stepsSeen.start) { stepsSeen.start = 1; track('engage', { form_start: 1 }); } });
  wl.addEventListener('submit', function (e) {
    e.preventDefault();
    if (cur !== 4) { next(); return; }
    if (!validate(4)) return;
    var btn = $('#submit-btn'); btn.disabled = true; btn.textContent = 'Siunčiama…'; err(wl, 'submit', 0);
    if (val(wl, 'website')) { done(wl, 'Ačiū! Įrašyta'); return; }
    var payload = {
      product: 'minecraft', lead_type: 'tevai', page_version: 'v2',
      parent_name: (val(wl, 'parent_name') || '').slice(0, 80) || null,
      email: val(wl, 'email').toLowerCase(),
      phone: (val(wl, 'phone') || '').slice(0, 30) || null,
      child_age: val(wl, 'child_age'),
      city: city().slice(0, 120),
      location_pref: val(wl, 'location_pref'),
      kindergarten_name: (val(wl, 'kindergarten_name') || '').slice(0, 120) || null,
      interest: val(wl, 'interest') || null,
      price_pref: val(wl, 'price_pref') || null,
      preferred_day: val(wl, 'preferred_day') || null,
      src: SRC, consent_contact: true, consent_text_version: CONSENT_VERSION
    };
    post(payload).then(function (r) {
      if (r.status === 201) {
        var fixed = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'];
        track('value', { step: 'waitlist_submit', klase: payload.child_age, vieta: payload.location_pref, miestas: fixed.indexOf(payload.city) >= 0 ? payload.city : 'kitas' });
        done(wl, 'Ačiū! Įrašyta');
      } else { throw new Error('status ' + r.status); }
    }).catch(function (ex) {
      track('error', { where: 'waitlist', msg: String(ex && ex.message || ex).slice(0, 60) });
      err(wl, 'submit', 1); btn.disabled = false; btn.textContent = 'Įrašyti į sąrašą';
    });
  });
  shareInit($('#share-btn'), 'Robotikos akademijos būrelis 1–4 klasei: Žaidimų kūrėjai su Minecraft Education ir DI.');

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
      product: 'minecraft', lead_type: 'istaiga', page_version: 'v2',
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
  shareInit($('#org-share-btn'), 'Robotikos akademijos būrelis mokyklai: Žaidimų kūrėjai su Minecraft Education ir DI, 1–4 klasei.');

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
        ScrollTrigger.batch('.value, .pillar, .step, .wef li, .safe-item, .num, .price, .quote, .game-card, .shot, .tile', {
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
