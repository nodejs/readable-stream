"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var stream = require('../../');

var r = new stream.Readable({
  read: function read() {}
}); // readableListening state should start in `false`.

assert.strictEqual(r._readableState.readableListening, false);
r.on('readable', common.mustCall(function () {
  // Inside the readable event this state should be true.
  assert.strictEqual(r._readableState.readableListening, true);
}));
r.push(bufferShim.from('Testing readableListening state'));
var r2 = new stream.Readable({
  read: function read() {}
}); // readableListening state should start in `false`.

assert.strictEqual(r2._readableState.readableListening, false);
r2.on('data', common.mustCall(function (chunk) {
  // readableListening should be false because we don't have
  // a `readable` listener
  assert.strictEqual(r2._readableState.readableListening, false);
}));
r2.push(bufferShim.from('Testing readableListening state'));
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