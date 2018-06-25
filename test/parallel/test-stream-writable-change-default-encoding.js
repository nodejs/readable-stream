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
var common = require('../common');
var assert = require('assert/');

var stream = require('../../');

var MyWritable = function (_stream$Writable) {
  (0, (_inherits2 || _load_inherits()).default)(MyWritable, _stream$Writable);

  function MyWritable(fn, options) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, MyWritable);

    var _this = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Writable.call(this, options));

    _this.fn = fn;
    return _this;
  }

  MyWritable.prototype._write = function _write(chunk, encoding, callback) {
    this.fn(Buffer.isBuffer(chunk), typeof chunk, encoding);
    callback();
  };

  return MyWritable;
}(stream.Writable);

(function defaultCondingIsUtf8() {
  var m = new MyWritable(function (isBuffer, type, enc) {
    assert.strictEqual(enc, 'utf8');
  }, { decodeStrings: false });
  m.write('foo');
  m.end();
})();

(function changeDefaultEncodingToAscii() {
  var m = new MyWritable(function (isBuffer, type, enc) {
    assert.strictEqual(enc, 'ascii');
  }, { decodeStrings: false });
  m.setDefaultEncoding('ascii');
  m.write('bar');
  m.end();
})();

common.expectsError(function changeDefaultEncodingToInvalidValue() {
  var m = new MyWritable(function (isBuffer, type, enc) {}, { decodeStrings: false });
  m.setDefaultEncoding({});
  m.write('bar');
  m.end();
}, {
  type: TypeError,
  code: 'ERR_UNKNOWN_ENCODING',
  message: 'Unknown encoding: [object Object]'
});

(function checkVairableCaseEncoding() {
  var m = new MyWritable(function (isBuffer, type, enc) {
    assert.strictEqual(enc, 'ascii');
  }, { decodeStrings: false });
  m.setDefaultEncoding('AsCii');
  m.write('bar');
  m.end();
})();
;require('tap').pass('sync run');