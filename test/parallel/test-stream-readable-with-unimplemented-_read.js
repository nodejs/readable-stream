'use strict';

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable;

var readable = new Readable();

readable.on('error', common.expectsError({
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  type: Error,
  message: 'The _read() method is not implemented'
}));

readable.read();
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});