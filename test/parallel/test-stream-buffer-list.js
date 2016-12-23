// Flags: --expose_internals
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var assert = require('assert/');
var BufferList = require('../../lib/internal/streams/BufferList');

// Test empty buffer list.
var emptyList = new BufferList();

emptyList.shift();
assert.deepStrictEqual(emptyList, new BufferList());

assert.strictEqual(emptyList.join(','), '');

assert.deepStrictEqual(emptyList.concat(0), bufferShim.alloc(0));

// Test buffer list with one element.
var list = new BufferList();
list.push('foo');

assert.strictEqual(list.concat(1), 'foo');

assert.strictEqual(list.join(','), 'foo');

var shifted = list.shift();
assert.strictEqual(shifted, 'foo');
assert.deepStrictEqual(list, new BufferList());