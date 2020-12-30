'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const stream = _readableDenoJs;
const readable = new stream.Readable({
  read: () => {}
});

function checkError(fn) {
  common.expectsError(fn, {
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError
  });
}

checkError(() => readable.push([]));
checkError(() => readable.push({}));
checkError(() => readable.push(0));
export default module.exports;