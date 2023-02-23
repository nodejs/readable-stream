"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const _require = require('../../'),
  Readable = _require.Readable;

// This test ensures that there will not be an additional empty 'readable'
// event when stream has ended (only 1 event signalling about end)

const r = new Readable({
  read: () => {}
});
r.push(null);
r.on('readable', common.mustCall());
r.on('end', common.mustCall());
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));