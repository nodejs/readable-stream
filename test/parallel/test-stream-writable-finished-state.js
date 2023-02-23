"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const assert = require('assert/');
const stream = require('../../');
const writable = new stream.Writable();
writable._write = (chunk, encoding, cb) => {
  // The state finished should start in false.
  assert.strictEqual(writable._writableState.finished, false);
  cb();
};
writable.on('finish', common.mustCall(() => {
  assert.strictEqual(writable._writableState.finished, true);
}));
writable.end('testing finished state', common.mustCall(() => {
  assert.strictEqual(writable._writableState.finished, true);
}));
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));