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
var stream = require('../../');

var passed = false;

var TestStream = function (_stream$Transform) {
  _inherits(TestStream, _stream$Transform);

  function TestStream() {
    _classCallCheck(this, TestStream);

    return _possibleConstructorReturn(this, _stream$Transform.apply(this, arguments));
  }

  TestStream.prototype._transform = function _transform(chunk, encoding, done) {
    if (!passed) {
      // Char 'a' only exists in the last write
      passed = chunk.toString().includes('a');
    }
    done();
  };

  return TestStream;
}(stream.Transform);

var s1 = new stream.PassThrough();
var s2 = new stream.PassThrough();
var s3 = new TestStream();
s1.pipe(s3);
// Don't let s2 auto close which may close s3
s2.pipe(s3, { end: false });

// We must write a buffer larger than highWaterMark
var big = bufferShim.alloc(s1._writableState.highWaterMark + 1, 'x');

// Since big is larger than highWaterMark, it will be buffered internally.
assert(!s1.write(big));
// 'tiny' is small enough to pass through internal buffer.
assert(s2.write('tiny'));

// Write some small data in next IO loop, which will never be written to s3
// Because 'drain' event is not emitted from s1 and s1 is still paused
setImmediate(s1.write.bind(s1), 'later');

// Assert after two IO loops when all operations have been done.
process.on('exit', function () {
  assert(passed, 'Large buffer is not handled properly by Writable Stream');
});

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}