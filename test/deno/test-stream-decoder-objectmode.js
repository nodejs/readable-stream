'use strict';

import _assert from "assert";
import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
_commonDenoJs;
const stream = _readableDenoJs;
const assert = _assert;
const readable = new stream.Readable({
  read: () => {},
  encoding: 'utf16le',
  objectMode: true
});
readable.push(Buffer.from('abc', 'utf16le'));
readable.push(Buffer.from('def', 'utf16le'));
readable.push(null); // Without object mode, these would be concatenated into a single chunk.

assert.strictEqual(readable.read(), 'abc');
assert.strictEqual(readable.read(), 'def');
assert.strictEqual(readable.read(), null);
export default module.exports;