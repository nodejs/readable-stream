'use strict';

import { Readable } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
// This test verifies that a stream could be resumed after
// removing the readable event in the same tick
check(new Readable({
  objectMode: true,
  highWaterMark: 1,

  read() {
    if (!this.first) {
      this.push('hello');
      this.first = true;
      return;
    }

    this.push(null);
  }

}));

function check(s) {
  const readableListener = common.mustNotCall();
  s.on('readable', readableListener);
  s.on('end', common.mustCall());
  s.removeListener('readable', readableListener);
  s.resume();
}

export default module.exports;