"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const stream = require('../../');
const reader = new stream.Readable();
const writer1 = new stream.Writable();
const writer2 = new stream.Writable();

// 560000 is chosen here because it is larger than the (default) highWaterMark
// and will cause `.write()` to return false
// See: https://github.com/nodejs/node/issues/2323
const buffer = bufferShim.allocUnsafe(560000);
reader._read = () => {};
writer1._write = common.mustCall(function (chunk, encoding, cb) {
  this.emit('chunk-received');
  cb();
}, 1);
writer1.once('chunk-received', function () {
  reader.unpipe(writer1);
  reader.pipe(writer2);
  reader.push(buffer);
  setImmediate(function () {
    reader.push(buffer);
    setImmediate(function () {
      reader.push(buffer);
    });
  });
});
writer2._write = common.mustCall(function (chunk, encoding, cb) {
  cb();
}, 3);
reader.pipe(writer1);
reader.push(buffer);
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));