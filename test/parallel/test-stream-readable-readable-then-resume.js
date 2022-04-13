
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const { Readable } = require('../../lib');
const assert = require('assert');

// This test verifies that a stream could be resumed after
// removing the readable event in the same tick

check(new Readable({
  objectMode: true,
  highWaterMark: 1,
  read() {
    if (!this.first) {
      this.push('hello');
      this.first = true;
      return;
    }

    this.push(null);
  }
}));

function check(s) {
  const readableListener = common.mustNotCall();
  s.on('readable', readableListener);
  s.on('end', common.mustCall());
  assert.strictEqual(s.removeListener, s.off);
  s.removeListener('readable', readableListener);
  s.resume();
}

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
