'use strict';

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');
var Readable = require('../../').Readable;

var readable = new Readable({
  read: function () {}
});

// Initialized to false.
assert.strictEqual(readable._readableState.emittedReadable, false);

var expected = [bufferShim.from('foobar'), bufferShim.from('quo'), null];
readable.on('readable', common.mustCall(function () {
  // emittedReadable should be true when the readable event is emitted
  assert.strictEqual(readable._readableState.emittedReadable, true);
  assert.deepStrictEqual(readable.read(), expected.shift());
  // emittedReadable is reset to false during read()
  assert.strictEqual(readable._readableState.emittedReadable, false);
}, 3));

// When the first readable listener is just attached,
// emittedReadable should be false
assert.strictEqual(readable._readableState.emittedReadable, false);

// These trigger a single 'readable', as things are batched up
process.nextTick(common.mustCall(function () {
  readable.push('foo');
}));
process.nextTick(common.mustCall(function () {
  readable.push('bar');
}));

// these triggers two readable events
setImmediate(common.mustCall(function () {
  readable.push('quo');
  process.nextTick(common.mustCall(function () {
    readable.push(null);
  }));
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
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});