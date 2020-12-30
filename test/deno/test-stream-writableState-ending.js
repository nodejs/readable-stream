'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
_commonDenoJs;
const assert = _assert;
const stream = _readableDenoJs;
const writable = new stream.Writable();

function testStates(ending, finished, ended) {
  assert.strictEqual(writable._writableState.ending, ending);
  assert.strictEqual(writable._writableState.finished, finished);
  assert.strictEqual(writable._writableState.ended, ended);
}

writable._write = (chunk, encoding, cb) => {
  // ending, finished, ended start in false.
  testStates(false, false, false);
  cb();
};

writable.on('finish', () => {
  // ending, finished, ended = true.
  testStates(true, true, true);
});
const result = writable.end('testing function end()', () => {
  // ending, finished, ended = true.
  testStates(true, true, true);
}); // end returns the writable instance

assert.strictEqual(result, writable); // ending, ended = true.
// finished = false.

testStates(true, false, true);
export default module.exports;