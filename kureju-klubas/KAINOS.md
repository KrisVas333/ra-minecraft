# Kūrėjų klubas · kaip keisti puslapį

Bandomasis 4 pamokų būrelis (1–4 kl., 2026-11-23 → 2026-12-18). Kopija iš `v2/`, pritaikyta testui.
Visi tekstai, kaina, datos, mokyklos ir mentoriai gyvena viename faile: [`config.js`](config.js).

## Dažniausi pakeitimai

1. **Mokyklos diena ir valanda:** `schools[].dayTime`, pvz. `'Antradieniais 14:00–14:45'`. Tuščia = „Dieną ir valandą patvirtinsime iki lapkričio 18 d.“
2. **ExoClass registracijos nuoroda:** `schools[].exoUrl` (tik `https://…`). Įrašius, mokyklos mygtukas veda tiesiai į ExoClass; tuščia = rezervacijos forma šiame puslapyje.
3. **Įžanginis video:** `introVideo.youtubeId` (11 ženklų iš YouTube adreso). Tuščia = sekcijos nėra. Jei video įgarsintas DI balsu, `aiVoice: true`.
4. **Mentoriaus nuotrauka:** `mentors[].photo`, pvz. `'assets/mentoriai/kristijonas.webp'`. Tuščia = inicialai.
5. **Kaina, datos, grupės dydis:** `trial.*`.

QR kiekvienai mokyklai: `…/kureju-klubas/?mokykla=1&src=qr-mazvydo` (1–6 pagal `schools` eilę, `kita` = kita mokykla) iš anksto pažymi mokyklą formoje.

## Po pakeitimo

- Statinis HTML turi atsarginius tekstus; puslapis juos perrašo iš `config.js` naršyklėje. Jei keičiate mokyklas ar programą, atsarginius tekstus `index.html` galite palikti: JS juos perrašo.
- `og.jpg` generuojamas iš `tools/og-src.html` (headless Chrome, 1200×630).
- Ši kopija neturi `kainos.py`: v2 skriptas rašo į `v2/` ir čia nenaudojamas.
- Publikuoti: `git add kureju-klubas && git commit && git push` (GitHub Pages atsinaujina per 1–2 min.).

## Formų laukai (Supabase `ra_waitlist`)

Tėvai: `product, lead_type='tevai', page_version='kk-testas', parent_name, email, phone, child_age (kl1–kl4), city, location_pref='mokykla', kindergarten_name (mokykla), interest ('kk-rezervacija' | 'kk-laukiantys'), src, consent_contact, consent_text_version`.
Mokykla: `product, lead_type='istaiga', page_version='kk-testas', org_role, org_name, org_size, city, location_pref='mokykla', parent_name, email, phone, src, consent_contact, consent_text_version`.
