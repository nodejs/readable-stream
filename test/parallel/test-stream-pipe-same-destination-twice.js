/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

// Regression test for https://github.com/nodejs/node/issues/12718.
// Tests that piping a source stream twice to the same destination stream
// works, and that a subsequent unpipe() call only removes the pipe *once*.
var assert = require('assert/');

var _require = require('../../'),
    PassThrough = _require.PassThrough,
    Writable = _require.Writable;

{
  var passThrough = new PassThrough();
  var dest = new Writable({
    write: common.mustCall(function (chunk, encoding, cb) {
      assert.strictEqual('' + chunk, 'foobar');
      cb();
    })
  });

  passThrough.pipe(dest);
  passThrough.pipe(dest);

  assert.strictEqual(passThrough._events.data.length, 2);
  assert.strictEqual(passThrough._readableState.pipesCount, 2);
  assert.strictEqual(passThrough._readableState.pipes[0], dest);
  assert.strictEqual(passThrough._readableState.pipes[1], dest);

  passThrough.unpipe(dest);

  assert.strictEqual(passThrough._events.data.length, 1);
  assert.strictEqual(passThrough._readableState.pipesCount, 1);
  assert.strictEqual(passThrough._readableState.pipes, dest);

  passThrough.write('foobar');
  passThrough.pipe(dest);
}

{
  var _passThrough = new PassThrough();
  var _dest = new Writable({
    write: common.mustCall(function (chunk, encoding, cb) {
      assert.strictEqual('' + chunk, 'foobar');
      cb();
    }, 2)
  });

  _passThrough.pipe(_dest);
  _passThrough.pipe(_dest);

  assert.strictEqual(_passThrough._events.data.length, 2);
  assert.strictEqual(_passThrough._readableState.pipesCount, 2);
  assert.strictEqual(_passThrough._readableState.pipes[0], _dest);
  assert.strictEqual(_passThrough._readableState.pipes[1], _dest);

  _passThrough.write('foobar');
}

{
  var _passThrough2 = new PassThrough();
  var _dest2 = new Writable({
    write: common.mustNotCall()
  });

  _passThrough2.pipe(_dest2);
  _passThrough2.pipe(_dest2);

  assert.strictEqual(_passThrough2._events.data.length, 2);
  assert.strictEqual(_passThrough2._readableState.pipesCount, 2);
  assert.strictEqual(_passThrough2._readableState.pipes[0], _dest2);
  assert.strictEqual(_passThrough2._readableState.pipes[1], _dest2);

  _passThrough2.unpipe(_dest2);
  _passThrough2.unpipe(_dest2);

  assert.strictEqual(_passThrough2._events.data, undefined);
  assert.strictEqual(_passThrough2._readableState.pipesCount, 0);

  _passThrough2.write('foobar');
}
;require('tap').pass('sync run');