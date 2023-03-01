"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');
var _require = require('../../'),
  Readable = _require.Readable,
  Writable = _require.Writable;
var source = Readable({
  read: function read() {}
});
var dest1 = Writable({
  write: function write() {}
});
var dest2 = Writable({
  write: function write() {}
});
source.pipe(dest1);
source.pipe(dest2);
dest1.on('unpipe', common.mustCall());
dest2.on('unpipe', common.mustCall());
assert.strictEqual(source._readableState.pipes[0], dest1);
assert.strictEqual(source._readableState.pipes[1], dest2);
assert.strictEqual(source._readableState.pipes.length, 2);

// Should be able to unpipe them in the reverse order that they were piped.

source.unpipe(dest2);
assert.strictEqual(source._readableState.pipes, dest1);
assert.notStrictEqual(source._readableState.pipes, dest2);
dest2.on('unpipe', common.mustNotCall());
source.unpipe(dest2);
source.unpipe(dest1);
assert.strictEqual(source._readableState.pipes, null);
{
  var checkDestCleanup = function checkDestCleanup(dest) {
    var currentDestId = ++destCount;
    _source.pipe(dest);
    var unpipeChecker = common.mustCall(function () {
      assert.deepStrictEqual(dest.listeners('unpipe'), [unpipeChecker], "destination{".concat(currentDestId, "} should have a 'unpipe' event ") + 'listener which is `unpipeChecker`');
      dest.removeListener('unpipe', unpipeChecker);
      destCheckEventNames.forEach(function (eventName) {
        assert.strictEqual(dest.listenerCount(eventName), 0, "destination{".concat(currentDestId, "}'s '").concat(eventName, "' event ") + 'listeners not removed');
      });
      if (--destCount === 0) checkSrcCleanup();
    });
    dest.on('unpipe', unpipeChecker);
  };
  // test `cleanup()` if we unpipe all streams.
  var _source = Readable({
    read: function read() {}
  });
  var _dest = Writable({
    write: function write() {}
  });
  var _dest2 = Writable({
    write: function write() {}
  });
  var destCount = 0;
  var srcCheckEventNames = ['end', 'data'];
  var destCheckEventNames = ['close', 'finish', 'drain', 'error', 'unpipe'];
  var checkSrcCleanup = common.mustCall(function () {
    assert.strictEqual(_source._readableState.pipes, null);
    assert.strictEqual(_source._readableState.pipesCount, 0);
    assert.strictEqual(_source._readableState.flowing, false);
    srcCheckEventNames.forEach(function (eventName) {
      assert.strictEqual(_source.listenerCount(eventName), 0, "source's '".concat(eventName, "' event listeners not removed"));
    });
  });
  checkDestCleanup(_dest);
  checkDestCleanup(_dest2);
  _source.unpipe();
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