"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
require('../common');
const _require = require('../../'),
  Readable = _require.Readable;
const assert = require('assert/');
{
  // Call .setEncoding() while there are bytes already in the buffer.
  const r = new Readable({
    read() {}
  });
  r.push(bufferShim.from('a'));
  r.push(bufferShim.from('b'));
  r.setEncoding('utf8');
  const chunks = [];
  r.on('data', chunk => chunks.push(chunk));
  process.nextTick(() => {
    assert.deepStrictEqual(chunks, ['ab']);
  });
}
{
  // Call .setEncoding() while the buffer contains a complete,
  // but chunked character.
  const r = new Readable({
    read() {}
  });
  r.push(bufferShim.from([0xf0]));
  r.push(bufferShim.from([0x9f]));
  r.push(bufferShim.from([0x8e]));
  r.push(bufferShim.from([0x89]));
  r.setEncoding('utf8');
  const chunks = [];
  r.on('data', chunk => chunks.push(chunk));
  process.nextTick(() => {
    assert.deepStrictEqual(chunks, ['🎉']);
  });
}
{
  // Call .setEncoding() while the buffer contains an incomplete character,
  // and finish the character later.
  const r = new Readable({
    read() {}
  });
  r.push(bufferShim.from([0xf0]));
  r.push(bufferShim.from([0x9f]));
  r.setEncoding('utf8');
  r.push(bufferShim.from([0x8e]));
  r.push(bufferShim.from([0x89]));
  const chunks = [];
  r.on('data', chunk => chunks.push(chunk));
  process.nextTick(() => {
    assert.deepStrictEqual(chunks, ['🎉']);
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
_list.forEach(e => process.on('uncaughtException', e));