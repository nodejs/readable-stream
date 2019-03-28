"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common'); // This test ensures that Readable stream will continue to call _read
// for streams with highWaterMark === 0 once the stream returns data
// by calling push() asynchronously.


var _require = require('../../'),
    Readable = _require.Readable;

var count = 5;
var r = new Readable({
  // Called 6 times: First 5 return data, last one signals end of stream.
  read: common.mustCall(function () {
    process.nextTick(common.mustCall(function () {
      if (count--) r.push('a');else r.push(null);
    }));
  }, 6),
  highWaterMark: 0
});
r.on('end', common.mustCall());
r.on('data', common.mustCall(5));
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});