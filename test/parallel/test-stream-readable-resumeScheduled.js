/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');

// Testing Readable Stream resumeScheduled state

var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable,
    Writable = _require.Writable;

{
  (function () {
    // pipe() test case
    var r = new Readable({
      read: function () {}
    });
    var w = new Writable();

    // resumeScheduled should start = `false`.
    assert.strictEqual(r._readableState.resumeScheduled, false);

    // calling pipe() should change the state value = true.
    r.pipe(w);
    assert.strictEqual(r._readableState.resumeScheduled, true);

    process.nextTick(common.mustCall(function () {
      assert.strictEqual(r._readableState.resumeScheduled, false);
    }));
  })();
}

{
  (function () {
    // 'data' listener test case
    var r = new Readable({
      read: function () {}
    });

    // resumeScheduled should start = `false`.
    assert.strictEqual(r._readableState.resumeScheduled, false);

    r.push(bufferShim.from([1, 2, 3]));

    // adding 'data' listener should change the state value
    r.on('data', common.mustCall(function () {
      assert.strictEqual(r._readableState.resumeScheduled, false);
    }));
    assert.strictEqual(r._readableState.resumeScheduled, true);

    process.nextTick(common.mustCall(function () {
      assert.strictEqual(r._readableState.resumeScheduled, false);
    }));
  })();
}

{
  (function () {
    // resume() test case
    var r = new Readable({
      read: function () {}
    });

    // resumeScheduled should start = `false`.
    assert.strictEqual(r._readableState.resumeScheduled, false);

    // Calling resume() should change the state value.
    r.resume();
    assert.strictEqual(r._readableState.resumeScheduled, true);

    r.on('resume', common.mustCall(function () {
      // The state value should be `false` again
      assert.strictEqual(r._readableState.resumeScheduled, false);
    }));

    process.nextTick(common.mustCall(function () {
      assert.strictEqual(r._readableState.resumeScheduled, false);
    }));
  })();
}