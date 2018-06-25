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

var _symbol;

function _load_symbol() {
  return _symbol = _interopRequireDefault(require('babel-runtime/core-js/symbol'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/ /* eslint-disable node-core/required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var _require = require('../../'),
    Duplex = _require.Duplex;

var assert = require('assert');

var kCallback = (0, (_symbol || _load_symbol()).default)('Callback');
var kOtherSide = (0, (_symbol || _load_symbol()).default)('Other');

var DuplexSocket = function (_Duplex) {
  (0, (_inherits2 || _load_inherits()).default)(DuplexSocket, _Duplex);

  function DuplexSocket() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, DuplexSocket);

    var _this = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Duplex.call(this));

    _this[kCallback] = null;
    _this[kOtherSide] = null;
    return _this;
  }

  DuplexSocket.prototype._read = function _read() {
    var callback = this[kCallback];
    if (callback) {
      this[kCallback] = null;
      callback();
    }
  };

  DuplexSocket.prototype._write = function _write(chunk, encoding, callback) {
    assert.notStrictEqual(this[kOtherSide], null);
    assert.strictEqual(this[kOtherSide][kCallback], null);
    this[kOtherSide][kCallback] = callback;
    this[kOtherSide].push(chunk);
  };

  DuplexSocket.prototype._final = function _final(callback) {
    this[kOtherSide].on('end', callback);
    this[kOtherSide].push(null);
  };

  return DuplexSocket;
}(Duplex);

function makeDuplexPair() {
  var clientSide = new DuplexSocket();
  var serverSide = new DuplexSocket();
  clientSide[kOtherSide] = serverSide;
  serverSide[kOtherSide] = clientSide;
  return { clientSide: clientSide, serverSide: serverSide };
}

module.exports = makeDuplexPair;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}