'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const stream = _readableDenoJs;

class Writable extends stream.Writable {
  constructor() {
    super();
    this.prependListener = undefined;
  }

  _write(chunk, end, cb) {
    cb();
  }

}

class Readable extends stream.Readable {
  _read() {
    this.push(null);
  }

}

const w = new Writable();
w.on('pipe', common.mustCall());
const r = new Readable();
r.pipe(w);
export default module.exports;