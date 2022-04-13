const testPolyfills = `
  /* replacement start */
  if (typeof EventTarget === 'undefined') {
    globalThis.EventTarget = require('event-target-shim').EventTarget;
  }

  if (typeof AbortController === 'undefined') {
    globalThis.AbortController = require('abort-controller').AbortController;
  }

  if (typeof AbortSignal === 'undefined') {
    globalThis.AbortSignal = require('abort-controller').AbortSignal;

    globalThis.AbortSignal.abort = function() {
      const controller = new AbortController();
      controller.abort();
  
      return controller.signal;
    }    
  }
  /* replacement end */
`

const testTicksDisableHook = `
  /* replacement start */
  process.on('beforeExit', (code) => {
    hook.disable();
  });
  /* replacement end */
`

const testParallel = `
  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(\`test failed - exited code \${code}\`);
    }
  });
  /* replacement end */
`

export const footers = {
  'test/common/index.js': testPolyfills,
  'test/parallel/test-stream-writable-samecb-singletick.js': testTicksDisableHook,
  'test/parallel/.+': testParallel
}
