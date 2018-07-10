'use strict';

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
var W = require('../../lib/_stream_writable');
var D = require('../../lib/_stream_duplex');
var assert = require('assert/');

var TestWriter = function (_W) {
  _inherits(TestWriter, _W);

  function TestWriter(opts) {
    _classCallCheck(this, TestWriter);

    var _this = _possibleConstructorReturn(this, _W.call(this, opts));

    _this.buffer = [];
    _this.written = 0;
    return _this;
  }

  TestWriter.prototype._write = function _write(chunk, encoding, cb) {
    var _this2 = this;

    // simulate a small unpredictable latency
    setTimeout(function () {
      _this2.buffer.push(chunk.toString());
      _this2.written += chunk.length;
      cb();
    }, Math.floor(Math.random() * 10));
  };

  return TestWriter;
}(W);

var chunks = new Array(50);
for (var i = 0; i < chunks.length; i++) {
  chunks[i] = 'x'.repeat(i);
}

{
  // Verify fast writing
  var tw = new TestWriter({
    highWaterMark: 100
  });

  tw.on('finish', common.mustCall(function () {
    assert.deepStrictEqual(tw.buffer, chunks, 'got chunks in the right order');
  }));

  forEach(chunks, function (chunk) {
    // Ignore backpressure. Just buffer it all up.
    tw.write(chunk);
  });
  tw.end();
}

{
  // Verify slow writing
  var _tw = new TestWriter({
    highWaterMark: 100
  });

  _tw.on('finish', common.mustCall(function () {
    assert.deepStrictEqual(_tw.buffer, chunks, 'got chunks in the right order');
  }));

  var _i = 0;
  (function W() {
    _tw.write(chunks[_i++]);
    if (_i < chunks.length) setTimeout(W, 10);else _tw.end();
  })();
}

{
  // Verify write backpressure
  var _tw2 = new TestWriter({
    highWaterMark: 50
  });

  var drains = 0;

  _tw2.on('finish', common.mustCall(function () {
    assert.deepStrictEqual(_tw2.buffer, chunks, 'got chunks in the right order');
    assert.strictEqual(drains, 17);
  }));

  _tw2.on('drain', function () {
    drains++;
  });

  var _i2 = 0;
  (function W() {
    var ret = void 0;
    do {
      ret = _tw2.write(chunks[_i2++]);
    } while (ret !== false && _i2 < chunks.length);

    if (_i2 < chunks.length) {
      assert(_tw2.writableLength >= 50);
      _tw2.once('drain', W);
    } else {
      _tw2.end();
    }
  })();
}

{
  // Verify write buffersize
  var _tw3 = new TestWriter({
    highWaterMark: 100
  });

  var encodings = ['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', undefined];

  _tw3.on('finish', function () {
    assert.deepStrictEqual(_tw3.buffer, chunks, 'got the expected chunks');
  });

  forEach(chunks, function (chunk, i) {
    var enc = encodings[i % encodings.length];
    chunk = bufferShim.from(chunk);
    _tw3.write(chunk.toString(enc), enc);
  });
}

{
  // Verify write with no buffersize
  var _tw4 = new TestWriter({
    highWaterMark: 100,
    decodeStrings: false
  });

  _tw4._write = function (chunk, encoding, cb) {
    assert.strictEqual(typeof chunk, 'string');
    chunk = bufferShim.from(chunk, encoding);
    return TestWriter.prototype._write.call(this, chunk, encoding, cb);
  };

  var _encodings = ['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', undefined];

  _tw4.on('finish', function () {
    assert.deepStrictEqual(_tw4.buffer, chunks, 'got the expected chunks');
  });

  forEach(chunks, function (chunk, i) {
    var enc = _encodings[i % _encodings.length];
    chunk = bufferShim.from(chunk);
    _tw4.write(chunk.toString(enc), enc);
  });
}

{
  // Verify write callbacks
  var callbacks = chunks.map(function (chunk, i) {
    return [i, function () {
      callbacks._called[i] = chunk;
    }];
  }).reduce(function (set, x) {
    set['callback-' + x[0]] = x[1];
    return set;
  }, {});
  callbacks._called = [];

  var _tw5 = new TestWriter({
    highWaterMark: 100
  });

  _tw5.on('finish', common.mustCall(function () {
    process.nextTick(common.mustCall(function () {
      assert.deepStrictEqual(_tw5.buffer, chunks, 'got chunks in the right order');
      assert.deepStrictEqual(callbacks._called, chunks, 'called all callbacks');
    }));
  }));

  forEach(chunks, function (chunk, i) {
    _tw5.write(chunk, callbacks['callback-' + i]);
  });
  _tw5.end();
}

