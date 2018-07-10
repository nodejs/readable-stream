'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  var TestWriter = function (_stream$Writable) {
    _inherits(TestWriter, _stream$Writable);

    function TestWriter() {
      _classCallCheck(this, TestWriter);

      return _possibleConstructorReturn(this, _stream$Writable.apply(this, arguments));
    }

    TestWriter.prototype._write = function _write(buffer, encoding, callback) {
      console.log('write called');
      // super slow write stream (callback never called)
    };

    return TestWriter;
  }(stream.Writable);

  var dest = new TestWriter();

  var TestReader = function (_stream$Readable) {
    _inherits(TestReader, _stream$Readable);

    function TestReader() {
      _classCallCheck(this, TestReader);

      var _this2 = _possibleConstructorReturn(this, _stream$Readable.call(this));

      _this2.reads = 0;
      return _this2;
    }

    TestReader.prototype._read = function _read(size) {
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
})();require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});