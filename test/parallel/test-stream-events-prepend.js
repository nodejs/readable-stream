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
var stream = require('../../');

var Writable = function (_stream$Writable) {
  (0, (_inherits2 || _load_inherits()).default)(Writable, _stream$Writable);

  function Writable() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, Writable);

    var _this = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Writable.call(this));

    _this.prependListener = undefined;
    return _this;
  }

  Writable.prototype._write = function _write(chunk, end, cb) {
    cb();
  };

  return Writable;
}(stream.Writable);

var Readable = function (_stream$Readable) {
  (0, (_inherits2 || _load_inherits()).default)(Readable, _stream$Readable);

  function Readable() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, Readable);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Readable.apply(this, arguments));
  }

  Readable.prototype._read = function _read() {
    this.push(null);
  };

  return Readable;
}(stream.Readable);

var w = new Writable();
w.on('pipe', common.mustCall());

var r = new Readable();
r.pipe(w);
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});