'use strict';

import { Writable } from "../../readable-deno.js";
import { strictEqual } from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const w = new Writable();
w.on('error', common.expectsError({
  type: Error,
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  message: 'The _write() method is not implemented'
}));
w.end(Buffer.from('blerg'));

const _write = common.mustCall((chunk, _, next) => {
  next();
});

const _writev = common.mustCall((chunks, next) => {
  strictEqual(chunks.length, 2);
  next();
});

const w2 = new Writable({
  write: _write,
  writev: _writev
});
strictEqual(w2._write, _write);
strictEqual(w2._writev, _writev);
w2.write(Buffer.from('blerg'));
w2.cork();
w2.write(Buffer.from('blerg'));
w2.write(Buffer.from('blerg'));
w2.end();
export default module.exports;