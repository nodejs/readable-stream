"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const _require = require('../../'),
  Readable = _require.Readable;

// This test verifies that a stream could be resumed after
// removing the readable event in the same tick

check(new Readable({
  objectMode: true,
  highWaterMark: 1,
  read() {
    if (!this.first) {
      this.push('hello');
      this.first = true;
      return;
    }
    this.push(null);
  }
}));
function check(s) {
  const readableListener = common.mustNotCall();
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
_list.forEach(e => process.on('uncaughtException', e));