
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
// https://github.com/nodejs/node/issues/35926
const common = require('../common');
const assert = require('assert');
const stream = require('../../lib/ours/index');

let loops = 5;

const src = new stream.Readable({
  read() {
    if (loops--)
      this.push(Buffer.alloc(20000));
  }
});

const dst = new stream.Transform({
  transform(chunk, output, fn) {
    this.push(null);
    fn();
  }
});

src.pipe(dst);

dst.on('data', () => { });
dst.on('end', common.mustCall(() => {
  assert.strictEqual(loops, 3);
  assert.ok(src.isPaused());
}));

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
