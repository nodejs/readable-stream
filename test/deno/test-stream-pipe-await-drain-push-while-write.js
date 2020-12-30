'use strict';

import _assert from "assert";
import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const stream = _readableDenoJs;
const assert = _assert;
const writable = new stream.Writable({
  write: common.mustCall(function (chunk, encoding, cb) {
    assert.strictEqual(readable._readableState.awaitDrain, 0);

    if (chunk.length === 32 * 1024) {
      // first chunk
      readable.push(Buffer.alloc(34 * 1024)); // above hwm
      // We should check if awaitDrain counter is increased in the next
      // tick, because awaitDrain is incremented after this method finished

      process.nextTick(() => {
        assert.strictEqual(readable._readableState.awaitDrain, 1);
      });
    }

    cb();
  }, 3)
}); // A readable stream which produces two buffers.

const bufs = [Buffer.alloc(32 * 1024), Buffer.alloc(33 * 1024)]; // above hwm

const readable = new stream.Readable({
  read: function () {
    while (bufs.length > 0) {
      this.push(bufs.shift());
    }
  }
});
readable.pipe(writable);
export default module.exports;