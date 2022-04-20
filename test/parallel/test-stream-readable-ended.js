
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const { Readable } = require('../../lib/ours/index');
const assert = require('assert');

// basic
{
  // Find it on Readable.prototype
  assert(Reflect.has(Readable.prototype, 'readableEnded'));
}

// event
{
  const readable = new Readable();

  readable._read = () => {
    // The state ended should start in false.
    assert.strictEqual(readable.readableEnded, false);
    readable.push('asd');
    assert.strictEqual(readable.readableEnded, false);
    readable.push(null);
    assert.strictEqual(readable.readableEnded, false);
  };

  readable.on('end', common.mustCall(() => {
    assert.strictEqual(readable.readableEnded, true);
  }));

  readable.on('data', common.mustCall(() => {
    assert.strictEqual(readable.readableEnded, false);
  }));
}

// Verifies no `error` triggered on multiple .push(null) invocations
{
  const readable = new Readable();

  readable.on('readable', () => { readable.read(); });
  readable.on('error', common.mustNotCall());
  readable.on('end', common.mustCall());

  readable.push('a');
  readable.push(null);
  readable.push(null);
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
