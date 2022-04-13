
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const stream = require('../../lib');

const r = new stream.Stream();
r.listenerCount = undefined;

const w = new stream.Stream();
w.listenerCount = undefined;

w.on('pipe', function() {
  r.emit('error', new Error('Readable Error'));
  w.emit('error', new Error('Writable Error'));
});
r.on('error', common.mustCall());
w.on('error', common.mustCall());
r.pipe(w);

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
