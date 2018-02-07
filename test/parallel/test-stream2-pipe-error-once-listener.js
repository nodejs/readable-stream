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
var stream = require('../../');

var Read = function (_stream$Readable) {
  _inherits(Read, _stream$Readable);

  function Read() {
    _classCallCheck(this, Read);

    return _possibleConstructorReturn(this, _stream$Readable.apply(this, arguments));
  }

  Read.prototype._read = function _read(size) {
    this.push('x');
    this.push(null);
  };

  return Read;
}(stream.Readable);

var Write = function (_stream$Writable) {
  _inherits(Write, _stream$Writable);

  function Write() {
    _classCallCheck(this, Write);

    return _possibleConstructorReturn(this, _stream$Writable.apply(this, arguments));
  }

  Write.prototype._write = function _write(buffer, encoding, cb) {
    this.emit('error', new Error('boom'));
    this.emit('alldone');
  };

  return Write;
}(stream.Writable);

var read = new Read();
var write = new Write();

write.once('error', function () {});
write.once('alldone', function (err) {
  console.log('ok');
});

process.on('exit', function (c) {
  console.error('error thrown even with listener');
});

read.pipe(write);