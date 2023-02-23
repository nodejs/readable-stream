"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const assert = require('assert/');
const _require = require('../../'),
  Readable = _require.Readable,
  Writable = _require.Writable,
  Transform = _require.Transform;
{
  const stream = new Readable({
    objectMode: true,
    read: common.mustCall(() => {
      stream.push(undefined);
      stream.push(null);
    })
  });
  stream.on('data', common.mustCall(chunk => {
    assert.strictEqual(chunk, undefined);
  }));
}
{
  const stream = new Writable({
    objectMode: true,
    write: common.mustCall(chunk => {
      assert.strictEqual(chunk, undefined);
    })
  });
  stream.write(undefined);
}
{
  const stream = new Transform({
    objectMode: true,
    transform: common.mustCall(chunk => {
      stream.push(chunk);
    })
  });
  stream.on('data', common.mustCall(chunk => {
    assert.strictEqual(chunk, undefined);
  }));
  stream.write(undefined);
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