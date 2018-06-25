'use strict';

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
var Readable = require('../../lib/_stream_readable');
var Writable = require('../../lib/_stream_writable');
var assert = require('assert/');

function toArray(callback) {
  var stream = new Writable({ objectMode: true });
  var list = [];
  stream.write = function (chunk) {
    list.push(chunk);
  };

  stream.end = common.mustCall(function () {
    callback(list);
  });

  return stream;
}

function fromArray(list) {
  var r = new Readable({ objectMode: true });
  r._read = common.mustNotCall();
  forEach(list, function (chunk) {
    r.push(chunk);
  });
  r.push(null);

  return r;
}

{
  // Verify that objects can be read from the stream
  var r = fromArray([{ one: '1' }, { two: '2' }]);

  var v1 = r.read();
  var v2 = r.read();
  var v3 = r.read();

  assert.deepStrictEqual(v1, { one: '1' });
  assert.deepStrictEqual(v2, { two: '2' });
  assert.deepStrictEqual(v3, null);
}

{
  // Verify that objects can be piped into the stream
  var _r = fromArray([{ one: '1' }, { two: '2' }]);

  _r.pipe(toArray(common.mustCall(function (list) {
    assert.deepStrictEqual(list, [{ one: '1' }, { two: '2' }]);
  })));
}

{
  // Verify that read(n) is ignored
  var _r2 = fromArray([{ one: '1' }, { two: '2' }]);
  var value = _r2.read(2);

  assert.deepStrictEqual(value, { one: '1' });
}

{
  // Verify that objects can be synchronously read
  var _r3 = new Readable({ objectMode: true });
  var list = [{ one: '1' }, { two: '2' }];
  _r3._read = function (n) {
    var item = list.shift();
    _r3.push(item || null);
  };

  _r3.pipe(toArray(common.mustCall(function (list) {
    assert.deepStrictEqual(list, [{ one: '1' }, { two: '2' }]);
  })));
}

{
  // Verify that objects can be asynchronously read
  var _r4 = new Readable({ objectMode: true });
  var _list2 = [{ one: '1' }, { two: '2' }];
  _r4._read = function (n) {
    var item = _list2.shift();
    process.nextTick(function () {
      _r4.push(item || null);
    });
  };

  _r4.pipe(toArray(common.mustCall(function (list) {
    assert.deepStrictEqual(list, [{ one: '1' }, { two: '2' }]);
  })));
}

{
  // Verify that strings can be read as objects
  var _r5 = new Readable({
    objectMode: true
  });
  _r5._read = common.mustNotCall();
  var _list3 = ['one', 'two', 'three'];
  forEach(_list3, function (str) {
    _r5.push(str);
  });
  _r5.push(null);

  _r5.pipe(toArray(common.mustCall(function (array) {
    assert.deepStrictEqual(array, _list3);
  })));
}

{
  // Verify read(0) behavior for object streams
  var _r6 = new Readable({
    objectMode: true
  });
  _r6._read = common.mustNotCall();

  _r6.push('foobar');
  _r6.push(null);

  _r6.pipe(toArray(common.mustCall(function (array) {
    assert.deepStrictEqual(array, ['foobar']);
  })));
}

{
  // Verify the behavior of pushing falsey values
  var _r7 = new Readable({
    objectMode: true
  });
  _r7._read = common.mustNotCall();

  _r7.push(false);
  _r7.push(0);
  _r7.push('');
  _r7.push(null);

  _r7.pipe(toArray(common.mustCall(function (array) {
    assert.deepStrictEqual(array, [false, 0, '']);
  })));
}

{
  // Verify high watermark _read() behavior
  var _r8 = new Readable({
    highWaterMark: 6,
    objectMode: true
  });
  var calls = 0;
  var _list4 = ['1', '2', '3', '4', '5', '6', '7', '8'];

  _r8._read = function (n) {
    calls++;
  };

  forEach(_list4, function (c) {
    _r8.push(c);
  });

  var v = _r8.read();

  assert.strictEqual(calls, 0);
  assert.strictEqual(v, '1');

  var _v = _r8.read();
  assert.strictEqual(_v, '2');

  var _v2 = _r8.read();
  assert.strictEqual(_v2, '3');

  assert.strictEqual(calls, 1);
}

{
  // Verify high watermark push behavior
  var _r9 = new Readable({
    highWaterMark: 6,
    objectMode: true
  });
  _r9._read = common.mustNotCall();
  for (var i = 0; i < 6; i++) {
    var bool = _r9.push(i);
    assert.strictEqual(bool, i !== 5);
  }
}

{
  // Verify that objects can be written to stream
  var w = new Writable({ objectMode: true });

  w._write = function (chunk, encoding, cb) {
    assert.deepStrictEqual(chunk, { foo: 'bar' });
    cb();
  };

  w.on('finish', common.mustCall());
  w.write({ foo: 'bar' });
  w.end();
}

{
  // Verify that multiple objects can be written to stream
  var _w = new Writable({ objectMode: true });
  var _list5 = [];

  _w._write = function (chunk, encoding, cb) {
    _list5.push(chunk);
    cb();
  };

  _w.on('finish', common.mustCall(function () {
    assert.deepStrictEqual(_list5, [0, 1, 2, 3, 4]);
  }));

  _w.write(0);
  _w.write(1);
  _w.write(2);
  _w.write(3);
  _w.write(4);
  _w.end();
}

{
  // Verify that strings can be written as objects
  var _w2 = new Writable({
    objectMode: true
  });
  var _list6 = [];

  _w2._write = function (chunk, encoding, cb) {
    _list6.push(chunk);
    process.nextTick(cb);
  };

  _w2.on('finish', common.mustCall(function () {
    assert.deepStrictEqual(_list6, ['0', '1', '2', '3', '4']);
  }));

  _w2.write('0');
  _w2.write('1');
  _w2.write('2');
  _w2.write('3');
  _w2.write('4');
  _w2.end();
}

{
  // Verify that stream buffers finish until callback is called
  var _w3 = new Writable({
    objectMode: true
  });
  var called = false;

  _w3._write = function (chunk, encoding, cb) {
    assert.strictEqual(chunk, 'foo');

    process.nextTick(function () {
      called = true;
      cb();
    });
  };

  _w3.on('finish', common.mustCall(function () {
    assert.strictEqual(called, true);
  }));

  _w3.write('foo');
  _w3.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});