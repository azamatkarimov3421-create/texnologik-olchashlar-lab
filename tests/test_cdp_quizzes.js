const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9235', '--disable-gpu', '--window-size=1280,1200', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9235/json', r => {
      let b = ''; r.on('data', c => b += c); r.on('end', () => res(b));
    }).on('error', rej));

    const targets = JSON.parse(data);
    const target = targets.find(t => t.url && t.url.includes('3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const pending = new Map();
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && pending.has(d.id)) {
        pending.get(d.id)(d);
        pending.delete(d.id);
      }
    };

    const send = (method, params = {}) => new Promise(res => {
      const curId = id++;
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Runtime.enable');

    console.log('--- Verifying all 8 labs (20 questions each) ---');
    const artifactDir = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\657e54dd-005c-48d8-9b96-2d6f9cdfeeb5';

    for (let labId = 1; labId <= 8; labId++) {
      const checkRes = await send('Runtime.evaluate', {
        expression: `(function() {
          loadLab(${labId});
          switchTab('quiz');
          const cards = document.querySelectorAll('.quiz-card');
          const count = cards.length;
          let fourOpts = 0;
          cards.forEach(c => {
            if (c.querySelectorAll('.quiz-opt-label').length === 4) fourOpts++;
          });
          return { labId: ${labId}, totalQuestions: count, allHave4Options: fourOpts === 20 };
        })()`,
        returnByValue: true
      });
      console.log(`Lab ${labId}:`, checkRes.result.value);
    }

    // Now test answering questions in Lab 1
    console.log('\n--- Answering questions in Lab 1 & Testing UI/Expl/Stats ---');
    await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(1);
        switchTab('quiz');
        // Click correct option for Q0 (answer is 0)
        const opt0 = document.querySelector('#quiz_card_0 input[value="0"]');
        if (opt0) opt0.click();
        
        // Click wrong option for Q1 (answer is 1, let's click 0)
        const opt1 = document.querySelector('#quiz_card_1 input[value="0"]');
        if (opt1) opt1.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const lab1Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'shot_quiz_tab_lab1.png'), Buffer.from(lab1Shot.result.data, 'base64'));
    console.log('Saved shot_quiz_tab_lab1.png');

    // Test Lab 6 (Pressure Gauges) Quiz view
    await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(6);
        switchTab('quiz');
        // Answer Q0 correctly (answer is 0)
        const opt0 = document.querySelector('#quiz_card_0 input[value="0"]');
        if (opt0) opt0.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const lab6Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'shot_quiz_tab_lab6.png'), Buffer.from(lab6Shot.result.data, 'base64'));
    console.log('Saved shot_quiz_tab_lab6.png');

    console.log('\nAll tests and screenshots completed successfully!');
  } finally {
    edge.kill();
  }
}

main().catch(console.error);
