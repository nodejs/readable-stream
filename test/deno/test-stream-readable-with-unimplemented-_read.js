'use strict';

import { Readable } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const readable = new Readable();
readable.on('error', common.expectsError({
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  type: Error,
  message: 'The _read() method is not implemented'
}));
readable.read();
export default module.exports;