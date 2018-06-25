'use strict';

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _createClass2;

function _load_createClass() {
  return _createClass2 = _interopRequireDefault(require('babel-runtime/helpers/createClass'));
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

var assert = require('assert');
var kLimit = (0, (_symbol || _load_symbol()).default)('limit');
var kCallback = (0, (_symbol || _load_symbol()).default)('callback');
var common = require('./');

var Countdown = function () {
  function Countdown(limit, cb) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, Countdown);

    assert.strictEqual(typeof limit, 'number');
    assert.strictEqual(typeof cb, 'function');
    this[kLimit] = limit;
    this[kCallback] = common.mustCall(cb);
  }

  Countdown.prototype.dec = function dec() {
    assert(this[kLimit] > 0, 'Countdown expired');
    if (--this[kLimit] === 0) this[kCallback]();
    return this[kLimit];
  };

  (0, (_createClass2 || _load_createClass()).default)(Countdown, [{
    key: 'remaining',
    get: function () {
      return this[kLimit];
    }
  }]);
  return Countdown;
}();

module.exports = Countdown;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}