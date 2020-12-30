'use strict';

import { Readable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const buf = Buffer.alloc(8192);
const readable = new Readable({
  read: common.mustCall(function () {
    this.push(buf);
  }, 31)
});
let i = 0;
readable.on('readable', common.mustCall(function () {
  if (i++ === 10) {
    // We will just terminate now.
    process.removeAllListeners('readable');
    return;
  }

  const data = readable.read(); // TODO(mcollina): there is something odd in the highWaterMark logic
  // investigate.

  if (i === 1) {
    assert.strictEqual(data.length, 8192 * 2);
  } else {
    assert.strictEqual(data.length, 8192 * 3);
  }
}, 11));
export default module.exports;