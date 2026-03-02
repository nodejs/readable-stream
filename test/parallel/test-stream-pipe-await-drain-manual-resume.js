/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');
var stream = require('../../');

// A consumer stream with a very low highWaterMark, which starts in a state
// where it buffers the chunk it receives rather than indicating that they
// have been consumed.
var writable = new stream.Writable({
  highWaterMark: 5
});

var isCurrentlyBufferingWrites = true;
var queue = [];

writable._write = function (chunk, encoding, cb) {
  if (isCurrentlyBufferingWrites) queue.push({ chunk: chunk, cb: cb });else cb();
};

var readable = new stream.Readable({
  read: function () {}
});

readable.pipe(writable);

readable.once('pause', common.mustCall(function () {
  // First pause, resume manually. The next write() to writable will still
  // return false, because chunks are still being buffered, so it will increase
  // the awaitDrain counter again.
  process.nextTick(common.mustCall(function () {
    readable.resume();
  }));

  readable.once('pause', common.mustCall(function () {
    // Second pause, handle all chunks from now on. Once all callbacks that
    // are currently queued up are handled, the awaitDrain drain counter should
    // fall back to 0 and all chunks that are pending on the readable side
    // should be flushed.
    isCurrentlyBufferingWrites = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var queued = _step.value;

        queued.cb();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }));
}));

readable.push(bufferShim.alloc(100)); // Fill the writable HWM, first 'pause'.
readable.push(bufferShim.alloc(100)); // Second 'pause'.
readable.push(bufferShim.alloc(100)); // Should get through to the writable.
readable.push(null);

writable.on('finish', common.mustCall(function () {
  // Everything okay, all chunks were written.
}));