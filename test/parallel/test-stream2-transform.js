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
var PassThrough = require('../../lib/_stream_passthrough');
var Transform = require('../../lib/_stream_transform');

{
  // Verify writable side consumption
  var tx = new Transform({
    highWaterMark: 10
  });

  var transformed = 0;
  tx._transform = function (chunk, encoding, cb) {
    transformed += chunk.length;
    tx.push(chunk);
    cb();
  };

  for (var i = 1; i <= 10; i++) {
    tx.write(bufferShim.allocUnsafe(i));
  }
  tx.end();

  assert.strictEqual(tx._readableState.length, 10);
  assert.strictEqual(transformed, 10);
  assert.strictEqual(tx._transformState.writechunk.length, 5);
  assert.deepStrictEqual(tx._writableState.getBuffer().map(function (c) {
    return c.chunk.length;
  }), [6, 7, 8, 9, 10]);
}

{
  // Verify passthrough behavior
  var pt = new PassThrough();

  pt.write(bufferShim.from('foog'));
  pt.write(bufferShim.from('bark'));
  pt.write(bufferShim.from('bazy'));
  pt.write(bufferShim.from('kuel'));
  pt.end();

  assert.strictEqual(pt.read(5).toString(), 'foogb');
  assert.strictEqual(pt.read(5).toString(), 'arkba');
  assert.strictEqual(pt.read(5).toString(), 'zykue');
  assert.strictEqual(pt.read(5).toString(), 'l');
}

{
  // Verify object passthrough behavior
  var _pt = new PassThrough({ objectMode: true });

  _pt.write(1);
  _pt.write(true);
  _pt.write(false);
  _pt.write(0);
  _pt.write('foo');
  _pt.write('');
  _pt.write({ a: 'b' });
  _pt.end();

  assert.strictEqual(_pt.read(), 1);
  assert.strictEqual(_pt.read(), true);
  assert.strictEqual(_pt.read(), false);
  assert.strictEqual(_pt.read(), 0);
  assert.strictEqual(_pt.read(), 'foo');
  assert.strictEqual(_pt.read(), '');
  assert.deepStrictEqual(_pt.read(), { a: 'b' });
}

{
  // Verify passthrough constructor behavior
  var _pt2 = PassThrough();

  assert(_pt2 instanceof PassThrough);
}

{
  // Perform a simple transform
  var _pt3 = new Transform();
  _pt3._transform = function (c, e, cb) {
    var ret = bufferShim.alloc(c.length, 'x');
    _pt3.push(ret);
    cb();
  };

  _pt3.write(bufferShim.from('foog'));
  _pt3.write(bufferShim.from('bark'));
  _pt3.write(bufferShim.from('bazy'));
  _pt3.write(bufferShim.from('kuel'));
  _pt3.end();

  assert.strictEqual(_pt3.read(5).toString(), 'xxxxx');
  assert.strictEqual(_pt3.read(5).toString(), 'xxxxx');
  assert.strictEqual(_pt3.read(5).toString(), 'xxxxx');
  assert.strictEqual(_pt3.read(5).toString(), 'x');
}

{
  // Verify simple object transform
  var _pt4 = new Transform({ objectMode: true });
  _pt4._transform = function (c, e, cb) {
    _pt4.push(JSON.stringify(c));
    cb();
  };

  _pt4.write(1);
  _pt4.write(true);
  _pt4.write(false);
  _pt4.write(0);
  _pt4.write('foo');
  _pt4.write('');
  _pt4.write({ a: 'b' });
  _pt4.end();

  assert.strictEqual(_pt4.read(), '1');
  assert.strictEqual(_pt4.read(), 'true');
  assert.strictEqual(_pt4.read(), 'false');
  assert.strictEqual(_pt4.read(), '0');
  assert.strictEqual(_pt4.read(), '"foo"');
  assert.strictEqual(_pt4.read(), '""');
  assert.strictEqual(_pt4.read(), '{"a":"b"}');
}

{
  // Verify async passthrough
  var _pt5 = new Transform();
  _pt5._transform = function (chunk, encoding, cb) {
    setTimeout(function () {
      _pt5.push(chunk);
      cb();
    }, 10);
  };

  _pt5.write(bufferShim.from('foog'));
  _pt5.write(bufferShim.from('bark'));
  _pt5.write(bufferShim.from('bazy'));
  _pt5.write(bufferShim.from('kuel'));
  _pt5.end();

  _pt5.on('finish', common.mustCall(function () {
    assert.strictEqual(_pt5.read(5).toString(), 'foogb');
    assert.strictEqual(_pt5.read(5).toString(), 'arkba');
    assert.strictEqual(_pt5.read(5).toString(), 'zykue');
    assert.strictEqual(_pt5.read(5).toString(), 'l');
  }));
}

