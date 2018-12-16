"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var stream = require('../../');

var writable = new stream.Writable();

writable._write = function (chunk, encoding, cb) {
  // The state finished should start in false.
  assert.strictEqual(writable._writableState.finished, false);
  cb();
};

writable.on('finish', common.mustCall(function () {
  assert.strictEqual(writable._writableState.finished, true);
}));
writable.end('testing finished state', common.mustCall(function () {
  assert.strictEqual(writable._writableState.finished, true);
}));
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});