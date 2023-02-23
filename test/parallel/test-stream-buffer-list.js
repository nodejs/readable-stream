"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
require('../common');
const assert = require('assert/');
const BufferList = require('../../lib/internal/streams/buffer_list');

// Test empty buffer list.
const emptyList = new BufferList();
emptyList.shift();
assert.deepStrictEqual(emptyList, new BufferList());
assert.strictEqual(emptyList.join(','), '');
assert.deepStrictEqual(emptyList.concat(0), bufferShim.alloc(0));
const buf = bufferShim.from('foo');

// Test buffer list with one element.
const list = new BufferList();
list.push(buf);
const copy = list.concat(3);
assert.notStrictEqual(copy, buf);
assert.deepStrictEqual(copy, buf);
assert.strictEqual(list.join(','), 'foo');
const shifted = list.shift();
assert.strictEqual(shifted, buf);
assert.deepStrictEqual(list, new BufferList());
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));