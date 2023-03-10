"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var stream = require('../../');
var assert = require('assert/');
var transform = new stream.Transform({
  transform: _transform,
  highWaterMark: 1
});
function _transform(chunk, encoding, cb) {
  assert.strictEqual(transform._writableState.needDrain, true);
  cb();
}
assert.strictEqual(transform._writableState.needDrain, false);
transform.write('asdasd', common.mustCall(function () {
  assert.strictEqual(transform._writableState.needDrain, false);
}));
assert.strictEqual(transform._writableState.needDrain, true);
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});