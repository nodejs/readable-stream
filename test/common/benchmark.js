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
  var child = fork(runjs, argv, {
    env: mergedEnv,
    stdio: ['inherit', 'pipe', 'inherit', 'ipc']
  });
  child.stdout.setEncoding('utf8');
  var stdout = '';
  child.stdout.on('data', function (line) {
    stdout += line;
  });
  child.on('exit', function (code, signal) {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
    // This bit makes sure that each benchmark file is being sent settings such
    // that the benchmark file runs just one set of options. This helps keep the
    // benchmark tests from taking a long time to run. Therefore, each benchmark
    // file should result in three lines of output: a blank line, a line with
    // the name of the benchmark file, and a line with the only results that we
    // get from testing the benchmark file.
    assert.ok(/^(?:\n.+?\n.+?\n)+$/.test(stdout), "benchmark file not running exactly one configuration in test: ".concat(stdout));
  });
}
module.exports = runBenchmark;
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}