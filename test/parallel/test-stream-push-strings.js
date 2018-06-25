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

var Readable = require('../../').Readable;

var MyStream = function (_Readable) {
  (0, (_inherits2 || _load_inherits()).default)(MyStream, _Readable);

  function MyStream(options) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, MyStream);

    var _this = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Readable.call(this, options));

    _this._chunks = 3;
    return _this;
  }

  MyStream.prototype._read = function _read(n) {
    var _this2 = this;

    switch (this._chunks--) {
      case 0:
        return this.push(null);
      case 1:
        return setTimeout(function () {
          _this2.push('last chunk');
        }, 100);
      case 2:
        return this.push('second to last chunk');
      case 3:
        return process.nextTick(function () {
          _this2.push('first chunk');
        });
      default:
        throw new Error('?');
    }
  };

  return MyStream;
}(Readable);

var ms = new MyStream();
var results = [];
ms.on('readable', function () {
  var chunk = void 0;
  while (null !== (chunk = ms.read())) {
    results.push(String(chunk));
  }
});

var expect = ['first chunksecond to last chunk', 'last chunk'];
process.on('exit', function () {
  assert.strictEqual(ms._chunks, -1);
  assert.deepStrictEqual(results, expect);
  require('tap').pass();
});
;require('tap').pass('sync run');