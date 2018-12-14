"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var stream = require('../../');

{
  // This test ensures that the stream implementation correctly handles values
  // for highWaterMark which exceed the range of signed 32 bit integers and
  // rejects invalid values.
  // This number exceeds the range of 32 bit integer arithmetic but should still
  // be handled correctly.
  var ovfl = Number.MAX_SAFE_INTEGER;
  var readable = stream.Readable({
    highWaterMark: ovfl
  });
  assert.strictEqual(readable._readableState.highWaterMark, ovfl);
  var writable = stream.Writable({
    highWaterMark: ovfl
  });
  assert.strictEqual(writable._writableState.highWaterMark, ovfl);

  var _loop = function (invalidHwm) {
    var _loop2 = function (type) {
      common.expectsError(function () {
        type({
          highWaterMark: invalidHwm
        });
      }, {
        type: TypeError,
        code: 'ERR_INVALID_OPT_VALUE',
        message: "The value \"".concat(invalidHwm, "\" is invalid for option \"highWaterMark\"")
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
}
{
  // This test ensures that the push method's implementation
  // correctly handles the edge case where the highWaterMark and
  // the state.length are both zero
  var _readable = stream.Readable({
    highWaterMark: 0
  });

  for (var i = 0; i < 3; i++) {
    var needMoreData = _readable.push();

    assert.strictEqual(needMoreData, true);
  }
}
{
  // This test ensures that the read(n) method's implementation
  // correctly handles the edge case where the highWaterMark, state.length
  // and n are all zero
  var _readable2 = stream.Readable({
    highWaterMark: 0
  });

  _readable2._read = common.mustCall();

  _readable2.read(0);
}
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});