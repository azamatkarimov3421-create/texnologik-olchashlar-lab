// Navoiy davlat konchilik va texnologiyalar universiteti (NDKTU)
// Kafedra: "Avtomatlashtirish va boshqaruv"
// Fan: Sohaning texnologik o'lchashlari va asboblari
// O'qituvchi: Israilov Temur Anvar o'g'li | Guruh: 17V-25 TJA
// 8 ta laboratoriya ishi bo'yicha mukammal akademik va sanoat ma'lumotlar bazasi

const universityInfo = {
  university: "NAVOIY DAVLAT KONCHILIK VA TEXNOLOGIYALAR UNIVERSITETI",
  faculty: "Konchilik va energetika / Texnologik jarayonlar",
  department: "Avtomatlashtirish va boshqaruv",
  direction: "Texnologik jarayonlar va ishlab chiqarishni avtomatlashtirish",
  subject: "Sohaning texnologik o'lchashlari va asboblari",
  group: "17V-25 TJA",
  semester: "3-semestr",
  academicYear: "2026-2027",
  teacher: "ISRAILOV TEMUR ANVAR O'G'LI"
};

const laboratories = [
  {
    id: 1,
    title: "Termoelektrik hodisalar",
    shortDesc: "Zeyebek, Peltye va Tomson effektlari, termoelementlarning fizik asoslari, termoEYuK va datchiklarning dinamik inersiyasi (τ).",
    duration: "2 soat",
    purpose: "Termoelektrik hodisalar (Zeyebek, Peltye va Tomson effektlari)ning fizik mohiyatini, har xil metallar va qotishmalarning kontaktida termoEYuK hosil bo'lish qonuniyatlarini o'rganish, Peltye sovutish effektini va himoya gilzasi (termovell)ning issiqlik inersiyasini (vaqt doimiysi τ) amalda tadqiq qilish.",
    equipment: [
      "Termoelektrik stend (turli metallar juftligi: TXA, TXK, mis-konstantan)",
      "Elektr mufel pechi va harorat rostlagichi (0...500 °C)",
      "Keithley 2000 / V7-38 yuqori aniqlikdagi laboratoriya millivoltmetri",
      "Peltye yarimo'tkazgichli sovutish moduli (TEC-12706)",
      "Tomson effekti stendi (harorat gradientli metall sterjen)",
      "Himoya gilzalari to'plami: Yalang'och termopara, Zanglamas po'lat (SS316), Cho'yan gilza",
      "Sovuq ulanish uchun Dyuar idishi (muzli termos, 0 °C)"
    ],
    theory: `
      Termoelektrik hodisalar – o'tkazgich va yarimo'tkazgichlarda issiqlik va elektr hodisalari o'rtasidagi o'zaro bog'liqlikni ifodalaydi. Klassik termodinamikada 3 ta fundamental hodisa mavjud:
      
      1. Zeyebek effekti (1821-y., Thomas Johann Seebeck):
         Ikki xil jinsli A va B o'tkazgichlardan iborat berk zanjirning tutashgan nuqtalari har xil haroratlarda (T1 va T2) tutilsa, zanjirda termoEYuK paydo bo'ladi:
         E_AB(T1, T2) = ∫ e_AB(T) dT ≈ e_AB · (T1 - T2)
         bu yerda e_AB - termoelektrod juftligining solishtirma termoEYuK koeffitsienti (differensial termosezgirlik, mkV/°C).
      
      2. Peltye effekti (1834-y., Jean Charles Athanase Peltier):
         Ikki xil o'tkazgich kontaktidan to'g'ridan-to'g'ri o'zgarmas tok o'tganda, ulanish joyida tok yo'nalishiga qarab qo'shimcha Peltye issiqligi ajraladi yoki yutiladi:
         Q_P = Π_AB · I · t = e_AB · T · I · t
         bu yerda Π_AB - Peltye koeffitsienti, I - tok kuchi, T - mutlaq harorat (Kelvin).
         Sanoatda Peltye elementlari (TEC-12706) spektrometrlarni va lazer diodlarini sovutishda qo'llaniladi.
      
      3. Tomson effekti (1856-y., William Thomson / Lord Kelvin):
         Bo'ylama harorat gradientiga (dT/dx) ega bo'lgan bir jinsli o'tkazgichdan elektr toki o'tganda, Joule-Lenz issiqligidan tashqari qo'shimcha Tomson issiqligi ajraladi yoki yutiladi:
         dQ_T = τ_Th · I · (dT/dx) · dx · dt
         bu yerda τ_Th - o'tkazgichning Tomson koeffitsienti.
      
      4. Termodatchiklarning dinamik issiqlik inersiyasi (Vaqt doimiysi τ):
         Sanoat ob'ektlarida (masalan, Navoiy kon-metallurgiya kombinati avtoklavlarida) termoparalar to'g'ridan-to'g'ri emas, balki qalin devorli himoya gilzalari (termovell) ichiga o'rnatiladi:
         T(t) = T_0 + ΔT · (1 - e^(-t / τ))
         bu yerda:
         - Yalang'och termopara (bare probe): τ ≈ 0.8 s (juda tezkor);
         - Zanglamas po'lat gilzali (SS316): τ ≈ 6.0 s (optimal himoya);
         - Cho'yan/keramika gilzali: τ ≈ 25.0 s (og'ir inersiya, dinamik kechikish).
    `,
    procedure: [
      "Stendni ko'zdan kechiring, yerga ulanganligini tekshiring.",
      "1-rejimda termopara turini tanlang (TXA, TXK, Cu-Ko) va pech haroratini 20 dan 300 °C gacha ko'tarib EYuK ni qayd eting.",
      "2-rejimda Peltye moduliga tok bering va issiq hamda sovuq yuzalardagi harorat farqini (ΔT) o'lchang.",
      "3-rejimda Tomson effekti bo'yicha metall sterjendagi issiqlik oqimini kuzating.",
      "4-rejimda termoparaning himoya gilzasini almashtirib (yalang'och, SS316, cho'yan), vaqt doimiysi τ ni aniqlang."
    ],
    sampleData: [
      { t: 20, e_mv: 0.81, t_cold: 20 },
      { t: 60, e_mv: 2.47, t_cold: 20 },
      { t: 100, e_mv: 4.18, t_cold: 20 },
      { t: 150, e_mv: 6.35, t_cold: 20 },
      { t: 200, e_mv: 8.52, t_cold: 20 }
    ],
    questions: [
      "Zeyebek, Peltye va Tomson effektlari orasidagi termodinamik Kelvin munosabatlari qanday?",
      "Peltye elementida muzlash effekti qaysi o'tish zonasida vujudga keladi?",
      "Himoya gilzasi (termovell) qalinlashganda vaqt doimiysi τ qanday o'zgaradi?",
      "Sanoatda sovuq ulanish harorati qanday usullar bilan kompensatsiya qilinadi?"
    ],
    simulatorType: "thermoelectric"
  },
  {
    id: 2,
    title: "Bimetall termometrining ishlash prinsipini o'rganish. Bimetall termometrining dinamik xarakteristikalari (qo'lda o'lchash rejimida)",
    shortDesc: "Chiziqli kengayish koeffitsienti farqi (ГОСТ 10928), konsol plastinka egilishi, soat indikatori ИЧ-10 va sanoat spiral siferblatli termometrlari.",
    duration: "2 soat",
    purpose: "Termobimetallarning harorat ta'sirida deformatsiyalanish qonuniyatlarini o'rganish, konsol bimetall plastinkaning egilishini (s) soat indikatori ИЧ-10 yordamida o'lchash hamda sanoat spiral bimetall termometrlari (WIKA BT / ТБ-1) siferblatining burchak burilishini (φ) tadqiq qilish.",
    equipment: [
      "Bimetall konsol stendi (latun-invar, mis-invar, po'lat-invar juftliklari)",
      "Soat tipidagi chiziqli siljish indikatori (ИЧ-10, bo'linma qiymati 0.01 mm)",
      "Sanoat spiral bimetall termometri (WIKA BT-01, 0...200 °C)",
      "Termostatik suyuqlikli vanna (suv / silikon moyi, 20...120 °C)",
      "Elektron kontaktli boshqaruv relesi va signalizatsiya chirog'i"
    ],
    theory: `
      Bimetall datchiklar ikki qatlamli metall tasmadan iborat bo'lib, qatlamlar turli chiziqli issiqlik kengayish koeffitsientlariga (CHIKK, α) ega (ГОСТ 10928-90):
      - Aktiv qatlam: Latun L62 (α1 ≈ 19·10^-6 K^-1) yoki Mis (α1 ≈ 17·10^-6 K^-1);
      - Passiv qatlam: Invar 36N (α2 ≈ 1.5·10^-6 K^-1) - o'ta past kengayishli temir-nikel qotishmasi.
      
      1. Konsol bimetall plastinka erkin uchining egilishi (s):
         s = 1.5 · Δα · (L^2 / h) · ΔT
         bu yerda:
         - Δα = α1 - α2 - CHIKK lar farqi (K^-1);
         - L - plastinkaning mahkamlangan joyidan bo'sh uchigacha bo'lgan uzunligi (m);
         - h - plastinkaning umumiy qalinligi (m);
         - ΔT = T - T0 - harorat o'zgarishi (°C).
      
      2. Sanoat spiral bimetall termometri (Arximed / Gelikoid spiral):
         Agar uzun bimetall tasma (masalan, L = 280 mm) to'g'ri qo'yilsa, asbob gabaritlari haddan tashqari katta bo'lib ketardi. Sanoatda (WIKA, ТБ-1) tasma ixcham spiral shaklida o'raladi va himoya gilzasi (termoballon) ichiga joylashtiriladi.
         Spiral erkin uchining burilish burchagi (φ):
         φ = K_φ · (L / h) · ΔT ≈ (270° / 200°C) · ΔT
         Markaziy val spiral bilan bevosita birikib, 360° siferblatdagi ko'rsatkich milini (strelkani) buradi.
      
      3. Amaliy qo'llanishi:
         NMMC GMZ-2 va Navoiyazot sexlarida texnologik quvurlardagi haroratni elektr ta'minotisiz (avtonom) nazorat qilishda WIKA va ТБ-1/2 bimetall termometrlari eng ishonchli asbob hisoblanadi.
    `,
    procedure: [
      "1-rejimda vanna haroratini o'zgartirib, konsol plastinka uzunligi (L) va qalinligi (h) ning egilishga (s) ta'sirini o'lchang.",
      "Kontakt vinti va rele orqali avariya harorati signalizatsiyasini sozlang.",
      "2-rejimga (Sanoat spiral termometri) o'ting va 0 dan 200 °C gacha oraliqda siferblat strelkasining burilish burchagi φ ni tekshiring.",
      "Zanglamas po'lat gilza (SS316) va yalang'och datchikning issiqlik inersiyasini solishtiring."
    ],
    sampleData: [
      { t: 20, s_mm: 0.00, phi_deg: 0.0 },
      { t: 40, s_mm: 1.22, phi_deg: 27.0 },
      { t: 60, s_mm: 2.45, phi_deg: 54.0 },
      { t: 80, s_mm: 3.68, phi_deg: 81.0 },
      { t: 100, s_mm: 4.90, phi_deg: 108.0 }
    ],
    questions: [
      "Nima uchun passiv qatlam sifatida Invar qotishmasi qo'llaniladi?",
      "Konsol plastinka egilishi nega uzunlikning kvadratiga (L^2) proporsional?",
      "Spiral bimetall termometrlarining to'g'ri plastinkaga nisbatan konstruktiv afzalliklari nimada?",
      "Bimetall relelarda kontakt uchqunini kamaytirish uchun nima qilinadi?"
    ],
    simulatorType: "bimetal"
  },
  {
    id: 3,
    title: "Haroratning termoelektrik o'zgartirgichini tadqiq qilish",
    shortDesc: "ГОСТ 8.585-2001 bo'yicha TXA (K), TXK (L), TPP (S) termoparalari, mufel pechi va sovuq ulanish haroratini kompensatsiya qilish usullari.",
    duration: "2 soat",
    purpose: "Standart sanoat termoelektrik o'zgartirgichlari (TXA, TXK, TPP) statik xarakteristikalarini ГОСТ 8.585-2001 bo'yicha tadqiq qilish, sovuq ulanish (T0) haroratining xatoligini tahlil qilish va Pt100 asosidagi avtomatik kompensatsiya sxemasini o'rganish.",
    equipment: [
      "Laboratoriya mufel pechi (20...500 °C)",
      "Standart termoparalar: TXA (K-tip), TXK (L-tip), TPP (S-tip)",
      "Sovuq ulanish uchun Dyuar idishi (0 °C muz vannasi)",
      "Pt100 yarimo'tkazgichli xona harorati kompensatori",
      "V7-38 / Keithley 2000 laboratoriya raqamli voltmetri"
    ],
    theory: `
      Termoparalar sanoatda keng tarqalgan birlamchi o'zgartirgichlardir (ГОСТ 8.585-2001):
      1. TXA (K-tip: Xromel-Alyumel):
         - O'lchash diapazoni: -200...+1200 °C;
         - O'rtacha sezgirlik: S ≈ 41.0 mkV/°C;
         - Neytral va oksidlovchi muhitga chidamli.
      
      2. TXK (L-tip: Xromel-Kopel):
         - O'lchash diapazoni: -200...+600 °C;
         - Yuqori sezgirlik: S ≈ 68.0 mkV/°C;
         - Past va o'rta haroratlarda yuqori aniqlik beradi.
      
      3. TPP (S-tip: Platina-Platinarodiy 10%):
         - O'lchash diapazoni: 0...+1600 °C;
         - Sezgirlik: S ≈ 10.0 mkV/°C;
         - Navoiyazot va metallurgiya pechlarida yuqori haroratli etalon vosita.
      
      Sovuq ulanish haroratini (T0) kompensatsiya qilish qonuni:
         E(T, 0°C) = E(T, T0) + E(T0, 0°C)
      Agar asbob 25 °C xonada ishlasa va kompensatsiya qilinmasa, harorat taxminan 25 °C ga kam ko'rsatiladi!
    `,
    procedure: [
      "Termopara turini tanlang (TXA, TXK yoki TPP).",
      "Kompensatsiya usulini tanlang: 0°C Muzli Dyuar, Pt100 Avtokompensatsiya yoki Kompensatsiyasiz.",
      "Pech haroratini 20 dan 500 °C gacha oshirib, hosil bo'lgan termoEYuK (mV) ni qayd eting.",
      "E = f(T) grafigini chizib, ГОСТ 8.585 jadvallari bilan solishtiring."
    ],
    sampleData: [
      { t: 50, e_mv: 2.02, t0: 0 },
      { t: 100, e_mv: 4.10, t0: 0 },
      { t: 200, e_mv: 8.13, t0: 0 },
      { t: 300, e_mv: 12.21, t0: 0 },
      { t: 400, e_mv: 16.39, t0: 0 }
    ],
    questions: [
      "TXA va TXK termoparalarining kimyoviy tarkibi va sezgirlik farqi nimada?",
      "Nima uchun kompensatsion simlar termopara elektrodlari materialiga mos bo'lishi kerak?",
      "Uchinchi metall qonunining amaliy ahamiyati nima?",
      "Pt100 datchigi termopara kallasida qanday vazifani bajaradi?"
    ],
    simulatorType: "thermocouple_study"
  },
  {
    id: 4,
    title: "Qarshilik termometrlarini tadqiq qilish",
    shortDesc: "ГОСТ 6651-2009 bo'yicha Pt100, Cu50 va NTC termistorlar, Uitson ko'prigi, 2, 3 va 4-simli ulanish sxemalari.",
    duration: "2 soat",
    purpose: "Metall (platina Pt100, mis Cu50) va yarimo'tkazgichli (NTC) qarshilik termometrlarining R = f(T) statik xarakteristikasini o'rganish, Uitson o'lchov ko'prigini muvozanatlash hamda 2, 3 va 4-simli ulash sxemalarida kabel qarshiligining ta'sirini tadqiq qilish.",
    equipment: [
      "Pt100 platina termoqarshiligi (R0 = 100.00 Ω, α = 0.00385 °C^-1)",
      "Cu50 mis termoqarshiligi (R0 = 50.00 Ω, α = 0.00428 °C^-1)",
      "NTC 10k yarimo'tkazgichli termistor (B = 3950 K)",
      "Uitson o'lchov ko'prigi va nol-galvanometr",
      "Kabel qarshiligi simulyatori (0...10 Ω)",
      "Raqamli qarshiliklar do'koni (magazini)"
    ],
    theory: `
      Termoqarshiliklar (RTD) metallarning elektr qarshiligi harorat oshishi bilan chiziqli ortishiga asoslangan (ГОСТ 6651-2009):
      
      1. Platina termoqarshiliklari (Pt100, Pt500, Pt1000):
         Musbat haroratlarda Kallendar-Van Dyuzen tenglamasi:
         R(T) = R0 · (1 + A·T + B·T^2)
         bu yerda A = 3.9083·10^-3 °C^-1, B = -5.775·10^-7 °C^-2.
      
      2. Mis termoqarshiliklari (Cu50, Cu100):
         R(T) = R0 · (1 + α·T) (α = 0.00428 °C^-1)
         -50 dan +150 °C gacha yuqori chiziqlilikka ega.
      
      3. Ulanish chizig'i sxemalari (2, 3 va 4-simli):
         - 2-simli sxema: R_o'lch = R_t + 2·R_sim. Kabel qarshiligi harorat xatosiga aylanadi (2.5 Ω ≈ 6.5 °C xatolik!).
         - 3-simli sxema: Sanoat standarti (NMMC, Navoiyazot). Ko'prikning qarama-qarshi yelkalariga simlar teng ulanib, sim qarshiligi avtomatik kompensatsiya qilinadi.
         - 4-simli sxema: Laboratoriya etaloni. Tok va kuchlanish zanjirlari ajratilgan, xatolik 0.00 Ω.
    `,
    procedure: [
      "Datchik turini tanlang (Pt100, Cu50 yoki NTC).",
      "Haroratni -40 dan +180 °C gacha o'zgartirib, datchik qarshiligini hisoblang.",
      "Uitson ko'prigining qarshiliklar do'konini (d100, d10, d1, d0.1) sozlab, galvanometr milini 0 ga keltiring.",
      "2, 3 va 4-simli ulanishlarni solishtirib, kabel qarshiligi ta'sirini baholang."
    ],
    sampleData: [
      { t: 0, r_pt100: 100.00, r_cu50: 50.00 },
      { t: 50, r_pt100: 119.40, r_cu50: 60.70 },
      { t: 100, r_pt100: 138.51, r_cu50: 71.40 },
      { t: 150, r_pt100: 157.33, r_cu50: 82.10 }
    ],
    questions: [
      "Platina va mis datchiklarining o'lchash diapazoni va kimyoviy barqarorligi qanday?",
      "3-simli ulash sxemasi kabel qarshiligini qanday kompensatsiya qiladi?",
      "NTC termistorlarning B-koeffitsienti nimani bildiradi?",
      "Datchikdan o'tuvchi o'lchov tokining o'z-o'zidan qizdirish xatosi qanday bartaraf etiladi?"
    ],
    simulatorType: "resistance_thermometer"
  },
  {
    id: 5,
    title: "Haroratni o'lchash usullari",
    shortDesc: "Kontaktli (Pt100) va kontaktsiz usullar: Raytek infraqizil pirometri (Stefan-Boltsman) hamda Promin/OPIR yo'qoluvchi tolali optik pirometri (ГОСТ 2372).",
    duration: "2 soat",
    purpose: "Haroratni o'lchashning kontaktli va kontaktsiz usullarini qiyosiy tadqiq qilish, nurlanish koeffitsienti ε ning IQ pirometr aniqligiga ta'sirini o'rganish hamda Promin/OPIR teleskop okulyarida yo'qoluvchi cho'g'lanma tola optik muvozanatini amalga oshirish.",
    equipment: [
      "Portativ infraqizil pirometr (Raytek / Fluke, optik ko'rsatkich D:S = 12:1)",
      "Yo'qoluvchi cho'g'lanma tolali optik pirometr (Promin-1 / OPIR-09, ГОСТ 2372)",
      "Kontaktli etalon termometr (Pt100 zondi bilan)",
      "Laboratoriya metallurgiya pechi (800...1600 °C)",
      "Namunaviy sirtlar: Oksidlangan po'lat (ε=0.90), Keramika (ε=0.85), Oyna alyuminiy (ε=0.08)"
    ],
    theory: `
      Kontaktsiz harorat o'lchash usullari (Pirometriya) jism sirtidan tarqalayotgan issiqlik nurlanish energiyasiga asoslangan:
      
      1. Stefan-Boltsman qonuni (Radiatsion va IQ pirometriya):
         E = ε · σ · T^4
         bu yerda σ = 5.67·10^-8 Vt/(m^2·K^4), ε - sirtning qoralik darajasi (nurlanish qobiliyati).
         Agar pirometrda ε noto'g'ri o'rnatilsa (masalan, yaltiroq alyuminiy sirtda ε=0.90 qo'yilsa), asbob yuzlab gradusga kam ko'rsatadi!
      
      2. Vin siljish qonuni va Optik yorqinlik pirometriyasi (Promin / OPIR):
         Metallurgiya va quyuv pechlarida (800...2000 °C) yo'qoluvchi tolali optik pirometrlar qo'llaniladi (ГОСТ 2372).
         Teleskop okulyari orqali pechning qizigan yuzasi va markazdagi V-simon volfram tola kuzatiladi:
         - T_tola < T_pech bo'lsa: Tola qora chiziq bo'lib ko'rinadi;
         - T_tola > T_pech bo'lsa: Tola yorqin oq chiziq bo'lib ko'rinadi;
         - T_tola = T_pech bo'lsa: Tola pech foni bilan qo'shilib, butunlay YO'QOLADI (fotometrik tenglik!).
         Monoxromatik qizil yorug'lik filtri (λ = 0.65 μm) inson ko'zining spektral sezgirligini cheklab, o'lchash xatosini ±5 °C gacha kamaytiradi.
    `,
    procedure: [
      "1-rejimda IQ pirometrda turli sirtlarni (po'lat, mis, alyuminiy) tanlab, ε sozlash xatosini kuzating.",
      "Kontaktli Pt100 va kontaktsiz IQ pirometr farqini aniqlang.",
      "2-rejimga (Optik Promin pirometri) o'ting va pech haroratini 1150 °C ga o'rnating.",
      "Reostat orqali lampa tokini o'zgartirib, okulyardagi tola fon bilan bir xil bo'lib yo'qolgunicha fotometrik tenglashtiring.",
      "Qizil yorug'lik filtri (λ=0.65µm) ta'sirini baholang."
    ],
    sampleData: [
      { t_contact: 150, eps: 0.90, t_piro: 150.0, error: 0.0 },
      { t_contact: 150, eps: 0.08, t_piro: 85.2, error: -64.8 },
      { t_pech: 1150, i_lamp_a: 0.450, t_fil: 1150, holat: "Tola yo'qoldi (Muvozanat)" }
    ],
    questions: [
      "Absolyut qora jism nima va uning nurlanish koeffitsienti nechaga teng?",
      "Yaltiroq alyuminiy sirt haroratini IQ pirometrda o'lchash nega qiyin?",
      "Yo'qoluvchi cho'g'lanma tolali pirometrda fotometrik tenglik qanday aniqlanadi?",
      "Optik pirometrlarda qizil filtr (λ = 0.65 mkm) nima uchun zarur?"
    ],
    simulatorType: "temp_methods"
  },
  {
    id: 6,
    title: "Bosimni aniqlash asboblari va usullarini o'rganish. Birlamchi o'zgartirgichlar",
    shortDesc: "Burdon prujinasi, U-simon manometr, Danfoss 4-20mA tenzodatchik va ГОСТ 2405-88 qiyoslash protokoli (gisterezis va variatsiya).",
    duration: "2 soat",
    purpose: "Mutlaq, ortiqcha va gidrostatik bosim tushunchalarini o'rganish, C-simon Burdon elastik naychasi, simobli U-manometr hamda 4-20 mA elektron datchiklarning ishlashini tadqiq qilish, shuningdek ГОСТ 2405-88 bo'yicha etalon MP-60 yordamida to'g'ri va teskari yurishda manometrni davlat qiyoslashidan o'tkazish.",
    equipment: [
      "Gidropnevmatik laboratoriya bosim stendi",
      "Burdon prujinali texnik manometr (0...10 bar, sinf: 1.0)",
      "U-simon suyuqlikli manometr (simob ustuni, mm Hg)",
      "Etalon yuk-porshenli manometr (MP-60, sinfi: 0.05)",
      "Danfoss MBS seriyali tenzorezistiv bosim datchigi (4-20 mA)",
      "Vintli qo'l pressi va havo tushirish ventili"
    ],
    theory: `
      Bosim – yuza birligiga tik ta'sir etuvchi kuch: P = F / S (1 Pa = 1 N/m^2; 1 bar = 10^5 Pa = 0.1 MPa).
      
      1. Mutlaq va ortiqcha bosim bog'liqligi:
         P_mutlaq = P_ort + P_bar (P_bar ≈ 1.013 bar = 101.3 kPa).
      
      2. Burdon prujinasi ishlash mexanizmi:
         Ellips shaklidagi C-simon jez naycha ichiga bosim berilganda, uning ko'ndalang kesimi doiraga intiladi va egrilik radiusi ortib, erkin uchi tashqariga yoziladi. Tyaga va tishli sektor orqali bu harakat ko'rsatkich milining 270° ga burilishiga aylantiriladi.
      
      3. ГОСТ 2405-88 bo'yicha Davlat qiyoslash va gisterezis (variatsiya) sinovi:
         Manometrlar aniqlik sinfiga (0.4, 0.6, 1.0, 1.5, 2.5) muvofiqligi to'g'ri (bosim ko'tarilishi) va teskari (bosim tushishi) yurish bo'yicha etalon MP-60 bilan tekshiriladi:
         - Asosiy keltirilgan xato: γ = (Δ_max / P_shkala) · 100%;
         - Asbob variatsiyasi (gisterezis): b = |P_to'g'ri - P_teskari|;
         - ГОСТ talabi: b_max ≤ γ_yo'l (1.0 sinf uchun b ≤ 0.1 bar).
    `,
    procedure: [
      "Vintli press orqali bosimni 0 dan 10 bargacha har 0.5 bar qadam bilan oshiring.",
      "Burdon naychasining yozilishini, U-manometr simob sathini va 4-20 mA tokni kuzating.",
      "'Avtomatik To'liq Qiyoslash Davri' tugmasini bosib, 0 ➔ 10 ➔ 0 bar bo'yicha gisterezis jadvalini to'ldiring.",
      "Asbobning variatsiyasi b va keltirilgan xatosini ГОСТ 2405-88 talablariga solishtiring."
    ],
    sampleData: [
      { p_et: 0.0, p_dir: 0.00, p_rev: 0.00, var: 0.00, gamma: 0.0 },
      { p_et: 2.0, p_dir: 1.98, p_rev: 2.03, var: 0.05, gamma: 0.3 },
      { p_et: 4.0, p_dir: 3.97, p_rev: 4.04, var: 0.07, gamma: 0.4 },
      { p_et: 6.0, p_dir: 5.96, p_rev: 6.05, var: 0.09, gamma: 0.5 },
      { p_et: 8.0, p_dir: 7.97, p_rev: 8.04, var: 0.07, gamma: 0.4 },
      { p_et: 10.0, p_dir: 9.98, p_rev: 9.98, var: 0.00, gamma: 0.2 }
    ],
    questions: [
      "Burdon manometrlarida mexanik gisterezis (variatsiya) nima sababdan yuzaga keladi?",
      "Yuk-porshenli manometrda (MP-60) disklar nega qo'lda aylantirib turiladi?",
      "4-20 mA unifikatsiyalangan signalning 0-5 mA ga nisbatan afzalliklari nima?",
      "Manometrning 1.0 aniqlik sinfi nimani anglatadi?"
    ],
    simulatorType: "pressure_sensors"
  },
  {
    id: 7,
    title: "O'lchov diafragmasini tarirlash (kalibrlash)",
    shortDesc: "ГОСТ 8.586.1..5-2005 standart toraytiruvchi qurilmalar: Standart diafragma, Venturi quvuri va Standart soplo energetik yo'qotishlarini taqqoslash.",
    duration: "2 soat",
    purpose: "Quvurlarda sarfni differensial bosim usuli bilan o'lchash tamoyilini o'rganish, standart diafragma, Venturi quvuri va standart soplodagi bosimlar farqi (ΔP) va tiklanmas gidravlik yo'qotishlarni (ΔP_loss) qiyosiy tadqiq qilish hamda tarirlash koeffitsienti K ni hisoblash.",
    equipment: [
      "Gidrodinamik quvur stendi (diametri D = 50 mm)",
      "Standart o'lchov diafragmasi (d = 25 mm, modul m = 0.25)",
      "Klassik Venturi quvuri (konfuzor 21°, diffuzor 7°)",
      "Standart soplo (ГОСТ 8.586.3)",
      "Raqamli differensial datchik (Metran-150 / DMD-331)",
      "Ikki ustunli shisha piezometrlar (suv sathi farqi Δh mm H2O)"
    ],
    theory: `
      Sarfni o'zgaruvchan bosimlar farqi bilan o'lchash Bernulli tenglamasi va oqim uzluksizligi qonuniga asoslangan (ГОСТ 8.586.1-5-2005):
      
      1. Hajmiy sarf tenglamasi:
         Q = K_tarirlash · √ΔP
         bu yerda K_tarirlash = C · ε · (π · d^2 / 4) · √(2 / ρ).
         Sarf va differensial bosim kvadratik bog'liqlikda: agar sarf 2 marta ortsa, ΔP 4 marta ortadi!
      
      2. Toraytiruvchi qurilmalar taqqoslanishi va energiya yo'qotishlari:
         - Standart diafragma (ГОСТ 8.586.2): O'tkir to'g'ri burchakli teshik. Tayyorlash oson, biroq orqasida kuchli turbulent girdoblar hosil bo'ladi. Tiklanmas bosim yo'qolishi: ΔP_loss ≈ 65% (katta nasos quvvati sarflanadi).
         - Venturi quvuri (ГОСТ 8.586.4): Silliq konussimon torayuvchi konfuzor va asta-sekin kengayuvchi diffuzor. Diffuzor kinetik energiyani yana statik bosimga qaytaradi. Tiklanmas yo'qotish atigi: ΔP_loss ≈ 12%! (NMMC GMZ rudali pulpa magistrallarida elektr energiyasini millionlab kVt·soat tejaydi).
         - Standart soplo (ГОСТ 8.586.3): Dumaloq profilli kirish. Aşınmaga chidamli, yo'qotish: ΔP_loss ≈ 45%.
    `,
    procedure: [
      "Toraytiruvchi qurilma turini tanlang: Diafragma, Venturi quvuri yoki Standart soplo.",
      "Quvur sarfini 0 dan 8 m³/soat gacha oshirib, differensial bosim ΔP (kPa) va piezometrlardagi sath farqini (Δh) qayd eting.",
      "Tiklanmas bosim yo'qolishini (ΔP_loss) va nasos quvvat sarfini solishtiring.",
      "Q = f(√ΔP) grafigini chizib, tarirlash koeffitsienti K ni aniqlang."
    ],
    sampleData: [
      { q_m3h: 2.0, dp_kpa: 4.00, sqrt_dp: 2.00, loss_diaf: 2.60, loss_venturi: 0.48 },
      { q_m3h: 4.0, dp_kpa: 16.00, sqrt_dp: 4.00, loss_diaf: 10.40, loss_venturi: 1.92 },
      { q_m3h: 6.0, dp_kpa: 36.00, sqrt_dp: 6.00, loss_diaf: 23.40, loss_venturi: 4.32 },
      { q_m3h: 8.0, dp_kpa: 64.00, sqrt_dp: 8.00, loss_diaf: 41.60, loss_venturi: 7.68 }
    ],
    questions: [
      "Venturi quvuridagi diffuzor nega bosim yo'qolishini 12% gacha kamaytiradi?",
      "Nima uchun diafragmada bosim shtutserlari bevosita disk yoniga (burchak usulida) o'rnatiladi?",
      "Diafragmadan oldin to'g'ri quvur uchastkasi (L ≥ 10·D) bo'lishi nega talab etiladi?",
      "Reynolds soni oqim rejimiga (laminar / turbulent) qanday ta'sir ko'rsatadi?"
    ],
    simulatorType: "orifice_calibration"
  },
  {
    id: 8,
    title: "Idish ichidagi bosimni TRM1 turidagi o'lchagich-regulyator va bosim o'lchash asbobi asosida bajarilgan bosim relesi yordamida nazorat qilish, suyuqlik uzatishni diskret zadvishka orqali boshqarish",
    shortDesc: "Mikrokontrollerli ОВЕН ТРМ1 va ТРМ210: Ikki pozitsiyali gisterezisli releli rostlash hamda uzluksiz PI/PID klapan drossellash algoritmlari.",
    duration: "2 soat",
    purpose: "Rezervuardagi bosimni mikroprotsessorli ОВЕН ТРМ1 universal regulyatori va bosim relesi yordamida ikki pozitsiyali (releli) hamda ОВЕН ТРМ210 orqali uzluksiz proporsional-integral (PI/PID) drossellash usulida avtomatik boshqarish qonuniyatlarini tadqiq qilish.",
    equipment: [
      "Avtomatlashtirilgan rezervuar stendi (idish 2.5 m³, bosim nasosi)",
      "Mikrokontrollerli ОВЕН ТРМ1 bir kanalli o'lchagich-regulyator",
      "Mikrokontrollerli ОВЕН ТРМ210 PID rostlagich",
      "Tenzo-rezistiv bosim datchigi (4-20 mA)",
      "Elektromotorli diskret va proporsional boshqariluvchi zadvishka",
      "Avariya himoya klapani va optik-akustik signalizatsiya bloki"
    ],
    theory: `
      Sanoat jarayonlarida rezervuar va kollektorlardagi bosimni rostlashning 2 ta asosiy usuli qo'llaniladi:
      
      1. Ikki pozitsiyali (Releli) gisterezisli rostlash (ОВЕН ТРМ1):
         - Ustavka (SP): Maqsadli bosim (masalan, 3.5 bar);
         - Gisterezis zonasi (Δ): Kommutatsiya chegarasi (masalan, 0.5 bar);
         - Mantiq: P ≥ (SP + Δ) = 4.0 bar da rele ulanadi va zadvishka to'liq ochiladi (100%);
           P ≤ (SP - Δ) = 3.0 bar da rele uziladi va zadvishka yopiladi (0%).
         Kamchiligi: Bosim ustavka atrofida doimiy tebranib turadi (pila shaklidagi tebranish) va zadvishka mexanizmi ko'p marta ishga tushib yeyiladi.
      
      2. Uzluksiz PI / PID drossellash rostlashi (ОВЕН ТРМ210):
         Klapan chekka holatlarga emas, balki proporsional-integral qonuni bo'yicha oraliq darajaga (masalan, 42%, 48%) ochiladi:
         u(t) = K_p · e(t) + (1 / T_i) · ∫ e(t) dt
         bu yerda e(t) = P(t) - SP - rostlash xatoligi.
         Afzalligi: Bosim hech qanday tebranishsiz aniq 3.50 bar da barqarorlashadi, gidrozarb (suv urilishi) xavfi yo'qoladi va magistralda barqaror oqim ta'minlanadi.
    `,
    procedure: [
      "1-rejimda TRM1 ning ustavkasi (SP=3.5 bar) va gisterezisini (Δ=0.5 bar) sozlang.",
      "Nasosni yoqing va releli zadvishkaning davriy ochilib-yopilish siklini kuzating.",
      "2-rejimga (Uzluksiz PID rostlash) o'ting va Kp=2.5, Ti=6.0 s parametrlarni o'rnating.",
      "Klapan ochiqligi foizini va bosimning tebranishsiz barqarorlashuv jarayonini tahlil qiling."
    ],
    sampleData: [
      { t_sec: 0, p_bar: 2.0, rejim: "Releli", zadvishka: "0% (Yopiq)", izoh: "Bosim yig'ilmoqda" },
      { t_sec: 20, p_bar: 4.0, rejim: "Releli", zadvishka: "100% (Ochiq)", izoh: "Rele ishladi (SP+Δ)" },
      { t_sec: 35, p_bar: 3.0, rejim: "Releli", zadvishka: "0% (Yopiq)", izoh: "Rele uzildi (SP-Δ)" },
      { t_sec: 60, p_bar: 3.5, rejim: "PID", zadvishka: "44% (Drossel)", izoh: "Barqaror ustavka ushlandi" }
    ],
    questions: [
      "TRM1 da gisterezis (Δ) nolga teng qilib qo'yilsa qanday salbiy oqibat yuzaga keladi?",
      "Ikki pozitsiyali boshqaruv bilan PID boshqaruvning asosiy farqlari nimada?",
      "Integral vaqti Ti juda kichik qilib qo'yilsa nima sodir bo'ladi?",
      "Avariya tushirish klapanining texnologik xavfsizlikdagi roli nima?"
    ],
    simulatorType: "trm1_controller"
  }
];

// Browser va Node muhitlari uchun eksport
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { universityInfo, laboratories };
}
