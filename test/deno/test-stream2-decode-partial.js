'use strict';

import _assert from "assert";
import _stream_readable from "_stream_readable";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
_commonDenoJs;
const Readable = _stream_readable;
const assert = _assert;
let buf = '';
const euro = Buffer.from([0xE2, 0x82, 0xAC]);
const cent = Buffer.from([0xC2, 0xA2]);
const source = Buffer.concat([euro, cent]);
const readable = Readable({
  encoding: 'utf8'
});
readable.push(source.slice(0, 2));
readable.push(source.slice(2, 4));
readable.push(source.slice(4, 6));
readable.push(null);
readable.on('data', function (data) {
  buf += data;
});
process.on('exit', function () {
  assert.strictEqual(buf, '€¢');
});
export default module.exports;