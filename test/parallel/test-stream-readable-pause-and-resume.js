'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var _require = require('../../'),
    Readable = _require.Readable;

var common = require('../common');

var ticks = 18;
var expectedData = 19;

var rs = new Readable({
  objectMode: true,
  read: function () {
    if (ticks-- > 0) return process.nextTick(function () {
      return rs.push({});
    });
    rs.push({});
    rs.push(null);
  }
});

rs.on('end', common.mustCall());
readAndPause();

function readAndPause() {
  // Does a on(data) -> pause -> wait -> resume -> on(data) ... loop.
  // Expects on(data) to never fire if the stream is paused.
  var ondata = common.mustCall(function (data) {
    rs.pause();

    expectedData--;
    if (expectedData <= 0) return;

    (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
      rs.removeListener('data', ondata);
      readAndPause();
      rs.resume();
    });
  }, 1); // only call ondata once

  rs.on('data', ondata);
}
;require('tap').pass('sync run');