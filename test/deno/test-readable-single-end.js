'use strict';

import { Readable } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
// This test ensures that there will not be an additional empty 'readable'
// event when stream has ended (only 1 event signalling about end)
const r = new Readable({
  read: () => {}
});
r.push(null);
r.on('readable', common.mustCall());
r.on('end', common.mustCall());
export default module.exports;