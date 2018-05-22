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
var R = require('../../lib/_stream_readable');
var W = require('../../lib/_stream_writable');
var assert = require('assert/');

var ondataCalled = 0;

var TestReader = function (_R) {
  _inherits(TestReader, _R);

  function TestReader() {
    _classCallCheck(this, TestReader);

    var _this = _possibleConstructorReturn(this, _R.call(this));

    _this._buffer = bufferShim.alloc(100, 'x');

    _this.on('data', function () {
      ondataCalled++;
    });
    return _this;
  }

  TestReader.prototype._read = function _read(n) {
    this.push(this._buffer);
    this._buffer = bufferShim.alloc(0);
  };

  return TestReader;
}(R);

var reader = new TestReader();
setImmediate(function () {
  assert.strictEqual(ondataCalled, 1);
  console.log('ok');
  reader.push(null);
});

var TestWriter = function (_W) {
  _inherits(TestWriter, _W);

  function TestWriter() {
    _classCallCheck(this, TestWriter);

    var _this2 = _possibleConstructorReturn(this, _W.call(this));

    _this2.write('foo');
    _this2.end();
    return _this2;
  }

  TestWriter.prototype._write = function _write(chunk, enc, cb) {
    cb();
  };

  return TestWriter;
}(W);

var writer = new TestWriter();

process.on('exit', function () {
  assert.strictEqual(reader.readable, false);
  assert.strictEqual(writer.writable, false);
  console.log('ok');
});
;require('tap').pass('sync run');