/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var stream = require('../../');
var assert = require('assert/');

var readable = new stream.Readable({
  read: common.noop
});

var errMessage = /Invalid non-string\/buffer chunk/;
assert.throws(function () {
  return readable.push([]);
}, errMessage);
assert.throws(function () {
  return readable.push({});
}, errMessage);
assert.throws(function () {
  return readable.push(0);
}, errMessage);