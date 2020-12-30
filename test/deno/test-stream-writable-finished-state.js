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
  // The state finished should start in false.
  assert.strictEqual(writable._writableState.finished, false);
  cb();
};

writable.on('finish', common.mustCall(() => {
  assert.strictEqual(writable._writableState.finished, true);
}));
writable.end('testing finished state', common.mustCall(() => {
  assert.strictEqual(writable._writableState.finished, true);
}));
export default module.exports;