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
var R = require('../../lib/_stream_readable');
var assert = require('assert/');

var EE = require('events').EventEmitter;

var TestReader = function (_R) {
  _inherits(TestReader, _R);

  function TestReader(n) {
    _classCallCheck(this, TestReader);

    var _this = _possibleConstructorReturn(this, _R.call(this));

    _this._buffer = bufferShim.alloc(n || 100, 'x');
    _this._pos = 0;
    _this._bufs = 10;
    return _this;
  }

  TestReader.prototype._read = function _read(n) {
    var _this2 = this;

    var max = this._buffer.length - this._pos;
    n = Math.max(n, 0);
    var toRead = Math.min(n, max);
    if (toRead === 0) {
      // simulate the read buffer filling up with some more bytes some time
      // in the future.
      setTimeout(function () {
        _this2._pos = 0;
        _this2._bufs -= 1;
        if (_this2._bufs <= 0) {
          // read them all!
          if (!_this2.ended) _this2.push(null);
        } else {
          // now we have more.
          // kinda cheating by calling _read, but whatever,
          // it's just fake anyway.
          _this2._read(n);
        }
      }, 10);
      return;
    }

    var ret = this._buffer.slice(this._pos, this._pos + toRead);
    this._pos += toRead;
    this.push(ret);
  };

  return TestReader;
}(R);

/////

var TestWriter = function (_EE) {
  _inherits(TestWriter, _EE);

  function TestWriter() {
    _classCallCheck(this, TestWriter);

    var _this3 = _possibleConstructorReturn(this, _EE.call(this));

    _this3.received = [];
    _this3.flush = false;
    return _this3;
  }

  TestWriter.prototype.write = function write(c) {
    this.received.push(c.toString());
    this.emit('write', c);
    return true;
  };

  TestWriter.prototype.end = function end(c) {
    if (c) this.write(c);
    this.emit('end', this.received);
  };

  return TestWriter;
}(EE);

{
  // Test basic functionality
  var r = new TestReader(20);

  var reads = [];
  var expect = ['x', 'xx', 'xxx', 'xxxx', 'xxxxx', 'xxxxxxxxx', 'xxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxxx', 'xxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxx'];

  r.on('end', common.mustCall(function () {
    assert.deepStrictEqual(reads, expect);
  }));

  var readSize = 1;
  function flow() {
    var res = void 0;
    while (null !== (res = r.read(readSize++))) {
      reads.push(res.toString());
    }
    r.once('readable', flow);
  }

  flow();
}

{
  // Verify pipe
  var _r = new TestReader(5);

  var _expect = ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'];

  var w = new TestWriter();

  w.on('end', common.mustCall(function (received) {
    assert.deepStrictEqual(received, _expect);
  }));

  _r.pipe(w);
}

forEach([1, 2, 3, 4, 5, 6, 7, 8, 9], function (SPLIT) {
  // Verify unpipe
  var r = new TestReader(5);

  // unpipe after 3 writes, then write to another stream instead.
  var expect = ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'];
  expect = [expect.slice(0, SPLIT), expect.slice(SPLIT)];

  var w = [new TestWriter(), new TestWriter()];

  var writes = SPLIT;
  w[0].on('write', function () {
    if (--writes === 0) {
      r.unpipe();
      assert.strictEqual(r._readableState.pipes, null);
      w[0].end();
      r.pipe(w[1]);
      assert.strictEqual(r._readableState.pipes, w[1]);
    }
  });

  var ended = 0;

  w[0].on('end', common.mustCall(function (results) {
    ended++;
    assert.strictEqual(ended, 1);
    assert.deepStrictEqual(results, expect[0]);
  }));

  w[1].on('end', common.mustCall(function (results) {
    ended++;
    assert.strictEqual(ended, 2);
    assert.deepStrictEqual(results, expect[1]);
  }));

  r.pipe(w[0]);
});

{
  // Verify both writers get the same data when piping to destinations
  var _r2 = new TestReader(5);
  var _w = [new TestWriter(), new TestWriter()];

  var _expect2 = ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'];

  _w[0].on('end', common.mustCall(function (received) {
    assert.deepStrictEqual(received, _expect2, 'first');
  }));
  _w[1].on('end', common.mustCall(function (received) {
    assert.deepStrictEqual(received, _expect2, 'second');
  }));

  _r2.pipe(_w[0]);
  _r2.pipe(_w[1]);
}

