
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const assert = require('assert');

const stream = require('../../lib/ours/index');

class MyWritable extends stream.Writable {
  constructor(options) {
    super({ autoDestroy: false, ...options });
  }
  _write(chunk, encoding, callback) {
    assert.notStrictEqual(chunk, null);
    callback();
  }
}

{
  const m = new MyWritable({ objectMode: true });
  m.on('error', common.mustNotCall());
  assert.throws(() => {
    m.write(null);
  }, {
    code: 'ERR_STREAM_NULL_VALUES'
  });
}

{
  const m = new MyWritable();
  m.on('error', common.mustNotCall());
  assert.throws(() => {
    m.write(false);
  }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });
}

{ // Should not throw.
  const m = new MyWritable({ objectMode: true });
  m.write(false, assert.ifError);
}

{ // Should not throw.
  const m = new MyWritable({ objectMode: true }).on('error', (e) => {
    assert.ifError(e || new Error('should not get here'));
  });
  m.write(false, assert.ifError);
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
