'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

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

var passed = false;

var TestStream = function (_stream$Transform) {
  (0, (_inherits2 || _load_inherits()).default)(TestStream, _stream$Transform);

  function TestStream() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, TestStream);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Transform.apply(this, arguments));
  }

  TestStream.prototype._transform = function _transform(chunk, encoding, done) {
    if (!passed) {
      // Char 'a' only exists in the last write
      passed = chunk.toString().includes('a');
    }
    done();
  };

  return TestStream;
}(stream.Transform);

var s1 = new stream.PassThrough();
var s2 = new stream.PassThrough();
var s3 = new TestStream();
s1.pipe(s3);
// Don't let s2 auto close which may close s3
s2.pipe(s3, { end: false });

// We must write a buffer larger than highWaterMark
var big = bufferShim.alloc(s1.writableHighWaterMark + 1, 'x');

// Since big is larger than highWaterMark, it will be buffered internally.
assert(!s1.write(big));
// 'tiny' is small enough to pass through internal buffer.
assert(s2.write('tiny'));

// Write some small data in next IO loop, which will never be written to s3
// Because 'drain' event is not emitted from s1 and s1 is still paused
(0, (_setImmediate2 || _load_setImmediate()).default)(s1.write.bind(s1), 'later');

// Assert after two IO loops when all operations have been done.
process.on('exit', function () {
  assert(passed, 'Large buffer is not handled properly by Writable Stream');
});

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});