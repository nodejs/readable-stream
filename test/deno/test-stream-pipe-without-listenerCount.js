'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const stream = _readableDenoJs;
const r = new stream.Stream();
r.listenerCount = undefined;
const w = new stream.Stream();
w.listenerCount = undefined;
w.on('pipe', function () {
  r.emit('error', new Error('Readable Error'));
  w.emit('error', new Error('Writable Error'));
});
r.on('error', common.mustCall());
w.on('error', common.mustCall());
r.pipe(w);
export default module.exports;