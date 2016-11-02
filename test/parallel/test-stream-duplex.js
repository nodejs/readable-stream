/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var assert = require('assert/');
var Duplex = require('../../').Transform;

var stream = new Duplex({ objectMode: true });

assert(stream._readableState.objectMode);
assert(stream._writableState.objectMode);

var written = void 0;
var read = void 0;

stream._write = function (obj, _, cb) {
  written = obj;
  cb();
};

stream._read = function () {};

stream.on('data', function (obj) {
  read = obj;
});

stream.push({ val: 1 });
stream.end({ val: 2 });

process.on('exit', function () {
  assert.strictEqual(read.val, 1);
  assert.strictEqual(written.val, 2);
});