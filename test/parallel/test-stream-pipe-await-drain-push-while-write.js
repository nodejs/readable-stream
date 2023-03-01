"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var stream = require('../../');
var assert = require('assert/');
var writable = new stream.Writable({
  write: common.mustCall(function (chunk, encoding, cb) {
    assert.strictEqual(readable._readableState.awaitDrain, 0);
    if (chunk.length === 32 * 1024) {
      // first chunk
      readable.push(bufferShim.alloc(34 * 1024)); // above hwm
      // We should check if awaitDrain counter is increased in the next
      // tick, because awaitDrain is incremented after this method finished
      process.nextTick(function () {
        assert.strictEqual(readable._readableState.awaitDrain, 1);
      });
    }
    cb();
  }, 3)
});

// A readable stream which produces two buffers.
var bufs = [bufferShim.alloc(32 * 1024), bufferShim.alloc(33 * 1024)]; // above hwm
var readable = new stream.Readable({
  read: function read() {
    while (bufs.length > 0) {
      this.push(bufs.shift());
    }
  }
});
readable.pipe(writable);
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});