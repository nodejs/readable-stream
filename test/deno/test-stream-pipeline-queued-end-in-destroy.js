'use strict';

import { Readable, Duplex, pipeline } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
// Test that the callback for pipeline() is called even when the ._destroy()
// method of the stream places an .end() request to itself that does not
// get processed before the destruction of the stream (i.e. the 'close' event).
// Refs: https://github.com/nodejs/node/issues/24456
const readable = new Readable({
  read: common.mustCall(() => {})
});
const duplex = new Duplex({
  write(chunk, enc, cb) {// Simulate messages queueing up.
  },

  read() {},

  destroy(err, cb) {
    // Call end() from inside the destroy() method, like HTTP/2 streams
    // do at the time of writing.
    this.end();
    cb(err);
  }

});
duplex.on('finished', common.mustNotCall());
pipeline(readable, duplex, common.mustCall(err => {
  assert.strictEqual(err.code, 'ERR_STREAM_PREMATURE_CLOSE');
})); // Write one chunk of data, and destroy the stream later.
// That should trigger the pipeline destruction.

readable.push('foo');
setImmediate(() => {
  readable.destroy();
});
export default module.exports;