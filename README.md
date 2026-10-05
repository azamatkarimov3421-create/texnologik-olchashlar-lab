# 🔬 Sohaning texnologik o'lchashlari va asboblari
### Navoiy davlat konchilik va texnologiyalar universiteti (NDKTU)
**"Avtomatlashtirish va boshqaruv" kafedrasi**

Interaktiv virtual laboratoriya majmuasi va avtomatlashtirilgan o'quv portali.

---

## 📌 Umumiy Ma'lumot

* **Oliy ta'lim muassasasi:** Navoiy davlat konchilik va texnologiyalar universiteti (NDKTU)
* **Fakultet:** Konchilik va energetika / Texnologik jarayonlar
* **Kafedra:** Avtomatlashtirish va boshqaruv
* **Ta'lim yo'nalishi:** Texnologik jarayonlar va ishlab chiqarishni avtomatlashtirish
* **Fan:** Sohaning texnologik o'lchashlari va asboblari
* **O'qituvchi:** Israilov Temur Anvar o'g'li
* **Guruh:** 17V-25 TJA | **Semestr:** 3-semestr

---

## 🎯 Laboratoriya Mashg'ulotlari Mundarijasi

Ushbu platforma fanning namunaviy o'quv dasturi va amaldagi davlat standartlari (GOST) asosida to'liq 8 ta interaktiv virtual stendni o'z ichiga oladi:

| № | Laboratoriya Ishi Nomi | O'rganiladigan Asosiy Qonuniyatlar va Datchiklar | Standart / Asos |
|---|---|---|---|
| **1** | **Termoelektrik hodisalar** | Zeyebek, Peltye va Tomson effektlari, termoEYuK, termoelektrodlar differensial sezgirligi, datchik vaqt doimiysi ($\tau$), himoya gilzalari inersiyasi | ГОСТ 8.585-2001 |
| **2** | **Bimetall termometrining ishlash prinsipi va dinamikasi** | Chiziqli issiqlikdan kengayish koeffitsienti (CHIKK), konsol bimetall plastinka egilishi ($s$), spiral sanoat bimetall siferblat termometri (WIKA BT), soat indikatori ИЧ-10 | ГОСТ 10928-90 |
| **3** | **Termoelektrik harorat o'zgartirgichlari (termoparalar)** | Standart termoparalar (TXA, TXK, TPP), sovuq ulanish haroratini Dyuar idishi ($0^\circ C$) va elektron usulda kompensatsiyalash, kompensatsion simlar polaritesi, keltirilgan xatolik | ГОСТ 8.585-2001 |
| **4** | **Qarshilik termometrlari va ulanish sxemalari** | Platina (Pt100) va mis (Cu50/Cu100) termoqarshiliklari, Kallendar-Van Dyuzen tenglamasi, 2, 3 va 4-simli ulanish sxemalari, Uiston ko'prigi muvozanati | ГОСТ 6651-2009 |
| **5** | **Haroratni o'lchashning optik va nurlanish usullari** | Stefan-Bolsman qonuni ($E = \varepsilon\sigma T^4$), Vin siljish qonuni, yo'qoluvchi cho'g'lanma tolali Promin / OPIR optik pirometri ($\lambda = 0.65\,\mu m$), sirt nurlanish koeffitsienti ($\varepsilon$) | ГОСТ 2372-95 |
| **6** | **Deformatsion va yuk-porshenli manometrlar** | Burdon prujinasi, mutlaq, ortiqcha va vakuum bosim, etalon MP-60 yuk-porshenli manometri, to'g'ri va teskari yurishda davlat qiyoslashidan o'tkazish, gisterezis (variatsiya) | ГОСТ 2405-88 |
| **7** | **O'zgaruvchan bosimlar farqi bo'yicha sarf o'lchash** | Standart diafragma, Venturi naychasi, Bernulli tenglamasi, sarf koeffitsienti ($\alpha$), kengayish koeffitsienti ($\varepsilon$), differensial U-simon manometr balandligi ($\Delta h$) | ГОСТ 8.586.1..5-2005 |
| **8** | **Avtomatik rostlash tizimlari va rostlagichlar** | Ikki pozitsiyali (releli) rostlash, kommutatsiya gisterezisi ($\Delta$), uzluksiz PID rostlagich qonuni ($K_p, T_i, T_d$), TRM1 sanoat rostlagichi, avtosozlash (Auto-Tuning) | Sanoat avtomatikasi |

---

## 🚀 Tizim Imkoniyatlari va Funksional Bloklar

