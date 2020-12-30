'use strict';

import { Readable, Writable, Transform } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
{
  const stream = new Readable({
    objectMode: true,
    read: common.mustCall(() => {
      stream.push(undefined);
      stream.push(null);
    })
  });
  stream.on('data', common.mustCall(chunk => {
    assert.strictEqual(chunk, undefined);
  }));
}
{
  const stream = new Writable({
    objectMode: true,
    write: common.mustCall(chunk => {
      assert.strictEqual(chunk, undefined);
    })
  });
  stream.write(undefined);
}
{
  const stream = new Transform({
    objectMode: true,
    transform: common.mustCall(chunk => {
      stream.push(chunk);
    })
  });
  stream.on('data', common.mustCall(chunk => {
    assert.strictEqual(chunk, undefined);
  }));
  stream.write(undefined);
}
export default module.exports;