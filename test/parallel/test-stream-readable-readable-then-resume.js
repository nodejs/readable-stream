"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var _require = require('../../'),
  Readable = _require.Readable;

// This test verifies that a stream could be resumed after
// removing the readable event in the same tick

check(new Readable({
  objectMode: true,
  highWaterMark: 1,
  read: function read() {
    if (!this.first) {
      this.push('hello');
      this.first = true;
      return;
    }
    this.push(null);
  }
}));
function check(s) {
  var readableListener = common.mustNotCall();
  s.on('readable', readableListener);
  s.on('end', common.mustCall());
  s.removeListener('readable', readableListener);
  s.resume();
}
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