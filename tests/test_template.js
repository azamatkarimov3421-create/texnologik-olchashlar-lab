const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9235', '--disable-gpu', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9235/json', r => {
      let b = ''; r.on('data', c => b += c); r.on('end', () => res(b));
    }).on('error', rej));
    const target = JSON.parse(data).find(t => t.url && t.url.includes('3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    const send = (method, params = {}) => new Promise(res => {
      ws.onmessage = e => res(JSON.parse(e.data));
      ws.send(JSON.stringify({ id: 1, method, params }));
    });
    const templateCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(2);
        switchTab('simulator');
        insertNotebookTemplate(2, 'formula');
        const notes = document.getElementById('sim-notes-2');
        return {
          hasUnicodeBox: notes.value.includes('═══════════════'),
          firstLines: notes.value.substring(0, 300)
        };
      })()`,
      returnByValue: true
    });
    console.log('Notebook template check:', templateCheck.result?.result?.value || templateCheck);
  } finally {
    edge.kill();
  }
}
test();
