'use strict';

import { Readable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const rs = new Readable({
  read() {}

});
let closed = false;
let errored = false;
rs.on('close', common.mustCall(() => {
  closed = true;
  assert(errored);
}));
rs.on('error', common.mustCall(err => {
  errored = true;
  assert(!closed);
}));
rs.destroy(new Error('kaboom'));
export default module.exports;