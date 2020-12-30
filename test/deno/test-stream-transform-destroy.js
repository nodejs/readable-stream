'use strict';

import _assert from "assert";
import { Transform } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
{
  const transform = new Transform({
    transform(chunk, enc, cb) {}

  });
  transform.resume();
  transform.on('end', common.mustNotCall());
  transform.on('close', common.mustCall());
  transform.on('finish', common.mustNotCall());
  transform.destroy();
}
{
  const transform = new Transform({
    transform(chunk, enc, cb) {}

  });
  transform.resume();
  const expected = new Error('kaboom');
  transform.on('end', common.mustNotCall());
  transform.on('finish', common.mustNotCall());
  transform.on('close', common.mustCall());
  transform.on('error', common.mustCall(err => {
    assert.strictEqual(err, expected);
  }));
  transform.destroy(expected);
}
{
  const transform = new Transform({
    transform(chunk, enc, cb) {}

  });
  transform._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, expected);
    cb(err);
  }, 1);
  const expected = new Error('kaboom');
  transform.on('finish', common.mustNotCall('no finish event'));
  transform.on('close', common.mustCall());
  transform.on('error', common.mustCall(err => {
    assert.strictEqual(err, expected);
  }));
  transform.destroy(expected);
}
{
  const expected = new Error('kaboom');
  const transform = new Transform({
    transform(chunk, enc, cb) {},

    destroy: common.mustCall(function (err, cb) {
      assert.strictEqual(err, expected);
      cb();
    }, 1)
  });
  transform.resume();
  transform.on('end', common.mustNotCall('no end event'));
  transform.on('close', common.mustCall());
  transform.on('finish', common.mustNotCall('no finish event')); // error is swallowed by the custom _destroy

  transform.on('error', common.mustNotCall('no error event'));
  transform.destroy(expected);
}
{
  const transform = new Transform({
    transform(chunk, enc, cb) {}

  });
  transform._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb();
  }, 1);
  transform.destroy();
}
{
  const transform = new Transform({
    transform(chunk, enc, cb) {}

  });
  transform.resume();
  transform._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    process.nextTick(() => {
      this.push(null);
      this.end();
      cb();
    });
  }, 1);
  const fail = common.mustNotCall('no event');
  transform.on('finish', fail);
  transform.on('end', fail);
  transform.on('close', common.mustCall());
  transform.destroy();
  transform.removeListener('end', fail);
  transform.removeListener('finish', fail);
  transform.on('end', common.mustCall());
  transform.on('finish', common.mustCall());
}
{
  const transform = new Transform({
    transform(chunk, enc, cb) {}

  });
  const expected = new Error('kaboom');
  transform._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb(expected);
  }, 1);
  transform.on('close', common.mustCall());
  transform.on('finish', common.mustNotCall('no finish event'));
  transform.on('end', common.mustNotCall('no end event'));
  transform.on('error', common.mustCall(err => {
    assert.strictEqual(err, expected);
  }));
  transform.destroy();
}
export default module.exports;