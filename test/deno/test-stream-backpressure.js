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
let pushes = 0;
const total = 65500 + 40 * 1024;
const rs = new stream.Readable({
  read: common.mustCall(function () {
    if (pushes++ === 10) {
      this.push(null);
      return;
    }

    const length = this._readableState.length; // We are at most doing two full runs of _reads
    // before stopping, because Readable is greedy
    // to keep its buffer full

    assert(length <= total);
    this.push(Buffer.alloc(65500));

    for (let i = 0; i < 40; i++) {
      this.push(Buffer.alloc(1024));
    } // We will be over highWaterMark at this point
    // but a new call to _read is scheduled anyway.

  }, 11)
});
const ws = stream.Writable({
  write: common.mustCall(function (data, enc, cb) {
    setImmediate(cb);
  }, 41 * 10)
});
rs.pipe(ws);
export default module.exports;