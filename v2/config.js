/* ============================================================
   Žaidimų kūrėjai · v2 · VIENAS nustatymų failas
   ------------------------------------------------------------
   Čia keičiamos kainos, skaičiai, teiginiai, atsiliepimai ir mygtukų
   tekstai. Puslapis, lankstinukas, PDF ir og paveikslėlis skaito tą patį failą.
   Kaip ir ką keisti: žr. KAINOS.md šalia šio failo (3 žingsniai).
   Nekeiskite raktų (pavadinimų kairėje), tik reikšmes.
   Skaičiuose tarp skaitmenų rašomas nedalomas tarpas kaip   (pvz. '10 000+'),
   kad skaičius nelūžtų per dvi eilutes. Prieš € tarpą prideda pats puslapis.
   ============================================================ */
window.RA_CFG = {
  version: 'v2',
  product: 'minecraft',
  productName: 'Žaidimų kūrėjai',
  productSub: 'su Minecraft Education ir DI',
  ageLabel: '1–4 klasė',
  ageLabelDative: '1–4 klasei',
  ageYears: '7–10 metų',
  ageDetail: '1–2 ir 3–4 kl. atskirai',
  siteUrl: 'https://krisvas333.github.io/ra-minecraft/v2/',

  /* ---------- KAINOS (eurais per mėnesį) ---------- */
  prices: {
    mokykla: { amount: 25, label: 'Mokykloje', where: 'vaiko mokykloje po pamokų, vežioti nereikia. Grupė atsiranda, kai mokykla mus pakviečia.' },
    centras: { amount: 39, label: 'Tech Zity centre', where: 'Tech Zity centre, Panerių g. 43, Vilnius.' }
  },
  lessonsPerMonth: 4,
  lessonMinutes: 45,
  firstLessonFree: false,            // true rodo eilutę firstLessonLine kainos kortelėje; palikti false, kol tokios grupės tikrai nėra
  firstLessonLine: 'Pirmoji pamoka 0 €, be įsipareigojimo',
  included: ['įranga vietoje: mokykloje mokyklos kompiuteriai, centre mūsų planšetės ar kompiuteriai', 'programa ir paruošti pasauliai', 'prisijungimas per būrelį, be vaiko paskyros', 'Robotikos akademijos mentorius'],
  paymentNote: 'Sutartį, tvarkaraštį ir mokėjimo sąlygas atsiųsime prieš registraciją. Sąrašas niekuo neįpareigoja.',

  /* ---------- STARTAS (date tuščia = rodomas text; įrašius datą rodoma „Startas: <data>“) ---------- */
  start: {
    date: '',                        // pvz. '2026 m. lapkritis'
    text: 'Grupės startuoja, kai susirenka pakankamai vaikų. Laukiančiųjų sąraše esantiems pranešime pirmiesiems.'
  },

  /* ---------- SĄLYGOS (tuščia = eilutė nerodoma) ---------- */
  terms: {
    exit: '',                        // pvz. 'Mokate už mėnesį, nutraukti galite bet kada prieš kitą mėnesį.'
    groupMax: ''                     // pvz. 'Grupėje iki 10 vaikų.'
  },

  /* ---------- TVARKARAŠTIS ---------- */
  schedule: {
    note: 'Popietėmis po pamokų, kartą per savaitę. Dieną renkatės formoje, laiką derinsime pagal daugumą.',
    startMonth: '',                  // pvz. 'Pirmosios grupės: 2026 m. lapkritis'
    slots: []                        // pvz. { place: 'Tech Zity', day: 'Ketvirtadieniais', dayCode: 'Kt', time: '16:00–16:45', status: 'planuojama' }
  },

  /* ---------- ĮRANGA (vienodai visame puslapyje) ---------- */
  devices: {
    short: 'Mokykloje mokyklos kompiuteriai, centre mūsų planšetės ar kompiuteriai',
    line: 'Kiekvienas vaikas prie savo ekrano: mokykloje prie mokyklos kompiuterio, Tech Zity centre prie mūsų planšetės ar kompiuterio. Be vaiko paskyros, DI tik per mentorių.',
    mce: 'Minecraft Education veikia Windows, macOS, ChromeOS (Chromebook) ir iPad įrenginiuose.'
  },

  /* ---------- MOKYKLOMS (blokas prie kainos ir mokyklos forma) ---------- */
  school: {
    tiles: ['Mentorius, programa, pasauliai ir prisijungimai: mūsų', 'Mokykla duoda klasę su kompiuteriais po pamokų', 'Mokyklai nekainuoja: tėvams {{price.mokykla}}/mėn.', 'Registraciją ir mokėjimus tvarkome mes'],
    line: 'Grupės dydį ir pradžios datą suderiname su mokykla. Robotikos akademijos būreliai jau vyksta daugiau nei 650 vietų Lietuvoje.',
    itLine: 'Minecraft Education veikia Windows, macOS, ChromeOS (Chromebook) ir iPad įrenginiuose; įdiegimą ir prisijungimus suderiname su mokyklos IT.',
    needs: [
      'Klasė po pamokų ir mokyklos kompiuteriai (Windows, macOS, ChromeOS ar iPad). Jei įrangos trūksta, aptarsime variantus.',
      'Minecraft Education įdiegimą ir prisijungimus suderiname su mokyklos IT. Vaikams savo paskyrų nereikia: prisijungimą suteikia būrelis.',
      'Mokyklai tai nekainuoja: programą, mentorių, registraciją ir mokėjimus tvarko Robotikos akademija.',
      'Grupė startuoja, kai susirenka pakankamai vaikų. Skaičių ir pradžios datą suderiname su mokykla.',
      'Tėvams {{price.mokykla}}/mėn. už {{lessonsPerMonth}} pamokas po {{lessonMinutes}} min.',
      'Pamokas veda Robotikos akademijos mentoriai, praėję Minecraft Education mokymus.'
    ]
  },

  /* ---------- NVŠ (formos klausimas poreikiui matuoti; krepšelio šiam būreliui dar nėra) ---------- */
  nvs: { askInForm: true, label: 'Tik su NVŠ krepšeliu', note: 'NVŠ krepšelio šiam būreliui dar nėra: šiuo atsakymu tik matuojame poreikį.' },

  /* ---------- PASITIKĖJIMAS (skaičiai su šaltiniais) ---------- */
  trust: {
    years:     { show: true, n: '13+',     label: 'metų patirties',       short: 'metų',          src: 'Registrų centras: įregistruota 2013 m.' },
    kids:      { show: true, n: '10 000+', label: 'vaikų per metus',   short: 'vaikų per metus',         src: 'Robotikos akademijos būrelių registracijos 2024 ir 2025 m.' },
    mentors:   { show: true, n: '110+',    label: 'mentorių',             short: 'mentorių',                src: 'robotikosakademija.lt' },
    places:    { show: true, n: '650+',    label: 'vietų Lietuvoje',      short: 'vietų',         src: 'robotikosakademija.lt' },
    recommend: { show: true, n: '9 iš 10', label: 'klientų rekomenduoja', short: 'rekomenduoja',    src: 'robotikosakademija.lt' },
    rating:    { show: true, text: 'Tėvai mūsų stovyklų mentorius įvertino 9,8 iš 10', footnote: '* Robotikos akademijos tėvų apklausa, 2025 m. vasaros stovyklos' },
    stemOrg:   { show: true, validUntil: '2026-10-31', text: 'STEM.org Accredited™ akredituota organizacija', img: 'assets/stem-org-accredited-badge-200.png', href: 'https://blockchain.stem.org/6e43c2b3-e72b-4a8c-9707-ecb45a6cc024', verifyLabel: 'Patikrinti akreditaciją' }
  },

  /* ---------- TEIGINIAI ---------- */
  claims: {
    disclaimerLT: 'NĖRA OFICIALI MINECRAFT EDUCATION PASLAUGA. NEPATVIRTINTA MOJANG AR MICROSOFT IR SU JOMIS NESUSIJUSI.',
    disclaimerEN: 'NOT AN OFFICIAL MINECRAFT EDUCATION SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.',
    disclaimerShort: 'Nėra oficiali Minecraft Education paslauga. Nesusijusi su Mojang ar Microsoft.',
    trademark: 'Minecraft yra Microsoft įmonių grupės prekės ženklas. Visi kiti prekių ženklai priklauso jų savininkams.',
    accounts: 'Vaikui nereikia savo Microsoft paskyros: prisijungimą suteikia būrelis.',
    whoCreatesShort: 'Programą kuria Robotikos akademijos ugdymo turinio komanda. Pamokas veda mūsų mentoriai, praėję Minecraft Education mokymus.',
    whoCreates: 'Programą kuria Robotikos akademijos ugdymo turinio komanda. Pamokas veda mūsų mentoriai, praėję Minecraft Education mokymus. Visas programas tobuliname pagal 13 metų būrelių patirtį, mentorių ataskaitas po kiekvienos pamokos ir tėvų nuomonę.',
    goals: 'Tai ugdymo tikslai, pagal kuriuos kuriame pamokų planus.',
    sixLines: 'Šešios ugdymo kryptys, pagal kurias kuriame pamokų planus.',
    lessonExample: 'Pavyzdys 3–4 klasei: „Daugybos tvirtovė“. Tai pamokos plano pavyzdys, ne įrašas iš vykusios pamokos.',
    dataCollected: 'Renkame tik tai, ko reikia grupei suburti: kontaktą, vaiko klasę, vietą ir patogias dienas.',
    aiVoiceVideo: true,              // video įgarsintas DI balsu: rodomas atskleidimas
    aiImageLabel: 'DI iliustracija'
  },

  /* ---------- ATSILIEPIMAI (placeholder: true = pavyzdys, dar ne tikras; laužtiniai skliaustai rodo, kas čia bus) ---------- */
  testimonials: [
    { type: 'tevai',     placeholder: true, who: '[Vardas]', meta: '[N] m. vaiko mama ar tėtis', text: '„[Ką vaikas pradėjo daryti namie po 4 pamokų ir kas jums buvo svarbiausia]“' },
    { type: 'vaikas',    placeholder: true, who: '[Vardas]', meta: '[N] m.',                     text: '„[Ką pats sukūrė ar išmoko, savo žodžiais]“' },
    { type: 'mentorius', placeholder: true, who: '[Vardas]', meta: 'Robotikos akademijos mentorė ar mentorius', text: '„[Ką mato per 3 mėnesius: kas vaikams sekasi, kur reikia pagalbos]“' }
  ],
  placeholderLabel: 'PAVYZDYS · čia bus tikras atsiliepimas',
  placeholdersHideSrc: ['fb', 'ig', 'ads', 'meta', 'li', 'tt'],   // su tokiu ?src= pradžia pavyzdinės kortelės nerodomos (mokama srautas)

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
  privacyNote: 'Formos duomenys saugomi Supabase duomenų bazėje ir naudojami tik grupei suburti. Lankomumo statistika: Umami, be slapukų. Microsoft Clarity seansų įrašai (įvestys paslėptos) įsijungia tik paspaudus „Leisti“.',
  legal: {
    entity: 'VšĮ „Robotikos akademija“',
    address: 'Panerių g. 43, LT-03202 Vilnius',
    code: '303015010',
    phone: '+370 5 25 25 713',
    phoneHref: 'tel:+37052525713',
    site: 'https://robotikosakademija.lt/'
  }
};
