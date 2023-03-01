"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var _require = require('../../'),
  Readable = _require.Readable;

// This test ensures that there will not be an additional empty 'readable'
// event when stream has ended (only 1 event signalling about end)

var r = new Readable({
  read: function read() {}
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
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});