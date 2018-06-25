'use strict';

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _possibleConstructorReturn2;

function _load_possibleConstructorReturn() {
  return _possibleConstructorReturn2 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
}

var _inherits2;

function _load_inherits() {
  return _inherits2 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var TestWriter = function (_stream$Writable) {
  (0, (_inherits2 || _load_inherits()).default)(TestWriter, _stream$Writable);

  function TestWriter() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, TestWriter);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Writable.apply(this, arguments));
  }

  TestWriter.prototype._write = function _write(buffer, encoding, callback) {
    callback(null);
  };

  return TestWriter;
}(stream.Writable);

var dest = new TestWriter();

// Set this high so that we'd trigger a nextTick warning
// and/or RangeError if we do maybeReadMore wrong.

var TestReader = function (_stream$Readable) {
  (0, (_inherits2 || _load_inherits()).default)(TestReader, _stream$Readable);

  function TestReader() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, TestReader);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Readable.call(this, {
      highWaterMark: 0x10000
    }));
  }

  TestReader.prototype._read = function _read(size) {
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
;require('tap').pass('sync run');