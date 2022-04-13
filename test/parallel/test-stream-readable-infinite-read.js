
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const assert = require('assert');
const { Readable } = require('../../lib');

const buf = Buffer.alloc(8192);

const readable = new Readable({
  read: common.mustCall(function() {
    this.push(buf);
  }, 31)
});

let i = 0;

readable.on('readable', common.mustCall(function() {
  if (i++ === 10) {
    // We will just terminate now.
    process.removeAllListeners('readable');
    return;
  }

  const data = readable.read();
  // TODO(mcollina): there is something odd in the highWaterMark logic
  // investigate.
  if (i === 1) {
    assert.strictEqual(data.length, 8192 * 2);
  } else {
    assert.strictEqual(data.length, 8192 * 3);
  }
}, 11));

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
