'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const Duplex = _readableDenoJs.Duplex;
{
  const stream = new Duplex({
    read() {}

  });
  assert.strictEqual(stream.allowHalfOpen, true);
  stream.on('finish', common.mustNotCall());
  assert.strictEqual(stream.listenerCount('end'), 0);
  stream.resume();
  stream.push(null);
}
{
  const stream = new Duplex({
    read() {},

    allowHalfOpen: false
  });
  assert.strictEqual(stream.allowHalfOpen, false);
  stream.on('finish', common.mustCall());
  assert.strictEqual(stream.listenerCount('end'), 1);
  stream.resume();
  stream.push(null);
}
{
  const stream = new Duplex({
    read() {},

    allowHalfOpen: false
  });
  assert.strictEqual(stream.allowHalfOpen, false);
  stream._writableState.ended = true;
  stream.on('finish', common.mustNotCall());
  assert.strictEqual(stream.listenerCount('end'), 1);
  stream.resume();
  stream.push(null);
}
export default module.exports;