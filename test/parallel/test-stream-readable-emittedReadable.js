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
assert.strictEqual(readable._readableState.emittedReadable, false);

readable.on('readable', common.mustCall(function () {
  // emittedReadable should be true when the readable event is emitted
  assert.strictEqual(readable._readableState.emittedReadable, true);
  readable.read();
  // emittedReadable is reset to false during read()
  assert.strictEqual(readable._readableState.emittedReadable, false);
}, 4));

// When the first readable listener is just attached,
// emittedReadable should be false
assert.strictEqual(readable._readableState.emittedReadable, false);

// Each one of these should trigger a readable event.
process.nextTick(common.mustCall(function () {
  readable.push('foo');
}));
process.nextTick(common.mustCall(function () {
  readable.push('bar');
}));
process.nextTick(common.mustCall(function () {
  readable.push('quo');
}));
process.nextTick(common.mustCall(function () {
  readable.push(null);
}));

var noRead = new Readable({
  read: function () {}
});

noRead.on('readable', common.mustCall(function () {
  // emittedReadable should be true when the readable event is emitted
  assert.strictEqual(noRead._readableState.emittedReadable, true);
  noRead.read(0);
  // emittedReadable is not reset during read(0)
  assert.strictEqual(noRead._readableState.emittedReadable, true);
}));

noRead.push('foo');
noRead.push(null);

var flowing = new Readable({
  read: function () {}
});

flowing.on('data', common.mustCall(function () {
  // When in flowing mode, emittedReadable is always false.
  assert.strictEqual(flowing._readableState.emittedReadable, false);
  flowing.read();
  assert.strictEqual(flowing._readableState.emittedReadable, false);
}, 3));

flowing.push('foooo');
flowing.push('bar');
flowing.push('quo');
process.nextTick(common.mustCall(function () {
  flowing.push(null);
}));