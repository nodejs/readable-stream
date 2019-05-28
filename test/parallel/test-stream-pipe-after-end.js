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


var common = require('../common');

var assert = require('assert/');

var Readable = require('../../lib/_stream_readable');

var Writable = require('../../lib/_stream_writable');

var TestReadable =
/*#__PURE__*/
function (_Readable) {
  _inheritsLoose(TestReadable, _Readable);

  function TestReadable(opt) {
    var _this;

    _this = _Readable.call(this, opt) || this;
    _this._ended = false;
    return _this;
  }

  var _proto = TestReadable.prototype;

  _proto._read = function _read() {
    if (this._ended) this.emit('error', new Error('_read called twice'));
    this._ended = true;
    this.push(null);
  };

  return TestReadable;
}(Readable);

var TestWritable =
/*#__PURE__*/
function (_Writable) {
  _inheritsLoose(TestWritable, _Writable);

  function TestWritable(opt) {
    var _this2;

    _this2 = _Writable.call(this, opt) || this;
    _this2._written = [];
    return _this2;
  }

  var _proto2 = TestWritable.prototype;

  _proto2._write = function _write(chunk, encoding, cb) {
    this._written.push(chunk);

    cb();
  };

  return TestWritable;
}(Writable); // this one should not emit 'end' until we read() from it later.


var ender = new TestReadable(); // what happens when you pipe() a Readable that's already ended?

var piper = new TestReadable(); // pushes EOF null, and length=0, so this will trigger 'end'

piper.read();
setTimeout(common.mustCall(function () {
  ender.on('end', common.mustCall());
  var c = ender.read();
  assert.strictEqual(c, null);
  var w = new TestWritable();
  w.on('finish', common.mustCall());
  piper.pipe(w);
}), 1);
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