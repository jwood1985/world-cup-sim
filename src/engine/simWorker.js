import { runMonteCarlo } from './simulator.js';

self.onmessage = function(e) {
  const { N } = e.data;
  const results = runMonteCarlo(N, (progress) => {
    self.postMessage({ type: 'progress', progress });
  });
  self.postMessage({ type: 'done', results });
};
