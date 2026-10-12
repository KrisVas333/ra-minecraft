# Žaidimų kūrėjai v2 · kaip pakeisti kainą (3 žingsniai)

Visos kainos, skaičiai ir tekstai gyvena viename faile: [`v2/config.js`](config.js).
Jį skaito puslapis, lankstinukas, PDF ir og paveikslėlis (socialinių tinklų peržiūra).

1. Pakeiskite reikšmę `v2/config.js` (pvz. `prices.mokykla.amount: 25` → `29`). Kaina už pamoką perskaičiuojama pati.
2. Repo šaknyje paleiskite `python3 v2/tools/kainos.py` (perrašo atsarginius tekstus visuose puslapiuose, pergeneruoja `og.jpg` ir `lankstinukas.pdf`, išspausdina, kas pasikeitė).
3. `git add -A && git commit -m "config: kainos" && git push`. GitHub Pages atsinaujina per 1–2 min.

Dažniausi raktai `config.js`: `prices.*.amount` (kaina), `lessonsPerMonth`, `lessonMinutes`, `included` (kas įskaičiuota), `start.date` (startas), `schedule.slots` (laikai), `trust.*` (skaičiai), `testimonials` (atsiliepimai; tikram įrašykite `placeholder: false` ir tekstą tik su raštišku sutikimu), `ctas.*` (mygtukai), `legal.*` (telefonas, adresas).
