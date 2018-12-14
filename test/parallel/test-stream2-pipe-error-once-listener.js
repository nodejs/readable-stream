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

var stream = require('../../');

var Read =
/*#__PURE__*/
function (_stream$Readable) {
  _inheritsLoose(Read, _stream$Readable);

  function Read() {
    return _stream$Readable.apply(this, arguments) || this;
  }

  var _proto = Read.prototype;

  _proto._read = function _read(size) {
    this.push('x');
    this.push(null);
  };

  return Read;
}(stream.Readable);

var Write =
/*#__PURE__*/
function (_stream$Writable) {
  _inheritsLoose(Write, _stream$Writable);

  function Write() {
    return _stream$Writable.apply(this, arguments) || this;
  }

  var _proto2 = Write.prototype;

  _proto2._write = function _write(buffer, encoding, cb) {
    this.emit('error', new Error('boom'));
    this.emit('alldone');
  };

  return Write;
}(stream.Writable);

var read = new Read();
var write = new Write();
write.once('error', function () {});
write.once('alldone', function (err) {
  require('tap').pass();
});
process.on('exit', function (c) {
  console.error('error thrown even with listener');
});
read.pipe(write);
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});