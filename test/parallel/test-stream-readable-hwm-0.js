"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common'); // This test ensures that Readable stream will call _read() for streams
// with highWaterMark === 0 upon .read(0) instead of just trying to
// emit 'readable' event.


var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable;

var r = new Readable({
  // must be called only once upon setting 'readable' listener
  read: common.mustCall(),
  highWaterMark: 0
});
var pushedNull = false; // this will trigger read(0) but must only be called after push(null)
// because the we haven't pushed any data

r.on('readable', common.mustCall(function () {
  assert.strictEqual(r.read(), null);
  assert.strictEqual(pushedNull, true);
}));
r.on('end', common.mustCall());
process.nextTick(function () {
  assert.strictEqual(r.read(), null);
  pushedNull = true;
  r.push(null);
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