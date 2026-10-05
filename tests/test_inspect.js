const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9235', '--disable-gpu', '--window-size=1280,1200', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9235/json', r => {
      let b = ''; r.on('data', c => b += c); r.on('end', () => res(b));
    }).on('error', rej));
    const target = JSON.parse(data).find(t => t.url && t.url.includes('3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const curId = id++;
      const handler = e => {
        const d = JSON.parse(e.data);
        if (d.id === curId) {
          ws.removeEventListener('message', handler);
          res(d);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
    await send('Runtime.enable');
    await send('Page.enable');

    const evalInPage = async expr => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return r.result?.result?.value;
    };

    console.log('--- Testing Journal and Chart in Lab 2 ---');
    await evalInPage('loadLab(2);');
    
    // Log measurement at 60
    await evalInPage('logCurrentMeasurement(2);');
    
    // Change to 80 and log
    await evalInPage(`(function() {
      const t = document.getElementById('bm-temp');
      t.value = 80;
      t.dispatchEvent(new Event('input', { bubbles: true }));
      logCurrentMeasurement(2);
    })()`);

    // Change to 100 and log
    await evalInPage(`(function() {
      const t = document.getElementById('bm-temp');
      t.value = 100;
      t.dispatchEvent(new Event('input', { bubbles: true }));
      logCurrentMeasurement(2);
    })()`);

    const tableState = await evalInPage(`({
      rowCount: document.querySelectorAll('#live-table-area-2 tbody tr').length,
      headers: Array.from(document.querySelectorAll('#live-table-area-2 thead th')).map(th => th.textContent.trim()),
      rows: Array.from(document.querySelectorAll('#live-table-area-2 tbody tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
      ),
      reportCustomTables: studentReport.customTables?.[2]?.length
    })`);
    console.log('Table state:', JSON.stringify(tableState, null, 2));

    // Scroll to journal & chart
    await evalInPage('document.querySelector("#live-table-area-2").scrollIntoView();');
    await new Promise(r => setTimeout(r, 400));
    const shotJournal = await send('Page.captureScreenshot');
    fs.writeFileSync('C:\\Users\\Owner\\.gemini\\antigravity\\brain\\657e54dd-005c-48d8-9b96-2d6f9cdfeeb5\\shot_journal_chart.png', Buffer.from(shotJournal.result.data, 'base64'));
    console.log('Saved shot_journal_chart.png');

    // Also check Report tab
    await evalInPage('switchTab("report");');
    await new Promise(r => setTimeout(r, 400));
    const reportTable = await evalInPage(`({
      hasTable: !!document.querySelector('.report-table'),
      reportRows: document.querySelectorAll('.report-table tbody tr').length
    })`);
    console.log('Report tab table check:', reportTable);

    ws.close();
  } finally {
    edge.kill();
  }
}
main().catch(console.error);
