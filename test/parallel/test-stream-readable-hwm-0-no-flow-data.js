"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');

// Ensure that subscribing the 'data' event will not make the stream flow.
// The 'data' event will require calling read() by hand.
//
// The test is written for the (somewhat rare) highWaterMark: 0 streams to
// specifically catch any regressions that might occur with these streams.

var assert = require('assert/');
var _require = require('../../'),
  Readable = _require.Readable;
var streamData = ['a', null];

// Track the calls so we can assert their order later.
var calls = [];
var r = new Readable({
  read: common.mustCall(function () {
    calls.push('_read:' + streamData[0]);
    process.nextTick(function () {
      calls.push('push:' + streamData[0]);
      r.push(streamData.shift());
    });
  }, streamData.length),
  highWaterMark: 0,
  // Object mode is used here just for testing convenience. It really
  // shouldn't affect the order of events. Just the data and its format.
  objectMode: true
});
assert.strictEqual(r.readableFlowing, null);
r.on('readable', common.mustCall(function () {
  calls.push('readable');
}, 2));
assert.strictEqual(r.readableFlowing, false);
r.on('data', common.mustCall(function (data) {
  calls.push('data:' + data);
}, 1));
r.on('end', common.mustCall(function () {
  calls.push('end');
}));
assert.strictEqual(r.readableFlowing, false);

// The stream emits the events asynchronously but that's not guaranteed to
// happen on the next tick (especially since the _read implementation above
// uses process.nextTick).
//
// We use setImmediate here to give the stream enough time to emit all the
// events it's about to emit.
setImmediate(function () {
  // Only the _read, push, readable calls have happened. No data must be
  // emitted yet.
  assert.deepStrictEqual(calls, ['_read:a', 'push:a', 'readable']);

  // Calling 'r.read()' should trigger the data event.
  assert.strictEqual(r.read(), 'a');
  assert.deepStrictEqual(calls, ['_read:a', 'push:a', 'readable', 'data:a']);

  // The next 'read()' will return null because hwm: 0 does not buffer any
  // data and the _read implementation above does the push() asynchronously.
  //
  // Note: This 'null' signals "no data available". It isn't the end-of-stream
  // null value as the stream doesn't know yet that it is about to reach the
  // end.
  //
  // Using setImmediate again to give the stream enough time to emit all the
  // events it wants to emit.
  assert.strictEqual(r.read(), null);
  setImmediate(function () {
    // There's a new 'readable' event after the data has been pushed.
    // The 'end' event will be emitted only after a 'read()'.
    //
    // This is somewhat special for the case where the '_read' implementation
    // calls 'push' asynchronously. If 'push' was synchronous, the 'end' event
    // would be emitted here _before_ we call read().
    assert.deepStrictEqual(calls, ['_read:a', 'push:a', 'readable', 'data:a', '_read:null', 'push:null', 'readable']);
    assert.strictEqual(r.read(), null);

    // While it isn't really specified whether the 'end' event should happen
    // synchronously with read() or not, we'll assert the current behavior
    // ('end' event happening on the next tick after read()) so any changes
    // to it are noted and acknowledged in the future.
    assert.deepStrictEqual(calls, ['_read:a', 'push:a', 'readable', 'data:a', '_read:null', 'push:null', 'readable']);
    process.nextTick(function () {
      assert.deepStrictEqual(calls, ['_read:a', 'push:a', 'readable', 'data:a', '_read:null', 'push:null', 'readable', 'end']);
    });
  });
});
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