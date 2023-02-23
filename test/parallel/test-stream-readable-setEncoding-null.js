"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

require('../common');
const assert = require('assert/');
const _require = require('../../'),
  Readable = _require.Readable;
{
  const readable = new Readable({
    encoding: 'hex'
  });
  assert.strictEqual(readable._readableState.encoding, 'hex');
  readable.setEncoding(null);
  assert.strictEqual(readable._readableState.encoding, 'utf8');
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