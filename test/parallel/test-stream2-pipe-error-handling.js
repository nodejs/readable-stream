/*<replacement>*/
var bufferShim = require('buffer-shims');
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