# Žaidimų kūrėjai v2 · kaip keisti kainas, skaičius ir tekstus

**Vienas failas:** [`v2/config.js`](config.js). Jį skaito puslapis (`v2/index.html`), lankstinukas (`v2/lankstinukas/index.html`) ir iš lankstinuko generuojamas PDF. Daugiau niekur kainų nėra.

## Ką keisti

| Noriu pakeisti | Kur `config.js` | Pavyzdys |
|---|---|---|
| Kainą mokykloje / centre | `prices.mokykla.amount`, `prices.centras.amount` | `amount: 25` → `amount: 29` |
| Kiek pamokų per mėnesį ir kiek trunka | `lessonsPerMonth`, `lessonMinutes` | kaina už pamoką perskaičiuojama pati: 25 / 4 = 6,25 € |
| Vietos aprašymą | `prices.mokykla.where`, `prices.centras.where` | adresas, patalpa |
| Kas įskaičiuota | `included` (sąrašas) | pridėkite arba išimkite eilutę |
| Pirmoji pamoka nemokama | `firstLessonFree` | palikti `false`, kol ExoClass'e nėra tikros 0 € grupės; `true` tik tada |
| Tvarkaraštį | `schedule.note`, `schedule.slots` | `slots: [{ place: 'centras', day: 'Ketvirtadieniais', time: '16:00–16:45', status: 'planuojama' }]` |
| Skaičius (13+, 10 000+, 110+, 650+, 9 iš 10) | `trust.*` | `show: false` išjungia skaičių |
| 9,8 įvertinimą | `trust.rating.show`, `.text`, `.footnote` | tekstas ir išnaša rodomi kartu |
| STEM.org ženklą | `trust.stemOrg.validUntil` | po šios datos ženklas dingsta pats; pratęsus akreditaciją įrašykite naują datą |
| Teiginius (disclaimeris, paskyros, kas kuria programą) | `claims.*` | |
| Atsiliepimus | `testimonials` | tikram atsiliepimui: `placeholder: false`, `who: 'Rūta'`, `meta: 'sūnus, 8 m.'`, `text: '…'` (tik su raštišku sutikimu) |
| Mygtukų tekstus | `ctas.*` | |
| Robotuko vardą | `robotName` | |
| Interesų konflikto eilutę | `coi.show` | `true` parodo `coi.text` poraštėje |
| Telefoną, adresą, įmonės kodą | `legal.*` | telefonas turi sutapti su robotikosakademija.lt |

Keičiant tekstą, kuris rodomas ir be JavaScript (pvz. paieškos robotams), tą patį tekstą pakeiskite ir `index.html` vietose su `data-cfg="…"` (jos turi identišką atsarginį tekstą). Puslapis veikia ir su senu atsarginiu tekstu, tiesiog JS jį perrašo iš `config.js`.

## Po pakeitimo: PDF iš naujo (viena komanda)

Reikia vietinio serverio iš repo šaknies (`python3 -m http.server 8792`), tada:

```bash
cd ~/ra-minecraft && python3 -m http.server 8792 --bind 127.0.0.1 >/dev/null 2>&1 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$HOME/ra-minecraft/v2/lankstinukas/lankstinukas.pdf" "http://127.0.0.1:8792/v2/lankstinukas/"
```

Tada `git add -A && git commit -m "config: kainos" && git push`. GitHub Pages atnaujina per 1–2 min.

## Kur kas rodoma

- Kainos: hero (nuo 25 €/mėn.), spec kortelė, skiltis „Kaina ir kas įskaičiuota", DUK „Kiek kainuoja", lipni juosta, lankstinukas, og.png (og.png yra statinis paveikslėlis: pakeitus kainą jį reikia pergeneruoti iš `og.html` šablono arba paprašyti Neuron).
- Skaičiai: „Robotikos akademija skaičiais" ir poraštė.
- Atsiliepimai: trys kortelės skiltyje „Robotikos akademija skaičiais" ir viena lankstinuke.

## Testo eilutės duomenų bazėje

QA įrašai turi `src` nuo `qa-v2-` ir el. paštą su `@neuron.invalid`. Prieš skaičiuojant tikrus lead'us juos išfiltruoti arba ištrinti.
