"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const _require = require('../../'),
  Readable = _require.Readable;

// Make sure that readable completes
// even when reading larger buffer.
const bufferSize = 10 * 1024 * 1024;
let n = 0;
const r = new Readable({
  read() {
    // Try to fill readable buffer piece by piece.
    r.push(bufferShim.alloc(bufferSize / 10));
    if (n++ > 10) {
      r.push(null);
    }
  }
});
r.on('readable', () => {
  while (true) {
    const ret = r.read(bufferSize);
    if (ret === null) break;
  }
});
r.on('end', common.mustCall());
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));