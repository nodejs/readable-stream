// Flags: --expose_internals
'use strict';

import _internalStreamsBuffer_list from "internal/streams/buffer_list";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
_commonDenoJs;
const assert = _assert;
const BufferList = _internalStreamsBuffer_list; // Test empty buffer list.

const emptyList = new BufferList();
emptyList.shift();
assert.deepStrictEqual(emptyList, new BufferList());
assert.strictEqual(emptyList.join(','), '');
assert.deepStrictEqual(emptyList.concat(0), Buffer.alloc(0));
const buf = Buffer.from('foo'); // Test buffer list with one element.

const list = new BufferList();
list.push(buf);
const copy = list.concat(3);
assert.notStrictEqual(copy, buf);
assert.deepStrictEqual(copy, buf);
assert.strictEqual(list.join(','), 'foo');
const shifted = list.shift();
assert.strictEqual(shifted, buf);
assert.deepStrictEqual(list, new BufferList());
export default module.exports;