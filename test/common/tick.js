"use strict";

/*<replacement>*/
require('@babel/polyfill');
var util = require('util');
for (var i in util) exports[i] = util[i];
/*</replacement>*/
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

require('../common');
module.exports = function tick(x, cb) {
  function ontick() {
    if (--x === 0) {
      if (typeof cb === 'function') cb();
    } else {
      setImmediate(ontick);
    }
  }
  setImmediate(ontick);
};
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}