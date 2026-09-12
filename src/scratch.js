const TIME_THRESHOLD = 1000;
let historyRef = [{ blocks: [1,2,3,4] }];
let historyIndexRef = 0;
let lastHistoryPushTime = Date.now() - 5000;

function updatePost(updater, time) {
  const prev = historyRef[historyIndexRef];
  const next = typeof updater === 'function' ? { ...prev, ...updater(prev) } : { ...prev, ...updater };

  const now = time;
  const nextHistory = historyRef.slice(0, historyIndexRef + 1);

  if (now - lastHistoryPushTime < TIME_THRESHOLD && historyIndexRef > 0) {
    console.log(`t=${time}: Coalescing!`);
    nextHistory[historyIndexRef] = next;
  } else {
    console.log(`t=${time}: Pushing!`);
    nextHistory.push(next);
    historyIndexRef += 1;
  }

  historyRef = nextHistory;
  lastHistoryPushTime = now;
  console.log('History:', historyRef);
}

const t0 = Date.now();
updatePost({ blocks: [1,2,3] }, t0);
updatePost({ blocks: [1,2] }, t0 + 300);
updatePost({ blocks: [1] }, t0 + 600);