forEach([1, 2, 3, 4, 5, 6, 7, 8, 9], function (SPLIT) {
  // Verify multi-unpipe
  var r = new TestReader(5);

  // unpipe after 3 writes, then write to another stream instead.
  var expect = ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'];
  expect = [expect.slice(0, SPLIT), expect.slice(SPLIT)];

  var w = [new TestWriter(), new TestWriter(), new TestWriter()];

  var writes = SPLIT;
  w[0].on('write', function () {
    if (--writes === 0) {
      r.unpipe();
      w[0].end();
      r.pipe(w[1]);
    }
  });

  var ended = 0;

  w[0].on('end', common.mustCall(function (results) {
    ended++;
    assert.strictEqual(ended, 1);
    assert.deepStrictEqual(results, expect[0]);
  }));

  w[1].on('end', common.mustCall(function (results) {
    ended++;
    assert.strictEqual(ended, 2);
    assert.deepStrictEqual(results, expect[1]);
  }));

  r.pipe(w[0]);
  r.pipe(w[2]);
});

{
  // Verify that back pressure is respected
  var _r3 = new R({ objectMode: true });
  _r3._read = common.mustNotCall();
  var counter = 0;
  _r3.push(['one']);
  _r3.push(['two']);
  _r3.push(['three']);
  _r3.push(['four']);
  _r3.push(null);

  var w1 = new R();
  w1.write = function (chunk) {
    assert.strictEqual(chunk[0], 'one');
    w1.emit('close');
    process.nextTick(function () {
      _r3.pipe(w2);
      _r3.pipe(w3);
    });
  };
  w1.end = common.mustNotCall();

  _r3.pipe(w1);

  var expected = ['two', 'two', 'three', 'three', 'four', 'four'];

  var w2 = new R();
  w2.write = function (chunk) {
    assert.strictEqual(chunk[0], expected.shift());
    assert.strictEqual(counter, 0);

    counter++;

    if (chunk[0] === 'four') {
      return true;
    }

    setTimeout(function () {
      counter--;
      w2.emit('drain');
    }, 10);

    return false;
  };
  w2.end = common.mustCall();

  var w3 = new R();
  w3.write = function (chunk) {
    assert.strictEqual(chunk[0], expected.shift());
    assert.strictEqual(counter, 1);

    counter++;

    if (chunk[0] === 'four') {
      return true;
    }

    setTimeout(function () {
      counter--;
      w3.emit('drain');
    }, 50);

    return false;
  };
  w3.end = common.mustCall(function () {
    assert.strictEqual(counter, 2);
    assert.strictEqual(expected.length, 0);
  });
}

{
  // Verify read(0) behavior for ended streams
  var _r4 = new R();
  var written = false;
  var ended = false;
  _r4._read = common.mustNotCall();

  _r4.push(bufferShim.from('foo'));
  _r4.push(null);

  var v = _r4.read(0);

  assert.strictEqual(v, null);

  var _w2 = new R();

  _w2.write = function (buffer) {
    written = true;
    assert.strictEqual(ended, false);
    assert.strictEqual(buffer.toString(), 'foo');
  };

  _w2.end = common.mustCall(function () {
    ended = true;
    assert.strictEqual(written, true);
  });

  _r4.pipe(_w2);
}

{
  // Verify synchronous _read ending
  var _r5 = new R();
  var called = false;
  _r5._read = function (n) {
    _r5.push(null);
  };

  _r5.once('end', function () {
    // Verify that this is called before the next tick
    called = true;
  });

  _r5.read();

  process.nextTick(function () {
    assert.strictEqual(called, true);
  });
}

{
  // Verify that adding readable listeners trigger data flow
  var _r6 = new R({ highWaterMark: 5 });
  var onReadable = false;
  var readCalled = 0;

  _r6._read = function (n) {
    if (readCalled++ === 2) _r6.push(null);else _r6.push(bufferShim.from('asdf'));
  };

  _r6.on('readable', function () {
    onReadable = true;
    _r6.read();
  });

  _r6.on('end', common.mustCall(function () {
    assert.strictEqual(readCalled, 3);
    assert.ok(onReadable);
  }));
}

{
  // Verify that streams are chainable
  var _r7 = new R();
  _r7._read = common.mustCall();
  var r2 = _r7.setEncoding('utf8').pause().resume().pause();
  assert.strictEqual(_r7, r2);
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}