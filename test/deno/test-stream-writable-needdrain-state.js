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
const transform = new stream.Transform({
  transform: _transform,
  highWaterMark: 1
});

function _transform(chunk, encoding, cb) {
  assert.strictEqual(transform._writableState.needDrain, true);
  cb();
}

assert.strictEqual(transform._writableState.needDrain, false);
transform.write('asdasd', common.mustCall(() => {
  assert.strictEqual(transform._writableState.needDrain, false);
}));
assert.strictEqual(transform._writableState.needDrain, true);
export default module.exports;