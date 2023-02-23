"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

require('../common');
const assert = require('assert/');
const Transform = require('../../').Transform;
const expected = 'asdf';
function _transform(d, e, n) {
  n();
}
function _flush(n) {
  n(null, expected);
}
const t = new Transform({
  transform: _transform,
  flush: _flush
});
t.end(bufferShim.from('blerg'));
t.on('data', data => {
  assert.strictEqual(data.toString(), expected);
});
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));