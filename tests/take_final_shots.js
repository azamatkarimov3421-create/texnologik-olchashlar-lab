const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9229', '--disable-gpu', '--window-size=1280,1000', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9229/json', r => {
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

    // 1. Simulator notebook shot (scroll to bottom)
    await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(1);
        switchTab('simulator');
        insertNotebookTemplate(1, 'formula');
        window.scrollTo(0, document.body.scrollHeight);
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const simShot = await send('Page.captureScreenshot', { format: 'png' });
    const artifactDir = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\657e54dd-005c-48d8-9b96-2d6f9cdfeeb5';
    fs.writeFileSync(path.join(artifactDir, 'shot_simulator_notebook.png'), Buffer.from(simShot.result.data, 'base64'));
    console.log('Saved shot_simulator_notebook.png');

    // 2. Report tab questions shot (scroll to bottom)
    await send('Runtime.evaluate', {
      expression: `(function() {
        switchTab('report');
        window.scrollTo(0, document.body.scrollHeight);
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const repShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'shot_report_questions.png'), Buffer.from(repShot.result.data, 'base64'));
    console.log('Saved shot_report_questions.png');

  } catch(e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}

main();
