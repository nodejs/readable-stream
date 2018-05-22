function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (process.version.indexOf('v0.8') === 0) {
  process.exit(0);
}
/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var _require = require('../../'),
    Writable = _require.Writable,
    Readable = _require.Readable;

var NullWriteable = function (_Writable) {
  _inherits(NullWriteable, _Writable);

  function NullWriteable() {
    _classCallCheck(this, NullWriteable);

    return _possibleConstructorReturn(this, _Writable.apply(this, arguments));
  }

  NullWriteable.prototype._write = function _write(chunk, encoding, callback) {
    return callback();
  };

  return NullWriteable;
}(Writable);

var QuickEndReadable = function (_Readable) {
  _inherits(QuickEndReadable, _Readable);

  function QuickEndReadable() {
    _classCallCheck(this, QuickEndReadable);

    return _possibleConstructorReturn(this, _Readable.apply(this, arguments));
  }

  QuickEndReadable.prototype._read = function _read() {
    this.push(null);
  };

  return QuickEndReadable;
}(Readable);

var NeverEndReadable = function (_Readable2) {
  _inherits(NeverEndReadable, _Readable2);

  function NeverEndReadable() {
    _classCallCheck(this, NeverEndReadable);

    return _possibleConstructorReturn(this, _Readable2.apply(this, arguments));
  }

  NeverEndReadable.prototype._read = function _read() {};

  return NeverEndReadable;
}(Readable);

{
  var dest = new NullWriteable();
  var src = new QuickEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustCall());
  src.pipe(dest);
  setImmediate(function () {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}

{
  var _dest = new NullWriteable();
  var _src = new NeverEndReadable();
  _dest.on('pipe', common.mustCall());
  _dest.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  _src.pipe(_dest);
  setImmediate(function () {
    assert.strictEqual(_src._readableState.pipesCount, 1);
  });
}

{
  var _dest2 = new NullWriteable();
  var _src2 = new NeverEndReadable();
  _dest2.on('pipe', common.mustCall());
  _dest2.on('unpipe', common.mustCall());
  _src2.pipe(_dest2);
  _src2.unpipe(_dest2);
  setImmediate(function () {
    assert.strictEqual(_src2._readableState.pipesCount, 0);
  });
}

{
  var _dest3 = new NullWriteable();
  var _src3 = new QuickEndReadable();
  _dest3.on('pipe', common.mustCall());
  _dest3.on('unpipe', common.mustCall());
  _src3.pipe(_dest3, { end: false });
  setImmediate(function () {
    assert.strictEqual(_src3._readableState.pipesCount, 0);
  });
}

{
  var _dest4 = new NullWriteable();
  var _src4 = new NeverEndReadable();
  _dest4.on('pipe', common.mustCall());
  _dest4.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  _src4.pipe(_dest4, { end: false });
  setImmediate(function () {
    assert.strictEqual(_src4._readableState.pipesCount, 1);
  });
}

{
  var _dest5 = new NullWriteable();
  var _src5 = new NeverEndReadable();
  _dest5.on('pipe', common.mustCall());
  _dest5.on('unpipe', common.mustCall());
  _src5.pipe(_dest5, { end: false });
  _src5.unpipe(_dest5);
  setImmediate(function () {
    assert.strictEqual(_src5._readableState.pipesCount, 0);
  });
}
;require('tap').pass('sync run');