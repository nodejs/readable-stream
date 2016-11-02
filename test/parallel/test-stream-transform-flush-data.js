/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

require('../common');

var assert = require('assert/');
var Transform = require('../../').Transform;

var expected = 'asdf';

function _transform(d, e, n) {
  n();
}
function _flush(n) {
  n(null, expected);
}

var t = new Transform({
  transform: _transform,
  flush: _flush
});

t.end(bufferShim.from('blerg'));
t.on('data', function (data) {
  assert.strictEqual(data.toString(), expected);
});