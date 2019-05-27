"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

(function () {
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

  var TestWriter =
  /*#__PURE__*/
  function (_stream$Writable) {
    _inheritsLoose(TestWriter, _stream$Writable);

    function TestWriter() {
      return _stream$Writable.apply(this, arguments) || this;
    }

    var _proto = TestWriter.prototype;

    _proto._write = function _write(buffer, encoding, callback) {
      console.log('write called'); // super slow write stream (callback never called)
    };

    return TestWriter;
  }(stream.Writable);

  var dest = new TestWriter();

  var TestReader =
  /*#__PURE__*/
  function (_stream$Readable) {
    _inheritsLoose(TestReader, _stream$Readable);

    function TestReader() {
      var _this;

      _this = _stream$Readable.call(this) || this;
      _this.reads = 0;
      return _this;
    }

    var _proto2 = TestReader.prototype;

    _proto2._read = function _read(size) {
      this.reads += 1;
      this.push(bufferShim.alloc(size));
    };

    return TestReader;
  }(stream.Readable);

  var src1 = new TestReader();
  var src2 = new TestReader();
  src1.pipe(dest);
  src1.once('readable', function () {
    process.nextTick(function () {
      src2.pipe(dest);
      src2.once('readable', function () {
        process.nextTick(function () {
          src1.unpipe(dest);
        });
      });
    });
  });
  process.on('exit', function () {
    assert.strictEqual(src1.reads, 2);
    assert.strictEqual(src2.reads, 2);
  });
})();

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