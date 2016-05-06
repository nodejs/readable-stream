/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var assert = require('assert/');

var Readable = require('../../').Readable;

var _readCalled = false;
function _read(n) {
  _readCalled = true;
  this.push(null);
}

var r = new Readable({ read: _read });
r.resume();

process.on('exit', function () {
  assert.equal(r._read, _read);
  assert(_readCalled);
});