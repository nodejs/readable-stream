"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const _require = require('../../'),
  Transform = _require.Transform;
const stream = new Transform({
  transform(chunk, enc, cb) {
    cb();
    cb();
  }
});
stream.on('error', common.expectsError({
  type: Error,
  message: 'Callback called multiple times',
  code: 'ERR_MULTIPLE_CALLBACK'
}));
stream.write('foo');
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));