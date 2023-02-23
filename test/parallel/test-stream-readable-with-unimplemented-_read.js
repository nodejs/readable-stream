"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const _require = require('../../'),
  Readable = _require.Readable;
const readable = new Readable();
readable.on('error', common.expectsError({
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  type: Error,
  message: 'The _read() method is not implemented'
}));
readable.read();
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));