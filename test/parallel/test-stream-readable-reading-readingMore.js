"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var Readable = require('../../').Readable;

{
  var onStreamEnd = function onStreamEnd() {
    // End of stream; state.reading is false
    // And so should be readingMore.
    assert.strictEqual(state.readingMore, false);
    assert.strictEqual(state.reading, false);
  };

  var readable = new Readable({
    read: function read(size) {}
  });
  var state = readable._readableState; // Starting off with false initially.

  assert.strictEqual(state.reading, false);
  assert.strictEqual(state.readingMore, false);
  readable.on('data', common.mustCall(function (data) {
    // while in a flowing state with a 'readable' listener
    // we should not be reading more
    if (readable.readableFlowing) assert.strictEqual(state.readingMore, true); // reading as long as we've not ended

    assert.strictEqual(state.reading, !state.ended);
  }, 2));
  var expectedReadingMore = [true, false];
  readable.on('readable', common.mustCall(function () {
    // there is only one readingMore scheduled from on('data'),
    // after which everything is governed by the .read() call
    assert.strictEqual(state.readingMore, expectedReadingMore.shift()); // if the stream has ended, we shouldn't be reading

    assert.strictEqual(state.ended, !state.reading);
    var data = readable.read();
    if (data === null) // reached end of stream
      process.nextTick(common.mustCall(onStreamEnd, 1));
  }, 2));
  readable.on('end', common.mustCall(onStreamEnd));
  readable.push('pushed');
  readable.read(6); // reading

  assert.strictEqual(state.reading, true);
  assert.strictEqual(state.readingMore, true); // add chunk to front

  readable.unshift('unshifted'); // end

  readable.push(null);
}
{
  var _onStreamEnd = function _onStreamEnd() {
    // End of stream; state.reading is false
    // And so should be readingMore.
    assert.strictEqual(_state.readingMore, false);
    assert.strictEqual(_state.reading, false);
  };

  var _readable = new Readable({
    read: function read(size) {}
  });

  var _state = _readable._readableState; // Starting off with false initially.

  assert.strictEqual(_state.reading, false);
  assert.strictEqual(_state.readingMore, false);

  _readable.on('data', common.mustCall(function (data) {
    // while in a flowing state without a 'readable' listener
    // we should be reading more
    if (_readable.readableFlowing) assert.strictEqual(_state.readingMore, true); // reading as long as we've not ended

    assert.strictEqual(_state.reading, !_state.ended);
  }, 2));

  _readable.on('end', common.mustCall(_onStreamEnd));

  _readable.push('pushed'); // stop emitting 'data' events


  assert.strictEqual(_state.flowing, true);

  _readable.pause(); // paused


  assert.strictEqual(_state.reading, false);
  assert.strictEqual(_state.flowing, false);

  _readable.resume();

  assert.strictEqual(_state.reading, false);
  assert.strictEqual(_state.flowing, true); // add chunk to front

  _readable.unshift('unshifted'); // end


  _readable.push(null);
}
{
  var _onStreamEnd2 = function _onStreamEnd2() {
    // End of stream; state.reading is false
    // And so should be readingMore.
    assert.strictEqual(_state2.readingMore, false);
    assert.strictEqual(_state2.reading, false);
  };

  var _readable2 = new Readable({
    read: function read(size) {}
  });

  var _state2 = _readable2._readableState; // Starting off with false initially.

  assert.strictEqual(_state2.reading, false);
  assert.strictEqual(_state2.readingMore, false);
  var onReadable = common.mustNotCall;

  _readable2.on('readable', onReadable);

  _readable2.on('data', common.mustCall(function (data) {
    // reading as long as we've not ended
    assert.strictEqual(_state2.reading, !_state2.ended);
  }, 2));

  _readable2.removeListener('readable', onReadable);

  _readable2.on('end', common.mustCall(_onStreamEnd2));

  _readable2.push('pushed'); // we are still not flowing, we will be resuming in the next tick


  assert.strictEqual(_state2.flowing, false); // wait for nextTick, so the readableListener flag resets

  process.nextTick(function () {
    _readable2.resume(); // stop emitting 'data' events


    assert.strictEqual(_state2.flowing, true);

    _readable2.pause(); // paused


    assert.strictEqual(_state2.flowing, false);

    _readable2.resume();

    assert.strictEqual(_state2.flowing, true); // add chunk to front

    _readable2.unshift('unshifted'); // end


    _readable2.push(null);
  });
}
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