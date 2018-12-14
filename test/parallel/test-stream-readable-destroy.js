"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable;

var assert = require('assert/');

var _require2 = require('util'),
    inherits = _require2.inherits;

{
  var read = new Readable({
    read: function () {}
  });
  read.resume();
  read.on('close', common.mustCall());
  read.destroy();
  assert.strictEqual(read.destroyed, true);
}
{
  var _read = new Readable({
    read: function () {}
  });

  _read.resume();

  var expected = new Error('kaboom');

  _read.on('end', common.mustNotCall('no end event'));

  _read.on('close', common.mustCall());

  _read.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, expected);
  }));

  _read.destroy(expected);

  assert.strictEqual(_read.destroyed, true);
}
{
  var _read2 = new Readable({
    read: function () {}
  });

  _read2._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, _expected);
    cb(err);
  });

  var _expected = new Error('kaboom');

  _read2.on('end', common.mustNotCall('no end event'));

  _read2.on('close', common.mustCall());

  _read2.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected);
  }));

  _read2.destroy(_expected);

  assert.strictEqual(_read2.destroyed, true);
}
{
  var _read3 = new Readable({
    read: function () {},
    destroy: common.mustCall(function (err, cb) {
      assert.strictEqual(err, _expected2);
      cb();
    })
  });

  var _expected2 = new Error('kaboom');

  _read3.on('end', common.mustNotCall('no end event')); // error is swallowed by the custom _destroy


  _read3.on('error', common.mustNotCall('no error event'));

  _read3.on('close', common.mustCall());

  _read3.destroy(_expected2);

  assert.strictEqual(_read3.destroyed, true);
}
{
  var _read4 = new Readable({
    read: function () {}
  });

  _read4._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb();
  });

  _read4.destroy();

  assert.strictEqual(_read4.destroyed, true);
}
{
  var _read5 = new Readable({
    read: function () {}
  });

  _read5.resume();

  _read5._destroy = common.mustCall(function (err, cb) {
    var _this = this;

    assert.strictEqual(err, null);
    process.nextTick(function () {
      _this.push(null);

      cb();
    });
  });
  var fail = common.mustNotCall('no end event');

  _read5.on('end', fail);

  _read5.on('close', common.mustCall());

  _read5.destroy();

  _read5.removeListener('end', fail);

  _read5.on('end', common.mustCall());

  assert.strictEqual(_read5.destroyed, true);
}
{
  var _read6 = new Readable({
    read: function () {}
  });

  var _expected3 = new Error('kaboom');

  _read6._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb(_expected3);
  });

  _read6.on('end', common.mustNotCall('no end event'));

  _read6.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected3);
  }));

  _read6.destroy();

  assert.strictEqual(_read6.destroyed, true);
}
{
  var _read7 = new Readable({
    read: function () {}
  });

  _read7.resume();

  _read7.destroyed = true;
  assert.strictEqual(_read7.destroyed, true); // the internal destroy() mechanism should not be triggered

  _read7.on('end', common.mustNotCall());

  _read7.destroy();
}
{
  function MyReadable() {
    assert.strictEqual(this.destroyed, false);
    this.destroyed = false;
    Readable.call(this);
  }

  inherits(MyReadable, Readable);
  new MyReadable();
}
{
  // destroy and destroy callback
  var _read8 = new Readable({
    read: function () {}
  });

  _read8.resume();

  var _expected4 = new Error('kaboom');

  _read8.on('close', common.mustCall());

  _read8.destroy(_expected4, common.mustCall(function (err) {
    assert.strictEqual(_expected4, err);
  }));
}
{
  var _read9 = new Readable({
    read: function () {}
  });

  _read9.destroy();

  _read9.push('hi');

  _read9.on('data', common.mustNotCall());
}
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});