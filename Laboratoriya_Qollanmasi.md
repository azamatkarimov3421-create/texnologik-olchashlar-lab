# NAVOIY DAVLAT KONCHILIK VA TEXNOLOGIYALAR UNIVERSITETI
### "Avtomatlashtirish va boshqaruv" kafedrasi

**Fan:** Sohaning texnologik o'lchashlari va asboblari  
**Ta'lim yo'nalishi:** Texnologik jarayonlar va ishlab chiqarishni avtomatlashtirish  
**Guruh:** 17V-25 TJA | **Semestr:** 3-semestr (2026-2027 o'quv yili)  
**O'qituvchi:** Israilov Temur Anvar o'g'li  
**Mashg'ulot turi:** Laboratoriya ishlari to'plami va interaktiv virtual stendlar  

---

## MUNDARIJA
1. [1-Laboratoriya ishi: Termoelektrik hodisalar](#1-laboratoriya-ishi-termoelektrik-hodisalar)
2. [2-Laboratoriya ishi: Bimetall termometrining ishlash prinsipini o'rganish. Bimetall termometrining dinamik xarakteristikalari](#2-laboratoriya-ishi-bimetall-termometrining-ishlash-prinsipini-organish)
3. [3-Laboratoriya ishi: Haroratning termoelektrik o'zgartirgichini tadqiq qilish](#3-laboratoriya-ishi-haroratning-termoelektrik-ozgartirgichini-tadqiq-qilish)
4. [4-Laboratoriya ishi: Qarshilik termometrlarini tadqiq qilish](#4-laboratoriya-ishi-qarshilik-termometrlarini-tadqiq-qilish)
5. [5-Laboratoriya ishi: Haroratni o'lchash usullari](#5-laboratoriya-ishi-haroratni-olchash-usullari)
6. [6-Laboratoriya ishi: Bosimni aniqlash asboblari va usullarini o'rganish. Birlamchi o'zgartirgichlar](#6-laboratoriya-ishi-bosimni-aniqlash-asboblari-va-usullarini-organish)
7. [7-Laboratoriya ishi: O'lchov diafragmasini tarirlash (kalibrlash)](#7-laboratoriya-ishi-olchov-diafragmasini-tarirlash-kalibrlash)
8. [8-Laboratoriya ishi: Idish ichidagi bosimni TRM1 turidagi o'lchagich-regulyator va bosim relesi yordamida nazorat qilish, suyuqlik uzatishni diskret zadvishka orqali boshqarish](#8-laboratoriya-ishi-trm1-regulyatori-va-diskret-zadvishka)

---

## 1-Laboratoriya ishi: Termoelektrik hodisalar

### 1.1. Ishning maqsadi
Zeyebek, Peltye va Tomson termoelektrik effektlarining fizik mohiyatini, termoEYuK hosil bo'lish qonuniyatlarini hamda datchik himoya gilzasining dinamik issiqlik inersiyasini (vaqt doimiysi $\tau$) o'rganish.

### 1.2. Nazariy qism
1. **Zeyebek effekti (1821-y.):**
   $$E = e_{AB} \cdot (T_1 - T_2)$$
2. **Peltye effekti (1834-y.):** Tok o'tganda kontaktda issiqlik yutilishi/ajralishi:
   $$Q_P = \Pi_{AB} \cdot I \cdot t$$
3. **Tomson effekti (1856-y.):** Harorat gradientli o'tkazgichdan tok o'tganda issiqlik oqimi:
   $$dQ_T = \tau_{Th} \cdot I \cdot \frac{dT}{dx} \cdot dx \cdot dt$$
4. **Termovell (gilza) inersiyasi:**
   $$T(t) = T_0 + \Delta T \cdot (1 - e^{-t/\tau})$$
   (Yalang'och termopara: $\tau \approx 0.8\,\text{s}$; Zanglamas SS316: $\tau \approx 6.0\,\text{s}$; Cho'yan: $\tau \approx 25.0\,\text{s}$).

---

## 2-Laboratoriya ishi: Bimetall termometrining ishlash prinsipini o'rganish

### 2.1. Ishning maqsadi
ГОСТ 10928 bo'yicha termobimetallarning chiziqli kengayish farqini ($\Delta\alpha$), konsol plastinka egilishini ($s$) soat indikatori ИЧ-10 yordamida o'lchash hamda sanoat spiral siferblatli termometrlari (WIKA BT, 0–200 °C) burchak burilishini ($\varphi$) tadqiq qilish.

### 2.2. Asosiy tenglamalar
1. **Konsol plastinka egilishi:**
   $$s = \frac{3}{2} (\alpha_1 - \alpha_2) \frac{L^2}{h} \Delta T$$
2. **Sanoat spiral bimetall prujinasi:**
   $$\varphi = K_\varphi \cdot \frac{L}{h} \cdot \Delta T$$
   (WIKA siferblat masshtabi: $270^\circ / 200^\circ\text{C} = 1.35^\circ/^\circ\text{C}$).

---

## 3-Laboratoriya ishi: Haroratning termoelektrik o'zgartirgichini tadqiq qilish

### 3.1. Ishning maqsadi
ГОСТ 8.585-2001 bo'yicha TXA (K), TXK (L) va TPP (S) termoparalarini kalibrlash, statik sezgirligini hisoblash hamda sovuq ulanish ($T_0$) haroratini Dyuar idishi (0 °C) va Pt100 avtokompensatsiya usullari orqali baholash.

### 3.2. Kompensatsiya qoidasi
$$E(T, 0) = E(T, T_0) + E(T_0, 0)$$

---

## 4-Laboratoriya ishi: Qarshilik termometrlarini tadqiq qilish

### 4.1. Ishning maqsadi
ГОСТ 6651-2009 bo'yicha platina (Pt100) va mis (Cu50) termoqarshiliklarining $R = f(T)$ bog'liqligini, Uitson o'lchov ko'prigining muvozanatini hamda 2, 3 va 4-simli ulanish sxemalarida kabel qarshiligi kompensatsiyasini o'rganish.

### 4.2. Kallendar-Van Dyuzen tenglamasi
$$R(T) = R_0 (1 + A T + B T^2)$$

---

## 5-Laboratoriya ishi: Haroratni o'lchash usullari

### 5.1. Ishning maqsadi
Kontaktli (Pt100) va kontaktsiz usullar:
1. **Raytek IQ pirometri (Stefan-Boltsman):** $E = \varepsilon \cdot \sigma \cdot T^4$ qonuni va sirt nurlanish qobiliyati $\varepsilon$ sozlash.
2. **Promin / OPIR yo'qoluvchi cho'g'lanma tolali optik pirometri (ГОСТ 2372):** Teleskop okulyari maydonida pech foni va markaziy volfram tolaning fotometrik muvozanatini ($\lambda = 0.65\,\mu\text{m}$ monoxromatik qizil filtr orqali) aniqlash.

---

## 6-Laboratoriya ishi: Bosimni aniqlash asboblari va usullarini o'rganish

### 6.1. Ishning maqsadi
Burdon C-simon elastik jez naychasi, simobli U-manometr, Danfoss 4-20 mA tenzodatchigi hamda ГОСТ 2405-88 bo'yicha etalon MP-60 yuk-porshenli manometr yordamida to'g'ri va teskari yurishda manometrni davlat qiyoslashidan o'tkazish.

### 6.2. Qiyoslash mezonlari
- Keltirilgan xato: $\gamma = \frac{\Delta_{max}}{P_{shkala}} \cdot 100\%$
- Asbob variatsiyasi (gisterezis): $b = |P_{to'g'ri} - P_{teskari}|$
- ГОСТ 2405-88 talabi: $b_{max} \le \gamma_{yo'l}$ (1.0 sinf uchun $b \le 0.1\,\text{bar}$).

---

## 7-Laboratoriya ishi: O'lchov diafragmasini tarirlash (kalibrlash)

### 7.1. Ishning maqsadi
ГОСТ 8.586.1..5-2005 standart toraytiruvchi qurilmalarini taqqoslash:
1. **Standart diafragma (ГОСТ 8.586.2):** O'tkir qirrali yassi disk, tiklanmas bosim yo'qolishi $\approx 65\%$.
2. **Venturi quvuri (ГОСТ 8.586.4):** Konussimon konfuzor va kengayuvchi diffuzor, tiklanmas yo'qotish atigi $\approx 12\%$ (NMMC GMZ rudali pulpa quvurlarida katta energiya tejamkorligi).
3. **Standart soplo (ГОСТ 8.586.3):** Dumaloq profilli, yo'qotish $\approx 45\%$.

### 7.2. Sarf tenglamasi
$$Q = K \cdot \sqrt{\Delta P}$$

---

## 8-Laboratoriya ishi: TRM1 regulyatori va diskret zadvishka boshqaruvi

### 8.1. Ishning maqsadi
Rezervuardagi bosimni boshqarishning 2 ta asosiy sanoat algoritmini o'rganish:
1. **Ikki pozitsiyali (Releli) gisterezisli rostlash (ОВЕН ТРМ1):** $P \ge SP + \Delta$ da zadvishka ochiladi (100%), $P \le SP - \Delta$ da yopiladi (0%).
2. **Uzluksiz PI / PID drossellash rostlagichi (ОВЕН ТРМ210):**
   $$u(t) = K_p \cdot e(t) + \frac{1}{T_i} \int e(t) dt$$
   Klapan doimiy drossellanib, bosimni tebranishsiz aniq $SP = 3.50\,\text{bar}$ da ushlab turadi.
