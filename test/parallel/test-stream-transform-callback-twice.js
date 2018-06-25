'use strict';

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

var _require = require('../../'),
    Transform = _require.Transform;

var stream = new Transform({
  transform: function (chunk, enc, cb) {
    cb();cb();
  }
});

stream.on('error', common.expectsError({
  type: Error,
  message: 'Callback called multiple times',
  code: 'ERR_MULTIPLE_CALLBACK'
}));

stream.write('foo');
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});