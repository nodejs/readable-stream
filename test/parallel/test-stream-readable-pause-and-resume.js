"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var _require = require('../../'),
    Readable = _require.Readable;

var common = require('../common');

var ticks = 18;
var expectedData = 19;
var rs = new Readable({
  objectMode: true,
  read: function read() {
    if (ticks-- > 0) return process.nextTick(function () {
      return rs.push({});
    });
    rs.push({});
    rs.push(null);
  }
});
rs.on('end', common.mustCall());
readAndPause();

function readAndPause() {
  // Does a on(data) -> pause -> wait -> resume -> on(data) ... loop.
  // Expects on(data) to never fire if the stream is paused.
  var ondata = common.mustCall(function (data) {
    rs.pause();
    expectedData--;
    if (expectedData <= 0) return;
    setImmediate(function () {
      rs.removeListener('data', ondata);
      readAndPause();
      rs.resume();
    });
  }, 1); // only call ondata once

  rs.on('data', ondata);
}

;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});