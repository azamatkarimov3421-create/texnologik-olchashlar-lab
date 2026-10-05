// Interaktiv ilova mantig'i va simulyatorlar

let currentLabId = 1;
let currentTab = 'simulator'; // 'simulator', 'guide', 'report', 'quiz'

// Student report state
let studentReport = {
  studentName: "",
  studentGroup: "17V-25 TJA",
  labNumber: 1,
  conclusion: "",
  calcResults: "",
  conclusions: {},
  answers: {},
  checkedSteps: {},
  customTables: {}
};

function saveStudentReport() {
  try {
    localStorage.setItem('ndktu_lab_student_report', JSON.stringify(studentReport));
  } catch (e) {}
}

function loadStudentReport() {
  try {
    const raw = localStorage.getItem('ndktu_lab_student_report');
    if (raw) {
      const parsed = JSON.parse(raw);
      studentReport = { ...studentReport, ...parsed };
      if (!studentReport.conclusions) studentReport.conclusions = {};
      if (!studentReport.answers) studentReport.answers = {};
      if (!studentReport.checkedSteps) studentReport.checkedSteps = {};
      if (!studentReport.customTables) studentReport.customTables = {};
    }
  } catch (e) {}
}
loadStudentReport();

// --- AUDIO SINTESIS (Web Audio API) ---
const AudioFX = {
  ctx: null,
  enabled: true,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  click() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch(e) {}
  },
  relayClick(state) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(state ? 400 : 250, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  },
  success() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } catch(e) {}
  },
  airHiss() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e) {}
  },
  laserBeep() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch(e) {}
  }
};

function toggleSound() {
  AudioFX.enabled = !AudioFX.enabled;
  const icon = document.getElementById('sound-icon');
  if (icon) {
    icon.textContent = AudioFX.enabled ? '🔊' : '🔇';
  }
  if (AudioFX.enabled) AudioFX.click();
}

// Talabaning tajriba o'lchovlari jurnali
let liveExperimentData = {
  1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
};

// DOM yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  loadLab(1);
  setupEventListeners();

  // Foydalanuvchining ilk harakatidayoq audio tizimini to'liq faollashtirish
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, () => {
      AudioFX.init();
    }, { once: true });
  });
});

function setupEventListeners() {
  // Qidiruv
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      renderSidebar(query);
    });
  }

  // Mavzu almashtirish (Dark / Light)
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = isDark ? '☀️' : '🌙';
  }
}

function renderSidebar(filter = '') {
  const listEl = document.getElementById('lab-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  laboratories.forEach(lab => {
    if (filter && !lab.title.toLowerCase().includes(filter) && !lab.shortDesc.toLowerCase().includes(filter)) {
      return;
    }

    const item = document.createElement('div');
    item.className = `lab-nav-item ${lab.id === currentLabId ? 'active' : ''}`;
    item.onclick = () => loadLab(lab.id);
    item.innerHTML = `
      <div class="lab-nav-num">#${lab.id}</div>
      <div class="lab-nav-info">
        <div class="lab-nav-title">${lab.title}</div>
        <div class="lab-nav-sub">${lab.duration} • Mashg'ulot</div>
      </div>
    `;
    listEl.appendChild(item);
  });
}

function loadLab(id) {
  if (trm1Interval) {
    clearInterval(trm1Interval);
    trm1Interval = null;
  }
  currentLabId = id;
  studentReport.labNumber = id;
  renderSidebar();

  const lab = laboratories.find(l => l.id === id);
  if (!lab) return;

  // Header ma'lumotlari
  document.getElementById('current-lab-num').textContent = `Laboratoriya ishi №${lab.id}`;
  document.getElementById('current-lab-title').textContent = lab.title;
  document.getElementById('current-lab-desc').textContent = lab.shortDesc;

  switchTab(currentTab);
}

function switchTab(tabName) {
  if (trm1Interval) {
    clearInterval(trm1Interval);
    trm1Interval = null;
  }
  if (typeof LiveSCADAManager !== 'undefined') {
    LiveSCADAManager.stop();
  }
  currentTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  const contentArea = document.getElementById('tab-content');
  const lab = laboratories.find(l => l.id === currentLabId);
  if (!lab || !contentArea) return;

  switch (tabName) {
    case 'guide':
      renderGuideTab(contentArea, lab);
      break;
    case 'simulator':
      renderSimulatorTab(contentArea, lab);
      break;
    case 'report':
      renderReportTab(contentArea, lab);
      break;
    case 'quiz':
      renderQuizTab(contentArea, lab);
      break;
  }
}

// 1. QO'LLANMA (GUIDE) TABI
function renderGuideTab(container, lab) {
  container.innerHTML = `
    <div class="guide-container">
      <div class="meta-card">
        <div class="meta-grid">
          <div><strong>OTM:</strong> ${universityInfo.university}</div>
          <div><strong>Kafedra:</strong> ${universityInfo.department}</div>
          <div><strong>Fan:</strong> ${universityInfo.subject}</div>
          <div><strong>O'qituvchi:</strong> ${universityInfo.teacher}</div>
          <div><strong>Guruh:</strong> ${universityInfo.group}</div>
          <div><strong>Semestr:</strong> ${universityInfo.semester} (${universityInfo.academicYear})</div>
        </div>
      </div>

      <div class="content-section">
        <h3>🎯 1. Ishning maqsadi</h3>
        <p class="highlight-box">${lab.purpose}</p>
      </div>

      <div class="content-section">
        <h3>🔬 2. Kerakli asbob-uskunalar va stend elementlari</h3>
        <ul class="equip-list">
          ${lab.equipment.map(eq => `<li><span class="bullet">✓</span> ${eq}</li>`).join('')}
        </ul>
      </div>

      <div class="content-section">
        <h3>📚 3. Nazariy tushunchalar va formulalar</h3>
        <div class="theory-box">
          ${formatTheoryText(lab.theory, lab.id)}
        </div>
      </div>

      <div class="content-section">
        <h3>⚙️ 4. Ishni bajarish tartibi</h3>
        <ol class="procedure-list">
          ${lab.procedure.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <div class="content-section">
        <h3>📊 5. Namunaviy o'lchov va hisob-kitob jadvallari</h3>
        ${renderSampleDataTable(lab)}
      </div>

      <div class="content-section">
        <h3>❓ 6. Nazorat savollari (Mustaqil tayyorgarlik va hisobot uchun)</h3>
        <div class="questions-list">
          ${lab.questions.map((q, idx) => {
            const userAns = (studentReport.answers && studentReport.answers[lab.id] && studentReport.answers[lab.id][idx]) || '';
            const hint = getQuestionHint(lab.id, idx);
            return `
            <div class="q-item" style="flex-direction:column; align-items:stretch; margin-bottom:12px; background:var(--bg-card); padding:12px 14px; border:1px solid var(--border-color); border-radius:8px;">
              <div style="display:flex; align-items:flex-start; gap:10px;">
                <span class="q-num">${idx + 1}</span>
                <span class="q-text" style="font-weight:600; color:var(--text-main); font-size:0.95rem;">${q}</span>
              </div>
              <details style="margin-top:8px;" ${userAns ? 'open' : ''}>
                <summary style="font-size:0.82rem; color:#2563eb; cursor:pointer; user-select:none; font-weight:500;">
                  ✍️ Ushbu savolga daftarda javob yozish (Ochish/Yopish)
                </summary>
                <div style="margin-top:8px;">
                  ${hint ? `<div style="font-size:0.8rem; background:#eff6ff; color:#1e40af; padding:8px 12px; border-radius:6px; margin-bottom:8px; border-left:3px solid #3b82f6;"><strong>💡 Yo'llanma & Formula:</strong> ${hint}</div>` : ''}
                  <textarea
                    class="form-textarea rep-question-textarea"
                    rows="3"
                    placeholder="Ushbu savol bo'yicha tushuntirish va javobingizni shu yerda yozing (avtomatik hisobotga o'tadi)..."
                    oninput="handleQuestionAnswerInput(${lab.id}, ${idx}, this.value)"
                  >${userAns}</textarea>
                </div>
              </details>
            </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="action-banner">
        <div>
          <h4>Ushbu laboratoriya ishini virtual stendda sinab ko'rmoqchimisiz?</h4>
          <p>Interaktiv parametrlar bilan tajribalarni bajaring va hisob-kitoblarni real vaqtda ko'ring.</p>
        </div>
        <button class="btn btn-primary" onclick="switchTab('simulator')">🚀 Simulyatorga o'tish</button>
      </div>
    </div>
  `;
}

function formatTheoryText(text, labId) {
  const lines = text.trim().split('\n');
  const renderedText = lines.map(line => {
    line = line.trim();
    if (!line) return '<br/>';
    if (line.match(/^[1-9]\./)) {
      return `<h4 class="theory-subheading" style="color:var(--primary); font-size:1.05rem; margin-top:14px; margin-bottom:6px; font-weight:700;">${line}</h4>`;
    }
    if (line.startsWith('-')) {
      return `<li class="theory-li" style="margin-left:1.5rem; margin-bottom:4px; color:var(--text-muted);">${line.substring(1).trim()}</li>`;
    }
    return `<p class="theory-p" style="margin-bottom:8px; line-height:1.6; color:var(--text-main);">${line}</p>`;
  }).join('');

  const formulasHtml = renderLabFormulasCard(labId);
  return renderedText + formulasHtml;
}

function renderLabFormulasCard(labId) {
  switch (labId) {
    case 1:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Asosiy termodinamik formulalar va ularning fizik ma'nosi:
          </h3>

          <!-- 1. Zeyebek formulasi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>⚡</span> 1-Formula: Zeyebek qonuni (TermoEYuK hosil bo'lishi)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>E</mi>
                  <mo stretchy="false">(</mo>
                  <msub><mi>T</mi><mn>1</mn></msub>
                  <mo>,</mo>
                  <msub><mi>T</mi><mn>2</mn></msub>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <msub><mi>α</mi><mrow><mi>A</mi><mi>B</mi></mrow></msub>
                  <mo>·</mo>
                  <mo stretchy="false">(</mo>
                  <msub><mi>T</mi><mn>1</mn></msub>
                  <mo>−</mo>
                  <msub><mi>T</mi><mn>2</mn></msub>
                  <mo stretchy="false">)</mo>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th style="width: 15%;">Belgi</th>
                  <th style="width: 35%;">Fizik parametr nomi</th>
                  <th style="width: 35%;">Mazmuni va texnologik ahamiyati</th>
                  <th style="width: 15%;">O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">E(T₁, T₂)</span></td>
                  <td>Termoelektr yurituvchi kuch (TermoEYuK)</td>
                  <td>Pechdagi issiq va Dyuar idishidagi sovuq tutashmalar farqi keltirib chiqargan elektr potensiali</td>
                  <td><span class="formula-var-unit">mV (millivolt)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">α_AB</span></td>
                  <td>Differensial termosezgirlik koeffitsiyenti</td>
                  <td>Tanlangan termopara turining (TXA, TXK, TPP) har bir 1 °C ga ishlab chiqaradigan kuchlanishi</td>
                  <td><span class="formula-var-unit">mkV/°C</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">T₁</span></td>
                  <td>Issiq tutashma harorati</td>
                  <td>O'lchanayotgan texnologik muhit (mufel pechi) harorati</td>
                  <td><span class="formula-var-unit">°C</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">T₂</span></td>
                  <td>Sovuq tutashma (erkin uch) harorati</td>
                  <td>Kompensatsion Dyuar idishidagi muzli termos yoki xona harorati</td>
                  <td><span class="formula-var-unit">°C</span></td>
                </tr>
              </tbody>
            </table>
            <div class="formula-example-box">
              <strong>💡 Amaliy hisoblash namunasi (TXA K-tur termoparasi uchun):</strong><br/>
              Pech harorati <span class="formula-example-val">T₁ = 150 °C</span>, Dyuar idishi <span class="formula-example-val">T₂ = 0 °C</span>, sezgirlik <span class="formula-example-val">α = 41.0 mkV/°C = 0.041 mV/°C</span> bo'lganda:<br/>
              <span style="font-weight:700; color:#0f172a;">E = 0.041 mV/°C · (150 - 0)°C = 6.150 mV</span> (Voltmetrda 6.150 mV hosil bo'ladi).
            </div>
          </div>

          <!-- 2. Peltye formulasi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>❄️</span> 2-Formula: Peltye effekti (Muzlash va issiqlik yutilishi)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <msub><mi>Q</mi><mi>P</mi></msub>
                  <mo>=</mo>
                  <msub><mi>Π</mi><mrow><mi>A</mi><mi>B</mi></mrow></msub>
                  <mo>·</mo>
                  <mi>I</mi>
                  <mo>·</mo>
                  <mi>t</mi>
                  <mo>=</mo>
                  <mo stretchy="false">(</mo>
                  <msub><mi>α</mi><mrow><mi>A</mi><mi>B</mi></mrow></msub>
                  <mo>·</mo>
                  <mi>T</mi>
                  <mo stretchy="false">)</mo>
                  <mo>·</mo>
                  <mi>I</mi>
                  <mo>·</mo>
                  <mi>t</mi>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th>Belgi</th>
                  <th>Fizik parametr nomi</th>
                  <th>Mazmuni va texnologik ahamiyati</th>
                  <th>O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">Q_P</span></td>
                  <td>Peltye issiqlik miqdori</td>
                  <td>Tok o'tganda tutashmadan yutilgan (sovutilgan) yoki ajralgan issiqlik energiyasi</td>
                  <td><span class="formula-var-unit">J (Joul)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">Π_AB</span></td>
                  <td>Peltye koeffitsiyenti</td>
                  <td>Termodinamik Kelvin munosabati bo'yicha: Π = α · T</td>
                  <td><span class="formula-var-unit">V (Volt)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">I</span></td>
                  <td>Elektr toki kuchi</td>
                  <td>Moduldan o'tuvchi to'g'ri o'zgarmas tok</td>
                  <td><span class="formula-var-unit">A (Amper)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">t</span></td>
                  <td>Vaqt davomiyligi</td>
                  <td>Sovutish jarayoni ketayotgan vaqt</td>
                  <td><span class="formula-var-unit">s (soniya)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 3. Dinamik inersiya formulasi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>⏱</span> 3-Formula: Himoya gilzasi (termovell) dinamik issiqlik inersiyasi
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>T</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <msub><mi>T</mi><mn>0</mn></msub>
                  <mo>+</mo>
                  <mo stretchy="false">(</mo>
                  <msub><mi>T</mi><mrow><mi>p</mi><mi>e</mi><mi>c</mi><mi>h</mi></mrow></msub>
                  <mo>−</mo>
                  <msub><mi>T</mi><mn>0</mn></msub>
                  <mo stretchy="false">)</mo>
                  <mo>·</mo>
                  <mfenced>
                    <mrow>
                      <mn>1</mn>
                      <mo>−</mo>
                      <msup>
                        <mi>e</mi>
                        <mrow>
                          <mo>−</mo>
                          <mfrac>
                            <mi>t</mi>
                            <mi>τ</mi>
                          </mfrac>
                        </mrow>
                      </msup>
                    </mrow>
                  </mfenced>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>💡 Vaqt doimiysi τ (tau) ta'siri:</strong><br/>
              • <strong>Yalang'och datchik:</strong> <span class="formula-example-val">τ ≈ 0.8 s</span> — harorat sakrashiga deyarli zumda javob beradi.<br/>
              • <strong>Zanglamas po'lat (SS316) gilza:</strong> <span class="formula-example-val">τ ≈ 6.0 s</span> — sanoatda optimal mustahkamlik va dinamik tezlik balansi.<br/>
              • <strong>Og'ir cho'yan gilza:</strong> <span class="formula-example-val">τ ≈ 25.0 s</span> — kuchli dinamik kechikishga sabab bo'ladi.
            </div>
          </div>
        </div>
      `;

    case 2:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Bimetall deformatsiyasining asosiy formulalari (ГОСТ 10928-90):
          </h3>

          <!-- 1. Bimetall plastinka egilishi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>📏</span> 1-Formula: Konsol bimetall plastinka erkin uchining egilish strelkasi (s)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>s</mi>
                  <mo>=</mo>
                  <mfrac>
                    <mrow>
                      <mn>3</mn>
                      <mo>·</mo>
                      <msup><mi>L</mi><mn>2</mn></msup>
                      <mo>·</mo>
                      <mo stretchy="false">(</mo>
                      <msub><mi>α</mi><mn>1</mn></msub>
                      <mo>−</mo>
                      <msub><mi>α</mi><mn>2</mn></msub>
                      <mo stretchy="false">)</mo>
                      <mo>·</mo>
                      <mi>Δ</mi>
                      <mi>T</mi>
                    </mrow>
                    <mrow>
                      <mn>2</mn>
                      <mo>·</mo>
                      <mi>h</mi>
                    </mrow>
                  </mfrac>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th style="width: 15%;">Belgi</th>
                  <th style="width: 35%;">Fizik parametr nomi</th>
                  <th style="width: 35%;">Mazmuni va bog'liqligi</th>
                  <th style="width: 15%;">O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">s</span></td>
                  <td>Egilish strelkasi (siljish)</td>
                  <td>Plastinkaning soat indikatori (ИЧ-10) o'lchaydigan vertikal siljishi</td>
                  <td><span class="formula-var-unit">mm</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">L</span></td>
                  <td>Plastinkaning erkin uzunligi</td>
                  <td>Mahkamlangan joydan ulanish nuqtasigacha bo'lgan uzunlik. <strong>Egilish L² ga proporsional!</strong></td>
                  <td><span class="formula-var-unit">mm</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">α₁ - α₂</span></td>
                  <td>CHIKK lar farqi (Δα)</td>
                  <td>Aktiv qatlam (latun: ~19·10⁻⁶ K⁻¹) va passiv qatlam (invar: ~1.5·10⁻⁶ K⁻¹) kengayish farqi</td>
                  <td><span class="formula-var-unit">K⁻¹ (1/°C)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">h</span></td>
                  <td>Bimetall tasma qalinligi</td>
                  <td>Ikkala metall qatlamining umumiy qalinligi. Egilish qalinlikka teskari proporsional</td>
                  <td><span class="formula-var-unit">mm</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">ΔT</span></td>
                  <td>Harorat o'zgarishi</td>
                  <td>Vannadagi harorat va xona harorati farqi (T - T₀)</td>
                  <td><span class="formula-var-unit">°C</span></td>
                </tr>
              </tbody>
            </table>
            <div class="formula-example-box">
              <strong>💡 Amaliy hisoblash namunasi:</strong><br/>
              Uzunlik <span class="formula-example-val">L = 100 mm</span>, qalinlik <span class="formula-example-val">h = 1.0 mm</span>, farq <span class="formula-example-val">Δα = 17.5 · 10⁻⁶ K⁻¹</span>, harorat <span class="formula-example-val">ΔT = 60 °C</span>:<br/>
              <span style="font-weight:700; color:#0f172a;">s = (3 · 100² · 17.5·10⁻⁶ · 60) / (2 · 1.0) = 31.5 / 20 = 1.575 mm</span> (Indikator 1.575 mm siljiydi).
            </div>
          </div>

          <!-- 2. Spiral bimetall burilish formulasi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🔄</span> 2-Formula: Sanoat spiral bimetall termometri siferblati (WIKA BT)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>φ</mi>
                  <mo>=</mo>
                  <msub><mi>K</mi><mi>b</mi></msub>
                  <mo>·</mo>
                  <mfrac>
                    <mrow>
                      <mi>L</mi>
                      <mo>·</mo>
                      <mi>Δ</mi>
                      <mi>T</mi>
                    </mrow>
                    <mi>h</mi>
                  </mfrac>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>Texnologik afzalligi:</strong> Spiral shakl kichik datchik diametrida (Ø50 mm) juda uzun faol tasma (L = 200 mm) joylashtirish va strelkani 0 dan 270° gacha silliq burish imkonini beradi.
            </div>
          </div>
        </div>
      `;

    case 3:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Termoparani kalibrlash va xatolik formulalari (ГОСТ 8.585-2001):
          </h3>

          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🎯</span> 1-Formula: Erkin uchlar harorati T₀ ≠ 0 °C bo'lgandagi EYuK korreksiyasi
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>E</mi>
                  <mo stretchy="false">(</mo>
                  <mi>T</mi>
                  <mo>,</mo>
                  <mn>0</mn>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <mi>E</mi>
                  <mo stretchy="false">(</mo>
                  <mi>T</mi>
                  <mo>,</mo>
                  <msub><mi>T</mi><mn>0</mn></msub>
                  <mo stretchy="false">)</mo>
                  <mo>+</mo>
                  <mi>E</mi>
                  <mo stretchy="false">(</mo>
                  <msub><mi>T</mi><mn>0</mn></msub>
                  <mo>,</mo>
                  <mn>0</mn>
                  <mo stretchy="false">)</mo>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th>Belgi</th>
                  <th>Parametr nomi</th>
                  <th>Fizik va metrologik ma'nosi</th>
                  <th>O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">E(T, 0)</span></td>
                  <td>To'liq keltirilgan EYuK</td>
                  <td>Standart graduirovka jadvalidan haqiqiy haroratni aniqlash uchun 0 °C ga keltirilgan EYuK</td>
                  <td><span class="formula-var-unit">mV</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">E(T, T₀)</span></td>
                  <td>O'lchangan EYuK qiymati</td>
                  <td>Potensiometr yoki voltmetr bevosita ko'rsatgan o'lchov qiymati</td>
                  <td><span class="formula-var-unit">mV</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">E(T₀, 0)</span></td>
                  <td>Sovuq tutashma tuzatmasi</td>
                  <td>Xona harorati (T₀) ga mos keluvchi qo'shimcha tuzatma EYuK qiymati</td>
                  <td><span class="formula-var-unit">mV</span></td>
                </tr>
              </tbody>
            </table>
            <div class="formula-example-box">
              <strong>💡 Amaliy misol:</strong><br/>
              Pech harorati o'lchanganda <span class="formula-example-val">E(T, 20°C) = 4.18 mV</span> chiqdi. Xona harorati 20 °C ga mos jadval tuzatmasi <span class="formula-example-val">E(20°C, 0) = 0.81 mV</span> bo'lsa:<br/>
              <span style="font-weight:700; color:#0f172a;">E(T, 0) = 4.18 + 0.81 = 4.99 mV</span> ➔ ГОСТ jadvalidan haqiqiy harorat <span class="formula-example-val">T = 122.5 °C</span> deb topiladi.
            </div>
          </div>

          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>📊</span> 2-Formula: Keltirilgan asosiy xatolik (Aniqlik sinfi)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>γ</mi>
                  <mo>=</mo>
                  <mfrac>
                    <mrow>
                      <mo>|</mo>
                      <msub><mi>T</mi><mrow><mi>o</mi><mo>'</mo><mi>l</mi><mi>c</mi><mi>h</mi></mrow></msub>
                      <mo>−</mo>
                      <msub><mi>T</mi><mrow><mi>h</mi><mi>a</mi><mi>q</mi></mrow></msub>
                      <msub><mo>|</mo><mrow><mi>m</mi><mi>a</mi><mi>x</mi></mrow></msub>
                    </mrow>
                    <msub><mi>T</mi><mrow><mi>s</mi><mi>h</mi><mi>k</mi><mi>a</mi><mi>l</mi><mi>a</mi></mrow></msub>
                  </mfrac>
                  <mo>·</mo>
                  <mn>100</mn>
                  <mo>%</mo>
                  <mo>≤</mo>
                  <msub><mi>γ</mi><mrow><mi>r</mi><mi>u</mi><mi>x</mi><mi>s</mi><mi>a</mi><mi>t</mi></mrow></msub>
                </mrow>
              </math>
            </div>
          </div>
        </div>
      `;

    case 4:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Qarshilik termometrlari va Uitson ko'prigi formulalari (ГОСТ 6651-2009):
          </h3>

          <!-- Platina Kallendar-Van Dyuzen -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>💎</span> 1-Formula: Platina termoqarshiligi (Pt100, Kallendar-Van Dyuzen tenglamasi)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>R</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <msub><mi>R</mi><mn>0</mn></msub>
                  <mo>·</mo>
                  <mfenced>
                    <mrow>
                      <mn>1</mn>
                      <mo>+</mo>
                      <mi>A</mi>
                      <mo>·</mo>
                      <mi>t</mi>
                      <mo>+</mo>
                      <mi>B</mi>
                      <mo>·</mo>
                      <msup><mi>t</mi><mn>2</mn></msup>
                    </mrow>
                  </mfenced>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th>Belgi</th>
                  <th>Parametr nomi</th>
                  <th>Standart qiymati va ma'nosi</th>
                  <th>O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">R₀</span></td>
                  <td>Boshlang'ich qarshilik</td>
                  <td>Datchikning 0 °C dagi nominal qarshiligi (Pt100 uchun R₀ = 100.00 Ω)</td>
                  <td><span class="formula-var-unit">Ω (Om)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">A</span></td>
                  <td>Chiziqli koeffitsiyent</td>
                  <td>A = 3.9083 · 10⁻³ °C⁻¹</td>
                  <td><span class="formula-var-unit">°C⁻¹</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">B</span></td>
                  <td>Kvadratik koeffitsiyent</td>
                  <td>B = -5.775 · 10⁻⁷ °C⁻² (Yuqori haroratlardagi egrilikni tuzatadi)</td>
                  <td><span class="formula-var-unit">°C⁻²</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mis termoqarshiligi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🔶</span> 2-Formula: Mis termoqarshiligi (Cu50 / Cu100 chiziqli tenglamasi)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>R</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <msub><mi>R</mi><mn>0</mn></msub>
                  <mo>·</mo>
                  <mo stretchy="false">(</mo>
                  <mn>1</mn>
                  <mo>+</mo>
                  <mi>α</mi>
                  <mo>·</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mspace width="1em"/>
                  <mo stretchy="false">(</mo>
                  <mi>α</mi>
                  <mo>=</mo>
                  <mn>0.00428</mn>
                  <msup><mspace width="0.2em"/><mo>∘</mo></msup>
                  <msup><mtext>C</mtext><mrow><mo>−</mo><mn>1</mn></mrow></msup>
                  <mo stretchy="false">)</mo>
                </mrow>
              </math>
            </div>
          </div>

          <!-- Uitson ko'prigi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>⚖️</span> 3-Formula: Muvozanatlangan Uitson ko'prigi tenglamasi
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <msub><mi>R</mi><mi>x</mi></msub>
                  <mo>=</mo>
                  <mfrac>
                    <mrow>
                      <msub><mi>R</mi><mn>2</mn></msub>
                      <mo>·</mo>
                      <msub><mi>R</mi><mn>3</mn></msub>
                    </mrow>
                    <msub><mi>R</mi><mn>1</mn></msub>
                  </mfrac>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>💡 3-simli ulanish afzalligi:</strong><br/>
              2-simli sxemada kabel qarshiligi (<span class="formula-example-val">2 · R_l</span>) to'g'ridan-to'g'ri o'lchovga qo'shilib xatolik beradi. 3-simli sxemada esa kabel qarshiliklari ko'prikning qarama-qarshi yelkalariga tushib o'zaro ayiriladi: <span class="formula-example-val">(R_x + R_l) - R_l = R_x</span>.
            </div>
          </div>
        </div>
      `;

    case 5:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Pirometriya va issiqlik nurlanishi qonunlari (ГОСТ 2372-95):
          </h3>

          <!-- Stefan-Bolsman -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>☀️</span> 1-Formula: Stefan-Bolsman to'liq nurlanish qonuni
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>E</mi>
                  <mo>=</mo>
                  <mi>ε</mi>
                  <mo>·</mo>
                  <mi>σ</mi>
                  <mo>·</mo>
                  <msup><mi>T</mi><mn>4</mn></msup>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th>Belgi</th>
                  <th>Parametr nomi</th>
                  <th>Fizik ma'nosi</th>
                  <th>O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">E</span></td>
                  <td>To'liq nurlanish zichligi</td>
                  <td>Jism sirtining 1 m² yuzasidan barcha to'lqin uzunliklarida tarqalayotgan nurlanish quvvati</td>
                  <td><span class="formula-var-unit">Vt/m²</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">ε</span></td>
                  <td>Qoralik darajasi (nurlanish qobiliyati)</td>
                  <td>Haqiqiy jism nurlanishining absolyut qora jismga nisbati (0 < ε ≤ 1.0)</td>
                  <td><span class="formula-var-unit">O'lchovsiz</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">σ</span></td>
                  <td>Stefan-Bolsman doimiysi</td>
                  <td>Universal fizik doimiy: σ = 5.67037 · 10⁻⁸ Vt/(m²·K⁴)</td>
                  <td><span class="formula-var-unit">Vt/(m²·K⁴)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">T</span></td>
                  <td>Termodinamik mutlaq harorat</td>
                  <td>T = t [°C] + 273.15</td>
                  <td><span class="formula-var-unit">K (Kelvin)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Optik pirometr -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🔭</span> 2-Formula: Optik yo'qoluvchi cho'g'lanma tolali pirometr (Promin / OPIR)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <msub><mi>T</mi><mrow><mi>h</mi><mi>a</mi><mi>q</mi></mrow></msub>
                  <mo>=</mo>
                  <mfrac>
                    <msub><mi>T</mi><mrow><mi>y</mi><mi>o</mi><mi>r</mi></mrow></msub>
                    <mrow>
                      <mn>1</mn>
                      <mo>+</mo>
                      <mfrac>
                        <mrow>
                          <mi>λ</mi>
                          <mo>·</mo>
                          <msub><mi>T</mi><mrow><mi>y</mi><mi>o</mi><mi>r</mi></mrow></msub>
                        </mrow>
                        <msub><mi>c</mi><mn>2</mn></msub>
                      </mfrac>
                      <mo>·</mo>
                      <mi>ln</mi>
                      <mo stretchy="false">(</mo>
                      <msub><mi>ε</mi><mi>λ</mi></msub>
                      <mo stretchy="false">)</mo>
                    </mrow>
                  </mfrac>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>💡 Muhim xulosa:</strong> Har doim <span class="formula-example-val">T_yorqinlik ≤ T_haqiqiy</span> bo'ladi, chunki real jismlarning nurlanish koeffitsiyenti <span class="formula-example-val">ε_λ < 1.0</span>. Faqat absolyut qora jismda (ε=1.0) yorqinlik harorati haqiqiy haroratga teng bo'ladi!
            </div>
          </div>
        </div>
      `;

    case 6:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Bosim o'lchash va davlat tekshiruvi (poverka) formulalari (ГОСТ 2405-88):
          </h3>

          <!-- Mutlaq bosim -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🔵</span> 1-Formula: Mutlaq va manometrik (ortiqcha) bosim munosabati
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <msub><mi>P</mi><mrow><mi>m</mi><mi>u</mi><mi>t</mi><mi>l</mi><mi>a</mi><mi>q</mi></mrow></msub>
                  <mo>=</mo>
                  <msub><mi>P</mi><mrow><mi>o</mi><mi>r</mi><mi>t</mi></mrow></msub>
                  <mo>+</mo>
                  <msub><mi>P</mi><mrow><mi>a</mi><mi>t</mi><mi>m</mi></mrow></msub>
                  <mspace width="1em"/>
                  <mo stretchy="false">(</mo>
                  <msub><mi>P</mi><mrow><mi>a</mi><mi>t</mi><mi>m</mi></mrow></msub>
                  <mo>≈</mo>
                  <mn>1.013</mn>
                  <mtext> bar</mtext>
                  <mo>=</mo>
                  <mn>101.325</mn>
                  <mtext> kPa</mtext>
                  <mo stretchy="false">)</mo>
                </mrow>
              </math>
            </div>
          </div>

          <!-- Yuk-porshenli manometr -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>⚖️</span> 2-Formula: Yuk-porshenli manometr (Etalon MP-60)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <msub><mi>P</mi><mrow><mi>e</mi><mi>t</mi></mrow></msub>
                  <mo>=</mo>
                  <mfrac>
                    <mrow>
                      <mo stretchy="false">(</mo>
                      <msub><mi>M</mi><mrow><mi>p</mi><mi>o</mi><mi>r</mi><mi>s</mi><mi>h</mi><mi>e</mi><mi>n</mi></mrow></msub>
                      <mo>+</mo>
                      <mo>∑</mo>
                      <msub><mi>m</mi><mrow><mi>y</mi><mi>u</mi><mi>k</mi></mrow></msub>
                      <mo stretchy="false">)</mo>
                      <mo>·</mo>
                      <mi>g</mi>
                    </mrow>
                    <msub><mi>F</mi><mrow><mi>e</mi><mi>f</mi><mi>f</mi></mrow></msub>
                  </mfrac>
                </mrow>
              </math>
            </div>
          </div>

          <!-- Gisterezis va keltirilgan xato -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>📈</span> 3-Formula: Gisterezis (variatsiya) va keltirilgan xatolik tekshiruvi (ГОСТ 2405-88)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>h</mi>
                  <mo>=</mo>
                  <mo>|</mo>
                  <msub><mi>P</mi><mrow><mi>t</mi><mi>o</mi><mo>'</mo><mi>g</mi><mo>'</mo><mi>r</mi><mi>i</mi></mrow></msub>
                  <mo>−</mo>
                  <msub><mi>P</mi><mrow><mi>t</mi><mi>e</mi><mi>s</mi><mi>k</mi><mi>a</mi><mi>r</mi><mi>i</mi></mrow></msub>
                  <mo>|</mo>
                  <mspace width="1.5em"/>
                  <mtext>va</mtext>
                  <mspace width="1.5em"/>
                  <mi>γ</mi>
                  <mo>=</mo>
                  <mfrac>
                    <mrow>
                      <mo>|</mo>
                      <mi>Δ</mi>
                      <msub><mi>P</mi><mrow><mi>m</mi><mi>a</mi><mi>x</mi></mrow></msub>
                      <mo>|</mo>
                    </mrow>
                    <msub><mi>P</mi><mrow><mi>s</mi><mi>h</mi><mi>k</mi><mi>a</mi><mi>l</mi><mi>a</mi></mrow></msub>
                  </mfrac>
                  <mo>·</mo>
                  <mn>100</mn>
                  <mo>%</mo>
                  <mo>≤</mo>
                  <msub><mi>K</mi><mrow><mi>s</mi><mi>i</mi><mi>n</mi><mi>f</mi></mrow></msub>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>💡 Davlat metrologiya talabi:</strong> 1.0 aniqlik sinfidagi manometrda o'lchangan eng katta keltirilgan xatolik <span class="formula-example-val">γ ≤ 1.0%</span> va variatsiya <span class="formula-example-val">h ≤ 1.0%</span> bo'lishi shart, aks holda asbob yaroqsiz hisoblanadi.
            </div>
          </div>
        </div>
      `;

    case 7:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 O'zgaruvchan bosim farqi bo'yicha sarf formulalari (ГОСТ 8.586.1..5-2005):
          </h3>

          <!-- Sarf formulasi -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>💧</span> 1-Formula: Siqish qurilmasi orqali suyuqlik sarfini hisoblash
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>Q</mi>
                  <mo>=</mo>
                  <mi>α</mi>
                  <mo>·</mo>
                  <mi>ε</mi>
                  <mo>·</mo>
                  <msub><mi>A</mi><mn>0</mn></msub>
                  <mo>·</mo>
                  <msqrt>
                    <mfrac>
                      <mrow>
                        <mn>2</mn>
                        <mo>·</mo>
                        <mi>Δ</mi>
                        <mi>P</mi>
                      </mrow>
                      <mi>ρ</mi>
                    </mfrac>
                  </msqrt>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th>Belgi</th>
                  <th>Parametr nomi</th>
                  <th>Mazmuni va son qiymati</th>
                  <th>O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">Q</span></td>
                  <td>Hajmiy sarf</td>
                  <td>Quvurdan vaqt birligida oqib o'tayotgan suyuqlik hajmi</td>
                  <td><span class="formula-var-unit">m³/s yoki m³/soat</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">α</span></td>
                  <td>Sarf koeffitsiyenti</td>
                  <td>Diafragma uchun: 0.60–0.62; Soplo: 0.95–0.98; Venturi: 0.97–0.99</td>
                  <td><span class="formula-var-unit">O'lchovsiz</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">ε</span></td>
                  <td>Kengayish koeffitsiyenti</td>
                  <td>Siqilmaydigan suyuqliklar (suv) uchun ε = 1.00</td>
                  <td><span class="formula-var-unit">O'lchovsiz</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">A₀</span></td>
                  <td>Teshik ko'ndalang yuzi</td>
                  <td>A₀ = (π · d²) / 4 (m²)</td>
                  <td><span class="formula-var-unit">m²</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">ΔP</span></td>
                  <td>Differensial bosim tushishi</td>
                  <td>Toraytiruvchi to'siqdan oldingi va keyingi bosimlar farqi</td>
                  <td><span class="formula-var-unit">Pa (Paskal)</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">ρ</span></td>
                  <td>Suyuqlik zichligi</td>
                  <td>Suv uchun: ρ = 1000 kg/m³</td>
                  <td><span class="formula-var-unit">kg/m³</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- U-nayli manometr -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🌡️</span> 2-Formula: Differensial U-nayli manometr ko'rsatishi
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>Δ</mi>
                  <mi>P</mi>
                  <mo>=</mo>
                  <mo stretchy="false">(</mo>
                  <msub><mi>ρ</mi><mrow><mi>s</mi><mi>i</mi><mi>m</mi><mi>o</mi><mi>b</mi></mrow></msub>
                  <mo>−</mo>
                  <msub><mi>ρ</mi><mrow><mi>s</mi><mi>u</mi><mi>v</mi></mrow></msub>
                  <mo stretchy="false">)</mo>
                  <mo>·</mo>
                  <mi>g</mi>
                  <mo>·</mo>
                  <mi>Δ</mi>
                  <mi>h</mi>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>💡 Kvadratik qonuniyat:</strong> Agar sarf <span class="formula-example-val">2 marta</span> oshsa, bosim farqi <span class="formula-example-val">ΔP = 2² = 4 marta</span> ortadi!
            </div>
          </div>
        </div>
      `;

    case 8:
      return `
        <div style="margin-top: 24px;">
          <h3 style="color: var(--primary); font-size: 1.15rem; border-bottom: 2px solid rgba(37,99,235,0.2); padding-bottom: 8px;">
            📐 Avtomatik rostlash qonunlari va PID regulyator formulalari:
          </h3>

          <!-- Xatolik -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>🎯</span> 1-Formula: Rostlash chetlanishi (Xatolik signali)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>e</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <mi>S</mi>
                  <mi>P</mi>
                  <mo>−</mo>
                  <mi>P</mi>
                  <mi>V</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                </mrow>
              </math>
            </div>
            <table class="formula-var-table">
              <thead>
                <tr>
                  <th>Belgi</th>
                  <th>Parametr nomi</th>
                  <th>Fizik va dasturiy ma'nosi</th>
                  <th>Birligi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="formula-var-sym">SP (Set Point)</span></td>
                  <td>Zadanie (Berilgan topshiriq)</td>
                  <td>Operator kiritgan maqsadli bosim yoki sath qiymati</td>
                  <td><span class="formula-var-unit">bar / %</span></td>
                </tr>
                <tr>
                  <td><span class="formula-var-sym">PV (Process Value)</span></td>
                  <td>O'lchanayotgan joriy qiymat</td>
                  <td>Datchikdan real vaqtda kelayotgan haqiqiy parametr</td>
                  <td><span class="formula-var-unit">bar / %</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rele qonuni -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>⚡</span> 2-Formula: 2-pozitsiyali releli boshqaruv qonuni (ТРМ1)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>u</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <mfenced close="" open="{">
                    <mtable columnalign="left">
                      <mtr>
                        <mtd><mn>100</mn><mo>%</mo><mspace width="0.5em"/><mtext>(Klapan to'liq ochiq),</mtext></mtd>
                        <mtd><mtext>agar </mtext><mi>P</mi><mi>V</mi><mo>≤</mo><mi>S</mi><mi>P</mi><mo>−</mo><mfrac><mi>Δ</mi><mn>2</mn></mfrac></mtd>
                      </mtr>
                      <mtr>
                        <mtd><mn>0</mn><mo>%</mo><mspace width="0.5em"/><mtext>(Klapan to'liq yopiq),</mtext></mtd>
                        <mtd><mtext>agar </mtext><mi>P</mi><mi>V</mi><mo>≥</mo><mi>S</mi><mi>P</mi><mo>+</mo><mfrac><mi>Δ</mi><mn>2</mn></mfrac></mtd>
                      </mtr>
                    </mtable>
                  </mfenced>
                </mrow>
              </math>
            </div>
          </div>

          <!-- PID qonuni -->
          <div class="math-formula-showcase">
            <div class="math-formula-title">
              <span>⚙️</span> 3-Formula: Uzluksiz PID rostlash qonuni (ТРМ210 / PLC)
            </div>
            <div class="formula-math-display">
              <math display="block">
                <mrow>
                  <mi>u</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>=</mo>
                  <msub><mi>K</mi><mi>p</mi></msub>
                  <mo>·</mo>
                  <mi>e</mi>
                  <mo stretchy="false">(</mo>
                  <mi>t</mi>
                  <mo stretchy="false">)</mo>
                  <mo>+</mo>
                  <mfrac>
                    <mn>1</mn>
                    <msub><mi>T</mi><mi>i</mi></msub>
                  </mfrac>
                  <mo>·</mo>
                  <msubsup>
                    <mo>∫</mo>
                    <mn>0</mn>
                    <mi>t</mi>
                  </msubsup>
                  <mi>e</mi>
                  <mo stretchy="false">(</mo>
                  <mi>τ</mi>
                  <mo stretchy="false">)</mo>
                  <mi>d</mi>
                  <mi>τ</mi>
                  <mo>+</mo>
                  <msub><mi>T</mi><mi>d</mi></msub>
                  <mo>·</mo>
                  <mfrac>
                    <mrow>
                      <mi>d</mi>
                      <mi>e</mi>
                      <mo stretchy="false">(</mo>
                      <mi>t</mi>
                      <mo stretchy="false">)</mo>
                    </mrow>
                    <mrow>
                      <mi>d</mi>
                      <mi>t</mi>
                    </mrow>
                  </mfrac>
                </mrow>
              </math>
            </div>
            <div class="formula-example-box">
              <strong>PID tarkibiy qismlari vazifasi:</strong><br/>
              • <strong>P-qism (Kp):</strong> Joriy xatolikka mutanosib tezkor zarba beradi.<br/>
              • <strong>I-qism (Ti):</strong> Yig'ilib qolgan statik qoldiq xatolikni mutlaq 0 ga tushiradi.<br/>
              • <strong>D-qism (Td):</strong> Xatolik o'zgarish tezligini oldindan payqab, ortiqcha oshib ketish (peresregulirovanie) ning oldini oladi.
            </div>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

function renderSampleDataTable(lab) {
  if (!lab.sampleData || lab.sampleData.length === 0) return '<p>Ma\'lumotlar kiritilmagan</p>';

  const headers = Object.keys(lab.sampleData[0]);
  const headerLabels = {
    t: "T, °C",
    e_mv: "TermoEYuK, mV",
    t_cold: "T0, °C",
    t_sec: "Vaqt, soniya",
    temp: "Harorat, °C",
    t_pech: "T_pech, °C",
    e_meas: "E(T, T0), mV",
    e_corr: "E(T, 0), mV",
    t_calc: "Hisoblangan T, °C",
    r_pt100: "Pt100, Om",
    r_cu50: "Cu50, Om",
    r_ntc: "NTC, Om",
    surface: "Sirt turi",
    eps: "Nurlanish ε",
    t_contact: "T_kontakt, °C",
    t_piro: "T_pirometr, °C",
    delta: "Farq ΔT, °C",
    p_berilgan: "P_berilgan, MPa",
    p_burdon: "P_manometr, MPa",
    i_out_ma: "I_chiqish, mA",
    error_pct: "Xatolik, %",
    q_m3h: "Sarf Q, m³/h",
    dp_kpa: "ΔP, kPa",
    sqrt_dp: "√ΔP",
    k_calc: "K_tarirlash",
    p_bar: "Bosim, bar",
    rele: "Rele holati",
    zadvishka: "Zadvishka",
    holat: "Tizim holati"
  };

  return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>№</th>
            ${headers.map(h => `<th>${headerLabels[h] || h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${lab.sampleData.map((row, i) => `
            <tr>
              <td><strong>${i + 1}</strong></td>
              ${headers.map(h => `<td>${row[h]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderReportDataTable(lab) {
  const customData = (studentReport.customTables && studentReport.customTables[lab.id] && studentReport.customTables[lab.id].length > 0)
    ? studentReport.customTables[lab.id]
    : (typeof liveExperimentData !== 'undefined' && liveExperimentData[lab.id] && liveExperimentData[lab.id].length > 0 ? liveExperimentData[lab.id] : null);

  if (customData && customData.length > 0) {
    const headers = Object.keys(customData[0]);
    return `
      <div style="margin-bottom: 8px;">
        <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 600;">
          🟢 Talabaning virtual stendda o'tkazgan shaxsiy o'lchovlari (${customData.length} ta nuqta)
        </span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>№</th>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${customData.map((row, i) => `
              <tr>
                <td><strong>${i + 1}</strong></td>
                ${headers.map(h => `<td>${row[h]}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  return renderSampleDataTable(lab);
}

function getLabSteps(labId) {
  const steps = {
    1: [
      "Laboratoriya stendining quvvatini yoqing (POWER ON)",
      "Termopara turini tanlang (masalan, TXK - Xromel-Kopel)",
      "Pechdagi issiq ulanish haroratini T1 = 100 °C ga ko'taring",
      "Voltmetrdagi termoEYuK (mV) qiymatini qayd eting",
      "'O'lchovni yozish' tugmasi bilan tajriba jadvaliga kiriting"
    ],
    2: [
      "Bimetall plastinka parametrlarini (L, metall juftligi) ko'zdan kechiring",
      "Termostatdagi suv haroratini bosqichma-bosqich oshiring",
      "Plastinka egilishi va soat indikatori strelkasi siljishini kuzating",
      "'Dinamik o'tish sinovi' tugmasini bosib, vaqt doimiysi τ ni aniqlang",
      "Olingan natijalarni jadvalga qayd qiling"
    ],
    3: [
      "Termoparani mufel pechi kamerasiga joylashtiring",
      "Sovuq ulanish kompensatsiyasini o'chirib va yoqib ko'ring (farqni tahlil qiling)",
      "Haroratni 50 °C dan 300 °C gacha o'zgartirib kalibrlash nuqtalarini oling",
      "Statik sezgirlik dE/dT qiymatini tekshiring",
      "Natijalarni hisobotga biriktiring"
    ],
    4: [
      "Datchik turini tanlang (Pt100 platina yoki Cu50 mis)",
      "Ulanish chizig'ini 2 simli qilib, kabel qarshiligi kiritadigan xatolikni ko'ring",
      "3 simli va 4 simli ulanishga o'tib, xatolik kompensatsiyasini tekshiring",
      "Ko'prik muvozanatlash potentsiometrini 0.00 V ga keltiring",
      "Qarshilik-harorat bog'liqligini jadvalga yozing"
    ],
    5: [
      "Sirt materialini tanlang (qoraytirilgan po'lat, keramika yoki yaltiroq mis)",
      "Pirometrning nishonga oluvchi qizil lazer nurini tekshiring",
      "Nurlanish koeffitsienti ε ni sirtga moslab sozlang",
      "Kontaktli va kontaktsiz ko'rsatkichlar farqini tahlil qiling",
      "O'lchov jadvalini to'ldiring"
    ],
    6: [
      "Gidravlik press orqali bosim bering (0 dan 6 bar gacha)",
      "U-simon simobli manometr balandligi Δh siljishini kuzating",
      "Burdon prujinasining to'g'rilanishi va strelka harakatini ko'ring",
      "4-20 mA elektr chiqish tokining to'g'ri proporsionalligini tekshiring",
      "Har bir bosim nuqtasini qayd eting"
    ],
    7: [
      "Aylanma nasos yordamida suv oqimi sarfini Q o'zgartiring",
      "Diafragma oldi va ketidagi differensial bosim ΔP o'zgarishini ko'ring",
      "Sarf Q va √ΔP orasidagi to'g'ri chiziqli bog'liqlikni tekshiring",
      "Reynolds soni Re bo'yicha turbulent oqim rejimini aniqlang",
      "Tarirlash koeffitsienti K ni hisoblang"
    ],
    8: [
      "TRM1 asbobida ustavka SP = 3.5 bar va gisterezis Δ = 0.5 bar o'rnating",
      "Nasosni ishga tushirib idishga suyuqlik haydashni boshlang",
      "Bosim 4.0 bar ga yetganda rele K1 ulanishi va zadvishka ochilishini kuzating",
      "Bosim 3.0 bar ga tushganda rele uzilishi va zadvishka yopilishini qayd qiling",
      "Kommutatsiya davri vaqtlarini jadvalga kiriting"
    ]
  };
  return steps[labId] || steps[1];
}

let benchPowerOn = true;

function toggleBenchPower() {
  benchPowerOn = !benchPowerOn;
  AudioFX.click();
  const btn = document.getElementById('bench-power-btn');
  const dot = document.getElementById('bench-power-dot');
  const statusTxt = document.getElementById('bench-power-status');
  if (btn) {
    btn.className = `power-toggle-btn ${benchPowerOn ? 'on' : ''}`;
    btn.innerHTML = benchPowerOn ? '⚡ POWER: ON' : '⭕ POWER: OFF';
  }
  if (dot) dot.className = `bench-status-dot ${benchPowerOn ? 'active' : ''}`;
  if (statusTxt) statusTxt.textContent = benchPowerOn ? 'Stend: Quvvat ulangan' : 'Stend: O\'chiq (Standby)';
  // Update simulator display
  const lab = laboratories.find(l => l.id === currentLabId);
  if (lab) initSpecificSimulator(lab.simulatorType);
}

function toggleStepCheck(labId, stepIdx, fromCb = false) {
  AudioFX.click();
  const item = document.getElementById(`step-item-${labId}-${stepIdx}`);
  const cb = document.getElementById(`step-cb-${labId}-${stepIdx}`);
  if (item && cb) {
    if (!fromCb) {
      cb.checked = !cb.checked;
    }
    item.classList.toggle('completed', cb.checked);
    if (cb.checked) AudioFX.success();
    if (!studentReport.checkedSteps) studentReport.checkedSteps = {};
    if (!studentReport.checkedSteps[labId]) studentReport.checkedSteps[labId] = {};
    studentReport.checkedSteps[labId][stepIdx] = cb.checked;
    saveStudentReport();
    updateChecklistProgress(labId);
  }
}

function updateChecklistProgress(labId) {
  const steps = getLabSteps(labId);
  let checkedCount = 0;
  steps.forEach((_, idx) => {
    const cb = document.getElementById(`step-cb-${labId}-${idx}`);
    if (cb && cb.checked) checkedCount++;
  });
  const pct = Math.round((checkedCount / steps.length) * 100);
  const fill = document.getElementById(`checklist-fill-${labId}`);
  const txt = document.getElementById(`checklist-pct-${labId}`);
  if (fill) fill.style.width = `${pct}%`;
  if (txt) txt.textContent = `${pct}% bajarildi (${checkedCount}/${steps.length})`;
}

// --- TALABANING LABORATORIYA DAFTARI VA HISOB-KITOBLAR FUNKSIYALARI ---
function getLabNotebookTemplate(labId, type) {
  const lab = laboratories.find(l => l.id === labId);
  const labName = lab ? lab.title : `Laboratoriya №${labId}`;
  
  if (type === 'formula') {
    switch(labId) {
      case 1:
        return `════════════════════════════════════════════════════════════════════════════════
📐 1-LABORATORIYA: TERMOELEKTRIK HODISALAR (ZEYEBEK, PELTYE, TOMSON)
════════════════════════════════════════════════════════════════════════════════

1. ZEYEBEK QONUNI (TermoEYuK hosil bo'lishi):
   ┌────────────────────────────────────────────────────────┐
   │   E(T₁, T₂) = α_AB · (T₁ - T₂)                         │
   └────────────────────────────────────────────────────────┘
   Parametrlar izohi va o'lchov birliklari:
   • E(T₁, T₂) ── Hosil bo'lgan TermoEYuK [mV]
   • α_AB      ── Differensial termosezgirlik koeffitsiyenti [mkV/°C]:
                  - TXA (K-tur): ~41.0 mkV/°C (0.041 mV/°C)
                  - TXK (L-tur): ~68.0 mkV/°C (0.068 mV/°C)
                  - TPP (S-tur): ~6.4 mkV/°C  (0.0064 mV/°C)
   • T₁        ── Pechdagi issiq ulanish harorati [°C]
   • T₂        ── Dyuar idishidagi sovuq tutashma harorati [°C] (Odatda 0 °C)

   Hisob-kitob misoli (TXA K-tur):
   E = 0.041 mV/°C · (150°C - 0°C) = 6.150 mV

2. PELTYE EFFEKTI (Kontaktda issiqlik yutilishi va muzlash):
   ┌────────────────────────────────────────────────────────┐
   │   Q_P = Π_AB · I · t = (α_AB · T) · I · t              │
   └────────────────────────────────────────────────────────┘
   • Q_P  ── Yutilgan (sovutish) yoki ajralgan Peltye issiqligi [Joul]
   • Π_AB ── Peltye koeffitsiyenti (Π = α · T) [Volt]
   • I    ── Yarimo'tkazgichdan o'tuvchi to'g'ri tok kuchi [Amper]
   • t    ── Vaqt davomiyligi [Soniya]

3. HIMOYALASH GILZASINING DINAMIK INERSIYASI:
   ┌────────────────────────────────────────────────────────┐
   │   T(t) = T₀ + (T_pech - T₀) · [1 - exp(-t / τ)]        │
   └────────────────────────────────────────────────────────┘
   • τ (tau) ── Issiqlik inersiyasi vaqt doimiysi [soniya]:
     - Yalang'och termopara: τ ≈ 0.8 s (tezkor)
     - SS316 po'lat gilzali: τ ≈ 6.0 s (sanoat standarti)
     - Cho'yan/keramika:     τ ≈ 25.0 s (katta dinamik kechikish)`;

      case 2:
        return `════════════════════════════════════════════════════════════════════════════════
📐 2-LABORATORIYA: BIMETALL TERMOMETRI VA SILJISH HISOBLARI (ГОСТ 10928-90)
════════════════════════════════════════════════════════════════════════════════

1. KONSOL BIMETALL PLASTINKA ERKIN UCHINING EGILISHI (s):
   ┌────────────────────────────────────────────────────────┐
   │   s = [3 · L² · (α₁ - α₂) · ΔT] / (2 · h)              │
   └────────────────────────────────────────────────────────┘
   Parametrlar izohi va o'lchov birliklari:
   • s         ── Bo'sh uchining egilish strelkasi (siljishi) [mm]
   • L         ── Plastinkaning erkin ishchi uzunligi [mm]
   • α₁        ── Aktiv qatlam (latun/mis) chiziqli kengayish koeffitsiyenti [K⁻¹]
                  (Latun L62: ~19·10⁻⁶ K⁻¹)
   • α₂        ── Passiv qatlam (invar 36N) kengayish koeffitsiyenti [K⁻¹]
                  (Invar: ~1.5·10⁻⁶ K⁻¹)
   • h         ── Bimetall tasmaning umumiy qalinligi [mm]
   • ΔT        ── Harorat o'zgarishi: ΔT = T_vanna - T₀ [°C]

   Hisob-kitob misoli:
   L = 100 mm, h = 1.0 mm, (α₁ - α₂) = 17.5·10⁻⁶ K⁻¹, ΔT = 60 °C:
   s = [3 · 100² · 17.5·10⁻⁶ · 60] / [2 · 1.0] = 31.5 / 20 = 1.575 mm

2. SANOAT SPIRAL SIFERBLATLI TERMOMETRI (WIKA BT):
   ┌────────────────────────────────────────────────────────┐
   │   φ = K_b · (L · ΔT) / h                               │
   └────────────────────────────────────────────────────────┘
   • φ ── Strelka milining burilish burchagi [Gradus] (0...270°)
   • K_b ── Spiralning burchak sezgirligi koeffitsiyenti`;

      case 3:
        return `════════════════════════════════════════════════════════════════════════════════
📐 3-LABORATORIYA: TERMOPARA KALIBRLASH VA SOVUQ TUTASHMA KORREKSIYASI
════════════════════════════════════════════════════════════════════════════════

1. SOVUQ TUTASHMA HARORATI T₀ ≠ 0 °C BO'LGANDA EYuK TUZATMASI (ГОСТ 8.585-2001):
   ┌────────────────────────────────────────────────────────┐
   │   E(T, 0) = E(T, T₀) + E(T₀, 0)                        │
   └────────────────────────────────────────────────────────┘
   Parametrlar izohi:
   • E(T, 0)   ── 0 °C ga keltirilgan to'liq EYuK qiymati [mV]
   • E(T, T₀)  ── Voltmetr yoki potensiometr ko'rsatgan o'lchov EYuK qiymati [mV]
   • E(T₀, 0)  ── Xona harorati (T₀) ga mos graduirovka jadvali tuzatmasi [mV]

   Hisoblash misoli (TXA K-tur):
   T₀ = 20 °C da o'lchangan E(T, 20°C) = 4.18 mV, tuzatma E(20°C, 0) = 0.81 mV:
   E(T, 0) = 4.18 + 0.81 = 4.99 mV ➔ Jadvaldan T_haqiqiy = 122.5 °C deb topiladi.

2. METROLOGIK XATOLIK VA ANIKLIK SINFI (ГОСТ 8.585):
   • Mutlaq xatolik:        ΔT = T_o'lchangan - T_haqiqiy [°C]
   • Keltirilgan xatolik:   γ = (|ΔT_max| / T_shkala) · 100% [%]
   • Yaroqlilik sharti:     γ ≤ γ_ruxsat`;

      case 4:
        return `════════════════════════════════════════════════════════════════════════════════
📐 4-LABORATORIYA: QARSHILIK TERMOMETRLARI (RTD) VA UITSON KO'PRIGI
════════════════════════════════════════════════════════════════════════════════

1. PLATINA DATCHIGI XARAKTERISTIKASI (Pt100, ГОСТ 6651-2009):
   ┌────────────────────────────────────────────────────────┐
   │   R(t) = R₀ · (1 + A·t + B·t²)                         │
   └────────────────────────────────────────────────────────┘
   • R₀ = 100.00 Ω (0 °C dagi nominal qarshilik)
   • A  = 3.9083 · 10⁻³ °C⁻¹
   • B  = -5.775 · 10⁻⁷ °C⁻²

2. MIS DATCHIGI XARAKTERISTIKASI (Cu50 / Cu100):
   ┌────────────────────────────────────────────────────────┐
   │   R(t) = R₀ · (1 + α·t)                                │
   └────────────────────────────────────────────────────────┘
   • α = 0.00428 °C⁻¹ (Yuqori chiziqli xarakteristika)

3. UITSON KO'PRIGI MUVOZANAT SHARTI:
   ┌────────────────────────────────────────────────────────┐
   │   R_x = (R₂ · R₃) / R₁                                 │
   └────────────────────────────────────────────────────────┘
   • 3-simli ulanish: Sim qarshiligi R_l ko'prikning qo'shni yelkalari
     orqali o'zaro ayirilib, o'lchovdan to'liq chiqarib tashlanadi!`;

      case 5:
        return `════════════════════════════════════════════════════════════════════════════════
📐 5-LABORATORIYA: PIROMETRIYA VA NURLANISH QONUNIYATLARI (ГОСТ 2372-95)
════════════════════════════════════════════════════════════════════════════════

1. STEFAN-BOLSMAN NURLANISH QONUNI:
   ┌────────────────────────────────────────────────────────┐
   │   E = ε · σ · T⁴                                       │
   └────────────────────────────────────────────────────────┘
   • E ── Nurlanish oqimi zichligi [Vt/m²]
   • ε ── Sirtning qoralik darajasi (0 < ε ≤ 1.0)
   • σ ── Stefan-Bolsman doimiysi: 5.67037 · 10⁻⁸ Vt/(m²·K⁴)
   • T ── Mutlaq harorat: T = t[°C] + 273.15 [Kelvin]

2. OPTIK YO'QOLUVCHI CHO'G'LANMA TOLALI PIROMETR (Promin / OPIR):
   ┌────────────────────────────────────────────────────────┐
   │   1/T_haq - 1/T_yor = [λ · ln(ε_λ)] / c₂               │
   │   T_haq = T_yor / [1 + (λ·T_yor / c₂) · ln(ε_λ)]       │
   └────────────────────────────────────────────────────────┘
   • T_yor ── Pirometr siferblatida ko'ringan yorqinlik harorati [K]
   • λ     ── Qizil yorug'lik filtri to'lqin uzunligi (0.65 mkm)
   • c₂    ── Ikkinchi nurlanish doimiysi: 0.014388 m·K`;

      case 6:
        return `════════════════════════════════════════════════════════════════════════════════
📐 6-LABORATORIYA: BOSIMNI ANIQLASH VA DAVLAT TEKSHIRUVI (ГОСТ 2405-88)
════════════════════════════════════════════════════════════════════════════════

1. MUTLAQ VA ORTIQCHA BOSIM BALANSI:
   ┌────────────────────────────────────────────────────────┐
   │   P_mutlaq = P_ort + P_atm                             │
   └────────────────────────────────────────────────────────┘
   • P_atm ≈ 1.013 bar = 101.325 kPa (Barometrik atmosfera bosimi)

2. YUK-PORSHENLI MANOMETR (Etalon MP-60):
   ┌────────────────────────────────────────────────────────┐
   │   P_et = [(M_porshen + Σm_yuk) · g] / F_eff            │
   └────────────────────────────────────────────────────────┘
   • M_porshen + Σm_yuk ── Porshen va disk yuklarining umumiy massasi [kg]
   • F_eff ── Porshenning samarali ko'ndalang kesim yuzi [m²]

3. GISTEREZIS (VARIATSIYA) VA KELTIRILGAN ASOSIY XATOLIK:
   ┌────────────────────────────────────────────────────────┐
   │   h = |P_to'g'ri - P_teskari| ≤ K_sinf                 │
   │   γ = (|ΔP_max| / P_shkala) · 100% ≤ K_sinf            │
   └────────────────────────────────────────────────────────┘
   • 1.0 aniqlik sinfidagi manometrda: γ ≤ 1.0% va h ≤ 1.0% bo'lishi shart!`;

      case 7:
        return `════════════════════════════════════════════════════════════════════════════════
📐 7-LABORATORIYA: SIQISH QURILMASI ORQALI SARF O'LCHASH (ГОСТ 8.586.1..5-2005)
════════════════════════════════════════════════════════════════════════════════

1. SIQISH QURILMASI HAJMIY SARF TENGLAMASI:
   ┌────────────────────────────────────────────────────────┐
   │   Q = α · ε · A₀ · √(2 · ΔP / ρ)                       │
   └────────────────────────────────────────────────────────┘
   Parametrlar izohi va o'lchov birliklari:
   • Q  ── Hajmiy sarf [m³/s yoki m³/soat]
   • α  ── Sarf koeffitsiyenti (Diafragma: ~0.61; Soplo: ~0.96; Venturi: ~0.98)
   • ε  ── Muhitning kengayish koeffitsiyenti (Suv uchun ε = 1.00)
   • A₀ ── Teshik yuzi: A₀ = (π · d²) / 4 [m²]
   • ΔP ── Siqish to'sig'idagi differensial bosim tushishi [Pa]
   • ρ  ── Suyuqlik zichligi (Suv uchun: 1000 kg/m³)

2. DIFFERENSIAL U-NAYLI MANOMETR KO'RSATISHI:
   ┌────────────────────────────────────────────────────────┐
   │   ΔP = (ρ_simob - ρ_suv) · g · Δh                      │
   │   ΔP = (13600 - 1000) · 9.81 · Δh = 123606 · Δh [Pa]   │
   └────────────────────────────────────────────────────────┘
   • Δh ── Simob ustunlari sathlarining farqi [metr]`;

      case 8:
        return `════════════════════════════════════════════════════════════════════════════════
📐 8-LABORATORIYA: AVTOMATIK ROSTLASH QONUNLARI (TRM1 VA PID REGULYATOR)
════════════════════════════════════════════════════════════════════════════════

1. ROSTLASH CHETLANISHI (XATOLIK):
   ┌────────────────────────────────────────────────────────┐
   │   e(t) = SP - PV(t)                                    │
   └────────────────────────────────────────────────────────┘
   • SP (Set Point) ── Berilgan topshiriq (Ustavka) qiymati [bar / metr]
   • PV (Process)   ── Datchik o'lchayotgan joriy haqiqiy qiymat [bar / metr]

2. 2-POZITSIYALI RELELI ROSTLASH (ТРМ1):
   ┌────────────────────────────────────────────────────────┐
   │   u(t) = 100% (Klapan ochiq), agar PV ≤ SP - Δ/2       │
   │   u(t) = 0%   (Klapan yopiq), agar PV ≥ SP + Δ/2       │
   └────────────────────────────────────────────────────────┘
   • Δ (Delta) ── Gisterezis (kommutatsiya o'lik zonasi)

3. UZLUKSIZ PID REGULYATOR TENGLAMASI (ТРМ210 / PLC):
   ┌────────────────────────────────────────────────────────┐
   │   u(t) = K_p · e(t) + (1/T_i)·∫ e(τ)dτ + T_d · [de/dt] │
   └────────────────────────────────────────────────────────┘
   • K_p (Proportsional) ── Joriy xatolikni tezkor pasaytiradi
   • T_i (Integral)       ── Statik qoldiq xatolikni mutlaq 0 ga tushiradi
   • T_d (Differensial)   ── Tebranishlar va ortiqcha sakrashni so'ndiradi`;

      default:
        return `=== 📐 NAZARIY FORMULALAR VA HISOB-KITOB ===\nLaboratoriya №${labId} tajriba natijalari tahlili.`;
    }
  }

  if (type === 'error') {
    return `=== 🎯 METROLOGIK XATOLIKLAR VA NOANIQLIKLAR TAHLILI ===
Mavzu: ${labName}
1. O'lchash natijalari bo'yicha hisoblash formulalari:
   - Mutlaq xatolik:
     ΔX = X_o'lchangan - X_haqiqiy (etalon)
   - Nisbiy xatolik:
     δ = (ΔX / X_haqiqiy) * 100%
   - Keltirilgan asosiy xatolik (shkalaga nisbatan):
     γ = (|ΔX_maksimal| / X_diapazon) * 100%

2. Asbobning pasport ma'lumotlari:
   - O'lchash diapazoni: X_min = ... , X_max = ...
   - Shkala diapazoni: X_diapazon = X_max - X_min
   - Normallashtirilgan aniqlik sinfi: K_sinf = ... % (masalan: 0.5; 1.0; 1.5)

3. Poverka (Davlat metrologik tekshiruvi) xulosasi:
   - Tajribada hisoblangan eng katta keltirilgan xatolik: γ_taj = ... %
   - Tekshiruv sharti: γ_taj <= K_sinf
   - XULOSA: O'lchash vositasi belgilangan talablarga to'liq javob beradi va texnologik jarayonlarda foydalanishga yaroqli deb hisoblanadi.`;
  }

  if (type === 'industry') {
    return `=== 🏭 SANOAT ISHLAB CHIQARISH TAHLILI VA MUHANDISLIK XULOSASI ===
Muassasa: Navoiy davlat konchilik va texnologiyalar universiteti (NDKTU)
Kafedra: "Avtomatlashtirish va boshqaruv"
Laboratoriya mavzusi: ${labName}

1. Sanoat korxonasidagi o'rni:
Ushbu o'lchash usuli va nazorat asboblari Navoiy kon-metallurgiya kombinati (NKMK) tizimidagi 2- va 3-Gidrometallurgiya zavodlari (GMZ-2, GMZ-3 oltin ajratib olish sexlari), "Navoiyazot" AJ kimyoviy reaktorlari va Navoiy IES bug'-gaz turbinalarida texnologik parametrlarni uzluksiz avtomatlashtirilgan nazorat qilishda asosiy vosita hisoblanadi.

2. Amaliy natijalar va samaradorlik:
- Virtual stendda o'tkazilgan sinovlar asbobning texnologik rejimlar o'zgarishiga nisbatan dinamik javob berish tezligini ko'rsatdi.
- O'lchash tizimida shovqin va tebranishlarning filtratsiyasi hamda kompensatsiya zanjirlari orqali metrologik barqarorlik ta'minlandi.
- Avtomatlashtirilgan SCADA va PLC (boshqaruvchi kontrollerlar) tizimlariga 4-20 mA unifikatsiyalangan signal hamda RS-485 / Modbus protokollari orqali uzatish samaradorligi yuqori.`;
  }

  return '';
}

function insertNotebookTemplate(labId, type) {
  AudioFX.click();
  const textarea = document.getElementById(`sim-notes-${labId}`);
  if (!textarea) return;
  const template = getLabNotebookTemplate(labId, type);
  if (!template) return;

  const currentVal = textarea.value.trim();
  if (currentVal.length > 0) {
    textarea.value = currentVal + '\n\n' + template;
  } else {
    textarea.value = template;
  }

  handleNotebookInput(labId, textarea.value);
  textarea.scrollTop = textarea.scrollHeight;

  const statusEl = document.getElementById(`notebook-status-${labId}`);
  if (statusEl) {
    statusEl.textContent = '✅ Shablondan qo\'shildi!';
    statusEl.className = 'badge badge-success';
    setTimeout(() => {
      statusEl.textContent = '💾 Saqlangan';
    }, 2000);
  }
}

function insertNotebookJournalData(labId) {
  AudioFX.click();
  const textarea = document.getElementById(`sim-notes-${labId}`);
  if (!textarea) return;

  const customData = (studentReport.customTables && studentReport.customTables[labId]) || [];
  if (!customData || customData.length === 0) {
    alert("Jurnalda hozircha o'lchov ma'lumotlari yo'q.\nAvval 'Jurnalga qayd qilish' tugmasini bosib bir nechta o'lchov nuqtalarini yozib oling.");
    return;
  }

  const keys = Object.keys(customData[0]);
  let tableText = `\n=== 📋 TAJRIBA JURNALI MA'LUMOTLARI (Lab №${labId}) ===\n`;
  tableText += `Nuqta | ` + keys.map(k => k.toUpperCase()).join(' | ') + '\n';
  tableText += `------|-` + keys.map(() => '--------').join('|-') + '\n';

  customData.forEach((row, idx) => {
    tableText += `${String(idx + 1).padEnd(5)} | ` + keys.map(k => String(row[k]).padEnd(8)).join(' | ') + '\n';
  });

  const currentVal = textarea.value.trim();
  textarea.value = currentVal ? (currentVal + '\n' + tableText) : tableText;
  handleNotebookInput(labId, textarea.value);
  textarea.scrollTop = textarea.scrollHeight;

  const statusEl = document.getElementById(`notebook-status-${labId}`);
  if (statusEl) {
    statusEl.textContent = '📋 Jurnal nusxalandi!';
    setTimeout(() => { statusEl.textContent = '💾 Saqlangan'; }, 2000);
  }
}

function clearNotebookNotes(labId) {
  AudioFX.click();
  const textarea = document.getElementById(`sim-notes-${labId}`);
  if (!textarea) return;
  if (!textarea.value.trim()) return;

  if (confirm("Laboratoriya daftari matnini tozalashni tasdiqlaysizmi?")) {
    textarea.value = '';
    handleNotebookInput(labId, '');
    const statusEl = document.getElementById(`notebook-status-${labId}`);
    if (statusEl) {
      statusEl.textContent = '🧹 Tozalandi';
      setTimeout(() => { statusEl.textContent = '💾 Saqlangan'; }, 2000);
    }
  }
}

function handleNotebookInput(labId, text) {
  if (!studentReport.conclusions) studentReport.conclusions = {};
  studentReport.conclusions[labId] = text;
  if (currentLabId === labId) {
    studentReport.conclusion = text;
  }
  saveStudentReport();
  updateNotebookCounter(labId, text);
}

function updateNotebookCounter(labId, text) {
  const counterEl = document.getElementById(`notebook-char-count-${labId}`);
  if (counterEl) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    counterEl.textContent = `Belgilar: ${chars} | So'zlar: ${words}`;
  }
}

function handleQuestionAnswerInput(labId, qIdx, answerText) {
  if (!studentReport.answers) studentReport.answers = {};
  if (!studentReport.answers[labId]) studentReport.answers[labId] = {};
  studentReport.answers[labId][qIdx] = answerText;
  saveStudentReport();

  const printAnsEl = document.getElementById(`print-ans-${labId}-${qIdx}`);
  if (printAnsEl) {
    printAnsEl.textContent = answerText || '____________________________________________________________________';
  }
}

function getQuestionHint(labId, qIdx) {
  const hints = {
    1: [
      "Kelvin munosabati: Peltye koeffitsiyenti va Zeyebek koeffitsiyenti orasida Π = α·T bog'liqlik mavjud. Tomson koeffitsiyenti uchun esa σ = T·(dα/dT). Ya'ni barcha termoelektrik effektlar umumiy termodinamik asosga ega.",
      "Peltye elementida tok p-turli yarimo'tkazgichdan n-turlisiga o'tganda elektronlar va kovaklar yuqori energiya sathiga o'tadi, natijada kristall panjaradan issiqlik yutilib, harorat keskin pasayadi (muzlash vujudga keladi).",
      "Himoya gilzasi (termovell) devori qalinlashganda yoki massasi oshganda issiqlik sig'imi ortadi va issiqlik o'tkazuvchanlikka qarshilik ko'payadi, natijada vaqt doimiysi τ (inersiya) ortadi.",
      "Sovuq ulanish harorati: 1) 0°C muz-suv termostatida; 2) Ko'prikli termokompensator zanjiri orqali; 3) Zamonaviy elektron datchiklarda kalla ichiga o'rnatilgan Pt100/NTC orqali dasturiy (ADuC / mikrokontroller) kompensatsiya qilinadi."
    ],
    2: [
      "Invar (36% Ni, 64% Fe) qotishmasining chiziqli termik kengayish koeffitsiyenti xona va o'rtacha haroratlarda deyarli nolga yaqin (α ≈ 1.5·10^-6 1/°C). Bu faol qatlam bilan maksimal kengayish farqini beradi.",
      "Bimetall plastinka egilish strelkasi f = 3·L^2·(α2 - α1)·ΔT / (2·h). Uzunlik L oshganda eguvchi moment qo'li va integrallangan egrilik L bo'ylab ikki karra ortadi, shuning uchun L^2 ga proporsional.",
      "Spiral (gelikoid) shakl cheklangan kichik datchik diametrida (masalan, Ø50 mm) juda uzun faol bimetall lentani (L = 150-300 mm) ixcham joylashtirish va to'g'ridan-to'g'ri o'qqa strelkani o'rnatish imkonini beradi.",
      "Uchqunni kamaytirish uchun kontaktlarga parallel ravishda RC-zanjiri (uchqun so'ndiruvchi kondensator va rezistor) yoki varistor ulanadi, shuningdek doimiy magnitli tez uzgichlar qo'llaniladi."
    ],
    3: [
      "TXA (K-tur: Xromel-Alyumel) oksidlovchi muhitda 1100-1200°C gacha chidamli, sezgirligi ~41 mkV/°C. TXK (L-tur: Xromel-Kopel) esa yuqori sezgirlikka ega (~68 mkV/°C), lekin yuqori haroratda barqarorligi pastroq (600-800°C).",
      "Kompensatsion simlar termopara elektrodlari bilan bir xil termoelektrik xususiyatga (termoEYuK ga) ega bo'lishi shart, aks holda simlar tutashgan joyda uchinchi parazit termoEYuK hosil bo'lib, o'lchovni buzadi.",
      "Uchinchi metall qonuniga ko'ra, agar termoelektr zanjiriga kiritilgan begona o'tkazgichning (masalan, mis simlar yoki lehim) ikki uchi bir xil haroratda bo'lsa, u zanjirning umumiy termoEYuK ga hech qanday ta'sir ko'rsatmaydi.",
      "Termopara kallasidagi Pt100 datchigi erkin uchlar (sovuq tutashma T0) haroratini aniq o'lchab, mikrokontrollerga E(T, 0) = E(T, T0) + E(T0, 0) dasturiy kompensatsiyasini hisoblash uchun beradi."
    ],
    4: [
      "Platina (Pt100, Pt1000) juda yuqori kimyoviy inertlikka, oksidlanmaslikka va keng diapazonga (-200...+850°C) ega. Mis (Cu50, Cu100) esa -50...+180°C oralig'ida qat'iy chiziqli xarakteristikaga ega, lekin arzonroq.",
      "3-simli ulanishda 1 ta sim tok manbaiga, qolgan 2 ta sim esa ko'prikning qarama-qarshi yelkalariga ulanadi. Sim qarshiliklari (R_l1 = R_l2) teng bo'lgani uchun ular ko'prik muvozanatida o'zaro ayirilib, xatolik nolga aylanadi.",
      "NTC termistorlarining B-koeffitsiyenti (material doimiysi, odatda 3000-4500 K) yarimo'tkazgichdagi taqiqlangan zona kengligi va haroratga bog'liq qarshilik egri chizig'ining qiyaligini (sezgirligini) belgilaydi.",
      "O'z-o'zidan qizishni bartaraf etish uchun datchikdan o'tuvchi o'lchov toki juda kichik me'yorda chegaralanadi (odatda platina uchun I <= 1 mA, mis uchun I <= 5 mA)."
    ],
    5: [
      "Absolyut qora jism — unga tushayotgan barcha to'lqin uzunlikdagi elektromagnit nurlanishni to'liq yutuvchi ideal fizik jism. Uning nurlanish (qoralik) koeffitsiyenti ε = 1.0 ga teng.",
      "Yaltiroq sayqallangan alyuminiyning nurlanish koeffitsiyenti juda past (ε ≈ 0.04 - 0.08) va u atrof-muhitdagi yot nurlanishlarni oyna kabi qaytaradi, bu esa IQ pirometrda katta manfiy xatolik keltirib chiqaradi.",
      "Fotometrik tenglik: pirometr okulyarida maxsus cho'g'lanma lampa tolasi ob'yektning yorug'lik maydoni fonida ko'rinmay qolgan (erib ketgan) paytda ikkala jismning spektral yorqinligi teng deb qabul qilinadi.",
      "Qizil yorug'lik filtri (λ = 0.65 mkm) inson ko'zi uchun tor spektral monoxromatik nurlanish hosil qilib, ko'zning sub'yektiv sezgirlik xatosini kamaytiradi va Plank/Vin qonunlariga aniq mos kelishni ta'minlaydi."
    ],
    6: [
      "Burdon nayi metallidagi ichki kristall elastik qoldiq deformatsiya, mikrosiljimlar va tishli uzatmaning (sektor-tribka) oraliq lyufti tufayli to'g'ri va teskari yurishda ko'rsatkichlar farqi — gisterezis (h) hosil bo'ladi.",
      "Yuk-porshenli manometrda (MP-60) porshen va silindr orasidagi suyuq moy qatlamidagi quruq va yarimquruq ishqalanish kuchini bartaraf etish va gidrodinamik moylash qatlamini hosil qilish uchun disklar sekin aylantirib turiladi.",
      "4-20 mA unifikatsiyalangan signali: 1) 'Tirik nol' (4 mA) tufayli sim uzilishini avariya sifatida darhol aniqlaydi; 2) Uzoq masofada (1 km gacha) sim qarshiligiga sezgir emas; 3) Sanoat elektromagnit shovqinlariga chidamli.",
      "1.0 aniqlik sinfi: asbob shkalasining butun o'lchash diapazoniga nisbatan keltirilgan maksimal ruxsat etilgan xatolik ±1.0% dan oshmasligini bildiradi (γ = ΔP_max / P_shkala * 100% <= 1.0%)."
    ],
    7: [
      "Venturi quvuridagi silliq kengayuvchi konus (diffuzor burchagi 7-15°) oqim kinetik energiyasini girdobsiz va ajralmas holda qayta potensial bosim energiyasiga aylantirib, tiklanmas bosim yo'qolishini 10-15% gacha pasaytiradi.",
      "Diafragmada bosim tushishi bevosita diskning old va orqa tekisligida maksimal va turg'un bo'ladi (burchak usulida kameraga ulanadi), bu esa sarf koeffitsiyenti α ning eng yuqori standart takrorlanuvchanligini ta'minlaydi.",
      "Diafragma oldidagi to'g'ri quvur uchastkasi (L >= 10-20 D) quvur burilishlari, zadvishkalar va nasoslar keltirib chiqargan oqim uyurmalari va nosimmetrikliklarini yo'qotib, standart simmetrik tezlik profilini tiklash uchun shart.",
      "Reynolds soni (Re = v·D / ν): agar Re < 2320 bo'lsa oqim qatlamli (laminar), Re > 4000 da esa turbulent bo'ladi. Diafragma bilan o'lchashda sarf koeffitsiyenti barqaror bo'lishi uchun oqim rivojlangan turbulent rejimda (yuqori Re) bo'lishi zarur."
    ],
    8: [
      "Gisterezis (Δ) nol bo'lsa, parametr berilgan qiymat atrofida ozgina tebranganda ham rele sekundiga o'nlab marta ulanib-uziladi ('chattering' effekti). Natijada kontaktlar yonadi va ijro mexanizmi muddatidan oldin ishdan chiqadi.",
      "Ikki pozitsiyali boshqaruvda chiqish faqat 0% yoki 100% bo'lib, parametr doimiy tebranib turadi (avtotebranish). PID boshqaruvda esa klapan oraliq (0-100%) holatlarda silliq to'xtab, parametrni xatosiz va tebranishsiz ushlab turadi.",
      "Integral vaqti Ti haddan tashqari kichik qo'yilsa, integral qism kichik xatolikni ham haddan ziyod kattalashtirib yuboradi, natijada tizimda so'nmas tebranishlar va rezonans (turg'unsizlik) kelib chiqadi.",
      "Avariya klapani texnologik parametr (bosim yoki sath) o'ta xavfli kritik nuqtadan oshib ketganda avtomatika ishlamay qolsa ham to'g'ridan-to'g'ri mexanik tarzda bosimni tushirib, apparat yorilishining oldini oladi."
    ]
  };

  if (hints[labId] && hints[labId][qIdx]) {
    return hints[labId][qIdx];
  }
  return "Fizik qonuniyatlar va texnologik tushunchalar asosida javob bering.";
}

// ==========================================
// SCADA LIVE REAL-TIME OSCILLOSCOPE & AUTO-RUN MANAGER
// ==========================================
const LiveSCADAManager = {
  animId: null,
  activeLabId: 1,
  history: [],
  maxPoints: 120,
  autoRunning: false,
  autoStep: 0,
  autoTimer: null,
  t: 0,

  start(labId) {
    this.stop();
    this.activeLabId = labId;
    this.history = [];
    this.autoRunning = false;
    this.autoStep = 0;
    
    // Boshlang'ich nuqtalar bilan to'ldirish
    for (let i = 0; i < this.maxPoints; i++) {
      this.history.push({ val: 0, time: i });
    }

    const loop = () => {
      this.tick();
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  },

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    this.autoRunning = false;
  },

  getTelemetry(labId) {
    if (!benchPowerOn) {
      return { val: 0, text: "Stend: Quvvat o'chiq (Standby 0.0V)" };
    }

    switch(labId) {
      case 1: {
        const vEl = document.getElementById('te-voltage');
        const t1El = document.getElementById('te-t1-val');
        const vText = vEl ? vEl.innerText.replace(/[^0-9.-]/g, '') : "0";
        const val = parseFloat(vText) || 0;
        const t1 = t1El ? t1El.innerText : "0";
        return { val, text: `T1 = ${t1} °C | Keithley 2000: E = ${val.toFixed(3)} mV` };
      }
      case 2: {
        const boxSp = document.getElementById('bm-box-spiral');
        if (boxSp && boxSp.style.display !== 'none') {
          const tEl = document.getElementById('bm-sp-temp-val');
          const angEl = document.getElementById('bm-sp-angle-val');
          const t = tEl ? parseFloat(tEl.innerText) || 0 : 0;
          const ang = angEl ? parseFloat(angEl.innerText) || 0 : 0;
          return { val: t, text: `Spiral Siferblat: T = ${t} °C | Burilish φ = ${ang.toFixed(1)}°` };
        }
        const sEl = document.getElementById('bm-deflection');
        const tEl = document.getElementById('bm-temp-val');
        const sText = sEl ? sEl.innerText.replace(/[^0-9.-]/g, '') : "0";
        const val = parseFloat(sText) || 0;
        const t = tEl ? tEl.innerText : "0";
        return { val, text: `Vanna: ${t} °C | ИЧ-10: s = ${val.toFixed(2)} mm` };
      }
      case 3: {
        const vEl = document.getElementById('tc-res-volt');
        const tEl = document.getElementById('tc-furnace-val');
        const vText = vEl ? vEl.innerText.replace(/[^0-9.-]/g, '') : "0";
        const val = parseFloat(vText) || 0;
        const t = tEl ? tEl.innerText : "0";
        return { val, text: `Pech: ${t} °C | V7-38: E = ${val.toFixed(3)} mV` };
      }
      case 4: {
        const rEl = document.getElementById('rt-res-val');
        const tEl = document.getElementById('rt-temp-val');
        const rText = rEl ? rEl.innerText.replace(/[^0-9.-]/g, '') : "100";
        const val = parseFloat(rText) || 100;
        const t = tEl ? tEl.innerText : "0";
        return { val: val - 100, text: `Muhit: ${t} °C | Ko'prik: R = ${val.toFixed(2)} Ω` };
      }
      case 5: {
        const boxOpt = document.getElementById('tm-box-optical');
        if (boxOpt && boxOpt.style.display !== 'none') {
          const filEl = document.getElementById('opt-fil-temp-disp');
          const furEl = document.getElementById('opt-furnace-disp');
          const filVal = filEl ? parseFloat(filEl.innerText) || 0 : 0;
          const furVal = furEl ? parseFloat(furEl.innerText) || 0 : 0;
          return { val: filVal, text: `Optik Promin: T_tola = ${filVal} °C | T_pech = ${furVal} °C` };
        }
        const pEl = document.getElementById('tm-piro-val');
        const cEl = document.getElementById('tm-contact-val');
        const pVal = pEl ? parseFloat(pEl.innerText) || 0 : 0;
        const cVal = cEl ? parseFloat(cEl.innerText) || 0 : 0;
        return { val: pVal, text: `IQ Pirometr: ${pVal.toFixed(1)} °C | Kontakt: ${cVal.toFixed(1)} °C` };
      }
      case 6: {
        const bEl = document.getElementById('burdon-txt');
        const maEl = document.getElementById('ps-svg-ma-txt');
        const bVal = bEl ? parseFloat(bEl.textContent || bEl.innerText) || 0 : 0;
        const ma = maEl ? (maEl.textContent || maEl.innerText || "4.00 mA").trim() : "4.00 mA";
        return { val: bVal, text: `Burdon: ${bVal.toFixed(2)} bar | Danfoss: ${ma}` };
      }
      case 7: {
        const qEl = document.getElementById('orf-q-val');
        const dpEl = document.getElementById('orf-dp-val');
        const qVal = qEl ? parseFloat(qEl.textContent || qEl.innerText) || 0 : 0;
        const dp = dpEl ? (dpEl.textContent || dpEl.innerText || "0 kPa").trim() : "0 kPa";
        return { val: qVal, text: `Sarf Q = ${qVal.toFixed(2)} m³/h | ΔP = ${dp}` };
      }
      case 8: {
        const pvEl = document.getElementById('trm-led-pv');
        const val = pvEl ? parseFloat(pvEl.textContent || pvEl.innerText) || 0 : 0;
        return { val, text: `ОВЕН ТРМ1: PV = ${val.toFixed(2)} bar` };
      }
      default:
        return { val: 0, text: "Normal ish holati" };
    }
  },

  tick() {
    this.t += 0.05;
    const telem = this.getTelemetry(this.activeLabId);
    
    // Tabiiy analog mikro-tebranish (elektronika tirikligi uchun)
    const jitter = benchPowerOn ? (Math.sin(this.t * 3.5) * 0.02 + (Math.random() - 0.5) * 0.015) : 0;
    const currentVal = telem.val + jitter;

    this.history.push({ val: currentVal, time: this.t });
    if (this.history.length > this.maxPoints) {
      this.history.shift();
    }

    const hud = document.getElementById(`scada-telemetry-${this.activeLabId}`);
    if (hud) {
      hud.textContent = telem.text + " | T=" + (this.t % 60).toFixed(1) + "s [LIVE 60 FPS]";
    }
  },

  render() {
    const canvas = document.getElementById(`scada-canvas-${this.activeLabId}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Fon tozalash (To'q qora-ko'k osillograf ekrani)
    ctx.fillStyle = '#020713';
    ctx.fillRect(0, 0, w, h);

    // Nozik retikula katakchalari (Cyan reticle grid)
    ctx.strokeStyle = '#0c243d';
    ctx.lineWidth = 1;
    const gridCols = 10;
    const gridRows = 6;
    for (let c = 0; c <= gridCols; c++) {
      const x = (w / gridCols) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let r = 0; r <= gridRows; r++) {
      const y = (h / gridRows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Markaziy o'q
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w, h * 0.7);
    ctx.stroke();

    if (this.history.length < 2) return;

    // Dinamik avto-masshtab
    let maxVal = -Infinity;
    let minVal = Infinity;
    this.history.forEach(pt => {
      if (pt.val > maxVal) maxVal = pt.val;
      if (pt.val < minVal) minVal = pt.val;
    });

    if (maxVal - minVal < 0.2) {
      maxVal += 0.5;
      minVal -= 0.5;
    }
    const range = (maxVal - minVal) * 1.3 || 1;

    // Fosforli yashil / yorqin osillogramma chizig'i
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff88';
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const dx = w / (this.maxPoints - 1);
    this.history.forEach((pt, idx) => {
      const x = idx * dx;
      const normalized = (pt.val - minVal) / range;
      const y = h - 25 - normalized * (h - 50);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Oldindagi yorqin elektron nur nuqtasi (Leading beam)
    const lastPt = this.history[this.history.length - 1];
    const lastX = (this.history.length - 1) * dx;
    const lastNorm = (lastPt.val - minVal) / range;
    const lastY = h - 25 - lastNorm * (h - 50);

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Pastki burchakdagi texnik shkala ma'lumoti
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.font = '10px Courier New, monospace';
    ctx.fillText(`CH-1 ANALOG INPUT | SPAN: ${(maxVal - minVal).toFixed(2)} | REFRESH: 60Hz SCADA`, 12, h - 8);
  }
};

// ==========================================
// AVTOMATIK JONLI TAJRIBA O'TKAZISH MOTOR (AUTO-DEMO)
// ==========================================
function toggleAutoExperiment(labId) {
  AudioFX.init();
  const btn = document.getElementById(`btn-auto-run-${labId}`);
  const statusEl = document.getElementById(`auto-run-status-${labId}`);

  if (LiveSCADAManager.autoRunning) {
    LiveSCADAManager.autoRunning = false;
    if (LiveSCADAManager.autoTimer) clearTimeout(LiveSCADAManager.autoTimer);
    if (btn) {
      btn.className = "btn-live-run";
      btn.innerHTML = "<span>▶️ JONLI AVTO-TAJRIBA (START DEMO)</span>";
    }
    if (statusEl) {
      statusEl.textContent = "● PAUZA (TO'XTATILDI)";
      statusEl.style.color = "#f59e0b";
      statusEl.style.background = "#451a03";
    }
    AudioFX.click();
    return;
  }

  LiveSCADAManager.autoRunning = true;
  LiveSCADAManager.autoStep = 0;
  if (btn) {
    btn.className = "btn-live-run running";
    btn.innerHTML = "<span>⏸ TO'XTATISH (PAUZA)</span>";
  }
  if (!benchPowerOn) toggleBenchPower();

  AudioFX.success();

  const runSteps = {
    1: [
      { t: 40, label: "Pech qizdirilmoqda: T1 = 40 °C..." },
      { t: 80, label: "Harorat ko'tarildi: T1 = 80 °C..." },
      { t: 120, label: "Muvozanatlandi: T1 = 120 °C..." },
      { t: 160, label: "Yakuniy yuqori nuqta: T1 = 160 °C..." }
    ],
    2: [
      { t: 30, label: "Termostat qizdirilmoqda: 30 °C..." },
      { t: 60, label: "Harorat 60 °C ga chiqdi (Egilish oshdi)..." },
      { t: 90, label: "Harorat 90 °C (Rele kontakti va chiroq sinovi)..." }
    ],
    3: [
      { t: 80, label: "Mufel pechi: 80 °C (Kompensatsiya tekshiruvi)..." },
      { t: 180, label: "Pech harorati: 180 °C..." },
      { t: 300, label: "Pech harorati: 300 °C (TermoEYuK qayd etildi)..." }
    ],
    4: [
      { t: 20, label: "Pt100 muhit harorati: 20 °C..." },
      { t: 60, label: "Pt100 muhit harorati: 60 °C (R333 avto-nolga)..." },
      { t: 100, label: "Pt100 muhit harorati: 100 °C (R = 138.5 Om)..." }
    ],
    5: [
      { t: 60, label: "Qora jism etaloni: 60 °C..." },
      { t: 120, label: "Po'lat sirt: 120 °C (Lazer nuri va optik konus)..." },
      { t: 160, label: "Keramika sirti: 160 °C (Emissivlik ta'siri)..." }
    ],
    6: [
      { p: 2.0, label: "Gidravlik bosim: 2.0 bar (Burdon elastik naycha)..." },
      { p: 4.0, label: "Gidravlik bosim: 4.0 bar (MP-60 disklari aylanmoqda)..." },
      { p: 6.0, label: "Gidravlik bosim: 6.0 bar (Danfoss 4-20mA datchigi)..." }
    ],
    7: [
      { v: 2.0, label: "Sarf Q = 2.0 m³/h (Laminar suv oqimi)..." },
      { v: 4.0, label: "Sarf Q = 4.0 m³/h (Piezometr bosim farqi)..." },
      { v: 6.0, label: "Sarf Q = 6.0 m³/h (Turbulent kuchli oqim)..." }
    ],
    8: [
      { sp: 3.5, label: "TRM1 Ustavkasi: SP = 3.5 bar, Kompressor bosim haydamoqda..." },
      { sp: 4.5, label: "Bosim chegaraga yetdi, Rele K1 va Zadvishka sinovi..." }
    ]
  };

  const stepsList = runSteps[labId] || runSteps[1];

  function executeStep(idx) {
    if (!LiveSCADAManager.autoRunning) return;
    if (idx >= stepsList.length) {
      LiveSCADAManager.autoRunning = false;
      if (btn) {
        btn.className = "btn-live-run";
        btn.innerHTML = "<span>▶️ JONLI AVTO-TAJRIBA (START DEMO)</span>";
      }
      if (statusEl) {
        statusEl.textContent = "🎉 TAJRIBA YAKUNLANDI (BARCHA NUQTALAR YOZILDI)";
        statusEl.style.color = "#34d399";
        statusEl.style.background = "#022c22";
      }
      AudioFX.success();
      return;
    }

    const st = stepsList[idx];
    if (statusEl) {
      statusEl.textContent = `⏳ [${idx + 1}/${stepsList.length}]: ${st.label}`;
      statusEl.style.color = "#38bdf8";
      statusEl.style.background = "#0c4a6e";
    }

    // Parametrlarni haqiqiy boshqaruv slayderlariga uzatish
    if (labId === 1) {
      const t1 = document.getElementById('te-t1');
      if (t1) { t1.value = st.t; t1.dispatchEvent(new Event('input')); }
    } else if (labId === 2) {
      const t = document.getElementById('bm-temp');
      if (t) { t.value = st.t; t.dispatchEvent(new Event('input')); }
    } else if (labId === 3) {
      const t = document.getElementById('tc-furnace');
      if (t) { t.value = st.t; t.dispatchEvent(new Event('input')); }
    } else if (labId === 4) {
      const t = document.getElementById('rt-temp');
      if (t) { t.value = st.t; t.dispatchEvent(new Event('input')); }
      const balBtn = document.getElementById('rt-auto-balance-btn');
      if (balBtn) balBtn.click();
    } else if (labId === 5) {
      const t = document.getElementById('tm-temp');
      if (t) { t.value = st.t; t.dispatchEvent(new Event('input')); }
    } else if (labId === 6) {
      const p = document.getElementById('ps-press');
      if (p) { p.value = st.p; p.dispatchEvent(new Event('input')); }
    } else if (labId === 7) {
      const q = document.getElementById('orf-q');
      if (q) { q.value = st.v; q.dispatchEvent(new Event('input')); }
    } else if (labId === 8) {
      trm1State.pressure = st.sp;
      const pv = document.getElementById('trm-led-pv');
      if (pv) pv.textContent = st.sp.toFixed(2).padStart(5, '0');
    }

    // 2.2 soniya kutib, ko'rsatkichni yozish va keyingi nuqtaga o'tish
    LiveSCADAManager.autoTimer = setTimeout(() => {
      if (!LiveSCADAManager.autoRunning) return;
      logCurrentMeasurement(labId);
      AudioFX.beep(800, 0.1);

      LiveSCADAManager.autoTimer = setTimeout(() => {
        executeStep(idx + 1);
      }, 700);
    }, 2200);
  }

  executeStep(0);
}

// 2. SIMULYATOR (SIMULATOR) TABI
function renderSimulatorTab(container, lab) {
  const steps = getLabSteps(lab.id);

  container.innerHTML = `
    <div class="simulator-wrapper">
      <div class="sim-header">
        <div>
          <h3>Virtual laboratoriya stendi: ${lab.title}</h3>
          <p>Parametrlarni o'zgartiring va o'lchash asboblari reaksiyasini hamda hisob-kitoblarni kuzating.</p>
        </div>
        <div class="sim-actions">
          <button class="btn btn-secondary btn-sm" onclick="resetSimulator(${lab.id})">🔄 Qayta o'rnatish</button>
        </div>
      </div>

      <!-- JONLI HARAKAT VA AVTO-TAJRIBA PANELI -->
      <div class="live-action-bar">
        <div class="live-action-left">
          <span class="live-pulse-dot"></span>
          <span class="live-action-title">JONLI TAJRIBA REJIMI:</span>
          <span id="auto-run-status-${lab.id}" class="badge" style="background:#022c22; color:#34d399; font-family:monospace; font-size:0.8rem;">● JONLI SIGNAL (60 FPS)</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="btn-auto-run-${lab.id}" class="btn-live-run" onclick="toggleAutoExperiment(${lab.id})">
            <span>▶️ JONLI AVTO-TAJRIBA (START DEMO)</span>
          </button>
        </div>
      </div>

      <!-- Sanoat stendi quvvat paneli -->
      <div class="bench-controls-bar">
        <div class="bench-status-badge">
          <span class="bench-status-dot active" id="bench-power-dot"></span>
          <span id="bench-power-status">Stend: Quvvat ulangan</span>
          <span style="opacity: 0.5;">|</span>
          <span>Tarmoq: 220V 50Hz • Aniqlik sinfi: 0.05</span>
        </div>
        <button class="power-toggle-btn on" id="bench-power-btn" onclick="toggleBenchPower()">
          ⚡ POWER: ON
        </button>
      </div>

      <div id="sim-dynamic-content" class="sim-dynamic-body">
        <!-- Maxsus simulyator komponenti yuklanadi -->
      </div>

      <!-- SCADA JONLI MONITOR (OSSILLOGRAF) -->
      <div class="scada-scope-box">
        <div class="scada-header">
          <div class="scada-title">
            <span>📈 SCADA JONLI MONITOR (OSSILLOGRAF)</span>
            <span style="font-size:0.7rem; color:#94a3b8;">[60 FPS • JONLI SIGNAL]</span>
          </div>
          <div class="scada-status" id="scada-telemetry-${lab.id}">
            INITIALIZING...
          </div>
        </div>
        <canvas id="scada-canvas-${lab.id}" class="scada-canvas" width="800" height="150"></canvas>
      </div>

      <!-- Real tajriba jurnali va Jonli grafik -->
      <div class="live-logger-container">
        <div class="logger-header">
          <h4>📝 Mening tajriba o'lchovlarim jurnali</h4>
          <div class="logger-btn-group">
            <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(${lab.id})">➕ Hozirgi ko'rsatkichni yozish</button>
            <button class="btn btn-secondary btn-sm" onclick="exportToCSV(${lab.id})">📥 Excel (CSV)</button>
            <button class="btn btn-secondary btn-sm" onclick="applyDataToReport(${lab.id})">📋 Hisobotga biriktirish</button>
            <button class="btn btn-secondary btn-sm" onclick="clearExperimentData(${lab.id})">🗑 Tozalash</button>
          </div>
        </div>

        <div id="live-table-area-${lab.id}"></div>
        <div class="stats-grid" id="stats-area-${lab.id}"></div>

        <div class="chart-canvas-container">
          <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>📈 Eksperimental nuqtalar egri chizig'i:</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">● Qayd etilgan nuqtalar vs Nazariy chiziq</span>
          </div>
          <canvas id="live-chart-${lab.id}" class="chart-canvas" width="600" height="200"></canvas>
        </div>
      </div>

      <!-- Qadam-baqadam tajriba yo'riqnomasi va vazifalar (Yig'iluvchi) -->
      <details class="lab-checklist-card" style="margin-top:1.5rem; cursor:pointer;" open>
        <summary class="checklist-title" style="user-select:none;">
          <span>📋 Qadam-baqadam tajriba vazifalari & yo'riqnomasi (Ochish/Yopish):</span>
          <span id="checklist-pct-${lab.id}" class="badge" style="background: rgba(37, 99, 235, 0.1); color: #2563eb;">0% bajarildi (0/${steps.length})</span>
        </summary>
        <div class="checklist-progress-bar" style="margin-top:10px;">
          <div id="checklist-fill-${lab.id}" class="checklist-progress-fill"></div>
        </div>
        <div class="step-items" style="margin-top:10px;">
          ${steps.map((st, idx) => {
            const isChecked = !!(studentReport.checkedSteps && studentReport.checkedSteps[lab.id] && studentReport.checkedSteps[lab.id][idx]);
            return `
            <div class="step-item ${isChecked ? 'completed' : ''}" id="step-item-${lab.id}-${idx}" onclick="toggleStepCheck(${lab.id}, ${idx}, false)">
              <input type="checkbox" class="step-checkbox" id="step-cb-${lab.id}-${idx}" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); toggleStepCheck(${lab.id}, ${idx}, true);" />
              <span><strong>${idx + 1}-qadam:</strong> ${st}</span>
            </div>
            `;
          }).join('')}
        </div>
      </details>

      <!-- TALABANING LABORATORIYA DAFTARI VA TAHLILIY HISOB-KITOBLARI (Yozish maydoni) -->
      <div class="card student-notebook-card" style="margin-top: 1.5rem;">
        <div class="notebook-header">
          <div class="notebook-title-box">
            <span class="notebook-icon">📝</span>
            <div>
              <h4 style="margin:0; font-size:1.05rem; color:var(--text-main); font-weight:700;">Talabaning laboratoriya daftari va tahliliy hisob-kitoblari</h4>
              <p style="margin:2px 0 0 0; font-size:0.82rem; color:var(--text-muted);">
                O'lchov natijalari, hisoblash formulalari, xatoliklar va tahliliy xulosalaringizni shu yerda yozing. Kiritilgan ma'lumotlar avtomatik saqlanadi va hisobot bo'limiga o'tkaziladi.
              </p>
            </div>
          </div>
          <div class="notebook-badge-box">
            <span id="notebook-status-${lab.id}" class="badge badge-success" style="font-size:0.75rem;">💾 Saqlangan</span>
          </div>
        </div>

        <div class="notebook-toolbar" style="margin-top: 12px; display:flex; flex-wrap:wrap; gap:8px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertNotebookTemplate(${lab.id}, 'formula')">
            <span>📐</span> Nazariy formula & Hisob
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertNotebookTemplate(${lab.id}, 'error')">
            <span>🎯</span> O'lchash xatoligi tahlili (GOST)
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertNotebookTemplate(${lab.id}, 'industry')">
            <span>🏭</span> Sanoat xulosasi (NDKTU/NKMK)
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertNotebookJournalData(${lab.id})">
            <span>📋</span> Jurnaldagi ma'lumotlarni nusxalash
          </button>
          <button type="button" class="btn btn-danger-soft btn-sm" onclick="clearNotebookNotes(${lab.id})">
            <span>🧹</span> Tozalash
          </button>
        </div>

        <div class="notebook-editor-wrap" style="margin-top: 12px; position:relative;">
          <textarea
            id="sim-notes-${lab.id}"
            class="form-textarea notebook-textarea"
            rows="8"
            placeholder="Laboratoriya №${lab.id} bo'yicha hisob-kitoblaringiz, formulalar va kuzatuvlaringizni shu yerga yozing..."
            oninput="handleNotebookInput(${lab.id}, this.value)"
          >${studentReport.conclusions && studentReport.conclusions[lab.id] ? studentReport.conclusions[lab.id] : (studentReport.conclusion || '')}</textarea>
          <div class="notebook-footer-info" style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:0.78rem; color:var(--text-muted);">
            <span id="notebook-char-count-${lab.id}">Belgilar: ${(studentReport.conclusions && studentReport.conclusions[lab.id] ? studentReport.conclusions[lab.id].length : (studentReport.conclusion ? studentReport.conclusion.length : 0))} | So'zlar: ${(studentReport.conclusions && studentReport.conclusions[lab.id] ? studentReport.conclusions[lab.id].trim().split(/\s+/).filter(Boolean).length : (studentReport.conclusion ? studentReport.conclusion.trim().split(/\s+/).filter(Boolean).length : 0))}</span>
            <span>⚡ Avtomatik saqlanmoqda (Lokal xotira)</span>
          </div>
        </div>
      </div>
    </div>
  `;

  initSpecificSimulator(lab.simulatorType);
  renderExperimentUI(lab.id);
  LiveSCADAManager.start(lab.id);
  updateChecklistProgress(lab.id);
}

function initSpecificSimulator(type) {
  const root = document.getElementById('sim-dynamic-content');
  if (!root) return;

  switch (type) {
    case 'thermoelectric':
      setupThermoelectricSim(root);
      break;
    case 'bimetal':
      setupBimetalSim(root);
      break;
    case 'thermocouple_study':
      setupThermocoupleStudySim(root);
      break;
    case 'resistance_thermometer':
      setupResistanceThermometerSim(root);
      break;
    case 'temp_methods':
      setupTempMethodsSim(root);
      break;
    case 'pressure_sensors':
      setupPressureSensorsSim(root);
      break;
    case 'orifice_calibration':
      setupOrificeSim(root);
      break;
    case 'trm1_controller':
      setupTRM1Sim(root);
      break;
    default:
      root.innerHTML = `<p>Simulyator tayyorlanmoqda...</p>`;
  }
}

// --- SIMULYATOR 1: TERMOELEKTRIK HODISALAR (ZEYEBEK, PELTYE, TOMSON) ---
function setupThermoelectricSim(container) {
  let autoScanInterval = null;

  container.innerHTML = `
    <div class="sim-grid-2">
      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🎛 Termoelektrik Stend Boshqaruvi</span>
          <span class="stand-sub-badge">ГОСТ 8.585 / NIST</span>
        </div>

        <div class="control-group">
          <label>O'rganilayotgan fizik hodisa va rejim:</label>
          <div class="toggle-group" style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
            <label class="btn btn-secondary btn-sm" style="text-align:center; font-size:0.75rem;">
              <input type="radio" name="te-mode" value="measure" checked /> ⚡ Zeyebek (EYuK)
            </label>
            <label class="btn btn-secondary btn-sm" style="text-align:center; font-size:0.75rem;">
              <input type="radio" name="te-mode" value="peltier" /> ❄️ Peltye (Sovutish)
            </label>
            <label class="btn btn-secondary btn-sm" style="text-align:center; font-size:0.75rem;">
              <input type="radio" name="te-mode" value="thomson" /> 🌡️ Tomson gradiyenti
            </label>
            <label class="btn btn-secondary btn-sm" style="text-align:center; font-size:0.75rem;">
              <input type="radio" name="te-mode" value="dynamic" /> ⏱ Dinamika (Gilza τ)
            </label>
          </div>
        </div>

        <!-- 1. ZEYEBEK BOSHQARUVI -->
        <div id="te-controls-measure">
          <div class="control-group">
            <label>Termopara turi:</label>
            <select id="te-type" class="form-input">
              <option value="k">TXA (K-tur) - Xromel-Alyumel (41.0 mkV/°C)</option>
              <option value="l" selected>TXK (L-tur) - Xromel-Kopel (68.0 mkV/°C)</option>
              <option value="s">TPP (S-tur) - Platina-Platinarodiy (10.0 mkV/°C)</option>
              <option value="j">TJ (J-tur) - Temir-Konstantan (52.5 mkV/°C)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Mufel pechi harorati (T1): <span id="te-t1-val" class="badge">120</span> °C</label>
            <input type="range" id="te-t1" min="0" max="600" value="120" class="slider" />
          </div>
          <div class="control-group">
            <label>Dyuar idishi erkin ulanish (T2): <span id="te-t2-val" class="badge">0</span> °C</label>
            <input type="range" id="te-t2" min="0" max="50" value="0" class="slider" />
          </div>
        </div>

        <!-- 2. PELTYE BOSHQARUVI -->
        <div id="te-controls-peltier" style="display:none;">
          <div class="control-group">
            <label>Peltye moduli oziqlanish toki (I): <span id="te-curr-val" class="badge">3.0</span> A</label>
            <input type="range" id="te-current" min="-5.0" max="5.0" step="0.2" value="3.0" class="slider" />
          </div>
          <div class="control-group">
            <label>Sovutish qovurg'asi (Radiator) holati: <strong>Alyuminiy radiator + Faol kuler (Kuler aylanmoqda)</strong></label>
          </div>
        </div>

        <!-- 3. TOMSON BOSHQARUVI -->
        <div id="te-controls-thomson" style="display:none;">
          <div class="control-group">
            <label>O'tkazgich metalli (Tomson koeffitsienti τ):</label>
            <select id="thomson-mat-sel" class="form-input">
              <option value="cu" selected>Mis (Cu): τ > 0 (Tok harorat ortishiga oqqanda issiqlik yutiladi)</option>
              <option value="fe">Temir (Fe): τ < 0 (Tok harorat ortishiga oqqanda issiqlik ajraladi)</option>
              <option value="pb">Qo'rg'oshin (Pb): τ ≈ 0 (Etalon metall, Tomson issiqligi nolga teng)</option>
            </select>
          </div>
          <div class="control-group">
            <label>O'tkazgichdan o'tayotgan tok (I): <span id="thomson-curr-val" class="badge">4.0</span> A</label>
            <input type="range" id="thomson-current" min="-10.0" max="10.0" step="0.5" value="4.0" class="slider" />
          </div>
          <div class="control-group">
            <label>Harorat gradiyenti (T1 - T2): <span id="thomson-grad-val" class="badge">130</span> °C</label>
            <input type="range" id="thomson-grad" min="20" max="300" value="130" class="slider" />
          </div>
        </div>

        <!-- 4. DINAMIKA & GILZA BOSHQARUVI -->
        <div id="te-controls-dynamic" style="display:none;">
          <div class="control-group">
            <label>Termopara himoya gilzasi (Thermowell) turi:</label>
            <select id="dyn-sheath-sel" class="form-input">
              <option value="bare" selected>1. Ochiq mikro-payvand (Gilzasiz) — τ ≈ 0.8 s (Super tezkor)</option>
              <option value="thin">2. Yupqa zanglamas po'lat gilza (SS316) — τ ≈ 6.0 s (Standart)</option>
              <option value="heavy">3. Qalin massiv quyma gilza (Pechlar) — τ ≈ 25.0 s (Inersion)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Pech harorati (Sakrash signali): <span id="dyn-target-val" class="badge">150</span> °C</label>
            <input type="range" id="dyn-target" min="50" max="400" value="150" class="slider" />
          </div>
          <button class="btn btn-secondary btn-sm" id="dyn-start-step-btn" style="width:100%; margin-top:6px;">⚡ Pechga botirish (Sakrash sinovi 20 ➔ T_pech)</button>
        </div>

        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn btn-secondary btn-sm" id="te-scan-btn" style="flex:1;">📈 Avtomatik skaner (0-500°C)</button>
          <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(1)" style="flex:1;">📝 Jurnalga yozish</button>
        </div>
      </div>

      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>📟 Keithley 2000 & Stend Ko'rinishi</span>
          <span class="stand-sub-badge">6½ Digit Precision</span>
        </div>

        <div class="digital-display-card" style="background:#050b14; border: 2px solid #1e293b; padding:10px;">
          <div class="display-label" style="color: #38bdf8; letter-spacing: 2px;" id="te-screen-title">KEITHLEY 2000 MULTIMETER (DC VOLTS)</div>
          <div class="display-value vfd-precision-display" id="te-voltage" style="color:#00ff88;">8.160 <span class="unit" style="color:#a7f3d0;">mV</span></div>
          <div class="display-sub" id="te-subtext">ΔT = 120 °C | TermoEYuK: E = 8.160 mV</div>
        </div>

        <!-- Vizual laboratoriya stendi SVG -->
        <div class="vis-box" id="te-vis" style="position:relative; background:#0f172a; border-radius:12px; margin-top:10px; overflow:hidden;">
          <svg viewBox="0 0 380 185" class="sim-svg">
            <!-- 1. ZEYEBEK REJIMI (Standart) -->
            <g id="te-svg-seebeck">
              <!-- Mufel pechi korpusi -->
              <rect x="15" y="25" width="95" height="135" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2.5" />
              <rect x="25" y="40" width="75" height="105" rx="4" fill="#090d16" />
              
              <!-- Pech dudburoni ustidagi konvektiv issiqlik tebranishi (Heat Shimmer) -->
              <g id="te-chimney-haze" class="heat-shimmer" style="opacity:0.6;">
                <path d="M 52 24 Q 57 14 52 4" stroke="#f97316" stroke-width="2" fill="none" opacity="0.6"/>
                <path d="M 62 24 Q 67 12 62 2" stroke="#ef4444" stroke-width="2.5" fill="none" opacity="0.8"/>
                <path d="M 72 24 Q 77 14 72 4" stroke="#f97316" stroke-width="2" fill="none" opacity="0.6"/>
              </g>

              <!-- Qizdirish spirali -->
              <path id="furnace-coil" d="M 30 50 Q 60 44 90 50 Q 60 56 30 63 Q 60 70 90 77 Q 60 84 30 91 Q 60 98 90 105 Q 60 112 30 119 Q 60 126 90 133" stroke="#f97316" stroke-width="2.5" fill="none" class="heat-glowing" />
              <text x="62" y="36" fill="#94a3b8" font-size="8" text-anchor="middle" font-weight="bold">PECH (T1)</text>

              <!-- Issiq ulanish nuqtasi -->
              <circle id="te-hot-junction" cx="62" cy="92" r="12" fill="#ef4444" class="heat-glowing" />
              <text x="62" y="96" fill="#fff" font-size="9" text-anchor="middle" font-weight="bold">T1</text>
              <text x="62" y="160" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="bold" id="svg-t1-txt">120 °C</text>

              <!-- A sim (Xromel - sariq) -->
              <path id="wire-a" d="M 62 84 Q 185 20 295 65" stroke="#f59e0b" stroke-width="3.5" fill="none" stroke-linecap="round" />
              <!-- A sim bo'ylab elektronlar harakati -->
              <path id="te-electron-a" d="M 62 84 Q 185 20 295 65" stroke="#ffffff" stroke-width="1.8" fill="none" class="electron-flow-active" stroke-linecap="round" opacity="0.9" />
              <text x="180" y="32" fill="#f59e0b" font-size="9" text-anchor="middle" font-weight="bold">A sim (+)</text>

              <!-- B sim (Kopel/Alyumel - moviy) -->
              <path id="wire-b" d="M 62 100 Q 185 160 295 115" stroke="#38bdf8" stroke-width="3.5" fill="none" stroke-linecap="round" />
              <!-- B sim bo'ylab elektronlar harakati -->
              <path id="te-electron-b" d="M 295 115 Q 185 160 62 100" stroke="#ffffff" stroke-width="1.8" fill="none" class="electron-flow-active" stroke-linecap="round" opacity="0.9" />
              <text x="180" y="150" fill="#38bdf8" font-size="9" text-anchor="middle" font-weight="bold">B sim (-)</text>

              <!-- Sovuq ulanish Dyuar idishi (Muzli termos) -->
              <rect x="280" y="40" width="85" height="100" rx="8" fill="#0369a1" opacity="0.3" stroke="#38bdf8" stroke-width="2" />
              <text x="322" y="36" fill="#38bdf8" font-size="8" text-anchor="middle" font-weight="bold">DYUAR IDISHI (T2)</text>
              <g class="ice-cube-bob">
                <text x="312" y="70" font-size="16" text-anchor="middle">🧊</text>
              </g>
              <g class="ice-cube-bob" style="animation-delay: -1.2s;">
                <text x="334" y="74" font-size="14" text-anchor="middle">🧊</text>
              </g>
              <text x="322" y="92" fill="#bae6fd" font-size="9" text-anchor="middle">Erib turgan muz</text>
              <circle cx="295" cy="65" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1.5" />
              <circle cx="295" cy="115" r="4.5" fill="#38bdf8" stroke="#fff" stroke-width="1.5" />
              <text x="322" y="160" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="bold" id="svg-t2-txt">T2: 0 °C</text>
            </g>

            <!-- 2. PELTYE MODULI (TEC1-12706) GRAFIKASI -->
            <g id="te-svg-peltier" style="display:none;" transform="translate(60, 20)">
              <!-- Alyuminiy radiator qovurg'alari -->
              <rect x="160" y="20" width="90" height="110" fill="#475569" rx="4" />
              <line x1="175" y1="20" x2="175" y2="130" stroke="#334155" stroke-width="3" />
              <line x1="190" y1="20" x2="190" y2="130" stroke="#334155" stroke-width="3" />
              <line x1="205" y1="20" x2="205" y2="130" stroke="#334155" stroke-width="3" />
              <line x1="220" y1="20" x2="220" y2="130" stroke="#334155" stroke-width="3" />
              <line x1="235" y1="20" x2="235" y2="130" stroke="#334155" stroke-width="3" />

              <!-- Kuler ventilyatori -->
              <g transform="translate(265, 75)">
                <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#0ea5e9" stroke-width="2" />
                <circle cx="0" cy="0" r="16" fill="none" stroke="#334155" stroke-dasharray="3,3" />
                <g id="peltier-fan-assembly" class="fan-spinning">
                  <path d="M 0 0 C 4 -12 12 -12 16 0 C 10 3 4 3 0 0" fill="#38bdf8" opacity="0.9" />
                  <path d="M 0 0 C 12 4 12 12 0 16 C -3 10 -3 4 0 0" fill="#38bdf8" opacity="0.9" />
                  <path d="M 0 0 C -4 12 -12 12 -16 0 C -10 -3 -4 -3 0 0" fill="#38bdf8" opacity="0.9" />
                  <path d="M 0 0 C -12 -4 -12 -12 0 -16 C 3 -10 3 -4 0 0" fill="#38bdf8" opacity="0.9" />
                  <circle cx="0" cy="0" r="4.5" fill="#f8fafc" stroke="#0284c7" stroke-width="1.5" />
                </g>
              </g>

              <!-- TEC1-12706 yarimo'tkazgich moduli -->
              <rect x="120" y="35" width="40" height="80" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="2" />
              <text x="140" y="78" fill="#1e293b" font-size="8" text-anchor="middle" font-weight="bold" transform="rotate(-90 140 78)">TEC1-12706</text>

              <!-- Sovuq tomon (Muz qoplami) -->
              <rect id="peltier-cold-plate" x="70" y="35" width="50" height="80" rx="3" fill="#0284c7" opacity="0.8" stroke="#38bdf8" stroke-width="2" />
              <!-- Qirov va muz kristallar qatlami -->
              <g id="peltier-frost-overlay" class="frost-crystal-active" style="display:none;">
                <rect x="70" y="35" width="50" height="80" rx="3" fill="#e0f2fe" opacity="0.45" />
                <text x="82" y="55" font-size="11">❄️</text>
                <text x="105" y="75" font-size="10">❄️</text>
                <text x="82" y="105" font-size="11">❄️</text>
              </g>
              <text x="95" y="70" font-size="18" text-anchor="middle" id="peltier-ice-icon">❄️</text>
              <text x="95" y="90" fill="#ffffff" font-size="9" text-anchor="middle" font-weight="bold" id="peltier-cold-temp">-5.2 °C</text>

              <!-- Oqim manbai simlari -->
              <path d="M 140 35 L 140 10 L 20 10" stroke="#ef4444" stroke-width="3" fill="none" />
              <path d="M 140 115 L 140 140 L 20 140" stroke="#0f172a" stroke-width="3" fill="none" />
              <text x="140" y="152" fill="#f8fafc" font-size="9" text-anchor="middle" id="peltier-i-txt">Tok I = +3.0 A</text>
            </g>

            <!-- 3. TOMSON EFFEKTI (Gradiyentli o'tkazgich) -->
            <g id="te-svg-thomson" style="display:none;" transform="translate(35, 25)">
              <defs>
                <linearGradient id="thomson-bar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ef4444" />
                  <stop offset="50%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#0284c7" />
                </linearGradient>
              </defs>
              <rect x="10" y="45" width="50" height="60" rx="4" fill="#ef4444" opacity="0.9" />
              <text x="35" y="80" fill="#fff" font-size="9" text-anchor="middle" font-weight="bold" id="thomson-t1-txt">T1: 150°C</text>
              <rect x="250" y="45" width="50" height="60" rx="4" fill="#0284c7" opacity="0.9" />
              <text x="275" y="80" fill="#fff" font-size="9" text-anchor="middle" font-weight="bold" id="thomson-t2-txt">T2: 20°C</text>
              <rect x="60" y="60" width="190" height="30" rx="3" fill="url(#thomson-bar-grad)" stroke="#475569" stroke-width="2" />
              <line x1="75" y1="75" x2="235" y2="75" stroke="#ffffff" stroke-width="2.5" class="electron-flow-active" />
              <text x="155" y="52" fill="#f8fafc" font-size="8.5" text-anchor="middle" font-weight="bold" id="thomson-mat-txt">Mis sterjen (τ > 0): Issiqlik yutilmoqda</text>
              <g id="thomson-heat-arrows" class="thomson-heat-arrow">
                <text x="125" y="115" font-size="14" text-anchor="middle">🔥</text>
                <text x="155" y="115" font-size="14" text-anchor="middle">🔥</text>
                <text x="185" y="115" font-size="14" text-anchor="middle">🔥</text>
              </g>
              <text x="155" y="132" fill="#cbd5e1" font-size="8" text-anchor="middle" id="thomson-heat-label">dQ_T = +15.6 J/s (Tomson issiqligi)</text>
            </g>

            <!-- 4. DINAMIKA VA HIMOYa GILZASI (Inersiya τ) -->
            <g id="te-svg-dynamic" style="display:none;" transform="translate(25, 20)">
              <rect x="20" y="20" width="115" height="120" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="2" />
              <rect x="25" y="25" width="105" height="110" rx="4" fill="#451a03" />
              <text x="77" y="45" fill="#fdba74" font-size="9" text-anchor="middle" font-weight="bold" id="dyn-svg-furnace-txt">PECH: 150 °C</text>
              <rect id="dyn-sheath-rect" x="67" y="50" width="20" height="75" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="2" />
              <line x1="77" y1="52" x2="77" y2="120" stroke="#f59e0b" stroke-width="2" />
              <circle cx="77" cy="118" r="4.5" fill="#ef4444" id="dyn-junction-pt" />
              <text x="77" y="142" fill="#f8fafc" font-size="8" text-anchor="middle" id="dyn-sheath-label">Gilzasiz (τ = 0.8s)</text>
              <rect x="150" y="20" width="175" height="120" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.5" />
              <text x="237" y="36" fill="#38bdf8" font-size="8" text-anchor="middle" font-weight="bold">O'TISH XARAKTERISTIKASI T(t)</text>
              <line x1="165" y1="125" x2="315" y2="125" stroke="#64748b" stroke-width="1.5" />
              <line x1="165" y1="45" x2="165" y2="125" stroke="#64748b" stroke-width="1.5" />
              <path id="dyn-response-path" d="M 165 125 Q 210 125 315 55" stroke="#10b981" stroke-width="2.5" fill="none" />
              <circle id="dyn-current-pt" cx="165" cy="125" r="4.5" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
              <text x="240" y="115" fill="#94a3b8" font-size="7.5" text-anchor="middle" id="dyn-time-readout">Vaqt t = 0.0s | T = 20.0 °C</text>
            </g>
          </svg>
        </div>

        <div class="calc-box" style="margin-top:10px;">
          <strong>Termodinamik hisob & Zeyebek formulasi:</strong>
          <div id="te-formula-calc" style="font-size:0.8rem; margin-top:2px;">
            E = e · (T1 - T2) = 0.068 mV/°C · (120 - 0)°C = 8.160 mV
          </div>
        </div>
      </div>
    </div>
  `;

  const teType = document.getElementById('te-type');
  const t1 = document.getElementById('te-t1');
  const t2 = document.getElementById('te-t2');
  const t1Val = document.getElementById('te-t1-val');
  const t2Val = document.getElementById('te-t2-val');
  const currentIn = document.getElementById('te-current');
  const currentVal = document.getElementById('te-curr-val');
  const voltage = document.getElementById('te-voltage');
  const subtext = document.getElementById('te-subtext');
  const formulaCalc = document.getElementById('te-formula-calc');
  const svgT1 = document.getElementById('svg-t1-txt');
  const svgT2 = document.getElementById('svg-t2-txt');
  const hotJunction = document.getElementById('te-hot-junction');
  const furnaceCoil = document.getElementById('furnace-coil');
  const modeRadios = document.getElementsByName('te-mode');
  const scanBtn = document.getElementById('te-scan-btn');

  const controlsMeasure = document.getElementById('te-controls-measure');
  const controlsPeltier = document.getElementById('te-controls-peltier');
  const controlsThomson = document.getElementById('te-controls-thomson');
  const controlsDynamic = document.getElementById('te-controls-dynamic');

  const svgSeebeck = document.getElementById('te-svg-seebeck');
  const svgPeltier = document.getElementById('te-svg-peltier');
  const svgThomson = document.getElementById('te-svg-thomson');
  const svgDynamic = document.getElementById('te-svg-dynamic');

  const peltierColdTemp = document.getElementById('peltier-cold-temp');
  const peltierITxt = document.getElementById('peltier-i-txt');
  const screenTitle = document.getElementById('te-screen-title');

  const thomsonMatSel = document.getElementById('thomson-mat-sel');
  const thomsonCurrent = document.getElementById('thomson-current');
  const thomsonCurrVal = document.getElementById('thomson-curr-val');
  const thomsonGrad = document.getElementById('thomson-grad');
  const thomsonGradVal = document.getElementById('thomson-grad-val');
  const thomsonT1Txt = document.getElementById('thomson-t1-txt');
  const thomsonT2Txt = document.getElementById('thomson-t2-txt');
  const thomsonMatTxt = document.getElementById('thomson-mat-txt');
  const thomsonHeatLabel = document.getElementById('thomson-heat-label');

  const dynSheathSel = document.getElementById('dyn-sheath-sel');
  const dynTarget = document.getElementById('dyn-target');
  const dynTargetVal = document.getElementById('dyn-target-val');
  const dynStartStepBtn = document.getElementById('dyn-start-step-btn');
  const dynSvgFurnaceTxt = document.getElementById('dyn-svg-furnace-txt');
  const dynSheathLabel = document.getElementById('dyn-sheath-label');
  const dynSheathRect = document.getElementById('dyn-sheath-rect');
  const dynCurrentPt = document.getElementById('dyn-current-pt');
  const dynTimeReadout = document.getElementById('dyn-time-readout');

  // Qo'shimcha tirik animatsiya elementlari
  const teElectronA = document.getElementById('te-electron-a');
  const teElectronB = document.getElementById('te-electron-b');
  const teChimneyHaze = document.getElementById('te-chimney-haze');
  const peltierFrostOverlay = document.getElementById('peltier-frost-overlay');
  const peltierFanAssembly = document.getElementById('peltier-fan-assembly');

  const coeffs = { k: 0.041, l: 0.068, s: 0.010, j: 0.0525 };
  const names = { k: "TXA (K)", l: "TXK (L)", s: "TPP (S)", j: "TJ (J)" };

  let dynamicTimer = null;
  let dynamicSimT = 20;

  function update() {
    AudioFX.click();
    const mode = document.querySelector('input[name="te-mode"]:checked')?.value || 'measure';

    // Show/hide sub-panels and SVGs
    controlsMeasure.style.display = mode === 'measure' ? 'block' : 'none';
    controlsPeltier.style.display = mode === 'peltier' ? 'block' : 'none';
    controlsThomson.style.display = mode === 'thomson' ? 'block' : 'none';
    controlsDynamic.style.display = mode === 'dynamic' ? 'block' : 'none';

    svgSeebeck.style.display = mode === 'measure' ? 'inline' : 'none';
    svgPeltier.style.display = mode === 'peltier' ? 'inline' : 'none';
    svgThomson.style.display = mode === 'thomson' ? 'inline' : 'none';
    svgDynamic.style.display = mode === 'dynamic' ? 'inline' : 'none';

    if (mode === 'measure') {
      screenTitle.textContent = "KEITHLEY 2000 MULTIMETER (DC VOLTS)";

      const type = teType.value;
      const v1 = parseFloat(t1.value);
      const v2 = parseFloat(t2.value);
      t1Val.textContent = v1;
      t2Val.textContent = v2;
      svgT1.textContent = `${v1} °C`;
      svgT2.textContent = `T2: ${v2} °C`;

      const deltaT = Math.max(0, v1 - v2);
      const eCoeff = coeffs[type];
      const jitter = (Math.random() - 0.5) * 0.005;
      const eVal = ((deltaT * eCoeff) + jitter).toFixed(3);

      voltage.innerHTML = `${eVal} <span class="unit">mV</span>`;
      subtext.textContent = `${names[type]} | ΔT = ${deltaT} °C | Sezgirlik e = ${(eCoeff * 1000).toFixed(1)} mkV/°C`;
      formulaCalc.textContent = `E = e · (T1 - T2) = ${eCoeff} mV/°C · (${v1} - ${v2})°C = ${(deltaT * eCoeff).toFixed(3)} mV`;

      // Issiqlik animatsiyalari
      if (v1 > 50) {
        hotJunction?.classList.add('heat-glowing');
        furnaceCoil?.classList.add('heat-glowing');
        furnaceCoil?.setAttribute('stroke', v1 > 300 ? '#ef4444' : '#f97316');
        if (teChimneyHaze) teChimneyHaze.style.opacity = Math.min(1.0, 0.3 + (v1 / 600)).toFixed(2);
      } else {
        hotJunction?.classList.remove('heat-glowing');
        furnaceCoil?.classList.remove('heat-glowing');
        furnaceCoil?.setAttribute('stroke', '#64748b');
        if (teChimneyHaze) teChimneyHaze.style.opacity = '0.1';
      }

      // Elektronlar oqimi dinamikasi
      if (deltaT > 0 && teElectronA && teElectronB) {
        teElectronA.style.display = 'inline';
        teElectronB.style.display = 'inline';
        const animSpeed = Math.max(0.12, 1.2 - (deltaT / 500)).toFixed(2) + 's';
        teElectronA.style.animationDuration = animSpeed;
        teElectronB.style.animationDuration = animSpeed;
      } else if (teElectronA && teElectronB) {
        teElectronA.style.display = 'none';
        teElectronB.style.display = 'none';
      }
    } else if (mode === 'peltier') {
      screenTitle.textContent = "AGILENT DC CURRENT SOURCE & CHILLER";

      const I = parseFloat(currentIn?.value || 3.0);
      currentVal.textContent = I.toFixed(1);
      if (peltierITxt) peltierITxt.textContent = `Oziqlanish toki I = ${I >= 0 ? '+' : ''}${I.toFixed(1)} A`;

      const tCold = 20 - (I * 8.5);
      const tHot = 20 + (Math.abs(I) * 6.0);
      if (peltierColdTemp) peltierColdTemp.textContent = `${tCold.toFixed(1)} °C`;

      voltage.innerHTML = `${Math.abs(I * 2.4).toFixed(2)} <span class="unit">V</span> <span style="font-size:0.9rem; color:#38bdf8;">(${I.toFixed(1)} A)</span>`;
      subtext.textContent = `Sovuq sirt: ${tCold.toFixed(1)} °C | Radiator sirti: ${tHot.toFixed(1)} °C | ΔT = ${(tHot - tCold).toFixed(1)} °C`;
      formulaCalc.textContent = `Q_peltier = Π · I · t = (α · T) · I · t (Kontakt orqali issiqlik pompalanmoqda)`;

      if (peltierFanAssembly) {
        if (Math.abs(I) < 0.1) {
          peltierFanAssembly.style.animationPlayState = 'paused';
        } else {
          peltierFanAssembly.style.animationPlayState = 'running';
          const fanSpeed = Math.max(0.08, 0.5 / Math.abs(I)).toFixed(2) + 's';
          peltierFanAssembly.style.animationDuration = fanSpeed;
        }
      }

      if (peltierFrostOverlay) {
        if (tCold < 0) {
          peltierFrostOverlay.style.display = 'inline';
          peltierFrostOverlay.style.opacity = Math.min(0.9, 0.3 + (Math.abs(tCold) / 30)).toFixed(2);
        } else {
          peltierFrostOverlay.style.display = 'none';
        }
      }
    } else if (mode === 'thomson') {
      screenTitle.textContent = "THOMSON EFFECT HEAT FLUX ANALYZER";

      const mat = thomsonMatSel.value;
      const I = parseFloat(thomsonCurrent.value);
      const deltaT = parseFloat(thomsonGrad.value);
      thomsonCurrVal.textContent = I.toFixed(1);
      thomsonGradVal.textContent = deltaT.toFixed(0);

      const t1ValNum = 20 + deltaT;
      if (thomsonT1Txt) thomsonT1Txt.textContent = `T1: ${t1ValNum}°C`;
      if (thomsonT2Txt) thomsonT2Txt.textContent = `T2: 20°C`;

      // Thomson koeffitsienti tau
      const tauMap = { cu: +1.5e-6, fe: -9.0e-6, pb: 0 };
      const tau = tauMap[mat];
      // dQ_T = tau * I * (dT/dx) * dt (J/s)
      const qThomson = tau * I * deltaT * 1e5;

      voltage.innerHTML = `dQ_T = ${(qThomson >= 0 ? '+' : '') + qThomson.toFixed(2)} <span class="unit">J/s</span>`;
      subtext.textContent = mat === 'cu'
        ? "Mis (Cu): τ > 0 | Harorat o'sishiga qarab tok oqqanda issiqlik yutiladi"
        : (mat === 'fe' ? "Temir (Fe): τ < 0 | Harorat o'sishiga qarab tok oqqanda issiqlik ajraladi" : "Qo'rg'oshin (Pb): τ ≈ 0 | Tomson issiqligi ajralmaydi (Etalon)");

      formulaCalc.textContent = `dQ_T = τ · I · (dT/dx) = (${tau.toExponential(1)}) · (${I} A) · (${deltaT} °C) = ${qThomson.toFixed(2)} J/s`;

      if (thomsonMatTxt) {
        thomsonMatTxt.textContent = mat === 'cu' ? "Mis (Cu, τ > 0): Issiqlik yutilishi" : (mat === 'fe' ? "Temir (Fe, τ < 0): Issiqlik ajralishi" : "Qo'rg'oshin (Pb): τ ≈ 0");
      }
      if (thomsonHeatLabel) {
        thomsonHeatLabel.textContent = `dQ_T = ${qThomson >= 0 ? '+' : ''}${qThomson.toFixed(2)} J/s (${qThomson >= 0 ? 'Endotermik yutilish' : 'Ekzotermik ajralish'})`;
      }
    } else if (mode === 'dynamic') {
      screenTitle.textContent = "THERMAL INERTIA & STEP RESPONSE ANALYZER";
      const sheath = dynSheathSel.value;
      const tTarget = parseFloat(dynTarget.value);
      dynTargetVal.textContent = tTarget;

      const tauMap = { bare: 0.8, thin: 6.0, heavy: 25.0 };
      const tau = tauMap[sheath];

      if (dynSvgFurnaceTxt) dynSvgFurnaceTxt.textContent = `PECH: ${tTarget} °C`;
      if (dynSheathLabel) dynSheathLabel.textContent = sheath === 'bare' ? "Gilzasiz (τ = 0.8s)" : (sheath === 'thin' ? "SS316 Gilza (τ = 6.0s)" : "Qalin gilza (τ = 25.0s)");

      if (dynSheathRect) {
        dynSheathRect.setAttribute('width', sheath === 'bare' ? 6 : (sheath === 'thin' ? 14 : 26));
        dynSheathRect.setAttribute('fill', sheath === 'bare' ? '#cbd5e1' : (sheath === 'thin' ? '#94a3b8' : '#64748b'));
      }

      voltage.innerHTML = `${dynamicSimT.toFixed(1)} <span class="unit">°C</span> <span style="font-size:0.9rem; color:#38bdf8;">(τ = ${tau}s)</span>`;
      subtext.textContent = `Vaqt doimiysi τ = ${tau} s | 95% muvozanat vaqti (3τ) ≈ ${(3 * tau).toFixed(1)} s`;
      formulaCalc.textContent = `T(t) = T0 + (T_pech - T0)·(1 - e^(-t/τ)) = 20 + (${tTarget} - 20)·(1 - e^(-t/${tau}))`;
    }
  }

  teType.onchange = update;
  t1.oninput = update;
  t2.oninput = update;
  if (currentIn) currentIn.oninput = update;
  if (thomsonMatSel) thomsonMatSel.onchange = update;
  if (thomsonCurrent) thomsonCurrent.oninput = update;
  if (thomsonGrad) thomsonGrad.oninput = update;
  if (dynSheathSel) dynSheathSel.onchange = update;
  if (dynTarget) dynTarget.oninput = update;
  modeRadios.forEach(r => r.onchange = update);

  if (dynStartStepBtn) {
    dynStartStepBtn.onclick = () => {
      AudioFX.click();
      const sheath = dynSheathSel.value;
      const tTarget = parseFloat(dynTarget.value);
      const tau = { bare: 0.8, thin: 6.0, heavy: 25.0 }[sheath];

      dynamicSimT = 20;
      let tSec = 0;
      if (dynamicTimer) clearInterval(dynamicTimer);

      const dt = 0.2;
      dynamicTimer = setInterval(() => {
        tSec += dt;
        dynamicSimT = 20 + (tTarget - 20) * (1 - Math.exp(-tSec / tau));
        
        voltage.innerHTML = `${dynamicSimT.toFixed(1)} <span class="unit">°C</span> <span style="font-size:0.9rem; color:#38bdf8;">(t = ${tSec.toFixed(1)}s)</span>`;
        if (dynTimeReadout) {
          dynTimeReadout.textContent = `Vaqt t = ${tSec.toFixed(1)}s | T = ${dynamicSimT.toFixed(1)} °C (${((dynamicSimT - 20) / (tTarget - 20) * 100).toFixed(0)}%)`;
        }

        // Point position on response graph
        if (dynCurrentPt) {
          const plotW = 150;
          const plotH = 70;
          const maxT = 30; // 30 sec span
          const cx = 165 + Math.min(plotW, (tSec / maxT) * plotW);
          const cy = 125 - Math.min(plotH, ((dynamicSimT - 20) / (tTarget - 20)) * plotH);
          dynCurrentPt.setAttribute('cx', cx.toFixed(1));
          dynCurrentPt.setAttribute('cy', cy.toFixed(1));
        }

        if (tSec >= 3.5 * tau || Math.abs(tTarget - dynamicSimT) < 0.5) {
          clearInterval(dynamicTimer);
          dynamicSimT = tTarget;
          voltage.innerHTML = `${dynamicSimT.toFixed(1)} <span class="unit">°C</span> <span style="font-size:0.9rem; color:#10b981;">(Muvozanatlandi ✅)</span>`;
          AudioFX.success();
          logCurrentMeasurement(1);
        }
      }, 100);
    };
  }

  teType.onchange = update;
  t1.oninput = update;
  t2.oninput = update;
  currentIn.oninput = update;
  modeRadios.forEach(r => r.onchange = update);

  scanBtn.onclick = () => {
    AudioFX.click();
    let curT = 0;
    const maxT = 500;
    if (autoScanInterval) clearInterval(autoScanInterval);
    autoScanInterval = setInterval(() => {
      curT += 50;
      t1.value = curT;
      update();
      logCurrentMeasurement(1);
      if (curT >= maxT) {
        clearInterval(autoScanInterval);
        AudioFX.success();
      }
    }, 250);
  };

  update();
}

// --- SIMULYATOR 2: BIMETALL TERMOMETRI (INSIYON, DINAMIKA VA RELE) ---
function setupBimetalSim(container) {
  let stepTimer = null;
  let spiralStepTimer = null;

  container.innerHTML = `
    <!-- Sub-rejimlar almashgichi -->
    <div class="sub-sim-tabs" style="display:flex; gap:8px; margin-bottom:14px; border-bottom:2px solid var(--border-color); padding-bottom:8px;">
      <button class="btn btn-sm btn-primary" id="bm-tab-cantilever">📐 1. Konsol Bimetall Plastinka (Vanna va ИЧ-10)</button>
      <button class="btn btn-sm btn-secondary" id="bm-tab-spiral">🌀 2. Sanoat Spiral Bimetall Termometri (WIKA / ТБ-1)</button>
    </div>

    <!-- 1-REJIM: KONSOL BIMETALL PLASTINKA (VANNA VA SOAT INDIKATORI) -->
    <div id="bm-box-cantilever">
      <div class="sim-grid-2">
        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🎛 Bimetall Stend Parametrlari</span>
            <span class="stand-sub-badge">GOST 10928</span>
          </div>

          <div class="control-group">
            <label>Vanna / Muhit harorati: <span id="bm-temp-val" class="badge">60</span> °C</label>
            <input type="range" id="bm-temp" min="20" max="120" value="60" class="slider" />
          </div>

          <div class="control-group">
            <label>Plastinka uzunligi (L): <span id="bm-l-val" class="badge">80</span> mm</label>
            <input type="range" id="bm-l" min="50" max="120" value="80" class="slider" />
          </div>

          <div class="control-group">
            <label>Plastinka qalinligi (h): <span id="bm-h-val" class="badge">1.0</span> mm</label>
            <input type="range" id="bm-h" min="0.5" max="2.0" step="0.1" value="1.0" class="slider" />
          </div>

          <div class="control-group">
            <label>Termobimetall juftligi:</label>
            <select id="bm-pair" class="form-input">
              <option value="latun_invar" selected>TB200/110: Latun (α=19e-6) + Invar (α=1.5e-6) [Keng tarqalgan]</option>
              <option value="mis_invar">TB140/90: Mis (α=17e-6) + Invar (α=1.5e-6)</option>
              <option value="polat_invar">TB100/70: Po'lat (α=12e-6) + Invar (α=1.5e-6)</option>
            </select>
          </div>

          <div class="control-group">
            <label>Issiqlik almashinuv muhiti (Vaqt doimiysi τ):</label>
            <select id="bm-medium" class="form-input">
              <option value="water" selected>Suyuqlikli vanna (Suv/moy) — τ ≈ 8-12 soniya (Tez)</option>
              <option value="air">Tinch havo muhiti — τ ≈ 45-60 soniya (Inersion sekin)</option>
            </select>
          </div>

          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-secondary btn-sm" id="bm-step-btn" style="flex:1;">⏱ O'tish jarayoni sinovi (20➔100°C)</button>
            <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(2)" style="flex:1;">📝 Jurnalga yozish</button>
          </div>
        </div>

        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🔬 Termostatik Vanna & Soat Indikatori (ИЧ-10)</span>
            <span class="stand-sub-badge">Kontaktli rele bilan</span>
          </div>

          <!-- SVG Vizualizatsiya -->
          <div class="vis-box" style="position:relative; background:#070d19; border-radius:12px; padding:6px; overflow:hidden;">
            <svg viewBox="0 0 380 200" class="sim-svg">
              <defs>
                <linearGradient id="bm-water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85" />
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.95" />
                </linearGradient>
                <filter id="bm-spark-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                </filter>
              </defs>

              <rect x="20" y="85" width="220" height="105" rx="6" fill="#1e293b" stroke="#334155" stroke-width="2.5" />
              <rect x="25" y="92" width="210" height="92" rx="4" fill="url(#bm-water-grad)" />

              <!-- Suv qaynash pufakchalari -->
              <circle cx="50" cy="165" r="2.5" fill="#e0f2fe" opacity="0.75" style="animation: bubbleFloat 1.2s infinite;" />
              <circle cx="95" cy="172" r="3.5" fill="#e0f2fe" opacity="0.75" style="animation: bubbleFloat 1.5s infinite 0.3s;" />
              <circle cx="140" cy="155" r="3" fill="#e0f2fe" opacity="0.75" style="animation: bubbleFloat 1.0s infinite 0.6s;" />
              <circle cx="185" cy="168" r="2" fill="#e0f2fe" opacity="0.75" style="animation: bubbleFloat 1.4s infinite 0.2s;" />

              <g class="heat-shimmer">
                <path d="M 40 86 Q 50 78 60 86 Q 70 94 80 86 M 120 86 Q 130 78 140 86" stroke="#bae6fd" stroke-width="1.8" fill="none" opacity="0.6"/>
              </g>

              <!-- Namunaviy simobli shisha termometr -->
              <g transform="translate(35, 25)">
                <rect x="0" y="0" width="8" height="135" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2" opacity="0.9" />
                <rect id="bm-thermo-column" x="2.5" y="60" width="3" height="70" fill="#ef4444" rx="1.5" />
                <circle cx="4" cy="133" r="5.5" fill="#ef4444" />
                <line x1="0" y1="30" x2="4" y2="30" stroke="#64748b" stroke-width="0.8" />
                <line x1="0" y1="55" x2="4" y2="55" stroke="#64748b" stroke-width="0.8" />
                <line x1="0" y1="80" x2="4" y2="80" stroke="#64748b" stroke-width="0.8" />
                <text x="14" y="32" fill="#94a3b8" font-size="7">100°C</text>
                <text x="14" y="82" fill="#94a3b8" font-size="7">20°C</text>
              </g>

              <!-- Qizdiruvchi TEN spiral -->
              <path d="M 30 178 L 45 178 Q 50 170 55 178 Q 60 186 65 178 Q 70 170 75 178 Q 80 186 85 178 L 115 178" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
              <text x="75" y="192" fill="#fdba74" font-size="7" font-weight="bold" text-anchor="middle">TEN Qizdirgich</text>

              <!-- Konsol tirgovuch ustuni -->
              <rect x="75" y="55" width="22" height="75" rx="2" fill="#475569" stroke="#334155" stroke-width="2" />
              <circle cx="86" cy="85" r="3.5" fill="#94a3b8" stroke="#1e293b" />
              <circle cx="86" cy="105" r="3.5" fill="#94a3b8" stroke="#1e293b" />

              <!-- Bimetall plastinka -->
              <path id="bm-plate-active" d="M 97 91 L 185 91" fill="none" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round" />
              <path id="bm-plate-passive" d="M 97 95.5 L 185 95.5" fill="none" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round" />
              <circle id="bm-plate-tip" cx="185" cy="93" r="3.5" fill="#38bdf8" />

              <!-- Soat indikatori (ИЧ-10) zondi -->
              <line id="bm-indicator-rod" x1="185" y1="42" x2="185" y2="91" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" />
              <circle cx="185" cy="42" r="3" fill="#64748b" />

              <!-- Soat indikatori korpusi -->
              <g transform="translate(185, 26)">
                <circle cx="0" cy="0" r="22" fill="#f8fafc" stroke="#334155" stroke-width="2.5" />
                <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" />
                <line x1="0" y1="-18" x2="0" y2="-13" stroke="#0f172a" stroke-width="1.2" />
                <line x1="18" y1="0" x2="13" y2="0" stroke="#0f172a" stroke-width="1.2" />
                <line x1="0" y1="18" x2="0" y2="13" stroke="#0f172a" stroke-width="1.2" />
                <line x1="-18" y1="0" x2="-13" y2="0" stroke="#0f172a" stroke-width="1.2" />
                <text x="0" y="-8" fill="#64748b" font-size="6" text-anchor="middle" font-weight="bold">ИЧ-10</text>
                <text x="0" y="11" fill="#64748b" font-size="5" text-anchor="middle">0.01 mm</text>
                <line id="bm-dial-needle" class="physics-spring-needle" x1="0" y1="0" x2="0" y2="-14" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round" />
                <circle cx="0" cy="0" r="2" fill="#0f172a" />
              </g>

              <!-- Sozlangan kontakt vinti -->
              <g transform="translate(185, 125)">
                <rect x="-4" y="0" width="8" height="22" rx="1.5" fill="#f59e0b" stroke="#b45309" stroke-width="1" />
                <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
                <line x1="-8" y1="22" x2="8" y2="22" stroke="#64748b" stroke-width="2" />
                <text x="14" y="12" fill="#fbbf24" font-size="6.5">Kontakt vinti</text>
              </g>

              <g id="bm-contact-spark" style="display:none;">
                <circle cx="185" cy="123" r="6" fill="#38bdf8" filter="url(#bm-spark-glow)" opacity="0.8" />
                <circle cx="185" cy="123" r="2.5" fill="#ffffff" />
              </g>

              <!-- Elektromagnit Rele va Signal Lampasi -->
              <g transform="translate(265, 45)">
                <rect x="0" y="0" width="95" height="120" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2" />
                <text x="47" y="18" fill="#f8fafc" font-size="8.5" font-weight="bold" text-anchor="middle">RELE BLOKI</text>
                <line x1="10" y1="24" x2="85" y2="24" stroke="#334155" stroke-width="1" />

                <circle id="bm-relay-lamp" cx="47" cy="50" r="16" fill="#334155" stroke="#475569" stroke-width="2" />
                <text id="bm-relay-lamp-txt" x="47" y="54" fill="#94a3b8" font-size="9" font-weight="bold" text-anchor="middle">OFF</text>
                <text x="47" y="78" fill="#cbd5e1" font-size="7.5" text-anchor="middle">Termostat holati</text>

                <rect x="15" y="88" width="65" height="20" rx="3" fill="#0f172a" />
                <text id="bm-relay-state-txt" x="47" y="102" fill="#94a3b8" font-size="8" font-weight="bold" text-anchor="middle">NORMAL</text>
              </g>

              <!-- Real vaqt ko'rsatkichi -->
              <text x="135" y="145" fill="#f8fafc" font-size="9" text-anchor="middle" font-weight="bold" id="bm-svg-temp-txt">T = 60.0 °C</text>
              <text x="135" y="160" fill="#38bdf8" font-size="10" text-anchor="middle" font-weight="bold" id="bm-svg-s-txt">s = 2.45 mm</text>
            </svg>
          </div>

          <div class="digital-display-card" style="margin-top:10px; padding:10px 14px;">
            <div class="display-label">Bimetall erkin uchining egilishi (s)</div>
            <div class="display-value" id="bm-deflection" style="font-size:1.8rem; color:#38bdf8;">
              2.45 <span class="unit">mm</span>
            </div>
            <div class="display-sub" id="bm-calc-sub">
              s = 1.5 · Δα · (L² / h) · ΔT = 2.45 mm
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-REJIM: SANOAT SPIRAL BIMETALL TERMOMETRI (WIKA / ТБ-1) -->
    <div id="bm-box-spiral" style="display:none;">
      <div class="sim-grid-2">
        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🌀 Sanoat Spiral Termometri (WIKA BT)</span>
            <span class="stand-sub-badge">0 ... 200 °C / Sinf: 1.0</span>
          </div>

          <div class="control-group">
            <label>Quvur / Moy vannasi harorati: <span id="bm-sp-temp-val" class="badge">80</span> °C</label>
            <input type="range" id="bm-sp-temp" min="0" max="200" step="1" value="80" class="slider" />
          </div>

          <div class="control-group">
            <label>Tezkor harorat tugmalari:</label>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px;">
              <button class="btn btn-secondary btn-sm" id="bm-sp-btn-20">20°C</button>
              <button class="btn btn-secondary btn-sm" id="bm-sp-btn-80">80°C</button>
              <button class="btn btn-secondary btn-sm" id="bm-sp-btn-140">140°C</button>
              <button class="btn btn-secondary btn-sm" id="bm-sp-btn-200">200°C</button>
            </div>
          </div>

          <div class="control-group">
            <label>Himoya gilzasi (Termovell / Vaqt doimiysi):</label>
            <select id="bm-sp-well" class="form-input">
              <option value="bare">Yalang'och spiral datchik (τ ≈ 1.5 s — tezkor)</option>
              <option value="ss316" selected>Zanglamas po'lat SS316 gilza (τ ≈ 9.5 s — sanoat standarti)</option>
              <option value="brass">Og'ir latun gilza moy bilan (τ ≈ 18.0 s — inersion)</option>
            </select>
          </div>

          <div class="control-group" style="background:var(--bg-main); padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:0.8rem;">
            <div>Spiral tasmasi uzunligi (L): <strong>280 mm</strong> (Arximed spirali)</div>
            <div>Spiral qalinligi (h): <strong>0.25 mm</strong> | Eni (b): <strong>3.0 mm</strong></div>
            <div>Burilish burchagi sezgirligi: <strong style="color:var(--primary);">K_φ = 1.35 °/°C</strong></div>
          </div>

          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-secondary btn-sm" id="bm-sp-step-btn" style="flex:1;">⏱ O'tish dinamikasi (20➔150°C)</button>
            <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(2)" style="flex:1;">📝 Jurnalga yozish</button>
          </div>

          <div class="calc-box" style="margin-top:10px;">
            <strong>Spiral bimetall burilish qonuni:</strong>
            <div style="font-size:0.8rem; margin-top:2px;" id="bm-sp-theory-txt">
              φ = K_φ · (L / h) · ΔT. To'g'ri konsol plastinka 280 mm bo'lsa ulkan korpus kerak bo'lardi; spiral shaklida o'ralishi natijasida u diametri atigi 10 mm bo'lgan ixcham gilzaga sig'adi va markaziy valni to'g'ridan-to'g'ri buradi!
            </div>
          </div>
        </div>

        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>📟 Spiral Naycha Kesimi va Siferblat Shkalasi</span>
            <span class="stand-sub-badge">WIKA A52 / ТБ-1 format</span>
          </div>

          <!-- Spiral Naycha va Siferblat SVG -->
          <div class="vis-box" style="position:relative; background:#070d19; border-radius:12px; padding:6px; overflow:hidden;">
            <svg viewBox="0 0 380 200" class="sim-svg">
              <defs>
                <radialGradient id="dial-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="85%" stop-color="#f1f5f9" />
                  <stop offset="100%" stop-color="#cbd5e1" />
                </radialGradient>
              </defs>

              <!-- 1. CHAPDA: HIMOYALANGAN GILZA VA SPIRAL KESIMI -->
              <g transform="translate(15, 20)">
                <!-- Quvur / Rezervuar devori -->
                <rect x="0" y="30" width="130" height="135" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2" />
                <rect x="5" y="35" width="120" height="125" rx="3" fill="#1e3a8a" opacity="0.3" />
                <text x="65" y="24" fill="#94a3b8" font-size="8" text-anchor="middle" font-weight="bold">Issiq muhit quvuri</text>

                <!-- Termovell / Gilza gardishi -->
                <rect x="45" y="20" width="40" height="15" rx="2" fill="#475569" stroke="#64748b" stroke-width="1.5" />
                <!-- Zanglamas gilza quvuri -->
                <rect x="53" y="35" width="24" height="115" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1.5" />

                <!-- Markaziy aylanuvchi val (Shaft) -->
                <line x1="65" y1="20" x2="65" y2="135" stroke="#e2e8f0" stroke-width="2.5" />

                <!-- Spiral Bimetall Prujina (Arximed spirali dinamik burilishi) -->
                <g id="bm-sp-coil-group" transform="translate(65, 85)">
                  <!-- 3 ta o'ramli spiralsimon bimetall tasma -->
                  <path id="bm-sp-coil-path" d="M 0 0 A 6 6 0 0 1 6 -4 A 10 10 0 0 1 0 -11 A 15 15 0 0 1 -14 0 A 19 19 0 0 1 0 18 A 22 22 0 0 1 20 0" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
                  <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
                </g>

                <text x="65" y="165" fill="#f8fafc" font-size="8" text-anchor="middle" font-weight="bold">Spiral gilza kesimi</text>
                <text x="65" y="177" fill="#fbbf24" font-size="7" text-anchor="middle">L = 280 mm spiral</text>
              </g>

              <!-- 2. O'NGDA: SANOAT SIFERBLAT SHKALASI (WIKA 0-200°C) -->
              <g transform="translate(250, 100)">
                <!-- Tashqi po'lat gardish -->
                <circle cx="0" cy="0" r="82" fill="#1e293b" stroke="#475569" stroke-width="5" />
                <circle cx="0" cy="0" r="76" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />

                <!-- Shkala markirovkasi (0, 20, 40, ... 200°C) -->
                <!-- 0°C (-135°), 50°C (-67.5°), 100°C (0°), 150°C (+67.5°), 200°C (+135°) -->
                <text x="-48" y="52" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">0</text>
                <text x="-58" y="0" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">40</text>
                <text x="-42" y="-46" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">80</text>
                <text x="0" y="-60" fill="#0f172a" font-size="9" font-weight="bold" text-anchor="middle">100</text>
                <text x="42" y="-46" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">120</text>
                <text x="58" y="0" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">160</text>
                <text x="48" y="52" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">200</text>

                <!-- Markaziy brend va o'lchov birligi -->
                <text x="0" y="-22" fill="#0284c7" font-size="8" font-weight="bold" text-anchor="middle">WIKA</text>
                <text x="0" y="-12" fill="#64748b" font-size="7" text-anchor="middle">BT-01 / KL 1.0</text>
                <text x="0" y="26" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">°C</text>

                <!-- Siferblat aylanuvchi qizil strelkasi -->
                <g id="bm-sp-needle-pivot" class="physics-spring-needle">
                  <line x1="0" y1="12" x2="0" y2="-62" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
                  <polygon points="0,-65 -4,-56 4,-56" fill="#ef4444" />
                  <circle cx="0" cy="0" r="5" fill="#0f172a" stroke="#fff" stroke-width="1.5" />
                </g>
              </g>

              <!-- Pastki texnik matn -->
              <text x="250" y="192" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" id="bm-sp-dial-readout">80.0 °C</text>
            </svg>
          </div>

          <div class="digital-display-card" style="margin-top:10px; padding:10px 14px;">
            <div class="display-label">Siferblat burilish burchagi (φ)</div>
            <div class="display-value" id="bm-sp-angle-val" style="font-size:1.8rem; color:#f59e0b;">
              108.0 <span class="unit">gradus</span>
            </div>
            <div class="display-sub" id="bm-sp-angle-sub">
              φ = K_φ · ΔT = 1.35 · 80°C = 108.0° (Siferblat masshtabi: 270° / 200°C)
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab tugmalari
  const tabCantBtn = document.getElementById('bm-tab-cantilever');
  const tabSpBtn = document.getElementById('bm-tab-spiral');
  const boxCant = document.getElementById('bm-box-cantilever');
  const boxSp = document.getElementById('bm-box-spiral');

  tabCantBtn.onclick = () => {
    AudioFX.click();
    tabCantBtn.className = 'btn btn-sm btn-primary';
    tabSpBtn.className = 'btn btn-sm btn-secondary';
    boxCant.style.display = 'block';
    boxSp.style.display = 'none';
  };

  tabSpBtn.onclick = () => {
    AudioFX.click();
    tabCantBtn.className = 'btn btn-sm btn-secondary';
    tabSpBtn.className = 'btn btn-sm btn-primary';
    boxCant.style.display = 'none';
    boxSp.style.display = 'block';
    updateSpiral();
  };

  // --- 1. KONSOL BIMETALL PLASTINKA LOGIKASI ---
  const tempIn = document.getElementById('bm-temp');
  const lIn = document.getElementById('bm-l');
  const hIn = document.getElementById('bm-h');
  const pairSel = document.getElementById('bm-pair');
  const medSel = document.getElementById('bm-medium');

  const tempVal = document.getElementById('bm-temp-val');
  const lVal = document.getElementById('bm-l-val');
  const hVal = document.getElementById('bm-h-val');
  const deflVal = document.getElementById('bm-deflection');
  const calcSub = document.getElementById('bm-calc-sub');

  const plateActive = document.getElementById('bm-plate-active');
  const platePassive = document.getElementById('bm-plate-passive');
  const plateTip = document.getElementById('bm-plate-tip');
  const thermoCol = document.getElementById('bm-thermo-column');
  const dialNeedle = document.getElementById('bm-dial-needle');
  const indicatorRod = document.getElementById('bm-indicator-rod');
  const contactSpark = document.getElementById('bm-contact-spark');
  const relayLamp = document.getElementById('bm-relay-lamp');
  const relayLampTxt = document.getElementById('bm-relay-lamp-txt');
  const relayStateTxt = document.getElementById('bm-relay-state-txt');
  const svgTempTxt = document.getElementById('bm-svg-temp-txt');
  const svgSTxt = document.getElementById('bm-svg-s-txt');

  const pairs = {
    latun_invar: { dAlpha: 17.5e-6, name: "Latun + Invar" },
    mis_invar: { dAlpha: 15.5e-6, name: "Mis + Invar" },
    polat_invar: { dAlpha: 10.5e-6, name: "Po'lat + Invar" }
  };

  function updateCantilever() {
    AudioFX.click();
    const T = parseFloat(tempIn.value);
    const L = parseFloat(lIn.value);
    const h = parseFloat(hIn.value);
    const pair = pairs[pairSel.value] || pairs.latun_invar;

    tempVal.textContent = T;
    lVal.textContent = L;
    hVal.textContent = h.toFixed(1);

    const deltaT = T - 20;
    const s = 1.5 * pair.dAlpha * (Math.pow(L, 2) / h) * deltaT;

    deflVal.innerHTML = `${s.toFixed(2)} <span class="unit">mm</span>`;
    calcSub.textContent = `s = 1.5 · ${(pair.dAlpha * 1e6).toFixed(1)}e-6 · (${L}² / ${h}) · ${deltaT}°C = ${s.toFixed(2)} mm`;

    if (svgTempTxt) svgTempTxt.textContent = `T = ${T.toFixed(1)} °C`;
    if (svgSTxt) svgSTxt.textContent = `s = ${s.toFixed(2)} mm`;

    const tipDeflPx = Math.min(32, s * 6.0);
    const startX = 97;
    const endX = startX + (L * 1.1);
    const tipY = 93 + tipDeflPx;

    const actY = 91;
    const actCtrlY = 91 + (tipDeflPx * 0.45);
    const actTipY = actY + tipDeflPx;
    plateActive.setAttribute('d', `M ${startX} ${actY} Q ${(startX + endX) / 2} ${actCtrlY} ${endX} ${actTipY}`);

    const pasY = 95.5;
    const pasCtrlY = 95.5 + (tipDeflPx * 0.45);
    const pasTipY = pasY + tipDeflPx;
    platePassive.setAttribute('d', `M ${startX} ${pasY} Q ${(startX + endX) / 2} ${pasCtrlY} ${endX} ${pasTipY}`);

    plateTip.setAttribute('cx', endX);
    plateTip.setAttribute('cy', tipY);

    if (indicatorRod) {
      indicatorRod.setAttribute('x1', endX);
      indicatorRod.setAttribute('x2', endX);
      indicatorRod.setAttribute('y2', tipY);
    }

    if (dialNeedle) {
      const needleAngle = (s / 5.0) * 360;
      dialNeedle.style.transform = `rotate(${needleAngle}deg)`;
      dialNeedle.setAttribute('transform', `rotate(${needleAngle})`);
    }

    if (thermoCol) {
      const colH = Math.min(100, Math.max(10, ((T - 20) / 100) * 90));
      thermoCol.setAttribute('y', 130 - colH);
      thermoCol.setAttribute('height', colH);
    }

    const contactTripped = s >= 3.0;
    if (contactTripped) {
      contactSpark.style.display = 'inline';
      relayLamp.setAttribute('fill', '#ef4444');
      relayLamp.setAttribute('stroke', '#fca5a5');
      relayLampTxt.textContent = "ALARM";
      relayLampTxt.setAttribute('fill', '#ffffff');
      relayStateTxt.textContent = "ULANGAN (TRIP)";
      relayStateTxt.setAttribute('fill', '#ef4444');
    } else {
      contactSpark.style.display = 'none';
      relayLamp.setAttribute('fill', '#334155');
      relayLamp.setAttribute('stroke', '#475569');
      relayLampTxt.textContent = "OFF";
      relayLampTxt.setAttribute('fill', '#94a3b8');
      relayStateTxt.textContent = "NORMAL";
      relayStateTxt.setAttribute('fill', '#94a3b8');
    }
  }

  tempIn.oninput = updateCantilever;
  lIn.oninput = updateCantilever;
  hIn.oninput = updateCantilever;
  pairSel.onchange = updateCantilever;

  document.getElementById('bm-step-btn').onclick = () => {
    AudioFX.success();
    if (stepTimer) clearInterval(stepTimer);
    tempIn.value = 20;
    updateCantilever();

    const tau = medSel.value === 'water' ? 8 : 45;
    let t_elapsed = 0;
    const targetT = 100;
    const startT = 20;

    stepTimer = setInterval(() => {
      t_elapsed += 0.5;
      const curT = startT + (targetT - startT) * (1 - Math.exp(-t_elapsed / tau));
      tempIn.value = curT.toFixed(1);
      updateCantilever();

      if (t_elapsed >= tau * 3.5 || curT >= 99.5) {
        tempIn.value = targetT;
        updateCantilever();
        clearInterval(stepTimer);
      }
    }, 100);
  };

  // --- 2. SANOAT SPIRAL BIMETALL TERMOMETRI LOGIKASI ---
  const spTempIn = document.getElementById('bm-sp-temp');
  const spTempB20 = document.getElementById('bm-sp-btn-20');
  const spTempB80 = document.getElementById('bm-sp-btn-80');
  const spTempB140 = document.getElementById('bm-sp-btn-140');
  const spTempB200 = document.getElementById('bm-sp-btn-200');
  const spWellSel = document.getElementById('bm-sp-well');

  const spTempVal = document.getElementById('bm-sp-temp-val');
  const spDialReadout = document.getElementById('bm-sp-dial-readout');
  const spAngleVal = document.getElementById('bm-sp-angle-val');
  const spAngleSub = document.getElementById('bm-sp-angle-sub');
  const spNeedlePivot = document.getElementById('bm-sp-needle-pivot');
  const spCoilGroup = document.getElementById('bm-sp-coil-group');

  function updateSpiral() {
    AudioFX.click();
    const T = parseFloat(spTempIn.value);
    spTempVal.textContent = T;
    spDialReadout.textContent = T.toFixed(1) + ' °C';

    // 0°C -> -135°, 200°C -> +135° (270° umumiy burchak diapazoni)
    const angle = -135 + (T / 200) * 270;
    const deflectionAngle = (T / 200) * 270;

    spAngleVal.innerHTML = deflectionAngle.toFixed(1) + ' <span class="unit">gradus</span>';
    spAngleSub.textContent = 'φ = (270° / 200°C) · ' + T + '°C = ' + deflectionAngle.toFixed(1) + '° (Strelka o\'qi burilishi)';

    if (spNeedlePivot) {
      spNeedlePivot.style.transform = 'rotate(' + angle + 'deg)';
      spNeedlePivot.setAttribute('transform', 'rotate(' + angle + ')');
    }

    if (spCoilGroup) {
      const coilTwist = (T / 200) * 45;
      spCoilGroup.setAttribute('transform', 'translate(65, 85) rotate(' + coilTwist.toFixed(1) + ')');
    }
  }

  spTempIn.oninput = updateSpiral;
  spTempB20.onclick = () => { spTempIn.value = 20; updateSpiral(); };
  spTempB80.onclick = () => { spTempIn.value = 80; updateSpiral(); };
  spTempB140.onclick = () => { spTempIn.value = 140; updateSpiral(); };
  spTempB200.onclick = () => { spTempIn.value = 200; updateSpiral(); };

  document.getElementById('bm-sp-step-btn').onclick = () => {
    AudioFX.success();
    if (spiralStepTimer) clearInterval(spiralStepTimer);
    spTempIn.value = 20;
    updateSpiral();

    let tau = 9.5;
    if (spWellSel.value === 'bare') tau = 1.5;
    else if (spWellSel.value === 'brass') tau = 18.0;

    let t_elapsed = 0;
    const targetT = 150;
    const startT = 20;

    spiralStepTimer = setInterval(() => {
      t_elapsed += 0.4;
      const curT = startT + (targetT - startT) * (1 - Math.exp(-t_elapsed / tau));
      spTempIn.value = curT.toFixed(1);
      updateSpiral();

      if (t_elapsed >= tau * 3.5 || curT >= 149.5) {
        spTempIn.value = targetT;
        updateSpiral();
        clearInterval(spiralStepTimer);
      }
    }, 100);
  };

  updateCantilever();
}

function setupThermocoupleStudySim(container) {
  container.innerHTML = `
    <div class="sim-grid-2">
      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🔥 Pech va Kompensatsiya sozlamalari</span>
          <span class="stand-sub-badge">ГОСТ 8.585-2001</span>
        </div>

        <div class="control-group">
          <label>Tadqiq etilayotgan termoelektrod juftligi:</label>
          <select id="tc-type-select" class="form-input">
            <option value="k" selected>TXA (K-tip) - Xromel-Alyumel (S ≈ 41.0 mkV/°C)</option>
            <option value="l">TXK (L-tip) - Xromel-Kopel (S ≈ 68.0 mkV/°C)</option>
            <option value="s">TPR (S-tip) - Platina-Platinarodiy (S ≈ 10.0 mkV/°C)</option>
          </select>
        </div>

        <div class="control-group">
          <label>Mufel pechi harorati (T_pech): <span id="tc-furnace-val" class="badge">180</span> °C</label>
          <input type="range" id="tc-furnace" min="20" max="500" value="180" class="slider" />
        </div>

        <div class="control-group">
          <label>Erkin ulanish (T0) usuli va harorati:</label>
          <select id="tc-comp-mode" class="form-input">
            <option value="ice">🧊 0°C Muzli Dyuar idishi (Etalon laboratoriya usuli)</option>
            <option value="auto" selected>⚡ 25°C Xona + Pt100 Avtomatik kompensatsiya</option>
            <option value="none">❌ 25°C Xona - Kompensatsiyasiz (T0 xatoligi yuzaga keladi)</option>
          </select>
        </div>

        <div class="control-group" id="tc-t0-custom-group" style="display:none;">
          <label>Xona harorati (T0): <span id="tc-t0-val" class="badge">25</span> °C</label>
          <input type="range" id="tc-t0" min="5" max="45" value="25" class="slider" />
        </div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="btn btn-secondary btn-sm" id="tc-step-heat-btn" style="flex:1;">🔥 Bosqichli qizdirish (Sikl)</button>
          <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(3)" style="flex:1;">📝 Jurnalga yozish</button>
        </div>
      </div>

      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>📟 Raqamli Mikrovoltmetr va Fizik Stend</span>
          <span class="stand-sub-badge">V7-38 Precision</span>
        </div>

        <div class="digital-display-card" style="background:#090d16; border: 2px solid #1e293b; padding:12px;">
          <div class="display-label" style="color: #38bdf8; letter-spacing: 1.5px;">PRECISION DIGITAL MILLIVOLTMETER</div>
          <div class="display-value" id="tc-res-volt" style="color:#00ff88; text-shadow:0 0 10px rgba(0,255,136,0.6);">7.380 <span class="unit" style="color:#a7f3d0;">mV</span></div>
          <div class="display-sub" id="tc-res-temp">Aniqlangan harorat: 180.0 °C (Aniq)</div>
        </div>

        <!-- Vizual laboratoriya stendi SVG -->
        <div class="vis-box" style="position:relative; background:#0f172a; border-radius:12px; margin-top:10px; overflow:hidden;">
          <svg viewBox="0 0 380 185" class="sim-svg">
            <!-- Mufel pechi korpusi -->
            <rect x="15" y="25" width="130" height="135" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2.5" />
            <rect x="25" y="40" width="110" height="105" rx="5" fill="#0f172a" />
            
            <!-- Pech ichidagi inkandessensiya (Chamber Heat Glow) -->
            <rect id="tc-furnace-glow" x="25" y="40" width="110" height="105" rx="5" fill="#f97316" opacity="0.1" class="muffle-chamber-glow" />

            <!-- Pech dudburoni ustidagi issiqlik tebranishi (Heat Shimmer) -->
            <g id="tc-chimney-haze" class="heat-shimmer" style="opacity:0.6;">
              <path d="M 70 25 Q 75 14 70 2" stroke="#f97316" stroke-width="2" fill="none" opacity="0.6"/>
              <path d="M 80 25 Q 85 10 80 0" stroke="#ef4444" stroke-width="2.5" fill="none" opacity="0.8"/>
              <path d="M 90 25 Q 95 14 90 2" stroke="#f97316" stroke-width="2" fill="none" opacity="0.6"/>
            </g>

            <text x="80" y="36" fill="#94a3b8" font-size="9" text-anchor="middle" font-weight="bold">MUFEL PECHI (SUX-2.5)</text>

            <!-- Qizdirish spirali -->
            <path id="tc-svg-coil" d="M 32 50 Q 80 44 128 50 Q 80 56 32 63 Q 80 70 128 77 Q 80 84 32 91 Q 80 98 128 105 Q 80 112 32 119 Q 80 126 128 133" stroke="#f97316" stroke-width="2.5" fill="none" class="heat-glowing" />

            <!-- Etalon zond (Pt100) -->
            <rect x="50" y="20" width="8" height="90" fill="#94a3b8" rx="2" stroke="#64748b" />
            <circle cx="54" cy="110" r="5" fill="#10b981" />
            <text x="54" y="15" fill="#10b981" font-size="8" text-anchor="middle" font-weight="bold">Etalon</text>

            <!-- Sinovdagi termopara (TXA/TXK) -->
            <rect x="95" y="20" width="8" height="90" fill="#cbd5e1" rx="2" stroke="#475569" />
            <!-- Hot junction payka nuqtasi -->
            <circle id="tc-svg-junction" cx="99" cy="110" r="7" fill="#ef4444" class="heat-glowing" />
            <text x="99" y="15" fill="#f87171" font-size="8" text-anchor="middle" font-weight="bold">TXA datchik</text>
            <text x="80" y="156" fill="#f8fafc" font-size="11" text-anchor="middle" font-weight="bold" id="tc-svg-furnace-txt">180 °C</text>

            <!-- Termoelektrod simlari (Xromel - sariq, Alyumel - moviy) -->
            <path d="M 97 20 Q 150 -5 210 50" stroke="#f59e0b" stroke-width="3" fill="none" />
            <path id="tc-wire-flow-1" d="M 97 20 Q 150 -5 210 50" stroke="#ffffff" stroke-width="1.8" fill="none" class="electron-flow-active" stroke-linecap="round" opacity="0.8" />
            <path d="M 101 20 Q 160 10 210 75" stroke="#38bdf8" stroke-width="3" fill="none" />
            <path id="tc-wire-flow-2" d="M 210 75 Q 160 10 101 20" stroke="#ffffff" stroke-width="1.8" fill="none" class="electron-flow-active" stroke-linecap="round" opacity="0.8" />
            <text x="160" y="20" fill="#f59e0b" font-size="8" font-weight="bold">Xromel (+)</text>
            <text x="160" y="42" fill="#38bdf8" font-size="8" font-weight="bold">Alyumel (-)</text>

            <!-- Sovuq ulanish bloki / Kompensator -->
            <rect id="tc-svg-comp-box" x="200" y="40" width="75" height="55" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
            <text id="tc-svg-comp-title" x="237" y="56" fill="#38bdf8" font-size="8" text-anchor="middle" font-weight="bold">Pt100 Komp.</text>
            <text id="tc-svg-comp-icon" x="237" y="74" font-size="14" text-anchor="middle">⚡</text>
            <text id="tc-svg-comp-sub" x="237" y="88" fill="#94a3b8" font-size="8" text-anchor="middle">T0: 25 °C</text>

            <!-- Voltmetrga o'tish simlari -->
            <line x1="275" y1="52" x2="300" y2="52" stroke="#ef4444" stroke-width="2" />
            <line x1="275" y1="72" x2="300" y2="72" stroke="#334155" stroke-width="2" />

            <!-- Voltmetr korpusi -->
            <rect x="300" y="30" width="70" height="80" rx="6" fill="#020617" stroke="#334155" stroke-width="2" />
            <rect x="306" y="38" width="58" height="26" fill="#090d16" rx="2" />
            <text x="335" y="55" fill="#00ff88" font-size="10" text-anchor="middle" font-weight="bold" id="tc-svg-meter-txt" class="vfd-precision-display">7.38 mV</text>
            <circle cx="316" cy="75" r="4" fill="#ef4444" />
            <circle cx="335" cy="75" r="4" fill="#1e293b" stroke="#64748b" />
            <circle cx="354" cy="75" r="4" fill="#38bdf8" />
            <text x="335" y="98" fill="#94a3b8" font-size="8" text-anchor="middle">V7-38</text>
          </svg>
        </div>

        <div class="table-responsive" style="margin-top: 10px;">
          <table class="data-table" style="font-size:0.8rem;">
            <thead>
              <tr>
                <th>Ko'rsatkich</th>
                <th>Qiymat</th>
                <th>Birlik</th>
                <th>Tushuntirish</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Haqiqiy E(T, T0)</td>
                <td id="tc-raw-mv" style="font-weight:bold;">6.36</td>
                <td>mV</td>
                <td>Ulanishlar orasidagi termoEYuK</td>
              </tr>
              <tr>
                <td>Tuzatma E(T0, 0)</td>
                <td id="tc-corr-mv" style="font-weight:bold;">1.03</td>
                <td>mV</td>
                <td>Sovuq ulanish kompensatsiyasi</td>
              </tr>
              <tr>
                <td>To'liq termoEYuK E(T, 0)</td>
                <td id="tc-tot-mv" style="font-weight:bold; color:var(--primary);">7.38</td>
                <td>mV</td>
                <td>Etalon jadvalga mos termoEYuK</td>
              </tr>
              <tr>
                <td>O'lchash xatoligi (ΔT)</td>
                <td id="tc-error-delta" style="font-weight:bold; color:#10b981;">0.0</td>
                <td>°C</td>
                <td id="tc-error-desc">Kompensatsiya to'liq hisobga olingan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const typeSel = document.getElementById('tc-type-select');
  const fInput = document.getElementById('tc-furnace');
  const fVal = document.getElementById('tc-furnace-val');
  const compSel = document.getElementById('tc-comp-mode');
  const t0Input = document.getElementById('tc-t0');
  const t0Val = document.getElementById('tc-t0-val');
  const t0Group = document.getElementById('tc-t0-custom-group');
  const resVolt = document.getElementById('tc-res-volt');
  const resTemp = document.getElementById('tc-res-temp');
  const rawMv = document.getElementById('tc-raw-mv');
  const corrMv = document.getElementById('tc-corr-mv');
  const totMv = document.getElementById('tc-tot-mv');
  const errorDelta = document.getElementById('tc-error-delta');
  const errorDesc = document.getElementById('tc-error-desc');
  const stepHeatBtn = document.getElementById('tc-step-heat-btn');

  // SVG elementlari
  const svgCoil = document.getElementById('tc-svg-coil');
  const svgJunction = document.getElementById('tc-svg-junction');
  const svgFurnaceTxt = document.getElementById('tc-svg-furnace-txt');
  const svgCompBox = document.getElementById('tc-svg-comp-box');
  const svgCompTitle = document.getElementById('tc-svg-comp-title');
  const svgCompIcon = document.getElementById('tc-svg-comp-icon');
  const svgCompSub = document.getElementById('tc-svg-comp-sub');
  const svgMeterTxt = document.getElementById('tc-svg-meter-txt');
  const tcFurnaceGlow = document.getElementById('tc-furnace-glow');
  const tcChimneyHaze = document.getElementById('tc-chimney-haze');
  const tcWireFlow1 = document.getElementById('tc-wire-flow-1');
  const tcWireFlow2 = document.getElementById('tc-wire-flow-2');

  const coeffs = { k: 0.041, l: 0.068, s: 0.010 };

  function update() {
    AudioFX.click();
    const T = parseFloat(fInput.value);
    const type = typeSel.value;
    const S = coeffs[type];
    const mode = compSel.value;

    fVal.textContent = T;
    if (svgFurnaceTxt) svgFurnaceTxt.textContent = `${T} °C`;

    let T0 = 0;
    if (mode === 'ice') {
      T0 = 0;
      t0Group.style.display = 'none';
      if (svgCompBox) {
        svgCompBox.setAttribute('stroke', '#38bdf8');
        svgCompBox.setAttribute('fill', '#082f49');
        svgCompTitle.textContent = "Muzli termos";
        svgCompIcon.textContent = "🧊";
        svgCompSub.textContent = "T0: 0 °C";
      }
    } else if (mode === 'auto') {
      T0 = parseFloat(t0Input?.value || 25);
      t0Group.style.display = 'block';
      t0Val.textContent = T0;
      if (svgCompBox) {
        svgCompBox.setAttribute('stroke', '#10b981');
        svgCompBox.setAttribute('fill', '#064e3b');
        svgCompTitle.textContent = "Pt100 Komp.";
        svgCompIcon.textContent = "⚡";
        svgCompSub.textContent = `T0: ${T0} °C`;
      }
    } else {
      T0 = parseFloat(t0Input?.value || 25);
      t0Group.style.display = 'block';
      t0Val.textContent = T0;
      if (svgCompBox) {
        svgCompBox.setAttribute('stroke', '#ef4444');
        svgCompBox.setAttribute('fill', '#450a0a');
        svgCompTitle.textContent = "Kompensatsiyasiz";
        svgCompIcon.textContent = "⚠️";
        svgCompSub.textContent = `T0: ${T0} °C`;
      }
    }

    // TermoEYuK hisobi
    const raw = Math.max(0, (T - T0) * S);
    const corr = T0 * S;
    const isCompActive = (mode === 'auto' || mode === 'ice');
    const total = isCompActive ? (raw + corr) : raw;
    const detectedT = total / S;
    const diff = detectedT - T;

    // Jitter (real mikrovolt tebranishi)
    const jitter = (Math.random() - 0.5) * 0.006;
    const dispVolt = (total + jitter).toFixed(3);

    resVolt.innerHTML = `${dispVolt} <span class="unit">mV</span>`;
    rawMv.textContent = raw.toFixed(2);
    corrMv.textContent = isCompActive ? corr.toFixed(2) : "0.00";
    totMv.textContent = total.toFixed(2);
    if (svgMeterTxt) svgMeterTxt.textContent = `${total.toFixed(2)} mV`;

    if (Math.abs(diff) < 0.2) {
      resTemp.textContent = `Aniqlangan harorat: ${detectedT.toFixed(1)} °C (Yuqori aniqlikda)`;
      resTemp.style.color = '#38bdf8';
      errorDelta.textContent = "0.0";
      errorDelta.style.color = '#10b981';
      errorDesc.textContent = "Kompensatsiya to'liq va aniq bajarilgan";
    } else {
      resTemp.textContent = `Aniqlangan harorat: ${detectedT.toFixed(1)} °C (Xatolik: ${diff.toFixed(1)} °C)`;
      resTemp.style.color = '#ef4444';
      errorDelta.textContent = `${diff.toFixed(1)}`;
      errorDelta.style.color = '#ef4444';
      errorDesc.textContent = `Sovuq ulanish T0=${T0}°C hisobga olinmagani sababli ko'rsatkich past!`;
    }

    // 1. Pech qizishi va inkandessensiya (Glow)
    if (tcFurnaceGlow) {
      if (T < 100) {
        tcFurnaceGlow.setAttribute('fill', '#1e293b');
        tcFurnaceGlow.style.opacity = '0.05';
      } else if (T < 250) {
        tcFurnaceGlow.setAttribute('fill', '#991b1b');
        tcFurnaceGlow.style.opacity = '0.35';
      } else if (T < 400) {
        tcFurnaceGlow.setAttribute('fill', '#ea580c');
        tcFurnaceGlow.style.opacity = '0.55';
      } else {
        tcFurnaceGlow.setAttribute('fill', '#fbbf24');
        tcFurnaceGlow.style.opacity = '0.75';
      }
    }

    if (tcChimneyHaze) {
      tcChimneyHaze.style.opacity = Math.min(1.0, 0.2 + (T / 450)).toFixed(2);
    }

    // 2. Spiral va datchik uchi
    if (svgCoil && svgJunction) {
      if (T > 60) {
        svgCoil.classList.add('heat-glowing');
        svgJunction.classList.add('heat-glowing');
        svgCoil.setAttribute('stroke', T > 250 ? '#ef4444' : '#f97316');
      } else {
        svgCoil.classList.remove('heat-glowing');
        svgJunction.classList.remove('heat-glowing');
        svgCoil.setAttribute('stroke', '#64748b');
      }
    }

    // 3. Simlardagi elektron oqimi
    if (tcWireFlow1 && tcWireFlow2) {
      if (total > 0.1) {
        tcWireFlow1.style.display = 'inline';
        tcWireFlow2.style.display = 'inline';
        const flowSpeed = Math.max(0.12, 1.4 - (total / 25)).toFixed(2) + 's';
        tcWireFlow1.style.animationDuration = flowSpeed;
        tcWireFlow2.style.animationDuration = flowSpeed;
      } else {
        tcWireFlow1.style.display = 'none';
        tcWireFlow2.style.display = 'none';
      }
    }
  }

  typeSel.onchange = update;
  fInput.oninput = update;
  compSel.onchange = update;
  t0Input.oninput = update;

  stepHeatBtn.onclick = () => {
    AudioFX.click();
    let cur = 50;
    const target = 350;
    const interval = setInterval(() => {
      cur += 25;
      fInput.value = cur;
      AudioFX.click();
      update();
      if (cur >= target) {
        clearInterval(interval);
        AudioFX.success();
      }
    }, 200);
  };

  update();
}

// --- SIMULYATOR 4: QARSHILIK TERMOMETRLARI VA UISTON KO'PRIGI (Р333) ---
function setupResistanceThermometerSim(container) {
  let d100 = 1;
  let d10 = 1;
  let d1 = 9;
  let d01 = 4; // 100*1 + 10*1 + 1*9 + 0.1*4 = 119.4 Om

  container.innerHTML = `
    <div class="sim-grid-2">
      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🎛 Termoqarshilik va Kabel Parametrlari</span>
          <span class="stand-sub-badge">ГОСТ 6651-2009</span>
        </div>

        <div class="control-group">
          <label>Datchik turi (Nominal qarshilik R0):</label>
          <select id="rt-type" class="form-input">
            <option value="pt100" selected>Pt100 Platina (R0 = 100.00 Ω, α = 0.00385)</option>
            <option value="pt500">Pt500 Platina (R0 = 500.00 Ω, α = 0.00385)</option>
            <option value="pt1000">Pt1000 Platina (R0 = 1000.0 Ω, α = 0.00385)</option>
            <option value="cu50">Cu50 Mis (R0 = 50.00 Ω, α = 0.00428)</option>
            <option value="cu100">Cu100 Mis (R0 = 100.00 Ω, α = 0.00428)</option>
            <option value="ntc">NTC 10k Termistor (R25 = 10.0 kΩ, B = 3950 K)</option>
          </select>
        </div>

        <div class="control-group">
          <label>Harorat: <span id="rt-temp-val" class="badge">50</span> °C</label>
          <input type="range" id="rt-temp" min="-40" max="180" value="50" class="slider" />
        </div>

        <div class="control-group">
          <label>Ulanish chizig'i sxemasi (Simlar soni):</label>
          <select id="rt-wires" class="form-input">
            <option value="2">2 simli (Chiziq qarshiligi 2*R_sim xatolik beradi)</option>
            <option value="3" selected>3 simli (Sanoat standarti — sim qarshiligi kompensatsiya qilinadi)</option>
            <option value="4">4 simli (Laboratoriya etalon — sim xatoligi 0.00 Ω)</option>
          </select>
        </div>

        <div class="control-group">
          <label>Chiziq kabel qarshiligi (R_sim): <span id="rt-rwire-val" class="badge">2.5</span> Om</label>
          <input type="range" id="rt-rwire" min="0" max="10" step="0.5" value="2.5" class="slider" />
        </div>

        <!-- Do'kon qarshiligi (Р333) dekadalari -->
        <div class="control-group" style="background:var(--bg-main); padding:10px; border-radius:8px; border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <label style="margin:0;">⚖️ Р333 Do'kon qarshiligi (R_taqqoslash): <span id="rt-bal-val" class="badge">119.4</span> Om</label>
            <button class="btn btn-secondary btn-sm" id="rt-auto-balance-btn" style="padding:2px 8px; font-size:0.75rem;">⚡ Avto-balans</button>
          </div>

          <div class="decade-box-grid">
            <div class="decade-knob-col">
              <span class="decade-knob-title">×100 Ω</span>
              <div class="decade-knob-dial" id="dial-100">${d100}</div>
              <div style="display:flex; gap:3px;">
                <button class="tactile-btn" id="d100-minus">-</button>
                <button class="tactile-btn" id="d100-plus">+</button>
              </div>
            </div>
            <div class="decade-knob-col">
              <span class="decade-knob-title">×10 Ω</span>
              <div class="decade-knob-dial" id="dial-10">${d10}</div>
              <div style="display:flex; gap:3px;">
                <button class="tactile-btn" id="d10-minus">-</button>
                <button class="tactile-btn" id="d10-plus">+</button>
              </div>
            </div>
            <div class="decade-knob-col">
              <span class="decade-knob-title">×1 Ω</span>
              <div class="decade-knob-dial" id="dial-1">${d1}</div>
              <div style="display:flex; gap:3px;">
                <button class="tactile-btn" id="d1-minus">-</button>
                <button class="tactile-btn" id="d1-plus">+</button>
              </div>
            </div>
            <div class="decade-knob-col">
              <span class="decade-knob-title">×0.1 Ω</span>
              <div class="decade-knob-dial" id="dial-01">${d01}</div>
              <div style="display:flex; gap:3px;">
                <button class="tactile-btn" id="d01-minus">-</button>
                <button class="tactile-btn" id="d01-plus">+</button>
              </div>
            </div>
          </div>

          <div id="bridge-balance-status" style="margin-top:8px; font-size:0.8rem; font-weight:bold; text-align:center;">
            ❌ KO'PRIK MUVOZANATSIZ
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(4)" style="flex:1;">📝 Jurnalga yozish</button>
        </div>
      </div>

      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>📟 Uiston Ko'prigi va Noll-Galvanometr</span>
          <span class="stand-sub-badge">МВU-49 Laboratoriya</span>
        </div>

        <div class="digital-display-card" style="padding:10px;">
          <div class="display-label">Datchikning elektr qarshiligi (R_o'lchangan)</div>
          <div class="display-value" id="rt-res-val">119.40 <span class="unit">Om</span></div>
          <div class="display-sub" id="rt-sub-info">Haqiqiy Rt: 119.40 Om | Sim xatoligi: 0.00 Om</div>
        </div>

        <!-- Uiston ko'prigi elektr sxemasi SVG -->
        <div class="bridge-vis" style="background:#090e17; border-radius:12px; padding:8px; margin-top:10px;">
          <svg viewBox="0 0 350 175" class="sim-svg">
            <!-- Ko'prik rombi -->
            <polygon points="175,20 270,88 175,155 80,88" fill="none" stroke="#475569" stroke-width="3" />
            <!-- Tok oqimi animatsiyasi -->
            <polygon id="bridge-flow-circuit" points="175,20 270,88 175,155 80,88" fill="none" stroke="#38bdf8" stroke-width="1.8" class="electron-flow-active" opacity="0.75" />

            <!-- R1 yelka -->
            <rect x="110" y="44" width="30" height="15" fill="#f59e0b" rx="2" />
            <text x="125" y="40" font-size="9" text-anchor="middle" fill="#fbbf24">R1: 100Ω</text>

            <!-- R2 yelka -->
            <rect x="210" y="44" width="30" height="15" fill="#f59e0b" rx="2" />
            <text x="225" y="40" font-size="9" text-anchor="middle" fill="#fbbf24">R2: 100Ω</text>

            <!-- R_taqqoslash (Р333 do'kon qarshiligi) -->
            <rect x="110" y="115" width="30" height="15" fill="#38bdf8" rx="2" />
            <text x="125" y="142" font-size="9" text-anchor="middle" fill="#38bdf8" font-weight="bold">R_do'kon</text>

            <!-- Rt datchik -->
            <rect x="210" y="115" width="30" height="15" fill="#10b981" rx="2" />
            <text x="225" y="142" font-size="9" text-anchor="middle" fill="#10b981" font-weight="bold">Rt (Datchik)</text>

            <!-- Ulanish simlari indikatori (3 simli ko'rsatkich) -->
            <path id="rt-wire-line-1" d="M 270 88 L 320 88" stroke="#ef4444" stroke-width="2.5" />
            <path id="rt-wire-line-2" d="M 225 130 L 320 130" stroke="#38bdf8" stroke-width="2.5" />
            <path id="rt-wire-line-3" d="M 175 155 L 320 155" stroke="#10b981" stroke-width="2.5" />
            <text x="325" y="92" fill="#ef4444" font-size="7">L1</text>
            <text x="325" y="134" fill="#38bdf8" font-size="7">L2</text>
            <text x="325" y="159" fill="#10b981" font-size="7">L3</text>

            <!-- Noll-indikator Galvanometr (Markazda) -->
            <circle id="galvo-face" cx="175" cy="88" r="28" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
            <line x1="175" y1="63" x2="175" y2="68" stroke="#1e293b" stroke-width="2" />
            <text x="175" y="75" font-size="9" text-anchor="middle" font-weight="bold" fill="#1e293b">0</text>
            <text x="156" y="80" font-size="7" fill="#64748b">-</text>
            <text x="194" y="80" font-size="7" fill="#64748b">+</text>

            <!-- Galvanometr strelkasi (Mexanik inersiyali bounce bilan) -->
            <g transform="translate(175, 88)">
              <line id="galvo-needle" class="mechanical-needle" x1="0" y1="0" x2="0" y2="-23" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
              <circle cx="0" cy="0" r="4" fill="#0f172a" />
            </g>
            <text x="175" y="106" font-size="8" text-anchor="middle" font-weight="bold" fill="#64748b" id="galvo-txt">ΔU: 0.00V</text>
          </svg>
        </div>

        <div class="calc-box" style="margin-top:10px;">
          <strong>Ko'prik muvozanat sharti:</strong>
          <div style="font-size:0.8rem; margin-top:2px;">
            R1 · Rt = R2 · R_taqqoslash. Agar R1 = R2 bo'lsa, u holda <strong>Rt = R_taqqoslash</strong> bo'ladi (Galvanometr nolda bo'ladi).
          </div>
        </div>
      </div>
    </div>
  `;

  const typeSel = document.getElementById('rt-type');
  const tempInput = document.getElementById('rt-temp');
  const wireSel = document.getElementById('rt-wires');
  const rwireInput = document.getElementById('rt-rwire');
  const tempVal = document.getElementById('rt-temp-val');
  const rwireVal = document.getElementById('rt-rwire-val');
  const resVal = document.getElementById('rt-res-val');
  const subInfo = document.getElementById('rt-sub-info');
  const balVal = document.getElementById('rt-bal-val');
  const balStatus = document.getElementById('bridge-balance-status');
  const galvoNeedle = document.getElementById('galvo-needle');
  const galvoFace = document.getElementById('galvo-face');
  const galvoTxt = document.getElementById('galvo-txt');
  const autoBalBtn = document.getElementById('rt-auto-balance-btn');

  const dial100 = document.getElementById('dial-100');
  const dial10 = document.getElementById('dial-10');
  const dial1 = document.getElementById('dial-1');
  const dial01 = document.getElementById('dial-01');

  function pulseDial(el) {
    if (!el) return;
    el.classList.add('knob-turn');
    setTimeout(() => el.classList.remove('knob-turn'), 160);
  }

  function getRBal() {
    return d100 * 100 + d10 * 10 + d1 * 1 + d01 * 0.1;
  }

  function update() {
    AudioFX.click();
    const T = parseFloat(tempInput.value);
    const type = typeSel.value;
    const wires = parseInt(wireSel.value);
    const Rwire = parseFloat(rwireInput.value);

    tempVal.textContent = T;
    rwireVal.textContent = Rwire;

    // Callendar-Van Dusen va datchik qarshiliklari
    let trueR = 100;
    if (type === 'pt100') {
      trueR = 100 * (1 + 0.00385 * T);
    } else if (type === 'pt500') {
      trueR = 500 * (1 + 0.00385 * T);
    } else if (type === 'pt1000') {
      trueR = 1000 * (1 + 0.00385 * T);
    } else if (type === 'cu50') {
      trueR = 50 * (1 + 0.00428 * T);
    } else if (type === 'cu100') {
      trueR = 100 * (1 + 0.00428 * T);
    } else if (type === 'ntc') {
      const T_k = T + 273.15;
      trueR = 10000 * Math.exp(3950 * (1 / T_k - 1 / 298.15));
    }

    let wireError = 0;
    if (wires === 2) {
      wireError = 2 * Rwire;
    } else if (wires === 3) {
      wireError = 0.02 * Rwire; // Deyarli to'liq kompensatsiya
    } else {
      wireError = 0;
    }

    const measuredR = trueR + wireError;
    const Rbal = getRBal();

    resVal.innerHTML = `${measuredR.toFixed(2)} <span class="unit">Om</span>`;
    subInfo.textContent = `Haqiqiy Rt: ${trueR.toFixed(2)} Om | Sim xatoligi: +${wireError.toFixed(2)} Om (${wires} simli)`;
    balVal.textContent = Rbal.toFixed(1);

    // Dekada displeylarini yangilash
    dial100.textContent = d100;
    dial10.textContent = d10;
    dial1.textContent = d1;
    dial01.textContent = d01;

    // Ko'prik muvozanati hisobi
    const deltaR = measuredR - Rbal;
    const angle = Math.max(-50, Math.min(50, deltaR * 3));
    galvoNeedle.style.transform = `rotate(${angle}deg)`;
    galvoNeedle.setAttribute('transform', `rotate(${angle})`);
    galvoTxt.textContent = `ΔU: ${(deltaR * 0.015).toFixed(2)}V`;

    if (Math.abs(deltaR) < 0.5) {
      balStatus.innerHTML = `✅ KO'PRIK TO'LIQ MUVOZANATDA! Rt ≈ ${Rbal.toFixed(1)} Om (ΔU = 0.00V)`;
      balStatus.style.color = '#10b981';
      if (galvoFace) {
        galvoFace.setAttribute('fill', '#dcfce7');
        galvoFace.setAttribute('stroke', '#10b981');
      }
      AudioFX.success();
    } else {
      balStatus.innerHTML = deltaR > 0
        ? `❌ Rt > R_do'kon (Do'kon qarshiligini oshiring)`
        : `❌ Rt < R_do'kon (Do'kon qarshiligini kamaytiring)`;
      balStatus.style.color = '#ef4444';
      if (galvoFace) {
        galvoFace.setAttribute('fill', '#f8fafc');
        galvoFace.setAttribute('stroke', '#1e293b');
      }
    }
  }

  typeSel.onchange = () => {
    // Agar pt500 yoki pt1000 tanlansa d100 ni moslash
    if (typeSel.value === 'pt500') { d100 = 5; d10 = 9; d1 = 5; }
    else if (typeSel.value === 'pt1000') { d100 = 9; d10 = 9; d1 = 9; }
    else if (typeSel.value === 'cu50') { d100 = 0; d10 = 6; d1 = 0; }
    else { d100 = 1; d10 = 1; d1 = 9; }
    update();
  };

  tempInput.oninput = update;
  wireSel.onchange = update;
  rwireInput.oninput = update;

  // Dekada tugmalari (taktil aylanish animatsiyasi bilan)
  document.getElementById('d100-plus').onclick = () => { d100 = Math.min(9, d100 + 1); pulseDial(dial100); update(); };
  document.getElementById('d100-minus').onclick = () => { d100 = Math.max(0, d100 - 1); pulseDial(dial100); update(); };
  document.getElementById('d10-plus').onclick = () => { d10 = Math.min(9, d10 + 1); pulseDial(dial10); update(); };
  document.getElementById('d10-minus').onclick = () => { d10 = Math.max(0, d10 - 1); pulseDial(dial10); update(); };
  document.getElementById('d1-plus').onclick = () => { d1 = Math.min(9, d1 + 1); pulseDial(dial1); update(); };
  document.getElementById('d1-minus').onclick = () => { d1 = Math.max(0, d1 - 1); pulseDial(dial1); update(); };
  document.getElementById('d01-plus').onclick = () => { d01 = Math.min(9, d01 + 1); pulseDial(dial01); update(); };
  document.getElementById('d01-minus').onclick = () => { d01 = Math.max(0, d01 - 1); pulseDial(dial01); update(); };

  autoBalBtn.onclick = () => {
    AudioFX.success();
    // Avtomatik ravishda datchik qarshiligiga moslash
    const T = parseFloat(tempInput.value);
    const type = typeSel.value;
    let target = 100;
    if (type === 'pt100') target = 100 * (1 + 0.00385 * T);
    else if (type === 'cu50') target = 50 * (1 + 0.00428 * T);
    else if (type === 'cu100') target = 100 * (1 + 0.00428 * T);
    else if (type === 'pt500') target = 500 * (1 + 0.00385 * T);
    else if (type === 'pt1000') target = 1000 * (1 + 0.00385 * T);
    else target = 10000 * Math.exp(3950 * (1 / (T + 273.15) - 1 / 298.15));

    d100 = Math.min(9, Math.floor(target / 100));
    d10 = Math.min(9, Math.floor((target % 100) / 10));
    d1 = Math.min(9, Math.floor(target % 10));
    d01 = Math.min(9, Math.round(((target % 1) * 10)));
    update();
  };

  update();
}

// --- SIMULYATOR 5: HARORATNI O'LCHASH USULLARI (KONTAKTLI vs PIROMETR) ---
function setupTempMethodsSim(container) {
  let laserActive = true;
  let activeSubMode = 'ir'; // 'ir' yoki 'optical'
  let redFilterActive = true;

  container.innerHTML = `
    <!-- Sub-rejimlar almashgichi -->
    <div class="sub-sim-tabs" style="display:flex; gap:8px; margin-bottom:14px; border-bottom:2px solid var(--border-color); padding-bottom:8px;">
      <button class="btn btn-sm btn-primary" id="tm-tab-ir">📡 1. Infrakizil Pirometr (Raytek / Stefan-Boltsman)</button>
      <button class="btn btn-sm btn-secondary" id="tm-tab-optical">🔬 2. Yo'qoluvchi Tolali Optik Pirometr (Promin / OPIR)</button>
    </div>

    <!-- 1-REJIM: INFRAQIZIL PIROMETR (RAYTEK) -->
    <div id="tm-box-ir">
      <div class="sim-grid-2">
        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🎯 Obyekt va Pirometr Sozlamalari</span>
            <span class="stand-sub-badge">Optik D:S = 12:1</span>
          </div>

          <div class="control-group">
            <label>Jismning haqiqiy harorati (T_kontakt): <span id="tm-temp-val" class="badge">150</span> °C</label>
            <input type="range" id="tm-temp" min="20" max="600" value="150" class="slider" />
          </div>

          <div class="control-group">
            <label>Sirt materiali (Haqiqiy nurlanish qobiliyati ε_haq):</label>
            <select id="tm-mat" class="form-input">
              <option value="0.98">Absolyut qora jism modeli (ε = 0.98)</option>
              <option value="0.90" selected>Oksidlangan po'lat sirt (ε = 0.90)</option>
              <option value="0.85">O'tga chidamli g'isht / keramika (ε = 0.85)</option>
              <option value="0.55">Oksidlangan mis qatlam (ε = 0.55)</option>
              <option value="0.08">Sayqallangan oyna alyuminiy (ε = 0.08)</option>
            </select>
          </div>

          <div class="control-group">
            <label>Pirometrda o'rnatilgan ε_sozlash: <span id="tm-eps-set-val" class="badge">0.90</span></label>
            <input type="range" id="tm-eps-set" min="0.05" max="1.0" step="0.01" value="0.90" class="slider" />
          </div>

          <div class="control-group">
            <label>O'lchash masofasi (L): <span id="tm-dist-val" class="badge">0.6</span> metr (Fokus dog'i: <span id="tm-spot-size" style="font-weight:bold; color:var(--primary);">50</span> mm)</label>
            <input type="range" id="tm-dist" min="0.2" max="2.4" step="0.1" value="0.6" class="slider" />
          </div>

          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-secondary btn-sm" id="tm-toggle-laser-btn" style="flex:1;">🔴 Lazer nishoni: ON</button>
            <button class="btn btn-secondary btn-sm" id="tm-auto-eps-btn" style="flex:1;">🎯 ε Moslash (Kalibrlash)</button>
            <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(5)" style="flex:1;">📝 Jurnalga</button>
          </div>
        </div>

        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🔬 Optik va Kontaktli O'lchov Stendi</span>
            <span class="stand-sub-badge">Raytek Infrared + Pt100</span>
          </div>

          <!-- Vizual Stend SVG -->
          <div class="vis-box" style="position:relative; background:#0a0f1d; border-radius:12px; padding:6px; overflow:hidden;">
            <svg viewBox="0 0 380 185" class="sim-svg">
              <defs>
                <radialGradient id="target-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ff3b00" stop-opacity="0.9" />
                  <stop offset="70%" stop-color="#ff9900" stop-opacity="0.5" />
                  <stop offset="100%" stop-color="#1e293b" stop-opacity="0.1" />
                </radialGradient>
                <linearGradient id="cone-grad" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.03" />
                </linearGradient>
              </defs>

              <rect x="15" y="25" width="22" height="135" rx="3" fill="#334155" stroke="#475569" stroke-width="2" />
              <rect id="tm-svg-plate" x="37" y="30" width="28" height="125" rx="4" fill="#475569" stroke="#64748b" stroke-width="2" />
              <circle id="tm-svg-glow" cx="51" cy="92" r="32" fill="url(#target-glow)" class="heat-glowing" />
              <text x="51" y="20" fill="#94a3b8" font-size="8" text-anchor="middle" font-weight="bold">Namunaviy sirt</text>

              <line x1="51" y1="92" x2="51" y2="165" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
              <circle cx="51" cy="92" r="5" fill="#10b981" stroke="#fff" stroke-width="1.5" />
              <rect x="25" y="162" width="60" height="20" rx="3" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
              <text x="55" y="176" fill="#10b981" font-size="9" text-anchor="middle" font-weight="bold" id="tm-svg-contact-txt">150.0 °C</text>

              <polygon id="tm-svg-cone" points="300,90 51,55 51,129" fill="url(#cone-grad)" />
              <g id="tm-ir-rays" class="ir-wave-rays">
                <path d="M 60 70 Q 150 82 280 86 M 60 114 Q 150 98 280 94 M 75 75 Q 160 85 270 88 M 75 108 Q 160 95 270 92" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="4 4" fill="none" opacity="0.65"/>
              </g>

              <line id="tm-svg-laser" x1="290" y1="84" x2="51" y2="92" stroke="#ef4444" stroke-width="2.5" class="laser-beam" />
              <circle id="tm-svg-laser-dot" cx="51" cy="92" r="4" fill="#ef4444" />
              <circle id="tm-svg-laser-pulse" cx="51" cy="92" r="7" stroke="#ef4444" fill="none" class="laser-target-ring" stroke-width="1.5" />

              <g id="tm-svg-pyro" transform="translate(285, 45)">
                <path d="M 0 35 L 50 25 L 75 35 L 75 65 L 50 75 L 0 55 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
                <path d="M 45 75 L 35 120 L 55 120 L 68 75 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
                <rect x="28" y="82" width="8" height="15" rx="3" fill="#ef4444" />
                <rect x="-6" y="38" width="8" height="14" rx="2" fill="#38bdf8" opacity="0.8" />
                <circle cx="5" cy="39" r="2.5" fill="#ef4444" />
                <rect x="35" y="36" width="34" height="24" rx="2" fill="#020617" stroke="#334155" stroke-width="1.5" />
                <text x="52" y="47" fill="#38bdf8" font-size="7" text-anchor="middle" font-weight="bold" id="tm-svg-lcd-val">150°C</text>
                <text x="52" y="56" fill="#94a3b8" font-size="6" text-anchor="middle" id="tm-svg-lcd-eps">ε 0.90</text>
              </g>

              <text x="200" y="165" fill="#64748b" font-size="9" text-anchor="middle" id="tm-svg-dist-txt">Masofa L = 0.6 m</text>
            </svg>
          </div>

          <div class="comparison-cards" style="margin-top:10px;">
            <div class="comp-card" style="padding:10px;">
              <div style="font-size:0.75rem; color:#10b981; font-weight:700;">📌 KONTAKTLI TERMOMETR</div>
              <div class="comp-val" id="tm-contact-val" style="font-size:1.6rem; color:#10b981;">150.0 °C</div>
              <div class="comp-desc">Sirt bilan to'g'ridan-to'g'ri issiqlik muvozanati (Etalon haqiqiy harorat).</div>
            </div>
            <div class="comp-card" style="padding:10px;">
              <div style="font-size:0.75rem; color:#38bdf8; font-weight:700;">⚡ INFRAQIZIL PIROMETR</div>
              <div class="comp-val highlight" id="tm-piro-val" style="font-size:1.6rem; color:#38bdf8;">150.0 °C</div>
              <div class="comp-desc">Optik nurlanish qabul qilindi. Farq: <span id="tm-error-val" style="font-weight:bold;">0.0 °C</span></div>
            </div>
          </div>

          <div class="calc-box" style="margin-top:8px;">
            <strong>Stefan-Boltsman qonuni:</strong>
            <div style="font-size:0.8rem; margin-top:2px;" id="tm-analysis-txt">
              E = ε · σ · T⁴. Sirt nurlanish koeffitsienti to'g'ri sozlangan, xatolik minimal.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-REJIM: YO'QOLUVCHI TOLALI OPTIK PIROMETR (PROMIN / OPIR-09) -->
    <div id="tm-box-optical" style="display:none;">
      <div class="sim-grid-2">
        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🔬 Optik Pirometr (Promin / OPIR) Boshqaruvi</span>
            <span class="stand-sub-badge">ГОСТ 2372 / Promin-1</span>
          </div>

          <div class="control-group">
            <label>Metallurgiya pechi harorati (T_pech): <span id="opt-furnace-val" class="badge">1150</span> °C</label>
            <input type="range" id="opt-furnace-temp" min="800" max="1600" step="10" value="1150" class="slider" />
          </div>

          <div class="control-group">
            <label>Pech harorati tezkor tanlovlari:</label>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px;">
              <button class="btn btn-secondary btn-sm" id="opt-p-900">900°C</button>
              <button class="btn btn-secondary btn-sm" id="opt-p-1150">1150°C</button>
              <button class="btn btn-secondary btn-sm" id="opt-p-1350">1350°C</button>
              <button class="btn btn-secondary btn-sm" id="opt-p-1500">1500°C</button>
            </div>
          </div>

          <div class="control-group">
            <label>Pirometr lampasi toki (Reostat boshqaruvi): <span id="opt-lamp-amp-val" class="badge">0.450</span> A</label>
            <input type="range" id="opt-lamp-current" min="0.22" max="0.75" step="0.005" value="0.45" class="slider" />
          </div>

          <div class="control-group">
            <label>Optik yorug'lik filtrlari va Avto-tenglash:</label>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondary btn-sm" id="opt-filter-red-btn" style="flex:1;">🔴 Qizil monoxromatik filtr (λ=0.65µm): ON</button>
              <button class="btn btn-secondary btn-sm" id="opt-auto-match-btn" style="flex:1;">🎯 Fotometrik Tenglash</button>
            </div>
          </div>

          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(5)" style="flex:1;">📝 Jurnalga yozish</button>
          </div>

          <div class="calc-box" style="margin-top:10px;">
            <strong>Yo'qoluvchi cho'g'lanma tola prinsipi (Vin qonuni):</strong>
            <div style="font-size:0.8rem; margin-top:2px;" id="opt-theory-txt">
              Fotometrik tenglik: Lampa tolasining spektral yorqinligi pech nurlanishining yorqinligiga teng bo'lganda (B_tola = B_pech), tola fon bilan bir xil ko'rinish olib to'liq yo'qoladi!
            </div>
          </div>
        </div>

        <div class="sim-panel card">
          <div class="stand-card-header">
            <span>🔭 Teleskop Okulyaridagi Tasvir</span>
            <span class="stand-sub-badge">Okulyar maydoni (Field of View)</span>
          </div>

          <!-- Okulyar Vizualizatsiyasi -->
          <div style="display:flex; justify-content:center; align-items:center; background:#070a13; border-radius:12px; padding:12px;">
            <div style="position:relative; width:220px; height:220px;">
              <svg viewBox="0 0 220 220" style="width:100%; height:100%;">
                <defs>
                  <filter id="opt-fil-bright-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- Okulyar tashqi gardishi -->
                <circle cx="110" cy="110" r="106" fill="#18181b" stroke="#3f3f46" stroke-width="6" />
                <circle cx="110" cy="110" r="98" fill="#09090b" stroke="#000" stroke-width="2" />

                <!-- Okulyar diafragma maydoni (Qizigan pech foni) -->
                <circle id="opt-aperture-bg" cx="110" cy="110" r="88" fill="#ea580c" />

                <!-- Qizil monoxromatik filtr qatlami -->
                <circle id="opt-filter-overlay" cx="110" cy="110" r="88" fill="#ef4444" opacity="0.3" style="pointer-events:none;" />

                <!-- Okulyar retikuli (Nishon to'ri) -->
                <line x1="22" y1="110" x2="198" y2="110" stroke="#000000" stroke-width="0.8" opacity="0.45" />
                <line x1="110" y1="22" x2="110" y2="198" stroke="#000000" stroke-width="0.8" opacity="0.45" />
                <circle cx="110" cy="110" r="88" fill="none" stroke="#000000" stroke-width="1.5" opacity="0.4" />

                <!-- Tola ushlagich elektrodlari (Pastdan) -->
                <line x1="88" y1="198" x2="88" y2="150" stroke="#52525b" stroke-width="3.5" stroke-linecap="round" />
                <line x1="132" y1="198" x2="132" y2="150" stroke="#52525b" stroke-width="3.5" stroke-linecap="round" />

                <!-- Cho'g'lanma Volfram Tola (V-simon teskari qovuzloq) -->
                <path id="opt-filament-wire" class="pyro-filament-wire" d="M 88 150 L 88 102 Q 88 74 110 74 Q 132 74 132 102 L 132 150" fill="none" stroke="#09090b" stroke-width="4.5" stroke-linecap="round" />
              </svg>
            </div>
          </div>

          <!-- Pirometr ko'rsatkichlari -->
          <div style="margin-top:12px; display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div class="digital-display-card" style="padding:8px 12px;">
              <div class="display-label">Tola harorati (T_tola)</div>
              <div class="display-value" id="opt-fil-temp-disp" style="font-size:1.5rem; color:#f59e0b;">1150 <span class="unit">°C</span></div>
              <div class="display-sub" id="opt-fil-sub">I_lampa = 0.450 A</div>
            </div>
            <div class="digital-display-card" style="padding:8px 12px;">
              <div class="display-label">Pech harorati (T_pech)</div>
              <div class="display-value" id="opt-furnace-disp" style="font-size:1.5rem; color:#ef4444;">1150 <span class="unit">°C</span></div>
              <div class="display-sub">Haqiqiy nurlanish harorati</div>
            </div>
          </div>

          <div id="opt-balance-alert" class="calc-box" style="margin-top:8px; border-left:4px solid #10b981; padding:8px 12px;">
            <span id="opt-balance-msg" style="font-weight:700; color:#10b981;">✅ Fotometrik muvozanat: Tola ko'rinmaydi (yo'qoldi)!</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab tugmalari
  const tabIrBtn = document.getElementById('tm-tab-ir');
  const tabOptBtn = document.getElementById('tm-tab-optical');
  const boxIr = document.getElementById('tm-box-ir');
  const boxOpt = document.getElementById('tm-box-optical');

  tabIrBtn.onclick = () => {
    AudioFX.click();
    activeSubMode = 'ir';
    tabIrBtn.className = 'btn btn-sm btn-primary';
    tabOptBtn.className = 'btn btn-sm btn-secondary';
    boxIr.style.display = 'block';
    boxOpt.style.display = 'none';
  };

  tabOptBtn.onclick = () => {
    AudioFX.click();
    activeSubMode = 'optical';
    tabIrBtn.className = 'btn btn-sm btn-secondary';
    tabOptBtn.className = 'btn btn-sm btn-primary';
    boxIr.style.display = 'none';
    boxOpt.style.display = 'block';
    updateOptical();
  };

  // --- 1. RAYTEK INFRAQIZIL BOSHQARUVI ---
  const tempIn = document.getElementById('tm-temp');
  const matSel = document.getElementById('tm-mat');
  const epsSetIn = document.getElementById('tm-eps-set');
  const distIn = document.getElementById('tm-dist');
  const tempVal = document.getElementById('tm-temp-val');
  const epsSetVal = document.getElementById('tm-eps-set-val');
  const distVal = document.getElementById('tm-dist-val');
  const spotSizeEl = document.getElementById('tm-spot-size');
  const contactVal = document.getElementById('tm-contact-val');
  const piroVal = document.getElementById('tm-piro-val');
  const errorVal = document.getElementById('tm-error-val');
  const analysisTxt = document.getElementById('tm-analysis-txt');

  const toggleLaserBtn = document.getElementById('tm-toggle-laser-btn');
  const autoEpsBtn = document.getElementById('tm-auto-eps-btn');

  const svgPlate = document.getElementById('tm-svg-plate');
  const svgGlow = document.getElementById('tm-svg-glow');
  const svgContactTxt = document.getElementById('tm-svg-contact-txt');
  const svgLaser = document.getElementById('tm-svg-laser');
  const svgLaserDot = document.getElementById('tm-svg-laser-dot');
  const svgLaserPulse = document.getElementById('tm-svg-laser-pulse');
  const svgPyro = document.getElementById('tm-svg-pyro');
  const svgCone = document.getElementById('tm-svg-cone');
  const svgLcdVal = document.getElementById('tm-svg-lcd-val');
  const svgLcdEps = document.getElementById('tm-svg-lcd-eps');
  const svgDistTxt = document.getElementById('tm-svg-dist-txt');

  const plateColors = {
    "0.98": "#1e293b",
    "0.90": "#475569",
    "0.85": "#9a3412",
    "0.55": "#b45309",
    "0.08": "#e2e8f0"
  };

  function updateIr() {
    AudioFX.click();
    const T = parseFloat(tempIn.value);
    const epsReal = parseFloat(matSel.value);
    const epsSet = parseFloat(epsSetIn.value);
    const dist = parseFloat(distIn.value);

    tempVal.textContent = T;
    epsSetVal.textContent = epsSet.toFixed(2);
    distVal.textContent = dist.toFixed(1);

    const spotMm = Math.round((dist * 1000) / 12);
    spotSizeEl.textContent = spotMm;

    const T_kelvin = T + 273.15;
    let T_piro_kelvin = T_kelvin * Math.pow(epsReal / epsSet, 0.25);

    if (spotMm > 120) {
      const overflowRatio = (spotMm - 120) / spotMm;
      const T_env_k = 295.15;
      T_piro_kelvin = T_piro_kelvin * (1 - overflowRatio * 0.4) + T_env_k * (overflowRatio * 0.4);
    }

    const T_piro_celsius = T_piro_kelvin - 273.15;

    contactVal.textContent = `${T.toFixed(1)} °C`;
    piroVal.textContent = `${T_piro_celsius.toFixed(1)} °C`;
    if (svgContactTxt) svgContactTxt.textContent = `${T.toFixed(1)} °C`;
    if (svgLcdVal) svgLcdVal.textContent = `${T_piro_celsius.toFixed(0)}°C`;
    if (svgLcdEps) svgLcdEps.textContent = `ε ${epsSet.toFixed(2)}`;
    if (svgDistTxt) svgDistTxt.textContent = `Masofa L = ${dist.toFixed(1)} m | Dog' ø: ${spotMm} mm`;

    const diff = T_piro_celsius - T;
    errorVal.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)} °C`;
    errorVal.style.color = Math.abs(diff) > 10 ? '#ef4444' : '#10b981';

    if (svgPlate) {
      if (T < 120) {
        svgPlate.setAttribute('fill', plateColors[epsReal.toString()] || '#475569');
      } else if (T < 300) {
        svgPlate.setAttribute('fill', '#991b1b');
      } else if (T < 480) {
        svgPlate.setAttribute('fill', '#ea580c');
      } else {
        svgPlate.setAttribute('fill', '#fbbf24');
      }
    }

    if (svgGlow) {
      svgGlow.style.opacity = Math.min(1.0, Math.max(0.1, (T - 20) / 300)).toFixed(2);
      svgGlow.setAttribute('r', (24 + (T / 30)).toString());
      if (T < 60) svgGlow.classList.remove('heat-glowing');
      else svgGlow.classList.add('heat-glowing');
    }

    const pyroX = 150 + dist * 65;
    if (svgPyro) svgPyro.setAttribute('transform', `translate(${pyroX}, 45)`);
    if (svgLaser) svgLaser.setAttribute('x1', pyroX);

    const halfH = Math.min(55, 10 + (dist * 18));
    if (svgCone) {
      svgCone.setAttribute('points', `${pyroX},90 51,${92 - halfH} 51,${92 + halfH}`);
    }

    if (Math.abs(diff) < 2) {
      analysisTxt.innerHTML = `✅ <strong>Optimal moslik:</strong> ε_sozlangan (${epsSet.toFixed(2)}) haqiqiy sirtga mos kelmoqda. O'lchov yuqori aniqlikda!`;
      analysisTxt.style.color = '#10b981';
    } else if (diff < 0) {
      analysisTxt.innerHTML = `⚠️ <strong>Ko'rsatkich past:</strong> Sirt nurlanishi past (ε=${epsReal}), pirometr haroratni <strong>${Math.abs(diff).toFixed(1)} °C</strong> ga kam ko'rsatmoqda! "🎯 ε Moslash" tugmasini bosing.`;
      analysisTxt.style.color = '#f59e0b';
    } else {
      analysisTxt.innerHTML = `⚠️ <strong>Ko'rsatkich yuqori:</strong> Pirometrda belgilangan ε (${epsSet.toFixed(2)}) haqiqiy sirtdan kichik bo'lgani sababli ortiqcha harorat hisoblandi.`;
      analysisTxt.style.color = '#ef4444';
    }
  }

  tempIn.oninput = updateIr;
  matSel.onchange = updateIr;
  epsSetIn.oninput = updateIr;
  distIn.oninput = updateIr;

  toggleLaserBtn.onclick = () => {
    laserActive = !laserActive;
    AudioFX.laserBeep();
    toggleLaserBtn.textContent = laserActive ? "🔴 Lazer nishoni: ON" : "⚪ Lazer nishoni: OFF";
    toggleLaserBtn.className = laserActive ? "btn btn-secondary btn-sm" : "btn btn-outline btn-sm";
    const disp = laserActive ? "inline" : "none";
    if (svgLaser) svgLaser.style.display = disp;
    if (svgLaserDot) svgLaserDot.style.display = disp;
    if (svgLaserPulse) svgLaserPulse.style.display = disp;
  };

  autoEpsBtn.onclick = () => {
    AudioFX.success();
    epsSetIn.value = matSel.value;
    updateIr();
  };

  // --- 2. OPTIK PROMIN PIROMETRI BOSHQARUVI ---
  const optFurnaceTempIn = document.getElementById('opt-furnace-temp');
  const optLampCurIn = document.getElementById('opt-lamp-current');
  const optFurnaceVal = document.getElementById('opt-furnace-val');
  const optLampAmpVal = document.getElementById('opt-lamp-amp-val');
  const optFilTempDisp = document.getElementById('opt-fil-temp-disp');
  const optFurnaceDisp = document.getElementById('opt-furnace-disp');
  const optFilSub = document.getElementById('opt-fil-sub');
  const optBalanceAlert = document.getElementById('opt-balance-alert');
  const optBalanceMsg = document.getElementById('opt-balance-msg');

  const optFilterBtn = document.getElementById('opt-filter-red-btn');
  const optAutoMatchBtn = document.getElementById('opt-auto-match-btn');
  const optP900 = document.getElementById('opt-p-900');
  const optP1150 = document.getElementById('opt-p-1150');
  const optP1350 = document.getElementById('opt-p-1350');
  const optP1500 = document.getElementById('opt-p-1500');

  const optApertureBg = document.getElementById('opt-aperture-bg');
  const optFilterOverlay = document.getElementById('opt-filter-overlay');
  const optFilamentWire = document.getElementById('opt-filament-wire');

  function getOptColor(t, redFilter) {
    if (redFilter) {
      const norm = Math.min(1, Math.max(0, (t - 800) / 800));
      const r = Math.round(140 + norm * 115);
      const g = Math.round(norm * 50);
      const b = Math.round(norm * 30);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    if (t < 900) return '#7f1d1d';
    if (t < 1050) return '#b91c1c';
    if (t < 1200) return '#ea580c';
    if (t < 1350) return '#f59e0b';
    if (t < 1500) return '#fef08a';
    return '#fffbeb';
  }

  function updateOptical() {
    AudioFX.click();
    const T_pech = parseFloat(optFurnaceTempIn.value);
    const I_lamp = parseFloat(optLampCurIn.value);

    optFurnaceVal.textContent = T_pech;
    optLampAmpVal.textContent = I_lamp.toFixed(3);
    optFurnaceDisp.innerHTML = T_pech + ' <span class="unit">°C</span>';

    // Tola harorati: I=0.22A -> 800°C; I=0.75A -> 1600°C
    const T_tola = Math.round(800 + ((I_lamp - 0.22) / (0.75 - 0.22)) * 800);
    optFilTempDisp.innerHTML = T_tola + ' <span class="unit">°C</span>';
    optFilSub.textContent = 'I_lampa = ' + I_lamp.toFixed(3) + ' A (Reostat)';

    // Pech foni rangi
    const bgColor = getOptColor(T_pech, redFilterActive);
    if (optApertureBg) optApertureBg.setAttribute('fill', bgColor);
    if (optFilterOverlay) optFilterOverlay.style.display = redFilterActive ? 'inline' : 'none';

    // Tola ravshanligi va yo'qolish effekti
    const tempDiff = T_tola - T_pech;

    if (Math.abs(tempDiff) <= 22) {
      // MUVOZANAT: Tola fon bilan bir xil bo'lib yo'qoladi!
      if (optFilamentWire) {
        optFilamentWire.setAttribute('stroke', bgColor);
        optFilamentWire.style.opacity = '0.12';
        optFilamentWire.style.filter = 'none';
      }
      optBalanceAlert.style.borderLeftColor = '#10b981';
      optBalanceMsg.style.color = '#10b981';
      optBalanceMsg.innerHTML = '✅ <strong>FOTOMETRIK MUVOZANAT:</strong> Tola to\'liq yo\'qoldi! Pirometr shkalasidagi harorat: <strong>' + T_tola + ' °C</strong>';
    } else if (tempDiff < -22) {
      // Tola sovuqroq: qora chiziq
      if (optFilamentWire) {
        optFilamentWire.setAttribute('stroke', '#09090b');
        optFilamentWire.style.opacity = '1.0';
        optFilamentWire.style.filter = 'none';
      }
      optBalanceAlert.style.borderLeftColor = '#f59e0b';
      optBalanceMsg.style.color = '#f59e0b';
      optBalanceMsg.innerHTML = '⚠️ <strong>Tola QORA ko\'rinmoqda (T_tola &lt; T_pech):</strong> Lampa sovuq. Reostatdan tokni oshiring!';
    } else {
      // Tola issiqroq: yorqin oq-sariq chiziq
      if (optFilamentWire) {
        optFilamentWire.setAttribute('stroke', '#ffffff');
        optFilamentWire.style.opacity = '1.0';
        optFilamentWire.style.filter = 'url(#opt-fil-bright-glow)';
      }
      optBalanceAlert.style.borderLeftColor = '#ef4444';
      optBalanceMsg.style.color = '#ef4444';
      optBalanceMsg.innerHTML = '⚠️ <strong>Tola YORQIN OQ ko\'rinmoqda (T_tola &gt; T_pech):</strong> Lampa o\'ta qizigan. Tokni kamaytiring!';
    }
  }

  optFurnaceTempIn.oninput = updateOptical;
  optLampCurIn.oninput = updateOptical;

  optP900.onclick = () => { optFurnaceTempIn.value = 900; updateOptical(); };
  optP1150.onclick = () => { optFurnaceTempIn.value = 1150; updateOptical(); };
  optP1350.onclick = () => { optFurnaceTempIn.value = 1350; updateOptical(); };
  optP1500.onclick = () => { optFurnaceTempIn.value = 1500; updateOptical(); };

  optFilterBtn.onclick = () => {
    AudioFX.click();
    redFilterActive = !redFilterActive;
    optFilterBtn.textContent = redFilterActive ? "🔴 Qizil monoxromatik filtr (λ=0.65µm): ON" : "⚪ Filtr: OFF (Oq yorug'lik)";
    optFilterBtn.className = redFilterActive ? "btn btn-secondary btn-sm" : "btn btn-outline btn-sm";
    updateOptical();
  };

  optAutoMatchBtn.onclick = () => {
    AudioFX.success();
    const T_pech = parseFloat(optFurnaceTempIn.value);
    const targetI = 0.22 + ((T_pech - 800) / 800) * (0.75 - 0.22);
    optLampCurIn.value = targetI.toFixed(3);
    updateOptical();
  };

  updateIr();
}

// --- SIMULYATOR 6: BOSIM O'LCHASH ASBOBLARI (BURDON, U-SIMON VA ETALON MP-60) ---
function setupPressureSensorsSim(container) {
  let calibRunning = false;

  container.innerHTML = `
    <div class="sim-grid-2">
      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🎛 Gidropnevmatik Bosim Stendi (MP-60)</span>
          <span class="stand-sub-badge">Aniqlik sinfi: 0.05</span>
        </div>

        <div class="control-group">
          <label>Yaratilgan ortiqcha bosim (P_ort): <span id="ps-press-val" class="badge">3.0</span> bar (<span id="ps-press-mpa">0.300</span> MPa)</label>
          <input type="range" id="ps-press" min="0" max="10" step="0.1" value="3.0" class="slider" />
        </div>

        <div class="control-group">
          <label>Vintli qo'l pressi (Bosim hosil qilish):</label>
          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:6px;">
            <button class="btn btn-secondary btn-sm" id="ps-add-05">+0.5 bar</button>
            <button class="btn btn-secondary btn-sm" id="ps-add-10">+1.0 bar</button>
            <button class="btn btn-secondary btn-sm" id="ps-add-20">+2.0 bar</button>
          </div>
        </div>

        <div class="control-group">
          <label>Etalon MP-60 yuk-porshenli manometr yukchalari:</label>
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-main); padding:8px 12px; border-radius:6px; border:1px solid var(--border-color);">
            <span>Yuklangan disklar: <strong id="ps-weights-count">3 dona (3.0 bar)</strong></span>
            <span class="badge" style="background:#22c55e22; color:#16a34a;">Aylanmoqda 🔄</span>
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn btn-secondary btn-sm" id="ps-release-valve-btn" style="flex:1; background:#ef444415; border-color:#ef4444; color:#ef4444;">💨 Ventildan tushirish</button>
          <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(6)" style="flex:1;">📝 Jurnalga yozish</button>
        </div>

        <div class="calc-box" style="margin-top:12px;">
          <strong>Mutlaq bosim formulasi:</strong>
          <div id="ps-abs-formula" style="font-size:0.8rem; margin-top:2px;">
            P_mutlaq = P_ort + P_atm = 3.0 + 1.013 = 4.013 bar (401.3 kPa)
          </div>
        </div>
      </div>

      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>📟 Asboblar Ko'rsatkichi va Mexanizmlari</span>
          <span class="stand-sub-badge">3 ta datchik parallel</span>
        </div>

        <!-- Vizual Stend SVG -->
        <div class="vis-box" style="background:#090d16; border-radius:12px; padding:6px; overflow:hidden;">
          <svg viewBox="0 0 380 185" class="sim-svg">
            <!-- 1. BURDON PRUJINASI KESIMI VA SHKALASI (Chapda) -->
            <g transform="translate(15, 10)">
              <circle cx="55" cy="55" r="50" fill="#1e293b" stroke="#475569" stroke-width="3" />
              <circle cx="55" cy="55" r="46" fill="#f8fafc" />
              <path id="burdon-tube" d="M 55 92 A 36 36 0 1 1 88 42" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
              <line id="burdon-link" x1="88" y1="42" x2="62" y2="50" stroke="#334155" stroke-width="2" />
              <circle cx="55" cy="55" r="5" fill="#1e293b" />
              <text x="55" y="24" font-size="7" text-anchor="middle" fill="#64748b" font-weight="bold">5 bar</text>
              <text x="86" y="58" font-size="7" text-anchor="middle" fill="#64748b">10</text>
              <text x="24" y="58" font-size="7" text-anchor="middle" fill="#64748b">0</text>
              <g transform="translate(55, 55)">
                <line id="burdon-needle" class="physics-spring-needle" x1="0" y1="0" x2="0" y2="-37" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="0" cy="0" r="3.5" fill="#0f172a" />
              </g>
              <text x="55" y="118" fill="#f8fafc" font-size="9" text-anchor="middle" font-weight="bold">Burdon manometri</text>
              <text x="55" y="132" fill="#38bdf8" font-size="11" text-anchor="middle" font-weight="bold" id="burdon-txt">3.0 bar</text>
            </g>

            <!-- 2. U-SIMON SIMOBLI MANOMETR (O'rtada) -->
            <g transform="translate(135, 10)">
              <rect x="18" y="5" width="44" height="135" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
              <line x1="22" y1="20" x2="30" y2="20" stroke="#64748b" stroke-width="1" />
              <line x1="22" y1="45" x2="30" y2="45" stroke="#64748b" stroke-width="1" />
              <line x1="22" y1="70" x2="35" y2="70" stroke="#94a3b8" stroke-width="1.5" />
              <line x1="22" y1="95" x2="30" y2="95" stroke="#64748b" stroke-width="1" />
              <line x1="22" y1="120" x2="30" y2="120" stroke="#64748b" stroke-width="1" />
              <text x="35" y="73" fill="#94a3b8" font-size="6">0</text>
              <path d="M 32 15 L 32 120 A 8 8 0 0 0 48 120 L 48 15" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" opacity="0.4" />
              <path id="u-mercury-path" d="M 32 85 L 32 120 A 8 8 0 0 0 48 120 L 48 55" fill="none" stroke="#cbd5e1" stroke-width="4.5" stroke-linecap="round" />
              <circle id="u-meniscus-left" class="meniscus-slosh" cx="32" cy="85" r="2.5" fill="#94a3b8" />
              <circle id="u-meniscus-right" class="meniscus-slosh" cx="48" cy="55" r="2.5" fill="#94a3b8" />
              <text x="40" y="152" fill="#f8fafc" font-size="8" text-anchor="middle" font-weight="bold">U-manometr</text>
              <text x="40" y="165" fill="#94a3b8" font-size="8" text-anchor="middle" id="u-mmhg-txt">Δh: 225 mm Hg</text>
            </g>

            <!-- 3. YUK-PORSHENLI MP-60 VA 4-20 mA DATCHIK (O'ngda) -->
            <g transform="translate(230, 10)">
              <g id="ps-bleed-steam" class="steam-jet-active" style="display:none; transform-origin: 30px 45px;">
                <ellipse cx="30" cy="35" rx="14" ry="5" fill="#f1f5f9" opacity="0.85" />
                <ellipse cx="26" cy="22" rx="20" ry="7" fill="#e2e8f0" opacity="0.6" />
                <ellipse cx="34" cy="8" rx="28" ry="9" fill="#cbd5e1" opacity="0.35" />
              </g>
              <rect x="15" y="75" width="30" height="55" rx="3" fill="#334155" stroke="#64748b" stroke-width="2" />
              <rect x="25" y="45" width="10" height="35" fill="#cbd5e1" />
              <g id="mp-rotating-disks" transform="translate(30, 42)">
                <ellipse cx="0" cy="-6" rx="24" ry="5" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
                <ellipse cx="0" cy="-14" rx="22" ry="4.5" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
                <ellipse cx="0" cy="-21" rx="20" ry="4" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" />
                <g class="weights-glimmer">
                  <line x1="-16" y1="-8" x2="-8" y2="-4" stroke="#fef08a" stroke-width="2" stroke-linecap="round" opacity="0.85" />
                  <line x1="-14" y1="-16" x2="-6" y2="-12" stroke="#fef08a" stroke-width="2" stroke-linecap="round" opacity="0.85" />
                  <line x1="-12" y1="-23" x2="-5" y2="-19" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.9" />
                </g>
              </g>
              <text x="30" y="145" fill="#f8fafc" font-size="8" text-anchor="middle" font-weight="bold">Etalon MP-60</text>
              <text x="30" y="158" fill="#fbbf24" font-size="8" text-anchor="middle">Gidravlik yuk</text>

              <rect x="75" y="45" width="60" height="65" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
              <rect x="80" y="52" width="50" height="24" rx="3" fill="#090d16" />
              <text x="105" y="68" fill="#38bdf8" font-size="10" text-anchor="middle" font-weight="bold" id="ps-svg-ma-txt">8.80 mA</text>
              <text x="105" y="90" fill="#94a3b8" font-size="7" text-anchor="middle">Tenzo 4-20mA</text>
              <circle cx="92" cy="100" r="3" fill="#10b981" />
              <circle cx="118" cy="100" r="3" fill="#ef4444" />
              <text x="105" y="130" fill="#f8fafc" font-size="8" text-anchor="middle" font-weight="bold">Danfoss MBS</text>
            </g>
          </svg>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:10px;">
          <div class="digital-display-card" style="padding:10px;">
            <div class="display-label">Chiqish toki (4-20 mA)</div>
            <div class="display-value" id="ps-ma-val" style="font-size:1.6rem;">8.80 <span class="unit">mA</span></div>
            <div class="display-sub">I = 4 + (P / 10) · 16 mA</div>
          </div>
          <div class="digital-display-card" style="padding:10px;">
            <div class="display-label">Mutlaq bosim (P_abs)</div>
            <div class="display-value" id="ps-abs-val" style="font-size:1.6rem; color:#22c55e;">4.013 <span class="unit">bar</span></div>
            <div class="display-sub" id="ps-abs-sub">401.3 kPa (3010 mm Hg)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. YANGI: GOST 2405-88 MANOMETRNI DAVLAT QIYOSLASH PROTOKOLI (GISTEREZIS VA VARIATSIYA) -->
    <div class="card" style="margin-top:14px; border:1px solid var(--border-color); padding:14px;">
      <div class="stand-card-header" style="margin-bottom:10px;">
        <span>📋 GOST 2405-88 Davlat Qiyoslash Protokoli (Gisterezis va Asbob Variatsiyasi)</span>
        <span class="stand-sub-badge" style="background:#0284c7; color:#fff;">Klass 1.0 Sinovi</span>
      </div>

      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
        Texnik manometrlarning asosiy xatoligi va variatsiyasini (gisterezisini) aniqlash uchun to'g'ri (ko'tarilish) va teskari (tushish) yurish bo'yicha etalon MP-60 bilan qiyoslanadi.
      </p>

      <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" id="ps-btn-start-calib" style="flex:1;">
          ▶️ Avtomatik To'liq Qiyoslash Davrini O'tkazish (0 ➔ 10 ➔ 0 bar)
        </button>
        <button class="btn btn-primary btn-sm" id="ps-btn-save-calib" style="flex:1;">
          📝 Qiyoslash Protokolini Jurnalga Saqlash
        </button>
      </div>

      <div class="table-responsive">
        <table class="report-table" style="font-size:0.82rem; width:100%; text-align:center;">
          <thead>
            <tr>
              <th>Etalon P_et (bar)</th>
              <th>To'g'ri yurish P_to'g'ri (bar)</th>
              <th>Teskari yurish P_teskari (bar)</th>
              <th>Xato Δ_to'g'ri (bar)</th>
              <th>Xato Δ_teskari (bar)</th>
              <th>Variatsiya b = |P_t - P_tes| (bar)</th>
              <th>Keltirilgan xato γ (%)</th>
            </tr>
          </thead>
          <tbody id="ps-calib-tbody">
            <tr><td>0.0</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.0%</td></tr>
            <tr><td>2.0</td><td>1.98</td><td>2.03</td><td>-0.02</td><td>+0.03</td><td>0.05</td><td>0.3%</td></tr>
            <tr><td>4.0</td><td>3.97</td><td>4.04</td><td>-0.03</td><td>+0.04</td><td>0.07</td><td>0.4%</td></tr>
            <tr><td>6.0</td><td>5.96</td><td>6.05</td><td>-0.04</td><td>+0.05</td><td>0.09</td><td>0.5%</td></tr>
            <tr><td>8.0</td><td>7.97</td><td>8.04</td><td>-0.03</td><td>+0.04</td><td>0.07</td><td>0.4%</td></tr>
            <tr><td>10.0</td><td>9.98</td><td>9.98</td><td>-0.02</td><td>-0.02</td><td>0.00</td><td>0.2%</td></tr>
          </tbody>
        </table>
      </div>

      <div id="ps-calib-verdict" style="margin-top:10px; background:#10b98115; border:1px solid #10b981; border-radius:6px; padding:10px 14px; font-size:0.85rem; color:#10b981;">
        <strong>✅ QIYOSLASH XULOSASI:</strong> Asbobning maksimal keltirilgan xatosi γ_max = 0.50% &le; 1.0% va maksimal variatsiyasi b_max = 0.09 bar &le; 0.10 bar. Manometr GOST 2405-88 bo'yicha <strong>1.0 aniqlik sinfiga TO'LIQ MOS KELADI</strong> va sanoatda qo'llashga YAROQLI!
      </div>
    </div>
  `;

  const pressIn = document.getElementById('ps-press');
  const pressVal = document.getElementById('ps-press-val');
  const pressMpa = document.getElementById('ps-press-mpa');
  const burdonNeedle = document.getElementById('burdon-needle');
  const burdonTxt = document.getElementById('burdon-txt');
  const burdonTube = document.getElementById('burdon-tube');
  const burdonLink = document.getElementById('burdon-link');
  const uMercuryPath = document.getElementById('u-mercury-path');
  const uMeniscusL = document.getElementById('u-meniscus-left');
  const uMeniscusR = document.getElementById('u-meniscus-right');
  const uMmhgTxt = document.getElementById('u-mmhg-txt');
  const weightsCount = document.getElementById('ps-weights-count');
  const maVal = document.getElementById('ps-ma-val');
  const absVal = document.getElementById('ps-abs-val');
  const absSub = document.getElementById('ps-abs-sub');
  const absFormula = document.getElementById('ps-abs-formula');
  const svgMaTxt = document.getElementById('ps-svg-ma-txt');
  const releaseBtn = document.getElementById('ps-release-valve-btn');
  const psBleedSteam = document.getElementById('ps-bleed-steam');
  const mpRotatingDisks = document.getElementById('mp-rotating-disks');

  const add05Btn = document.getElementById('ps-add-05');
  const add10Btn = document.getElementById('ps-add-10');
  const add20Btn = document.getElementById('ps-add-20');

  const btnStartCalib = document.getElementById('ps-btn-start-calib');
  const btnSaveCalib = document.getElementById('ps-btn-save-calib');
  const calibTbody = document.getElementById('ps-calib-tbody');
  const calibVerdict = document.getElementById('ps-calib-verdict');

  function boostWeightSpin() {
    const glimmer = document.querySelector('.weights-glimmer');
    if (!glimmer) return;
    glimmer.style.animationDuration = '0.35s';
    setTimeout(() => {
      if (glimmer) glimmer.style.animationDuration = '0.7s';
    }, 1200);
  }

  function update() {
    AudioFX.click();
    const p = parseFloat(pressIn.value);
    pressVal.textContent = p.toFixed(1);
    pressMpa.textContent = (p * 0.1).toFixed(3);
    burdonTxt.textContent = p.toFixed(1) + ' bar';

    const angle = (p / 10) * 270 - 135;
    burdonNeedle.style.transform = 'rotate(' + angle + 'deg)';
    burdonNeedle.setAttribute('transform', 'rotate(' + angle + ')');
    if (p > 0.5) burdonNeedle.classList.add('needle-tremor');
    else burdonNeedle.classList.remove('needle-tremor');

    if (mpRotatingDisks) {
      const pistonElev = 42 - (p * 1.2);
      mpRotatingDisks.setAttribute('transform', 'translate(30, ' + pistonElev.toFixed(1) + ')');
    }

    const uncoilX = 88 + (p * 0.8);
    const uncoilY = 42 - (p * 0.6);
    burdonTube.setAttribute('d', 'M 55 92 A 36 36 0 1 1 ' + uncoilX + ' ' + uncoilY);
    burdonLink.setAttribute('x1', uncoilX);
    burdonLink.setAttribute('y1', uncoilY);

    const deltaPx = Math.min(30, p * 3);
    const leftY = 70 + deltaPx;
    const rightY = 70 - deltaPx;
    uMercuryPath.setAttribute('d', 'M 32 ' + leftY + ' L 32 120 A 8 8 0 0 0 48 120 L 48 ' + rightY);
    uMeniscusL.setAttribute('cy', leftY);
    uMeniscusR.setAttribute('cy', rightY);
    const mmHg = Math.round(p * 75.0);
    uMmhgTxt.textContent = 'Δh: ' + mmHg + ' mm Hg';

    const wCount = Math.round(p);
    weightsCount.textContent = wCount + ' dona (' + p.toFixed(1) + ' bar)';

    const current = 4 + (p / 10) * 16;
    maVal.innerHTML = current.toFixed(2) + ' <span class="unit">mA</span>';
    if (svgMaTxt) svgMaTxt.textContent = current.toFixed(2) + ' mA';

    const p_abs = p + 1.013;
    absVal.innerHTML = p_abs.toFixed(3) + ' <span class="unit">bar</span>';
    absSub.textContent = (p_abs * 100).toFixed(1) + ' kPa (' + Math.round(p_abs * 750.06) + ' mm Hg)';
    absFormula.textContent = 'P_mutlaq = P_ort (' + p.toFixed(1) + ') + P_atm (1.013) = ' + p_abs.toFixed(3) + ' bar (' + (p_abs * 100).toFixed(1) + ' kPa)';
  }

  pressIn.oninput = update;

  add05Btn.onclick = () => {
    pressIn.value = Math.min(10, parseFloat(pressIn.value) + 0.5);
    boostWeightSpin();
    update();
  };
  add10Btn.onclick = () => {
    pressIn.value = Math.min(10, parseFloat(pressIn.value) + 1.0);
    boostWeightSpin();
    update();
  };
  add20Btn.onclick = () => {
    pressIn.value = Math.min(10, parseFloat(pressIn.value) + 2.0);
    boostWeightSpin();
    update();
  };

  releaseBtn.onclick = () => {
    AudioFX.airHiss();
    if (psBleedSteam) psBleedSteam.style.display = 'inline';
    let cur = parseFloat(pressIn.value);
    const intv = setInterval(() => {
      cur *= 0.6;
      if (cur < 0.05) {
        cur = 0;
        clearInterval(intv);
        if (psBleedSteam) psBleedSteam.style.display = 'none';
      }
      pressIn.value = cur;
      update();
    }, 60);
  };

  // AVTOMATIK QIYOSLASH DAVRI (0 -> 10 -> 0 bar)
  btnStartCalib.onclick = () => {
    if (calibRunning) return;
    calibRunning = true;
    AudioFX.success();
    btnStartCalib.textContent = "⏳ Qiyoslash sikli bajarilmoqda...";
    btnStartCalib.disabled = true;

    const testPoints = [0, 2, 4, 6, 8, 10];
    let ptIdx = 0;
    let isReverse = false;
    const directVals = {};
    const reverseVals = {};

    const timer = setInterval(() => {
      let p_target;
      if (!isReverse) {
        p_target = testPoints[ptIdx];
        pressIn.value = p_target;
        update();
        // Burdon to'g'ri yurishda elastik kechikish: -0.02..-0.04 bar
        const hystLag = p_target === 0 || p_target === 10 ? 0 : -0.01 - (Math.sin(p_target / 10 * Math.PI) * 0.035);
        directVals[p_target] = p_target + hystLag;

        ptIdx++;
        if (ptIdx >= testPoints.length) {
          isReverse = true;
          ptIdx = testPoints.length - 2;
        }
      } else {
        p_target = testPoints[ptIdx];
        pressIn.value = p_target;
        update();
        // Burdon teskari yurishda elastik qoldiq: +0.03..+0.05 bar
        const hystLead = p_target === 0 || p_target === 10 ? 0 : +0.01 + (Math.sin(p_target / 10 * Math.PI) * 0.045);
        reverseVals[p_target] = p_target + hystLead;

        ptIdx--;
        if (ptIdx < 0) {
          clearInterval(timer);
          calibRunning = false;
          btnStartCalib.textContent = "▶️ Avtomatik To'liq Qiyoslash Davrini O'tkazish (0 ➔ 10 ➔ 0 bar)";
          btnStartCalib.disabled = false;
          reverseVals[10] = directVals[10];

          // Jadvalni to'ldirish
          let html = '';
          let maxErr = 0;
          let maxVar = 0;

          testPoints.forEach(p => {
            const p_dir = directVals[p];
            const p_rev = reverseVals[p];
            const d_dir = p_dir - p;
            const d_rev = p_rev - p;
            const variation = Math.abs(p_dir - p_rev);
            const gamma = (Math.max(Math.abs(d_dir), Math.abs(d_rev)) / 10) * 100;

            if (Math.abs(d_dir) > maxErr) maxErr = Math.abs(d_dir);
            if (Math.abs(d_rev) > maxErr) maxErr = Math.abs(d_rev);
            if (variation > maxVar) maxVar = variation;

            html += '<tr>' +
              '<td>' + p.toFixed(1) + '</td>' +
              '<td>' + p_dir.toFixed(2) + '</td>' +
              '<td>' + p_rev.toFixed(2) + '</td>' +
              '<td>' + (d_dir >= 0 ? '+' : '') + d_dir.toFixed(2) + '</td>' +
              '<td>' + (d_rev >= 0 ? '+' : '') + d_rev.toFixed(2) + '</td>' +
              '<td>' + variation.toFixed(2) + '</td>' +
              '<td>' + gamma.toFixed(1) + '%</td>' +
            '</tr>';
          });

          calibTbody.innerHTML = html;
          const gammaMax = (maxErr / 10) * 100;

          calibVerdict.innerHTML = '<strong>✅ QIYOSLASH XULOSASI:</strong> Asbobning maksimal keltirilgan xatosi γ_max = ' +
            gammaMax.toFixed(2) + '% &le; 1.0% va maksimal variatsiyasi b_max = ' + maxVar.toFixed(2) + ' bar &le; 0.10 bar. ' +
            'Manometr GOST 2405-88 bo\'yicha <strong>1.0 aniqlik sinfiga TO\'LIQ MOS KELADI</strong> va sanoatda qo\'llashga YAROQLI!';
        }
      }
    }, 350);
  };

  btnSaveCalib.onclick = () => {
    AudioFX.success();
    logCurrentMeasurement(6);
  };

  update();
}

// --- SIMULYATOR 7: O'LCHOV DIAFRAGMASINI TARIRLASH (KALIBRLASH) ---
function setupOrificeSim(container) {
  let currentDevice = 'orifice'; // 'orifice', 'venturi', 'nozzle'

  container.innerHTML = `
    <div class="sim-grid-2">
      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🎛 Gidrodinamik Quvur Stendi Nazorati</span>
          <span class="stand-sub-badge">ГОСТ 8.586.1..5-2005</span>
        </div>

        <div class="control-group">
          <label>Toraytiruvchi qurilma turi (Birlamchi datchik):</label>
          <select id="orf-device-type" class="form-input">
            <option value="orifice" selected>1. Standart diafragma (ГОСТ 8.586.2) — O'tkir qirrali yassi disk</option>
            <option value="venturi">2. Venturi quvuri (ГОСТ 8.586.4) — Konusli konfuzor va diffuzor</option>
            <option value="nozzle">3. Standart soplo (ГОСТ 8.586.3) — Dumaloq profilli soplo</option>
          </select>
        </div>

        <div class="control-group">
          <label>Quvurdagi suv sarfi (Q): <span id="orf-q-val" class="badge">4.0</span> m³/soat</label>
          <input type="range" id="orf-q" min="0" max="8" step="0.2" value="4.0" class="slider" />
        </div>

        <div class="control-group">
          <label>Nasos quvvati va Drossel ventili (Tezkor o'rnatish):</label>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px;">
            <button class="btn btn-secondary btn-sm" id="orf-btn-2">2.0 m³/h</button>
            <button class="btn btn-secondary btn-sm" id="orf-btn-4">4.0 m³/h</button>
            <button class="btn btn-secondary btn-sm" id="orf-btn-6">6.0 m³/h</button>
            <button class="btn btn-secondary btn-sm" id="orf-btn-8">8.0 m³/h</button>
          </div>
        </div>

        <div class="control-group" style="background:var(--bg-main); padding:10px; border-radius:8px; border:1px solid var(--border-color); font-size:0.85rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Quvur diametri (D): <strong>50 mm</strong></span>
            <span>Teshik diametri (d): <strong>25 mm</strong></span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Modul (m = d²/D²): <strong>0.250</strong></span>
            <span>Muhit: <strong>Suv (1000 kg/m³)</strong></span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Oqim tezligi: <strong id="orf-vel-txt">0.57 m/s</strong></span>
            <span>Reynolds soni: <strong id="orf-re-txt" style="color:var(--primary);">Re ≈ 28,300</strong></span>
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(7)" style="flex:1;">📝 Jurnalga yozish</button>
        </div>
      </div>

      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>📊 Differensial Bosim va Bosim Yo'qolishi</span>
          <span class="stand-sub-badge">Metran-150 / DMD-331</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
          <div class="digital-display-card" style="padding:10px;">
            <div class="display-label">Differensial bosim (ΔP)</div>
            <div class="display-value" id="orf-dp-val" style="color:#38bdf8; font-size:1.6rem;">16.00 <span class="unit">kPa</span></div>
            <div class="display-sub" id="orf-sub-calc">√ΔP = 4.00 kPa^0.5</div>
          </div>
          <div class="digital-display-card" style="padding:10px;">
            <div class="display-label">Tiklanmas bosim yo'qolishi</div>
            <div class="display-value" id="orf-loss-val" style="color:#ef4444; font-size:1.6rem;">10.40 <span class="unit">kPa</span></div>
            <div class="display-sub" id="orf-loss-sub">Yo'qotish ulushi: 65% (Diafragma)</div>
          </div>
        </div>

        <!-- Shaffof quvur va Piezometr ustunlari SVG -->
        <div class="vis-box" style="position:relative; background:#070d19; border-radius:12px; margin-top:10px; padding:6px; overflow:hidden;">
          <svg viewBox="0 0 380 185" class="sim-svg">
            <defs>
              <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0.95" />
              </linearGradient>
            </defs>

            <!-- 1. Piezometr shisha ustunlari -->
            <rect x="110" y="20" width="16" height="75" fill="#1e293b" opacity="0.5" stroke="#475569" stroke-width="1.5" rx="2" />
            <rect id="orf-piezo-1" class="meniscus-slosh" x="112" y="35" width="12" height="60" fill="url(#water-grad)" rx="1" />
            <text x="118" y="15" fill="#38bdf8" font-size="8" text-anchor="middle" font-weight="bold">h1 (P1)</text>

            <rect x="230" y="20" width="16" height="75" fill="#1e293b" opacity="0.5" stroke="#475569" stroke-width="1.5" rx="2" />
            <rect id="orf-piezo-2" class="meniscus-slosh" x="232" y="65" width="12" height="30" fill="url(#water-grad)" rx="1" />
            <text x="238" y="15" fill="#38bdf8" font-size="8" text-anchor="middle" font-weight="bold">h2 (P2)</text>

            <line id="orf-delta-line-1" x1="126" y1="35" x2="232" y2="35" stroke="#f59e0b" stroke-dasharray="3 2" stroke-width="1.5" />
            <line id="orf-delta-line-2" x1="230" y1="65" x2="260" y2="65" stroke="#f59e0b" stroke-dasharray="3 2" stroke-width="1.5" />
            <text x="180" y="32" fill="#fbbf24" font-size="8" text-anchor="middle" font-weight="bold" id="orf-svg-dh-txt">Δh = 1630 mm</text>

            <!-- 2. Asosiy Shaffof Quvur -->
            <rect x="15" y="95" width="350" height="50" fill="#0c4a6e" opacity="0.25" rx="3" />
            <line x1="15" y1="95" x2="365" y2="95" stroke="#475569" stroke-width="3" />
            <line x1="15" y1="145" x2="365" y2="145" stroke="#475569" stroke-width="3" />

            <!-- Oqim chiziqlari -->
            <line x1="20" y1="110" x2="165" y2="110" stroke="#38bdf8" stroke-width="2.5" class="flowing-stream" opacity="0.8" />
            <line x1="20" y1="120" x2="165" y2="120" stroke="#38bdf8" stroke-width="3" class="flowing-stream" opacity="0.9" />
            <line x1="20" y1="130" x2="165" y2="130" stroke="#38bdf8" stroke-width="2.5" class="flowing-stream" opacity="0.8" />

            <line x1="175" y1="115" x2="360" y2="115" stroke="#0ea5e9" stroke-width="2.5" class="flowing-stream" opacity="0.8" />
            <line x1="175" y1="125" x2="360" y2="125" stroke="#0ea5e9" stroke-width="2.5" class="flowing-stream" opacity="0.8" />

            <!-- Turbulent uyurmalar (faqat diafragma va soploda kuchli) -->
            <g id="orf-vortices">
              <path d="M 175 104 Q 192 97 200 106 Q 192 115 175 108" fill="none" stroke="#38bdf8" stroke-width="1.8" opacity="0.7" stroke-dasharray="3 3" class="flowing-stream" />
              <path d="M 175 136 Q 192 143 200 134 Q 192 125 175 132" fill="none" stroke="#38bdf8" stroke-width="1.8" opacity="0.7" stroke-dasharray="3 3" class="flowing-stream" />
            </g>

            <!-- Flaneslar -->
            <rect x="160" y="88" width="10" height="64" fill="#334155" stroke="#64748b" stroke-width="1.5" />
            <rect x="170" y="88" width="10" height="64" fill="#334155" stroke="#64748b" stroke-width="1.5" />

            <!-- Toraytiruvchi qurilma dinamik SVG qismi -->
            <g id="orf-dynamic-device">
              <!-- Default: Diafragma (qizil yassi plastinka) -->
              <rect x="168" y="95" width="4" height="16" fill="#ef4444" id="orf-dev-top" />
              <rect x="168" y="129" width="4" height="16" fill="#ef4444" id="orf-dev-bot" />
            </g>

            <text x="170" y="82" fill="#ef4444" font-size="8" text-anchor="middle" font-weight="bold" id="orf-device-label">Standart Diafragma</text>

            <path d="M 60 120 L 90 120 M 80 115 L 90 120 L 80 125" stroke="#f8fafc" stroke-width="2" fill="none" stroke-linecap="round" />
            <text x="75" y="140" fill="#f8fafc" font-size="8" text-anchor="middle" font-weight="bold">Suv oqimi Q ➔</text>

            <!-- Drossel rostlovchi klapan mahovigi -->
            <g transform="translate(335, 90)">
              <rect x="-2" y="10" width="4" height="20" fill="#64748b" />
              <g id="orf-valve-wheel" style="transform-origin: 0px 0px; transition: transform 0.25s ease-out;">
                <circle cx="0" cy="0" r="11" fill="#f59e0b" stroke="#b45309" stroke-width="2" />
                <line x1="0" y1="-11" x2="0" y2="11" stroke="#b45309" stroke-width="2" />
                <line x1="-11" y1="0" x2="11" y2="0" stroke="#b45309" stroke-width="2" />
                <circle cx="0" cy="0" r="3" fill="#78350f" />
              </g>
              <text x="0" y="-15" fill="#fbbf24" font-size="7" text-anchor="middle" font-weight="bold">Ventil</text>
            </g>
          </svg>
        </div>

        <div class="calc-box" style="margin-top:10px;">
          <strong id="orf-calc-title">Bernulli va Gidrodinamik Taqqoslash:</strong>
          <div style="font-size:0.8rem; margin-top:2px;" id="orf-calc-desc">
            Q = K · √ΔP. Diafragma o'tkir qirrali bo'lgani sababli bosimning 65% i tiklanmaydi (yo'qoladi). Venturi quvurida esa diffuzor tufayli energiya yo'qolishi atigi 10-15% ni tashkil qiladi!
          </div>
        </div>
      </div>
    </div>
  `;

  const qIn = document.getElementById('orf-q');
  const qVal = document.getElementById('orf-q-val');
  const dpVal = document.getElementById('orf-dp-val');
  const lossVal = document.getElementById('orf-loss-val');
  const lossSub = document.getElementById('orf-loss-sub');
  const subCalc = document.getElementById('orf-sub-calc');
  const velTxt = document.getElementById('orf-vel-txt');
  const reTxt = document.getElementById('orf-re-txt');
  const deviceSel = document.getElementById('orf-device-type');
  const devLabel = document.getElementById('orf-device-label');
  const dynamicDevGroup = document.getElementById('orf-dynamic-device');
  const vorticesGroup = document.getElementById('orf-vortices');
  const calcDesc = document.getElementById('orf-calc-desc');

  const btn2 = document.getElementById('orf-btn-2');
  const btn4 = document.getElementById('orf-btn-4');
  const btn6 = document.getElementById('orf-btn-6');
  const btn8 = document.getElementById('orf-btn-8');

  const piezo1 = document.getElementById('orf-piezo-1');
  const piezo2 = document.getElementById('orf-piezo-2');
  const deltaLine1 = document.getElementById('orf-delta-line-1');
  const deltaLine2 = document.getElementById('orf-delta-line-2');
  const svgDhTxt = document.getElementById('orf-svg-dh-txt');
  const orfValveWheel = document.getElementById('orf-valve-wheel');

  function renderDeviceGeometry(devType) {
    if (devType === 'venturi') {
      devLabel.textContent = "Venturi quvuri (Diffuzorli)";
      devLabel.setAttribute('fill', '#10b981');
      vorticesGroup.style.display = 'none'; // Silliq oqim, girdobsiz
      // Konusli konfuzor va uzun diffuzor SVG
      dynamicDevGroup.innerHTML = `
        <!-- Konfuzor (Konussimon torayish) -->
        <polygon points="140,95 168,111 168,95" fill="#10b981" opacity="0.85" />
        <polygon points="140,145 168,129 168,145" fill="#10b981" opacity="0.85" />
        <!-- Bo'g'iz (Cylindrical throat) -->
        <rect x="168" y="95" width="8" height="16" fill="#059669" />
        <rect x="168" y="129" width="8" height="16" fill="#059669" />
        <!-- Diffuzor (Asta-sekin kengayish 7 gradus) -->
        <polygon points="176,111 230,95 176,95" fill="#10b981" opacity="0.85" />
        <polygon points="176,129 230,145 176,145" fill="#10b981" opacity="0.85" />
      `;
    } else if (devType === 'nozzle') {
      devLabel.textContent = "Standart Soplo (ГОСТ 8.586.3)";
      devLabel.setAttribute('fill', '#f59e0b');
      vorticesGroup.style.display = 'inline';
      dynamicDevGroup.innerHTML = `
        <!-- Dumaloq profilli soplo -->
        <path d="M 152 95 Q 168 95 168 111 L 172 111 L 172 95 Z" fill="#f59e0b" />
        <path d="M 152 145 Q 168 145 168 129 L 172 129 L 172 145 Z" fill="#f59e0b" />
      `;
    } else {
      devLabel.textContent = "Standart Diafragma (ГОСТ 8.586.2)";
      devLabel.setAttribute('fill', '#ef4444');
      vorticesGroup.style.display = 'inline';
      dynamicDevGroup.innerHTML = `
        <rect x="168" y="95" width="4" height="16" fill="#ef4444" />
        <rect x="168" y="129" width="4" height="16" fill="#ef4444" />
      `;
    }
  }

  function update() {
    AudioFX.click();
    const Q = parseFloat(qIn.value);
    qVal.textContent = Q.toFixed(1);
    currentDevice = deviceSel.value;
    renderDeviceGeometry(currentDevice);

    // K koeffitsienti qurilmaga bog'liq:
    // Diafragma: K = 1.0; Soplo: K = 1.05; Venturi: K = 1.15
    let K = 1.0;
    let lossRatio = 0.65; // Diafragma yo'qotishi 65%

    if (currentDevice === 'venturi') {
      K = 1.15;
      lossRatio = 0.12; // Venturi diffuzori bosimni 88% tiklaydi, yo'qotish atigi 12%!
      calcDesc.innerHTML = "💡 <strong>Venturi afzalligi:</strong> Kengayuvchi konus (diffuzor) kinetik energiyani yana statik bosimga aylantiradi. Tiklanmas bosim yo'qolishi atigi <strong>12%</strong>! Nasos energiyasi tejaladi. NMMC GMZ rudali pulpa quvurlarida aynan Venturi qo'llaniladi.";
    } else if (currentDevice === 'nozzle') {
      K = 1.06;
      lossRatio = 0.45;
      calcDesc.innerHTML = "💡 <strong>Standart Soplo:</strong> Silliq profil oqimni yo'naltiradi, yo'qotish <strong>45%</strong>. Yuqori tezlikdagi bug' va gaz quvurlarida diafragmaga nisbatan ancha yeyilishga chidamli.";
    } else {
      K = 1.0;
      lossRatio = 0.65;
      calcDesc.innerHTML = "💡 <strong>Standart Diafragma:</strong> O'tkir to'siq girdobli uyurmalar hosil qiladi, tiklanmas bosim yo'qolishi <strong>65%</strong>. Ishlab chiqarish va montaj qilish eng arzon va qulay standart vosita.";
    }

    const dP = Math.pow(Q / K, 2);
    const dP_loss = dP * lossRatio;

    dpVal.innerHTML = dP.toFixed(2) + ' <span class="unit">kPa</span>';
    lossVal.innerHTML = dP_loss.toFixed(2) + ' <span class="unit">kPa</span>';
    lossSub.textContent = 'Yo\'qotish: ' + (lossRatio * 100).toFixed(0) + '% | Nasos quvvat sarfi: ' + ((Q / 3600) * dP_loss * 1000).toFixed(1) + ' Vt';
    subCalc.textContent = '√ΔP = ' + Math.sqrt(dP).toFixed(2) + ' kPa^0.5 | K_tarirlash = ' + (dP > 0 ? (Q / Math.sqrt(dP)).toFixed(3) : '1.000');

    const v = (Q / 3600) / (Math.PI * Math.pow(0.025, 2));
    velTxt.textContent = v.toFixed(2) + ' m/s';

    const Re = Math.round((v * 0.05) / 1e-6);
    reTxt.textContent = 'Re ≈ ' + Re.toLocaleString() + ' (' + (Re > 4000 ? 'Turbulent' : 'Laminar') + ')';
    reTxt.style.color = Re > 4000 ? '#38bdf8' : '#10b981';

    const streams = document.querySelectorAll('#tab-content .flowing-stream');
    if (Q === 0) {
      streams.forEach(s => s.style.animationPlayState = 'paused');
    } else {
      const dur = Math.max(0.12, 1.6 / Q).toFixed(2) + 's';
      streams.forEach(s => {
        s.style.animationPlayState = 'running';
        s.style.animationDuration = dur;
      });
    }

    if (orfValveWheel) {
      orfValveWheel.style.transform = 'rotate(' + (Q * 60) + 'deg)';
      orfValveWheel.setAttribute('transform', 'rotate(' + (Q * 60) + ')');
    }

    const h1_y = Math.max(25, 60 - (Q * 3.5));
    const h1_height = 95 - h1_y;
    const h2_y = Math.min(85, 60 + (dP * 0.35));
    const h2_height = Math.max(10, 95 - h2_y);

    if (piezo1) {
      piezo1.setAttribute('y', h1_y);
      piezo1.setAttribute('height', h1_height);
    }
    if (piezo2) {
      piezo2.setAttribute('y', h2_y);
      piezo2.setAttribute('height', h2_height);
    }

    if (deltaLine1 && deltaLine2 && svgDhTxt) {
      deltaLine1.setAttribute('y1', h1_y);
      deltaLine1.setAttribute('y2', h1_y);
      deltaLine2.setAttribute('y1', h2_y);
      deltaLine2.setAttribute('y2', h2_y);
      const mmH2O = Math.round(dP * 101.97);
      svgDhTxt.textContent = 'Δh = ' + mmH2O + ' mm H2O';
      svgDhTxt.setAttribute('y', Math.max(20, h1_y - 4));
    }
  }

  qIn.oninput = update;
  deviceSel.onchange = update;

  btn2.onclick = () => { qIn.value = 2.0; update(); };
  btn4.onclick = () => { qIn.value = 4.0; update(); };
  btn6.onclick = () => { qIn.value = 6.0; update(); };
  btn8.onclick = () => { qIn.value = 8.0; update(); };

  update();
}

// --- SIMULYATOR 8: TRM1 REGULYATORI VA DISKRET ZADVISHKA ---
// --- SIMULYATOR 8: TRM1 REGULYATORI VA DISKRET ZADVISHKA BOSHQARUVI ---
let trm1Interval = null;
let trm1ProgMode = 'RUN'; // 'RUN', 'SP', 'HYST'
let trm1ControlMode = 'AUTO'; // 'AUTO', 'MANUAL'
let trm1Algo = 'relay'; // 'relay' yoki 'pid'
let trm1Integral = 0;

let trm1State = {
  pressure: 2.0,
  sp: 3.5, // Ustavka
  delta: 0.5, // Gisterezis
  valveOpen: false, // Rele holati
  valvePct: 0, // PID klapan ochiqligi (0 - 100%)
  kp: 2.5,
  ti: 6.0,
  pumpRunning: true,
  emergencyTrip: false,
  cycleCount: 0
};

function setupTRM1Sim(container) {
  trm1Integral = 0;

  container.innerHTML = `
    <div class="sim-grid-2">
      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🎛 Sanoat Mikrokontrolleri: ОВЕН ТРМ1 / ТРМ210</span>
          <span class="stand-sub-badge">RS-485 Modbus</span>
        </div>

        <!-- Algoritm tanlash -->
        <div class="control-group" style="margin-bottom:10px;">
          <label>Rostlash algoritmi (Regulyator qonuni):</label>
          <select id="trm-algo-select" class="form-input" style="font-weight:bold; color:var(--primary);">
            <option value="relay" selected>1. Ikki pozitsiyali (Releli) gisterezisli On-Off rostlash</option>
            <option value="pid">2. Uzluksiz PI/PID drossellash rostlagichi (Klapan %)</option>
          </select>
        </div>

        <!-- OWEN TRM1 KORPUSI -->
        <div class="trm1-device" style="background:#1e293b; border: 3px solid #334155; border-radius:12px; padding:15px; box-shadow:0 8px 16px rgba(0,0,0,0.5);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #475569; padding-bottom:6px; margin-bottom:10px;">
            <span style="font-weight:900; font-size:1.05rem; letter-spacing:1px; color:#f8fafc;" id="trm-brand-title">ОВЕН ТРМ1</span>
            <span id="trm1-mode-badge" class="stand-sub-badge" style="background:#0284c7; color:#fff;">REJIM: RUN (PV)</span>
          </div>

          <!-- 7-Segment Yorqin Qizil LED Displey -->
          <div style="background:#050505; border:3px solid #0f172a; border-radius:6px; padding:10px; text-align:center; box-shadow:inset 0 0 10px rgba(0,0,0,0.9); margin-bottom:12px;">
            <div id="trm-led-pv" style="font-family:'Courier New', monospace; font-size:2.8rem; font-weight:bold; color:#ef4444; text-shadow:0 0 12px #ef4444; letter-spacing:4px;">
              02.00
            </div>
            <div id="trm-led-sub" style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase; margin-top:2px;">
              Joriy bosim PV (bar)
            </div>
          </div>

          <!-- LED Indikatorlar -->
          <div style="display:flex; justify-content:space-around; align-items:center; background:#0f172a; padding:6px; border-radius:6px; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span id="trm-k1-led" class="indicator-lamp"></span>
              <span style="font-size:0.75rem; font-weight:700; color:#cbd5e1;" id="trm-k1-label">К1 (Rele)</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span id="trm-alarm-led" class="indicator-lamp"></span>
              <span style="font-size:0.75rem; font-weight:700; color:#ef4444;">AVARIYA</span>
            </div>
          </div>

          <!-- Klaviaturasi: ПРОГ, ▲, ▼ -->
          <div style="display:flex; justify-content:space-between; gap:8px;">
            <button class="tactile-btn" id="trm-btn-prog" style="flex:1.2; padding:8px 4px; background:#334155; color:#38bdf8;">ПРОГ (Rejim)</button>
            <button class="tactile-btn" id="trm-btn-up" style="flex:1; padding:8px 4px; font-size:0.9rem;">▲</button>
            <button class="tactile-btn" id="trm-btn-down" style="flex:1; padding:8px 4px; font-size:0.9rem;">▼</button>
          </div>
        </div>

        <!-- PID parametrlar bloki (faqat PID rejimida ko'rinadi) -->
        <div id="trm-pid-params-box" style="display:none; margin-top:10px; background:var(--bg-main); padding:10px; border-radius:8px; border:1px solid var(--border-color);">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div>
              <label style="font-size:0.75rem;">Proporsional Kp: <span id="trm-kp-val" class="badge">2.5</span></label>
              <input type="range" id="trm-kp-slider" min="0.5" max="5.0" step="0.1" value="2.5" class="slider" />
            </div>
            <div>
              <label style="font-size:0.75rem;">Integral Ti: <span id="trm-ti-val" class="badge">6.0</span> s</label>
              <input type="range" id="trm-ti-slider" min="1.0" max="15.0" step="0.5" value="6.0" class="slider" />
            </div>
          </div>
        </div>

        <!-- Boshqaruv sozlamalari -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:10px;">
          <div class="control-group" style="margin:0;">
            <label style="font-size:0.75rem;">Boshqaruv rejimi:</label>
            <select id="trm-ctrl-mode" class="form-input" style="padding:6px; font-size:0.8rem;">
              <option value="AUTO" selected>Avtomatik (TRM1 Nazorat)</option>
              <option value="MANUAL">Qo'lda (Manual Override)</option>
            </select>
          </div>
          <div class="control-group" style="margin:0;">
            <label style="font-size:0.75rem;">Nasos quvvati:</label>
            <button class="btn btn-secondary btn-sm" id="trm-pump-toggle" style="width:100%; padding:6px; font-size:0.8rem;">⏹ Nasos: ON</button>
          </div>
        </div>

        <div id="trm-manual-controls" style="display:none; margin-top:8px;">
          <button class="btn btn-primary btn-sm" id="trm-manual-valve-btn" style="width:100%;">🚪 Zadvishkani OCHISH / YOPISH (Qo'lda)</button>
        </div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="btn btn-primary btn-sm" onclick="logCurrentMeasurement(8)" style="flex:1;">📝 Jurnalga yozish</button>
        </div>
      </div>

      <div class="sim-panel card">
        <div class="stand-card-header">
          <span>🏭 Rezervuar & Diskret Zadvishka Stendi</span>
          <span class="stand-sub-badge">Pnevmo-Gidravlika</span>
        </div>

        <!-- Vizual Stend SVG -->
        <div class="tank-vis-box" style="background:#090e17; border-radius:12px; padding:6px;">
          <svg viewBox="0 0 350 185" class="sim-svg">
            <defs>
              <linearGradient id="tank-water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.95" />
              </linearGradient>
            </defs>

            <rect x="25" y="30" width="115" height="135" rx="10" fill="#1e293b" stroke="#475569" stroke-width="3" />
            <rect x="30" y="38" width="105" height="122" rx="6" fill="#0f172a" />
            <rect id="tank-fluid" class="meniscus-slosh" x="30" y="100" width="105" height="60" fill="url(#tank-water-grad)" rx="4" />

            <!-- Pufakchalar -->
            <circle cx="55" cy="135" r="2.5" fill="#bae6fd" opacity="0.7" style="animation: bubbleFloat 1.2s infinite;" />
            <circle cx="85" cy="145" r="3" fill="#bae6fd" opacity="0.7" style="animation: bubbleFloat 1.5s infinite 0.2s;" />
            <circle cx="110" cy="140" r="2.5" fill="#bae6fd" opacity="0.7" style="animation: bubbleFloat 1.3s infinite 0.4s;" />

            <g class="heat-shimmer" style="opacity:0.35;">
              <path d="M 50 65 Q 60 55 70 65 Q 80 75 90 65" stroke="#bae6fd" stroke-width="2" fill="none"/>
            </g>

            <text x="82" y="115" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle" id="tank-p-txt">2.00 bar</text>

            <!-- Avariya bug'i -->
            <g id="tank-safety-steam" class="steam-jet-active" style="display:none; transform-origin: 82px 10px;">
              <ellipse cx="82" cy="5" rx="10" ry="4" fill="#f8fafc" opacity="0.9" />
              <ellipse cx="80" cy="-6" rx="16" ry="6" fill="#e2e8f0" opacity="0.7" />
              <ellipse cx="84" cy="-18" rx="22" ry="8" fill="#cbd5e1" opacity="0.4" />
            </g>

            <g transform="translate(70, 10)">
              <rect x="6" y="10" width="12" height="12" fill="#ef4444" rx="2" />
              <circle cx="12" cy="7" r="4" fill="#f8fafc" />
              <text x="12" y="4" font-size="7" fill="#ef4444" text-anchor="middle" font-weight="bold">Klapan</text>
            </g>

            <rect x="140" y="125" width="180" height="22" fill="#334155" stroke="#475569" stroke-width="2" />

            <!-- Oqim magistrali -->
            <line id="valve-flow-stream" x1="250" y1="136" x2="320" y2="136" stroke="#38bdf8" stroke-width="6" class="flowing-stream" style="display:none;" />

            <!-- Zadvishka -->
            <g id="valve-graphic" transform="translate(190, 105)">
              <rect x="18" y="-12" width="24" height="20" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" rx="3" />
              <text x="30" y="2" font-size="7" text-anchor="middle" font-weight="bold" fill="#0f172a" id="valve-icon-txt">M</text>
              <line id="valve-stem" x1="30" y1="8" x2="30" y2="28" stroke="#cbd5e1" stroke-width="3" style="transition: all 0.3s ease-out;" />
              <polygon points="10,20 10,42 30,31" fill="#ef4444" id="valve-left" />
              <polygon points="50,20 50,42 30,31" fill="#ef4444" id="valve-right" />
            </g>

            <text x="220" y="165" font-size="9" font-weight="bold" text-anchor="middle" id="valve-status-txt" fill="#ef4444">Zadvishka: YOPIQ</text>
            <text x="82" y="176" font-size="8" fill="#94a3b8" text-anchor="middle">Rezervuar hajmi: 2.5 m³</text>
          </svg>
        </div>

        <!-- PID Klapan Ochiqligi Shkalasi -->
        <div id="trm-pid-bar-card" style="display:none; margin-top:8px; background:var(--bg-main); padding:8px 12px; border-radius:6px; border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
            <span>Klapan ochilish darajasi:</span>
            <strong id="trm-pid-pct-txt" style="color:var(--primary);">0%</strong>
          </div>
          <div style="background:#0f172a; height:10px; border-radius:5px; overflow:hidden;">
            <div id="trm-pid-bar" style="width:0%; height:100%; background:linear-gradient(90deg, #38bdf8, #22c55e); transition:width 0.2s;"></div>
          </div>
        </div>

        <div class="calc-box" style="margin-top:10px;">
          <strong id="trm-logic-title">Releli boshqaruv mantig'i:</strong>
          <div id="trm-logic-status" style="font-size:0.8rem; margin-top:2px;">
            P_on = SP + Δ = 3.5 + 0.5 = 4.0 bar (Ochiladi) | P_off = SP - Δ = 3.0 bar (Yopiladi)
          </div>
        </div>
      </div>
    </div>
  `;

  const ledPv = document.getElementById('trm-led-pv');
  const ledSub = document.getElementById('trm-led-sub');
  const ledK1 = document.getElementById('trm-k1-led');
  const ledK1Label = document.getElementById('trm-k1-label');
  const ledAlarm = document.getElementById('trm-alarm-led');
  const modeBadge = document.getElementById('trm1-mode-badge');
  const brandTitle = document.getElementById('trm-brand-title');

  const btnProg = document.getElementById('trm-btn-prog');
  const btnUp = document.getElementById('trm-btn-up');
  const btnDown = document.getElementById('trm-btn-down');

  const algoSel = document.getElementById('trm-algo-select');
  const pidParamsBox = document.getElementById('trm-pid-params-box');
  const pidBarCard = document.getElementById('trm-pid-bar-card');
  const pidBar = document.getElementById('trm-pid-bar');
  const pidPctTxt = document.getElementById('trm-pid-pct-txt');
  const kpSlider = document.getElementById('trm-kp-slider');
  const tiSlider = document.getElementById('trm-ti-slider');
  const kpVal = document.getElementById('trm-kp-val');
  const tiVal = document.getElementById('trm-ti-val');

  const ctrlModeSel = document.getElementById('trm-ctrl-mode');
  const manualControls = document.getElementById('trm-manual-controls');
  const manualValveBtn = document.getElementById('trm-manual-valve-btn');
  const pumpBtn = document.getElementById('trm-pump-toggle');

  const tankFluid = document.getElementById('tank-fluid');
  const tankPTxt = document.getElementById('tank-p-txt');
  const valveLeft = document.getElementById('valve-left');
  const valveRight = document.getElementById('valve-right');
  const valveStatus = document.getElementById('valve-status-txt');
  const valveFlowStream = document.getElementById('valve-flow-stream');
  const valveStem = document.getElementById('valve-stem');
  const logicTitle = document.getElementById('trm-logic-title');
  const logicStatus = document.getElementById('trm-logic-status');
  const tankSafetySteam = document.getElementById('tank-safety-steam');

  algoSel.onchange = () => {
    AudioFX.click();
    trm1Algo = algoSel.value;
    trm1Integral = 0;
    if (trm1Algo === 'pid') {
      brandTitle.textContent = "ОВЕН ТРМ210 (PID)";
      ledK1Label.textContent = "Klapan %";
      pidParamsBox.style.display = 'block';
      pidBarCard.style.display = 'block';
      logicTitle.textContent = "Uzluksiz PI/PID boshqaruv tenglamasi:";
      logicStatus.innerHTML = "u(t) = K_p · e(t) + K_i · ∫e(t)dt. Klapan doimiy ravishda drossellanib, bosimni aniq <strong>3.50 bar</strong> da tebranishsiz ushlab turadi!";
    } else {
      brandTitle.textContent = "ОВЕН ТРМ1";
      ledK1Label.textContent = "К1 (Rele)";
      pidParamsBox.style.display = 'none';
      pidBarCard.style.display = 'none';
      logicTitle.textContent = "Releli boshqaruv mantig'i:";
      logicStatus.innerHTML = "P_on = SP + Δ = " + (trm1State.sp + trm1State.delta).toFixed(1) + " bar | P_off = SP - Δ = " + (trm1State.sp - trm1State.delta).toFixed(1) + " bar";
    }
  };

  kpSlider.oninput = () => {
    trm1State.kp = parseFloat(kpSlider.value);
    kpVal.textContent = trm1State.kp.toFixed(1);
  };

  tiSlider.oninput = () => {
    trm1State.ti = parseFloat(tiSlider.value);
    tiVal.textContent = trm1State.ti.toFixed(1);
  };

  btnProg.onclick = () => {
    AudioFX.click();
    if (trm1ProgMode === 'RUN') {
      trm1ProgMode = 'SP';
      modeBadge.textContent = "SOZLASH: USTAVKA (SP)";
      modeBadge.style.background = "#eab308";
      ledSub.textContent = "Ustavka bosimi (SP)";
      ledPv.textContent = 'SP ' + trm1State.sp.toFixed(1);
    } else if (trm1ProgMode === 'SP') {
      trm1ProgMode = 'HYST';
      modeBadge.textContent = "SOZLASH: GISTEREZIS (Δ)";
      modeBadge.style.background = "#f97316";
      ledSub.textContent = "Gisterezis zonasi (Δ)";
      ledPv.textContent = 'd  ' + trm1State.delta.toFixed(1);
    } else {
      trm1ProgMode = 'RUN';
      modeBadge.textContent = "REJIM: RUN (PV)";
      modeBadge.style.background = "#0284c7";
      ledSub.textContent = "Joriy bosim PV (bar)";
      ledPv.textContent = trm1State.pressure.toFixed(2).padStart(5, '0');
    }
  };

  btnUp.onclick = () => {
    AudioFX.click();
    if (trm1ProgMode === 'SP') {
      trm1State.sp = Math.min(5.5, trm1State.sp + 0.1);
      ledPv.textContent = 'SP ' + trm1State.sp.toFixed(1);
    } else if (trm1ProgMode === 'HYST') {
      trm1State.delta = Math.min(1.5, trm1State.delta + 0.1);
      ledPv.textContent = 'd  ' + trm1State.delta.toFixed(1);
    }
  };

  btnDown.onclick = () => {
    AudioFX.click();
    if (trm1ProgMode === 'SP') {
      trm1State.sp = Math.max(1.0, trm1State.sp - 0.1);
      ledPv.textContent = 'SP ' + trm1State.sp.toFixed(1);
    } else if (trm1ProgMode === 'HYST') {
      trm1State.delta = Math.max(0.1, trm1State.delta - 0.1);
      ledPv.textContent = 'd  ' + trm1State.delta.toFixed(1);
    }
  };

  ctrlModeSel.onchange = () => {
    trm1ControlMode = ctrlModeSel.value;
    manualControls.style.display = trm1ControlMode === 'MANUAL' ? 'block' : 'none';
  };

  manualValveBtn.onclick = () => {
    trm1State.valveOpen = !trm1State.valveOpen;
    AudioFX.relayClick(trm1State.valveOpen);
  };

  pumpBtn.onclick = () => {
    trm1State.pumpRunning = !trm1State.pumpRunning;
    pumpBtn.textContent = trm1State.pumpRunning ? "⏹ Nasos: ON" : "▶️ Nasos: OFF";
  };

  if (trm1Interval) clearInterval(trm1Interval);

  trm1Interval = setInterval(() => {
    const dt = 0.2; // 200 ms qadam

    if (trm1Algo === 'relay') {
      // 1. RELELI GISTEREZIS REJIMI
      if (trm1State.pumpRunning) {
        trm1State.pressure += 0.07;
      }
      if (trm1State.valveOpen) {
        trm1State.pressure -= 0.15;
      }
      if (trm1State.pressure < 0.5) trm1State.pressure = 0.5;

      const pOn = trm1State.sp + trm1State.delta;
      const pOff = trm1State.sp - trm1State.delta;

      if (trm1ControlMode === 'AUTO') {
        if (trm1State.pressure >= pOn && !trm1State.valveOpen) {
          trm1State.valveOpen = true;
          trm1State.cycleCount++;
          AudioFX.relayClick(true);
        } else if (trm1State.pressure <= pOff && trm1State.valveOpen) {
          trm1State.valveOpen = false;
          AudioFX.relayClick(false);
        }
      }

      trm1State.valvePct = trm1State.valveOpen ? 100 : 0;
    } else {
      // 2. UZLUKSIZ PI / PID BOSHQARUV REJIMI
      const error = trm1State.pressure - trm1State.sp; // e = PV - SP
      trm1Integral += (error * dt);
      // Windup himoyasi
      if (trm1Integral > 30) trm1Integral = 30;
      if (trm1Integral < -30) trm1Integral = -30;

      // PID chiqishi: 0 dan 100% gacha
      let u = 40 + (trm1State.kp * error * 25) + (trm1Integral / trm1State.ti * 10);
      if (u < 0) u = 0;
      if (u > 100) u = 100;
      trm1State.valvePct = u;

      if (trm1State.pumpRunning) {
        trm1State.pressure += 0.08;
      }
      // Klapan oqim chiqishi uning ochiqlik foiziga proporsional
      const dischargeRate = (trm1State.valvePct / 100) * 0.18;
      trm1State.pressure -= dischargeRate;

      if (trm1State.pressure < 0.5) trm1State.pressure = 0.5;
      trm1State.valveOpen = trm1State.valvePct > 15;
    }

    // Avariya bosim chegarasi (6.5 bar)
    if (trm1State.pressure >= 6.5) {
      if (!trm1State.emergencyTrip) {
        trm1State.emergencyTrip = true;
        AudioFX.airHiss();
      }
      trm1State.pressure -= 0.25;
      ledAlarm.classList.add('on');
      if (tankSafetySteam) tankSafetySteam.style.display = 'inline';
    } else {
      trm1State.emergencyTrip = false;
      ledAlarm.classList.remove('on');
      if (tankSafetySteam) tankSafetySteam.style.display = 'none';
    }

    // Displey yangilash
    if (trm1ProgMode === 'RUN') {
      ledPv.textContent = trm1State.pressure.toFixed(2).padStart(5, '0');
    }
    tankPTxt.textContent = trm1State.pressure.toFixed(2) + ' bar';

    const fluidH = Math.min(120, Math.max(15, trm1State.pressure * 18));
    tankFluid.setAttribute('y', 160 - fluidH);
    tankFluid.setAttribute('height', fluidH);
    const tankWaveCrest = document.getElementById('tank-wave-crest');
    if (tankWaveCrest) {
      const topY = 160 - fluidH;
      tankWaveCrest.setAttribute('d', `M 30 ${topY} Q 56 ${topY - 3} 82 ${topY} T 135 ${topY}`);
    }
    const splashSpray = document.getElementById('valve-splash-spray');
    if (splashSpray) {
      splashSpray.style.display = (trm1State.valveOpen || trm1State.valvePct > 10) ? 'inline' : 'none';
    }

    if (trm1Algo === 'pid') {
      pidBar.style.width = trm1State.valvePct.toFixed(0) + '%';
      pidPctTxt.textContent = trm1State.valvePct.toFixed(1) + '% (Drossellash)';
    }

    if (trm1Algo === 'relay') {
      const pOn = trm1State.sp + trm1State.delta;
      const pOff = trm1State.sp - trm1State.delta;

      if (trm1State.valveOpen) {
        ledK1.classList.add('on');
        valveLeft.setAttribute('fill', '#2ecc71');
        valveRight.setAttribute('fill', '#2ecc71');
        valveStem.setAttribute('y1', -2);
        valveStem.setAttribute('y2', 18);
        valveStatus.textContent = "Zadvishka: OCHIQ (100%)";
        valveStatus.setAttribute('fill', '#2ecc71');
        valveFlowStream.style.display = 'inline';
        logicStatus.innerHTML = "🟢 Rele К1 ULANDI: P (" + trm1State.pressure.toFixed(2) + ") ≥ SP+Δ (" + pOn.toFixed(1) + " bar). Zadvishka ochiq!";
      } else {
        ledK1.classList.remove('on');
        valveLeft.setAttribute('fill', '#ef4444');
        valveRight.setAttribute('fill', '#ef4444');
        valveStem.setAttribute('y1', 8);
        valveStem.setAttribute('y2', 28);
        valveStatus.textContent = "Zadvishka: YOPIQ (0%)";
        valveStatus.setAttribute('fill', '#ef4444');
        valveFlowStream.style.display = 'none';
        logicStatus.innerHTML = "🔴 Rele К1 UZILGAN: P (" + trm1State.pressure.toFixed(2) + ") ≤ SP-Δ (" + pOff.toFixed(1) + " bar). Zadvishka yopiq.";
      }
    } else {
      // PID vizualizatsiyasi: stem siljishi proporsional
      const stemY = 8 - (trm1State.valvePct / 100) * 10;
      valveStem.setAttribute('y1', stemY.toFixed(1));
      valveStem.setAttribute('y2', (stemY + 20).toFixed(1));

      if (trm1State.valvePct > 5) {
        ledK1.classList.add('on');
        valveLeft.setAttribute('fill', '#38bdf8');
        valveRight.setAttribute('fill', '#38bdf8');
        valveStatus.textContent = 'PID Klapan: ' + trm1State.valvePct.toFixed(0) + '% Ochiq';
        valveStatus.setAttribute('fill', '#38bdf8');
        valveFlowStream.style.display = 'inline';
        valveFlowStream.setAttribute('stroke-width', Math.max(1.5, (trm1State.valvePct / 100) * 7).toFixed(1));
      } else {
        ledK1.classList.remove('on');
        valveLeft.setAttribute('fill', '#ef4444');
        valveRight.setAttribute('fill', '#ef4444');
        valveStatus.textContent = 'PID Klapan: Drossellangan (Yopiq)';
        valveStatus.setAttribute('fill', '#ef4444');
        valveFlowStream.style.display = 'none';
      }

      logicStatus.innerHTML = '⚖️ <strong>PID Dinamikasi:</strong> Xato e = ' + (trm1State.pressure - trm1State.sp).toFixed(2) +
        ' bar | Chiqish: <strong>' + trm1State.valvePct.toFixed(1) + '%</strong> | Bosim barqaror ustavka tomon intilmoqda!';
    }
  }, 200);
}

function resetSimulator(id) {
  loadLab(id);
  switchTab('simulator');
}

// 3. HISOBOT (REPORT) TABI
function renderReportTab(container, lab) {
  container.innerHTML = `
    <div class="report-wrapper">
      <div class="report-header-box">
        <h3>📝 Talabaning laboratoriya ishi hisoboti</h3>
        <p>Ma'lumotlaringizni to'ldiring va tayyor hisobotni PDF formatida chop eting yoki yuklab oling.</p>
      </div>

      <div class="card report-form-card" id="printable-report">
        <div class="report-official-header">
          <div class="rep-title-main">${universityInfo.university}</div>
          <div class="rep-title-sub">Kafedra: "${universityInfo.department}"</div>
          <div class="rep-title-doc">LABORATORIYA ISHI №${lab.id} HISOBOTI</div>
          <div class="rep-title-theme">Mavzu: <strong>${lab.title}</strong></div>
        </div>

        <div class="report-meta-inputs no-print">
          <div class="form-row">
            <div class="form-col">
              <label>Talaba F.I.Sh:</label>
              <input type="text" id="rep-student-name" class="form-input" placeholder="Masalan: Karimov Alisher Baxtiyorovich" value="${studentReport.studentName}" />
            </div>
            <div class="form-col">
              <label>Guruh:</label>
              <input type="text" id="rep-student-group" class="form-input" value="${studentReport.studentGroup}" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <label>O'qituvchi:</label>
              <input type="text" class="form-input" value="${universityInfo.teacher}" readonly />
            </div>
            <div class="form-col">
              <label>Sana:</label>
              <input type="text" class="form-input" value="${new Date().toLocaleDateString('uz-UZ')}" />
            </div>
          </div>
        </div>

        <div class="report-body-content">
          <h4>1. Ishning maqsadi</h4>
          <p>${lab.purpose}</p>

          <h4>2. O'lchov natijalari jadvali</h4>
          ${renderReportDataTable(lab)}

          <h4>3. Talabaning hisob-kitoblari va tahliliy xulosasi</h4>
          <div class="form-group no-print">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <label style="margin:0; font-weight:600;">Laboratoriya ishi bo'yicha shaxsiy xulosa va hisob-kitoblar:</label>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="insertReportTemplate(${lab.id}, 'formula')">📐 Formula</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="insertReportTemplate(${lab.id}, 'error')">🎯 Xatolik</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="insertReportTemplate(${lab.id}, 'industry')">🏭 Sanoat</button>
              </div>
            </div>
            <textarea id="rep-conclusion" class="form-textarea" rows="6" placeholder="Tajriba natijasida o'rganilgan qonuniyatlar, hisoblangan formulalar va xulosalar...">${(studentReport.conclusions && studentReport.conclusions[lab.id]) || studentReport.conclusion || ("Ushbu laboratoriya ishini bajarish davomida " + lab.title + " mavzusi amaliy stendda o'rganildi. Olingan tajriba natijalari nazariy formulalar bilan solishtirildi va hisoblangan xatolik ruxsat etilgan chegarada ekanligi aniqlandi.")}</textarea>
          </div>

          <div class="print-only conclusion-print-box">
            <p id="print-conclusion-text">${(studentReport.conclusions && studentReport.conclusions[lab.id]) || studentReport.conclusion || ("Ushbu laboratoriya ishini bajarish davomida " + lab.title + " mavzusi amaliy stendda o'rganildi. Olingan tajriba natijalari nazariy formulalar bilan solishtirildi va hisoblangan xatolik ruxsat etilgan chegarada ekanligi aniqlandi.")}</p>
          </div>

          <h4>4. Nazorat savollariga javoblar</h4>
          <div class="report-questions-section">
            ${lab.questions.map((q, idx) => {
              const userAns = (studentReport.answers && studentReport.answers[lab.id] && studentReport.answers[lab.id][idx]) || '';
              const hint = getQuestionHint(lab.id, idx);
              return `
              <div class="report-question-item" style="margin-bottom: 1rem; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(248, 250, 252, 0.6);">
                <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem; margin-bottom: 6px;">
                  <span class="badge" style="background:#2563eb; color:#fff; margin-right:6px;">${idx + 1}-savol</span>
                  ${q}
                </div>
                ${hint ? `
                  <details style="margin: 4px 0 8px 0; font-size: 0.8rem; color: #475569;" class="no-print">
                    <summary style="cursor: pointer; color: #2563eb; user-select: none;">💡 Yo'llanma & formulani ko'rish</summary>
                    <div style="padding: 6px 10px; background: #eff6ff; border-radius: 6px; margin-top: 4px; border-left: 3px solid #2563eb;">
                      ${hint}
                    </div>
                  </details>
                ` : ''}
                <div class="no-print">
                  <textarea
                    id="rep-ans-${lab.id}-${idx}"
                    class="form-textarea rep-question-textarea"
                    rows="3"
                    placeholder="${idx + 1}-savol bo'yicha batafsil javobingizni yozing..."
                    oninput="handleQuestionAnswerInput(${lab.id}, ${idx}, this.value)"
                  >${userAns}</textarea>
                </div>
                <div class="print-only question-answer-print">
                  <p><strong>Javob:</strong> <span id="print-ans-${lab.id}-${idx}">${userAns || '____________________________________________________________________'}</span></p>
                </div>
              </div>
              `;
            }).join('')}
          </div>

          <div class="signatures-row">
            <div class="sig-block">
              <div>Bajaruvchi talaba: _________________</div>
              <div class="sig-sub">(imzo)</div>
            </div>
            <div class="sig-block">
              <div>Qabul qiluvchi o'qituvchi: _________________</div>
              <div class="sig-sub">(imzo, baho)</div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-actions">
        <button class="btn btn-primary" onclick="printReport()"><span class="icon">🖨</span> Hisobotni chop etish (PDF)</button>
        <button class="btn btn-secondary" onclick="downloadWordReport(${lab.id})"><span class="icon">📄</span> Word (.doc) yuklab olish</button>
        <button class="btn btn-secondary" onclick="exportReportText(${lab.id})"><span class="icon">📋</span> Matnni nusxalash</button>
      </div>
    </div>
  `;

  const nameIn = document.getElementById('rep-student-name');
  const groupIn = document.getElementById('rep-student-group');
  const conclIn = document.getElementById('rep-conclusion');
  const printConcl = document.getElementById('print-conclusion-text');

  if (nameIn) {
    nameIn.oninput = (e) => { 
      studentReport.studentName = e.target.value; 
      saveStudentReport();
    };
  }
  if (groupIn) {
    groupIn.oninput = (e) => { 
      studentReport.studentGroup = e.target.value; 
      saveStudentReport();
    };
  }
  if (conclIn) {
    conclIn.oninput = (e) => {
      if (!studentReport.conclusions) studentReport.conclusions = {};
      studentReport.conclusions[lab.id] = e.target.value;
      studentReport.conclusion = e.target.value;
      saveStudentReport();
      if (printConcl) printConcl.textContent = e.target.value;
    };
  }
}

function insertReportTemplate(labId, type) {
  AudioFX.click();
  const textarea = document.getElementById('rep-conclusion');
  if (!textarea) return;
  const template = getLabNotebookTemplate(labId, type);
  if (!template) return;
  const currentVal = textarea.value.trim();
  textarea.value = currentVal ? (currentVal + '\n\n' + template) : template;
  if (!studentReport.conclusions) studentReport.conclusions = {};
  studentReport.conclusions[labId] = textarea.value;
  studentReport.conclusion = textarea.value;
  saveStudentReport();
  const printConcl = document.getElementById('print-conclusion-text');
  if (printConcl) printConcl.textContent = textarea.value;
}

function printReport() {
  window.print();
}

function downloadWordReport(labId) {
  const lab = laboratories.find(l => l.id === labId);
  if (!lab) return;

  const currentConclusion = (studentReport.conclusions && studentReport.conclusions[lab.id]) 
    || studentReport.conclusion 
    || ("Ushbu laboratoriya ishini bajarish davomida " + lab.title + " mavzusi amaliy stendda o'rganildi. Olingan tajriba natijalari nazariy formulalar bilan solishtirildi va hisoblangan xatolik ruxsat etilgan chegarada ekanligi aniqlandi.");

  const tableHtml = renderReportDataTable(lab);
  const questionsDocHtml = lab.questions.map((q, idx) => {
    const ans = (studentReport.answers && studentReport.answers[lab.id] && studentReport.answers[lab.id][idx]) || "Javob kiritilmagan.";
    return `
      <p style="margin-bottom: 4px;"><strong>${idx + 1}. ${q}</strong></p>
      <p style="margin-left: 20px; font-style: italic; color: #222;">Javob: ${ans}</p>
    `;
  }).join('');

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Laboratoriya ishi №${lab.id}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; margin: 2cm; }
        h1, h2, h3, h4 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
        th, td { border: 1px solid black; padding: 6px 8px; font-size: 11pt; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .meta-table { width: 100%; border: none; margin-bottom: 20px; }
        .meta-table td { border: none; padding: 4px; font-size: 12pt; }
        .sig-table { width: 100%; margin-top: 30px; border: none; }
        .sig-table td { border: none; padding: 10px; font-size: 12pt; }
      </style>
    </head>
    <body>
      <div style="text-align: center; font-weight: bold; font-size: 14pt;">
        ${universityInfo.university}
      </div>
      <div style="text-align: center; font-size: 12pt; margin-top: 4px;">
        Kafedra: "${universityInfo.department}"
      </div>
      <div style="text-align: center; font-size: 12pt;">
        Fan: "${universityInfo.subject}"
      </div>
      <br/>
      <div style="text-align: center; font-weight: bold; font-size: 15pt; color: #1e3a8a;">
        LABORATORIYA ISHI №${lab.id} HISOBOTI
      </div>
      <div style="text-align: center; font-size: 13pt; font-weight: bold; margin-top: 4px;">
        Mavzu: ${lab.title}
      </div>
      <br/>
      <table class="meta-table">
        <tr>
          <td><strong>Talaba:</strong> ${studentReport.studentName || '_______________________'}</td>
          <td><strong>Guruh:</strong> ${studentReport.studentGroup}</td>
        </tr>
        <tr>
          <td><strong>O'qituvchi:</strong> ${universityInfo.teacher}</td>
          <td><strong>Sana:</strong> ${new Date().toLocaleDateString('uz-UZ')}</td>
        </tr>
      </table>
      
      <h4 style="text-align: left;">1. Ishning maqsadi</h4>
      <p style="text-indent: 1cm;">${lab.purpose}</p>

      <h4 style="text-align: left;">2. Kerakli asbob-uskunalar</h4>
      <ul>
        ${lab.equipment.map(e => `<li>${e}</li>`).join('')}
      </ul>

      <h4 style="text-align: left;">3. O'lchov va hisoblash jadvali</h4>
      ${tableHtml}

      <h4 style="text-align: left;">4. Talabaning hisob-kitoblari va xulosasi</h4>
      <p style="text-indent: 1cm; white-space: pre-line;">
        ${currentConclusion}
      </p>

      <h4 style="text-align: left;">5. Nazorat savollariga javoblar</h4>
      ${questionsDocHtml}

      <table class="sig-table">
        <tr>
          <td style="width: 50%;">Talaba: _________________ (imzo)</td>
          <td style="width: 50%; text-align: right;">O'qituvchi: _________________ (baho)</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Lab_${lab.id}_Hisoboti_${(studentReport.studentName || 'Talaba').replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportReportText(labId) {
  const lab = laboratories.find(l => l.id === labId);
  const currentConclusion = (studentReport.conclusions && studentReport.conclusions[lab.id]) 
    || studentReport.conclusion 
    || "Ish to'liq bajarildi.";

  const qAnswersText = lab.questions.map((q, i) => {
    const a = (studentReport.answers && studentReport.answers[lab.id] && studentReport.answers[lab.id][i]) || "Javob kiritilmagan.";
    return `${i + 1}. ${q}\n   Javob: ${a}`;
  }).join('\n\n');

  const text = `
NAVOIY DAVLAT KONCHILIK VA TEXNOLOGIYALAR UNIVERSITETI
Kafedra: Avtomatlashtirish va boshqaruv
Fan: Sohaning texnologik o'lchashlari va asboblari
Laboratoriya ishi №${lab.id}: ${lab.title}
Talaba: ${studentReport.studentName || '________________'}
Guruh: ${studentReport.studentGroup}
O'qituvchi: ${universityInfo.teacher}
Sana: ${new Date().toLocaleDateString('uz-UZ')}

1. ISH MAQSADI:
${lab.purpose}

2. ASBOB-USKUNALAR:
${lab.equipment.map(e => '- ' + e).join('\n')}

3. HISOB-KITOBLAR VA XULOSA:
${currentConclusion}

4. NAZORAT SAVOLLARIGA JAVOBLAR:
${qAnswersText}
`;

  navigator.clipboard.writeText(text.trim()).then(() => {
    alert("Hisobot matni buferga muvaffaqiyatli nusxalandi!");
  }).catch(() => {
    prompt("Hisobot matni (nusxalab oling):", text.trim());
  });
}


// ==========================================
// 4. TEST / VIKTORINA (QUIZ) TABI (20 TA XATOSIZ TEST HAR BIR MAVZUGA)
// ==========================================

const quizUserAnswers = {}; // { [labId]: { [qIdx]: selectedOptionIndex } }

function renderQuizTab(container, lab) {
  const quizzes = getQuizData(lab.id);
  if (!quizzes || quizzes.length === 0) {
    container.innerHTML = `<div class="card"><p>Ushbu laboratoriya uchun testlar topilmadi.</p></div>`;
    return;
  }

  if (!quizUserAnswers[lab.id]) {
    quizUserAnswers[lab.id] = {};
  }
  const userAns = quizUserAnswers[lab.id];

  // Calculate live stats
  const totalQuestions = quizzes.length;
  const answeredCount = Object.keys(userAns).length;
  let correctCount = 0;
  quizzes.forEach((q, idx) => {
    if (userAns[idx] !== undefined && userAns[idx] === q.answer) {
      correctCount++;
    }
  });
  const percentScore = answeredCount > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const optionLetters = ['A', 'B', 'C', 'D'];

  container.innerHTML = `
    <div class="quiz-wrapper">
      <!-- Quiz Header & Live Scoreboard -->
      <div class="quiz-stats-card">
        <div class="quiz-stats-header">
          <div>
            <h3 style="margin: 0 0 4px 0; color: var(--primary); font-size: 1.25rem;">
              💡 Bilimni tekshirish: Laboratoriya ishi №${lab.id}
            </h3>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">
              Mavzu: <strong>${lab.title}</strong> — Har bir laboratoriyaga 20 ta xatosiz akademik test.
            </p>
          </div>
          <div>
            <button class="btn btn-secondary btn-sm" onclick="resetLabQuiz(${lab.id})">
              🔄 Qayta topshirish
            </button>
          </div>
        </div>

        <div class="quiz-stats-grid">
          <div class="quiz-stat-item">
            <div class="quiz-stat-val">${totalQuestions}</div>
            <div class="quiz-stat-lbl">Jami savollar</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-val" id="quiz-stat-answered">${answeredCount} / ${totalQuestions}</div>
            <div class="quiz-stat-lbl">Javob berildi</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-val" id="quiz-stat-correct" style="color: #10b981;">${correctCount}</div>
            <div class="quiz-stat-lbl">To'g'ri javoblar</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-val" id="quiz-stat-percent" style="color: #6366f1;">${percentScore}%</div>
            <div class="quiz-stat-lbl">O'zlashtirish</div>
          </div>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" id="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>

      <!-- Quiz Questions List -->
      <div class="quiz-list" id="quiz-items">
        ${quizzes.map((q, qIdx) => {
          const isAnswered = userAns[qIdx] !== undefined;
          const selected = userAns[qIdx];
          const isCorrect = selected === q.answer;

          let cardClass = "card quiz-card";
          if (isAnswered) {
            cardClass += isCorrect ? " answered-correct" : " answered-wrong";
          }

          return `
            <div class="${cardClass}" id="quiz_card_${qIdx}" data-qidx="${qIdx}">
              <div class="quiz-question">
                <strong>${qIdx + 1}-savol:</strong> ${q.question}
              </div>
              <div class="quiz-options">
                ${q.options.map((opt, optIdx) => {
                  let optClass = "quiz-opt-label";
                  if (isAnswered) {
                    if (optIdx === selected) {
                      optClass += isCorrect ? " selected-correct" : " selected-wrong";
                    } else if (optIdx === q.answer && !isCorrect) {
                      optClass += " is-correct-hint";
                    }
                  }
                  return `
                    <label class="${optClass}" id="opt_lbl_${qIdx}_${optIdx}">
                      <input type="radio" name="q_${qIdx}" value="${optIdx}" 
                        ${selected === optIdx ? 'checked' : ''} 
                        ${isAnswered ? 'disabled' : ''} 
                        onchange="handleQuizSelect(${lab.id}, ${qIdx}, ${optIdx})" />
                      <span class="quiz-opt-letter">${optionLetters[optIdx]}</span>
                      <span class="quiz-opt-text">${opt}</span>
                    </label>
                  `;
                }).join('')}
              </div>
              <div class="quiz-feedback ${isAnswered ? (isCorrect ? 'correct' : 'wrong') : ''}" 
                   id="feedback_${qIdx}" 
                   style="${isAnswered ? 'display: block;' : 'display: none;'}">
                ${isAnswered ? `
                  <div>${isCorrect ? '✅ <strong>To\'g\'ri javob!</strong>' : `❌ <strong>Noto\'g\'ri javob!</strong> To'g'ri javob: <strong>${optionLetters[q.answer]}) ${q.options[q.answer]}</strong>`}</div>
                  <div class="quiz-explanation-text">📖 <strong>Ilmiy asos / izoh:</strong> ${q.explanation}</div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quiz Summary (shown if all questions are answered) -->
      ${answeredCount === totalQuestions ? renderQuizCompletionSummary(totalQuestions, correctCount, percentScore) : ''}
    </div>
  `;
}

function handleQuizSelect(labId, qIdx, selectedOptIdx) {
  if (!quizUserAnswers[labId]) {
    quizUserAnswers[labId] = {};
  }
  quizUserAnswers[labId][qIdx] = selectedOptIdx;

  const contentArea = document.getElementById('tab-content');
  const lab = laboratories.find(l => l.id === labId);
  if (contentArea && lab) {
    renderQuizTab(contentArea, lab);
    const targetCard = document.getElementById(`quiz_card_${qIdx}`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function resetLabQuiz(labId) {
  if (confirm("Ushbu laboratoriya ishi bo'yicha barcha javoblarni tozalab, testni boshidan topshirishni xohlaysizmi?")) {
    if (quizUserAnswers[labId]) {
      delete quizUserAnswers[labId];
    }
    const contentArea = document.getElementById('tab-content');
    const lab = laboratories.find(l => l.id === labId);
    if (contentArea && lab) {
      renderQuizTab(contentArea, lab);
    }
  }
}

function renderQuizCompletionSummary(total, correct, percent) {
  let gradeBadge = '';
  let gradeText = '';
  if (percent >= 86) {
    gradeBadge = '🏆 A\'lo (5 baho)';
    gradeText = 'Tabriklaymiz! Siz laboratoriya mavzusini va texnologik o\'lchash vositalari qonuniyatlarini mukammal o\'zlashtirgansiz.';
  } else if (percent >= 71) {
    gradeBadge = '🥈 Yaxshi (4 baho)';
    gradeText = 'Yaxshi natija! Mavzu bo\'yicha asosiy tushunchalarni yaxshi bilasiz, ayrim murakkab hisob-kitoblar va davlat standartlarini qayta ko\'rib chiqing.';
  } else if (percent >= 55) {
    gradeBadge = '🥉 Qoniqarli (3 baho)';
    gradeText = 'Qoniqarli natija. Laboratoriya ko\'rsatmasi va formulalar bo\'limini chuqurroq o\'rganish tavsiya etiladi.';
  } else {
    gradeBadge = '⚠️ Qoniqarsiz (2 baho)';
    gradeText = 'Mavzu yetarli darajada o\'zlashtirilmagan. Simulyatorda amaliy tajribalarni bajaring va nazariyani qayta o\'rganing.';
  }

  return `
    <div class="quiz-summary-card">
      <div style="font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">
        Yakuniy Baholash & Natija
      </div>
      <div class="quiz-summary-score">${percent}%</div>
      <div style="font-size: 1.35rem; font-weight: 700; margin-bottom: 8px; color: #34d399;">
        ${gradeBadge}
      </div>
      <p style="max-width: 650px; margin: 0 auto 16px auto; color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
        ${gradeText} (${total} ta savoldan <strong>${correct}</strong> tasiga to'g'ri javob berildi).
      </p>
    </div>
  `;
}

function getQuizData(labId) {
  if (typeof window !== 'undefined' && window.labQuizzes && window.labQuizzes[labId]) {
    return window.labQuizzes[labId];
  }
  return [];
}

// ==========================================
// 5. REAL EXPERIMENT LOGGER & LIVE CHARTS
// ==========================================

function renderExperimentUI(labId) {
  const tableArea = document.getElementById(`live-table-area-${labId}`);
  const statsArea = document.getElementById(`stats-area-${labId}`);
  if (!tableArea) return;

  const data = liveExperimentData[labId] || [];

  if (data.length === 0) {
    tableArea.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); background: var(--bg-main); border: 1px dashed var(--border-color); border-radius: var(--radius-sm);">
        Hozircha hech qanday o'lchov qayd etilmadi. Yuqoridagi slayderlarni o'zgartiring va <strong>"➕ Hozirgi ko'rsatkichni yozish"</strong> tugmasini bosing!
      </div>
    `;
    if (statsArea) statsArea.innerHTML = '';
    drawLiveChart(labId);
    return;
  }

  const headers = Object.keys(data[0]);
  tableArea.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <span class="badge" style="background:rgba(16, 185, 129, 0.15); color:#059669; font-weight:700;">✅ Jami ${data.length} ta o'lchov nuqtasi jurnali</span>
      <span style="font-size:0.75rem; color:var(--text-muted);">Format: Davlat standarti (ГОСТ / NIST)</span>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>№</th>
            ${headers.map(h => `<th>${h}</th>`).join('')}
            <th>Amal</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((row, idx) => `
            <tr>
              <td><strong style="color:var(--primary);">#${idx + 1}</strong></td>
              ${headers.map(h => `<td><strong>${row[h]}</strong></td>`).join('')}
              <td>
                <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; color: var(--danger);" title="Satrni o'chirish" onclick="deleteExperimentRow(${labId}, ${idx})">✕</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Statistik hisoblash
  if (statsArea) {
    const count = data.length;
    const numericKeys = headers.filter(k => data.some(d => !isNaN(parseFloat(d[k])) && isFinite(d[k])));
    const numKey = numericKeys.length > 1 ? numericKeys[numericKeys.length - 1] : numericKeys[0] || headers[0];

    const nums = data.map(d => parseFloat(d[numKey])).filter(v => !isNaN(v) && isFinite(v));
    const avg = nums.length > 0 ? (nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
    const min = nums.length > 0 ? Math.min(...nums) : 0;
    const max = nums.length > 0 ? Math.max(...nums) : 0;

    statsArea.innerHTML = `
      <div class="stat-chip">
        <div class="stat-label">O'lchovlar soni</div>
        <div class="stat-val">${count} ta</div>
      </div>
      <div class="stat-chip">
        <div class="stat-label">O'rtacha (${numKey})</div>
        <div class="stat-val">${avg.toFixed(2)}</div>
      </div>
      <div class="stat-chip">
        <div class="stat-label">Minimal (Min)</div>
        <div class="stat-val">${min.toFixed(2)}</div>
      </div>
      <div class="stat-chip">
        <div class="stat-label">Maksimal (Max)</div>
        <div class="stat-val">${max.toFixed(2)}</div>
      </div>
    `;
  }

  drawLiveChart(labId);
}

function logCurrentMeasurement(labId) {
  AudioFX.click();
  let row = {};

  if (labId === 1) {
    const mode = document.querySelector('input[name="te-mode"]:checked')?.value || 'measure';
    if (mode === 'measure') {
      const t1 = parseFloat(document.getElementById('te-t1')?.value || 120);
      const t2 = parseFloat(document.getElementById('te-t2')?.value || 0);
      const type = document.getElementById('te-type')?.value || 'l';
      const coeffs = { k: 0.041, l: 0.068, s: 0.010, j: 0.0525 };
      const e = ((t1 - t2) * coeffs[type]).toFixed(3);
      row = { "Hodisa": "Zeyebek (EYuK)", "Termopar": type.toUpperCase(), "T1 (°C)": t1, "T2 (°C)": t2, "ΔT (°C)": t1 - t2, "TermoEYuK (mV)": parseFloat(e), "Sezgirlik (µV/°C)": Math.round(coeffs[type] * 1000) };
    } else if (mode === 'peltier') {
      const I = parseFloat(document.getElementById('te-current')?.value || 3.0);
      const tCold = 20 - (I * 8.5);
      const tHot = 20 + (Math.abs(I) * 6.0);
      row = { "Hodisa": "Peltye", "Tok I (A)": I, "Sovuq sirt (°C)": parseFloat(tCold.toFixed(1)), "Radiator (°C)": parseFloat(tHot.toFixed(1)), "ΔT (°C)": parseFloat((tHot - tCold).toFixed(1)), "Q_peltye (Vt)": parseFloat((Math.abs(I) * 7.4).toFixed(1)) };
    } else if (mode === 'thomson') {
      const t1 = parseFloat(document.getElementById('te-t1')?.value || 120);
      const t2 = parseFloat(document.getElementById('te-t2')?.value || 0);
      row = { "Hodisa": "Tomson", "T1 (°C)": t1, "T2 (°C)": t2, "ΔT (°C)": Math.abs(t1 - t2), "Tomson issiqligi (J/s)": parseFloat((Math.abs(t1 - t2) * 0.12).toFixed(2)) };
    } else {
      const tau = parseFloat(document.getElementById('te-resp-tau-val')?.textContent || '6.0');
      const gilza = document.getElementById('te-thermowell-select')?.value || 'ss316';
      row = { "Hodisa": "Dinamik inersiya", "Gilza": gilza.toUpperCase(), "Vaqt doimiysi τ (s)": tau, "Statik xato (%)": 0.0 };
    }
  } else if (labId === 2) {
    const boxSp = document.getElementById('bm-box-spiral');
    if (boxSp && boxSp.style.display !== 'none') {
      const t = parseFloat(document.getElementById('bm-sp-temp')?.value || 80);
      const angle = (t / 200) * 270;
      const well = document.getElementById('bm-sp-well')?.value || 'ss316';
      row = {
        "Stend": "Sanoat Spiral (WIKA)",
        "Harorat T (°C)": t,
        "Burilish burchagi φ (°)": parseFloat(angle.toFixed(1)),
        "Shkala masshtabi": "270° / 200°C",
        "Himoya gilzasi": well === 'bare' ? "Yalang'och (τ=1.5s)" : (well === 'ss316' ? "SS316 (τ=9.5s)" : "Latun (τ=18s)")
      };
    } else {
      const T = parseFloat(document.getElementById('bm-temp')?.value || 60);
      const L = parseFloat(document.getElementById('bm-l')?.value || 80);
      const h = parseFloat(document.getElementById('bm-h')?.value || 1.0);
      const pair = document.getElementById('bm-pair')?.value || 'latun_invar';
      const deltaAlpha = { latun_invar: 17.5e-6, mis_invar: 15.5e-6, polat_invar: 10.5e-6 }[pair];
      const s = 1.5 * deltaAlpha * (Math.pow(L, 2) / h) * Math.max(0, T - 20);
      row = { "Stend": "Konsol (ИЧ-10)", "Harorat T (°C)": T, "Uzunlik L (mm)": L, "Qalinlik h (mm)": h, "Egilish s (mm)": parseFloat(s.toFixed(2)), "Rele holati": s >= 3.0 ? "ALARM (ULANGAN)" : "NORMAL (UZILGAN)" };
    }
  } else if (labId === 3) {
    const T_pech = parseFloat(document.getElementById('tc-furnace')?.value || 180);
    const type = document.getElementById('tc-type-select')?.value || 'k';
    const mode = document.getElementById('tc-comp-mode')?.value || 'auto';
    const S = { k: 0.041, l: 0.068, s: 0.010 }[type];
    const T0 = mode === 'ice' ? 0 : parseFloat(document.getElementById('tc-t0')?.value || 25);
    const raw = Math.max(0, (T_pech - T0) * S);
    const corr = T0 * S;
    const isComp = (mode === 'ice' || mode === 'auto');
    const tot = isComp ? raw + corr : raw;
    const tCalc = tot / S;
    row = {
      "Termopar": type.toUpperCase(),
      "T_pech (°C)": T_pech,
      "T0 (°C)": T0,
      "Kompensatsiya": mode === 'ice' ? "0°C Muz" : (mode === 'auto' ? "Pt100 Auto" : "Yo'q"),
      "E(T,0) (mV)": parseFloat(tot.toFixed(3)),
      "Aniqlangan T (°C)": parseFloat(tCalc.toFixed(1))
    };
  } else if (labId === 4) {
    const T = parseFloat(document.getElementById('rt-temp')?.value || 50);
    const type = document.getElementById('rt-type')?.value || 'pt100';
    const wires = document.getElementById('rt-wires')?.value || '3';
    let r = 100;
    if (type === 'pt100') r = 100 * (1 + 0.00385 * T);
    else if (type === 'pt500') r = 500 * (1 + 0.00385 * T);
    else if (type === 'pt1000') r = 1000 * (1 + 0.00385 * T);
    else if (type === 'cu50') r = 50 * (1 + 0.00428 * T);
    else if (type === 'cu100') r = 100 * (1 + 0.00428 * T);
    else r = 10000 * Math.exp(3950 * (1 / (T + 273.15) - 1 / 298.15));
    const rbal = parseFloat(document.getElementById('rt-bal-val')?.textContent || r.toFixed(1));
    row = { "Datchik": type.toUpperCase(), "Harorat T (°C)": T, "Ulanish": wires + "-simli", "Haqiqiy Rt (Ω)": parseFloat(r.toFixed(2)), "Р333 Do'kon (Ω)": rbal, "Ko'prik holati": Math.abs(r - rbal) < 0.5 ? "Muvozanatda (0V)" : "Buzilgan" };
  } else if (labId === 5) {
    const boxOpt = document.getElementById('tm-box-optical');
    if (boxOpt && boxOpt.style.display !== 'none') {
      const T_pech = parseFloat(document.getElementById('opt-furnace-temp')?.value || 1150);
      const I_lamp = parseFloat(document.getElementById('opt-lamp-current')?.value || 0.450);
      const T_tola = Math.round(800 + ((I_lamp - 0.22) / (0.75 - 0.22)) * 800);
      const diff = Math.abs(T_tola - T_pech);
      row = {
        "Pirometr turi": "Optik Promin / OPIR",
        "Pech harorati T (°C)": T_pech,
        "Lampa toki I (A)": parseFloat(I_lamp.toFixed(3)),
        "Tola harorati (°C)": T_tola,
        "Fotometrik muvozanat": diff <= 22 ? "Tola yo'qoldi (Tenglik)" : (T_tola < T_pech ? "Tola qora" : "Tola yorqin oq")
      };
    } else {
      const T = parseFloat(document.getElementById('tm-temp')?.value || 150);
      const epsReal = parseFloat(document.getElementById('tm-mat')?.value || 0.90);
      const epsSet = parseFloat(document.getElementById('tm-eps-set')?.value || 0.90);
      const t_piro = (T + 273.15) * Math.pow(epsReal / epsSet, 0.25) - 273.15;
      row = {
        "Pirometr turi": "Infraqizil (Raytek)",
        "Kontaktli T (°C)": T,
        "Haqiqiy ε": epsReal,
        "Sozlangan ε": epsSet,
        "Pirometr (°C)": parseFloat(t_piro.toFixed(1)),
        "Farq ΔT (°C)": parseFloat((t_piro - T).toFixed(1))
      };
    }
  } else if (labId === 6) {
    const P = parseFloat(document.getElementById('ps-press')?.value || 3.0);
    const I = 4 + (P / 10) * 16;
    const mmHg = Math.round(P * 75.0);
    row = {
      "Berilgan P (bar)": P,
      "Burdon P (bar)": P,
      "U-manometr (mm Hg)": mmHg,
      "Tok I (mA)": parseFloat(I.toFixed(2)),
      "P_mutlaq (bar)": parseFloat((P + 1.013).toFixed(3))
    };
  } else if (labId === 7) {
    const Q = parseFloat(document.getElementById('orf-q')?.value || 4.0);
    const devType = document.getElementById('orf-device-type')?.value || 'orifice';
    const K = devType === 'venturi' ? 1.15 : (devType === 'nozzle' ? 1.06 : 1.0);
    const lossRatio = devType === 'venturi' ? 0.12 : (devType === 'nozzle' ? 0.45 : 0.65);
    const dp = Math.pow(Q / K, 2);
    const dp_loss = dp * lossRatio;
    const devNames = { orifice: "Standart Diafragma", venturi: "Venturi quvuri", nozzle: "Standart Soplo" };
    row = {
      "Qurilma turi": devNames[devType] || devType,
      "Sarf Q (m³/h)": Q,
      "Differentsial ΔP (kPa)": parseFloat(dp.toFixed(2)),
      "Bosim yo'qolishi (kPa)": parseFloat(dp_loss.toFixed(2)),
      "Yo'qotish ulushi (%)": Math.round(lossRatio * 100) + "%",
      "K_tarirlash": parseFloat(K.toFixed(2))
    };
  } else if (labId === 8) {
    const algo = document.getElementById('trm-algo-select')?.value || 'relay';
    row = {
      "Algoritm": algo === 'pid' ? "Uzluksiz PI/PID" : "2-Pozitsiyali Rele",
      "Vaqt (s)": (liveExperimentData[8].length * 5),
      "Bosim P (bar)": parseFloat(trm1State.pressure.toFixed(2)),
      "Ustavka SP (bar)": trm1State.sp,
      "Klapan ochiqligi (%)": algo === 'pid' ? Math.round(trm1State.valvePct) + "%" : (trm1State.valveOpen ? "100% (OCHIQ)" : "0% (YOPIQ)"),
      "Rele / Actuator": trm1State.valveOpen ? "ON (ULANGAN)" : "OFF (UZILGAN)"
    };
  }

  liveExperimentData[labId].push(row);
  renderExperimentUI(labId);
}
function deleteExperimentRow(labId, index) {
  AudioFX.click();
  liveExperimentData[labId].splice(index, 1);
  renderExperimentUI(labId);
}

function clearExperimentData(labId) {
  if (confirm("Ushbu laboratoriya uchun barcha yozilgan o'lchovlarni o'chirmoqchimisiz?")) {
    AudioFX.click();
    liveExperimentData[labId] = [];
    renderExperimentUI(labId);
  }
}

function exportToCSV(labId) {
  const data = liveExperimentData[labId];
  if (!data || data.length === 0) {
    alert("Eksport qilish uchun avval o'lchovlarni yozib oling!");
    return;
  }
  AudioFX.success();
  const headers = Object.keys(data[0]);
  let csvContent = "\ufeff" + headers.join(",") + "\n";
  data.forEach(row => {
    csvContent += headers.map(h => `"${row[h]}"`).join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Lab_${labId}_Tajriba_Natijalari.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function applyDataToReport(labId) {
  const data = liveExperimentData[labId];
  if (!data || data.length === 0) {
    alert("Hisobotga o'tkazish uchun kamida 1 ta o'lchov yozing!");
    return;
  }
  AudioFX.success();
  studentReport.customTables[labId] = JSON.parse(JSON.stringify(data));
  alert(`Laboratoriya №${labId} uchun ${data.length} ta o'lchov hisobotga biriktirildi! Endi "📝 Hisobot" tabiga o'tib uni ko'rishingiz va yuklab olishingiz mumkin.`);
}

function drawLiveChart(labId) {
  const canvas = document.getElementById(`live-chart-${labId}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const padL = 50, padR = 25, padT = 28, padB = 34;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  // Setka chiziqlari (O'lchov to'ri)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  for (let i = 0; i <= 5; i++) {
    const y = padT + (plotH / 5) * i;
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    const x = padL + (plotW / 5) * i;
    ctx.moveTo(x, padT);
    ctx.lineTo(x, h - padB);
  }
  ctx.stroke();

  // Asosiy o'qlar (X va Y o'qlari)
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(padL, padT - 6);
  ctx.lineTo(padL, h - padB);
  ctx.lineTo(w - padR + 6, h - padB);
  ctx.stroke();

  const data = liveExperimentData[labId] || [];
  if (data.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Tajriba nuqtalari kiritilgach, grafik jonli tarzda chiziladi.", w / 2, h / 2);
    return;
  }

  // O'qlarni aniqlash (Faqat haqiqiy sonli parametrlarni tanlash)
  const keys = Object.keys(data[0]);
  const numericKeys = keys.filter(k => data.some(d => !isNaN(parseFloat(d[k])) && isFinite(d[k])));

  if (numericKeys.length < 2) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Grafik tuzish uchun kamida 2 ta sonli parametr kerak.", w / 2, h / 2);
    return;
  }

  const preferredAxes = {
    1: { x: ["ΔT (°C)", "T1 (°C)", "Tok I (A)"], y: ["TermoEYuK (mV)", "ΔT (°C)", "Q_peltye (Vt)"] },
    2: { x: ["Harorat T (°C)"], y: ["Egilish s (mm)", "Burilish burchagi φ (°)"] },
    3: { x: ["T_pech (°C)"], y: ["E(T,0) (mV)", "Aniqlangan T (°C)"] },
    4: { x: ["Harorat T (°C)"], y: ["Haqiqiy Rt (Ω)", "Р333 Do'kon (Ω)"] },
    5: { x: ["Kontaktli T (°C)", "Pech harorati T (°C)"], y: ["Pirometr (°C)", "Tola harorati (°C)"] },
    6: { x: ["Berilgan P (bar)", "Etalon P_et (bar)"], y: ["Burdon P (bar)", "Tok I (mA)"] },
    7: { x: ["Sarf Q (m³/h)"], y: ["Differentsial ΔP (kPa)", "Bosim yo'qolishi (kPa)"] },
    8: { x: ["Vaqt (s)"], y: ["Bosim P (bar)"] }
  };

  const pref = preferredAxes[labId] || {};
  let xKey = pref.x?.find(k => numericKeys.includes(k)) || numericKeys[0];
  let yKey = pref.y?.find(k => numericKeys.includes(k) && k !== xKey) || numericKeys[numericKeys.length - 1];

  const xVals = data.map(d => parseFloat(d[xKey])).filter(v => !isNaN(v) && isFinite(v));
  const yVals = data.map(d => parseFloat(d[yKey])).filter(v => !isNaN(v) && isFinite(v));

  const rawMaxX = Math.max(...xVals, 0);
  const maxX = rawMaxX > 0 ? (rawMaxX * 1.15) : 10;
  const rawMaxY = Math.max(...yVals, 0);
  const maxY = rawMaxY > 0 ? (rawMaxY * 1.15) : 5;

  // O'q belgilari (Ticks & Numbers)
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const yVal = ((maxY / 5) * (5 - i)).toFixed(maxY < 10 ? 1 : 0);
    const y = padT + (plotH / 5) * i;
    ctx.fillText(yVal, padL - 6, y + 3);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i <= 5; i++) {
    const xVal = ((maxX / 5) * i).toFixed(maxX < 10 ? 1 : 0);
    const x = padL + (plotW / 5) * i;
    ctx.fillText(xVal, x, h - padB + 14);
  }

  // 1. Nazariy silliq chiziq (Ko'k rangda)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 50; i++) {
    const normX = i / 50;
    const px = padL + normX * plotW;
    let normY = normX;
    if (labId === 7) normY = Math.pow(normX, 2);
    const py = (h - padB) - normY * plotH;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // 2. Nuqtalarni birlashtiruvchi eksperiment chizig'i
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  let firstPt = true;
  data.forEach(d => {
    const xv = parseFloat(d[xKey]);
    const yv = parseFloat(d[yKey]);
    if (!isNaN(xv) && !isNaN(yv)) {
      const cx = padL + (xv / maxX) * plotW;
      const cy = (h - padB) - (yv / maxY) * plotH;
      if (firstPt) { ctx.moveTo(cx, cy); firstPt = false; }
      else ctx.lineTo(cx, cy);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Eksperimental nuqtalar (Qizil doiralar)
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  data.forEach((d, idx) => {
    const xv = parseFloat(d[xKey]);
    const yv = parseFloat(d[yKey]);
    if (!isNaN(xv) && !isNaN(yv)) {
      const cx = padL + (xv / maxX) * plotW;
      const cy = (h - padB) - (yv / maxY) * plotH;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  });

  // O'q sarlavhalari va Legend
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(xKey, padL + plotW / 2, h - 4);
  ctx.textAlign = 'left';
  ctx.fillText(yKey, padL, padT - 10);

  // Legend
  ctx.textAlign = 'right';
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText("━ Nazariy chiziq", w - padR - 70, padT - 10);
  ctx.fillStyle = '#ef4444';
  ctx.fillText("● Eksperiment", w - padR, padT - 10);
}

// ==========================================
// 6. BIRLIKLAR KONVERTERI MODALI
// ==========================================

function openConverterModal() {
  AudioFX.click();
  const modal = document.getElementById('converter-modal');
  if (modal) {
    modal.style.display = 'flex';
    updateConverterUI();
  }
}

function closeConverterModal() {
  AudioFX.click();
  const modal = document.getElementById('converter-modal');
  if (modal) modal.style.display = 'none';
}

function updateConverterUI() {
  const cat = document.getElementById('conv-category')?.value || 'pressure';
  const container = document.getElementById('conv-dynamic-fields');
  if (!container) return;

  if (cat === 'pressure') {
    container.innerHTML = `
      <div class="control-group">
        <label>Bosim qiymati (bar):</label>
        <input type="number" id="conv-p-bar" class="form-input" value="1.0" step="0.1" oninput="convertPressure('bar')" />
      </div>
      <div class="stats-grid">
        <div class="stat-chip"><div class="stat-label">Megapaskal (MPa)</div><div class="stat-val" id="cp-mpa">0.100</div></div>
        <div class="stat-chip"><div class="stat-label">Kilopaskal (kPa)</div><div class="stat-val" id="cp-kpa">100.0</div></div>
        <div class="stat-chip"><div class="stat-label">mm simob ust.</div><div class="stat-val" id="cp-mmhg">750.0</div></div>
        <div class="stat-chip"><div class="stat-label">PSI (funt/dyuym²)</div><div class="stat-val" id="cp-psi">14.50</div></div>
      </div>
    `;
    convertPressure('bar');
  } else if (cat === 'temp') {
    container.innerHTML = `
      <div class="control-group">
        <label>Selsiy harorati (°C):</label>
        <input type="number" id="conv-t-c" class="form-input" value="100.0" oninput="convertTemp('c')" />
      </div>
      <div class="stats-grid">
        <div class="stat-chip"><div class="stat-label">Kelvin (K)</div><div class="stat-val" id="ct-k">373.15</div></div>
        <div class="stat-chip"><div class="stat-label">Farengeyt (°F)</div><div class="stat-val" id="ct-f">212.0</div></div>
      </div>
    `;
    convertTemp('c');
  } else if (cat === 'thermocouple') {
    container.innerHTML = `
      <div class="control-group">
        <label>Termopara turi:</label>
        <select id="conv-tc-type" class="form-input" onchange="convertThermocouple()">
          <option value="k">TXA (K) - Xromel-Alyumel (41 mkV/°C)</option>
          <option value="l">TXK (L) - Xromel-Kopel (68 mkV/°C)</option>
          <option value="s">TPP (S) - Platina-Platinarodiy (10 mkV/°C)</option>
        </select>
      </div>
      <div class="control-group">
        <label>Harorat (°C):</label>
        <input type="number" id="conv-tc-t" class="form-input" value="100" oninput="convertThermocouple()" />
      </div>
      <div class="stats-grid">
        <div class="stat-chip"><div class="stat-label">Chiqish kuchlanishi</div><div class="stat-val" id="ctc-mv">4.10 mV</div></div>
        <div class="stat-chip"><div class="stat-label">Mikrovolt (mkV)</div><div class="stat-val" id="ctc-mkv">4100 mkV</div></div>
      </div>
    `;
    convertThermocouple();
  }
}

function convertPressure(from) {
  const bar = parseFloat(document.getElementById('conv-p-bar')?.value || 0);
  document.getElementById('cp-mpa').textContent = (bar * 0.1).toFixed(3);
  document.getElementById('cp-kpa').textContent = (bar * 100).toFixed(1);
  document.getElementById('cp-mmhg').textContent = (bar * 750.06).toFixed(1);
  document.getElementById('cp-psi').textContent = (bar * 14.5038).toFixed(2);
}

function convertTemp(from) {
  const c = parseFloat(document.getElementById('conv-t-c')?.value || 0);
  document.getElementById('ct-k').textContent = (c + 273.15).toFixed(2);
  document.getElementById('ct-f').textContent = (c * 1.8 + 32).toFixed(1);
}

function convertThermocouple() {
  const type = document.getElementById('conv-tc-type')?.value || 'k';
  const t = parseFloat(document.getElementById('conv-tc-t')?.value || 0);
  const coeffs = { k: 0.041, l: 0.068, s: 0.010 };
  const mv = t * coeffs[type];
  document.getElementById('ctc-mv').textContent = mv.toFixed(2) + " mV";
  document.getElementById('ctc-mkv').textContent = (mv * 1000).toFixed(0) + " mkV";
}
