/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var assert = require('assert/');
var stream = require('../../');

var pushes = 0;
var total = 65500 + 40 * 1024;
var rs = new stream.Readable({
  read: common.mustCall(function () {
    if (pushes++ === 10) {
      this.push(null);
      return;
    }

    var length = this._readableState.length;

    // We are at most doing two full runs of _reads
    // before stopping, because Readable is greedy
    // to keep its buffer full
    assert(length <= total);

    this.push(bufferShim.alloc(65500));
    for (var i = 0; i < 40; i++) {
      this.push(bufferShim.alloc(1024));
    }

    // We will be over highWaterMark at this point
    // but a new call to _read is scheduled anyway.
  }, 11)
});

var ws = stream.Writable({
  write: common.mustCall(function (data, enc, cb) {
    setImmediate(cb);
  }, 41 * 10)
});

rs.pipe(ws);
;require('tap').pass('sync run');