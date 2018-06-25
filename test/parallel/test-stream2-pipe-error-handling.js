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
require('../common');
var assert = require('assert/');
var stream = require('../../');

{
  var count = 1000;

  var source = new stream.Readable();
  source._read = function (n) {
    n = Math.min(count, n);
    count -= n;
    source.push(bufferShim.allocUnsafe(n));
  };

  var unpipedDest = void 0;
  source.unpipe = function (dest) {
    unpipedDest = dest;
    stream.Readable.prototype.unpipe.call(this, dest);
  };

  var dest = new stream.Writable();
  dest._write = function (chunk, encoding, cb) {
    cb();
  };

  source.pipe(dest);

  var gotErr = null;
  dest.on('error', function (err) {
    gotErr = err;
  });

  var unpipedSource = void 0;
  dest.on('unpipe', function (src) {
    unpipedSource = src;
  });

  var err = new Error('This stream turned into bacon.');
  dest.emit('error', err);
  assert.strictEqual(gotErr, err);
  assert.strictEqual(unpipedSource, source);
  assert.strictEqual(unpipedDest, dest);
}

{
  var _count = 1000;

  var _source = new stream.Readable();
  _source._read = function (n) {
    n = Math.min(_count, n);
    _count -= n;
    _source.push(bufferShim.allocUnsafe(n));
  };

  var _unpipedDest = void 0;
  _source.unpipe = function (dest) {
    _unpipedDest = dest;
    stream.Readable.prototype.unpipe.call(this, dest);
  };

  var _dest = new stream.Writable();
  _dest._write = function (chunk, encoding, cb) {
    cb();
  };

  _source.pipe(_dest);

  var _unpipedSource = void 0;
  _dest.on('unpipe', function (src) {
    _unpipedSource = src;
  });

  var _err = new Error('This stream turned into bacon.');

  var _gotErr = null;
  try {
    _dest.emit('error', _err);
  } catch (e) {
    _gotErr = e;
  }
  assert.strictEqual(_gotErr, _err);
  assert.strictEqual(_unpipedSource, _source);
  assert.strictEqual(_unpipedDest, _dest);
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});