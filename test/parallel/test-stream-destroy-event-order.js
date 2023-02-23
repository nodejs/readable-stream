"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const assert = require('assert/');
const _require = require('../../'),
  Readable = _require.Readable;
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
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));