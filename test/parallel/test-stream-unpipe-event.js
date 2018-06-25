'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _possibleConstructorReturn2;

function _load_possibleConstructorReturn() {
  return _possibleConstructorReturn2 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
}

var _inherits2;

function _load_inherits() {
  return _inherits2 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  (0, (_inherits2 || _load_inherits()).default)(NullWriteable, _Writable);

  function NullWriteable() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, NullWriteable);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Writable.apply(this, arguments));
  }

  NullWriteable.prototype._write = function _write(chunk, encoding, callback) {
    return callback();
  };

  return NullWriteable;
}(Writable);

var QuickEndReadable = function (_Readable) {
  (0, (_inherits2 || _load_inherits()).default)(QuickEndReadable, _Readable);

  function QuickEndReadable() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, QuickEndReadable);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Readable.apply(this, arguments));
  }

  QuickEndReadable.prototype._read = function _read() {
    this.push(null);
  };

  return QuickEndReadable;
}(Readable);

var NeverEndReadable = function (_Readable2) {
  (0, (_inherits2 || _load_inherits()).default)(NeverEndReadable, _Readable2);

  function NeverEndReadable() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, NeverEndReadable);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Readable2.apply(this, arguments));
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
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}

{
  var _dest = new NullWriteable();
  var _src = new NeverEndReadable();
  _dest.on('pipe', common.mustCall());
  _dest.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  _src.pipe(_dest);
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
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
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    assert.strictEqual(_src2._readableState.pipesCount, 0);
  });
}

{
  var _dest3 = new NullWriteable();
  var _src3 = new QuickEndReadable();
  _dest3.on('pipe', common.mustCall());
  _dest3.on('unpipe', common.mustCall());
  _src3.pipe(_dest3, { end: false });
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    assert.strictEqual(_src3._readableState.pipesCount, 0);
  });
}

{
  var _dest4 = new NullWriteable();
  var _src4 = new NeverEndReadable();
  _dest4.on('pipe', common.mustCall());
  _dest4.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  _src4.pipe(_dest4, { end: false });
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
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
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    assert.strictEqual(_src5._readableState.pipesCount, 0);
  });
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});