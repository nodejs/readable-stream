/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

var common = require('../common');

var assert = require('assert/');
var stream = require('../../');

var writable = new stream.Writable();

writable._write = function (chunk, encoding, cb) {
  // The state finished should start in false.
  assert.strictEqual(writable._writableState.finished, false);
  cb();
};

writable.on('finish', common.mustCall(function () {
  assert.strictEqual(writable._writableState.finished, true);
}));

writable.end('testing finished state', common.mustCall(function () {
  assert.strictEqual(writable._writableState.finished, true);
}));