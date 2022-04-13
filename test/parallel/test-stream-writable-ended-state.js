
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');

const assert = require('assert');
const stream = require('../../lib');

const writable = new stream.Writable();

writable._write = (chunk, encoding, cb) => {
  assert.strictEqual(writable._writableState.ended, false);
  assert.strictEqual(writable._writableState.writable, undefined);
  assert.strictEqual(writable.writableEnded, false);
  cb();
};

assert.strictEqual(writable._writableState.ended, false);
assert.strictEqual(writable._writableState.writable, undefined);
assert.strictEqual(writable.writable, true);
assert.strictEqual(writable.writableEnded, false);

writable.end('testing ended state', common.mustCall(() => {
  assert.strictEqual(writable._writableState.ended, true);
  assert.strictEqual(writable._writableState.writable, undefined);
  assert.strictEqual(writable.writable, false);
  assert.strictEqual(writable.writableEnded, true);
}));

assert.strictEqual(writable._writableState.ended, true);
assert.strictEqual(writable._writableState.writable, undefined);
assert.strictEqual(writable.writable, false);
assert.strictEqual(writable.writableEnded, true);

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
