/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
require('../common');
var stream = require('../../');
var assert = require('assert/');

var readable = new stream.Readable();

assert.throws(function () {
  return readable.read();
}, /not implemented/);