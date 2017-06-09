/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var _require = require('../../'),
    Transform = _require.Transform;

var stream = new Transform({
  transform: function (chunk, enc, cb) {
    cb();cb();
  }
});

stream.on('error', common.mustCall(function (err) {
  assert.strictEqual(err.toString(), 'Error: write callback called multiple times');
}));

stream.write('foo');