/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var stream = require('../../');
var assert = require('assert/');

var readable = new stream.Readable({
  read: function () {}
});

assert.throws(function () {
  return readable.push([]);
}, /Invalid non-string\/buffer chunk/);
assert.throws(function () {
  return readable.push({});
}, /Invalid non-string\/buffer chunk/);
assert.throws(function () {
  return readable.push(0);
}, /Invalid non-string\/buffer chunk/);