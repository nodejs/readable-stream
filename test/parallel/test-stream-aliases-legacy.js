
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

require('../common');

const assert = require('assert');
const stream = require('../../lib/ours/index');

// Verify that all individual aliases are left in place.

assert.strictEqual(stream.Readable, require('../../lib/_stream_readable'));
assert.strictEqual(stream.Writable, require('../../lib/_stream_writable'));
assert.strictEqual(stream.Duplex, require('../../lib/_stream_duplex'));
assert.strictEqual(stream.Transform, require('../../lib/_stream_transform'));
assert.strictEqual(stream.PassThrough, require('../../lib/_stream_passthrough'));

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
