"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable,
    Writable = _require.Writable,
    Transform = _require.Transform;

{
  var stream = new Readable({
    objectMode: true,
    read: common.mustCall(function () {
      stream.push(undefined);
      stream.push(null);
    })
  });
  stream.on('data', common.mustCall(function (chunk) {
    assert.strictEqual(chunk, undefined);
  }));
}
{
  var _stream = new Writable({
    objectMode: true,
    write: common.mustCall(function (chunk) {
      assert.strictEqual(chunk, undefined);
    })
  });

  _stream.write(undefined);
}
{
  var _stream2 = new Transform({
    objectMode: true,
    transform: common.mustCall(function (chunk) {
      _stream2.push(chunk);
    })
  });

  _stream2.on('data', common.mustCall(function (chunk) {
    assert.strictEqual(chunk, undefined);
  }));

  _stream2.write(undefined);
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