{
  // Verify assymetric transform (expand)
  var _pt6 = new Transform();

  // emit each chunk 2 times.
  _pt6._transform = function (chunk, encoding, cb) {
    setTimeout(function () {
      _pt6.push(chunk);
      setTimeout(function () {
        _pt6.push(chunk);
        cb();
      }, 10);
    }, 10);
  };

  _pt6.write(bufferShim.from('foog'));
  _pt6.write(bufferShim.from('bark'));
  _pt6.write(bufferShim.from('bazy'));
  _pt6.write(bufferShim.from('kuel'));
  _pt6.end();

  _pt6.on('finish', common.mustCall(function () {
    assert.strictEqual(_pt6.read(5).toString(), 'foogf');
    assert.strictEqual(_pt6.read(5).toString(), 'oogba');
    assert.strictEqual(_pt6.read(5).toString(), 'rkbar');
    assert.strictEqual(_pt6.read(5).toString(), 'kbazy');
    assert.strictEqual(_pt6.read(5).toString(), 'bazyk');
    assert.strictEqual(_pt6.read(5).toString(), 'uelku');
    assert.strictEqual(_pt6.read(5).toString(), 'el');
  }));
}

{
  // Verify assymetric trasform (compress)
  var _pt7 = new Transform();

  // each output is the first char of 3 consecutive chunks,
  // or whatever's left.
  _pt7.state = '';

  _pt7._transform = function (chunk, encoding, cb) {
    if (!chunk) chunk = '';
    var s = chunk.toString();
    setTimeout(function () {
      this.state += s.charAt(0);
      if (this.state.length === 3) {
        _pt7.push(bufferShim.from(this.state));
        this.state = '';
      }
      cb();
    }.bind(this), 10);
  };

  _pt7._flush = function (cb) {
    // just output whatever we have.
    _pt7.push(bufferShim.from(this.state));
    this.state = '';
    cb();
  };

  _pt7.write(bufferShim.from('aaaa'));
  _pt7.write(bufferShim.from('bbbb'));
  _pt7.write(bufferShim.from('cccc'));
  _pt7.write(bufferShim.from('dddd'));
  _pt7.write(bufferShim.from('eeee'));
  _pt7.write(bufferShim.from('aaaa'));
  _pt7.write(bufferShim.from('bbbb'));
  _pt7.write(bufferShim.from('cccc'));
  _pt7.write(bufferShim.from('dddd'));
  _pt7.write(bufferShim.from('eeee'));
  _pt7.write(bufferShim.from('aaaa'));
  _pt7.write(bufferShim.from('bbbb'));
  _pt7.write(bufferShim.from('cccc'));
  _pt7.write(bufferShim.from('dddd'));
  _pt7.end();

  // 'abcdeabcdeabcd'
  _pt7.on('finish', common.mustCall(function () {
    assert.strictEqual(_pt7.read(5).toString(), 'abcde');
    assert.strictEqual(_pt7.read(5).toString(), 'abcde');
    assert.strictEqual(_pt7.read(5).toString(), 'abcd');
  }));
}

// this tests for a stall when data is written to a full stream
// that has empty transforms.
{
  // Verify compex transform behavior
  var count = 0;
  var saved = null;
  var _pt8 = new Transform({ highWaterMark: 3 });
  _pt8._transform = function (c, e, cb) {
    if (count++ === 1) saved = c;else {
      if (saved) {
        _pt8.push(saved);
        saved = null;
      }
      _pt8.push(c);
    }

    cb();
  };

  _pt8.once('readable', function () {
    process.nextTick(function () {
      _pt8.write(bufferShim.from('d'));
      _pt8.write(bufferShim.from('ef'), common.mustCall(function () {
        _pt8.end();
      }));
      assert.strictEqual(_pt8.read().toString(), 'abcdef');
      assert.strictEqual(_pt8.read(), null);
    });
  });

  _pt8.write(bufferShim.from('abc'));
}

