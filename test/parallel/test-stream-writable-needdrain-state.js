"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const stream = require('../../');
const assert = require('assert/');
const transform = new stream.Transform({
  transform: _transform,
  highWaterMark: 1
});
function _transform(chunk, encoding, cb) {
  assert.strictEqual(transform._writableState.needDrain, true);
  cb();
}
assert.strictEqual(transform._writableState.needDrain, false);
transform.write('asdasd', common.mustCall(() => {
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
_list.forEach(e => process.on('uncaughtException', e));