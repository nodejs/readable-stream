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
var fork = require('child_process').fork;
var path = require('path');

var runjs = path.join(__dirname, '..', '..', 'benchmark', 'run.js');

function runBenchmark(name, args, env) {
  var argv = [];

  for (var _i = 0; _i < args.length; _i++) {
    argv.push('--set');
    argv.push(args[_i]);
  }

  argv.push(name);

  var mergedEnv = Object.assign({}, process.env, env);

  var child = fork(runjs, argv, { env: mergedEnv });
  child.on('exit', function (code, signal) {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
  });
}

module.exports = runBenchmark;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}