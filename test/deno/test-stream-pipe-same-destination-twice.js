'use strict';

import { PassThrough, Writable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs; // Regression test for https://github.com/nodejs/node/issues/12718.
// Tests that piping a source stream twice to the same destination stream
// works, and that a subsequent unpipe() call only removes the pipe *once*.

const assert = _assert;
{
  const passThrough = new PassThrough();
  const dest = new Writable({
    write: common.mustCall((chunk, encoding, cb) => {
      assert.strictEqual(`${chunk}`, 'foobar');
      cb();
    })
  });
  passThrough.pipe(dest);
  passThrough.pipe(dest);
  assert.strictEqual(passThrough._events.data.length, 2);
  assert.strictEqual(passThrough._readableState.pipesCount, 2);
  assert.strictEqual(passThrough._readableState.pipes[0], dest);
  assert.strictEqual(passThrough._readableState.pipes[1], dest);
  passThrough.unpipe(dest);
  assert.strictEqual(passThrough._events.data.length, 1);
  assert.strictEqual(passThrough._readableState.pipesCount, 1);
  assert.strictEqual(passThrough._readableState.pipes, dest);
  passThrough.write('foobar');
  passThrough.pipe(dest);
}
{
  const passThrough = new PassThrough();
  const dest = new Writable({
    write: common.mustCall((chunk, encoding, cb) => {
      assert.strictEqual(`${chunk}`, 'foobar');
      cb();
    }, 2)
  });
  passThrough.pipe(dest);
  passThrough.pipe(dest);
  assert.strictEqual(passThrough._events.data.length, 2);
  assert.strictEqual(passThrough._readableState.pipesCount, 2);
  assert.strictEqual(passThrough._readableState.pipes[0], dest);
  assert.strictEqual(passThrough._readableState.pipes[1], dest);
  passThrough.write('foobar');
}
{
  const passThrough = new PassThrough();
  const dest = new Writable({
    write: common.mustNotCall()
  });
  passThrough.pipe(dest);
  passThrough.pipe(dest);
  assert.strictEqual(passThrough._events.data.length, 2);
  assert.strictEqual(passThrough._readableState.pipesCount, 2);
  assert.strictEqual(passThrough._readableState.pipes[0], dest);
  assert.strictEqual(passThrough._readableState.pipes[1], dest);
  passThrough.unpipe(dest);
  passThrough.unpipe(dest);
  assert.strictEqual(passThrough._events.data, undefined);
  assert.strictEqual(passThrough._readableState.pipesCount, 0);
  passThrough.write('foobar');
}
export default module.exports;