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
var R = require('../../lib/_stream_readable');
var W = require('../../lib/_stream_writable');
var assert = require('assert/');

var ondataCalled = 0;

var TestReader = function (_R) {
  (0, (_inherits2 || _load_inherits()).default)(TestReader, _R);

  function TestReader() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, TestReader);

    var _this = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _R.call(this));

    _this._buffer = bufferShim.alloc(100, 'x');

    _this.on('data', function () {
      ondataCalled++;
    });
    return _this;
  }

  TestReader.prototype._read = function _read(n) {
    this.push(this._buffer);
    this._buffer = bufferShim.alloc(0);
  };

  return TestReader;
}(R);

var reader = new TestReader();
(0, (_setImmediate2 || _load_setImmediate()).default)(function () {
  assert.strictEqual(ondataCalled, 1);
  require('tap').pass();
  reader.push(null);
});

var TestWriter = function (_W) {
  (0, (_inherits2 || _load_inherits()).default)(TestWriter, _W);

  function TestWriter() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, TestWriter);

    var _this2 = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _W.call(this));

    _this2.write('foo');
    _this2.end();
    return _this2;
  }

  TestWriter.prototype._write = function _write(chunk, enc, cb) {
    cb();
  };

  return TestWriter;
}(W);

var writer = new TestWriter();

process.on('exit', function () {
  assert.strictEqual(reader.readable, false);
  assert.strictEqual(writer.writable, false);
  require('tap').pass();
});
;require('tap').pass('sync run');