{
  // Verify passthrough event emission
  var _pt9 = new PassThrough();
  var emits = 0;
  _pt9.on('readable', function () {
    emits++;
  });

  _pt9.write(bufferShim.from('foog'));
  _pt9.write(bufferShim.from('bark'));

  assert.strictEqual(emits, 1);
  assert.strictEqual(_pt9.read(5).toString(), 'foogb');
  assert.strictEqual(String(_pt9.read(5)), 'null');

  _pt9.write(bufferShim.from('bazy'));
  _pt9.write(bufferShim.from('kuel'));

  assert.strictEqual(emits, 2);
  assert.strictEqual(_pt9.read(5).toString(), 'arkba');
  assert.strictEqual(_pt9.read(5).toString(), 'zykue');
  assert.strictEqual(_pt9.read(5), null);

  _pt9.end();

  assert.strictEqual(emits, 3);
  assert.strictEqual(_pt9.read(5).toString(), 'l');
  assert.strictEqual(_pt9.read(5), null);

  assert.strictEqual(emits, 3);
}

{
  // Verify passthrough event emission reordering
  var _pt10 = new PassThrough();
  var _emits = 0;
  _pt10.on('readable', function () {
    _emits++;
  });

  _pt10.write(bufferShim.from('foog'));
  _pt10.write(bufferShim.from('bark'));

  assert.strictEqual(_emits, 1);
  assert.strictEqual(_pt10.read(5).toString(), 'foogb');
  assert.strictEqual(_pt10.read(5), null);

  _pt10.once('readable', common.mustCall(function () {
    assert.strictEqual(_pt10.read(5).toString(), 'arkba');
    assert.strictEqual(_pt10.read(5), null);

    _pt10.once('readable', common.mustCall(function () {
      assert.strictEqual(_pt10.read(5).toString(), 'zykue');
      assert.strictEqual(_pt10.read(5), null);
      _pt10.once('readable', common.mustCall(function () {
        assert.strictEqual(_pt10.read(5).toString(), 'l');
        assert.strictEqual(_pt10.read(5), null);
        assert.strictEqual(_emits, 4);
      }));
      _pt10.end();
    }));
    _pt10.write(bufferShim.from('kuel'));
  }));

  _pt10.write(bufferShim.from('bazy'));
}

{
  // Verify passthrough facade
  var _pt11 = new PassThrough();
  var datas = [];
  _pt11.on('data', function (chunk) {
    datas.push(chunk.toString());
  });

  _pt11.on('end', common.mustCall(function () {
    assert.deepStrictEqual(datas, ['foog', 'bark', 'bazy', 'kuel']);
  }));

  _pt11.write(bufferShim.from('foog'));
  setTimeout(function () {
    _pt11.write(bufferShim.from('bark'));
    setTimeout(function () {
      _pt11.write(bufferShim.from('bazy'));
      setTimeout(function () {
        _pt11.write(bufferShim.from('kuel'));
        setTimeout(function () {
          _pt11.end();
        }, 10);
      }, 10);
    }, 10);
  }, 10);
}

{
  // Verify object transform (JSON parse)
  var jp = new Transform({ objectMode: true });
  jp._transform = function (data, encoding, cb) {
    try {
      jp.push(JSON.parse(data));
      cb();
    } catch (er) {
      cb(er);
    }
  };

  // anything except null/undefined is fine.
  // those are "magic" in the stream API, because they signal EOF.
  var objects = [{ foo: 'bar' }, 100, 'string', { nested: { things: [{ foo: 'bar' }, 100, 'string'] } }];

  var ended = false;
  jp.on('end', function () {
    ended = true;
  });

  forEach(objects, function (obj) {
    jp.write(JSON.stringify(obj));
    var res = jp.read();
    assert.deepStrictEqual(res, obj);
  });

  jp.end();
  // read one more time to get the 'end' event
  jp.read();

  process.nextTick(common.mustCall(function () {
    assert.strictEqual(ended, true);
  }));
}

{
  // Verify object transform (JSON stringify)
  var js = new Transform({ objectMode: true });
  js._transform = function (data, encoding, cb) {
    try {
      js.push(JSON.stringify(data));
      cb();
    } catch (er) {
      cb(er);
    }
  };

  // anything except null/undefined is fine.
  // those are "magic" in the stream API, because they signal EOF.
  var _objects = [{ foo: 'bar' }, 100, 'string', { nested: { things: [{ foo: 'bar' }, 100, 'string'] } }];

  var _ended = false;
  js.on('end', function () {
    _ended = true;
  });

  forEach(_objects, function (obj) {
    js.write(obj);
    var res = js.read();
    assert.strictEqual(res, JSON.stringify(obj));
  });

  js.end();
  // read one more time to get the 'end' event
  js.read();

  process.nextTick(common.mustCall(function () {
    assert.strictEqual(_ended, true);
  }));
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}