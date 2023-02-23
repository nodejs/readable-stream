"use strict";

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

const assert = require('assert');
const kLimit = Symbol('limit');
const kCallback = Symbol('callback');
const common = require('./');
class Countdown {
  constructor(limit, cb) {
    assert.strictEqual(typeof limit, 'number');
    assert.strictEqual(typeof cb, 'function');
    this[kLimit] = limit;
    this[kCallback] = common.mustCall(cb);
  }
  dec() {
    assert(this[kLimit] > 0, 'Countdown expired');
    if (--this[kLimit] === 0) this[kCallback]();
    return this[kLimit];
  }
  get remaining() {
    return this[kLimit];
  }
}
module.exports = Countdown;
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}