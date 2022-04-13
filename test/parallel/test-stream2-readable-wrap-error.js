
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const assert = require('assert');

const { Readable } = require('../../lib');
const EE = require('events').EventEmitter;

class LegacyStream extends EE {
  pause() {}
  resume() {}
}

{
  const err = new Error();
  const oldStream = new LegacyStream();
  const r = new Readable({ autoDestroy: true })
    .wrap(oldStream)
    .on('error', common.mustCall(() => {
      assert.strictEqual(r._readableState.errorEmitted, true);
      assert.strictEqual(r._readableState.errored, err);
      assert.strictEqual(r.destroyed, true);
    }));
  oldStream.emit('error', err);
}

{
  const err = new Error();
  const oldStream = new LegacyStream();
  const r = new Readable({ autoDestroy: false })
    .wrap(oldStream)
    .on('error', common.mustCall(() => {
      assert.strictEqual(r._readableState.errorEmitted, true);
      assert.strictEqual(r._readableState.errored, err);
      assert.strictEqual(r.destroyed, false);
    }));
  oldStream.emit('error', err);
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
