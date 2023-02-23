"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');

// This test ensures that Readable stream will continue to call _read
// for streams with highWaterMark === 0 once the stream returns data
// by calling push() asynchronously.

const _require = require('../../'),
  Readable = _require.Readable;
let count = 5;
const r = new Readable({
  // Called 6 times: First 5 return data, last one signals end of stream.
  read: common.mustCall(() => {
    process.nextTick(common.mustCall(() => {
      if (count--) r.push('a');else r.push(null);
    }));
  }, 6),
  highWaterMark: 0
});
r.on('end', common.mustCall());
r.on('data', common.mustCall(5));
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));