"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable,
    Writable = _require.Writable;

var ABC = new Uint8Array([0x41, 0x42, 0x43]);
var DEF = new Uint8Array([0x44, 0x45, 0x46]);
var GHI = new Uint8Array([0x47, 0x48, 0x49]);
{
  // Simple Writable test.
  var n = 0;
  var writable = new Writable({
    write: common.mustCall(function (chunk, encoding, cb) {
      assert(chunk instanceof Buffer);

      if (n++ === 0) {
        assert.strictEqual(String(chunk), 'ABC');
      } else {
        assert.strictEqual(String(chunk), 'DEF');
      }

      cb();
    }, 2)
  });
  writable.write(ABC);
  writable.end(DEF);
}
{
  // Writable test, pass in Uint8Array in object mode.
  var _writable = new Writable({
    objectMode: true,
    write: common.mustCall(function (chunk, encoding, cb) {
      assert(!(chunk instanceof Buffer));
      assert(chunk instanceof Uint8Array);
      assert.strictEqual(chunk, ABC);
      assert.strictEqual(encoding, 'utf8');
      cb();
    })
  });

  _writable.end(ABC);
}
{
  // Writable test, multiple writes carried out via writev.
  var callback;

  var _writable2 = new Writable({
    write: common.mustCall(function (chunk, encoding, cb) {
      assert(chunk instanceof Buffer);
      assert.strictEqual(encoding, 'buffer');
      assert.strictEqual(String(chunk), 'ABC');
      callback = cb;
    }),
    writev: common.mustCall(function (chunks, cb) {
      assert.strictEqual(chunks.length, 2);
      assert.strictEqual(chunks[0].encoding, 'buffer');
      assert.strictEqual(chunks[1].encoding, 'buffer');
      assert.strictEqual(chunks[0].chunk + chunks[1].chunk, 'DEFGHI');
    })
  });

  _writable2.write(ABC);

  _writable2.write(DEF);

  _writable2.end(GHI);

  callback();
}
{
  // Simple Readable test.
  var readable = new Readable({
    read: function read() {}
  });
  readable.push(DEF);
  readable.unshift(ABC);
  var buf = readable.read();
  assert(buf instanceof Buffer);
  assert.deepStrictEqual(_toConsumableArray(buf), [].concat(_toConsumableArray(ABC), _toConsumableArray(DEF)));
}
{
  // Readable test, setEncoding.
  var _readable = new Readable({
    read: function read() {}
  });

  _readable.setEncoding('utf8');

  _readable.push(DEF);

  _readable.unshift(ABC);

  var out = _readable.read();

  assert.strictEqual(out, 'ABCDEF');
}
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});