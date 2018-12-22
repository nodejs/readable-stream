"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('../../'),
    Writable = _require.Writable;

var assert = require('assert/');

var _require2 = require('util'),
    inherits = _require2.inherits;

{
  var write = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });
  write.on('finish', common.mustNotCall());
  write.on('close', common.mustCall());
  write.destroy();
  assert.strictEqual(write.destroyed, true);
}
{
  var _write = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  var expected = new Error('kaboom');

  _write.on('finish', common.mustNotCall());

  _write.on('close', common.mustCall());

  _write.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, expected);
  }));

  _write.destroy(expected);

  assert.strictEqual(_write.destroyed, true);
}
{
  var _write2 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  _write2._destroy = function (err, cb) {
    assert.strictEqual(err, _expected);
    cb(err);
  };

  var _expected = new Error('kaboom');

  _write2.on('finish', common.mustNotCall('no finish event'));

  _write2.on('close', common.mustCall());

  _write2.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected);
  }));

  _write2.destroy(_expected);

  assert.strictEqual(_write2.destroyed, true);
}
{
  var _write3 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    },
    destroy: common.mustCall(function (err, cb) {
      assert.strictEqual(err, _expected2);
      cb();
    })
  });

  var _expected2 = new Error('kaboom');

  _write3.on('finish', common.mustNotCall('no finish event'));

  _write3.on('close', common.mustCall()); // error is swallowed by the custom _destroy


  _write3.on('error', common.mustNotCall('no error event'));

  _write3.destroy(_expected2);

  assert.strictEqual(_write3.destroyed, true);
}
{
  var _write4 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  _write4._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb();
  });

  _write4.destroy();

  assert.strictEqual(_write4.destroyed, true);
}
{
  var _write5 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  _write5._destroy = common.mustCall(function (err, cb) {
    var _this = this;

    assert.strictEqual(err, null);
    process.nextTick(function () {
      _this.end();

      cb();
    });
  });
  var fail = common.mustNotCall('no finish event');

  _write5.on('finish', fail);

  _write5.on('close', common.mustCall());

  _write5.destroy();

  _write5.removeListener('finish', fail);

  _write5.on('finish', common.mustCall());

  assert.strictEqual(_write5.destroyed, true);
}
{
  var _write6 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  var _expected3 = new Error('kaboom');

  _write6._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb(_expected3);
  });

  _write6.on('close', common.mustCall());

  _write6.on('finish', common.mustNotCall('no finish event'));

  _write6.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected3);
  }));

  _write6.destroy();

  assert.strictEqual(_write6.destroyed, true);
}
{
  // double error case
  var _write7 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  _write7.on('close', common.mustCall());

  _write7.on('error', common.mustCall());

  _write7.destroy(new Error('kaboom 1'));

  _write7.destroy(new Error('kaboom 2'));

  assert.strictEqual(_write7._writableState.errorEmitted, true);
  assert.strictEqual(_write7.destroyed, true);
}
{
  var _write8 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  _write8.destroyed = true;
  assert.strictEqual(_write8.destroyed, true); // the internal destroy() mechanism should not be triggered

  _write8.on('close', common.mustNotCall());

  _write8.destroy();
}
{
  var MyWritable = function MyWritable() {
    assert.strictEqual(this.destroyed, false);
    this.destroyed = false;
    Writable.call(this);
  };

  inherits(MyWritable, Writable);
  new MyWritable();
}
{
  // destroy and destroy callback
  var _write9 = new Writable({
    write: function write(chunk, enc, cb) {
      cb();
    }
  });

  _write9.destroy();

  var _expected4 = new Error('kaboom');

  _write9.destroy(_expected4, common.mustCall(function (err) {
    assert.strictEqual(_expected4, err);
  }));
}
{
  // Checks that `._undestroy()` restores the state so that `final` will be
  // called again.
  var _write10 = new Writable({
    write: common.mustNotCall(),
    final: common.mustCall(function (cb) {
      return cb();
    }, 2)
  });

  _write10.end();

  _write10.destroy();

  _write10._undestroy();

  _write10.end();
}
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});