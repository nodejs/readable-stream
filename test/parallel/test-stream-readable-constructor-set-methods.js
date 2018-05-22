/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

var Readable = require('../../').Readable;

var _read = common.mustCall(function _read(n) {
  this.push(null);
});

var r = new Readable({ read: _read });
r.resume();
;require('tap').pass('sync run');