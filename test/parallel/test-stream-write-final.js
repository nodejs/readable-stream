/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var stream = require('../../');
var shutdown = false;

var w = new stream.Writable({
  final: common.mustCall(function (cb) {
    assert.strictEqual(this, w);
    setTimeout(function () {
      shutdown = true;
      cb();
    }, 100);
  }),
  write: function (chunk, e, cb) {
    process.nextTick(cb);
  }
});
w.on('finish', common.mustCall(function () {
  assert(shutdown);
}));
w.write(bufferShim.allocUnsafe(1));
w.end(bufferShim.allocUnsafe(0));