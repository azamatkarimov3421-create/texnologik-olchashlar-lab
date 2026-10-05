const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9236', '--disable-gpu', '--window-size=1280,1100', 'http://localhost:3000/'
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

    await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(1);
        switchTab('simulator');
        const notes = document.getElementById('sim-notes-1');
        notes.value = '';
        insertNotebookTemplate(1, 'formula');
        const card = document.querySelector('.student-notebook-card');
        if (card) {
          card.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const artifactDir = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\657e54dd-005c-48d8-9b96-2d6f9cdfeeb5';
    fs.writeFileSync(path.join(artifactDir, 'shot_notebook_crystal_formula.png'), Buffer.from(shot.result.data, 'base64'));
    console.log('Saved shot_notebook_crystal_formula.png');

  } catch(e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}

main();
