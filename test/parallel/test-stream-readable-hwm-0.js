
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');

// This test ensures that Readable stream will call _read() for streams
// with highWaterMark === 0 upon .read(0) instead of just trying to
// emit 'readable' event.

const assert = require('assert');
const { Readable } = require('../../lib');

const r = new Readable({
  // Must be called only once upon setting 'readable' listener
  read: common.mustCall(),
  highWaterMark: 0,
});

let pushedNull = false;
// This will trigger read(0) but must only be called after push(null)
// because the we haven't pushed any data
r.on('readable', common.mustCall(() => {
  assert.strictEqual(r.read(), null);
  assert.strictEqual(pushedNull, true);
}));
r.on('end', common.mustCall());
process.nextTick(() => {
  assert.strictEqual(r.read(), null);
  pushedNull = true;
  r.push(null);
});

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
