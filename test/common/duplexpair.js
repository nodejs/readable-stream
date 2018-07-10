'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var kCallback = Symbol('Callback');
var kOtherSide = Symbol('Other');

var DuplexSocket = function (_Duplex) {
  _inherits(DuplexSocket, _Duplex);

  function DuplexSocket() {
    _classCallCheck(this, DuplexSocket);

    var _this = _possibleConstructorReturn(this, _Duplex.call(this));

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