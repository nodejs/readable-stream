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
const Transform = _readableDenoJs.Transform;
const expected = 'asdf';

function _transform(d, e, n) {
  n();
}

function _flush(n) {
  n(null, expected);
}

const t = new Transform({
  transform: _transform,
  flush: _flush
});
t.end(Buffer.from('blerg'));
t.on('data', data => {
  assert.strictEqual(data.toString(), expected);
});
export default module.exports;