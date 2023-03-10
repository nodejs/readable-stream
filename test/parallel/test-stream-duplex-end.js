"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var assert = require('assert/');
var Duplex = require('../../').Duplex;
{
  var stream = new Duplex({
    read: function read() {}
  });
  assert.strictEqual(stream.allowHalfOpen, true);
  stream.on('finish', common.mustNotCall());
  assert.strictEqual(stream.listenerCount('end'), 0);
  stream.resume();
  stream.push(null);
}
{
  var _stream = new Duplex({
    read: function read() {},
    allowHalfOpen: false
  });
  assert.strictEqual(_stream.allowHalfOpen, false);
  _stream.on('finish', common.mustCall());
  assert.strictEqual(_stream.listenerCount('end'), 1);
  _stream.resume();
  _stream.push(null);
}
{
  var _stream2 = new Duplex({
    read: function read() {},
    allowHalfOpen: false
  });
  assert.strictEqual(_stream2.allowHalfOpen, false);
  _stream2._writableState.ended = true;
  _stream2.on('finish', common.mustNotCall());
  assert.strictEqual(_stream2.listenerCount('end'), 1);
  _stream2.resume();
  _stream2.push(null);
}
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