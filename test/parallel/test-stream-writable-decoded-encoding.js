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

var MyWritable =
/*#__PURE__*/
function (_stream$Writable) {
  _inheritsLoose(MyWritable, _stream$Writable);

  function MyWritable(fn, options) {
    var _this;

    _this = _stream$Writable.call(this, options) || this;
    _this.fn = fn;
    return _this;
  }

  var _proto = MyWritable.prototype;

  _proto._write = function _write(chunk, encoding, callback) {
    this.fn(Buffer.isBuffer(chunk), typeof chunk, encoding);
    callback();
  };

  return MyWritable;
}(stream.Writable);

{
  var m = new MyWritable(function (isBuffer, type, enc) {
    assert(isBuffer);
    assert.strictEqual(type, 'object');
    assert.strictEqual(enc, 'buffer');
  }, {
    decodeStrings: true
  });
  m.write('some-text', 'utf8');
  m.end();
}
{
  var _m = new MyWritable(function (isBuffer, type, enc) {
    assert(!isBuffer);
    assert.strictEqual(type, 'string');
    assert.strictEqual(enc, 'utf8');
  }, {
    decodeStrings: false
  });

  _m.write('some-text', 'utf8');

  _m.end();
}
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});