/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');
var Readable = require('../../').Readable;

var readable = new Readable({
  read: function () {}
});

// Initialized to false.
assert.strictEqual(readable._readableState.needReadable, false);

readable.on('readable', common.mustCall(function () {
  // When the readable event fires, needReadable is reset.
  assert.strictEqual(readable._readableState.needReadable, false);
  readable.read();
}));

// If a readable listener is attached, then a readable event is needed.
assert.strictEqual(readable._readableState.needReadable, true);

readable.push('foo');
readable.push(null);

readable.on('end', common.mustCall(function () {
  // No need to emit readable anymore when the stream ends.
  assert.strictEqual(readable._readableState.needReadable, false);
}));

var asyncReadable = new Readable({
  read: function () {}
});

asyncReadable.on('readable', common.mustCall(function () {
  if (asyncReadable.read() !== null) {
    // After each read(), the buffer is empty.
    // If the stream doesn't end now,
    // then we need to notify the reader on future changes.
    assert.strictEqual(asyncReadable._readableState.needReadable, true);
  }
}, 3));

process.nextTick(common.mustCall(function () {
  asyncReadable.push('foooo');
}));
process.nextTick(common.mustCall(function () {
  asyncReadable.push('bar');
}));
process.nextTick(common.mustCall(function () {
  asyncReadable.push(null);
}));

var flowing = new Readable({
  read: function () {}
});

// Notice this must be above the on('data') call.
flowing.push('foooo');
flowing.push('bar');
flowing.push('quo');
process.nextTick(common.mustCall(function () {
  flowing.push(null);
}));

// When the buffer already has enough data, and the stream is
// in flowing mode, there is no need for the readable event.
flowing.on('data', common.mustCall(function (data) {
  assert.strictEqual(flowing._readableState.needReadable, false);
}, 3));

var slowProducer = new Readable({
  read: function () {}
});

slowProducer.on('readable', common.mustCall(function () {
  if (slowProducer.read(8) === null) {
    // The buffer doesn't have enough data, and the stream is not ened,
    // we need to notify the reader when data arrives.
    assert.strictEqual(slowProducer._readableState.needReadable, true);
  } else {
    assert.strictEqual(slowProducer._readableState.needReadable, false);
  }
}, 4));

process.nextTick(common.mustCall(function () {
  slowProducer.push('foo');
}));
process.nextTick(common.mustCall(function () {
  slowProducer.push('foo');
}));
process.nextTick(common.mustCall(function () {
  slowProducer.push('foo');
}));
process.nextTick(common.mustCall(function () {
  slowProducer.push(null);
}));