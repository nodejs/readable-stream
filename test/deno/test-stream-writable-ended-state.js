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
const writable = new stream.Writable();

writable._write = (chunk, encoding, cb) => {
  assert.strictEqual(writable._writableState.ended, false);
  cb();
};

assert.strictEqual(writable._writableState.ended, false);
writable.end('testing ended state', common.mustCall(() => {
  assert.strictEqual(writable._writableState.ended, true);
}));
assert.strictEqual(writable._writableState.ended, true);
export default module.exports;