"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const stream = require('../../');
const assert = require('assert/');
const writable = new stream.Writable({
  write: common.mustCall(function (chunk, encoding, cb) {
    assert.strictEqual(readable._readableState.awaitDrain, 0);
    if (chunk.length === 32 * 1024) {
      // first chunk
      readable.push(bufferShim.alloc(34 * 1024)); // above hwm
      // We should check if awaitDrain counter is increased in the next
      // tick, because awaitDrain is incremented after this method finished
      process.nextTick(() => {
        assert.strictEqual(readable._readableState.awaitDrain, 1);
      });
    }
    cb();
  }, 3)
});

// A readable stream which produces two buffers.
const bufs = [bufferShim.alloc(32 * 1024), bufferShim.alloc(33 * 1024)]; // above hwm
const readable = new stream.Readable({
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
_list.forEach(e => process.on('uncaughtException', e));