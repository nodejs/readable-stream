/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

// This test ensures that the stream implementation correctly handles values
// for highWaterMark which exceed the range of signed 32 bit integers and
// rejects invalid values.

var assert = require('assert/');
var stream = require('../../');

// This number exceeds the range of 32 bit integer arithmetic but should still
// be handled correctly.
var ovfl = Number.MAX_SAFE_INTEGER;

var readable = stream.Readable({ highWaterMark: ovfl });
assert.strictEqual(readable._readableState.highWaterMark, ovfl);

var writable = stream.Writable({ highWaterMark: ovfl });
assert.strictEqual(writable._writableState.highWaterMark, ovfl);

var _loop = function (invalidHwm) {
  var _loop2 = function (type) {
    common.expectsError(function () {
      type({ highWaterMark: invalidHwm });
    }, {
      type: TypeError,
      code: 'ERR_INVALID_OPT_VALUE',
      message: 'The value "' + invalidHwm + '" is invalid for option "highWaterMark"'
    });
  };

  var _arr2 = [stream.Readable, stream.Writable];

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var type = _arr2[_i2];
    _loop2(type);
  }
};

var _arr = [true, false, '5', {}, -5, NaN];
for (var _i = 0; _i < _arr.length; _i++) {
  var invalidHwm = _arr[_i];
  _loop(invalidHwm);
}
;require('tap').pass('sync run');