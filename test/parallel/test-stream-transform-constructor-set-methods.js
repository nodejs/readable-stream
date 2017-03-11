/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var assert = require('assert/');

var Transform = require('../../').Transform;

var _transformCalled = false;
function _transform(d, e, n) {
  _transformCalled = true;
  n();
}

var _flushCalled = false;
function _flush(n) {
  _flushCalled = true;
  n();
}

var t = new Transform({
  transform: _transform,
  flush: _flush
});

var t2 = new Transform({});

t.end(bufferShim.from('blerg'));
t.resume();

assert.throws(function () {
  t2.end(bufferShim.from('blerg'));
}, /^Error: _transform\(\) is not implemented$/);

process.on('exit', function () {
  assert.strictEqual(t._transform, _transform);
  assert.strictEqual(t._flush, _flush);
  assert.strictEqual(_transformCalled, true);
  assert.strictEqual(_flushCalled, true);
});