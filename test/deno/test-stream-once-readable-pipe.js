'use strict';

import { Readable, Writable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
// This test ensures that if have 'readable' listener
// on Readable instance it will not disrupt the pipe.
{
  let receivedData = '';
  const w = new Writable({
    write: (chunk, env, callback) => {
      receivedData += chunk;
      callback();
    }
  });
  const data = ['foo', 'bar', 'baz'];
  const r = new Readable({
    read: () => {}
  });
  r.once('readable', common.mustCall());
  r.pipe(w);
  r.push(data[0]);
  r.push(data[1]);
  r.push(data[2]);
  r.push(null);
  w.on('finish', common.mustCall(() => {
    assert.strictEqual(receivedData, data.join(''));
  }));
}
{
  let receivedData = '';
  const w = new Writable({
    write: (chunk, env, callback) => {
      receivedData += chunk;
      callback();
    }
  });
  const data = ['foo', 'bar', 'baz'];
  const r = new Readable({
    read: () => {}
  });
  r.pipe(w);
  r.push(data[0]);
  r.push(data[1]);
  r.push(data[2]);
  r.push(null);
  r.once('readable', common.mustCall());
  w.on('finish', common.mustCall(() => {
    assert.strictEqual(receivedData, data.join(''));
  }));
}
export default module.exports;