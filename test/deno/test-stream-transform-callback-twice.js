'use strict';

import { Transform } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const stream = new Transform({
  transform(chunk, enc, cb) {
    cb();
    cb();
  }

});
stream.on('error', common.expectsError({
  type: Error,
  message: 'Callback called multiple times',
  code: 'ERR_MULTIPLE_CALLBACK'
}));
stream.write('foo');
export default module.exports;