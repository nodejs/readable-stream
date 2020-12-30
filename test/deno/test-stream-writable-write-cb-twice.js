'use strict';

import { Writable } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
{
  // Sync + Sync
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb();
      common.expectsError(cb, {
        code: 'ERR_MULTIPLE_CALLBACK',
        type: Error
      });
    })
  });
  writable.write('hi');
}
{
  // Sync + Async
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb();
      process.nextTick(() => {
        common.expectsError(cb, {
          code: 'ERR_MULTIPLE_CALLBACK',
          type: Error
        });
      });
    })
  });
  writable.write('hi');
}
{
  // Async + Async
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      process.nextTick(cb);
      process.nextTick(() => {
        common.expectsError(cb, {
          code: 'ERR_MULTIPLE_CALLBACK',
          type: Error
        });
      });
    })
  });
  writable.write('hi');
}
export default module.exports;