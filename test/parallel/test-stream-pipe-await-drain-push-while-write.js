
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const stream = require('../../lib/ours/index');
const assert = require('assert');

const writable = new stream.Writable({
  write: common.mustCall(function(chunk, encoding, cb) {
    assert.strictEqual(
      readable._readableState.awaitDrainWriters,
      null,
    );

    if (chunk.length === 32 * 1024) { // first chunk
      readable.push(Buffer.alloc(34 * 1024)); // above hwm
      // We should check if awaitDrain counter is increased in the next
      // tick, because awaitDrain is incremented after this method finished
      process.nextTick(() => {
        assert.strictEqual(readable._readableState.awaitDrainWriters, writable);
      });
    }

    process.nextTick(cb);
  }, 3)
});

// A readable stream which produces two buffers.
const bufs = [Buffer.alloc(32 * 1024), Buffer.alloc(33 * 1024)]; // above hwm
const readable = new stream.Readable({
  read: function() {
    while (bufs.length > 0) {
      this.push(bufs.shift());
    }
  }
});

readable.pipe(writable);

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
