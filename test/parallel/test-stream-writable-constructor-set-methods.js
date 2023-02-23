"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const _require = require('assert/'),
  strictEqual = _require.strictEqual;
const _require2 = require('../../'),
  Writable = _require2.Writable;
const w = new Writable();
w.on('error', common.expectsError({
  type: Error,
  code: 'ERR_METHOD_NOT_IMPLEMENTED',
  message: 'The _write() method is not implemented'
}));
w.end(bufferShim.from('blerg'));
const _write = common.mustCall((chunk, _, next) => {
  next();
});
const _writev = common.mustCall((chunks, next) => {
  strictEqual(chunks.length, 2);
  next();
});
const w2 = new Writable({
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
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));