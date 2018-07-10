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
var common = require('../common');
var assert = require('assert/');

var stream = require('../../');

var MyWritable = function (_stream$Writable) {
  _inherits(MyWritable, _stream$Writable);

  function MyWritable(fn, options) {
    _classCallCheck(this, MyWritable);

    var _this = _possibleConstructorReturn(this, _stream$Writable.call(this, options));

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
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});