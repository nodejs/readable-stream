
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
require('../common');
const assert = require('assert');

const { Writable } = require('../../lib');

{
  const w = new Writable();
  assert.strictEqual(w.writableCorked, 0);
  w.uncork();
  assert.strictEqual(w.writableCorked, 0);
  w.cork();
  assert.strictEqual(w.writableCorked, 1);
  w.cork();
  assert.strictEqual(w.writableCorked, 2);
  w.uncork();
  assert.strictEqual(w.writableCorked, 1);
  w.uncork();
  assert.strictEqual(w.writableCorked, 0);
  w.uncork();
  assert.strictEqual(w.writableCorked, 0);
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
