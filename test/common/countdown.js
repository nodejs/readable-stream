"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*<replacement>*/
require('@babel/polyfill');

var util = require('util');

for (var i in util) {
  exports[i] = util[i];
}
/*</replacement>*/

/* eslint-disable node-core/required-modules */


'use strict';
/*<replacement>*/


var objectKeys = objectKeys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var assert = require('assert');

var kLimit = Symbol('limit');
var kCallback = Symbol('callback');

var common = require('./');

var Countdown =
/*#__PURE__*/
function () {
  function Countdown(limit, cb) {
    assert.strictEqual(typeof limit, 'number');
    assert.strictEqual(typeof cb, 'function');
    this[kLimit] = limit;
    this[kCallback] = common.mustCall(cb);
  }

  var _proto = Countdown.prototype;

  _proto.dec = function dec() {
    assert(this[kLimit] > 0, 'Countdown expired');
    if (--this[kLimit] === 0) this[kCallback]();
    return this[kLimit];
  };

  _createClass(Countdown, [{
    key: "remaining",
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