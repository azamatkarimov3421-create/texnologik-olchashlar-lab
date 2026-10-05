// Navoiy davlat konchilik va texnologiyalar universiteti (NDKTU)
// Kafedra: "Avtomatlashtirish va boshqaruv"
// Fan: Sohaning texnologik o'lchashlari va asboblari
// O'qituvchi: Israilov Temur Anvar o'g'li | Guruh: 17V-25 TJA
// 8 ta laboratoriya mavzusi bo'yicha 20 tadan (jami 160 ta) xatosiz testlar banki

const labQuizzes = {
  // =========================================================================
  // 1-MAVZU: Termoelektrik hodisalar
  // =========================================================================
  1: [
    {
      question: "Ikki xil metall kontaktida haroratlar farqi hisobiga termoEYuK hosil bo'lish hodisasi kim tomonidan kashf etilgan va qanday nomlanadi?",
      options: [
        "1821-yil, Thomas Seebeck (Zeyebek effekti)",
        "1834-yil, Jean Peltier (Peltye effekti)",
        "1856-yil, William Thomson (Tomson effekti)",
        "1840-yil, James Joule (Joul effekti)"
      ],
      answer: 0,
      explanation: "1821-yilda nemis fizigi Thomas Johann Seebeck ikki xil o'tkazgichdan iborat berk zanjir uchlari turli haroratlarda tutilganda zanjirda elektr toki (termoEYuK) paydo bo'lishini kashf etgan."
    },
    {
      question: "Peltye effektining fizik mohiyati nimadan iborat?",
      options: [
        "O'tkazgich qizdirilganda undan elektronlar emissiyasi",
        "Ikki xil o'tkazgich kontaktidan o'zgarmas tok o'tganda kontaktda qo'shimcha issiqlik ajralishi yoki yutilishi",
        "Harorat gradientli bir jinsli o'tkazgichdan tok o'tganda issiqlik ajralishi",
        "Magnit maydonida o'tkazgich qarshiligining o'zgarishi"
      ],
      answer: 1,
      explanation: "Peltye effekti (1834-y.) - ikki xil jinsli o'tkazgichlar tutashmasidan tok o'tganda, tokning yo'nalishiga bog'liq ravishda ulanish joyida issiqlik yutilishi (sovish) yoki ajralishi hodisasidir."
    },
    {
      question: "Tomson effekti qanday sharoitda vujudga keladi?",
      options: [
        "Faqat o'ta past (kriogen) haroratlarda",
        "Ikki xil metall kontaktiga o'zgaruvchan tok berilganda",
        "Bo'ylama harorat gradientiga (dT/dx) ega bir jinsli o'tkazgichdan elektr toki o'tganda",
        "Metall suyuqlantirilganda"
      ],
      answer: 2,
      explanation: "Tomson effekti (1856-y., Lord Kelvin) bo'yicha bir jinsli o'tkazgich bo'ylab haroratlar farqi mavjud bo'lganda, undan tok o'tishi natijasida Joul issiqligidan tashqari qo'shimcha issiqlik ajraladi yoki yutiladi."
    },
    {
      question: "Termoelektrod juftligining differensial termosezgirligi (solishtirma termoEYuK koeffitsienti e_AB) qanday birlikda o'lchanadi?",
      options: [
        "Volt / metr (V/m)",
        "Mikrovolt / gradus (mkV/°C yoki mkV/K)",
        "Om / gradus (Om/°C)",
        "Amper / Kelvin (A/K)"
      ],
      answer: 1,
      explanation: "Termosezgirlik e_AB = dE/dT bo'lib, harorat 1 °C ga o'zgarganda hosil bo'ladigan termoEYuK miqdorini bildiradi va mkV/°C (yoki mkV/K) da o'lchanadi."
    },
    {
      question: "Agar termopara ikkita bir xil metalldan (masalan mis-mis) yasalsa, haroratlar farqi mavjud bo'lganda zanjirda qanday termoEYuK hosil bo'ladi?",
      options: [
        "Juda katta termoEYuK hosil bo'ladi",
        "TermoEYuK nolga teng bo'ladi (E = 0)",
        "Faqat o'zgaruvchan EYuK hosil bo'ladi",
        "Simning uzunligiga qarab 10 mV hosil bo'ladi"
      ],
      answer: 1,
      explanation: "Bir jinsli o'tkazgichda erkin elektronlarning energetik sathlari va kontakt potensiallar farqi bir xil bo'lgani sababli, termopara faqat ikki xil jinsli o'tkazgichlardan iborat bo'lgandagina termoEYuK hosil qiladi."
    },
    {
      question: "Peltye yarimo'tkazgichli sovutish modullarida (masalan TEC-12706) qaysi moddalar asosiy ishchi juftlik sifatida qo'llaniladi?",
      options: [
        "Vismut va surma telluridi (Bi2Te3 va Sb2Te3)",
        "Sof mis va alyuminiy",
        "Platina va oltin",
        "Temir va rux qotishmasi"
      ],
      answer: 0,
      explanation: "Vismut telluridi (Bi2Te3) yarimo'tkazgichlari yuqori termoelektrik samaradorlik koeffitsientiga (Z) ega bo'lib, zamonaviy Peltye sovutish modullarining asosiy asosi hisoblanadi."
    },
    {
      question: "Peltye moduliga berilayotgan o'zgarmas tokning qutblari teskarisiga almashtirilsa (polyarlik o'zgarsa) nima sodir bo'ladi?",
      options: [
        "Modul darhol yonib ketadi",
        "Sovuq va issiq yuzalarning o'rni almashadi (oldingi sovugan yuza qiziy boshlaydi)",
        "Modul elektr tokini umuman o'tkazmay qo'yadi",
        "Hech qanday o'zgarish bo'lmaydi"
      ],
      answer: 1,
      explanation: "Peltye effekti qaytar jarayondir: tok yo'nalishi o'zgarganda elektronlarning kontakt sathlaridan o'tish yo'nalishi o'zgaradi va issiqlik yutilish hamda ajralish zonalari teskarisiga almashadi."
    },
    {
      question: "Termodatchikning dinamik issiqlik inersiyasini xarakterlovchi vaqt doimiysi (τ) nimani ifodalaydi?",
      options: [
        "Datchikning to'liq erib ketish vaqtini",
        "Pech harorati sakrashsimon o'zgarganda, datchik ko'rsatishi to'liq o'zgarishning 63.2% qismiga yetib borish vaqtini",
        "Datchikning xizmat qilish kafolat muddatini",
        "Termopara simi bo'ylab elektr signali tarqalish vaqtini"
      ],
      answer: 1,
      explanation: "T(t) = T0 + ΔT·(1 - e^(-t/τ)) tenglamasiga ko'ra, t = τ bo'lganda (1 - e^-1) ≈ 0.632 (ya'ni 63.2%) ga teng bo'ladi. Bu datchikning asosiy dinamik ko'rsatkichidir."
    },
    {
      question: "Termopara yalang'och (ochiq) holatdan qalin devorli cho'yan himoya gilzasiga o'rnatilganda uning vaqt doimiysi τ qanday o'zgaradi?",
      options: [
        "Keskin ortadi (inersiya kuchayadi, asbob kechikib ko'rsatadi)",
        "Keskin kamayadi (asbob tezroq ko'rsatadi)",
        "Umuman o'zgarmaydi",
        "Dastlab kamayadi, keyin o'zgarmaydi"
      ],
      answer: 0,
      explanation: "Himoya gilzasi (termovell) qo'shimcha massaga va issiqlik sig'imiga ega bo'lganligi sababli, issiqlik oqimi datchik uchiga yetib borishi uchun ko'proq vaqt talab qilinadi va τ bir necha barobarga (masalan 0.8 s dan 25 s gacha) ortadi."
    },
    {
      question: "Sanoatda eng keng qo'llaniladigan K-turdagi (TXA) termopara qaysi metallar juftligidan iborat?",
      options: [
        "Mis va Konstantan",
        "Xromel (Ni-Cr) va Alyumel (Ni-Al)",
        "Platina va Platinarodiy",
        "Temir va Nikel"
      ],
      answer: 1,
      explanation: "TXA (Termopara Xromel-Alyumel) xalqaro K-turiga mos keladi: musbat elektrod - Xromel, manfiy elektrod - Alyumel."
    },
    {
      question: "Peltye issiqligi (Q_P) miqdori qaysi formulaga binoan hisoblanadi?",
      options: [
        "Q_P = I^2 · R · t",
        "Q_P = Π_AB · I · t",
        "Q_P = C · m · ΔT",
        "Q_P = U · I / t"
      ],
      answer: 1,
      explanation: "Peltye issiqligi tok kuchi (I), vaqt (t) va kontaktga xos Peltye koeffitsienti (Π_AB) ga to'g'ri proporsional: Q_P = Π_AB · I · t."
    },
    {
      question: "Zeyebek formulasida E_AB = α_AB · (T1 - T2) bo'lsa, T1 va T2 nimani bildiradi?",
      options: [
        "Atrof-muhit va xona harorati",
        "Termoparaning qaynoq (ishchi) va sovuq (erkin) uchlari harorati",
        "Pech va muzning erish harorati",
        "Millivoltmetr va simlar harorati"
      ],
      answer: 1,
      explanation: "T1 - o'lchanayotgan texnologik muhitga tushirilgan ishchi (qaynoq) ulanish harorati, T2 - qiyoslash (sovuq/erkin) ulanish nuqtasi harorati."
    },
    {
      question: "Oraliq metall qonuniga binoan, termopara zanjiriga uchinchi metall (masalan mis ulovchi sim) kiritilsa, zanjirning umumiy termoEYuK ga ta'siri qanday bo'ladi?",
      options: [
        "TermoEYuK har doim ikki barobarga oshadi",
        "Agar kiritilgan uchinchi metallning ikkala ulanish nuqtasi bir xil haroratda bo'lsa, umumiy EYuK o'zgarmaydi",
        "TermoEYuK darhol nolga tushib qoladi",
        "Faqat manfiy EYuK hosil bo'ladi"
      ],
      answer: 1,
      explanation: "Termodinamikaning 3-qonuni (oraliq metallar qoidasi)ga ko'ra, agar qo'shimcha o'tkazgichning har ikkala uchi bir xil haroratda saqlansa, u umumiy termoEYuK miqdorini o'zgartirmaydi."
    },
    {
      question: "TXK (L-tur: Xromel-Kopel) termoparasining TXA (K-tur) ga nisbatan o'ziga xos asosiy xususiyati nima?",
      options: [
        "TXK ancha yuqori sezgirlikka ega (taxminan 68 mkV/°C ga nisbatan 41 mkV/°C)",
        "TXK 2000 °C gacha chidaydi",
        "TXK faqat suv ostida ishlaydi",
        "TXK faqat o'zgaruvchan tokda ishlaydi"
      ],
      answer: 0,
      explanation: "Kopel qotishmasi katta manfiy termosezgirlikka ega bo'lgani sababli, Xromel-Kopel juftligi eng yuqori termoEYuK hosil qiluvchi (68 mkV/°C) sanoat termoparalaridan biridir."
    },
    {
      question: "Sanoatda termopara datchigi qisqa tutashuvga uchrasa (simlar o'zaro tutashib qolsa), ikkilamchi asbob nimani ko'rsatadi?",
      options: [
        "Har doim 0 °C ko'rsatadi",
        "Qisqa tutashuv sodir bo'lgan nuqtadagi haroratni ko'rsatadi",
        "Maksimal 1500 °C ko'rsatadi",
        "Asbob darhol o'chib qoladi"
      ],
      answer: 1,
      explanation: "Termopara uchun 'ishchi ulanish' nuqtasi aynan ikki o'tkazgichning birinchi tutashgan joyidir. Agar liniya o'rtasida qisqa tutashuv bo'lsa, yangi tutashma o'sha yerda hosil bo'ladi va asbob o'sha nuqta haroratini ko'rsatadi."
    },
    {
      question: "Termoparaning ishchi zanjiri uzilib ketsa (obryv), zamonaviy mikroprotsessorli o'lchash asbobi qanday munosabat bildiradi?",
      options: [
        "Shkala boshiga (0 mV) tushadi va normal ishlayveradi",
        "Shkala oxiriga intiladi yoki 'Avariya / Datchik uzildi' xabari bilan signalizatsiyani yoqadi",
        "Asbob portlab ketadi",
        "Pechning qizdirilishini maksimal darajaga ko'tarib yuboradi"
      ],
      answer: 1,
      explanation: "Xavfsizlik qoidalariga binoan, zanjir uzilganda o'lchagich shkalaning yuqori chegarasiga chiqadi yoki avariya xabarini berib, texnologik pechni o'chiradi."
    },
    {
      question: "Zeyebek, Peltye va Tomson koeffitsientlari o'rtasidagi termodinamik bog'liqlikni kim isbotlagan?",
      options: [
        "Lord Kelvin (William Thomson)",
        "Albert Einstein",
        "Isaac Newton",
        "Dmitriy Mendeleyev"
      ],
      answer: 0,
      explanation: "Lord Kelvin termodinamika qonunlarini qo'llab, Peltye va Zeyebek koeffitsientlari bog'liqligini (Π = e·T) va Tomson munosabatlarini nazariy jihatdan isbotlab bergan."
    },
    {
      question: "Termoelektrik termometrlarning (termoparalarning) qarshilik termometrlariga nisbatan asosiy ustunligi nima?",
      options: [
        "O'ta yuqori haroratlarni (1300...1800 °C gacha) o'lchay olishi va yuqori mustahkamligi",
        "Hech qanday kalibrovka talab qilmasligi",
        "Juda katta qarshilikka egaligi",
        "Faqat xona haroratida ishlashi"
      ],
      answer: 0,
      explanation: "Termoparalar o'tga chidamli qotishmalardan yasalishi sababli metallurgiya va tog'-kon pechlarining 1000 °C dan yuqori haroratlarida ishlashda tengsizdir."
    },
    {
      question: "Termoparaning ochiq (yalang'och) uchi uchun vaqt doimiysi τ taxminan qanchaga teng?",
      options: [
        "0.5 - 1.5 sekund",
        "10 - 15 minut",
        "1 - 2 soat",
        "0.001 mikrosekund"
      ],
      answer: 0,
      explanation: "Himoya qoplamasisiz yalang'och termopara uchi juda kam massaga ega bo'lganligi sababli uning vaqt doimiysi taxminan 0.5 - 1.5 s atrofida bo'lib, o'ta tezkor hisoblanadi."
    },
    {
      question: "Agar termoparaning qaynoq uchi T1 = 250 °C, sovuq uchi T2 = 250 °C bo'lsa, zanjirdagi termoEYuK qanchaga teng bo'ladi?",
      options: [
        "10.2 mV",
        "0 mV",
        "50 mV",
        "-5 mV"
      ],
      answer: 1,
      explanation: "Zeyebek qonuniga ko'ra E = e_AB·(T1 - T2). Agar T1 = T2 bo'lsa, E = e_AB·(250 - 250) = 0 mV bo'ladi."
    }
  ],

  // =========================================================================
  // 2-MAVZU: Bimetall termometrlar va dinamik xarakteristikalari
  // =========================================================================
  2: [
    {
      question: "Bimetall sezgir elementining ishlash printsipi qaysi fizik qonuniyatga asoslangan?",
      options: [
        "Metallarning magnit xossalarining haroratga bog'liqligiga",
        "Ikki xil metallning chiziqli issiqlikdan kengayish koeffitsientlari (CHIKK, α) farqiga",
        "Metallarning elektr o'tkazuvchanligi haroratda pasayishiga",
        "Pyezoelektrik effektga"
      ],
      answer: 1,
      explanation: "Bimetall datchiklar qattiq payvandlangan ikki qatlamdan iborat bo'lib, harorat ko'tarilganda qatlamlar turlicha kengayadi (α1 ≠ α2) va plastinka egiladi."
    },
    {
      question: "Bimetall plastinkaning passiv qatlami uchun odatda qaysi material qo'llaniladi?",
      options: [
        "Latun L62",
        "Invar qotishmasi (36N)",
        "Sof mis",
        "Alyuminiy"
      ],
      answer: 1,
      explanation: "Invar (36% Ni, 64% Fe) o'ta past chiziqli kengayish koeffitsientiga (α ≈ 1.5·10^-6 K^-1) ega bo'lib, bimetallarda ideal passiv qatlam hisoblanadi."
    },
    {
      question: "Bimetall plastinkaning aktiv qatlami sifatida ko'pincha qaysi metallar tanlanadi?",
      options: [
        "Latun, mis yoki nikel qotishmalari (CHIKK yuqori bo'lgan metallar)",
        "Invar yoki platina",
        "Volfram va molibden",
        "Qo'rg'oshin"
      ],
      answer: 0,
      explanation: "Aktiv qatlam qizdirilganda kuchli kengayishi kerak, shuning uchun CHIKK ko'rsatkichi yuqori bo'lgan Latun (α ≈ 19·10^-6 K^-1) yoki Mis tanlanadi."
    },
    {
      question: "Bimetall konsol plastinkasi qizdirilganda uning erkin uchi qaysi tomonga qarab egiladi?",
      options: [
        "Aktiv (CHIKK katta) qatlam tomonga",
        "Passiv (CHIKK kichik - Invar) qatlam tomonga",
        "Egilmaydi, faqat cho'ziladi",
        "Tasodifiy tomonga"
      ],
      answer: 1,
      explanation: "Aktiv qatlam ko'proq uzaygani sababli, u passiv qatlamni o'z tomoniga egadi, natijada egrilik markazi passiv qatlam tomon yo'naladi."
    },
    {
      question: "Konsol bimetall plastinkasining erkin uchi egilishi (s) plastinka uzunligi (L) ga qanday bog'liq?",
      options: [
        "Uzunlikning kvadratiga to'g'ri proporsional (s ~ L^2)",
        "Uzunlikka teskari proporsional (s ~ 1/L)",
        "Uzunlikka umuman bog'liq emas",
        "Uzunlikning kubiga teskari proporsional"
      ],
      answer: 0,
      explanation: "Formula bo'yicha s = [3·L^2·(α1 - α2)·ΔT] / (2·h). Ya'ni uzunlik L ikki barobar oshsa, egilish 4 barobar ortadi."
    },
    {
      question: "Agar bimetall plastinkaning qalinligi (h) 2 barobar oshirilsa, egilish miqdori (s) qanday o'zgaradi?",
      options: [
        "2 barobar kamayadi",
        "2 barobar ortadi",
        "4 barobar ortadi",
        "O'zgarmaydi"
      ],
      answer: 0,
      explanation: "Plastinka qalinligi h maxrajda turadi (s ~ 1/h). Qalinlik oshsa, plastinkaning mexanik qattiqligi ortadi va egilish miqdori 2 barobar kamayadi."
    },
    {
      question: "Sanoat bimetall termometrlarida (masalan WIKA BT) sezgir element nima uchun spiral (gelikoid) shaklida o'raladi?",
      options: [
        "Tashqi ko'rinishini chiroyli qilish uchun",
        "Ixcham korpus ichida bimetall lentaning katta uzunligini joylashtirish va strelkaning yetarli burchakka burilishini ta'minlash uchun",
        "Og'irligini kamaytirish uchun",
        "Elektr tokini tejash uchun"
      ],
      answer: 1,
      explanation: "To'g'ri plastinkaning egilishi kichik bo'ladi. Uni spiral qilib o'rash orqali 200-300 mm uzunlikdagi tasma ixcham gilzaga sig'diriladi va strelka 270° gacha bemalol buriladi."
    },
    {
      question: "Spiral bimetall termometrda burchak burilishi (φ) harorat o'zgarishi (ΔT) ga qanday bog'liq?",
      options: [
        "Kvadratik bog'liq",
        "Chiziqli to'g'ri mutanosib (φ = K_b · L · ΔT / h)",
        "Teskari proporsional",
        "Logarifmik bog'liq"
      ],
      answer: 1,
      explanation: "Burchak burilishi harorat farqiga chiziqli bog'liq bo'lib, shu tufayli bimetall termometrlarning siferblat shkalasi bir tekis (ravnomernaya) bo'ladi."
    },
    {
      question: "Laboratoriya stendida konsol bimetall plastinkaning chiziqli siljishini o'lchashda qaysi asbob qo'llaniladi?",
      options: [
        "Soat tipidagi indikator (ИЧ-10, bo'linma qiymati 0.01 mm)",
        "Oddiy yog'och chizg'ich",
        "Lazerni o'lchash datchigi",
        "Shtangensirkul"
      ],
      answer: 0,
      explanation: "ИЧ-10 indikatori tishli uzatmali mexanizm orqali plastinka uchining 0.01 mm gacha bo'lgan mikron darajasidagi egilishini aniq ko'rsatadi."
    },
    {
      question: "Bimetall termometrlarning asosiy afzalliklaridan biri nima?",
      options: [
        "Tashqi elektr manbaisiz (avtonom) ishlashi, mustahkamligi va ko'rsatishining qulayligi",
        "1500 °C dan yuqori haroratlarda erimasligi",
        "Mutlaq xatoligining nolga tengligi",
        "Mikrokontrollerga bevosita raqamli signal uzatishi"
      ],
      answer: 0,
      explanation: "Bimetall termometrlar to'liq mexanik asbob bo'lib, elektr ta'minoti talab qilmaydi, tebranishlarga chidamli va bevosita texnologik truboprovodlarda o'rnatiladi."
    },
    {
      question: "Bimetall termometrlarning asosiy kamchiligi nima?",
      options: [
        "Katta issiqlik inersiyasi (sekin javob berishi) va nisbatan pastroq aniqlik sinfi (1.0 - 2.5)",
        "O'ta qimmatligi",
        "Tok urish xavfining yuqoriligi",
        "Vakuumda ishlay olmasligi"
      ],
      answer: 0,
      explanation: "Bimetall element va uning himoya trubkasi sezilarli massaga ega, shuning uchun tez o'zgaruvchi jarayonlarni o'lchashda dinamik kechikishga ega bo'ladi."
    },
    {
      question: "Termobimetall materiallar bo'yicha qaysi davlat standarti amal qiladi?",
      options: [
        "ГОСТ 10928-90",
        "ГОСТ 2405-88",
        "ГОСТ 8.586-2005",
        "ГОСТ 6651-2009"
      ],
      answer: 0,
      explanation: "ГОСТ 10928-90 'Termobimetallar' ning turlari, qatlamlarning qalinligi va chiziqli kengayish koeffitsientlarini tartibga soladi."
    },
    {
      question: "Bimetall relelar (termorele) maishiy texnikada (dazmol, choynak, sovutgich) qanday vazifani bajaradi?",
      options: [
        "Harorat belgilangan darajaga yetganda elektr zanjirini uzish yoki ulash (haroratni chegaralash)",
        "Kuchlanishni oshirish",
        "Suvni filtrlash",
        "Suvning bosimini o'lchash"
      ],
      answer: 0,
      explanation: "Bimetall kontakt harorat ko'tarilganda egilib elektr kontaktlarini ajratadi va qizdirish elementini o'chiradi; sovuganda yana tutashib zanjirni ulaydi."
    },
    {
      question: "Bimetall plastinka harorat pasayganda (sovutilganda) qaysi tomonga qarab egiladi?",
      options: [
        "Aktiv (CHIKK katta bo'lgan) qatlam tomonga",
        "Passiv (Invar) qatlam tomonga",
        "Umuman egilmaydi",
        "Burilib spiral bo'lib qoladi"
      ],
      answer: 0,
      explanation: "Sovutilganda aktiv qatlam passiv qatlamga qaraganda ko'proq qisqaradi, natijada plastinka aktiv qatlam tomonga qarab egiladi."
    },
    {
      question: "Bimetall termometrlarning o'lchash diapazoni odatda qanday chegaralarda bo'ladi?",
      options: [
        "-70 °C dan +500 °C gacha",
        "0 °C dan 3000 °C gacha",
        "+500 °C dan +1800 °C gacha",
        "-273 °C dan 0 °C gacha"
      ],
      answer: 0,
      explanation: "Bimetall termometrlar metallarning elastiklik chegarasi doirasida ishlaydi, shuning uchun ularning maksimal chegarasi odatda 400...500 °C dan oshmaydi."
    },
    {
      question: "Sanoat bimetall termometrlari korpusida strelkani mexanik 'nol'ga sozlash qanday amalga oshiriladi?",
      options: [
        "Korpus orqasidagi sozlash vinti (yustirovka vinti) orqali",
        "Strelkani qo'l bilan burab sindirish orqali",
        "Simlarni qayta ulash orqali",
        "Dasturiy kod yozish orqali"
      ],
      answer: 0,
      explanation: "Bimetall datchik shtoki orqasida yoki siferblat markazida maxsus sozlash vinti bo'lib, uning yordamida strelkaning boshlang'ich holati etalonga moslab buriladi."
    },
    {
      question: "Bimetall datchikni himoya gilzasiga o'rnatganda issiqlik o'tkazuvchanlikni oshirish uchun nima qilinadi?",
      options: [
        "Gilza ichiga issiqlik o'tkazuvchi moy yoki pasta (termopasta) qo'shiladi",
        "Gilza ichiga havo purkaladi",
        "Gilza ichiga qum solinadi",
        "Hech narsa qilinmaydi"
      ],
      answer: 0,
      explanation: "Havo yomon issiqlik o'tkazuvchi hisoblanadi; gilza va datchik naychasi orasidagi havo bo'shlig'ini termopasta yoki moy bilan to'ldirish inersiyani sezilarli kamaytiradi."
    },
    {
      question: "Bimetall plastinkaning ichki qatlamlari orasidagi bog'liqlik qanday ta'minlanadi?",
      options: [
        "Diffuzion payvandlash yoki issiq prokatka orqali molekulyar darajada biriktiriladi",
        "Oddiy kley (elim) bilan yopishtiriladi",
        "Iplar bilan bog'lanadi",
        "Bir-birining ustiga shunchaki qo'yib qo'yiladi"
      ],
      answer: 0,
      explanation: "Yuqori bosim va harorat ostida issiq prokatlash (diffuziya) usuli orqali metall atomlari bir-biriga chuqur kirishib, ajralmas mustahkam yaxlit qatlam hosil qiladi."
    },
    {
      question: "Bimetall diskli 'sakrovchi' (snap-action) relelarning afzalligi nimada?",
      options: [
        "Harorat kritik nuqtaga yetganda kontaktning sakrab (lahzada) ochilishi va elektr yoyining oldini olinishi",
        "O'ta past narxga egaligi",
        "Suv ostida ishlashi",
        "Katta og'irlikka egaligi"
      ],
      answer: 0,
      explanation: "Sekin ajralishda elektr yoyi paydo bo'lib kontaktlar kuyadi. Bimetall qavariq disk sakrab holatini o'zgartirishi orqali kontaktni lahzada uzadi."
    },
    {
      question: "Konsol bimetall plastinka egilishini o'rganishda harorat farqi ΔT = 50 °C dan 100 °C ga ko'tarilsa, egilish s qanday o'zgaradi?",
      options: [
        "2 barobar ortadi",
        "4 barobar ortadi",
        "O'zgarmaydi",
        "2 barobar kamayadi"
      ],
      answer: 0,
      explanation: "Egilish formulasi bo'yicha s to'g'ridan-to'g'ri ΔT ga proporsionaldir (s ~ ΔT). Shuning uchun ΔT ikki barobar ortganda, s ham ikki barobar ortadi."
    }
  ],

  // =========================================================================
  // 3-MAVZU: Termoelektr o'lchash usullari va termoparalar
  // =========================================================================
  3: [
    {
      question: "Termoparaning erkin (sovuq) uchlari harorati nima uchun qat'iy nazorat qilinishi yoki kompensatsiya qilinishi shart?",
      options: [
        "Chunki termoEYuK faqat ishchi va erkin uchlar haroratlar FARQIGA bog'liq, erkin uch harorati o'zgarsa o'lchashda xatolik yuzaga keladi",
        "Simlar qizib ketmasligi uchun",
        "Millivoltmetrning ichki qarshiligi oshib ketmasligi uchun",
        "Elektr toki uzilib qolmasligi uchun"
      ],
      answer: 0,
      explanation: "E = e·(T1 - T0) bo'lib, agar T0 (masalan xona harorati) o'zgarsa, pech harorati T1 o'zgarmagan taqdirda ham termoEYuK o'zgarib ketadi."
    },
    {
      question: "Laboratoriya va etalon o'lchashlarda termopara erkin uchlari haroratini 0 °C da barqaror ushlab turish uchun nima qo'llaniladi?",
      options: [
        "Eriyotgan toza muzli Dyuar idishi (termos)",
        "Oddiy xona ventilyatori",
        "Elektr isitgich",
        "Moyli radiator"
      ],
      answer: 0,
      explanation: "Suv va muzning normal bosimdagi muvozanat holati aniq 0.00 °C ni ta'minlaydi. Erkin uchlar germetik probirkada eriyotgan muzli Dyuar idishiga solinadi."
    },
    {
      question: "Termoparaning erkin uchlari harorati T0 bo'lganda, 0 °C ga keltirilgan to'liq EYuK qaysi formula bilan topiladi?",
      options: [
        "E(T, 0) = E(T, T0) + E(T0, 0)",
        "E(T, 0) = E(T, T0) - E(T0, 0)",
        "E(T, 0) = E(T, T0) · E(T0, 0)",
        "E(T, 0) = E(T, T0) / E(T0, 0)"
      ],
      answer: 0,
      explanation: "Termodinamik oraliq haroratlar qoidasiga ko'ra, o'lchangan EYuK ga erkin uch harorati T0 ga mos keluvchi E(T0, 0) tuzatmasi qo'shiladi."
    },
    {
      question: "Kompensatsion (termoelektrodli cho'zuvchi) simlarning asosiy vazifasi nima?",
      options: [
        "Termoparaning erkin uchlarini qizigan texnologik zonadan harorati doimiy yoki nazorat qilinadigan xonaga/asbobga ko'chirish",
        "Termopara signalini 10 barobarga kuchaytirish",
        "O'zgaruvchan tokni o'zgarmas tokka aylantirish",
        "Simlarni elektr xalal berishlardan ekranlash"
      ],
      answer: 0,
      explanation: "Termopara materiallari qimmat bo'lgani sababli, datchik kallasidan ikkilamchi asbobgacha bo'lgan masofada arzonroq, lekin xuddi shu termoelektrik xossaga ega simlar qo'llaniladi."
    },
    {
      question: "Agar TXA (K-tur) termoparasiga kompensatsion simlar qutblari teskari (plyus o'rniga minus) ulab qo'yilsa nima yuz beradi?",
      options: [
        "Erkin uchlar harorati kompensatsiya qilinmaydi, aksincha xatolik ikki barobar ortadi",
        "Hech qanday o'zgarish bo'lmaydi",
        "Asbob avtomatik to'g'rilab oladi",
        "Pech sovub qoladi"
      ],
      answer: 0,
      explanation: "Noto'g'ri ulanganda kompensatsion simlar hosil qilgan EYuK asosiy EYuK ga qo'shilish o'rniga undan ayirilib, harorat oshganda asbob pastroq ko'rsatib, 2 barobar xato keltirib chiqaradi."
    },
    {
      question: "Termoelektr o'lchash zanjirida termoEYuK ni o'lchash uchun nima sababdan yuqori kirish qarshilikli millivoltmetr yoki potensiometr zarur?",
      options: [
        "Zanjirdan tok o'tishini minimallashtirish va ulovchi simlarning qarshiligi o'lchash natijasiga ta'sir qilmasligi uchun",
        "Asbob ko'p elektr energiyasi iste'mol qilishi uchun",
        "Termopara simlarini qizdirish uchun",
        "Kuchli magnit maydon yaratish uchun"
      ],
      answer: 0,
      explanation: "Agar asbob qarshiligi past bo'lsa, zanjirdan tok o'tadi va simlarning ichki qarshiligida kuchlanish tushishi yuz berib, asbob noto'g'ri (pastroq) ko'rsatadi."
    },
    {
      question: "Xromel-Alyumel (TXA) termoparasining davlat standarti bo'yicha xalqaro shartli belgisi qaysi?",
      options: [
        "K turi",
        "S turi",
        "J turi",
        "B turi"
      ],
      answer: 0,
      explanation: "ГОСТ 8.585-2001 va IEC 584 bo'yicha TXA termoparasi xalqaro 'K' harfi bilan belgilanadi."
    },
    {
      question: "Platina-Platinarodiy (TPP) termoparasining xalqaro belgisi qaysi va u qaysi haroratlarda ishlatiladi?",
      options: [
        "S turi, 1300...1600 °C gacha bo'lgan yuqori aniqlikdagi haroratlarda",
        "K turi, -50 °C gacha",
        "T turi, faqat xona haroratida",
        "E turi, faqat muzlatgichlarda"
      ],
      answer: 0,
      explanation: "TPP (Platina-Platinarodiy 10%) 'S' turiga kiradi va metallurgiya, shisha eritish pechlarida 1300...1600 °C gacha yuqori aniqlikda ishlatiladi."
    },
    {
      question: "Sanoat ikkilamchi asboblarida (masalan TRM yoki mikrokontrollerlar) erkin uchlar harorati qanday kompensatsiya qilinadi?",
      options: [
        "Klemma paneli yoniga o'rnatilgan yarimo'tkazgichli datchik (Pt100 yoki NTC) orqali klemma harorati o'lchanib, dasturiy tuzatish kiritiladi",
        "Asbob ichiga muz solinadi",
        "Asbob har doim 0 °C gacha sovitiladi",
        "Asbob qo'lda har 5 minutda buraladi"
      ],
      answer: 0,
      explanation: "Zamonaviy raqamli asboblarda sovuq ulanish klemmasi harorati datchik bilan o'lchanadi va mikroprotsessor standart jadval (NSX) bo'yicha E(T0, 0) ni avtomatik hisoblab qo'shadi."
    },
    {
      question: "Termoparaning keltirilgan nisbiy xatoligi (γ) qaysi formula bilan hisoblanadi?",
      options: [
        "γ = (|ΔT_max| / T_shkala) · 100%",
        "γ = (T_haqiqiy / T_olchangan) · 100%",
        "γ = ΔT_max · T_shkala",
        "γ = T_shkala / ΔT_max"
      ],
      answer: 0,
      explanation: "Keltirilgan xatolik - bu butun o'lchash diapazoni bo'ylab eng katta mutlaq xatolikning (|ΔT_max|) asbob shkalasi kengligiga nisbatan foizdagi ifodasidir."
    },
    {
      question: "Termopara nominal statik xarakteristikalari (NSX) jadvallarida termoEYuK qaysi sovuq ulanish harorati uchun tuzilgan?",
      options: [
        "T0 = 0 °C uchun",
        "T0 = 20 °C uchun",
        "T0 = 100 °C uchun",
        "T0 = -50 °C uchun"
      ],
      answer: 0,
      explanation: "Barcha xalqaro va davlat standartlaridagi graduirovka jadvallari (ГОСТ 8.585-2001) qat'iy ravishda erkin uch harorati T0 = 0 °C bo'lgan holat uchun hisoblangan."
    },
    {
      question: "Termoparaning ishchi uchi qanday usulda tayyorlanadi?",
      options: [
        "Elektr yoyi yoki plazma alangasida bir-biriga eritib payvandlanadi",
        "Oddiy sim bilan bog'lab qo'yiladi",
        "Superelim bilan yopishtiriladi",
        "Qalay bilan kavsharlanadi (payka)"
      ],
      answer: 0,
      explanation: "Yuqori haroratda erib ketmasligi va mustahkam diffuziya hosil bo'lishi uchun termopara uchlari himoyalangan muhitda maxsus payvandlanadi."
    },
    {
      question: "TXA termoparasi uchun o'rtacha sezgirlik koeffitsienti qanchaga teng?",
      options: [
        "Taxminan 40 - 41 mkV/°C",
        "Taxminan 10 mV/°C",
        "Taxminan 1 mkV/°C",
        "Taxminan 500 mkV/°C"
      ],
      answer: 0,
      explanation: "TXA (K-turi) ning differensial termoEYuK koeffitsienti 0 dan 1000 °C gacha bo'lgan oraliqda deyarli o'zgarmas bo'lib, o'rtacha 41 mkV/°C ni tashkil etadi."
    },
    {
      question: "Agar termopara ko'rsatishi E = 8.52 mV bo'lsa va bu oraliqda o'rtacha sezgirlik e = 0.041 mV/°C bo'lsa (T0 = 0 °C), pech harorati taxminan qancha?",
      options: [
        "208 °C",
        "50 °C",
        "1000 °C",
        "15 °C"
      ],
      answer: 0,
      explanation: "T = E / e = 8.52 / 0.041 ≈ 207.8 °C (taxminan 208 °C)."
    },
    {
      question: "Termoparaning himoya gilzasi (termovell) qanday materiallardan tayyorlanadi?",
      options: [
        "Zanglamas po'lat (12X18H10T / SS316), korund, kvars yoki maxsus keramikadan",
        "Yog'ochdan",
        "Oddiy plastmassadan",
        "Yumshoq qo'rg'oshindan"
      ],
      answer: 0,
      explanation: "Sanoat pechlaridagi agressiv gazlar, oksidlanish va yuqori bosimga chidash uchun o'tga chidamli zanglamas po'latlar yoki korundli keramika qo'llaniladi."
    },
    {
      question: "Boshlang'ich mexanik kompensatsiya usulida millivoltmetr bilan nima qilinadi?",
      options: [
        "Asbob o'chirilgan holatda uning korrektor vinti orqali strelkasi '0' dan sovuq ulanish harorati T0 ga siljitib qo'yiladi",
        "Asbob oynasi sindiriladi",
        "Strelka 100 °C ga suriladi",
        "Asbob shkalasi teskari qo'yiladi"
      ],
      answer: 0,
      explanation: "Oddiy millivoltmetrlarda termopara ulanishidan oldin korrektor vinti yordamida strelka xona harorati (masalan 20 °C) ga to'g'rilab qo'yiladi."
    },
    {
      question: "Volfram-Reniy (VR) termoparalari qanday muhitda va qanday haroratlarda ishlatiladi?",
      options: [
        "Inert gazlar yoki vakuum muhitida, 2200...2500 °C gacha o'ta yuqori haroratlarda",
        "Suv ichida 100 °C da",
        "Kislorodli atmosferada 500 °C da",
        "Muzlatgichlarda"
      ],
      answer: 0,
      explanation: "Volfram yuqori haroratda ochiq havoda tez oksidlanadi, lekin vakuum yoki inert muhitda 2500 °C gacha chidab beruvchi eng o'tga chidamli termoparadir."
    },
    {
      question: "Termopara zanjirida parazit termoEYuK nima sababdan hosil bo'ladi?",
      options: [
        "Klemma qutisidagi turli metall kontaktlarining bir tekis qizimasligi natijasida",
        "Radioto'lqinlar tufayli",
        "Datchik simlari juda uzun bo'lgani uchun",
        "Yerning tortishish kuchi tufayli"
      ],
      answer: 0,
      explanation: "Agar klemmaning ikkita qisqichi turli haroratda bo'lsa, ularning o'zida ham kichik Zeyebek effekti vujudga keladi va u asosiy signalga xato bo'lib qo'shiladi."
    },
    {
      question: "Termoparaning galvanik ajratilmagan (korpusga tutashgan) uchi qanday xususiyatga ega?",
      options: [
        "Tezroq qiziydi (kichik inersiyali), lekin elektr xalaqitlariga (pomexalarga) sezgir bo'ladi",
        "Umuman ishlamaydi",
        "100 marta sekin qiziydi",
        "Faqat o'zgarmas tokda buziladi"
      ],
      answer: 0,
      explanation: "Uchi gilzaga payvandlangan datchiklar issiqlikni to'g'ridan-to'g'ri oladi va tezroq ishlaydi, biroq quvur korpusidagi adashgan toklardan xalaqit olishi mumkin."
    },
    {
      question: "Termopara yordamida harorat o'lchashning asosiy davlat standarti qaysi?",
      options: [
        "ГОСТ 8.585-2001",
        "ГОСТ 2405-88",
        "ГОСТ 12.1.005",
        "ГОСТ 19808-86"
      ],
      answer: 0,
      explanation: "ГОСТ 8.585-2001 davlatlararo standarti barcha termoparalarning nominal statik xarakteristikalari va bardoshlik sinflarini belgilaydi."
    }
  ],

  // =========================================================================
  // 4-MAVZU: Qarshilik termometrlari va ulanish sxemalari
  // =========================================================================
  4: [
    {
      question: "Qarshilik termometrlarining (TS) ishlash printsipi qaysi fizik qonuniyatga asoslangan?",
      options: [
        "O'tkazgich va yarimo'tkazgichlar elektr qarshiligining haroratga bog'liq ravishda o'zgarishiga",
        "Zeyebek effektiga",
        "Optik nurlanishning to'lqin uzunligiga",
        "Arximed qonuniga"
      ],
      answer: 0,
      explanation: "Qarshilik termometrlari metallarning harorat ko'tarilishi bilan kristallar panjarasidagi tebranishlar ortib, elektr qarshiligi o'zgarishi hodisasiga asoslangan."
    },
    {
      question: "Sof metallarning (platina, mis, nikel) harorat koeffitsienti qarshiligi (TKQ, α) qanday ishoraga ega?",
      options: [
        "Musbat (harorat oshishi bilan qarshilik ortadi)",
        "Manfiy (harorat oshishi bilan qarshilik kamayadi)",
        "Har doim nolga teng",
        "Haroratga qarab ishorasi o'zgarib turadi"
      ],
      answer: 0,
      explanation: "Barcha sof metallarda musbat TKQ mavjud: harorat ko'tarilganda erkin elektronlarning atomlar bilan to'qnashuvi kuchayadi va qarshilik ortadi."
    },
    {
      question: "Pt100 datchigi 0 °C haroratda qancha nominal elektr qarshiligiga ega?",
      options: [
        "100 Om",
        "0 Om",
        "50 Om",
        "1000 Om"
      ],
      answer: 0,
      explanation: "Nomlanishidagi 'Pt' - platina, '100' esa uning 0 °C dagi nominal qarshiligi R0 = 100 Om ekanligini bildiradi."
    },
    {
      question: "Cu50 (TSM-50) datchigi 0 °C haroratda qancha qarshilikka ega?",
      options: [
        "50 Om",
        "100 Om",
        "500 Om",
        "0 Om"
      ],
      answer: 0,
      explanation: "Cu50 datchigi misdan tayyorlangan bo'lib, 0 °C dagi qarshiligi R0 = 50 Om ga teng."
    },
    {
      question: "Platina qarshilik termometrlari (Pt100) ning 0 °C dan yuqori haroratlar uchun statik xarakteristikasi qaysi tenglama bilan ifodalanadi?",
      options: [
        "Kallendar-Van Dyuzen tenglamasi: R(t) = R0·(1 + A·t + B·t^2)",
        "Eynshteyn formulasi: E = mc^2",
        "Zeyebek tenglamasi: E = e·ΔT",
        "Bernulli tenglamasi"
      ],
      answer: 0,
      explanation: "Platina termometrlari uchun 0...850 °C oralig'ida Kallendar-Van Dyuzen tenglamasi (A va B doimiylari bilan) xalqaro standart hisoblanadi."
    },
    {
      question: "Mis qarshilik termometrlarining (TSM) statik xarakteristikasi qanday ko'rinishga ega?",
      options: [
        "R(t) = R0·(1 + α·t) - deyarli qat'iy chiziqli",
        "R(t) = R0 · e^(t)",
        "R(t) = R0 / (1 + t^2)",
        "Logarifmik bog'lanish"
      ],
      answer: 0,
      explanation: "Misning haroratga bog'liqligi juda keng diapazonda (-50...+180 °C) ajoyib chiziqlilikka ega: R(t) = R0·(1 + α·t), bu yerda α ≈ 0.00428 °C^-1."
    },
    {
      question: "Uiston (Wheatstone) ko'prigi muvozanat holatida noma'lum qarshilik Rx qaysi shart bo'yicha topiladi?",
      options: [
        "Rx = (R2 · R3) / R1",
        "Rx = R1 + R2 + R3",
        "Rx = R1 · R2 · R3",
        "Rx = (R1 + R2) / R3"
      ],
      answer: 0,
      explanation: "Ko'prik muvozanatida qarama-qarshi yelkalar ko'paytmasi teng bo'ladi: Rx · R1 = R2 · R3, bundan Rx = (R2 · R3) / R1 kelib chiqadi."
    },
    {
      question: "Uzoq masofadagi termoqarshiliklarni ulashda 2 simli sxemaning asosiy kamchiligi nima?",
      options: [
        "Ulovchi simlarning qarshiligi (2·Rl) datchik qarshiligiga bevosita qo'shilib, sezilarli musbat xatolik beradi",
        "Simlar yonib ketadi",
        "Kuchlanish 10 barobarga tushadi",
        "Faqat manfiy haroratlarda ishlaydi"
      ],
      answer: 0,
      explanation: "2 simli sxemada asbob kabel qarshiligini ham datchik qarshiligi deb qabul qiladi, ayniqsa kabel uzun bo'lsa harorat 5...10 °C yuqori ko'rsatiladi."
    },
    {
      question: "3 simli ulanish sxemasi qanday qilib simlar qarshiligining harorat ta'sirini kompensatsiya qiladi?",
      options: [
        "Simlarning qarshiligini ko'prikning ikki qo'shni yelkasiga taqsimlab, ularning o'zaro ta'sirini tenglashtiradi",
        "Simlarning qarshiligini sovutish orqali",
        "Uchinchi sim orqali yuqori kuchlanish berib",
        "Simlarni bir-biriga chalishtirib"
      ],
      answer: 0,
      explanation: "3 simli sxemada bitta sim datchik yelkasiga, ikkinchisi namunaviy qarshilik yelkasiga ulanadi va harorat o'zgarganda simlar qarshiligi bir xil oshib, bir-birini kompensatsiya qiladi."
    },
    {
      question: "Eng yuqori aniqlikni talab qiluvchi laboratoriya va etalon o'lchashlarda qaysi ulanish sxemasi qo'llaniladi?",
      options: [
        "4 simli potensiometrik sxema",
        "1 simli sxema",
        "Oddiy 2 simli sxema",
        "Simsiz radioaloqa"
      ],
      answer: 0,
      explanation: "4 simli sxemada ikkita simdan tok o'tadi, qolgan ikkita sim orqali esa cheksiz katta qarshilikli voltmetr bilan datchik qisqichlaridagi kuchlanish tushishi o'lchanadi va sim qarshiligi 100% istisno qilinadi."
    },
    {
      question: "Termoqarshilik orqali o'lchov toki nima uchun odatda 1 - 2 mA dan oshirilmaydi?",
      options: [
        "Datchikning o'z-o'zidan qizishi (Joul issiqligi I^2·R) hisobiga xatolik kelib chiqishining oldini olish uchun",
        "Elektr tarmog'ini tejash uchun",
        "Datchik magnitlanib qolmasligi uchun",
        "Simlar uzilib ketmasligi uchun"
      ],
      answer: 0,
      explanation: "Katta tok o'tsa, datchik atrof-muhit haroratini emas, balki tok qizdirgan o'zining haroratini o'lchay boshlaydi."
    },
    {
      question: "Platina qarshilik termometrlari qaysi harorat oralig'ida qo'llaniladi?",
      options: [
        "-200 °C dan +850 °C gacha",
        "0 °C dan 3000 °C gacha",
        "+500 °C dan +1500 °C gacha",
        "Faqat 0 °C dan +100 °C gacha"
      ],
      answer: 0,
      explanation: "Platina kimyoviy jihatdan juda barqaror bo'lib, -200 °C dan +850 °C gacha bo'lgan keng oraliqda etalon aniqlikni ta'minlaydi."
    },
    {
      question: "Mis qarshilik termometrlari (TSM) qaysi harorat oralig'ida ishlatiladi?",
      options: [
        "-50 °C dan +180 °C gacha",
        "-200 °C dan +1000 °C gacha",
        "+500 °C dan +800 °C gacha",
        "Faqat 100 °C dan yuqori"
      ],
      answer: 0,
      explanation: "Mis arzon va chiziqli, biroq 180...200 °C dan yuqorida havodagi kislorod ta'sirida tez oksidlanib xossasini yo'qotadi."
    },
    {
      question: "Qarshilik termometrlari bo'yicha qaysi davlat standarti amal qiladi?",
      options: [
        "ГОСТ 6651-2009",
        "ГОСТ 2405-88",
        "ГОСТ 8.585-2001",
        "ГОСТ 10928-90"
      ],
      answer: 0,
      explanation: "ГОСТ 6651-2009 'Qarshilik termometrlari' datchiklarning barcha nominal statik xarakteristikalari va aniqlik sinflarini (A, B, C) belgilaydi."
    },
    {
      question: "Pt1000 datchigi 0 °C da qancha qarshilikka ega?",
      options: [
        "1000 Om (1 kOm)",
        "100 Om",
        "10 Om",
        "500 Om"
      ],
      answer: 0,
      explanation: "Pt1000 datchigi 0 °C da 1000 Om qarshilikka ega bo'lib, uning sezgirligi Pt100 ga nisbatan 10 barobar yuqori bo'ladi va 2 simli ulanishda kabel ta'sirini kamaytiradi."
    },
    {
      question: "Termoqarshilik zanjirida datchik simi uzilib qolsa (obryv), o'lchash asbobi nimani qayd etadi?",
      options: [
        "Qarshilik cheksiz katta (R = ∞) bo'lib, asbob shkalaning maksimal yuqori haroratidan oshib ketadi",
        "Harorat 0 °C ko'rsatadi",
        "Asbob o'chib qoladi",
        "Hech qanday o'zgarish bo'lmaydi"
      ],
      answer: 0,
      explanation: "Zanjir uzilganda qarshilik cheksiz bo'ladi. Asbob buni o'ta yuqori harorat deb qabul qiladi va zudlik bilan avariya signalini beradi."
    },
    {
      question: "Termoqarshilik klemmalari qisqa tutashib qolsa (R = 0 Om), ikkilamchi asbob nimani ko'rsatadi?",
      options: [
        "Shkalaning eng quyi chegarasidagi o'ta sovuq (manfiy) haroratni",
        "Maksimal 850 °C haroratni",
        "100 °C haroratni",
        "Asbob portlab ketadi"
      ],
      answer: 0,
      explanation: "0 Om qarshilik Pt100 uchun -200 °C dan ham past haroratga to'g'ri keladi, shuning uchun asbob datchik qisqa tutashganini ko'rsatadi."
    },
    {
      question: "Qarshilik termometrlarining termoparalarga nisbatan asosiy ustunligi nima?",
      options: [
        "Yuqori aniqlik, barqarorlik va sovuq ulanishni kompensatsiya qilishga ehtiyoj yo'qligi",
        "3000 °C gacha ishlashi",
        "Mutlaqo tekinligi",
        "Faqat optik to'lqinda ishlashi"
      ],
      answer: 0,
      explanation: "Termoqarshiliklar -200 dan +600 °C gacha oraliqda termoparalarga qaraganda ancha aniq (0.1 °C gacha) ishlaydi va ularga erkin uch harorati ta'sir qilmaydi."
    },
    {
      question: "Yarimo'tkazgichli termistorlarning (NTC) asosiy kamchiligi nima?",
      options: [
        "Xarakteristikasining keskin nochiziqliligi (eksponentsial) va tor harorat diapazoni",
        "Juda qimmatligi",
        "Sezgirligining juda pastligi",
        "Elektr tokini o'tkazmasligi"
      ],
      answer: 0,
      explanation: "NTC termistorlar juda sezgir bo'lsa-da, ularning qarshiligi haroratga nochiziqli bog'liq bo'lib, tor oraliqda ishlatiladi."
    },
    {
      question: "Agar Pt100 datchigi harorat ko'tarilganda qarshiligi R = 138.5 Om ga yetgan bo'lsa, o'lchanayotgan harorat taxminan qancha?",
      options: [
        "100 °C",
        "50 °C",
        "0 °C",
        "200 °C"
      ],
      answer: 0,
      explanation: "Pt100 uchun 0 °C da R = 100 Om, 100 °C da esa R = 138.5 Om bo'ladi (W100 = 1.3850 standart nisbat)."
    }
  ],

  // =========================================================================
  // 5-MAVZU: Optik va nurlanish pirometrlari
  // =========================================================================
  5: [
    {
      question: "Pirometrik usulda haroratni o'lchashning asosiy o'ziga xosligi nima?",
      options: [
        "O'lchanayotgan jism bilan to'g'ridan-to'g'ri mexanik kontaktsiz, uning issiqlik nurlanishi bo'yicha masofadan o'lchash",
        "Jism ichiga datchikni chuqur kiritish",
        "Jismni maxsus bo'yoq bilan bo'yash",
        "Faqat suvli muhitda o'lchash"
      ],
      answer: 0,
      explanation: "Pirometrlar qizigan jism chiqarayotgan elektromagnit to'lqinlarni optik tizim orqali qabul qilib, jismga tegmasdan (kontaktsiz) masofadan haroratni aniqlaydi."
    },
    {
      question: "Stefan-Bolsman qonuniga ko'ra mutlaq qora jismning to'liq nurlanish quvvati (E) uning mutlaq harorati (T) ga qanday bog'liq?",
      options: [
        "Haroratning to'rtinchi darajasiga proporsional: E = σ · T^4",
        "Haroratning birinchi darajasiga proporsional: E = k · T",
        "Haroratning kvadratiga proporsional: E = σ · T^2",
        "Haroratga teskari proporsional"
      ],
      answer: 0,
      explanation: "Stefan-Bolsman qonuniga ko'ra nurlanish intensivligi mutlaq haroratning 4-darajasiga to'g'ri proporsionaldir: E = σ·T^4, bu yerda σ - Stefan-Bolsman doimiysi."
    },
    {
      question: "Vin (Wien) ning siljish qonuni nimani ifodalaydi?",
      options: [
        "Harorat ortishi bilan maksimal nurlanish to'lqin uzunligi qisqa to'lqinlar tomon siljiydi (λ_max · T = b)",
        "Harorat ortishi bilan jism qorayib boradi",
        "Jism harorati uning og'irligiga bog'liq",
        "Nurlanish faqat qizil rangda bo'ladi"
      ],
      answer: 0,
      explanation: "Jism qanchalik qizisa, uning nurlanish spektri shunchalik qisqa to'lqinlar (ko'rinadigan yorug'lik va ultrabinafsha) tomon siljiydi: λ_max·T = b."
    },
    {
      question: "Yo'qoluvchi tolali optik pirometr (masalan Promin yoki OPIR) qanday printsipda ishlaydi?",
      options: [
        "Ichki etalon cho'g'lanma tolaning yorqinligi o'lchanayotgan jismning yorqinligi bilan tenglashtiriladi",
        "Termopara yordamida nurlanish tutiladi",
        "Tola erib ketguncha tok beriladi",
        "Jismning rangi fotosuratga olinadi"
      ],
      answer: 0,
      explanation: "Operator okulyar orqali qarab, reostat yordamida toladan o'tadigan tokni o'zgartiradi va tolaning yorqinligi qizigan jism fonida ko'rinmay (yo'qolib) qolgan paytda haroratni sanaydi."
    },
    {
      question: "Agar optik pirometr okulyarida etalon tola qizigan jism fonida qora ip bo'lib ko'rinsa, bu nimani bildiradi?",
      options: [
        "Tolaning harorati jism haroratidan past (tola yetarlicha qizimagan)",
        "Tolaning harorati jism haroratidan ancha yuqori",
        "Pirometr buzilgan",
        "Jismning harorati 0 °C ga teng"
      ],
      answer: 0,
      explanation: "Agar tola jismdan kamroq yorug'lik chiqarayotgan bo'lsa, u yorqin fon qarshisida qorong'i (qora) chiziq sifatida ko'rinadi."
    },
    {
      question: "Agar optik pirometr okulyarida etalon tola jism fonida yorqin yaltiroq ip bo'lib ko'rinsa, bu nimani bildiradi?",
      options: [
        "Tolaning harorati o'lchanayotgan jism haroratidan yuqori",
        "Tola sovuq ekanligini",
        "Jism to'liq eriganini",
        "Tola uzilib ketganini"
      ],
      answer: 0,
      explanation: "Agar tola jismdan ko'ra kuchliroq qizdirilgan bo'lsa, uning yorqinligi fonga qaraganda baland bo'lib, oq/yorqin chiziq hosil qiladi."
    },
    {
      question: "Yo'qoluvchi tolali pirometrlarda inson ko'zini charchatmaslik va o'lchash to'lqin uzunligini aniq chegaralash uchun qanday yorug'lik filtri o'rnatiladi?",
      options: [
        "Qizil yorug'lik yorug'lik filtri (λ ≈ 0.65 mkm)",
        "Ko'k yorug'lik filtri",
        "Yashil filtr",
        "Rentgen filtri"
      ],
      answer: 0,
      explanation: "Monoxromatik qizil filtr (to'lqin uzunligi λ = 0.65 mkm) inson ko'zi spektral sezgirligi bilan birgalikda yorqinlikni aniq taqqoslash imkonini beradi."
    },
    {
      question: "Mutlaq qora jism uchun nurlanish qobiliyati koeffitsienti (ε) nechaga teng?",
      options: [
        "ε = 1.0",
        "ε = 0",
        "ε = 0.5",
        "ε = 100"
      ],
      answer: 0,
      explanation: "Mutlaq qora jism o'ziga tushayotgan barcha elektromagnit to'lqinlarni to'liq yutadi va maksimal darajada nurlatadi, shuning uchun ε = 1.0."
    },
    {
      question: "Haqiqiy texnologik materiallar (kulrang jismlar) uchun nurlanish koeffitsienti ε qanday oraliqda bo'ladi?",
      options: [
        "0 < ε < 1.0",
        "ε > 10",
        "ε < 0",
        "Har doim aniq 1 ga teng"
      ],
      answer: 0,
      explanation: "Haqiqiy jismlarning sirti nurlanishning bir qismini qaytaradi, shuning uchun ularning nurlanish koeffitsienti 0 dan 1 gacha bo'ladi (masalan po'lat uchun 0.8, silliqlangan alyuminiy uchun 0.1)."
    },
    {
      question: "Agar yorqinlik pirometri bilan nurlanish koeffitsienti ε < 1 bo'lgan jism o'lchansa, asbob ko'rsatgan yorqinlik harorati (T_yor) haqiqiy harorat (T_haq) ga nisbatan qanday bo'ladi?",
      options: [
        "Yorqinlik harorati haqiqiy haroratdan har doim past bo'ladi (T_yor < T_haq)",
        "Yorqinlik harorati haqiqiy haroratdan yuqori bo'ladi",
        "Ikkalasi mutlaqo teng bo'ladi",
        "Faqat manfiy harorat ko'rsatadi"
      ],
      answer: 0,
      explanation: "Kulrang jism mutlaq qora jismga qaraganda kamroq yorug'lik sochadi, shuning uchun asbob uni sovuqroq deb qabul qiladi. Haqiqiy haroratni topish uchun ε bo'yicha tuzatma kiritiladi."
    },
    {
      question: "Rangli (spektral nisbat) pirometrlarning asosiy ustunligi nimada?",
      options: [
        "Ikki xil to'lqin uzunligidagi nurlanishlar nisbatini o'lchagani sababli, chang, tutun va darchalarning kirlanishi o'lchashga ta'sir qilmaydi",
        "Narxi oddiy termometrdan 100 marta arzonligi",
        "Suv tagida ishlashi",
        "Faqat 0 °C da ishlashi"
      ],
      answer: 0,
      explanation: "Chang va tutun nurlanish intensivligini kamaytirsa-da, ikki to'lqin uzunligi nisbati o'zgarmay qoladi, shuning uchun metallurgiyada rangli pirometrlar eng ishonchlidir."
    },
    {
      question: "Infraqizil (IQ) pirometrlar atmosferaning qaysi shaffoflik darchasida eng ko'p qo'llaniladi?",
      options: [
        "8 - 14 mkm to'lqin uzunliklari sohasida",
        "0.1 - 0.2 mkm ultrabinafsha sohasida",
        "100 - 500 metr to'lqin sohasida",
        "Rentgen nurlari sohasida"
      ],
      answer: 0,
      explanation: "Atmosferadagi suv bug'lari va CO2 gazlari 8 dan 14 mkm gacha bo'lgan infraqizil nurlarni deyarli yutmaydi, bu esa masofadan aniq o'lchash imkonini beradi."
    },
    {
      question: "Pirometrning optik ruxsati (D:S - masofa va dog' diametri nisbati) nimani bildiradi?",
      options: [
        "Asbobdan ob'ektgacha bo'lgan masofaning (D) o'lchanayotgan sirt dog'i diametriga (S) nisbatini",
        "Pirometr batareyasining quvvatini",
        "Linzaning qalinligini",
        "Ekranning yorqinligini"
      ],
      answer: 0,
      explanation: "Masalan, D:S = 12:1 bo'lsa, 1.2 metr masofada datchik 10 sm diametrdagi maydonning o'rtacha haroratini o'lchaydi."
    },
    {
      question: "Agar pirometrning D:S ko'rsatkichi 10:1 bo'lsa va masofa 2 metr bo'lsa, o'lchash nuqtasining (dog'ining) diametri qancha bo'ladi?",
      options: [
        "0.2 metr (20 sm)",
        "2 metr",
        "0.01 metr",
        "5 metr"
      ],
      answer: 0,
      explanation: "S = D / 10 = 2 m / 10 = 0.2 m (20 sm)."
    },
    {
      question: "Pirometr bilan o'lchashda o'lchanayotgan ob'ekt nima uchun optik dog'ni to'liq qoplashi shart?",
      options: [
        "Aks holda fondagi sovuq yoki issiq narsalarning nurlanishi dog'ga tushib, xatolik keltirib chiqaradi",
        "Pirometr lazeri buzilib qolmasligi uchun",
        "Ob'ekt yonib ketmasligi uchun",
        "Asbob avtomatik o'chib qolmasligi uchun"
      ],
      answer: 0,
      explanation: "Agar ob'ekt dog'dan kichik bo'lsa, datchik ob'ekt bilan birga uning orqasidagi devor yoki havo haroratini ham o'lchab qo'yadi."
    },
    {
      question: "Pirometrlarning eng muhim amaliy afzalligi qaysi javobda to'g'ri ko'rsatilgan?",
      options: [
        "Harakatlanuvchi detallarni (masalan prokat stanidagi relslarni) va o'ta yuqori haroratli suyuq metallarni xavfsiz masofadan o'lchay olishi",
        "Ularni cho'ntakka solib yurish mumkinligi",
        "Faqat suv haroratini o'lchashi",
        "Hech qanday optikasi yo'qligi"
      ],
      answer: 0,
      explanation: "Suyuq po'latga datchik tiqilsa u bir zumda erib ketadi; harakatlanayotgan metall tasmasiga kontakt datchik tekkizib bo'lmaydi. Pirometrlar bu muammoni to'liq hal qiladi."
    },
    {
      question: "Metallurgiya pechlarida mutlaq qora jism modelini hosil qilish uchun qanday usul qo'llaniladi?",
      options: [
        "Pech ichiga uchi berk o'tga chidamli quvur (gilza) kiritilib, pirometr shu quvurning tubiga qaratiladi",
        "Pech oynasi qora bo'yoq bilan bo'yaladi",
        "Pech ichiga ko'mir tashlanadi",
        "Pech chirog'i o'chiriladi"
      ],
      answer: 0,
      explanation: "Ichki yopiq bo'shliqning kichik teshigidan chiqayotgan nurlanish ko'p marta qaytishi natijasida ε = 1.0 ga teng mutlaq qora jism xossasiga ega bo'ladi."
    },
    {
      question: "Pirometrlardagi lazer ko'rsatgichning (lazer pointer) asosiy vazifasi nima?",
      options: [
        "O'lchanayotgan sirt markazini ko'zlash (nishonga olish) uchun",
        "Haroratni lazer yordamida o'lchash",
        "Jismni qizdirish",
        "Optik linzani tozalash"
      ],
      answer: 0,
      explanation: "Lazer nuri haroratni o'lchamaydi, u faqat operatorga datchik aynan qaysi nuqtaga qaratilganini vizual ko'rsatib turish uchun xizmat qiladi."
    },
    {
      question: "Plank qonuni nimani ifodalaydi?",
      options: [
        "Mutlaq qora jismning turli to'lqin uzunliklaridagi spektral nurlanish zichligining haroratga bog'liqligini",
        "Bosim va zichlik bog'liqligini",
        "Oqim tezligini",
        "Issiqlik sig'imini"
      ],
      answer: 0,
      explanation: "Max Planck 1900-yilda kvant nazariyasiga asoslanib, nurlanish spektrining harorat va to'lqin uzunligiga to'liq matematik taqsimot qonunini yaratgan."
    },
    {
      question: "Silliqlangan yaltiroq mis yoki alyuminiy sirtlarning haroratini IQ pirometr bilan o'lchashda nima uchun katta xatolik yuzaga keladi?",
      options: [
        "Ularning nurlanish koeffitsienti juda kichik (ε ≈ 0.05-0.1) bo'lib, o'z nurlanishidan ko'ra atrofdagi narsalarni ko'zgu kabi ko'proq qaytargani uchun",
        "Ular magnitlanganligi uchun",
        "Ular juda issiq bo'lgani uchun",
        "Ular optik nurni yutib yuborgani uchun"
      ],
      answer: 0,
      explanation: "Yaltiroq metallar o'zidan deyarli nur chiqarmaydi, balki ko'zgu kabi atrofdagi lampochka yoki operator tanasining nurlanishini qaytaradi."
    }
  ],

  // =========================================================================
  // 6-MAVZU: Deformatsion va yuk-porshenli manometrlar
  // =========================================================================
  6: [
    {
      question: "Mutlaq bosim (P_mutlaq), ortiqcha (manometrik) bosim (P_ort) va atmosfera bosimi (P_atm) orasidagi to'g'ri munosabat qaysi?",
      options: [
        "P_mutlaq = P_ort + P_atm",
        "P_mutlaq = P_ort - P_atm",
        "P_mutlaq = P_ort · P_atm",
        "P_mutlaq = P_atm - P_ort"
      ],
      answer: 0,
      explanation: "Mutlaq nol bosimdan boshlab o'lchanadigan to'liq bosim atmosfera bosimi va manometr ko'rsatgan ortiqcha bosimning yig'indisiga teng."
    },
    {
      question: "Vakuum (siyraklanish) bosimi qanday aniqlanadi?",
      options: [
        "P_vak = P_atm - P_mutlaq",
        "P_vak = P_mutlaq + P_atm",
        "P_vak = P_ort + P_mutlaq",
        "P_vak = P_ort / P_atm"
      ],
      answer: 0,
      explanation: "Vakuum - bu atmosfera bosimidan past bo'lgan sohadagi bosim yetishmovchiligidir: P_vak = P_atm - P_mutlaq."
    },
    {
      question: "Burdon naychasining (bir o'ramli prujina) ishlash asosi nimadan iborat?",
      options: [
        "Bosim berilganda ellips kesimli egilgan naychaning kesimi doiraga intilib, egrilik radiusi ortadi va erkin uchi to'g'rilanib siljiydi",
        "Bosim ostida naycha siqilib qisqaradi",
        "Naycha erib suyuqlikka aylanadi",
        "Naycha aylanma magnit maydon hosil qiladi"
      ],
      answer: 0,
      explanation: "Oval kesimli egilgan metall naycha ichiga bosim berilganda u to'g'rilanishga intiladi va uning germetik berk erkin uchi 2-5 mm ga siljiydi."
    },
    {
      question: "Burdon manometrida naycha uchining kichik chiziqli siljishini strelkaning 270° aylanma harakatiga qaysi mexanizm aylantirib beradi?",
      options: [
        "Tyaga, tishli sektor va tribka (tishli g'ildirakcha) mexanizmi",
        "Elektr dvigateli",
        "Gidravlik nasos",
        "Doimiy magnit"
      ],
      answer: 0,
      explanation: "Tyaga naycha uchini tishli sektorga uzatadi, sektor esa markaziy milga o'rnatilgan kichik tribkani aylantirib, strelkani siferblat bo'ylab buradi."
    },
    {
      question: "Manometrlarning orqa tomonida nima uchun sochiluvchi xavfsizlik tiqini (prokladka/klapan) mavjud?",
      options: [
        "Naycha yorilib ketgan taqdirda yuqori bosimli gaz yoki moy shisha oynani oldinga sindirmasdan orqaga xavfsiz chiqib ketishi uchun",
        "Manometr ichiga havo kiritish uchun",
        "Asbobni devorga mixlash uchun",
        "Moy quyish uchun"
      ],
      answer: 0,
      explanation: "Xavfsizlik talablariga ko'ra (ГОСТ 2405-88), naycha yorilganda portlash to'lqini xodim tomonga (old oynaga) emas, asbob orqasiga zararsiz yo'naltiriladi."
    },
    {
      question: "Texnologik quvurlarda manometr oldiga o'rnatiladigan halqasimon (sifonli) naychaning vazifasi nima?",
      options: [
        "Yuqori haroratli bug'ni sovutish (gidrozaslon hosil qilish) va bosim zarbalarini yumshatish",
        "Gaz oqimini tezlashtirish",
        "Asbob ko'rsatishini 2 barobar oshirish",
        "Quvurni tozalash"
      ],
      answer: 0,
      explanation: "Sifon naychasida bug' kondensatsiyalanib sovuq suv (gidroqulf) hosil qiladi, natijada 200 °C li qaynoq bug' manometrning sezgir naychasini qizdirmaydi."
    },
    {
      question: "Manometrning aniqlik sinfi 1.5, o'lchash diapazoni 0...10 bar bo'lsa, ruxsat etilgan maksimal mutlaq xatolik qancha?",
      options: [
        "±0.15 bar",
        "±1.5 bar",
        "±0.015 bar",
        "±0.5 bar"
      ],
      answer: 0,
      explanation: "Δ = ±(Klass · Diapazon) / 100 = ±(1.5 · 10) / 100 = ±0.15 bar."
    },
    {
      question: "Yuk-porshenli manometr (masalan MP-60) qanday asboblar toifasiga kiradi?",
      options: [
        "Sanoat manometrlarini tekshirish va kalibrovka qilish uchun namunaviy (etalon) gidravlik asbob",
        "Oddiy maishiy suv o'lchagich",
        "Elektr toki o'lchagich",
        "Faqat vakuum hosil qiluvchi nasos"
      ],
      answer: 0,
      explanation: "Yuk-porshenli manometrlar dunyo bo'ylab bosim o'lchashning eng yuqori aniqlikdagi gidravlik etaloni (0.02 - 0.05 sinf) hisoblanadi."
    },
    {
      question: "Yuk-porshenli manometrda etalon bosim qaysi formula bo'yicha hosil qilinadi?",
      options: [
        "P_et = (M_porshen + Σm_yuk) · g / F_eff",
        "P_et = F · L",
        "P_et = m · g · h",
        "P_et = V / t"
      ],
      answer: 0,
      explanation: "Porshen va yuklarning og'irlik kuchi porshenning effektiv yuzasiga taqsimlanishi orqali o'ta aniq etalon gidrostatik bosim vujudga keladi."
    },
    {
      question: "Yuk-porshenli manometrda o'lchash vaqtida porshen yuklari bilan birga nima sababdan qo'lda asta-sekin aylantirib turiladi?",
      options: [
        "Porshen va silindr orasidagi quruq ishqalanish kuchini bartaraf qilish va suyuqlikli moylanish rejimiga o'tish uchun",
        "Yuklar tushib ketmasligi uchun",
        "Moyni isitish uchun",
        "Havo pufakchalarini yo'qotish uchun"
      ],
      answer: 0,
      explanation: "Aylanish paytida porshen devorga yopishmaydi, toza gidrodinamik moy pardasi ustida erkin qalqib turadi va ishqalanish xatoligi nolga intiladi."
    },
    {
      question: "Manometr variatsiyasi (gisterezisi) deb nimaga aytiladi?",
      options: [
        "Bosimni oshirib (to'g'ri yurish) va bosimni kamaytirib (teskari yurish) tekshirilganda, bitta nuqtadagi ko'rsatishlar farqiga",
        "Strelkaning tebranishiga",
        "Manometr korpusi qizishiga",
        "Shkalaning egriligiga"
      ],
      answer: 0,
      explanation: "Metallarning elastik qaytish xususiyatidagi inersiya tufayli to'g'ri va teskari yurish ko'rsatishlari o'rtasida farq yuzaga keladi, bu gisterezis deyiladi."
    },
    {
      question: "ГОСТ 2405-88 bo'yicha manometr variatsiyasi qanday miqdordan oshmasligi shart?",
      options: [
        "Ruxsat etilgan asosiy xatolikning mutlaq qiymatidan (100% dan)",
        "Shkalaning yarmidan",
        "10 bar dan",
        "Cheklov yo'q"
      ],
      answer: 0,
      explanation: "Davlat standarti bo'yicha manometrning variatsiyasi uning ruxsat etilgan asosiy mutlaq xatoligidan oshmasligi shart (h ≤ |Δ|)."
    },
    {
      question: "Kichik bosimlar (10 - 40 kPa) va gaz bosimlarini o'lchashda qaysi turdagi deformatsion manometrlar qo'llaniladi?",
      options: [
        "Membranali va membrana qutili manometrlar (tyagomerlar, naporomerlar)",
        "Burdon naychali qalin manometrlar",
        "Porshenli gidravlik presslar",
        "Og'ir simobli manometrlar"
      ],
      answer: 0,
      explanation: "Membrana qutilari yupqa gofralangan metall disklardan yasalib, katta maydonga ega bo'lgani sababli hatto mikroskopik gaz bosimlarida ham sezilarli egiladi."
    },
    {
      question: "Manometr shkalasida tushirilgan qizil chiziq nimani bildiradi?",
      options: [
        "Ushbu asbob uchun ruxsat etilgan maksimal ishchi bosim chegarasini",
        "Asbob buzilganligini",
        "Suvning qaynash nuqtasini",
        "Nol nuqtasini"
      ],
      answer: 0,
      explanation: "Xavfsizlik texnikasi qoidalariga ko'ra, har bir sanoat manometri siferblatida ushbu uskunaning maksimal ruxsat etilgan ishchi bosimi qizil chiziq bilan belgilanadi."
    },
    {
      question: "Yuk-porshenli manometrda ishchi suyuqlik sifatida nima ishlatiladi?",
      options: [
        "Transformator moyi, kastor moyi yoki kerosin",
        "Oddiy vodoprovod suvi",
        "Benzin",
        "Spirt"
      ],
      answer: 0,
      explanation: "Ushbu moylar qovushqoqligi barqaror, korroziya keltirib chiqarmaydigan va porshen juftligini a'lo darajada moylab turuvchi vositalardir."
    },
    {
      question: "1 bar bosim necha Paskal (Pa) va necha Megapaskal (MPa) ga teng?",
      options: [
        "100 000 Pa (10^5 Pa) va 0.1 MPa",
        "1 000 Pa va 1 MPa",
        "10 Pa va 0.001 MPa",
        "1 000 000 Pa va 10 MPa"
      ],
      answer: 0,
      explanation: "1 bar = 100 000 Pa = 100 kPa = 0.1 MPa (taxminan 1 atmosfera bosimiga teng)."
    },
    {
      question: "Gidravlik manometrlarning ichki qismi tebranishli sharoitlarda nima sababdan glitserin bilan to'ldiriladi?",
      options: [
        "Kuchli mexanik tebranishlarda strelkaning titrashini so'ndirish (dempfirlash) va mexanizmni yeyilishdan himoya qilish uchun",
        "Asbob og'irroq bo'lishi uchun",
        "Muzlab qolishi uchun",
        "Raqamlarni kattalashtirib ko'rsatish uchun"
      ],
      answer: 0,
      explanation: "Glitserin qovushqoq suyuqlik bo'lib, nasoslar va kompressorlar yonidagi kuchli titrashlarni yutib, strelkaning silliq ko'rsatishini ta'minlaydi."
    },
    {
      question: "Agar manometr bosim yo'qligida ham nol nuqtasiga qaytmasa (nol xatosi bo'lsa), bunga nima sabab bo'lishi mumkin?",
      options: [
        "Naychada qoldiq plastik deformatsiya paydo bo'lganligi yoki mexanizm tishlari tiqilib qolganligi",
        "Havo juda toza ekanligi",
        "Atmosfera bosimi yo'qolganligi",
        "Quvurda suv borligi"
      ],
      answer: 0,
      explanation: "Maksimal bosimdan oshib ketganda naycha metalli elastiklik chegarasidan o'tib ketadi va qoldiq deformatsiya hisobiga strelka nolga qaytmay qoladi."
    },
    {
      question: "Elektr kontaktli manometrlar (EKM) qanday maqsadlarda qo'llaniladi?",
      options: [
        "Bosim belgilangan minimal yoki maksimal chegaraga yetganda nasoslarni avtomatik yoqish/o'chirish va signalizatsiya berish uchun",
        "Suvni isitish uchun",
        "Quvurlarni tozalash uchun",
        "Bosimni kamaytirish uchun"
      ],
      answer: 0,
      explanation: "EKM manometri siferblatida sozlanuvchi kontaktlar bo'lib, strelka o'sha belgilangan qiymatga borganda elektr zanjirini ulaydi yoki uzadi."
    },
    {
      question: "Silfonli sezgir element qanday tuzilishga ega?",
      options: [
        "Yupqa devorli gofralangan (garmonikasimon) metall naycha bo'lib, bosim ta'sirida bo'yiga cho'ziladi yoki qisqaradi",
        "Qalin po'lat shar",
        "Yog'och silindr",
        "Shisha trubka"
      ],
      answer: 0,
      explanation: "Silfon - elastik gofralangan trubka bo'lib, ko'p marotaba cho'zilib-qisqarish xususiyatiga ega va differensial bosimlarni o'lchashda keng qo'llaniladi."
    }
  ],

  // =========================================================================
  // 7-MAVZU: O'zgaruvchan bosimlar farqi bo'yicha sarf o'lchash
  // =========================================================================
  7: [
    {
      question: "Drossel qurilmalari (diafragma, soplo, Venturi) yordamida suyuqlik va gazlar sarfini o'lchash printsipi qaysi hodisaga asoslangan?",
      options: [
        "Quvur ichida oqim torayganda tezlik ortishi va statik bosim pasayishi natijasida bosimlar farqi (ΔP) hosil bo'lishiga",
        "Suyuqlikning kimyoviy tarkibi o'zgarishiga",
        "Quvurning harorati ko'tarilishiga",
        "Suyuqlikning magnitlanishiga"
      ],
      answer: 0,
      explanation: "Oqim tor kesimdan o'tayotganda kinetik energiya (tezlik) ortadi, energiya saqlanish qonuniga (Bernulli qonuni) binoan statik bosim pasayadi va ΔP paydo bo'ladi."
    },
    {
      question: "Drossel qurilmasidagi bosimlar farqi (ΔP) va hajm sarfi (Q) orasidagi matematik munosabat qanday ko'rinishga ega?",
      options: [
        "Sarf bosimlar farqining kvadrat ildiziga proporsional: Q ~ √ΔP",
        "Sarf bosimlar farqiga to'g'ri chiziqli proporsional: Q ~ ΔP",
        "Sarf bosimlar farqining kvadratiga proporsional: Q ~ ΔP^2",
        "Sarf bosimlar farqiga teskari proporsional: Q ~ 1/ΔP"
      ],
      answer: 0,
      explanation: "Gidrodinamika tenglamasiga ko'ra sarf ildiz ostidagi bosimlar farqiga proporsionaldir: Q = α · ε · A0 · √(2ΔP / ρ)."
    },
    {
      question: "Standart diafragma (ГОСТ 8.586.2-2005) qanday geometrik shaklga ega?",
      options: [
        "Quvur o'qiga konsentrik o'rnatilgan, o'tkir kirish qirrali doiraviy teshikka ega yupqa metall disk",
        "Uchburchak shakldagi panjara",
        "Uzun konus trubka",
        "Aylanuvchi parrak"
      ],
      answer: 0,
      explanation: "Standart diafragma kirish tomoni qat'iy o'tkir to'g'ri burchakli, chiqish tomoni esa konus qilib qiya yo'nilgan teshikli diskdir."
    },
    {
      question: "Drossellovchi sarf formulasidagi sarf koeffitsienti (α) nimani ifodalaydi?",
      options: [
        "Oqimning real sarfining ideal (ishqalanishsiz va siqilishsiz) nazariy sarfga nisbatini",
        "Quvurning uzunligini",
        "Suyuqlikning haroratini",
        "Atmosfera bosimini"
      ],
      answer: 0,
      explanation: "Haqiqiy suyuqlikda qovushqoqlik, gidravlik ishqalanish va oqimning eng tor kesimi (vena contracta) teshikdan kichik bo'lishi sababli α tuzatish koeffitsienti (odatda 0.6 - 0.8) kiritiladi."
    },
    {
      question: "Sarf formulasidagi kengayish (siqiluvchanlik) koeffitsienti ε tomchi suyuqliklar (suv, moy) uchun nechaga teng qabul qilinadi?",
      options: [
        "ε = 1.0 (chunki tomchi suyuqliklar amalda siqilmaydi)",
        "ε = 0",
        "ε = 0.5",
        "ε = 10"
      ],
      answer: 0,
      explanation: "Suv va moy kabi suyuqliklar bosim o'zgarganda zichligini o'zgartirmaydi (siqilmaydi), shuning uchun ular uchun kengayish koeffitsienti qat'iy ε = 1.0 bo'ladi."
    },
    {
      question: "Agar quvurdagi suyuqlik sarfi 2 barobar oshsa, diafragmadagi bosimlar farqi (ΔP) necha barobar ortadi?",
      options: [
        "4 barobar ortadi (ΔP ~ Q^2)",
        "2 barobar ortadi",
        "O'zgarmaydi",
        "16 barobar ortadi"
      ],
      answer: 0,
      explanation: "Q ~ √ΔP bo'lganligi sababli, ΔP ~ Q^2 bo'ladi. Demak, sarf 2 barobar oshsa, bosimlar farqi 2^2 = 4 barobar ortadi."
    },
    {
      question: "Venturi naychasining standart diafragmaga nisbatan asosiy texnik afzalligi nimada?",
      options: [
        "Silliq konussimon kirish va chiqish qismi tufayli oqim energiyasining qaytarilmas bosim yo'qotilishi (gidravlik qarshiligi) juda kichik",
        "O'rnatish juda oson va o'lchamlari juda ixcham",
        "Mutlaqo tekin tayyorlanadi",
        "Faqat gazlarda ishlaydi"
      ],
      answer: 0,
      explanation: "Diafragmada oqim keskin uzilib girdoblar hosil bo'ladi va bosimning 40-70% i qaytarilmas yo'qoladi; Venturi naychasida esa bosimning 80-90% i diffuzorda qayta tiklanadi."
    },
    {
      question: "Differensial bosimni o'lchovchi U-simon manometrda bosimlar farqi (ΔP) qaysi formula bilan hisoblanadi?",
      options: [
        "ΔP = (ρ_manometrik - ρ_muhit) · g · Δh",
        "ΔP = m · a",
        "ΔP = F · S",
        "ΔP = h / g"
      ],
      answer: 0,
      explanation: "U-naychadagi manometrik suyuqlik (simob) va o'lchanayotgan muhit (suv) ustunlari gidrostatik bosimlari farqi orqali ΔP aniqlanadi."
    },
    {
      question: "Diafragma modulining (nisbiy maydon m) formulasi qaysi?",
      options: [
        "m = d^2 / D^2 (bu yerda d - teshik diametri, D - quvur ichki diametri)",
        "m = D / d",
        "m = d + D",
        "m = d · D"
      ],
      answer: 0,
      explanation: "Modul m - drossel teshigi kesim yuzasining quvur ichki kesim yuzasiga nisbatidir: m = A0 / A_quvur = d^2 / D^2."
    },
    {
      question: "Drossel qurilmasidan oldin va keyin nima sababdan to'g'ri quvur uchastkalari (pryamolineynie uchastki) talab qilinadi?",
      options: [
        "Tirsaklar, klapanlar va burilishlar hosil qilgan girdoblar va assimetrik tezlik profilini so'ndirib, barqaror oqimni ta'minlash uchun",
        "Quvur chiroyli ko'rinishi uchun",
        "Trubani tozalash oson bo'lishi uchun",
        "Suvni sovutish uchun"
      ],
      answer: 0,
      explanation: "ГОСТ 8.586.1 bo'yicha drossel oldida oqim simmetrik va girdobsiz bo'lishi shart, aks holda sarf koeffitsienti α keskin o'zgarib o'lchash xatosi 20% dan oshib ketadi."
    },
    {
      question: "Agar montaj paytida diafragma teskari o'rnatilsa (o'tkir qirra oqimga qarshi emas, oqim bo'ylab qarab qolsa), asbob ko'rsatishi qanday o'zgaradi?",
      options: [
        "Asbob haqiqiy sarfdan ancha kam ko'rsata boshlaydi (sezilarli manfiy xatolik)",
        "Asbob ko'rsatishi 5 barobar oshib ketadi",
        "Hech narsa o'zgarmaydi",
        "Quvur portlab ketadi"
      ],
      answer: 0,
      explanation: "Qiya qirra tomondan kirgan oqim silliqroq o'tadi va drossellanish kamayadi, hosil bo'lgan ΔP kichik bo'ladi va asbob sarfni kam ko'rsatadi."
    },
    {
      question: "Uzoq muddatli ekspluatatsiyada diafragmaning o'tkir qirrasi yeyilib, dumaloqlanib qolsa nima yuz beradi?",
      options: [
        "Sarf koeffitsienti α ortadi va asbob sarfni haqiqiydan kam ko'rsata boshlaydi",
        "Asbob sarfni juda ko'p ko'rsatadi",
        "ΔP cheksiz ortadi",
        "Asbob to'xtab qoladi"
      ],
      answer: 0,
      explanation: "O'tkir qirra to'mtoqlashganda qarshilik kamayadi va bosimlar farqi pasayadi, natijada hisoblagich sarfni kam ko'rsatib, texnologik xatolik vujudga keltiradi."
    },
    {
      question: "Sanoat sarf o'lchash tizimlarida ikkilamchi asboblar siferblatini bir tekis (chiziqli) qilish uchun qaysi blok qo'llaniladi?",
      options: [
        "Kvadratik ildiz chiqarish bloki (bloki izvlecheniya kornya)",
        "Logarifmlash bloki",
        "Integrallash zanjiri",
        "Kuchlanish bo'lgich"
      ],
      answer: 0,
      explanation: "ΔP dan √ΔP chiqarilgach, olingan signal sarf Q ga to'g'ridan-to'g'ri chiziqli proporsional bo'lib qoladi va shkala bir tekis bo'linadi."
    },
    {
      question: "Drossel qurilmalari bo'yicha qaysi davlatlararo standart amal qiladi?",
      options: [
        "ГОСТ 8.586.1..5-2005",
        "ГОСТ 2405-88",
        "ГОСТ 6651-2009",
        "ГОСТ 8.585-2001"
      ],
      answer: 0,
      explanation: "ГОСТ 8.586.1..5-2005 standartlari drossel qurilmalari yordamida gaz va suyuqliklar sarfini o'lchashning to'liq hisob-kitobini belgilaydi."
    },
    {
      question: "Difmanometrga boruvchi impuls quvurlarida nima sababdan havo chiqarish (ventilyasiya) jo'mraklari o'rnatiladi?",
      options: [
        "Suyuqlik o'lchanayotganda impuls quvurlarida tiqilib qolgan havo pufakchalarini chiqarib tashlash uchun",
        "Quvurlarni bo'yash uchun",
        "Haroratni o'lchash uchun",
        "Suvni ichish uchun"
      ],
      answer: 0,
      explanation: "Agar gidravlik impuls trubkasida havo tiqilib qolsa, u gidravlik prujina vazifasini bajarib differensial bosim uzatilishini buzadi."
    },
    {
      question: "Bernulli tenglamasining fizik ma'nosi nima?",
      options: [
        "Ideal suyuqlik oqimi bo'ylab to'liq mexanik energiyaning (statik, dinamik va gidrostatik bosimlar yig'indisining) saqlanish qonuni",
        "Haroratning saqlanish qonuni",
        "Massa yo'qolish qonuni",
        "Elektr zaryadining saqlanishi"
      ],
      answer: 0,
      explanation: "Daniel Bernulli qonuni oqim bo'ylab bosim energiyasi va kinetik energiya yig'indisi o'zgarmasligini isbotlaydi: P + ρv^2/2 = const."
    },
    {
      question: "Massaviy sarf (M, kg/soat) va hajmiy sarf (Q, m^3/soat) orasidagi bog'liqlik qanday?",
      options: [
        "M = ρ · Q (bu yerda ρ - muhitning zichligi)",
        "M = Q / ρ",
        "M = Q + ρ",
        "M = Q · g"
      ],
      answer: 0,
      explanation: "Massaviy sarf hajmiy sarfni o'lchanayotgan muhit zichligiga ko'paytirish orqali topiladi: M = ρ · Q."
    },
    {
      question: "Ifloslangan, qum va loy aralashgan oqavalarda standart diafragma o'rniga nima ishlatiladi?",
      options: [
        "Segmentli diafragma yoki elektromagnit sarf o'lchagich",
        "Yupqa shisha naycha",
        "Paxtali filtr",
        "Oddiy kran"
      ],
      answer: 0,
      explanation: "Konsentrik teshik oldida cho'kindi va qum to'planib qoladi. Segmentli diafragmaning teshigi quvur tubida bo'lib, loyning erkin o'tib ketishiga yo'l beradi."
    },
    {
      question: "Bosim o'lchash joyi (otbor davleniya) diafragma gardishida (flanesida) qanday masofada joylashtiriladi?",
      options: [
        "Flanesli usulda: diafragma diskining old va orqa yuzasidan 25.4 mm (1 dyuym) masofada",
        "Quvurdan 10 metr narida",
        "Nasosning ichida",
        "Faqat suv omborida"
      ],
      answer: 0,
      explanation: "Flanesli tanlab olish usulida (flange taps) teshiklar diafragma diskidan aniq 25.4 mm masofada burg'ulanadi."
    },
    {
      question: "Drossel qurilmalarining asosiy afzalligi nimada?",
      options: [
        "Harakatchan qismlarining yo'qligi, yuqori ishonchliligi, mustahkamligi va standartlashtirilganligi (individual prokladkasiz hisoblash mumkinligi)",
        "Ularning shaffof shishadan tayyorlanishi",
        "Faqat qo'lda boshqarilishi",
        "Elektr toki ishlab chiqarishi"
      ],
      answer: 0,
      explanation: "Standart drossellar davlat standarti bo'yicha tayyorlansa, ularni maxsus stendda kalibrovka qilmasdan, standart formulalar orqali hisoblash kifoya qiladi."
    }
  ],

  // =========================================================================
  // 8-MAVZU: Texnologik parametrlarni avtomatik rostlash tizimlari
  // =========================================================================
  8: [
    {
      question: "Avtomatik rostlash tizimida (ART) rostlash xatoligi (boshqaruv xatosi e(t)) qanday aniqlanadi?",
      options: [
        "e(t) = SP - PV(t) (Topshiriq - Joriy qiymat)",
        "e(t) = SP + PV(t)",
        "e(t) = SP · PV(t)",
        "e(t) = PV(t) / SP"
      ],
      answer: 0,
      explanation: "Rostlash xatoligi - bu berilgan qiymat (Set Point - SP) bilan texnologik datchik o'lchagan haqiqiy parametr (Process Variable - PV) o'rtasidagi farqdir."
    },
    {
      question: "Ikki pozitsiyali (releli) rostlagichning ijro mexanizmiga uzatadigan boshqaruv signali qanday bo'ladi?",
      options: [
        "Faqat ikkita diskret qiymatni qabul qiladi: 0% yoki 100% ('O'chiq' yoki 'Yoqiq')",
        "0 dan 100% gacha silliq o'zgaradi",
        "Doimiy 50% bo'lib turadi",
        "Sinusoidal signal beradi"
      ],
      answer: 0,
      explanation: "Releli rostlagichlar faqat ikki holatda ishlaydi: harorat tushsa qizdirgichni to'liq yoqadi (100%), oshsa to'liq o'chiradi (0%)."
    },
    {
      question: "Ikki pozitsiyali rostlash tizimida rostlanuvchi parametrning tebranish xarakteri qanday bo'ladi?",
      options: [
        "Berilgan ustavka (SP) atrofida uzluksiz so'nmas avtotebranishlar yuzaga keladi",
        "Parametr qat'iy tekis to'g'ri chiziq bo'lib qoladi",
        "Parametr cheksizlikka qarab ketadi",
        "Harorat har doim mutlaq nolga tushadi"
      ],
      answer: 0,
      explanation: "Ob'ektning issiqlik inersiyasi sababli qizdirgich o'chganda ham harorat biroz oshadi, yoqilganda ham pasayadi, natijada parametr doimiy tebranib turadi."
    },
    {
      question: "Releli rostlagichlarda gisterezis zonasi (kommutatsiya differensiali Δ) nimaga xizmat qiladi?",
      options: [
        "Ijro mexanizmi va kontaktlarning parametr mayda shovqinlaridan haddan tashqari tez-tez ulanib-uzilishining (drebezgning) oldini olish uchun",
        "Haroratni oshirish uchun",
        "Tokni kamaytirish uchun",
        "Vaqtni to'xtatish uchun"
      ],
      answer: 0,
      explanation: "Agar gisterezis bo'lmasa, harorat 100.01 °C va 99.99 °C bo'lganda sekundiga o'nlab marta rele chertillab tezda kuyib ketadi."
    },
    {
      question: "Agar harorat ustavkasi SP = 100 °C, gisterezis Δ = 2 °C bo'lsa (simmetrik oraliq ±2 °C), qizdirgich qaysi haroratlarda o'chadi va qayta yoqiladi?",
      options: [
        "102 °C da o'chadi va 98 °C da yoqiladi",
        "100 °C da o'chadi va 100 °C da yoqiladi",
        "110 °C da o'chadi va 90 °C da yoqiladi",
        "50 °C da o'chadi va 150 °C da yoqiladi"
      ],
      answer: 0,
      explanation: "Qizdirish rejimida: harorat yuqori chegara SP + Δ = 100 + 2 = 102 °C ga yetganda o'chadi, sovib pastki chegara SP - Δ = 100 - 2 = 98 °C ga tushganda yana yoqiladi."
    },
    {
      question: "PID rostlagichdagi P (proporsional) tashkil etuvchining asosiy vazifasi nima?",
      options: [
        "Joriy xatolik e(t) miqdoriga to'g'ri mutanosib tezkor boshqaruv ta'sirini shakllantirish (u_p = Kp · e)",
        "O'tmishdagi xatoliklarni yig'ish",
        "Kelajakdagi xatolikni oldindan ko'rish",
        "Tizimni to'xtatish"
      ],
      answer: 0,
      explanation: "Proporsional qism xatolik qancha katta bo'lsa, zudlik bilan shuncha katta qarshi kuch hosil qilib, parametrni qaytarishga intiladi."
    },
    {
      question: "Faqat P-rostlagich qo'llanilganda tizimda qanday prinsipial kamchilik saqlanib qoladi?",
      options: [
        "Doimiy statik xatolik (qoldiq chetlanish - staticheskaya oshibka) qoladi",
        "Tizim har doim portlab ketadi",
        "Harorat doim nol bo'lib qoladi",
        "Asbob o'chib qoladi"
      ],
      answer: 0,
      explanation: "P-rostlagich klapanni ochiq ushlab turishi uchun doimo xatolik e(t) mavjud bo'lishi shart, shuning uchun parametr hech qachon SP ga 100% yetib bormaydi."
    },
    {
      question: "PID rostlagichdagi I (integral) tashkil etuvchining asosiy vazifasi nimadan iborat?",
      options: [
        "Vaqt bo'yicha to'plangan xatolik integralini hisobga olib, statik xatolikni nolga tenglashtirish (aniq ustavkaga keltirish)",
        "Tizimni tezroq tebrantirish",
        "Tokni cheklash",
        "Datchikni sovitish"
      ],
      answer: 0,
      explanation: "Integral qism kichik xatolik uzoq vaqt saqlanib tursa ham uni to'playdi va boshqaruv ta'sirini kuchaytirib statik xatolikni butunlay yo'qotadi."
    },
    {
      question: "PID rostlagichdagi D (differensial) tashkil etuvchining fizik ma'nosi nima?",
      options: [
        "Xatolikning o'zgarish tezligiga (de/dt) qarab ta'sir ko'rsatish ('oldindan ko'ra bilish' effekti va tebranishlarni so'ndirish)",
        "Doimiy kuchlanish berish",
        "Asbobni qayta yuklash",
        "Datchik qarshiligini o'lchash"
      ],
      answer: 0,
      explanation: "Differensial qism xatolik tez oshib borayotganini ko'rsa, oldindan klapanni ochib yoki yopib, parametrning oshib ketishini (pereregulirovanie) oldini oladi."
    },
    {
      question: "Sanoat mikrokontrollerli rostlagichi (masalan TRM1) qanday unifikatsiyalangan kirish signallarini qabul qila oladi?",
      options: [
        "Termoparalar (mV), termoqarshiliklar (Om) va unifikatsiyalangan 4-20 mA, 0-10 V signallarni",
        "Faqat 220 V o'zgaruvchan kuchlanishni",
        "Faqat optik tolalarni",
        "Faqat akustik signallarni"
      ],
      answer: 0,
      explanation: "Zamonaviy universal rostlagichlar universal analog kirishga ega bo'lib, menyu orqali Pt100, K-tur, 4-20 mA kabi barcha sanoat datchiklariga sozlanadi."
    },
    {
      question: "Texnologik boshqaruv ob'ektining sof kechikish vaqti (transportnaya zaderjka, τ) nimani bildiradi?",
      options: [
        "Boshqaruv ta'siri berilgan paytdan to ob'ekt parametrining o'zgarishi boshlanguncha o'tgan vaqtni",
        "Asbobning elektrga ulanish vaqtini",
        "Smenaning tugash vaqtini",
        "Datchik simining uzunligini"
      ],
      answer: 0,
      explanation: "Masalan, quvurga issiq suv quyilganda u datchikgacha oqib borishi uchun ketgan vaqt sof transport kechikishidir."
    },
    {
      question: "Agar texnologik ob'ektda kechikish vaqti τ juda katta bo'lsa, qanday rostlagichni qo'llash tavsiya etiladi?",
      options: [
        "PID yoki impulsli rostlagich (oldindan ko'ruvchi D tashkil etuvchisi bilan)",
        "Oddiy releli rostlagich",
        "Hech qanday rostlagich o'rnatmaslik",
        "Faqat qo'lda boshqarish"
      ],
      answer: 0,
      explanation: "Katta kechikishli ob'ektlarda oddiy rele yoki P-rostlagich tizimni o'ta kuchli xavfli avtotebranishga olib keladi, bu yerda differensiallovchi zanjirlar shart."
    },
    {
      question: "Zamonaviy mikroprotsessorli rostlagichlardagi 'Avtosozlash' (Auto-Tuning) funksiyasi qanday ishlaydi?",
      options: [
        "Ob'ektga qisqa muddatli sinov ta'sirini berib, javob reaksiyasi bo'yicha optimal Kp, Ti, Td koeffitsientlarini o'zi hisoblab chiqadi",
        "Asbobni zavod sozlamalariga qaytaradi",
        "Datchik simlarini ulaydi",
        "Internetdan kino yuklab oladi"
      ],
      answer: 0,
      explanation: "Avtosoxta algoritmi (masalan Zigler-Nikols yoki rele usuli) ob'ektning inersiyasini tahlil qilib, inson aralashuvisiz eng yaxshi PID parametrlarini topadi."
    },
    {
      question: "Rostlash klapani yoki tormoz zadvijkasi sanoatda qanday standart unifikatsiyalangan signal bilan boshqariladi?",
      options: [
        "4 - 20 mA tok signali yoki 0 - 10 V kuchlanish (shuningdek 0.2 - 1.0 bar pnevmatik signal)",
        "100 Amper tok",
        "10 000 Volt kuchlanish",
        "Faqat radiochastota"
      ],
      answer: 0,
      explanation: "Sanoat avtomatikasida 4-20 mA oqim sirtmog'i (tokovaya petlya) dunyo standarti bo'lib, sim uzunligiga va shovqinlarga o'ta chidamli hisoblanadi."
    },
    {
      question: "To'g'ri ta'sirli va teskari ta'sirli rostlagichlarning farqi nimada?",
      options: [
        "Haqiqiy parametr oshganda chiqish boshqaruv signali ortsa to'g'ri ta'sirli, kamaysa teskari ta'sirli deyiladi",
        "To'g'ri ta'sirli faqat kunduzi ishlaydi",
        "Teskari ta'sirli faqat orqaga qarab o'lchaydi",
        "Hech qanday farqi yo'q"
      ],
      answer: 0,
      explanation: "Qizdirish tizimida harorat oshsa qizdirgichni kamaytirish kerak (teskari ta'sir); sovutish tizimida esa harorat oshsa sovutgich valfini ko'proq ochish kerak (to'g'ri ta'sir)."
    },
    {
      question: "Sovutish pechi yoki ventilyatorni boshqarishda rostlagich qaysi rejimga sozlanishi kerak?",
      options: [
        "To'g'ri ta'sirli rejimga (Direct Action: Harorat oshsa -> Sovutish quvvati oshadi)",
        "Teskari ta'sirli rejimga",
        "Faqat o'chirilgan rejimga",
        "Statik rejimga"
      ],
      answer: 0,
      explanation: "Harorat qancha ko'tarilsa, ventilyator aylanishi shuncha tezlashishi kerak, ya'ni kirish va chiqish bir xil yo'nalishda o'zgaradi (to'g'ri ta'sir)."
    },
    {
      question: "O'tish jarayonining sifat ko'rsatkichlaridan biri bo'lgan 'Qayta rostlash' (pereregulirovanie, σ) nima?",
      options: [
        "O'tish jarayonida parametrning o'rnatilgan topshiriqdan (SP) maksimal oshib ketish foizi",
        "Asbobning elektr sarfi",
        "Klapan ochilish vaqti",
        "Datchik xatosi"
      ],
      answer: 0,
      explanation: "Pereregulirovanie: σ = [(PV_max - SP) / SP] · 100%. Sanoatda uning 10-20% dan oshmasligi sifatli rostlash belgisi hisoblanadi."
    },
    {
      question: "Rostlash vaqti (vremya regulirovaniya, t_r) deb nimaga aytiladi?",
      options: [
        "G'alayon berilgan paytdan to rostlanuvchi parametr topshiriqning ruxsat etilgan zonasiga (odatda ±5%) kirib, boshqa chiqmaydigan holatgacha bo'lgan vaqtga",
        "Pechning sovush vaqtiga",
        "Smenaning davomiyligiga",
        "Datchikning yonish vaqtiga"
      ],
      answer: 0,
      explanation: "Rostlash vaqti qancha qisqa bo'lsa, avtomatlashtirish tizimi shunchalik tezkor va sifatli hisoblanadi."
    },
    {
      question: "Rostlash ob'ektining 'o'z-o'zini tekislash' (samovyravnivanie) xususiyati nima?",
      options: [
        "Tashqi g'alayon ta'sirida parametr o'zgargandan so'ng, rostlagichsiz ham ob'ektning yangi barqaror holatga o'tish qobiliyati",
        "Ob'ektning sinishi",
        "Suvning bug'lanishi",
        "Bosimning yo'qolishi"
      ],
      answer: 0,
      explanation: "Masalan, elektr pechida harorat oshgani sari atrofga issiqlik yo'qotilishi ham ortadi va ma'lum nuqtada kiruvchi va chiquvchi issiqlik o'z-o'zidan tenglashib qoladi."
    },
    {
      question: "Optimal PID rostlashda o'tish jarayonining egri chizig'i qanday ko'rinishga ega bo'lishi eng maqbul hisoblanadi?",
      options: [
        "Tez so'nuvchi tebranishli jarayon (20% gacha qayta rostlash bilan va minimal rostlash vaqti bilan)",
        "To'xtovsiz tebranuvchi rezonans",
        "Cheksiz cho'zilgan o'ta sekin aperiodik jarayon",
        "Keskin sakrovchi tartibsiz chiziq"
      ],
      answer: 0,
      explanation: "Texnik optimal rostlash jarayonida 1-2 ta so'nuvchi yarim to'lqin bo'lib, tizim eng qisqa vaqt ichida barqaror nominal rejimga yetib keladi."
    }
  ]
};

// Export for global browser and node use
if (typeof window !== 'undefined') {
  window.labQuizzes = labQuizzes;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = labQuizzes;
}
