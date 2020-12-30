'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const Readable = _readableDenoJs.Readable;

const _read = common.mustCall(function _read(n) {
  this.push(null);
});

const r = new Readable({
  read: _read
});
r.resume();
export default module.exports;