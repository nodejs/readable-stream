/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var Transform = require('../../').Transform;

var _transform = common.mustCall(function _transform(d, e, n) {
  n();
});

var _final = common.mustCall(function _final(n) {
  n();
});

var _flush = common.mustCall(function _flush(n) {
  n();
});

var t = new Transform({
  transform: _transform,
  flush: _flush,
  final: _final
});

var t2 = new Transform({});

t.end(bufferShim.from('blerg'));
t.resume();

assert.throws(function () {
  t2.end(bufferShim.from('blerg'));
}, /^Error: .*[Nn]ot implemented$/);

process.on('exit', function () {
  assert.strictEqual(t._transform, _transform);
  assert.strictEqual(t._flush, _flush);
  assert.strictEqual(t._final, _final);
});