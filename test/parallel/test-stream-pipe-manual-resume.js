"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var stream = require('../../');
function test(throwCodeInbetween) {
  // Check that a pipe does not stall if .read() is called unexpectedly
  // (i.e. the stream is not resumed by the pipe).

  var n = 1000;
  var counter = n;
  var rs = stream.Readable({
    objectMode: true,
    read: common.mustCallAtLeast(function () {
      if (--counter >= 0) rs.push({
        counter: counter
      });else rs.push(null);
    }, n)
  });
  var ws = stream.Writable({
    objectMode: true,
    write: common.mustCall(function (data, enc, cb) {
      setImmediate(cb);
    }, n)
  });
  setImmediate(function () {
    return throwCodeInbetween(rs, ws);
  });
  rs.pipe(ws);
}
test(function (rs) {
  return rs.read();
});
test(function (rs) {
  return rs.resume();
});
test(function () {
  return 0;
});
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