const bufferRequire = `
  /* replacement start */

  const { Buffer } = require('buffer')

  /* replacement end */
`

const processRequire = `
  /* replacement start */

  const process = require('process')

  /* replacement end */
`

const testPolyfills = `
  /* replacement start */
  const AbortController = globalThis.AbortController || require('abort-controller').AbortController;
  const AbortSignal = globalThis.AbortSignal || require('abort-controller').AbortSignal;
  const EventTarget = globalThis.EventTarget || require('event-target-shim').EventTarget;

  if(typeof AbortSignal.abort !== 'function') {
    AbortSignal.abort = function() {
      const controller = new AbortController();
      controller.abort();
  
      return controller.signal;
    }    
  }
  /* replacement end */
`

export const headers = {
  'lib/stream.js':
    [bufferRequire],
  'lib/internal/streams/(destroy|duplexify|end-of-stream|from|pipeline|readable|writable).js':
    [processRequire],
  'test/browser/test-stream-(big-packet|pipe-cleanup-pause|pipeline|readable-event|transform-constructor-set-methods|transform-split-objectmode|unshift-empty-chunk|unshift-read-race|writable-change-default-encoding|writable-constructor-set-methods|writable-decoded-encoding|writev).js':
    [bufferRequire],
  'test/browser/test-stream2-(base64-single-char-read-end|compatibility|large-read-stall|pipe-error-handling|readable-empty-buffer-no-eof|readable-from-list|readable-legacy-drain|readable-non-empty-end|readable-wrap|set-encoding|transform|writable).js':
    [bufferRequire],
  'test/browser/test-stream3-pause-then-read.js':
    [bufferRequire],
  'test/parallel/test-stream-(add-abort-signal|drop-take|duplex-destroy|flatMap|forEach|filter|finished|readable-destroy|reduce|toArray|writable-destroy).js':
    [testPolyfills]
}
