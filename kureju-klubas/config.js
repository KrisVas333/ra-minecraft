/* ============================================================
   Kūrėjų klubas · bandomasis 4 pamokų būrelis · VIENAS nustatymų failas
   ------------------------------------------------------------
   Čia keičiami mokyklų laikai, ExoClass nuorodos, kaina, datos, tekstai.
   Nekeiskite raktų (pavadinimų kairėje), tik reikšmes.
   Kaip ir ką keisti: žr. KAINOS.md šalia šio failo.
   ============================================================ */
window.RA_CFG = {
  version: 'kk-testas',              // eina į formų page_version ir į kiekvieną sekimo įvykį
  product: 'minecraft',
  productName: 'Kūrėjų klubas',
  productSub: 'Minecraft ir programavimas 1\u2060–\u20604 klasei',
  promise: 'Vaikai čia technologijas kuria, o ne tik naudoja.',
  ageLabel: '1–4 klasė',
  ageLabelDative: '1–4 klasei',
  siteUrl: 'https://krisvas333.github.io/ra-minecraft/kureju-klubas/',

  /* ---------- BANDOMASIS BŪRELIS ---------- */
  trial: {
    price: 25,                       // eurais už VISAS 4 pamokas (viena suma)
    lessons: 4,
    lessonMinutes: 45,
    rhythm: 'kartą per savaitę',
    dates: 'lapkričio 23\u00a0d. – gruodžio 18\u00a0d.',
    groupMax: 24,
    groupMin: 8,
    registerBy: 'lapkričio 21\u00a0d.',
    cancelNoticeBy: 'lapkričio 22\u00a0d.',  // iki kada pranešame, jei grupė nesusirinko
    dayTimeConfirmBy: 'lapkričio 18\u00a0d.',
    where: 'Vaiko mokykloje po pamokų, mokyklos kompiuterių klasėje',
    after: 'Paskutinę pamoką vaikas parodys, ką sukūrė, o jūs nuspręsite, ar tęsti nuo sausio.'
  },
  lessonMinutes: 45,

  /* ---------- MOKYKLOS (Vilnius) ----------
     dayTime tuščia = rodoma „Dieną ir valandą patvirtinsime iki lapkričio 18 d.“
     exoUrl įrašyta = mokyklos mygtukas veda tiesiai į ExoClass registraciją ir mokėjimą.
     exoUrl tuščia  = naudojama rezervacijos forma šiame puslapyje.
     Nuoroda su ?mokykla=<nr> (1–6) iš anksto pažymi mokyklą formoje (QR kiekvienai mokyklai). */
  schools: [
    { name: 'M. Mažvydo',      dayTime: '', exoUrl: '' },
    { name: 'S. Stanevičiaus', dayTime: '', exoUrl: '' },
    { name: 'Fabijoniškių',    dayTime: '', exoUrl: '' },
    { name: 'Gabijos',         dayTime: '', exoUrl: '' },
    { name: 'Žemynos',         dayTime: '', exoUrl: '' },
    { name: 'Baltupių',        dayTime: '', exoUrl: '' }
  ],
  schoolOtherLabel: 'Kita mokykla',
  dayTimeEmpty: 'Dieną ir valandą patvirtinsime iki lapkričio 18\u00a0d.',

  /* ---------- PROGRAMA: 4 pamokos ---------- */
  program: [
    { title: 'Komanda ir užduotis', text: 'Vaikai susiskirsto komandomis, pasirenka roles ir išmoksta judėti ir statyti žaidimo pasaulyje.', img: '' },
    { title: 'Bazė Marse', text: 'Komanda planuoja ir stato koloniją Marse.', img: 'assets/mc/marso-baze-is-virsaus-800.webp', imgAlt: 'Marso bazė iš kubelių: kupolai, bokštas ir angaras raudoname krateryje' },
    { title: 'Robotas padėjėjas', text: 'Vaikas kodo blokais suprogramuoja robotą, kuris stato už jį. Mentorius parodo, kaip kodą rašo dirbtinis intelektas ir kur jis klysta.', img: '' },
    { title: 'Pristatymas', text: 'Komanda parodo tėvams, ką sukūrė.', img: '' }
  ],

  /* ---------- KĄ VAIKAS IŠSINEŠA (icon = failas assets/icons/) ---------- */
  values: [
    { title: 'Programavimas', text: 'Kodo blokais suprogramuoja robotą padėjėją, kuris stato už jį.', icon: 'ico-vx-di-lustas.svg' },
    { title: 'Darbas komandoje', text: 'Dalijasi rolėmis, tariasi ir stato bazę kartu.', icon: 'ico-vx-zole.svg' },
    { title: 'Problemų sprendimas', text: 'Planuoja, bando ir taiso, kai kas nors nepavyksta.', icon: 'ico-vx-irankis.svg' },
    { title: 'Sveikas santykis su technologijomis', text: 'Ekranas čia yra įrankis kurti, o šalia visą laiką mentorius. Apie dirbtinį intelektą vaikai sužino iš mentoriaus, kuris parodo ir jo klaidas.', icon: 'ico-vx-kristalas.svg' }
  ],

  /* ---------- MENTORIAI (photo tuščia = rodomos inicialų raidės) ---------- */
  mentorsIntro: 'Kiekvienoje grupėje dirba Robotikos akademijos mentorius.',
  mentors: [
    { name: 'Kristijonas Vasiliauskas', bio: 'Robotikos akademijos bendraįkūrėjas.', photo: '' },
    { name: 'Povilas Zmejauskas',       bio: 'Robotikos akademijos vadovų komandos narys.',                               photo: '' }
  ],

  /* ---------- ĮŽANGINIS VIDEO (youtubeId tuščia = sekcija visai nerodoma) ---------- */
  introVideo: { youtubeId: '', title: 'Kūrėjų klubas per minutę', aiVoice: false },

  /* ---------- MOKYKLOMS (blokas ir mokyklos forma) ---------- */
  school: {
    tiles: [
      'Mokykla duoda kompiuterių klasę su 24 veikiančiais licencijuotais kompiuteriais',
      'Mokykla išsiunčia vieną žinutę tėvams',
      'Mentorių, programą ir registraciją atneša Robotikos akademija',
      'Gruodžio pabaigoje mokykla gauna trumpą ataskaitą'
    ],
    needs: [
      'Kompiuterių klasė po pamokų su 24 veikiančiais kompiuteriais ir Minecraft Education licencijomis.',
      'Viena mokyklos žinutė tėvams su nuoroda į šį puslapį.',
      'Robotikos akademija atneša mentorių, programą ir tvarko registraciją.',
      '4 pamokos po 45 min, kartą per savaitę, lapkričio 23 d. – gruodžio 18 d.',
      'Grupėje iki 24 vaikų. Grupė startuoja, kai užsiregistruoja bent 8.',
      'Gruodžio pabaigoje mokyklai atsiųsime trumpą ataskaitą.'
    ]
  },

  /* ---------- NVŠ (šiam bandomajam būreliui nerodoma) ---------- */
  nvs: { askInForm: false },

  /* ---------- PASITIKĖJIMAS (skaičiai su šaltiniais) ---------- */
  trust: {
    years:     { show: true, n: '13+',     label: 'metų patirties',       short: 'metų',            src: 'Registrų centras: įregistruota 2013 m.' },
    kids:      { show: true, n: '10 000+', label: 'vaikų per metus',      short: 'vaikų per metus', src: 'Robotikos akademijos būrelių registracijos 2024 ir 2025 m.' },
    mentors:   { show: true, n: '110+',    label: 'mentorių',             short: 'mentorių',        src: 'robotikosakademija.lt' },
    places:    { show: true, n: '650+',    label: 'vietų Lietuvoje',      short: 'vietų',           src: 'robotikosakademija.lt' },
    recommend: { show: true, n: '9 iš 10', label: 'klientų rekomenduoja', short: 'rekomenduoja',    src: 'robotikosakademija.lt' },
    rating:    { show: false,   /* stovyklų mentorių įvertinimas, šiam būreliui nerodomas */ text: 'Tėvai mūsų stovyklų mentorius įvertino 9,8 iš 10', footnote: '* Robotikos akademijos tėvų apklausa, 2025 m. vasaros stovyklos' },
    /* validUntil praėjus ženklelis slepiamas automatiškai (app.js). Atnaujinę akreditaciją, įrašykite naują datą. */
    stemOrg:   { show: true, validUntil: '2026-10-31', text: 'STEM.org Accredited™ akredituota organizacija', img: 'assets/stem-org-accredited-badge-200.png', href: 'https://blockchain.stem.org/6e43c2b3-e72b-4a8c-9707-ecb45a6cc024', verifyLabel: 'Patikrinti akreditaciją' }
  },

  /* ---------- TEIGINIAI ---------- */
  claims: {
    disclaimerLT: 'NĖRA OFICIALI MINECRAFT EDUCATION PASLAUGA. NEPATVIRTINTA MOJANG AR MICROSOFT IR SU JOMIS NESUSIJUSI.',
    disclaimerEN: 'NOT AN OFFICIAL MINECRAFT EDUCATION SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.',
    disclaimerShort: 'Nėra oficiali Minecraft Education paslauga. Nesusijusi su Mojang ar Microsoft.',
    trademark: 'Minecraft yra Microsoft įmonių grupės prekės ženklas. Visi kiti prekių ženklai priklauso jų savininkams.',
    accounts: 'Vaikui savo paskyros nereikia. Prisijungimus sutvarkome kartu su mokykla.',
    recordings: 'Anoniminiai naršymo įrašai, kurie padeda taisyti puslapį, įsijungia tik jums leidus.',
    dataCollected: 'Renkame tik tai, ko reikia grupei suburti: jūsų kontaktą, mokyklą ir vaiko klasę.'
  },

  /* ---------- ATSILIEPIMAI: tikrų dar nėra, šiame puslapyje nerodoma ---------- */
  testimonials: [],
  showTestimonials: false,

  /* ---------- MYGTUKAI ---------- */
  ctas: {
    primary: 'Rezervuoti vietą',
    primaryShort: 'Rezervuoti',
    org: 'Pakvieskite į savo mokyklą',
    orgShort: 'Mokyklai',
    micro: 'Registracija iki lapkričio 21 d. Užtruks apie minutę.'
  },

  /* ---------- FORMA ---------- */
  consentVersion: 'kk-testas-1',     // keiskite, kai keičiate sutikimo tekstą
  /* Pažadai tėvams: keičiami tik čia */
  confirmText: 'Rezervaciją patvirtinsime el. paštu per 1 darbo dieną. Lapkričio 22 d. parašysime, ar jūsų mokykloje grupė susirinko, ir atsiųsime registracijos bei mokėjimo nuorodą.',
  paymentNote: 'Mokėjimo nuorodą gausite lapkričio 22 d., kai grupė bus patvirtinta. Iki tol nieko mokėti nereikia.',
  successText: 'Vieta rezervuota. Rezervaciją patvirtinsime el. paštu per 1 darbo dieną. Lapkričio 22 d. parašysime, ar grupė susirinko, ir atsiųsime registracijos bei mokėjimo nuorodą.',
  successOtherText: 'Jūsų mokyklos dar nėra sąraše, todėl įrašėme jus į laukiančiųjų sąrašą. Parašysime, jei jūsų mokykloje susirinks grupė.',

  /* ---------- INTERESŲ KONFLIKTO EILUTĖ (show: false = nerodoma) ---------- */
  coi: { show: false, text: '' },

  robotName: 'RAbotukas',

  /* ---------- TECHNINIAI ---------- */
  supabase: { url: 'https://iiekmeylpppczicrsxho.supabase.co/rest/v1/ra_waitlist', key: 'sb_publishable_iJC59f30YJm7hU4OwZsLDQ_9FN-ygzF' },
  clarityId: 'yvooeforl7',
  privacyUrl: 'https://robotikosakademija.lt/privatumo-politika/',
  cookiesUrl: 'https://robotikosakademija.lt/slapuku-politka/',
  privacyNote: 'Formos duomenys saugomi Supabase duomenų bazėje ir naudojami tik grupei suburti ir registracijai. Lankomumo statistika: Umami, be slapukų. Microsoft Clarity naršymo įrašai (įvestys paslėptos), kurie padeda taisyti puslapį, įsijungia tik paspaudus „Leisti“.',
  legal: {
    entity: 'VšĮ „Robotikos akademija“',
    address: 'Panerių g. 43, LT-03202 Vilnius',
    code: '303015010',
    phone: '+370 5 25 25 713',
    phoneHref: 'tel:+37052525713',
    site: 'https://robotikosakademija.lt/'
  }
};
