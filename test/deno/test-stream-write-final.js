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
let shutdown = false;
const w = new stream.Writable({
  final: common.mustCall(function (cb) {
    assert.strictEqual(this, w);
    setTimeout(function () {
      shutdown = true;
      cb();
    }, 100);
  }),
  write: function (chunk, e, cb) {
    process.nextTick(cb);
  }
});
w.on('finish', common.mustCall(function () {
  assert(shutdown);
}));
w.write(Buffer.allocUnsafe(1));
w.end(Buffer.allocUnsafe(0));
export default module.exports;