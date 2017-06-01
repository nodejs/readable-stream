var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    return _possibleConstructorReturn(this, (NullWriteable.__proto__ || Object.getPrototypeOf(NullWriteable)).apply(this, arguments));
  }

  _createClass(NullWriteable, [{
    key: '_write',
    value: function _write(chunk, encoding, callback) {
      return callback();
    }
  }]);

  return NullWriteable;
}(Writable);

var QuickEndReadable = function (_Readable) {
  _inherits(QuickEndReadable, _Readable);

  function QuickEndReadable() {
    _classCallCheck(this, QuickEndReadable);

    return _possibleConstructorReturn(this, (QuickEndReadable.__proto__ || Object.getPrototypeOf(QuickEndReadable)).apply(this, arguments));
  }

  _createClass(QuickEndReadable, [{
    key: '_read',
    value: function _read() {
      this.push(null);
    }
  }]);

  return QuickEndReadable;
}(Readable);

var NeverEndReadable = function (_Readable2) {
  _inherits(NeverEndReadable, _Readable2);

  function NeverEndReadable() {
    _classCallCheck(this, NeverEndReadable);

    return _possibleConstructorReturn(this, (NeverEndReadable.__proto__ || Object.getPrototypeOf(NeverEndReadable)).apply(this, arguments));
  }

  _createClass(NeverEndReadable, [{
    key: '_read',
    value: function _read() {}
  }]);

  return NeverEndReadable;
}(Readable);

function noop() {}

{
  var dest = new NullWriteable();
  var src = new QuickEndReadable();
  dest.on('pipe', common.mustCall(noop));
  dest.on('unpipe', common.mustCall(noop));
  src.pipe(dest);
  setImmediate(function () {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}

{
  var _dest = new NullWriteable();
  var _src = new NeverEndReadable();
  _dest.on('pipe', common.mustCall(noop));
  _dest.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  _src.pipe(_dest);
  setImmediate(function () {
    assert.strictEqual(_src._readableState.pipesCount, 1);
  });
}

{
  var _dest2 = new NullWriteable();
  var _src2 = new NeverEndReadable();
  _dest2.on('pipe', common.mustCall(noop));
  _dest2.on('unpipe', common.mustCall(noop));
  _src2.pipe(_dest2);
  _src2.unpipe(_dest2);
  setImmediate(function () {
    assert.strictEqual(_src2._readableState.pipesCount, 0);
  });
}

{
  var _dest3 = new NullWriteable();
  var _src3 = new QuickEndReadable();
  _dest3.on('pipe', common.mustCall(noop));
  _dest3.on('unpipe', common.mustCall(noop));
  _src3.pipe(_dest3, { end: false });
  setImmediate(function () {
    assert.strictEqual(_src3._readableState.pipesCount, 0);
  });
}

{
  var _dest4 = new NullWriteable();
  var _src4 = new NeverEndReadable();
  _dest4.on('pipe', common.mustCall(noop));
  _dest4.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  _src4.pipe(_dest4, { end: false });
  setImmediate(function () {
    assert.strictEqual(_src4._readableState.pipesCount, 1);
  });
}

{
  var _dest5 = new NullWriteable();
  var _src5 = new NeverEndReadable();
  _dest5.on('pipe', common.mustCall(noop));
  _dest5.on('unpipe', common.mustCall(noop));
  _src5.pipe(_dest5, { end: false });
  _src5.unpipe(_dest5);
  setImmediate(function () {
    assert.strictEqual(_src5._readableState.pipesCount, 0);
  });
}