"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*<replacement>*/
require('@babel/polyfill');
var util = require('util');
for (var i in util) exports[i] = util[i];
/*</replacement>*/ /* eslint-disable node-core/required-modules */

'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

var assert = require('assert');
var kLimit = Symbol('limit');
var kCallback = Symbol('callback');
var common = require('./');
var Countdown = /*#__PURE__*/function () {
  function Countdown(limit, cb) {
    _classCallCheck(this, Countdown);
    assert.strictEqual(typeof limit, 'number');
    assert.strictEqual(typeof cb, 'function');
    this[kLimit] = limit;
    this[kCallback] = common.mustCall(cb);
  }
  _createClass(Countdown, [{
    key: "dec",
    value: function dec() {
      assert(this[kLimit] > 0, 'Countdown expired');
      if (--this[kLimit] === 0) this[kCallback]();
      return this[kLimit];
    }
  }, {
    key: "remaining",
    get: function get() {
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