
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const assert = require('assert');
const { Readable, Writable, Transform } = require('../../lib');

{
  const stream = new Readable({
    objectMode: true,
    read: common.mustCall(() => {
      stream.push(undefined);
      stream.push(null);
    })
  });

  stream.on('data', common.mustCall((chunk) => {
    assert.strictEqual(chunk, undefined);
  }));
}

{
  const stream = new Writable({
    objectMode: true,
    write: common.mustCall((chunk) => {
      assert.strictEqual(chunk, undefined);
    })
  });

  stream.write(undefined);
}

{
  const stream = new Transform({
    objectMode: true,
    transform: common.mustCall((chunk) => {
      stream.push(chunk);
    })
  });

  stream.on('data', common.mustCall((chunk) => {
    assert.strictEqual(chunk, undefined);
  }));

  stream.write(undefined);
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
