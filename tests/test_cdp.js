const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9227', '--disable-gpu', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9227/json', r => {
      let b = ''; r.on('data', c => b += c); r.on('end', () => res(b));
    }).on('error', rej));

    const targets = JSON.parse(data);
    const target = targets.find(t => t.url && t.url.includes('3000'));
    if (!target) {
      console.error('Target localhost:3000 not found! Targets:', targets.map(t => t.url));
      return;
    }
    console.log('Connecting to target:', target.title);

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

    // Page health check
    const health = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        activeLab: currentLabId,
        labsTotal: typeof laboratories !== 'undefined' ? laboratories.length : 0,
        activeTab: currentTab,
        tabContentHtmlLen: document.getElementById('tab-content') ? document.getElementById('tab-content').innerHTML.length : 0
      })`,
      returnByValue: true
    });
    console.log('\nInitial health check:', health.result?.result?.value);

    // Test each lab from 1 to 8
    for (let labId = 1; labId <= 8; labId++) {
      console.log(`\n================ Testing Lab ${labId} ================`);
      const labRes = await send('Runtime.evaluate', {
        expression: `(function() {
          try {
            loadLab(${labId});
            const titleEl = document.getElementById('current-lab-title');
            const simBody = document.getElementById('sim-dynamic-content');
            return {
              labId: ${labId},
              title: titleEl ? titleEl.textContent : null,
              hasDynamicContent: !!simBody && simBody.children.length > 0,
              svgCount: document.querySelectorAll('#tab-content svg').length,
              slidersCount: document.querySelectorAll('#tab-content input[type="range"]').length
            };
          } catch (e) {
            return { error: e.message, stack: e.stack };
          }
        })()`,
        returnByValue: true
      });
      console.log('Lab select:', labRes.result?.result?.value);

      // Sliders and interaction
      const interactRes = await send('Runtime.evaluate', {
        expression: `(function() {
          try {
            const sliders = document.querySelectorAll('#tab-content input[type="range"]');
            sliders.forEach(sl => {
              const mid = (parseFloat(sl.min) + parseFloat(sl.max)) / 2;
              sl.value = mid;
              sl.dispatchEvent(new Event('input', { bubbles: true }));
            });
            // Try Auto Demo
            const autoBtn = document.getElementById('btn-auto-run-${labId}');
            let autoStarted = false;
            if (autoBtn) {
              autoBtn.click();
              autoStarted = true;
            }
            return { slidersFound: sliders.length, autoStarted };
          } catch (e) {
            return { error: e.message };
          }
        })()`,
        returnByValue: true
      });
      console.log('Interact:', interactRes.result?.result?.value);

      // Wait 400ms while auto run is active
      await new Promise(r => setTimeout(r, 400));

      // Stop auto run
      await send('Runtime.evaluate', {
        expression: `(function() {
          const autoBtn = document.getElementById('btn-auto-run-${labId}');
          if (autoBtn && autoBtn.textContent.includes('STOP')) {
            autoBtn.click();
          }
        })()`
      });

      // Log measurement
      const logRes = await send('Runtime.evaluate', {
        expression: `(function() {
          try {
            logCurrentMeasurement(${labId});
            const rows = document.querySelectorAll('#live-table-area-${labId} tbody tr');
            const dataLen = liveExperimentData[${labId}] ? liveExperimentData[${labId}].length : 0;
            return { loggedRows: rows.length, dataLen };
          } catch (e) {
            return { error: e.message };
          }
        })()`,
        returnByValue: true
      });
      console.log('Log measurement:', logRes.result?.result?.value);

      // Test tabs: guide, report, quiz, simulator
      const tabRes = await send('Runtime.evaluate', {
        expression: `(function() {
          try {
            switchTab('guide');
            const gLen = document.getElementById('tab-content').innerHTML.length;
            switchTab('quiz');
            const qLen = document.getElementById('tab-content').innerHTML.length;
            switchTab('report');
            const rLen = document.getElementById('tab-content').innerHTML.length;
            switchTab('simulator');
            const sLen = document.getElementById('tab-content').innerHTML.length;
            return { tabsOk: true, gLen, qLen, rLen, sLen };
          } catch (e) {
            return { tabsOk: false, error: e.message };
          }
        })()`,
        returnByValue: true
      });
      console.log('Tabs test:', tabRes.result?.result?.value);
    }

    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);
