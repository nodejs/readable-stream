"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
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
readable.push(null); // Without object mode, these would be concatenated into a single chunk.

assert.strictEqual(readable.read(), 'abc');
assert.strictEqual(readable.read(), 'def');
assert.strictEqual(readable.read(), null);
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});