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

var R = require('../../lib/_stream_readable');

var W = require('../../lib/_stream_writable');

var assert = require('assert/');

var ondataCalled = 0;

var TestReader =
/*#__PURE__*/
function (_R) {
  _inheritsLoose(TestReader, _R);

  function TestReader() {
    var _this;

    _this = _R.call(this) || this;
    _this._buffer = bufferShim.alloc(100, 'x');

    _this.on('data', function () {
      ondataCalled++;
    });

    return _this;
  }

  var _proto = TestReader.prototype;

  _proto._read = function _read(n) {
    this.push(this._buffer);
    this._buffer = bufferShim.alloc(0);
  };

  return TestReader;
}(R);

var reader = new TestReader();
setImmediate(function () {
  assert.strictEqual(ondataCalled, 1);

  require('tap').pass();

  reader.push(null);
});

var TestWriter =
/*#__PURE__*/
function (_W) {
  _inheritsLoose(TestWriter, _W);

  function TestWriter() {
    var _this2;

    _this2 = _W.call(this) || this;

    _this2.write('foo');

    _this2.end();

    return _this2;
  }

  var _proto2 = TestWriter.prototype;

  _proto2._write = function _write(chunk, enc, cb) {
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