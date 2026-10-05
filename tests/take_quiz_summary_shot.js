const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9236', '--disable-gpu', '--window-size=1280,1200', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9236/json', r => {
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

    console.log('Answering all 20 questions in Lab 4...');
    await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(4);
        switchTab('quiz');
        const quizzes = getQuizData(4);
        quizzes.forEach((q, idx) => {
          // answer 19 correctly and 1 wrong for 95% score
          const ans = idx === 19 ? (q.answer === 0 ? 1 : 0) : q.answer;
          handleQuizSelect(4, idx, ans);
        });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to summary
    await send('Runtime.evaluate', {
      expression: `(function() {
        const summary = document.querySelector('.quiz-summary-card');
        if (summary) summary.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const artifactDir = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\657e54dd-005c-48d8-9b96-2d6f9cdfeeb5';
    const summaryShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'shot_quiz_completion_summary.png'), Buffer.from(summaryShot.result.data, 'base64'));
    console.log('Saved shot_quiz_completion_summary.png');

  } finally {
    edge.kill();
  }
}

main().catch(console.error);
