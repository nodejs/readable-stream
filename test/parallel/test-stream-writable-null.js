'use strict';

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

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var stream = require('../../');

var MyWritable = function (_stream$Writable) {
  (0, (_inherits2 || _load_inherits()).default)(MyWritable, _stream$Writable);

  function MyWritable(opt) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, MyWritable);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Writable.call(this, opt));
  }

  MyWritable.prototype._write = function _write(chunk, encoding, callback) {
    assert.notStrictEqual(chunk, null);
    callback();
  };

  return MyWritable;
}(stream.Writable);

common.expectsError(function () {
  var m = new MyWritable({ objectMode: true });
  m.write(null, function (err) {
    return assert.ok(err);
  });
}, {
  code: 'ERR_STREAM_NULL_VALUES',
  type: TypeError,
  message: 'May not write null values to stream'
});

{
  // Should not throw.
  var m = new MyWritable({ objectMode: true }).on('error', assert);
  m.write(null, assert);
}

common.expectsError(function () {
  var m = new MyWritable();
  m.write(false, function (err) {
    return assert.ok(err);
  });
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError
});

{
  // Should not throw.
  var _m = new MyWritable().on('error', assert);
  _m.write(false, assert);
}

{
  // Should not throw.
  var _m2 = new MyWritable({ objectMode: true });
  _m2.write(false, assert.ifError);
}

{
  // Should not throw.
  var _m3 = new MyWritable({ objectMode: true }).on('error', function (e) {
    assert.ifError(e || new Error('should not get here'));
  });
  _m3.write(false, assert.ifError);
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});