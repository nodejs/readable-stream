"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


require('../common');

var assert = require('assert/');

var stream = require('../../');

var chunk = bufferShim.from('hallo');

var TestWriter =
/*#__PURE__*/
function (_stream$Writable) {
  _inheritsLoose(TestWriter, _stream$Writable);

  function TestWriter() {
    return _stream$Writable.apply(this, arguments) || this;
  }

  var _proto = TestWriter.prototype;

  _proto._write = function _write(buffer, encoding, callback) {
    callback(null);
  };

  return TestWriter;
}(stream.Writable);

var dest = new TestWriter(); // Set this high so that we'd trigger a nextTick warning
// and/or RangeError if we do maybeReadMore wrong.

var TestReader =
/*#__PURE__*/
function (_stream$Readable) {
  _inheritsLoose(TestReader, _stream$Readable);

  function TestReader() {
    return _stream$Readable.call(this, {
      highWaterMark: 0x10000
    }) || this;
  }

  var _proto2 = TestReader.prototype;

  _proto2._read = function _read(size) {
    this.push(chunk);
  };

  return TestReader;
}(stream.Readable);

var src = new TestReader();

for (var i = 0; i < 10; i++) {
  src.pipe(dest);
  src.unpipe(dest);
}

assert.strictEqual(src.listeners('end').length, 0);
assert.strictEqual(src.listeners('readable').length, 0);
assert.strictEqual(dest.listeners('unpipe').length, 0);
assert.strictEqual(dest.listeners('drain').length, 0);
assert.strictEqual(dest.listeners('error').length, 0);
assert.strictEqual(dest.listeners('close').length, 0);
assert.strictEqual(dest.listeners('finish').length, 0);
console.error(src._readableState);
process.on('exit', function () {
  src.readableBuffer.length = 0;
  console.error(src._readableState);
  assert(src.readableLength >= src.readableHighWaterMark);

  require('tap').pass();
});
;

(function () {
  var t = require('tap');

  t.pass('sync run');
})();

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});