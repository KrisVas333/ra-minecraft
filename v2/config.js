/* ============================================================
   Žaidimų kūrėjai · v2 · VIENAS nustatymų failas
   ------------------------------------------------------------
   Čia keičiamos kainos, skaičiai, teiginiai, atsiliepimai ir mygtukų
   tekstai. Puslapis, lankstinukas ir PDF skaito tą patį failą.
   Kaip ir ką keisti: žr. KAINOS.md šalia šio failo.
   Nekeiskite raktų (pavadinimų kairėje), tik reikšmes.
   ============================================================ */
window.RA_CFG = {
  version: 'v2',
  product: 'minecraft',
  productName: 'Žaidimų kūrėjai',
  productSub: 'su Minecraft Education ir DI',
  ageLabel: '1–4 klasė',
  ageDetail: '1–2 ir 3–4 kl. atskirai',
  siteUrl: 'https://krisvas333.github.io/ra-minecraft/v2/',

  /* ---------- KAINOS (eurais per mėnesį) ---------- */
  prices: {
    mokykla: { amount: 25, label: 'Mokykloje', where: 'vaiko mokykloje, mokyklos kompiuteriai, po pamokų' },
    centras: { amount: 39, label: 'Tech Zity centre', where: 'Panerių g. 43, Vilnius' }
  },
  lessonsPerMonth: 4,
  lessonMinutes: 45,
  firstLessonFree: false,            // true tik tada, kai ExoClass'e yra tikra 0 € grupė
  included: ['planšetės ir kompiuteriai vietoje', 'programa ir paruošti pasauliai', 'prisijungimas per būrelį', 'Robotikos akademijos mentorius'],
  paymentNote: 'Sutartį, tvarkaraštį ir mokėjimo sąlygas atsiųsime prieš registraciją. Įsirašyti į sąrašą galite be įsipareigojimo.',

  /* ---------- TVARKARAŠTIS ---------- */
  schedule: {
    note: 'Popietėmis po pamokų, 45 min kartą per savaitę. Dieną renkatės formoje, laiką derinsime pagal daugumą.',
    slots: []                        // pvz. { place: 'centras', day: 'Ketvirtadieniais', time: '16:00–16:45', status: 'planuojama' }
  },
  groupNote: 'Mažos grupės, kiekvienas vaikas su savo planšete.',

  /* ---------- PASITIKĖJIMAS (skaičiai su šaltiniais) ---------- */
  trust: {
    years:     { show: true, n: '13+',     label: 'metų patirties',          src: 'Registrų centras: įregistruota 2013 m.' },
    kids:      { show: true, n: '10 000+', label: 'vaikų per metus',         src: 'Robotikos akademijos būrelių registracijos 2024 ir 2025 m.' },
    mentors:   { show: true, n: '110+',    label: 'mentorių',                src: 'robotikosakademija.lt' },
    places:    { show: true, n: '650+',    label: 'vietų Lietuvoje',         src: 'robotikosakademija.lt' },
    recommend: { show: true, n: '9 iš 10', label: 'klientų rekomenduoja',    src: 'robotikosakademija.lt' },
    rating:    { show: true, text: 'Tėvai mūsų stovyklų mentorius įvertino 9,8 iš 10', footnote: '* Robotikos akademijos tėvų apklausa, 2025 m. vasaros stovyklos' },
    stemOrg:   { show: true, validUntil: '2026-10-31', text: 'STEM.org Accredited™ akredituota organizacija', img: 'assets/stem-org-accredited-badge-200.png', href: 'https://blockchain.stem.org/6e43c2b3-e72b-4a8c-9707-ecb45a6cc024', verifyLabel: 'Patikrinti akreditaciją' }
  },

  /* ---------- TEIGINIAI ---------- */
  claims: {
    disclaimerLT: 'NĖRA OFICIALI MINECRAFT EDUCATION PASLAUGA. NEPATVIRTINTA MOJANG AR MICROSOFT IR SU JOMIS NESUSIJUSI.',
    disclaimerEN: 'NOT AN OFFICIAL MINECRAFT EDUCATION SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.',
    disclaimerShort: 'Nėra oficiali Minecraft Education paslauga. Nepatvirtinta Mojang ar Microsoft ir su jomis nesusijusi.',
    trademark: 'Minecraft yra Microsoft įmonių grupės prekės ženklas. Visi kiti prekių ženklai priklauso jų savininkams.',
    accounts: 'Vaikui nereikia savo Microsoft paskyros: prisijungimą suteikia būrelis.',
    whoCreates: 'Programą kuria Robotikos akademijos ugdymo turinio komanda. Pamokas veda mūsų mentoriai, praėję Minecraft Education mokymus. Visas programas tobuliname pagal 13 metų būrelių patirtį, mentorių ataskaitas po kiekvienos pamokos ir tėvų nuomonę.',
    aiVoiceVideo: true,              // video įgarsintas DI balsu: rodomas atskleidimas
    aiImageLabel: 'DI iliustracija'
  },

  /* ---------- ATSILIEPIMAI (placeholder: true = pavyzdys, dar ne tikras) ---------- */
  testimonials: [
    { type: 'tevai',     placeholder: true, who: 'Tėvai',     meta: 'vaikas, 8 m.',          text: 'Čia bus tikras tėvų atsiliepimas po pirmųjų pamokų: ką vaikas pasakojo namie ir kas jums buvo svarbiausia.' },
    { type: 'vaikas',    placeholder: true, who: 'Vaikas',    meta: '9 m.',                  text: 'Čia bus vaiko žodžiai: ką jis pastatė, kas buvo sunkiausia ir ką norėtų kurti kitą kartą.' },
    { type: 'mentorius', placeholder: true, who: 'Mentorius', meta: 'Robotikos akademija',   text: 'Čia bus mentoriaus žodžiai: kaip vyksta pamoka, ką vaikai daro patys ir kur jiems reikia pagalbos.' }
  ],
  placeholderLabel: 'PAVYZDYS · čia bus tikras atsiliepimas',

  /* ---------- MYGTUKAI ---------- */
  ctas: {
    primary: 'Užsirašyti į laukiančiųjų sąrašą',
    primaryShort: 'Užsirašyti',
    org: 'Pakvieskite į savo mokyklą',
    orgShort: 'Mokyklai',
    micro: 'Užtruks apie minutę. Parašysime, kai jūsų mokykloje ar centre susirinks grupė.'
  },

  /* ---------- INTERESŲ KONFLIKTO EILUTĖ (show: false = nerodoma) ---------- */
  coi: { show: false, text: 'Puslapį rengė Robotikos akademijos bendraįkūrėjas.' },

  robotName: 'RAbotukas',

  /* ---------- TECHNINIAI ---------- */
  supabase: { url: 'https://iiekmeylpppczicrsxho.supabase.co/rest/v1/ra_waitlist', key: 'sb_publishable_iJC59f30YJm7hU4OwZsLDQ_9FN-ygzF' },
  clarityId: 'yvooeforl7',
  privacyUrl: 'https://robotikosakademija.lt/privatumo-politika/',
  cookiesUrl: 'https://robotikosakademija.lt/slapuku-politka/',
  legal: {
    entity: 'VšĮ „Robotikos akademija"',
    address: 'Panerių g. 43, LT-03202 Vilnius',
    code: '303015010',
    phone: '+370 5 25 25 713',
    phoneHref: 'tel:+37052525713',
    site: 'https://robotikosakademija.lt/'
  }
};
