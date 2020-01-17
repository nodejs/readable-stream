"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable;

var buf = bufferShim.alloc(8192);
var readable = new Readable({
  read: common.mustCall(function () {
    this.push(buf);
  }, 31)
});
var i = 0;
readable.on('readable', common.mustCall(function () {
  if (i++ === 10) {
    // We will just terminate now.
    process.removeAllListeners('readable');
    return;
  }

  var data = readable.read(); // TODO(mcollina): there is something odd in the highWaterMark logic
  // investigate.

  if (i === 1) {
    assert.strictEqual(data.length, 8192 * 2);
  } else {
    assert.strictEqual(data.length, 8192 * 3);
  }
}, 11));
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