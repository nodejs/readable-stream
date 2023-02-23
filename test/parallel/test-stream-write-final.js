"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const assert = require('assert/');
const stream = require('../../');
let shutdown = false;
const w = new stream.Writable({
  final: common.mustCall(function (cb) {
    assert.strictEqual(this, w);
    setTimeout(function () {
      shutdown = true;
      cb();
    }, 100);
  }),
  write: function write(chunk, e, cb) {
    process.nextTick(cb);
  }
});
w.on('finish', common.mustCall(function () {
  assert(shutdown);
}));
w.write(bufferShim.allocUnsafe(1));
w.end(bufferShim.allocUnsafe(0));
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));