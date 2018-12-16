"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('assert/'),
    strictEqual = _require.strictEqual;

var _require2 = require('../../'),
    Writable = _require2.Writable;

var w = new Writable();
w.on('error', common.expectsError({
  type: Error,
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  message: 'The _write() method is not implemented'
}));
w.end(bufferShim.from('blerg'));

var _write = common.mustCall(function (chunk, _, next) {
  next();
});

var _writev = common.mustCall(function (chunks, next) {
  strictEqual(chunks.length, 2);
  next();
});

var w2 = new Writable({
  write: _write,
  writev: _writev
});
strictEqual(w2._write, _write);
strictEqual(w2._writev, _writev);
w2.write(bufferShim.from('blerg'));
w2.cork();
w2.write(bufferShim.from('blerg'));
w2.write(bufferShim.from('blerg'));
w2.end();
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});