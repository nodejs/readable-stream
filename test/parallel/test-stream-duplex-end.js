"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const assert = require('assert/');
const Duplex = require('../../').Duplex;
{
  const stream = new Duplex({
    read() {}
  });
  assert.strictEqual(stream.allowHalfOpen, true);
  stream.on('finish', common.mustNotCall());
  assert.strictEqual(stream.listenerCount('end'), 0);
  stream.resume();
  stream.push(null);
}
{
  const stream = new Duplex({
    read() {},
    allowHalfOpen: false
  });
  assert.strictEqual(stream.allowHalfOpen, false);
  stream.on('finish', common.mustCall());
  assert.strictEqual(stream.listenerCount('end'), 1);
  stream.resume();
  stream.push(null);
}
{
  const stream = new Duplex({
    read() {},
    allowHalfOpen: false
  });
  assert.strictEqual(stream.allowHalfOpen, false);
  stream._writableState.ended = true;
  stream.on('finish', common.mustNotCall());
  assert.strictEqual(stream.listenerCount('end'), 1);
  stream.resume();
  stream.push(null);
}
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));