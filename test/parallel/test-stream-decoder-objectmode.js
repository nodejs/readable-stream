/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var stream = require('../../');
var assert = require('assert/');

var readable = new stream.Readable({
  read: function () {},
  encoding: 'utf16le',
  objectMode: true
});

readable.push(bufferShim.from('abc', 'utf16le'));
readable.push(bufferShim.from('def', 'utf16le'));
readable.push(null);

// Without object mode, these would be concatenated into a single chunk.
assert.strictEqual(readable.read(), 'abc');
assert.strictEqual(readable.read(), 'def');
assert.strictEqual(readable.read(), null);