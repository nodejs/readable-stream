// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

import _assert from "assert";
import _stream_writable from "_stream_writable";
import _stream_readable from "_stream_readable";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
_commonDenoJs;
const R = _stream_readable;
const W = _stream_writable;
const assert = _assert;
const src = new R({
  encoding: 'base64'
});
const dst = new W();
let hasRead = false;
const accum = [];

src._read = function (n) {
  if (!hasRead) {
    hasRead = true;
    process.nextTick(function () {
      src.push(Buffer.from('1'));
      src.push(null);
    });
  }
};

dst._write = function (chunk, enc, cb) {
  accum.push(chunk);
  cb();
};

src.on('end', function () {
  assert.strictEqual(String(Buffer.concat(accum)), 'MQ==');
  clearTimeout(timeout);
});
src.pipe(dst);
const timeout = setTimeout(function () {
  assert.fail('timed out waiting for _write');
}, 100);
export default module.exports;