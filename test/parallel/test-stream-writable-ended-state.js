"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const assert = require('assert/');
const stream = require('../../');
const writable = new stream.Writable();
writable._write = (chunk, encoding, cb) => {
  assert.strictEqual(writable._writableState.ended, false);
  cb();
};
assert.strictEqual(writable._writableState.ended, false);
writable.end('testing ended state', common.mustCall(() => {
  assert.strictEqual(writable._writableState.ended, true);
}));
assert.strictEqual(writable._writableState.ended, true);
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));