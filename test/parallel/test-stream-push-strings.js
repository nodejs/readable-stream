'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  _inherits(MyStream, _Readable);

  function MyStream(options) {
    _classCallCheck(this, MyStream);

    var _this = _possibleConstructorReturn(this, _Readable.call(this, options));

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
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});