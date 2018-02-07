/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

require('../common');
var stream = require('../../');
var assert = require('assert/');

var readable = new stream.Readable({
  read: function () {}
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