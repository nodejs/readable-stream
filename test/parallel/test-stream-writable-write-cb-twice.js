"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const _require = require('../../'),
  Writable = _require.Writable;
{
  // Sync + Sync
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
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
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb();
      process.nextTick(() => {
        common.expectsError(cb, {
          code: 'ERR_MULTIPLE_CALLBACK',
          type: Error
        });
      });
    })
  });
  writable.write('hi');
}
{
  // Async + Async
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      process.nextTick(cb);
      process.nextTick(() => {
        common.expectsError(cb, {
          code: 'ERR_MULTIPLE_CALLBACK',
          type: Error
        });
      });
    })
  });
  writable.write('hi');
}
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));