export function nodeMap(nodes, cb) {
  return Array.prototype.map.call(nodes, cb);
}

export function idleRun(cb) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb);
  }
  else {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  }
}

export function getActiveSlide() {
  const hash = location.hash.split('/');
  hash.shift();

  return {
    section: parseInt(hash[0]),
    slide: parseInt(hash[1]),
    fragment: parseInt(hash[2]),
  };
};
