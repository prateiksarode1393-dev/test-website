self.onmessage = function(e) {
  console.log('[Worker] Received message:', e.data);

  // Simulate heavy computation
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += Math.sqrt(i);
  }

  self.postMessage({
    type: 'RESULT',
    value: result,
    timestamp: new Date().toISOString()
  });
};
