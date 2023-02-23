"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
require('../common');
const Readable = require('../../lib/_stream_readable');
const assert = require('assert/');
let buf = '';
const euro = bufferShim.from([0xE2, 0x82, 0xAC]);
const cent = bufferShim.from([0xC2, 0xA2]);
const source = Buffer.concat([euro, cent]);
const readable = Readable({
  encoding: 'utf8'
});
readable.push(source.slice(0, 2));
readable.push(source.slice(2, 4));
readable.push(source.slice(4, source.length));
;
readable.push(null);
readable.on('data', function (data) {
  buf += data;
});
process.on('exit', function () {
  assert.strictEqual(buf, '€¢');
});
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));