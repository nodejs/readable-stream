"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var _require = require('assert/'),
  strictEqual = _require.strictEqual;
var _require2 = require('../../'),
  Transform = _require2.Transform;
var t = new Transform();
t.on('error', common.expectsError({
  type: Error,
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  message: 'The _transform() method is not implemented'
}));
t.end(bufferShim.from('blerg'));
var _transform = common.mustCall(function (chunk, _, next) {
  next();
});
var _final = common.mustCall(function (next) {
  next();
});
var _flush = common.mustCall(function (next) {
  next();
});
var t2 = new Transform({
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
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});