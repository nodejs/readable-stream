"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var assert = require('assert/');
var _require = require('../../'),
  Readable = _require.Readable,
  Writable = _require.Writable;

// This test ensures that if have 'readable' listener
// on Readable instance it will not disrupt the pipe.

{
  var receivedData = '';
  var w = new Writable({
    write: function write(chunk, env, callback) {
      receivedData += chunk;
      callback();
    }
  });
  var data = ['foo', 'bar', 'baz'];
  var r = new Readable({
    read: function read() {}
  });
  r.once('readable', common.mustCall());
  r.pipe(w);
  r.push(data[0]);
  r.push(data[1]);
  r.push(data[2]);
  r.push(null);
  w.on('finish', common.mustCall(function () {
    assert.strictEqual(receivedData, data.join(''));
  }));
}
{
  var _receivedData = '';
  var _w = new Writable({
    write: function write(chunk, env, callback) {
      _receivedData += chunk;
      callback();
    }
  });
  var _data = ['foo', 'bar', 'baz'];
  var _r = new Readable({
    read: function read() {}
  });
  _r.pipe(_w);
  _r.push(_data[0]);
  _r.push(_data[1]);
  _r.push(_data[2]);
  _r.push(null);
  _r.once('readable', common.mustCall());
  _w.on('finish', common.mustCall(function () {
    assert.strictEqual(_receivedData, _data.join(''));
  }));
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