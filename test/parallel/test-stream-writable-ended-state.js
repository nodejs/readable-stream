/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

var common = require('../common');

var assert = require('assert/');
var stream = require('../../');

var writable = new stream.Writable();

writable._write = function (chunk, encoding, cb) {
  assert.strictEqual(writable._writableState.ended, false);
  cb();
};

assert.strictEqual(writable._writableState.ended, false);

writable.end('testing ended state', common.mustCall(function () {
  assert.strictEqual(writable._writableState.ended, true);
}));

assert.strictEqual(writable._writableState.ended, true);