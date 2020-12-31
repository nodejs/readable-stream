'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const stream = _readableDenoJs;
const r = new stream.Readable({
  read: () => {}
}); // readableListening state should start in `false`.

assert.strictEqual(r._readableState.readableListening, false);
r.on('readable', common.mustCall(() => {
  // Inside the readable event this state should be true.
  assert.strictEqual(r._readableState.readableListening, true);
}));
r.push(Buffer.from('Testing readableListening state'));
const r2 = new stream.Readable({
  read: () => {}
}); // readableListening state should start in `false`.

assert.strictEqual(r2._readableState.readableListening, false);
r2.on('data', common.mustCall(chunk => {
  // readableListening should be false because we don't have
  // a `readable` listener
  assert.strictEqual(r2._readableState.readableListening, false);
}));
r2.push(Buffer.from('Testing readableListening state'));
export default module.exports;