"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

require('../common');
const stream = require('../../');
const assert = require('assert/');
const readable = new stream.Readable({
  read: () => {},
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
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));