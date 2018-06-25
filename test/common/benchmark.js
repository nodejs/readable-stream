'use strict';

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
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

  var mergedEnv = (0, (_assign || _load_assign()).default)({}, process.env, env);

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