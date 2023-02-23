"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const stream = require('../../');
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
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));