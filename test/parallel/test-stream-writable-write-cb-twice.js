"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('../../'),
    Writable = _require.Writable;

{
  // Sync + Sync
  var writable = new Writable({
    write: common.mustCall(function (buf, enc, cb) {
      cb();
      common.expectsError(cb, {
        code: 'ERR_MULTIPLE_CALLBACK',
        type: Error
      });
    })
  });
  writable.write('hi');
}
{
  // Sync + Async
  var _writable = new Writable({
    write: common.mustCall(function (buf, enc, cb) {
      cb();
      process.nextTick(function () {
        common.expectsError(cb, {
          code: 'ERR_MULTIPLE_CALLBACK',
          type: Error
        });
      });
    })
  });

  _writable.write('hi');
}
{
  // Async + Async
  var _writable2 = new Writable({
    write: common.mustCall(function (buf, enc, cb) {
      process.nextTick(cb);
      process.nextTick(function () {
        common.expectsError(cb, {
          code: 'ERR_MULTIPLE_CALLBACK',
          type: Error
        });
      });
    })
  });

  _writable2.write('hi');
}
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});