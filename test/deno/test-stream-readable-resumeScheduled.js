'use strict';

import { Readable, Writable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs; // Testing Readable Stream resumeScheduled state

const assert = _assert;
{
  // pipe() test case
  const r = new Readable({
    read() {}

  });
  const w = new Writable(); // resumeScheduled should start = `false`.

  assert.strictEqual(r._readableState.resumeScheduled, false); // calling pipe() should change the state value = true.

  r.pipe(w);
  assert.strictEqual(r._readableState.resumeScheduled, true);
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
}
{
  // 'data' listener test case
  const r = new Readable({
    read() {}

  }); // resumeScheduled should start = `false`.

  assert.strictEqual(r._readableState.resumeScheduled, false);
  r.push(Buffer.from([1, 2, 3])); // adding 'data' listener should change the state value

  r.on('data', common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
  assert.strictEqual(r._readableState.resumeScheduled, true);
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
}
{
  // resume() test case
  const r = new Readable({
    read() {}

  }); // resumeScheduled should start = `false`.

  assert.strictEqual(r._readableState.resumeScheduled, false); // Calling resume() should change the state value.

  r.resume();
  assert.strictEqual(r._readableState.resumeScheduled, true);
  r.on('resume', common.mustCall(() => {
    // The state value should be `false` again
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
}
export default module.exports;