{
  // Verify end() callback
  var _tw6 = new TestWriter();
  _tw6.end(common.mustCall());
}

{
  // Verify end() callback with chunk
  var _tw7 = new TestWriter();
  _tw7.end(bufferShim.from('hello world'), common.mustCall());
}

{
  // Verify end() callback with chunk and encoding
  var _tw8 = new TestWriter();
  _tw8.end('hello world', 'ascii', common.mustCall());
}

{
  // Verify end() callback after write() call
  var _tw9 = new TestWriter();
  _tw9.write(bufferShim.from('hello world'));
  _tw9.end(common.mustCall());
}

{
  // Verify end() callback after write() callback
  var _tw10 = new TestWriter();
  var writeCalledback = false;
  _tw10.write(bufferShim.from('hello world'), function () {
    writeCalledback = true;
  });
  _tw10.end(common.mustCall(function () {
    assert.strictEqual(writeCalledback, true);
  }));
}

{
  // Verify encoding is ignored for buffers
  var _tw11 = new W();
  var hex = '018b5e9a8f6236ffe30e31baf80d2cf6eb';
  _tw11._write = common.mustCall(function (chunk) {
    assert.strictEqual(chunk.toString('hex'), hex);
  });
  var buf = bufferShim.from(hex, 'hex');
  _tw11.write(buf, 'latin1');
}

{
  // Verify writables cannot be piped
  var w = new W();
  w._write = common.mustNotCall();
  var gotError = false;
  w.on('error', function () {
    gotError = true;
  });
  w.pipe(process.stdout);
  assert.strictEqual(gotError, true);
}

{
  // Verify that duplex streams cannot be piped
  var d = new D();
  d._read = common.mustCall();
  d._write = common.mustNotCall();
  var _gotError = false;
  d.on('error', function () {
    _gotError = true;
  });
  d.pipe(process.stdout);
  assert.strictEqual(_gotError, false);
}

{
  // Verify that end(chunk) twice is an error
  var _w = new W();
  _w._write = common.mustCall(function (msg) {
    assert.strictEqual(msg.toString(), 'this is the end');
  });
  var _gotError2 = false;
  _w.on('error', function (er) {
    _gotError2 = true;
    assert.strictEqual(er.message, 'write after end');
  });
  _w.end('this is the end');
  _w.end('and so is this');
  process.nextTick(common.mustCall(function () {
    assert.strictEqual(_gotError2, true);
  }));
}

{
  // Verify stream doesn't end while writing
  var _w2 = new W();
  var wrote = false;
  _w2._write = function (chunk, e, cb) {
    assert.strictEqual(this.writing, undefined);
    wrote = true;
    this.writing = true;
    setTimeout(function () {
      this.writing = false;
      cb();
    }, 1);
  };
  _w2.on('finish', common.mustCall(function () {
    assert.strictEqual(wrote, true);
  }));
  _w2.write(bufferShim.alloc(0));
  _w2.end();
}

{
  // Verify finish does not come before write() callback
  var _w3 = new W();
  var writeCb = false;
  _w3._write = function (chunk, e, cb) {
    setTimeout(function () {
      writeCb = true;
      cb();
    }, 10);
  };
  _w3.on('finish', common.mustCall(function () {
    assert.strictEqual(writeCb, true);
  }));
  _w3.write(bufferShim.alloc(0));
  _w3.end();
}

{
  // Verify finish does not come before synchronous _write() callback
  var _w4 = new W();
  var _writeCb = false;
  _w4._write = function (chunk, e, cb) {
    cb();
  };
  _w4.on('finish', common.mustCall(function () {
    assert.strictEqual(_writeCb, true);
  }));
  _w4.write(bufferShim.alloc(0), function () {
    _writeCb = true;
  });
  _w4.end();
}

{
  // Verify finish is emitted if the last chunk is empty
  var _w5 = new W();
  _w5._write = function (chunk, e, cb) {
    process.nextTick(cb);
  };
  _w5.on('finish', common.mustCall());
  _w5.write(bufferShim.allocUnsafe(1));
  _w5.end(bufferShim.alloc(0));
}

{
  // Verify that finish is emitted after shutdown
  var _w6 = new W();
  var shutdown = false;

  _w6._final = common.mustCall(function (cb) {
    assert.strictEqual(this, _w6);
    setTimeout(function () {
      shutdown = true;
      cb();
    }, 100);
  });
  _w6._write = function (chunk, e, cb) {
    process.nextTick(cb);
  };
  _w6.on('finish', common.mustCall(function () {
    assert.strictEqual(shutdown, true);
  }));
  _w6.write(bufferShim.allocUnsafe(1));
  _w6.end(bufferShim.allocUnsafe(0));
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});