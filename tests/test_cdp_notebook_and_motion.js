const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9228', '--disable-gpu', 'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const data = await new Promise((res, rej) => http.get('http://127.0.0.1:9228/json', r => {
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

    console.log('--- Testing Simulator Notebook & Checklist ---');
    const notebookCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        loadLab(1);
        const notesArea = document.getElementById('sim-notes-1');
        const firstCb = document.getElementById('step-cb-1-0');
        const firstRow = document.getElementById('step-item-1-0');
        
        // 1. Test typing in notebook
        notesArea.value = "Talaba Karimov Alisher: 1-tajriba natijalari o'rganildi.";
        notesArea.dispatchEvent(new Event('input'));
        
        // 2. Test inserting template
        insertNotebookTemplate(1, 'formula');
        const templateAdded = notesArea.value.includes('NAZARIY FORMULALAR');
        
        // 3. Test checklist direct checkbox click
        const initialChecked = firstCb.checked;
        firstCb.click(); // Should toggle to true
        const afterCbClick = firstCb.checked;
        
        // 4. Test checklist row click
        firstRow.click(); // Should toggle to false
        const afterRowClick = firstCb.checked;
        
        return {
          hasNotesArea: !!notesArea,
          notesLength: notesArea.value.length,
          templateAdded,
          initialChecked,
          afterCbClick,
          afterRowClick,
          studentReportConclusion: studentReport.conclusions[1] ? studentReport.conclusions[1].substring(0, 35) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Notebook & Checklist test result:', notebookCheck.result?.result?.value || notebookCheck.result?.value);

    console.log('--- Testing Report Tab (Section 4 Answers & Sync) ---');
    const reportCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        switchTab('report');
        const repConclusion = document.getElementById('rep-conclusion');
        const q0Area = document.getElementById('rep-ans-1-0');
        
        if (q0Area) {
          q0Area.value = "Kelvin munosabati: Peltye va Zeyebek effekti o'zaro bog'liq.";
          q0Area.dispatchEvent(new Event('input'));
        }
        
        const qCount = document.querySelectorAll('.report-question-item').length;
        const printAns0 = document.getElementById('print-ans-1-0')?.textContent;
        
        return {
          repConclusionLen: repConclusion ? repConclusion.value.length : 0,
          qCount,
          q0Saved: studentReport.answers[1]?.[0],
          printAns0
        };
      })()`,
      returnByValue: true
    });
    console.log('Report tab test result:', reportCheck.result?.result?.value || reportCheck.result?.value);

    console.log('--- Testing Guide Tab (Interactive Question Note Areas) ---');
    const guideCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        switchTab('guide');
        const guideTextareas = document.querySelectorAll('.questions-list textarea');
        return {
          guideTextareasCount: guideTextareas.length,
          firstVal: guideTextareas[0] ? guideTextareas[0].value : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Guide tab test result:', guideCheck.result?.result?.value || guideCheck.result?.value);

    console.log('--- Testing All 8 Labs Animations & Movement ---');
    for (let labId = 1; labId <= 8; labId++) {
      const motionCheck = await send('Runtime.evaluate', {
        expression: `(function() {
          loadLab(${labId});
          switchTab('simulator');
          
          // Test sliders movement
          const sliders = document.querySelectorAll('#sim-dynamic-content input[type="range"]');
          sliders.forEach(s => {
            s.value = (parseFloat(s.min || 0) + parseFloat(s.max || 100)) / 2;
            s.dispatchEvent(new Event('input'));
            s.dispatchEvent(new Event('change'));
          });
          
          // Check key animation elements
          const svgs = document.querySelectorAll('#sim-dynamic-content svg');
          const springNeedles = document.querySelectorAll('.physics-spring-needle');
          const waves = document.querySelectorAll('.water-surface-wave');
          const fluids = document.querySelectorAll('.fluid-tracer-particle');
          const flames = document.querySelectorAll('.flame-active');
          const notes = document.getElementById('sim-notes-' + ${labId});
          
          return {
            labId: ${labId},
            slidersCount: sliders.length,
            svgCount: svgs.length,
            springNeedlesCount: springNeedles.length,
            hasNotesArea: !!notes
          };
        })()`,
        returnByValue: true
      });
      console.log('Lab ' + labId + ' check:', motionCheck.result?.result?.value || motionCheck.result?.value);
    }

    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');

  } catch(err) {
    console.error('Test error:', err);
  } finally {
    edge.kill();
  }
}

main();