1. **⚡ Virtual Simulyator:**
   * Haqiqiy fizik jarayonlar va asboblar harakatining real vaqt dinamik animatsiyasi (Canvas 2D + SVG).
   * Harakatlanuvchi suyuqlik zarrachalari, siferblat strelkalari, raqamli voltmetrlar, yuk-porshen stendining aylanishi va optik teleskop ko'rinishi.
   * Tajriba parametrlarini (harorat, bosim, sarf, materiallar, gilzalar) erkin o'zgartirish boshqaruvi.

2. **📖 Nazariya & Formulalar (Darslik darajasida):**
   * Brauzerning **native MathML** texnologiyasiga asoslangan kristalldek tiniq matematik formulalar ($\frac{a}{b}, \sqrt{x}, x^n$).
   * Har bir formulaning parametrlari (belgi, nomi, fizik ma'nosi, o'lchov birligi) jamlangan jadval.
   * Haqiqiy raqamlar bilan bosqichma-bosqich hisoblash namunalari.

3. **📊 Tajriba Jurnali va Jonli Grafika:**
   * Har bir o'lchov nuqtasini jadvalga bitta tugma bilan qayd qilish.
   * Tajriba nuqtalari asosida avtomatik quriladigan interaktiv grafiklar.
   * Xatoliklar, dispersiya va kalibrovka koeffitsientlarining avtomatlashtirilgan statistik hisobi.

4. **📝 Avtomatlashtirilgan Laboratoriya Daftari & Hisobot Generator:**
   * Talabaning F.I.Sh., guruhi, kafedra va fan rekvizitlari kiritilgan rasmiy hisobot shakli.
   * Tajriba natijalari, formulalar, hisoblashlar va nazorat savollari avtomatik to'ldiriladi.
   * A4 formatida chop etish yoki PDF sifatida saqlash imkoniyati (`window.print()`).

5. **💡 Bilimni Tekshirish (160 ta xatosiz test):**
   * Har bir laboratoriya mavzusiga **20 tadan** akademik test.
   * Darhol natija (Scoreboard: jami savollar, javob berildi, to'g'ri javoblar, o'zlashtirish foizi va progress bar).
   * Har bir savol ostida to'g'ri javobning qonuniyat yoki davlat standartiga asoslangan **ilmiy izohi**.
   * Yakuniy baholash: 5 (A'lo), 4 (Yaxshi), 3 (Qoniqarli), 2 (Qoniqarsiz).

6. **📐 Texnik Konverter:**
   * Bosim (bar, MPa, kPa, mm simob ustuni, psi).
   * Harorat (°C, K, °F).
   * TermoEYuK konverteri (TXA/TXK haroratdan mV ga va teskarisi).

---

## 💻 Loyihani Ishga Tushirish

Loyiha hech qanday tashqi kutubxonalarga yoki og'ir freymvorklarga bog'lanmagan (Zero Dependencies, sof Vanilla JavaScript, HTML5 va CSS3). 100% oflayn rejimda ishlaydi.

### 1-usul: Oddiy ochish
Repozitoriyni yuklab oling va `index.html` faylini istalgan zamonaviy veb-brauzerda (Chrome, Edge, Firefox, Safari) oching.

### 2-usul: Lokal veb-server orqali (Tavsiya etiladi)
```bash
# Repozitoriyni klonlash
git clone https://github.com/azamatkarimov3421-create/texnologik-olchashlar-lab.git
cd texnologik-olchashlar-lab

# Python yordamida serverni yoqish
python -m http.server 3000
```
Brauzerda quyidagi manzilni oching:
👉 **http://localhost:3000**

---

## 📁 Loyiha Strukturasi

```
texnologik-olchashlar-lab/
├── index.html                  # Asosiy portal sahifasi va navigatsiya
├── styles.css                  # Barcha CSS stillar, qorong'u/yorug' rejim, bosma qolip
├── data.js                     # Universitet rekvizitlari va 8 ta laboratoriya bazasi
├── quiz_data.js                # 8 x 20 = 160 ta akademik testlar va tushuntirishlar banki
├── app.js                      # Simulyatorlar dinamikasi, Canvas, MathML va hisobot mantiqi
├── Laboratoriya_Qollanmasi.md  # Kengaytirilgan akademik laboratoriya qo'llanmasi
├── .gitignore                  # Git e'tibor bermaydigan fayllar
└── README.md                   # Ushbu hujjat
```

---

## 📜 Mualliflik va Litsenziya

* **Tuzuvchi:** Navoiy davlat konchilik va texnologiyalar universiteti (NDKTU)
* **Kafedra:** "Avtomatlashtirish va boshqaruv"
* **Ilmiy rahbar:** Israilov Temur Anvar o'g'li
* **Litsenziya:** O'quv va ta'lim maqsadlarida erkin foydalanish uchun ochiq.
