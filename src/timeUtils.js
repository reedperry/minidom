export function afterMs(durationMs) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), durationMs)
  });
}

export function afterSeconds(durationSeconds) {
  return afterMs(durationSeconds * 1000);
}

export function everyMs(intervalMs, runnable, ...args) {
  let runCount = 1;
  const intervalId = setInterval(() => {
    runnable.apply(null, [runCount, ...args])
    runCount++;
  }, intervalMs)

  return intervalId;
}

export function everySeconds(intervalSeconds, runnable, ...args) {
  return everyMs.call(null, [intervalSeconds * 1000, runnable, ...args])
}