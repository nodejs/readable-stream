"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable; // readable.resume() should not lead to a ._read() call being scheduled
// when we exceed the high water mark already.


var readable = new Readable({
  read: common.mustNotCall(),
  highWaterMark: 100
}); // Fill up the internal buffer so that we definitely exceed the HWM:

for (var i = 0; i < 10; i++) {
  readable.push('a'.repeat(200));
} // Call resume, and pause after one chunk.
// The .pause() is just so that we don’t empty the buffer fully, which would
// be a valid reason to call ._read().


readable.resume();
readable.once('data', common.mustCall(function () {
  return readable.pause();
}));
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