"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var assert = require('assert/');
var _require = require('../../'),
  Readable = _require.Readable;
var rs = new Readable({
  read: function read() {}
});
var closed = false;
var errored = false;
rs.on('close', common.mustCall(function () {
  closed = true;
  assert(errored);
}));
rs.on('error', common.mustCall(function (err) {
  errored = true;
  assert(!closed);
}));
rs.destroy(new Error('kaboom'));
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});