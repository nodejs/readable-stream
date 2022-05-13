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
  'test/parallel/test-stream-(add-abort-signal|drop-take|duplex-destroy|flatMap|forEach|filter|finished|readable-destroy|reduce|toArray|writable-destroy).js':
    [testPolyfills]
}
