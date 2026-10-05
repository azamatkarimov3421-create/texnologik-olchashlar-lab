const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9231', '--disable-gpu', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9231/json', r => {
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
      if (d.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER CONSOLE]', d.params.type, d.params.args.map(a => a.value || a.description).join(' '));
      }
      if (d.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', d.params.exceptionDetails.text, d.params.exceptionDetails.exception?.description);
      }
    };

    const send = (method, params = {}) => new Promise(res => {
      const curId = id++;
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Runtime.enable');

    console.log('--- Verifying Formula Rendering Across All 8 Labs (Guide Tab) ---');
    for (let labId = 1; labId <= 8; labId++) {
      const res = await send('Runtime.evaluate', {
        expression: `(function() {
          loadLab(${labId});
          switchTab('guide');
          
          const mathElements = document.querySelectorAll('.theory-box math');
          const formulaCards = document.querySelectorAll('.theory-box .math-formula-showcase');
          const varTables = document.querySelectorAll('.theory-box .formula-var-table');
          const examples = document.querySelectorAll('.theory-box .formula-example-box');
          
          return {
            labId: ${labId},
            mathTagsCount: mathElements.length,
            formulaCardsCount: formulaCards.length,
            varTablesCount: varTables.length,
            examplesCount: examples.length
          };
        })()`,
        returnByValue: true
      });
      console.log('Lab ' + labId + ' formulas:', res.result?.result?.value || res.result?.value);
    }

  } catch(e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}

main();
