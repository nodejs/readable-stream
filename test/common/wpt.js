/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/ /*<replacement>*/
if (!global.setImmediate) {
  global.setImmediate = function setImmediate(fn) {
    return setTimeout(fn.bind.apply(fn, arguments), 4);
  };
}
if (!global.clearImmediate) {
  global.clearImmediate = function clearImmediate(i) {
    return clearTimeout(i);
  };
}
/*</replacement>*/
/* eslint-disable required-modules */
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

// https://github.com/w3c/testharness.js/blob/master/testharness.js
module.exports = {
  test: function (fn, desc) {
    try {
      fn();
    } catch (err) {
      console.error('In ' + desc + ':');
      throw err;
    }
  },
  assert_equals: assert.strictEqual,
  assert_true: function (value, message) {
    return assert.strictEqual(value, true, message);
  },
  assert_false: function (value, message) {
    return assert.strictEqual(value, false, message);
  },
  assert_throws: function (code, func, desc) {
    assert.throws(func, function (err) {
      return typeof err === 'object' && 'name' in err && err.name.startsWith(code.name);
    }, desc);
  },
  assert_array_equals: assert.deepStrictEqual,
  assert_unreached: function (desc) {
    assert.fail('Reached unreachable code: ' + desc);
  }
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}