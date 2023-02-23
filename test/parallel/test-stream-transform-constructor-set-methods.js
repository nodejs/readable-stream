"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const _require = require('assert/'),
  strictEqual = _require.strictEqual;
const _require2 = require('../../'),
  Transform = _require2.Transform;
const t = new Transform();
t.on('error', common.expectsError({
  type: Error,
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  message: 'The _transform() method is not implemented'
}));
t.end(bufferShim.from('blerg'));
const _transform = common.mustCall((chunk, _, next) => {
  next();
});
const _final = common.mustCall(next => {
  next();
});
const _flush = common.mustCall(next => {
  next();
});
const t2 = new Transform({
  transform: _transform,
  flush: _flush,
  final: _final
});
strictEqual(t2._transform, _transform);
strictEqual(t2._flush, _flush);
strictEqual(t2._final, _final);
t2.end(bufferShim.from('blerg'));
t2.resume();
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));