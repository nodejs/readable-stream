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

const path = require('path');
const fs = require('fs');
const fixturesDir = path.join(__dirname, '..', 'fixtures');
function fixturesPath() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return path.join(fixturesDir, ...args);
}
function readFixtureSync(args, enc) {
  if (Array.isArray(args)) return fs.readFileSync(fixturesPath(...args), enc);
  return fs.readFileSync(fixturesPath(args), enc);
}
function readFixtureKey(name, enc) {
  return fs.readFileSync(fixturesPath('keys', name), enc);
}
module.exports = {
  fixturesDir,
  path: fixturesPath,
  readSync: readFixtureSync,
  readKey: readFixtureKey
};
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}