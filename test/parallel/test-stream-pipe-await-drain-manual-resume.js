"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var stream = require('../../');

var assert = require('assert/'); // A consumer stream with a very low highWaterMark, which starts in a state
// where it buffers the chunk it receives rather than indicating that they
// have been consumed.


var writable = new stream.Writable({
  highWaterMark: 5
});
var isCurrentlyBufferingWrites = true;
var queue = [];

writable._write = function (chunk, encoding, cb) {
  if (isCurrentlyBufferingWrites) queue.push({
    chunk: chunk,
    cb: cb
  });else cb();
};

var readable = new stream.Readable({
  read: function read() {}
});
readable.pipe(writable);
readable.once('pause', common.mustCall(function () {
  assert.strictEqual(readable._readableState.awaitDrain, 1, 'Expected awaitDrain to equal 1 but instead got ' + "".concat(readable._readableState.awaitDrain)); // First pause, resume manually. The next write() to writable will still
  // return false, because chunks are still being buffered, so it will increase
  // the awaitDrain counter again.

  process.nextTick(common.mustCall(function () {
    readable.resume();
  }));
  readable.once('pause', common.mustCall(function () {
    assert.strictEqual(readable._readableState.awaitDrain, 1, '.resume() should not reset the counter but instead got ' + "".concat(readable._readableState.awaitDrain)); // Second pause, handle all chunks from now on. Once all callbacks that
    // are currently queued up are handled, the awaitDrain drain counter should
    // fall back to 0 and all chunks that are pending on the readable side
    // should be flushed.

    isCurrentlyBufferingWrites = false;

    var _iterator = _createForOfIteratorHelper(queue),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var queued = _step.value;
        queued.cb();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }));
}));
readable.push(bufferShim.alloc(100)); // Fill the writable HWM, first 'pause'.

readable.push(bufferShim.alloc(100)); // Second 'pause'.

readable.push(bufferShim.alloc(100)); // Should get through to the writable.

readable.push(null);
writable.on('finish', common.mustCall(function () {
  assert.strictEqual(readable._readableState.awaitDrain, 0, 'awaitDrain should equal 0 after all chunks are written but instead got' + "".concat(readable._readableState.awaitDrain)); // Everything okay, all chunks were written.
}));
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