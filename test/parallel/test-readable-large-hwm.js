"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var _require = require('../../'),
  Readable = _require.Readable;

// Make sure that readable completes
// even when reading larger buffer.
var bufferSize = 10 * 1024 * 1024;
var n = 0;
var r = new Readable({
  read: function read() {
    // Try to fill readable buffer piece by piece.
    r.push(bufferShim.alloc(bufferSize / 10));
    if (n++ > 10) {
      r.push(null);
    }
  }
});
r.on('readable', function () {
  while (true) {
    var ret = r.read(bufferSize);
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
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});