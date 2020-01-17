"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


require('../common');

var _require = require('../../'),
    Readable = _require.Readable;

var assert = require('assert/');

{
  // Call .setEncoding() while there are bytes already in the buffer.
  var r = new Readable({
    read: function read() {}
  });
  r.push(bufferShim.from('a'));
  r.push(bufferShim.from('b'));
  r.setEncoding('utf8');
  var chunks = [];
  r.on('data', function (chunk) {
    return chunks.push(chunk);
  });
  process.nextTick(function () {
    assert.deepStrictEqual(chunks, ['ab']);
  });
}
{
  // Call .setEncoding() while the buffer contains a complete,
  // but chunked character.
  var _r = new Readable({
    read: function read() {}
  });

  _r.push(bufferShim.from([0xf0]));

  _r.push(bufferShim.from([0x9f]));

  _r.push(bufferShim.from([0x8e]));

  _r.push(bufferShim.from([0x89]));

  _r.setEncoding('utf8');

  var _chunks = [];

  _r.on('data', function (chunk) {
    return _chunks.push(chunk);
  });

  process.nextTick(function () {
    assert.deepStrictEqual(_chunks, ['🎉']);
  });
}
{
  // Call .setEncoding() while the buffer contains an incomplete character,
  // and finish the character later.
  var _r2 = new Readable({
    read: function read() {}
  });

  _r2.push(bufferShim.from([0xf0]));

  _r2.push(bufferShim.from([0x9f]));

  _r2.setEncoding('utf8');

  _r2.push(bufferShim.from([0x8e]));

  _r2.push(bufferShim.from([0x89]));

  var _chunks2 = [];

  _r2.on('data', function (chunk) {
    return _chunks2.push(chunk);
  });

  process.nextTick(function () {
    assert.deepStrictEqual(_chunks2, ['🎉']);
  });
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