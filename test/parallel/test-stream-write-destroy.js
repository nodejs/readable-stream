"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


require('../common');

var assert = require('assert/');

var _require = require('../../'),
    Writable = _require.Writable; // Test interaction between calling .destroy() on a writable and pending
// writes.


var _arr = [false, true];

for (var _i = 0; _i < _arr.length; _i++) {
  var withPendingData = _arr[_i];
  var _arr2 = [false, true];

  var _loop = function _loop() {
    var useEnd = _arr2[_i2];
    var callbacks = [];
    var w = new Writable({
      write: function write(data, enc, cb) {
        callbacks.push(cb);
      },
      // Effectively disable the HWM to observe 'drain' events more easily.
      highWaterMark: 1
    });
    var chunksWritten = 0;
    var drains = 0;
    var finished = false;
    w.on('drain', function () {
      return drains++;
    });
    w.on('finish', function () {
      return finished = true;
    });
    w.write('abc', function () {
      return chunksWritten++;
    });
    assert.strictEqual(chunksWritten, 0);
    assert.strictEqual(drains, 0);
    callbacks.shift()();
    assert.strictEqual(chunksWritten, 1);
    assert.strictEqual(drains, 1);

    if (withPendingData) {
      // Test 2 cases: There either is or is not data still in the write queue.
      // (The second write will never actually get executed either way.)
      w.write('def', function () {
        return chunksWritten++;
      });
    }

    if (useEnd) {
      // Again, test 2 cases: Either we indicate that we want to end the
      // writable or not.
      w.end('ghi', function () {
        return chunksWritten++;
      });
    } else {
      w.write('ghi', function () {
        return chunksWritten++;
      });
    }

    assert.strictEqual(chunksWritten, 1);
    w.destroy();
    assert.strictEqual(chunksWritten, 1);
    callbacks.shift()();
    assert.strictEqual(chunksWritten, 2);
    assert.strictEqual(callbacks.length, 0);
    assert.strictEqual(drains, 1); // When we used `.end()`, we see the 'finished' event if and only if
    // we actually finished processing the write queue.

    assert.strictEqual(finished, !withPendingData && useEnd);
  };

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    _loop();
  }
}

;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});